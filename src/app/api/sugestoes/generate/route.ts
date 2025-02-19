import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// UseCases
import { getUserDifyAgentUseCase } from '@/use-cases/UserUseCases';
import { generateNewSuggestionUseCase } from '@/use-cases/DifyUseCases';
import { withAuthorization } from '@/adapters/withAuthorization';

export const POST = withAuthorization([UserRoles.USER], async (request, user) => {
    const difyAgentToken = await getUserDifyAgentUseCase.execute({ userId: user.id });

    if (difyAgentToken) {
        await generateNewSuggestionUseCase.execute({ difyAgentToken });
    } else {
        return NextResponse.json({
            error: 'User difyAgentToken is missing.',
            status: 500,
        });
    }

    return NextResponse.json({
        message: `Seu conteúdo está sendo gerado, em breve ele estará disponível aqui.`,
        status: 200,
    });
});
