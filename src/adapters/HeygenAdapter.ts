import { AdapterError } from '@/shared/errors';
import { createHmac } from 'crypto';
export default class HeyGenAdapter {
    private api_key: string;
    private secret: string;

    constructor() {
        this.api_key = process.env.HEYGEN_API_KEY ?? '';
        this.secret = process.env.HEYGEN_SECRET ?? '';

        if (!this.api_key) {
            throw new AdapterError(
                'Error on HEYGEN ADAPTER',
                new Error('HEYGEN_API_KEY IS NOT SET'),
            );
        }

        if (!this.secret) {
            throw new AdapterError(
                'Error on HEYGEN ADAPTER',
                new Error('HEYGEN_API_SECRET IS NOT SET'),
            );
        }
    }

    async checkGroup({ groupId }: { groupId: string }) {
        const res = await fetch(`https://api.heygen.com/v2/avatar_group/${groupId}/avatars`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': this.api_key,
            },
        });

        return res.ok;
    }

    async checkCallbackRequest(request: Request) {
        const content = await request.text();

        const signature = request.headers.get('signature') || '';

        const hmac = createHmac('sha256', this.secret);

        hmac.update(content, 'utf-8');

        const computedSignature = hmac.digest('hex');

        return signature === computedSignature;
    }
}
