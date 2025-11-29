import { useEffect, useState } from 'react';
import { Clock, MapPin, Phone, BookOpen, Users, Award, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Institucion } from '../types';

const Landing = () => {
    const [institution, setInstitution] = useState<Institucion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstitution = async () => {
            try {
                const { data, error } = await supabase
                    .from('institucion')
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 sm:space-y-12">
            {/* Hero Section - Fully Responsive */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white shadow-xl overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
                </div>

                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                        Bienvenido a {institution?.nombre || 'EduTech'}
                    </h1>
                    <p className="text-base sm:text-lg text-indigo-100 leading-relaxed">
                        Plataforma integral de gestión educativa. Mantente informado sobre las últimas novedades y accede a la información institucional.
                    </p>
                </div>
            </div>

            {/* Institution Info Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0">
                            <Clock size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Horario de Atención</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Secretaría Académica</p>
                        </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">
                        {institution?.calendario || 'Lunes a Viernes 7:00 AM - 3:00 PM'}
                    </p>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl flex-shrink-0">
                            <MapPin size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Ubicación</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">{institution?.ciudad || 'Sede Principal'}</p>
                        </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">
                        {institution?.direccion || 'Dirección no disponible'}
                    </p>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all sm:col-span-2 lg:col-span-1">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0">
                            <Phone size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Contacto</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Líneas Directas</p>
                        </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">
                        {institution?.telefono || 'Teléfono no disponible'}
                        <br />
                        <span className="text-indigo-600">{institution?.correo || 'correo@ejemplo.com'}</span>
                    </p>
                </div>
            </div>

            {/* Features Section - New */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { icon: BookOpen, label: 'Gestión Académica', color: 'indigo' },
                    { icon: Users, label: 'Comunidad Educativa', color: 'purple' },
                    { icon: Award, label: 'Logros y Eventos', color: 'green' },
                    { icon: Calendar, label: 'Calendario Escolar', color: 'orange' }
                ].map((feature, i) => (
                    <div key={i} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all text-center">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-${feature.color}-50 text-${feature.color}-600 rounded-xl flex items-center justify-center`}>
                            <feature.icon size={24} className="sm:w-7 sm:h-7" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700">{feature.label}</p>
                    </div>
                ))}
            </div>

            {/* News Section - Responsive */}
            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Noticias del Colegio</h2>
                    <button className="text-indigo-600 text-xs sm:text-sm font-medium hover:text-indigo-700 transition-colors">
                        Ver todas
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        { emoji: '📚', category: 'Académico', title: 'Inicio del Segundo Semestre Académico', desc: 'El próximo lunes 4 de marzo inicia el segundo semestre académico.', color: 'indigo' },
                        { emoji: '🏆', category: 'Logros', title: 'Estudiantes Ganan Olimpiadas de Matemáticas', desc: 'Felicitamos a nuestros estudiantes de grado 11 por obtener el primer lugar.', color: 'green' },
                        { emoji: '🎭', category: 'Eventos', title: 'Festival Cultural Anual 2024', desc: 'Los invitamos al Festival Cultural que se realizará el próximo 15 de marzo.', color: 'orange' },
                        { emoji: '💻', category: 'Tecnología', title: 'Nueva Sala de Cómputo Inaugurada', desc: 'Inauguramos nuestra nueva sala de cómputo equipada con tecnología de última generación.', color: 'blue' },
                        { emoji: '❤️', category: 'Comunidad', title: 'Campaña Solidaria de Donación', desc: 'Nuestra comunidad educativa se une en una campaña de donación de útiles escolares.', color: 'pink' },
                        { emoji: '⚽', category: 'Deportes', title: 'Torneo Intercolegial de Fútbol', desc: 'Nuestro equipo de fútbol masculino avanza a la final del torneo intercolegial.', color: 'yellow' }
                    ].map((news, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className={`aspect-video bg-gradient-to-br from-${news.color}-400 to-${news.color}-600 rounded-xl mb-3 sm:mb-4 overflow-hidden flex items-center justify-center text-5xl sm:text-6xl transform group-hover:scale-105 transition-transform`}>
                                {news.emoji}
                            </div>
                            <div className="space-y-2">
                                <span className={`inline-block px-2.5 py-1 bg-${news.color}-50 text-${news.color}-600 text-xs font-medium rounded-full`}>
                                    {news.category}
                                </span>
                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base line-clamp-2">
                                    {news.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                                    {news.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Announcements - Responsive */}
            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Anuncios Recientes</h2>
                    <button className="text-indigo-600 text-xs sm:text-sm font-medium hover:text-indigo-700 transition-colors">
                        Ver todo
                    </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                    {[
                        { title: 'Reunión de Padres de Familia', desc: 'Se convoca a reunión para entrega de informes académicos del segundo periodo.', time: 'Hace 2 horas', icon: '👥' },
                        { title: 'Actualización de Protocolos de Seguridad', desc: 'Informamos sobre las nuevas medidas de seguridad implementadas en las instalaciones.', time: 'Hace 5 horas', icon: '🔒' },
                        { title: 'Inscripciones Abiertas para Talleres', desc: 'Ya están abiertas las inscripciones para los talleres extracurriculares del segundo semestre.', time: 'Hace 1 día', icon: '✏️' }
                    ].map((announcement, i) => (
                        <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl sm:text-3xl">
                                {announcement.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-1">{announcement.title}</h4>
                                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{announcement.desc}</p>
                                <span className="text-xs text-indigo-600 mt-2 block font-medium">{announcement.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Landing;
