import { NextResponse } from 'next/server';

// Entities
import { UserRoles } from '@/domain/entities/user';

// Use cases
import { getUsersUseCase } from '@/use-cases/UserUseCases';

// Adapters
import { withAuthorization } from '@/adapters/withAuthorization';

const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY ?? '';

export const GET = withAuthorization([UserRoles.USER], async (request, user) => {
    const { searchParams } = new URL(request.url);
    const queryGroupId = searchParams.get('groupId');

    let groupIdToFetch: string | undefined = undefined;

    if (user.role === 'ADMIN' && queryGroupId) {
        groupIdToFetch = queryGroupId;
    } else {
        const userData = await getUsersUseCase.byId(user.id);

        if (!userData) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }
        groupIdToFetch = userData.avatarGroupId;
    }

    if (!groupIdToFetch) {
        return NextResponse.json({ status: 400, message: 'No groupId found' });
    }

    const heygenRes = await fetch(
        `https://api.heygen.com/v2/avatar_group/${groupIdToFetch}/avatars`,
        {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': HEYGEN_API_KEY,
            },
        },
    );

    if (!heygenRes.ok) {
        return NextResponse.json({ status: 404, message: 'Avatars not found' });
    }

    const data = await heygenRes.json();

    return NextResponse.json(data);
});
