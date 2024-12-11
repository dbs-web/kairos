import { IUser } from '@/types/user';

interface ClientCardProps {
    client: IUser;
}

export default function ClientCard({ client }: ClientCardProps) {
    return (
        <div
            className={`relative cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 hover:scale-105 hover:shadow-md`}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="h-12 w-12 rounded-lg bg-primary"></div>
                    <div className="flex flex-col items-start">
                        <h3 className="text-center font-medium text-neutral-700">{client.name}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
