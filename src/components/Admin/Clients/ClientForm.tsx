'use client';
import { Input } from '@/components/ui/input';
import { useClients } from '@/hooks/use-client';
import { FormEvent, useState } from 'react';

export default function ClientForm() {
    const [error, setError] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

    const { addUser } = useClients();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (password === passwordConfirmation) {
            addUser({
                name,
                email,
                password,
                role: 'user',
            });
        } else {
            setError('A confirmação de senha deve ser igual à senha.');
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <span className="text-red-500">{error}</span>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <button className="">Cadastrar Cliente</button>
        </form>
    );
}
