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
                'h-80 rounded-lg border border-border bg-muted/10 p-2 pr-4 shadow-sm',
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-invert min-w-full font-sans text-xs text-foreground/90 prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-code:bg-muted prose-code:text-foreground"
            >
                {text}
            </ReactMarkdown>
        </ScrollArea>
    );
}
