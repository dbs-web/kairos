import { IApiLog } from '@/domain/entities/api-log';
import { IApiLogService } from '@/services/ApiLogService';
import { NextResponse } from 'next/server';

interface ApiResponseParams extends Partial<IApiLog> {
    route: string;
    body: {} | JSON;
    responseCode?: number;
    message?: string;
    error?: string;
    data?: {};
    log?: boolean;
}

export default class CreateApiResponseUseCase {
    private apiLogService: IApiLogService;

    constructor(apiLogService: IApiLogService) {
        this.apiLogService = apiLogService;
    }

    async SUCCESS({ route, body, message, error, data, log = true }: ApiResponseParams) {
        if (log) {
            await this.log({ route, body, responseCode: 200, error });
        }

        return NextResponse.json({ message, status: 200, ...data }, { status: 200 });
    }

    async BAD_REQUEST({ route, body, message, error, data, log = true }: ApiResponseParams) {
        if (log) {
            await this.log({ route, body, responseCode: 400, error });
        }

        return NextResponse.json({ message, status: 400, ...data }, { status: 400 });
    }

    async UNAUTHORIZED({ route, body, message, error, data, log = true }: ApiResponseParams) {
        if (log) {
            await this.log({ route, body, responseCode: 401, error });
        }

        return NextResponse.json({ message, status: 401, ...data }, { status: 401 });
    }

    async USER_NOT_ALLOWED({ route, body, message, error, data, log = true }: ApiResponseParams) {
        if (log) {
            await this.log({ route, body, responseCode: 403, error });
        }

        return NextResponse.json({ message, status: 403, ...data }, { status: 403 });
    }

    async NOT_FOUND({ route, body, message, error, data, log = true }: ApiResponseParams) {
        if (log) {
            await this.log({ route, body, responseCode: 404, error });
        }

        return NextResponse.json({ message, status: 404, ...data }, { status: 404 });
    }

    async METHOD_NOT_ALLOWED({ route, body, message, error, data, log = true }: ApiResponseParams) {
        if (log) {
            await this.log({ route, body, responseCode: 405, error });
        }

        return NextResponse.json({ message, status: 405, ...data }, { status: 405 });
    }

    async INTERNAL_SERVER_ERROR({
        route,
        body,
        message,
        error,
        data,
        log = true,
    }: ApiResponseParams) {
        if (log) {
            await this.log({ route, body, responseCode: 500, error });
        }

        return NextResponse.json({ message, status: 500, ...data }, { status: 500 });
    }

    private async log({ route, body, responseCode, error }: Omit<IApiLog, 'id' | 'time'>) {
        return this.apiLogService.create({
            route,
            body,
            responseCode,
            error: error || undefined,
            time: new Date(),
        });
    }
}
