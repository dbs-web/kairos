'use client';
import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ClickableIconProps {
    children: ReactNode;
    onClick: () => void;
    label: string;
    delay?: number;
    open?: boolean;
}

export default function ClickableIcon({
    children,
    onClick,
    label,
    delay = 200,
    open,
}: ClickableIconProps) {
    return (
        <TooltipProvider delayDuration={delay}>
            <Tooltip open={open}>
                <TooltipTrigger>
                    <p
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClick}
                        aria-label={label}
                    >
                        {children}
                    </p>
                </TooltipTrigger>
                <TooltipContent className="bg-white font-medium text-neutral-700 shadow-md">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
