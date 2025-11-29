import { ArrowLeft, Scale, Building2, FileCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LegalNotice = () => {
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
                        <Scale className="text-indigo-600" />
                        Aviso Legal
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                {/* Introduction */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                        En cumplimiento con la legislación vigente, <strong>EduTech AI</strong> informa a los usuarios
                        de la plataforma sobre los aspectos legales relacionados con el uso de nuestros servicios educativos.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        <strong>Última actualización:</strong> Noviembre 2025
                    </p>
                </section>

                {/* Company Information */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">1. Información de la Empresa</h2>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-sm">
                        <p><strong>Razón Social:</strong> EduTech AI S.A.S.</p>
                        <p><strong>NIT:</strong> 900.123.456-7</p>
                        <p><strong>Domicilio Social:</strong> Calle 123 #45-67, Bogotá, Colombia</p>
                        <p><strong>Correo Electrónico:</strong> info@edutech.edu.co</p>
                        <p><strong>Teléfono:</strong> +57 123 456 7890</p>
                        <p><strong>Registro Mercantil:</strong> Cámara de Comercio de Bogotá</p>
                    </div>
                </section>

                {/* Object and Activity */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">2. Objeto y Actividad</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            EduTech AI es una plataforma tecnológica dedicada a la gestión educativa integral,
                            que ofrece servicios de:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Gestión académica y administrativa para instituciones educativas</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Asistencia virtual mediante inteligencia artificial</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Recursos educativos digitales</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Comunicación entre la comunidad educativa</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Intellectual Property */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                            <FileCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">3. Propiedad Intelectual e Industrial</h2>
                        </div>
                    </div>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            Todos los contenidos de esta plataforma, incluyendo textos, imágenes, gráficos, logotipos,
                            iconos, software, bases de datos y cualquier otro material, están protegidos por derechos
                            de propiedad intelectual e industrial.
                        </p>
                        <p>
                            Queda prohibida la reproducción, distribución, comunicación pública, transformación o
                            cualquier otra forma de explotación sin autorización expresa de EduTech AI.
                        </p>
                    </div>
                </section>

                {/* Applicable Law */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">4. Legislación Aplicable</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            El uso de esta plataforma se rige por la legislación colombiana vigente, especialmente:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Ley 1581 de 2012 - Protección de Datos Personales</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Ley 1273 de 2009 - Delitos Informáticos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Ley 23 de 1982 - Derechos de Autor</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                                <span>Decreto 1377 de 2013 - Reglamentación de Datos Personales</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Jurisdiction */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">5. Jurisdicción</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            Para la resolución de cualquier controversia o conflicto que pudiera derivarse del acceso
                            o uso de la plataforma, las partes se someten expresamente a la jurisdicción de los
                            Juzgados y Tribunales de Bogotá, Colombia, renunciando a cualquier otro fuero que pudiera
                            corresponderles.
                        </p>
                    </div>
                </section>

                {/* Disclaimers */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">6. Exclusión de Garantías y Responsabilidad</h2>
                        </div>
                    </div>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            EduTech AI no se hace responsable de:
                        </p>
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 shrink-0" />
                                <span>Interrupciones o errores en el acceso a la plataforma</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 shrink-0" />
                                <span>Contenidos introducidos por terceros usuarios</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 shrink-0" />
                                <span>Virus o programas maliciosos que puedan afectar su equipo</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 shrink-0" />
                                <span>Daños derivados del uso indebido de la plataforma</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* External Links */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">7. Enlaces a Terceros</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            La plataforma puede contener enlaces a sitios web de terceros. EduTech AI no controla
                            ni se hace responsable del contenido, políticas de privacidad o prácticas de estos sitios externos.
                        </p>
                    </div>
                </section>

                {/* Modifications */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">8. Modificaciones</h2>
                    <div className="space-y-3 text-gray-600 text-sm">
                        <p>
                            EduTech AI se reserva el derecho de modificar el presente aviso legal en cualquier momento.
                            Las modificaciones entrarán en vigor desde su publicación en la plataforma.
                        </p>
                    </div>
                </section>

                {/* Contact */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Contacto Legal</h2>
                    <p className="text-gray-600 text-sm mb-4">
                        Para consultas legales o ejercicio de derechos:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-700">📧 <strong>Correo:</strong> legal@edutech.edu.co</p>
                        <p className="text-sm text-gray-700 mt-2">📍 <strong>Dirección:</strong> Calle 123 #45-67, Bogotá, Colombia</p>
                        <p className="text-sm text-gray-700 mt-2">📞 <strong>Teléfono:</strong> +57 123 456 7890</p>
                        <p className="text-sm text-gray-700 mt-2">🕐 <strong>Horario:</strong> Lunes a Viernes, 8:00 AM - 5:00 PM</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LegalNotice;
