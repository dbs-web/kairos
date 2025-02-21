import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// Entities
import { IUser, UserRoles } from '@/domain/entities/user';

// Use Cases
import {
    createUserUseCase,
    deleteUserUseCase,
    getUsersUseCase,
    updateUserUseCase,
} from '@/use-cases/UserUseCases';

import { Session, withAuthorization } from '@/adapters/withAuthorization';
import { Pagination, withPagination } from '@/adapters/withPagination';

const getUsersHandler = async (request: Request, user: Session, pagination: Pagination) => {
    const users = await getUsersUseCase.all();
    return NextResponse.json({ data: users });
};

export const GET = withAuthorization([UserRoles.ADMIN], async (request, user) => {
    return withPagination((req, pagination) => getUsersHandler(req, user, pagination))(request);
});

export const POST = withAuthorization([UserRoles.ADMIN], async (request: Request) => {
    const { name, email, password, avatarGroupId, voiceId, difyAgent, difyContentCreation } =
        await request.json();
    const passHash = await bcrypt.hash(password, 10);

    const newUser = await createUserUseCase.execute({
        name,
        email,
        password: passHash,
        role: UserRoles.USER,
        avatarGroupId,
        voiceId,
        difyAgent,
        difyContentCreation,
    });

    return NextResponse.json({ data: newUser });
});

export const PUT = withAuthorization([UserRoles.ADMIN], async (request: Request) => {
    const body = await request.json();

    const updatedUser = await updateUserUseCase.execute({
        id: Number(body.id),
        data: {
            name: body.name,
            email: body.email,
            role: body.role,
            avatarGroupId: body.avatarGroupId,
            voiceId: body.voiceId,
            difyAgent: body.difyAgent,
            ...(body.password && {
                password: await bcrypt.hash(body.password, 10),
            }),
        },
    });

    return NextResponse.json({ data: updatedUser });
});

export const DELETE = withAuthorization([UserRoles.ADMIN], async (request: Request) => {
    const body = await request.json();
    const { id } = body;

    const deletedUser = await deleteUserUseCase.execute({ id: Number(id) });

    if (!deletedUser) {
        return NextResponse.json({ message: 'User not found', status: 400 });
    }

    return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
});
