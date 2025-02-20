import { NextResponse } from 'next/server';

const API_SECRET = process.env.API_SECRET ?? '';

export function withExternalRequestValidation(handler: (request: Request) => Promise<Response>) {
    return async (request: Request) => {
        if (!API_SECRET) throw new Error('API SECRET IS NOT SET');
        const headers = request.headers;
        
        const secret = headers.get('x-api-key');

        if (secret !== API_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return handler(request);
    };
}
