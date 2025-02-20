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

const HEYGEN_API_URL = process.env.HEYGEN_API_URL ?? '';
const CALLBACK_URL = process.env.HEYGEN_CALLBACK_URL ?? '';

export const POST = withAuthorization(
    [UserRoles.USER, UserRoles.ADMIN],
    async (request, { id: userId }) => {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user?.id) {
            return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
        }

        const { avatar, width, height, briefing } = await request.json();

        const user = await getUsersUseCase.byId(userId);
        const brief = await getBriefingsUseCase.byId({ id: briefing, userId });

        if (!brief) {
            return NextResponse.json(
                { status: 404, message: 'Briefing não encontrado' },
                { status: 404 },
            );
        }

        if (!user) {
            return NextResponse.json(
                { status: 404, message: 'User não encontrado para o briefing' },
                { status: 404 },
            );
        }

        const userVoiceId = user.voiceId;

        if (!userVoiceId) {
            return NextResponse.json(
                { status: 400, message: 'Usuário não possui voice_id cadastrado' },
                { status: 400 },
            );
        }

        const payload = {
            avatar_id: avatar,
            text: brief.text,
            voice_id: userVoiceId,
            callback_url: CALLBACK_URL,
            width,
            height,
            HeyGenStatus: HeyGenStatus.PROCESSING,
        };

        try {
            const res = await fetch(HEYGEN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const responseData = await res.json();
                const heygenVideoId = responseData.data.video_id;

                if (!heygenVideoId) {
                    return NextResponse.json(
                        { status: 500, message: 'Resposta inválida da API do HeyGen' },
                        { status: 500 },
                    );
                }

                await createVideoUseCase.execute({
                    userId: session.user.id,
                    title: brief.title,
                    legenda: '',
                    transcription: brief.text ?? '',
                    heygenVideoId: heygenVideoId,
                    heygenStatus: HeyGenStatus.PROCESSING,
                    width,
                    height,
                });

                await updateBriefingUseCase.execute({
                    id: briefing,
                    userId: user.id,
                    data: { status: Status.APROVADO },
                });
            } else {
                let errorMessage = 'Erro ao criar o vídeo';
                try {
                    const errorData = await res.json();
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch (e) {
                    // Ignore parse cases
                }

                return NextResponse.json({ status: 500, message: errorMessage }, { status: 500 });
            }

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
