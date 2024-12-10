import SessionProvider from '@/app/AuthProvider';
import LoginForm from '@/components/LoginForm';

export default function Login() {
    return (
        <SessionProvider>
            <div className="flex h-screen w-screen flex-col items-center justify-center">
                <LoginForm />
            </div>
        </SessionProvider>
    );
}
