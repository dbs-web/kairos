import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// Entities
import { Status } from '@/domain/entities/status';
import { HeyGenStatus } from '@/domain/entities/video';
import { UserRoles } from '@/domain/entities/user';

// Use Cases
import { getBriefingsUseCase, updateBriefingUseCase } from '@/use-cases/BriefingUseCases';
import { getUsersUseCase } from '@/use-cases/UserUseCases';
import { createVideoUseCase } from '@/use-cases/VideoUseCases';
import { withAuthorization } from '@/adapters/withAuthorization';
import { generateVideoUseCase } from '@/use-cases/HeyGen';
import { checkContentUseCase } from '@/use-cases/DifyUseCases';

export const POST = withAuthorization(
    [UserRoles.USER, UserRoles.ADMIN],
    async (request, { id: userId }) => {
        const { avatar, width, height, briefing } = await request.json();

        if (!avatar || !width || !height || !briefing) {
            return NextResponse.json(
                { status: 400, message: 'Parâmetros inválidos' },
                { status: 400 },
            );
        }

        try {
            const user = await getUsersUseCase.byId(userId);
            const brief = await getBriefingsUseCase.byId({ id: briefing, userId });

            const userVoiceId = user.voiceId;

            if (!userVoiceId) {
                return NextResponse.json(
                    { status: 400, message: 'Usuário não possui voice_id cadastrado' },
                    { status: 400 },
                );
            }

            const heygenVideoId = await generateVideoUseCase.execute({
                avatarId: avatar,
                text: brief.text as string,
                voiceId: userVoiceId,
                width,
                height,
            });

            // Create video entry on db
            await createVideoUseCase.execute({
                userId,
                title: brief.title,
                legenda: '',
                transcription: brief.text ?? '',
                heygenVideoId: heygenVideoId,
                width,
                height,
            });

            // Create briefings if create video use case was successfull
            await updateBriefingUseCase.execute({
                id: briefing,
                userId,
                data: { status: Status.APROVADO },
            });

            return NextResponse.json(
                {
                    message: 'Briefing aprovado e vídeo em produção com sucesso!',
                    status: 200,
                },
                { status: 200 },
            );
        } catch (error) {
            return NextResponse.json(
                { status: 500, message: 'Erro interno ao criar o vídeo' },
                { status: 500 },
            );
        }
    },
);
