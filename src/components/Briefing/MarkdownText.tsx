'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownText({ text, className }: { text: string; className?: string }) {
    return (
        <ScrollArea
            className={`${className} h-80 rounded-lg border-b border-t bg-muted/20 p-2 pr-4 shadow-sm`}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} className={'prose min-w-full text-xs'}>
                {text}
            </ReactMarkdown>
        </ScrollArea>
    );
}
