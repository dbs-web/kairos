import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { IBriefing } from '@/domain/entities/briefing';
import { useBriefing } from '@/hooks/use-briefing';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CiRedo } from 'react-icons/ci';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
interface RedoBriefingProps {
    briefing: IBriefing;
}

export default function RedoBriefingDialog({ briefing }: RedoBriefingProps) {
    const [open, setOpen] = useState<boolean>();
    const [instruction, setInstruction] = useState<string>('');
    const { toast } = useToast();
    const { redoBriefing } = useBriefing();

    const handleRedoBriefing = async () => {
        redoBriefing(briefing.id, instruction);
        setOpen(false);

        toast({
            title: 'Solicitação de refação enviada com sucesso!',
            description: 'Aguarde alguns instantes até que sua refação seja feita.',
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex basis-1/3 items-center justify-center gap-x-1 rounded-lg bg-secondary py-2 text-xs text-white transition duration-300 hover:shadow-md xl:text-base">
                <CiRedo className="text-lg xl:text-xl" />
                Refazer
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] !rounded md:max-w-[70vw] xl:w-[700px]">
                <div className="relative flex flex-col items-center gap-y-8">
                    <DialogHeader className="w-full !text-center">
                        <DialogTitle>{briefing.title}</DialogTitle>
                        <DialogDescription className="text-neutral-600">
                            Digite as instruções para sua refação
                        </DialogDescription>
                    </DialogHeader>
                    <textarea
                        className="bg-neutral-80 h-60 rounded-xl border border-neutral-400 p-2 shadow"
                        rows={20}
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleRedoBriefing}>
                        Refazer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
