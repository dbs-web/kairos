export default function Skeleton() {
    return (
        <div
            className={`me-4 w-full cursor-wait rounded-lg border bg-white px-5 py-7 transition-all duration-300`}
        >
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="h-12 w-12 animate-pulse rounded-lg bg-neutral-300"></div>
                    <div className="flex flex-col items-start">
                        <div className="h-3 w-40 animate-pulse rounded-full bg-neutral-200"></div>
                        <div className="mt-1 h-2 w-20 animate-pulse rounded-full bg-neutral-200"></div>
                    </div>
                </div>
                <div className="flex h-8 w-24 animate-pulse items-center gap-x-2 rounded-md bg-neutral-300"></div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-neutral-200"></div>
            <div className="mt-1 h-2 w-[90%] rounded-full bg-neutral-200"></div>
            <div className="mt-1 h-2 w-full rounded-full bg-neutral-200"></div>
            <div className="mt-1 h-2 w-[99%] rounded-full bg-neutral-200"></div>
            <div className="mt-1 h-2 w-full rounded-full bg-neutral-200"></div>
        </div>
    );
}
