export default function Skeleton() {
    return (
        <div className="relative h-full w-full rounded-lg bg-card p-4 transition-all duration-300">
            <>
                <div className="absolute inset-0 rounded-lg border border-border transition-all duration-100" />
            </>

            <div className="relative flex h-full flex-col">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-center gap-x-2">
                        <div className="h-12 w-12 animate-pulse rounded-lg bg-muted"></div>
                        <div className="flex flex-col items-start">
                            <div className="h-4 w-40 animate-pulse rounded-full bg-muted"></div>
                            <div className="mt-1 h-3 w-20 animate-pulse rounded-full bg-muted"></div>
                        </div>
                    </div>
                    <div className="h-6 w-24 animate-pulse rounded-md bg-muted"></div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded-full bg-muted"></div>
                    <div className="h-3 w-[95%] animate-pulse rounded-full bg-muted"></div>
                    <div className="h-3 w-full animate-pulse rounded-full bg-muted"></div>
                    <div className="h-3 w-[90%] animate-pulse rounded-full bg-muted"></div>
                </div>
            </div>
        </div>
    );
}
