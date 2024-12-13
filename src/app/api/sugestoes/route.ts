import { ISuggestion } from './../../../types/suggestion';
import { NextResponse } from 'next/server';
import { Suggestion } from '@/models';
import { dbConnect } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseDateStringDate } from '@/lib/date';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { data } = await request.json();
        data.map(async (suggestion: ISuggestion) => {
            //@ts-expect-error
            suggestion.date = parseDateStringDate(suggestion.date);

            await Suggestion.create(suggestion);
        });
    } catch (e) {
        return NextResponse.json({ status: 500, message: e });
    }

    return NextResponse.json({ message: 'Suggestion created successfully!' });
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const suggestions = await Suggestion.find({ user: session.user.id });

    return NextResponse.json({ data: suggestions });
}
