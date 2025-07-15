import { NextResponse } from 'next/server';

const API_SECRET = process.env.API_SECRET ?? '';

export function withExternalRequestValidation(handler: (request: Request) => Promise<Response>) {
    return async (request: Request) => {
        console.log('=== withExternalRequestValidation - Start ===');
        if (!API_SECRET) throw new Error('API SECRET IS NOT SET');
        const headers = request.headers;

        const secret = headers.get('x-api-key');
        console.log('=== API Secret check - Received:', secret ? 'Present' : 'Missing');
        console.log('=== API Secret check - Expected:', API_SECRET ? 'Present' : 'Missing');
        
        if (secret !== API_SECRET) {
            console.log('=== API Secret check - FAILED ===');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('=== API Secret check - PASSED ===');
        return handler(request);
    };
}
