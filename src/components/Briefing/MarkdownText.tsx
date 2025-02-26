'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownText({ text, className }: { text: string; className?: string }) {
    return (
        <ScrollArea
            className={cn(
                className,
                'h-80 rounded-lg border border-neutral-200 bg-muted/20 p-2 pr-4 shadow-sm',
            )}
        >
            <style jsx global>{`
                .scrollbar-styling ::-webkit-scrollbar {
                    width: 8px;
                }
                .scrollbar-styling ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                }
                .scrollbar-styling ::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }
                .scrollbar-styling ::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}</style>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className={'prose min-w-full font-sans text-xs'}
            >
                {text}
            </ReactMarkdown>
        </ScrollArea>
    );
}
