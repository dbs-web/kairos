import { Citation, Source } from '@/domain/entities/briefing';
import { JsonValue } from 'next-auth/adapters';

export default function mapSource(json: JsonValue): Source | null {
    if (json === null || json === undefined) return null;

    // Ensure json is an object (and not an array)
    if (typeof json !== 'object' || Array.isArray(json)) {
        throw new Error('Expected an object for Source mapping.');
    }

    // TypeScript doesn't know the shape, so we use a type assertion for our checks.
    const obj = json as { content?: unknown; citations?: unknown };

    // Validate the 'content' property
    if (typeof obj.content !== 'string') {
        throw new Error("Invalid or missing 'content' property in Source.");
    }

    // Validate the 'citations' property
    if (!Array.isArray(obj.citations)) {
        throw new Error("Invalid or missing 'citations' property in Source.");
    }

    // Map each citation, ensuring each has the proper structure.
    const citations: Citation[] = obj.citations.map((item) => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
            throw new Error('Invalid citation item in Source.');
        }
        const citationObj = item as { url?: unknown; title?: unknown };
        if (typeof citationObj.url !== 'string' || typeof citationObj.title !== 'string') {
            throw new Error("Citation item must have string 'url' and 'title'.");
        }
        return { url: citationObj.url, title: citationObj.title };
    });

    return {
        content: obj.content,
        citations,
    };
}
