export default function FormSteps({ step }: { step: number }) {
    return (
        <div className="relative mx-auto grid w-48 grid-cols-2 items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="z-[10] grid h-8 w-8 items-center rounded-full bg-primary text-center font-bold text-white">
                    1
                </div>
                <span>Transcrição</span>
            </div>
            <div
                className="absolute right-1/2 top-4 z-0 h-0.5 w-1/2 translate-x-1/2 bg-slate-300 data-[active=true]:bg-primary"
                data-active={step == 2}
            ></div>

            <div className="z-10 flex flex-col items-center">
                <div
                    className="grid h-8 w-8 items-center rounded-full bg-slate-300 text-center font-bold text-neutral-700 data-[active=true]:bg-primary data-[active=true]:text-white"
                    data-active={step == 2}
                >
                    2
                </div>

                <span>Avatar</span>
            </div>
        </div>
    );
}
