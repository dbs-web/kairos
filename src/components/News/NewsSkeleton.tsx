// UI
import { MdImageNotSupported } from 'react-icons/md';

export default function NewsSkeleton() {
    return (
        <div className="relative h-full w-full cursor-pointer rounded-lg bg-card p-4 transition-all duration-300">
            <>
                <div className="absolute inset-0 rounded-lg border border-border transition-all duration-100" />
            </>

            <div className="relative flex h-full flex-col">
                <div className="relative mb-4 h-48 w-full shrink-0 overflow-hidden rounded-lg">
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <MdImageNotSupported className="text-4xl" />
                    </div>
                </div>

                <div className="flex flex-grow flex-col">
                    <div className="space-y-2">
                        <h3 className="line-clamp-2 text-lg font-semibold text-foreground md:text-xl">
                            <div className="h-3 w-full animate-pulse rounded-full bg-muted"></div>
                        </h3>
                        <time className="block text-xs font-medium text-muted-foreground">
                            <div className="h-3 w-20 animate-pulse rounded-full bg-muted"></div>
                        </time>
                    </div>

                    <div className="mt-4 line-clamp-3 flex-grow text-sm leading-relaxed text-foreground/80">
                        <div className="mt-4 h-2 w-full rounded-full bg-muted"></div>
                        <div className="mt-1 h-2 w-[90%] rounded-full bg-muted"></div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted"></div>
                        <div className="mt-1 h-2 w-[99%] rounded-full bg-muted"></div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <button className="group flex items-center gap-x-1.5 text-xs font-medium text-foreground/70 transition-colors hover:text-primary">
                            <div className="h-3 w-20 animate-pulse rounded-full bg-muted"></div>
                        </button>

                        <span className="rounded-lg bg-primary/20 px-2.5 py-1 text-xs font-medium text-primary">
                            <div className="h-3 w-16 animate-pulse rounded-full bg-muted"></div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
