import { useEffect, useState } from 'react';
import { Clock, MapPin, Phone, Calendar, Award, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Institucion } from '../types';

const Dashboard = () => {
    const [institution, setInstitution] = useState<Institucion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstitution = async () => {
            try {
                const { data, error } = await supabase
                    .from('Institucion')
                    .select('*')
                    .single();

                if (error) throw error;
                setInstitution(data);
            } catch (error) {
                console.error('Error fetching institution:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstitution();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Bienvenido a {institution?.nombre || 'EduTech'}
                    </h1>
                    <p className="text-indigo-100 max-w-xl">
                        Plataforma integral de gestión educativa. Accede a tus trámites, recursos y análisis en un solo lugar.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 transform skew-x-12 translate-x-20"></div>
                <div className="absolute right-0 bottom-0 h-64 w-64 bg-white/10 rounded-full transform translate-x-10 translate-y-10 blur-3xl"></div>
            </div>

            {/* Institution Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Horario de Atención</h3>
                            <p className="text-sm text-gray-500">Secretaría Académica</p>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        {institution?.calendario || 'Lunes a Viernes 7:00 AM - 3:00 PM'}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Ubicación</h3>
                            <p className="text-sm text-gray-500">{institution?.ciudad || 'Sede Principal'}</p>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        {institution?.direccion || 'Dirección no disponible'}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Contacto</h3>
                            <p className="text-sm text-gray-500">Líneas Directas</p>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        {institution?.telefono || 'Teléfono no disponible'}
                        <br />
                        {institution?.correo || 'correo@ejemplo.com'}
                    </p>
                </div>
            </div>

            {/* Quick Stats / Analysis Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Resumen Académico</h2>
                        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Ver todo</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-orange-500">
                                    <Award size={20} />
                                </div>
                                <span className="font-medium text-gray-700">Promedio General</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">4.5</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500">
                                    <Calendar size={20} />
                                </div>
                                <span className="font-medium text-gray-700">Asistencia</span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">98%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Novedades Recientes</h2>
                        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Ver todo</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold">
                                    2{i}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Reunión de Padres de Familia</h4>
                                    <p className="text-sm text-gray-500 line-clamp-1">Se convoca a reunión para entrega de informes...</p>
                                    <span className="text-xs text-indigo-600 mt-1 block">Hace 2 horas</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
