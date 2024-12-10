import { NextResponse } from "next/server";
import {User} from "@/models"
import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    
    const { data } = await request.json();

    if (!data.password) {
        return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10); 

    const user = new User({
        ...data,
        password: hashedPassword,
        role: "admin",
    });

    await user.save();

    return NextResponse.json({ message: 'User created successfully!' });
}

export async function GET(request: Request){
    await dbConnect()

    const users = await User.find()

    return NextResponse.json({data: users})
}