import { NextResponse } from "next/server";
import {User} from "@/models"

export async function POST(request: Request) {

    const {data} = await request.json()
    
    const user = new User({...data, role: "user"})

    await user.save()

    return NextResponse.json({message: 'user created successfully!'})
}

export async function GET(request: Request){
    const users = await User.find()

    return NextResponse.json({data: users})
}