import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const url = new URL(request.url);
    const filterBy = url.searchParams.get('filterBy');
    const filterValue = url.searchParams.get('filterValue');

    const where = filterBy && filterValue ? { [filterBy]: filterValue } : {};

    const users = await prisma.user.findMany({
        where,
    });

    return NextResponse.json({ data: users });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const { name, email, password, avatarGroupId } = await request.json();
    const passHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: passHash,
            role: 'USER',
            avatarGroupId: avatarGroupId,
        },
    });

    return NextResponse.json({ data: newUser });
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const body = await request.json();

    const updatedUser = await prisma.user.update({
        where: { id: Number(body.id) },
        data: {
            name: body.name,
            email: body.email,
            role: body.role,
            avatarGroupId: body.avatarGroupId,
            ...(body.password && {
                password: await bcrypt.hash(body.password, 10),
            }),
        },
    });

    return NextResponse.json({ data: updatedUser });
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const body = await request.json();
    const { id } = body;

    await prisma.user.delete({
        where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
}
