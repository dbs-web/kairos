// UI
import { PiSpinnerThin } from 'react-icons/pi';

export default function VideoSkeleton() {
    return (
        <div className="flex min-h-[min(500px,80vh)] flex-col gap-x-12 gap-y-6 rounded-xl bg-white p-3 shadow-md md:me-8 md:max-h-[65vh] md:flex-row md:p-6">
            <div className="grid min-w-56 grid-cols-1 grid-rows-[1fr_32px] gap-y-4 md:grid-rows-[1fr_48px]">
                <div className="grid h-full animate-pulse items-center justify-center rounded-xl bg-neutral-300">
                    <PiSpinnerThin className="animate-ping text-xl drop-shadow-sm" />
                </div>

                <button className="flex items-center justify-center gap-x-2 rounded-xl bg-secondary !p-0 text-center text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg md:py-2">
                    <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200"></div>
                </button>
            </div>
            <div className="relative flex w-full flex-col items-start justify-start pe-12">
                <div className="absolute right-2 top-2 h-8 w-8 cursor-pointer rounded-lg bg-neutral-200"></div>
                <div className="h-4 w-48 animate-pulse rounded-full bg-neutral-300"></div>
                <div className="mt-2 h-3 w-12 animate-pulse rounded-full bg-neutral-200"></div>

                <div className="mt-12 h-auto w-full">
                    <div className="h-3 w-full rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-[90%] rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-full rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-[99%] rounded-full bg-neutral-300"></div>

                    <div className="mt-5 h-3 w-full rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-full rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-[99%] rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-[90%] rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-full rounded-full bg-neutral-300"></div>

                    <div className="mt-5 h-3 w-[90%] rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-full rounded-full bg-neutral-300"></div>
                    <div className="mt-1 h-3 w-[99%] rounded-full bg-neutral-300"></div>
                </div>
            </div>
        </div>
    );
}
