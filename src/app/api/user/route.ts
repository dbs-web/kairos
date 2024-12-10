import { NextResponse } from 'next/server';
import { User } from '@/models';
import { dbConnect } from '@/lib/dbConnect';

export async function GET(request: Request) {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json({ data: users });
}
