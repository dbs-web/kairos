// UI
import { MdImageNotSupported } from 'react-icons/md';

export default function NewsSkeleton() {
    return (
        <div
            className={`relative h-full w-full cursor-pointer rounded-lg bg-white p-4 [transition:transform_300ms,box-shadow_300ms] hover:-translate-y-2 hover:shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03),0px_12px_16px_-4px_rgba(16,24,40,0.08)]`}
        >
            <>
                <div
                    className={`absolute inset-0 rounded-lg border border-neutral-200 transition-all duration-100`}
                />
            </>

            <div className="relative flex h-full flex-col">
                {/* Changed rounded-xl to rounded-lg to match card corners */}
                <div className="relative mb-4 h-48 w-full shrink-0 overflow-hidden rounded-lg">
                    <div className="flex h-full w-full items-center justify-center bg-neutral-300 text-neutral-500">
                        <MdImageNotSupported className="text-4xl" />
                    </div>
                </div>

                <div className="flex flex-grow flex-col">
                    <div className="space-y-2">
                        <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900 md:text-xl">
                            <div className="h-3 w-full animate-pulse rounded-full bg-neutral-200"></div>
                        </h3>
                        <time className="block text-xs font-medium text-neutral-500">
                            <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200"></div>
                        </time>
                    </div>

                    <div className="mt-4 line-clamp-3 flex-grow text-sm leading-relaxed text-neutral-600">
                        <div className="mt-4 h-2 w-full rounded-full bg-neutral-200"></div>
                        <div className="mt-1 h-2 w-[90%] rounded-full bg-neutral-200"></div>
                        <div className="mt-1 h-2 w-full rounded-full bg-neutral-200"></div>
                        <div className="mt-1 h-2 w-[99%] rounded-full bg-neutral-200"></div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <button className="group flex items-center gap-x-1.5 text-xs font-medium text-neutral-700 transition-colors hover:text-primary">
                            <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200"></div>
                        </button>

                        <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            <div className="h-3 w-40 animate-pulse rounded-full"></div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
