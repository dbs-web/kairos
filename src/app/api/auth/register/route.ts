import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { data } = await request.json();

    if (!data.password) {
        return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = prisma.user.create({
        ...data,
        password: hashedPassword,
        role: 'user',
    });

    return NextResponse.json({ message: 'User created successfully!' });
}
