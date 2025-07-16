import { NextResponse } from 'next/server';
import { getPaginatedLogsUseCase } from '@/use-cases/ApiLogUseCases';

export async function GET() {
    try {
        const [logs] = await getPaginatedLogsUseCase.execute({
            search: 'heygen',
            skip: 0,
            limit: 50,
        });

        return NextResponse.json({
            logs: logs.map(log => ({
                id: log.id,
                route: log.route,
                body: log.body,
                error: log.error,
                responseCode: log.responseCode,
                time: log.time
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}