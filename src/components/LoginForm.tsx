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
            callbackUrl: `${window.location.origin}/panel`,
        }).then((res) => {
            if (res?.error) {
                setError('Email e/ou senha incorretos');
            }
            setLoading(false);
        });
    };

    return (
        <form
            onSubmit={formSubmit}
            className={`flex w-full max-w-[400px] flex-col items-center justify-center gap-y-8 rounded-md px-6 py-12 shadow-[0_0px_40px_-5px_rgba(0,0,0,0.3)]`}
        >
            <a href="/" className="flex w-full flex-col items-center justify-center">
                <Image src="/kairos-logo-title.webp" alt="Logo Kairós" width={160} height={300} />
            </a>
            {error && (
                <small className="block w-full px-2 text-center text-[1rem] font-medium text-red-600">
                    Ocorreu um erro. Verifique suas credenciais!
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
                        className={'w-full rounded-md border bg-neutral-100 p-3 shadow-md'}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={'w-full rounded-md border bg-neutral-100 p-3 shadow-md'}
                        required
                    />
                </fieldset>
            )}

            <a href="/redefinir-senha" className="text-[#0080ff] underline">
                Esqueceu sua senha?
            </a>

            <button className="mt-6 w-full max-w-[400px] rounded-lg bg-primary py-3 text-xl font-bold text-white transition duration-300 ease-in-out hover:bg-secondary">
                Log In
            </button>
        </form>
    );
}
