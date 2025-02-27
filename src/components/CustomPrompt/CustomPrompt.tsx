// UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateWithAIForm from './CreateWithAIForm';
import CreateWithoutAIForm from './CreateWithoutAIForm';
import { MdSmartToy, MdTextFields } from 'react-icons/md';

// Entities

export default function CustomPrompt() {
    return (
        <div className="flex flex-col rounded-xl bg-card p-6 shadow-sm border border-border">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Criação de Vídeo</h2>

            <Tabs defaultValue="withAI" className="w-full tabs-dark-mode">
                <TabsList className="mb-4 grid w-full grid-cols-2 gap-2 bg-transparent p-0">
                    <TabsTrigger
                        className="rounded-lg border border-border py-3 text-foreground hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(191,65%,53%)] data-[state=active]:to-[#0085A3] data-[state=active]:text-white"
                        value="withAI"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <MdSmartToy className="text-xl" />
                            <span>Com IA</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        className="rounded-lg border border-border py-3 text-foreground hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(191,65%,53%)] data-[state=active]:to-[#0085A3] data-[state=active]:text-white"
                        value="withoutAI"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <MdTextFields className="text-xl" />
                            <span>Texto Próprio</span>
                        </div>
                    </TabsTrigger>
                </TabsList>

                <div className="mb-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                    <TabsContent value="withAI" className="m-0 p-0">
                        <p>
                            A IA analisará suas instruções e criará um conteúdo otimizado para seu
                            vídeo.
                        </p>
                    </TabsContent>
                    <TabsContent value="withoutAI" className="m-0 p-0">
                        <p>
                            O texto inserido será usado exatamente como escrito, sem modificações
                            pela IA.
                        </p>
                    </TabsContent>
                </div>

                <TabsContent value="withAI">
                    <CreateWithAIForm />
                </TabsContent>
                <TabsContent value="withoutAI">
                    <CreateWithoutAIForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}