import { dbConnect } from "@/lib/dbConnect";
import { News } from "@/models";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    await dbConnect()
    const {data} = await request.json()

    News.insertMany(data)

    return NextResponse.json({message: "News created successfully!"})

}

export async function GET(request:Request){
    await dbConnect()
    const news = await News.find()

    return NextResponse.json({data: news})
}