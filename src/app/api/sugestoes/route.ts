import { NextResponse } from 'next/server'
import { Sugestao } from '@/models';
import { dbConnect } from '@/lib/dbConnect';

interface ISugestao{
    title: string,
    briefing: string,
    user: string,
    status: string
}

export async function POST(request: Request){    
    try{
        const {data} = await request.json()
        await Sugestao.insertMany(data)
    }catch(e){
        return NextResponse.json({status: 500, message: e})
    }

    return NextResponse.json({message: "Sugestao created successfully!"})
}

export async function GET(request: Request){
    const sugestoes:ISugestao[] = await Sugestao.find()

    return NextResponse.json({data: sugestoes})
}
