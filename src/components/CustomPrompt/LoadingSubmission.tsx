import { ImSpinner8 } from 'react-icons/im';

export default function LoadingSubmission() {
    return (
        <div className="grid flex-1 place-items-center">
            <div className="flex flex-col items-center gap-3">
                <ImSpinner8 className="animate-spin text-3xl text-primary" />
                <span className="text-sm text-muted-foreground">Gerando seu vídeo...</span>
            </div>
        </div>
    );
}
