import { ArrowLeft, Shield, Lock, Eye, FileText, Server, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                        <Shield className="text-indigo-600" />
                        Política de Privacidad y Protección de Datos
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                {/* Introduction */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                        En <strong>EduTech AI</strong>, nos tomamos muy en serio la privacidad y la seguridad de los datos de nuestra comunidad educativa.
                        Este aviso explica cómo recopilamos, utilizamos y protegemos su información personal, en cumplimiento con las normativas de protección de datos vigentes.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        <strong>Última actualización:</strong> Noviembre 2025
                    </p>
                </section>

                {/* Grid of Key Points */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                            <Eye size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Recopilación de Datos</h3>
                        <p className="text-sm text-gray-600">
                            Recopilamos información necesaria para la gestión académica, incluyendo nombres, documentos de identidad, calificaciones, asistencia y registros de actividad en la plataforma.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
                            <Lock size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Seguridad de la Información</h3>
                        <p className="text-sm text-gray-600">
                            Utilizamos encriptación de extremo a extremo y protocolos de seguridad avanzados para proteger sus datos contra accesos no autorizados, alteración o divulgación.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                            <Server size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Almacenamiento</h3>
                        <p className="text-sm text-gray-600">
                            Sus datos se almacenan en servidores seguros con copias de seguridad periódicas. Mantenemos la información solo durante el tiempo necesario para fines educativos y legales.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Uso de la Información</h3>
                        <p className="text-sm text-gray-600">
                            Los datos se utilizan exclusivamente para: gestión académica, generación de reportes, comunicación institucional y mejora de la experiencia educativa mediante IA.
                        </p>
                    </div>
                </div>

                {/* Detailed Sections */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">1. Información que Recopilamos</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p><strong>Datos personales:</strong></p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Nombre completo, documento de identidad, fecha de nacimiento</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Correo electrónico, número de teléfono, dirección</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Información académica (calificaciones, asistencia, tareas)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Registros de interacción con el asistente virtual</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">2. Cómo Utilizamos su Información</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Gestionar el proceso educativo y administrativo</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Generar reportes académicos y certificados</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Facilitar la comunicación entre estudiantes, padres y docentes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Mejorar nuestros servicios mediante análisis de uso</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Personalizar la experiencia educativa con IA</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">3. Derechos del Usuario</h2>
                        </div>
                    </div>
                    <ul className="space-y-3 text-gray-600 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                            <span><strong>Acceso:</strong> Tiene derecho a solicitar una copia de sus datos personales.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                            <span><strong>Rectificación:</strong> Puede solicitar la corrección de datos inexactos o incompletos.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                            <span><strong>Supresión:</strong> Puede solicitar la eliminación de sus datos cuando ya no sean necesarios.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                            <span><strong>Portabilidad:</strong> Puede solicitar recibir sus datos en un formato estructurado.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                            <span><strong>Oposición:</strong> Puede oponerse al procesamiento de sus datos en ciertos casos.</span>
                        </li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">4. Compartir Información</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            No vendemos ni alquilamos su información personal a terceros. Solo compartimos datos cuando:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Es necesario para la prestación del servicio educativo</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Lo requiere la ley o una autoridad competente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Usted ha dado su consentimiento explícito</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">5. Seguridad de los Datos</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>Implementamos medidas de seguridad técnicas y organizativas:</p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Cifrado SSL/TLS para todas las transmisiones de datos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Autenticación de dos factores disponible</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Copias de seguridad automáticas y encriptadas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Acceso restringido a datos personales solo para personal autorizado</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Contacto</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Si tiene preguntas sobre nuestra política de privacidad o desea ejercer sus derechos:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-700">📧 <strong>Correo:</strong> privacidad@edutech.edu.co</p>
                        <p className="text-sm text-gray-700 mt-2">📍 <strong>Dirección:</strong> Oficina de Secretaría Académica</p>
                        <p className="text-sm text-gray-700 mt-2">📞 <strong>Teléfono:</strong> +57 123 456 7890</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
