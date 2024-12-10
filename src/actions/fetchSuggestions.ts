'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/dbConnect';
import Suggestion from '@/models/Suggestion';

export async function fetchSuggestions() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        throw new Error('Usuário não autenticado.');
    }
    await dbConnect();

    const suggestions = await Suggestion.find({ user: session.user.id }).exec();

    return suggestions;
}
