'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BiTrendingUp } from 'react-icons/bi';

export default function RadarTendenciasPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Radar de Tendências</h1>
                    <p className="text-gray-400">Descubra as tendências mais relevantes para o seu conteúdo</p>
                </div>
            </div>

            {/* Coming Soon Card */}
            <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
                <CardContent className="p-12 text-center">
                    <BiTrendingUp className="mx-auto mb-4 text-6xl text-blue-400" />
                    <h3 className="text-2xl font-semibold text-white mb-4">Em Breve</h3>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        O Radar de Tendências está sendo desenvolvido para trazer as melhores insights 
                        sobre tendências de conteúdo nas redes sociais.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
