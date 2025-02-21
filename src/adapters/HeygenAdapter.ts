import { AdapterError } from '@/shared/errors';
import { createHmac } from 'crypto';

export interface GenerateVideoArgs {
    avatarId: string;
    text: string;
    voiceId: string;
    width: number;
    height: number;
}

export default class HeyGenAdapter {
    private api_key: string;
    private secret: string;
    private callbackUrl: string;

    constructor() {
        this.api_key = process.env.HEYGEN_API_KEY ?? '';
        this.secret = process.env.HEYGEN_SECRET ?? '';
        this.callbackUrl = process.env.HEYGEN_CALLBACK_URL ?? '';

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

        if (!this.callbackUrl) {
            throw new AdapterError('Error on HEYGEN ADAPTER', new Error('CALLBACK_URL IS NOT SET'));
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

    async generateVideoRequest(args: GenerateVideoArgs) {
        try {
            return fetch('https://api.heygen.com/v2/video/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.api_key,
                },
                body: JSON.stringify(this.buildPayloadGenerate(args)),
            });
        } catch (error) {
            throw new AdapterError('Error on HeyGenAdapter', error as Error);
        }
    }

    private buildPayloadGenerate(args: GenerateVideoArgs) {
        return {
            video_inputs: [
                {
                    character: {
                        type: 'avatar',
                        avatar_id: args.avatarId,
                        avatar_style: 'normal',
                    },
                    voice: {
                        type: 'text',
                        input_text: args.text,
                        voice_id: args.voiceId,
                    },
                },
            ],
            callback_id: this.callbackUrl,
            dimension: {
                width: args.width,
                height: args.height,
            },
        };
    }
}
