'use client';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { ImSpinner8 } from 'react-icons/im';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const searchParams = useSearchParams();
    const [error, setError] = useState(searchParams.get('error') || '');

    const formSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        signIn('credentials', {
            email,
            password,
            callbackUrl: `/panel`,
        }).then((res) => {
            setLoading(false);
        });
    };

    return (
        <form
            onSubmit={formSubmit}
            className={`flex w-full max-w-[400px] flex-col items-center justify-center gap-y-8 rounded-md bg-card px-6 py-12 shadow-[0_0px_40px_-5px_rgba(0,0,0,0.5)] border border-border`}
        >
            <Image
                src="/kairos-logo-simbol-color.webp"
                alt="Logo Kairós"
                width={240}
                height={44}
                priority
            />
            {error && (
                <small className="block w-full px-2 text-center text-[1rem] font-medium text-red-600">
                    {error}
                </small>
            )}
            {loading ? (
                <ImSpinner8 className="animate-spin text-4xl text-primary" />
            ) : (
                <fieldset className="flex w-full flex-col items-center gap-y-8">
                    <input
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={'w-full rounded-md border border-border bg-card p-3 text-foreground placeholder:text-muted-foreground shadow-md'}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={'w-full rounded-md border border-border bg-card p-3 text-foreground placeholder:text-muted-foreground shadow-md'}
                        required
                    />
                </fieldset>
            )}

            <a href="/redefinir-senha" className="text-primary hover:text-primary/80 underline">
                Esqueceu sua senha?
            </a>

            <button className="create-video-button mt-6 w-full max-w-[400px] rounded-lg py-3 text-xl font-bold text-white transition duration-300 ease-in-out hover:brightness-110">
                Log In
            </button>
        </form>
    );
}