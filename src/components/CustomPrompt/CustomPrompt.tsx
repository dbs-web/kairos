// UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateWithAIForm from './CreateWithAIForm';
import CreateWithoutAIForm from './CreateWithoutAIForm';
import { VideoCreationProvider } from '@/hooks/use-video-creation';
import { createVideoDirect } from '@/services/client/video/createVideoDirect';

// Entities

export default function CustomPrompt() {
    return (
        <div className="flex h-[500px] flex-col rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">Criação de Vídeo</h2>

            <Tabs defaultValue="withAI" className="">
                <TabsList className="min-w-full bg-neutral-300">
                    <TabsTrigger className="w-1/2" value="withAI">
                        Quero Criar com Inteligência Artificial
                    </TabsTrigger>
                    <TabsTrigger className="w-1/2" value="withoutAI">
                        Quero Criar sem Inteligência Artificial
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="withAI">
                    <CreateWithAIForm />
                </TabsContent>
                <TabsContent value="withoutAI">
                    <VideoCreationProvider createVideo={createVideoDirect}>
                        <CreateWithoutAIForm />
                    </VideoCreationProvider>
                </TabsContent>
            </Tabs>
        </div>
    );
}
