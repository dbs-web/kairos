'use client';
// Hooks
import { useState } from 'react';

// Components
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import ClientForm from './forms/ClientForm';

// Icons
import { CiCirclePlus } from 'react-icons/ci';

export default function ClientRegisterDialog() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="hover:border-scale-105 border border-muted/50 bg-white text-neutral-500 transition-all duration-300 hover:bg-white hover:shadow-lg"
                    onClick={() => setIsOpen(true)}
                >
                    <CiCirclePlus className="text-sm" />
                    Cadastrar Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[80%] sm:max-w-[425px] lg:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar Cliente</DialogTitle>
                    <DialogDescription>
                        Aqui você pode cadastrar o cliente, lembre-se de adicionar os avatares dele
                        posteriormente para que ele possa utilizar a plataforma!
                    </DialogDescription>
                </DialogHeader>
                <ClientForm setModalOpen={setIsOpen} />
            </DialogContent>
            <DialogFooter></DialogFooter>
        </Dialog>
    );
}
