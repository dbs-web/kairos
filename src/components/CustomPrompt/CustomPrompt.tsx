// UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateWithAIForm from './CreateWithAIForm';
import CreateWithoutAIForm from './CreateWithoutAIForm';
import { MdSmartToy, MdTextFields } from 'react-icons/md';

// Entities

export default function CustomPrompt() {
    return (
        <div className="flex flex-col rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">Criação de Vídeo</h2>

            <Tabs defaultValue="withAI" className="w-full">
                <TabsList className="mb-4 grid w-full grid-cols-2 gap-2 bg-transparent p-0">
                    <TabsTrigger
                        className="rounded-lg border py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                        value="withAI"
                    >
                        <div className='flex items-center justify-center gap-2'>
                            <MdSmartToy className="text-xl" />
                            <span>Com IA</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        className="rounded-lg border py-3 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                        value="withoutAI"
                    >
                        <div className='flex items-center justify-center gap-2'>
                            <MdTextFields className="text-xl" />
                            <span>Texto Próprio</span>
                        </div>
                    </TabsTrigger>
                </TabsList>

                <div className="mb-4 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
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
