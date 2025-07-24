import PoliticalAnalysisForm from '@/components/Conhecimento/PoliticalAnalysisForm';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ConhecimentoPage() {
    return (
        <ScrollArea className="h-full px-4 sm:px-6 md:px-12 py-6">
            <PoliticalAnalysisForm />
        </ScrollArea>
    );
}
