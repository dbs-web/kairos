import { NextResponse } from 'next/server'
import { Suggestion } from '@/models';
import { dbConnect } from '@/lib/dbConnect';

interface ISuggestion{
    title: string,
    briefing: string,
    user: string,
    status: string
}

export async function POST(request: Request){    
    await dbConnect()
    try{
        const {data} = await request.json()
        await Suggestion.insertMany(data)
    }catch(e){
        return NextResponse.json({status: 500, message: e})
    }

    return NextResponse.json({message: "Suggestion created successfully!"})
}

export async function GET(request: Request){
    await dbConnect()
    const sugestoes:ISuggestion[] = await Suggestion.find()

    return NextResponse.json({data: sugestoes})
}
