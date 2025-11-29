import { ArrowLeft, Cookie, Settings, BarChart3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiePolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
                <div className="w-full px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        title="Volver al inicio"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Cookie className="text-indigo-600" />
                        Política de Cookies
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                {/* Introduction */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                        Esta Política de Cookies explica qué son las cookies, cómo las utilizamos en <strong>EduTech AI</strong>,
                        qué tipos de cookies empleamos y cómo puede gestionarlas. Al utilizar nuestra plataforma,
                        usted acepta el uso de cookies de acuerdo con esta política.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        <strong>Última actualización:</strong> Noviembre 2025
                    </p>
                </section>

                {/* What are Cookies */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                            <Cookie size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">1. ¿Qué son las Cookies?</h2>
                        </div>
                    </div>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet o móvil)
                            cuando visita un sitio web. Permiten que el sitio web recuerde sus acciones y preferencias
                            durante un período de tiempo, mejorando así su experiencia de navegación.
                        </p>
                    </div>
                </section>

                {/* Types of Cookies */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">2. Tipos de Cookies que Utilizamos</h2>

                    <div className="space-y-4">
                        {/* Essential Cookies */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-start gap-3 mb-2">
                                <Shield size={18} className="text-blue-600 mt-0.5" />
                                <h3 className="font-semibold text-gray-800">Cookies Esenciales</h3>
                            </div>
                            <p className="text-sm text-gray-600 ml-7">
                                Son necesarias para el funcionamiento básico de la plataforma. Permiten la navegación
                                y el uso de funciones esenciales como el acceso a áreas seguras.
                            </p>
                            <p className="text-xs text-gray-500 ml-7 mt-2">
                                <strong>Ejemplos:</strong> Cookies de sesión, autenticación de usuario
                            </p>
                        </div>

                        {/* Functional Cookies */}
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <div className="flex items-start gap-3 mb-2">
                                <Settings size={18} className="text-purple-600 mt-0.5" />
                                <h3 className="font-semibold text-gray-800">Cookies Funcionales</h3>
                            </div>
                            <p className="text-sm text-gray-600 ml-7">
                                Permiten recordar sus preferencias y personalizar su experiencia en la plataforma.
                            </p>
                            <p className="text-xs text-gray-500 ml-7 mt-2">
                                <strong>Ejemplos:</strong> Idioma preferido, tema visual, configuración de notificaciones
                            </p>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="flex items-start gap-3 mb-2">
                                <BarChart3 size={18} className="text-green-600 mt-0.5" />
                                <h3 className="font-semibold text-gray-800">Cookies Analíticas</h3>
                            </div>
                            <p className="text-sm text-gray-600 ml-7">
                                Nos ayudan a entender cómo los usuarios interactúan con la plataforma,
                                permitiéndonos mejorar nuestros servicios.
                            </p>
                            <p className="text-xs text-gray-500 ml-7 mt-2">
                                <strong>Ejemplos:</strong> Google Analytics, métricas de uso, análisis de rendimiento
                            </p>
                        </div>
                    </div>
                </section>

                {/* Purpose */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">3. Finalidad de las Cookies</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>Utilizamos cookies para:</p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Mantener su sesión activa y segura</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Recordar sus preferencias y configuraciones</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Analizar el uso de la plataforma para mejorar nuestros servicios</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Personalizar el contenido y las recomendaciones</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Garantizar la seguridad y prevenir fraudes</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Duration */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">4. Duración de las Cookies</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="font-semibold text-gray-800 mb-2">Cookies de Sesión</p>
                            <p className="text-sm">
                                Se eliminan automáticamente cuando cierra su navegador. Se utilizan principalmente
                                para mantener su sesión activa mientras navega por la plataforma.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="font-semibold text-gray-800 mb-2">Cookies Persistentes</p>
                            <p className="text-sm">
                                Permanecen en su dispositivo durante un período específico (hasta 12 meses)
                                o hasta que las elimine manualmente. Se utilizan para recordar sus preferencias.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Cookie Management */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">5. Cómo Gestionar las Cookies</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            Puede controlar y/o eliminar las cookies según desee. Tiene la opción de:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Configurar su navegador para rechazar todas las cookies</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Aceptar solo cookies de sitios específicos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Eliminar todas las cookies almacenadas en su dispositivo</span>
                            </li>
                        </ul>

                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mt-4">
                            <p className="text-sm text-gray-700">
                                <strong>⚠️ Importante:</strong> Si deshabilita las cookies, algunas funcionalidades
                                de la plataforma pueden no funcionar correctamente, como el inicio de sesión automático
                                o la personalización de contenido.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Browser Instructions */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">6. Configuración por Navegador</h2>
                    <div className="space-y-2 text-gray-600 text-sm">
                        <p className="mb-3">Para gestionar cookies en los navegadores más comunes:</p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span><strong>Safari:</strong> Preferencias → Privacidad → Cookies</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span><strong>Edge:</strong> Configuración → Privacidad → Cookies</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Contacto</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Si tiene preguntas sobre nuestra política de cookies:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-700">📧 <strong>Correo:</strong> cookies@edutech.edu.co</p>
                        <p className="text-sm text-gray-700 mt-2">📞 <strong>Teléfono:</strong> +57 123 456 7890</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CookiePolicy;
