import { withAuthorization } from '@/adapters/withAuthorization';
import { UserRoles } from '@/domain/entities/user';
import { createUserUseCase } from '@/use-cases/UserUseCases';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const POST = withAuthorization([UserRoles.ADMIN], async (request) => {
    const { data } = await request.json();

    if (!data.password) {
        return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await createUserUseCase.execute({
        ...data,
        password: hashedPassword,
        role: UserRoles.USER,
    });

    return NextResponse.json({ message: 'User created successfully!' });
});
