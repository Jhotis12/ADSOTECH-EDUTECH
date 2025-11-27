
import { BarChart2, TrendingUp, Users, Activity } from 'lucide-react';

const Analysis = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <BarChart2 size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Análisis Educativo</h1>
                    <p className="text-gray-500">Estadísticas y métricas de rendimiento</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-green-600 text-sm font-medium">+12%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">4.5</h3>
                    <p className="text-sm text-gray-500">Promedio General</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <span className="text-blue-600 text-sm font-medium">Total</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">98%</h3>
                    <p className="text-sm text-gray-500">Asistencia</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <span className="text-orange-600 text-sm font-medium">Activo</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Alto</h3>
                    <p className="text-sm text-gray-500">Rendimiento</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
                Gráficos detallados próximamente
            </div>
        </div>
    );
};

export default Analysis;
