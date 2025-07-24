'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    User, 
    MessageSquare, 
    TrendingUp, 
    FileText, 
    Users, 
    Map, 
    AlertTriangle 
} from 'lucide-react';

interface FormData {
    // Candidato
    fullName: string;
    urnName: string;
    age: string;
    birthPlace: string;
    maritalStatus: string;
    religion: string;
    education: string;
    currentProfession: string;
    previousProfession: string;
    hobbies: string;
    favoriteTeam: string;
    partyAffiliation: string;
    politicalExperience: string;
    previousPositions: string;
    mainAchievements: string;
}

const tabs = [
    { id: 'candidato', label: 'Candidato', icon: User },
    { id: 'comunicacao', label: 'Comunicação', icon: MessageSquare },
    { id: 'trajetoria', label: 'Trajetória', icon: TrendingUp },
    { id: 'plataforma', label: 'Plataforma', icon: FileText },
    { id: 'eleitorado', label: 'Eleitorado', icon: Users },
    { id: 'cenario', label: 'Cenário', icon: Map },
    { id: 'vulnerabilidades', label: 'Vulnerabilidades', icon: AlertTriangle },
];

export default function PoliticalAnalysisForm() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        urnName: '',
        age: '',
        birthPlace: '',
        maritalStatus: '',
        religion: '',
        education: '',
        currentProfession: '',
        previousProfession: '',
        hobbies: '',
        favoriteTeam: '',
        partyAffiliation: '',
        politicalExperience: '',
        previousPositions: '',
        mainAchievements: '',
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Dados do formulário:', formData);
        // TODO: Implement backend integration
        alert('Dados salvos! Verifique o console para ver os dados.');
    };

    const renderPlaceholderContent = (title: string, items: string[]) => (
        <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-4">{title}</h3>
            <p className="text-muted-foreground mb-6">Esta seção será implementada com formulários específicos para:</p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Form Container */}
            <Card className="bg-card border-border">
                <CardHeader className="bg-muted/50 border-b border-border pb-6">
                    <CardTitle className="text-foreground text-2xl">Formulário para Análise Estratégica Política</CardTitle>
                    <CardDescription className="text-base">Preencha as informações do candidato para análise estratégica</CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                    <Tabs defaultValue="candidato" className="w-full">
                        <TabsList className="grid w-full grid-cols-7 mb-8 h-auto p-1 bg-muted/50">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="flex flex-col items-center gap-2 p-4 h-16 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[hsl(191,65%,53%)] data-[state=active]:to-[#0085A3] data-[state=active]:text-white rounded-md transition-all duration-200"
                                    >
                                        <IconComponent className="w-6 h-6" style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px' }} />
                                        <span className="text-xs font-medium">{tab.label}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {/* Candidato Tab */}
                        <TabsContent value="candidato" className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Dados Pessoais Básicos */}
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b-2 border-primary">
                                        Dados Pessoais Básicos
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Nome Completo *</Label>
                                            <Input
                                                id="fullName"
                                                value={formData.fullName}
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                required
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="urnName">Nome de Urna</Label>
                                            <Input
                                                id="urnName"
                                                value={formData.urnName}
                                                onChange={(e) => handleInputChange('urnName', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Idade</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => handleInputChange('age', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="birthPlace">Local de Nascimento</Label>
                                            <Input
                                                id="birthPlace"
                                                value={formData.birthPlace}
                                                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="maritalStatus">Estado Civil</Label>
                                            <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                                                <SelectTrigger className="bg-card border-border">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                                                    <SelectItem value="casado">Casado(a)</SelectItem>
                                                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                                                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                                                    <SelectItem value="uniao_estavel">União Estável</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="religion">Religião</Label>
                                            <Input
                                                id="religion"
                                                value={formData.religion}
                                                onChange={(e) => handleInputChange('religion', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Formação e Profissão */}
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b-2 border-primary">
                                        Formação e Profissão
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="education">Formação Acadêmica</Label>
                                            <Textarea
                                                id="education"
                                                value={formData.education}
                                                onChange={(e) => handleInputChange('education', e.target.value)}
                                                rows={3}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="currentProfession">Profissão Atual</Label>
                                            <Input
                                                id="currentProfession"
                                                value={formData.currentProfession}
                                                onChange={(e) => handleInputChange('currentProfession', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="previousProfession">Profissão Anterior</Label>
                                            <Input
                                                id="previousProfession"
                                                value={formData.previousProfession}
                                                onChange={(e) => handleInputChange('previousProfession', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Interesses Pessoais */}
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b-2 border-primary">
                                        Interesses Pessoais
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="hobbies">Hobbies e Interesses</Label>
                                            <Textarea
                                                id="hobbies"
                                                value={formData.hobbies}
                                                onChange={(e) => handleInputChange('hobbies', e.target.value)}
                                                rows={3}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="favoriteTeam">Time de Futebol</Label>
                                            <Input
                                                id="favoriteTeam"
                                                value={formData.favoriteTeam}
                                                onChange={(e) => handleInputChange('favoriteTeam', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Histórico Político */}
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b-2 border-primary">
                                        Histórico Político
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="partyAffiliation">Partido Atual</Label>
                                            <Input
                                                id="partyAffiliation"
                                                value={formData.partyAffiliation}
                                                onChange={(e) => handleInputChange('partyAffiliation', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="politicalExperience">Anos de Experiência Política</Label>
                                            <Input
                                                id="politicalExperience"
                                                type="number"
                                                value={formData.politicalExperience}
                                                onChange={(e) => handleInputChange('politicalExperience', e.target.value)}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="previousPositions">Cargos Anteriores</Label>
                                            <Textarea
                                                id="previousPositions"
                                                value={formData.previousPositions}
                                                onChange={(e) => handleInputChange('previousPositions', e.target.value)}
                                                rows={3}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="mainAchievements">Principais Realizações</Label>
                                            <Textarea
                                                id="mainAchievements"
                                                value={formData.mainAchievements}
                                                onChange={(e) => handleInputChange('mainAchievements', e.target.value)}
                                                rows={3}
                                                className="bg-card border-border"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-center gap-4 pt-6 border-t border-border">
                                    <Button type="submit" className="bg-gradient-to-r from-[hsl(191,65%,53%)] to-[#0085A3] hover:from-[hsl(191,75%,58%)] hover:to-[hsl(191,100%,38%)] text-white px-8">
                                        Salvar Dados
                                    </Button>
                                    <Button type="button" variant="secondary" className="px-8">
                                        Visualizar Dados
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        {/* Other Tabs - Placeholder Content */}
                        <TabsContent value="comunicacao">
                            {renderPlaceholderContent("Comunicação e Imagem Pública", [
                                "Voz e Tom de Comunicação",
                                "Estilo e Linguagem",
                                "Presença Digital",
                                "Arquétipo de Marca"
                            ])}
                        </TabsContent>

                        <TabsContent value="trajetoria">
                            {renderPlaceholderContent("Trajetória Política e Legado", [
                                "Mandatos e Cargos Executivos",
                                "Projetos de Lei",
                                "Emendas Parlamentares",
                                "Obras e Realizações"
                            ])}
                        </TabsContent>

                        <TabsContent value="plataforma">
                            {renderPlaceholderContent("Plataforma e Posicionamentos", [
                                "Eixos Programáticos",
                                "Posicionamento por Tema",
                                "Propostas Principais",
                                "Bandeiras da Campanha"
                            ])}
                        </TabsContent>

                        <TabsContent value="eleitorado">
                            {renderPlaceholderContent("Dados Eleitorais e Opinião Pública", [
                                "Histórico de Eleições",
                                "Perfil do Eleitorado",
                                "Pesquisas de Opinião",
                                "Geografia do Voto"
                            ])}
                        </TabsContent>

                        <TabsContent value="cenario">
                            {renderPlaceholderContent("Análise do Ecossistema Político", [
                                "Análise SWOT",
                                "Apoio Municipal",
                                "Concorrentes Externos",
                                "Concorrentes Internos",
                                "Monitoramento de Mídia"
                            ])}
                        </TabsContent>

                        <TabsContent value="vulnerabilidades">
                            {renderPlaceholderContent("Vulnerabilidades e Pontos de Crise", [
                                "Dossiê de Vulnerabilidades",
                                "Declarações Polêmicas",
                                "Plano de Resposta a Crises",
                                "Banco de Argumentos"
                            ])}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
