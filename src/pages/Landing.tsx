import { useEffect, useState } from 'react';
import { Clock, MapPin, Phone, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Institucion } from '../types';
import { Link } from 'react-router-dom';

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
                    <p className="text-indigo-100 max-w-xl mb-6">
                        Plataforma integral de gestión educativa. Mantente informado sobre las últimas novedades y accede a la información institucional.
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl font-medium hover:bg-indigo-50 transition-colors">
                        Iniciar Sesión
                        <ArrowRight size={18} />
                    </Link>
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

            {/* News Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Noticias del Colegio</h2>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Ver todas</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* News Article 1 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-4 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold opacity-50">
                                📚
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                                Académico
                            </span>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                Inicio del Segundo Semestre Académico
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                El próximo lunes 4 de marzo inicia el segundo semestre académico. Recordamos a todos los estudiantes y padres de familia revisar el calendario escolar y los horarios actualizados.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>25 de febrero, 2024</span>
                                <span>•</span>
                                <span>5 min lectura</span>
                            </div>
                        </div>
                    </div>

                    {/* News Article 2 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold opacity-50">
                                🏆
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                Logros
                            </span>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                Estudiantes Ganan Olimpiadas de Matemáticas
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                Felicitamos a nuestros estudiantes de grado 11 por obtener el primer lugar en las Olimpiadas Regionales de Matemáticas. Un orgullo para nuestra institución.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>20 de febrero, 2024</span>
                                <span>•</span>
                                <span>3 min lectura</span>
                            </div>
                        </div>
                    </div>

                    {/* News Article 3 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mb-4 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold opacity-50">
                                🎭
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                                Eventos
                            </span>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                Festival Cultural Anual 2024
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                Los invitamos al Festival Cultural que se realizará el próximo 15 de marzo. Habrá presentaciones artísticas, exposiciones y actividades para toda la familia.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>18 de febrero, 2024</span>
                                <span>•</span>
                                <span>4 min lectura</span>
                            </div>
                        </div>
                    </div>

                    {/* News Article 4 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl mb-4 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold opacity-50">
                                💻
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                Tecnología
                            </span>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                Nueva Sala de Cómputo Inaugurada
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                Inauguramos nuestra nueva sala de cómputo equipada con tecnología de última generación para mejorar el aprendizaje digital de nuestros estudiantes.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>15 de febrero, 2024</span>
                                <span>•</span>
                                <span>6 min lectura</span>
                            </div>
                        </div>
                    </div>

                    {/* News Article 5 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl mb-4 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold opacity-50">
                                ❤️
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600 text-xs font-medium rounded-full">
                                Comunidad
                            </span>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                Campaña Solidaria de Donación
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                Nuestra comunidad educativa se une en una campaña de donación de útiles escolares para estudiantes de escasos recursos. Tu aporte hace la diferencia.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>10 de febrero, 2024</span>
                                <span>•</span>
                                <span>3 min lectura</span>
                            </div>
                        </div>
                    </div>

                    {/* News Article 6 */}
                    <div className="group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl mb-4 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold opacity-50">
                                ⚽
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-600 text-xs font-medium rounded-full">
                                Deportes
                            </span>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                Torneo Intercolegial de Fútbol
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                Nuestro equipo de fútbol masculino avanza a la final del torneo intercolegial. Los invitamos a apoyar a nuestros deportistas el próximo sábado en el estadio municipal.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>8 de febrero, 2024</span>
                                <span>•</span>
                                <span>4 min lectura</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Anuncios Recientes</h2>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Ver todo</button>
                </div>
                <div className="space-y-4">
                    {[
                        {
                            title: 'Reunión de Padres de Familia',
                            description: 'Se convoca a reunión para entrega de informes académicos del segundo periodo. Su asistencia es fundamental.',
                            time: 'Hace 2 horas',
                            icon: '👥'
                        },
                        {
                            title: 'Actualización de Protocolos de Seguridad',
                            description: 'Informamos sobre las nuevas medidas de seguridad implementadas en las instalaciones del colegio.',
                            time: 'Hace 5 horas',
                            icon: '🔒'
                        },
                        {
                            title: 'Inscripciones Abiertas para Talleres',
                            description: 'Ya están abiertas las inscripciones para los talleres extracurriculares del segundo semestre.',
                            time: 'Hace 1 día',
                            icon: '✏️'
                        }
                    ].map((announcement, i) => (
                        <div key={i} className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-gray-50">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">
                                {announcement.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">{announcement.description}</p>
                                <span className="text-xs text-indigo-600 mt-2 block">{announcement.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Landing;
