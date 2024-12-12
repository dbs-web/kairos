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
import ClientForm from './ClientForm';

// Icons
import { CiCirclePlus } from 'react-icons/ci';
import { FaTimes } from 'react-icons/fa';

export default function ClientRegisterDialog() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <Dialog open={isOpen}>
            <DialogTrigger asChild>
                <Button
                    className="hover:border-scale-105 border border-muted/50 bg-white text-neutral-500 transition-all duration-300 hover:bg-white hover:shadow-lg"
                    onClick={() => setIsOpen(true)}
                >
                    <CiCirclePlus className="text-sm" />
                    Cadastrar Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[80%] sm:max-w-[425px] lg:max-w-[600px] [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>Cadastrar Cliente</DialogTitle>
                    <DialogDescription>
                        Aqui você pode cadastrar o cliente, lembre-se de adicionar os avatares dele
                        posteriormente para que ele possa utilizar a plataforma!
                    </DialogDescription>
                    <div className="absolute right-5 top-4">
                        <FaTimes
                            className="cursor-pointer text-neutral-500 hover:text-neutral-600"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>
                </DialogHeader>
                <ClientForm setModalOpen={setIsOpen} />
            </DialogContent>
            <DialogFooter></DialogFooter>
        </Dialog>
    );
}
