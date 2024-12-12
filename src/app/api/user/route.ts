import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { User } from '@/models';
import { dbConnect } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ajuste o caminho conforme seu projeto

interface Query {
    [key: string]: string;
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }
    await dbConnect();

    const url = new URL(request.url);
    const filterBy = url.searchParams.get('filterBy');
    const filterValue = url.searchParams.get('filterValue');

    const query: Query = {};

    if (filterBy && filterValue) {
        query[filterBy] = filterValue;
    }

    const users = await User.find(query);

    return NextResponse.json({ data: users });
}

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const body = await request.json();
    const passHash = await bcrypt.hash(body.password, 10);
    body.password = passHash;

    const newUser = await User.create(body);
    return NextResponse.json({ data: newUser });
}

export async function PUT(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const body = await request.json();
    const updatedUser = await User.findByIdAndUpdate(body._id, body, { new: true });
    return NextResponse.json({ data: updatedUser });
}

export async function DELETE(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'admin') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const body = await request.json();
    const { _id } = body;

    await User.findByIdAndDelete(_id);
    return NextResponse.json({ message: 'User deleted successfully' });
}
