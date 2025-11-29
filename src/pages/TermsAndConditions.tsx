import { ArrowLeft, Shield, FileText, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
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
                        <FileText className="text-indigo-600" />
                        Términos y Condiciones
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                {/* Introduction */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                        Bienvenido a <strong>EduTech AI</strong>. Al acceder y utilizar nuestra plataforma educativa,
                        usted acepta estar sujeto a los siguientes términos y condiciones de uso.
                        Le recomendamos leer detenidamente este documento antes de utilizar nuestros servicios.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        <strong>Última actualización:</strong> Noviembre 2025
                    </p>
                </section>

                {/* Section 1: Acceptance */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">1. Aceptación de los Términos</h2>
                        </div>
                    </div>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            Al registrarse y utilizar EduTech AI, usted confirma que:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Es mayor de edad o cuenta con el consentimiento de sus padres o tutores legales.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Tiene la capacidad legal para aceptar estos términos.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Proporcionará información veraz y actualizada durante el registro.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 2: Services */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">2. Descripción de los Servicios</h2>
                        </div>
                    </div>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            EduTech AI proporciona una plataforma integral de gestión educativa que incluye:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                                <span>Gestión de calificaciones y asistencia</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                                <span>Asistente virtual con inteligencia artificial</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                                <span>Recursos educativos y materiales de estudio</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                                <span>Comunicación entre estudiantes, padres y docentes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 shrink-0" />
                                <span>Generación de reportes y certificados</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 3: User Responsibilities */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">3. Responsabilidades del Usuario</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p><strong>Los usuarios se comprometen a:</strong></p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Mantener la confidencialidad de sus credenciales de acceso</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Utilizar la plataforma únicamente con fines educativos legítimos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>No compartir contenido inapropiado, ofensivo o ilegal</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Respetar los derechos de propiedad intelectual</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>No intentar acceder a áreas restringidas del sistema</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 4: Intellectual Property */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">4. Propiedad Intelectual</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            Todo el contenido de la plataforma, incluyendo pero no limitado a textos, gráficos,
                            logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos,
                            es propiedad de EduTech AI o de sus proveedores de contenido y está protegido por las
                            leyes de propiedad intelectual.
                        </p>
                    </div>
                </section>

                {/* Section 5: Limitation of Liability */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">5. Limitación de Responsabilidad</h2>
                        </div>
                    </div>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            EduTech AI se esfuerza por mantener la plataforma disponible y funcional, sin embargo:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 shrink-0" />
                                <span>No garantizamos que el servicio esté libre de errores o interrupciones</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 shrink-0" />
                                <span>No nos hacemos responsables por pérdida de datos debido a fallos técnicos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 shrink-0" />
                                <span>El uso de la plataforma es bajo su propio riesgo</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 6: Modifications */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">6. Modificaciones</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
                            Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.
                            Es responsabilidad del usuario revisar periódicamente estos términos.
                        </p>
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Contacto</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Para cualquier consulta sobre estos términos y condiciones:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-700">📧 <strong>Correo:</strong> legal@edutech.edu.co</p>
                        <p className="text-sm text-gray-700 mt-2">📞 <strong>Teléfono:</strong> +57 123 456 7890</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TermsAndConditions;
