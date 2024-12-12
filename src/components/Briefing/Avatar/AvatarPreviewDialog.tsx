import { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface AvatarPreviewDialogProps {
    avatar_video_url: string;
    avatar_name: string;
    children: ReactNode;
}
export default function AvatarPreviewDialog({
    avatar_video_url,
    avatar_name,
    children,
}: AvatarPreviewDialogProps) {
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{avatar_name}</DialogTitle>
                </DialogHeader>
                <video autoPlay>
                    <source src={avatar_video_url} type="video/mp4" />
                </video>
            </DialogContent>
        </Dialog>
    );
}
