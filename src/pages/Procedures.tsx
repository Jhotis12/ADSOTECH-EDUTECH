
import { FileText } from 'lucide-react';

const Procedures = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <FileText size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestor de Trámites</h1>
                    <p className="text-gray-500">Solicita y gestiona tus documentos académicos</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Solicitar Nuevo Trámite</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Trámite</label>
                            <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100">
                                <option>Certificado de Estudios</option>
                                <option>Constancia de Notas</option>
                                <option>Reporte de Fallas</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Detalles Adicionales</label>
                            <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 h-24"></textarea>
                        </div>
                        <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                            Enviar Solicitud
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Mis Solicitudes</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-medium text-sm text-gray-900">Certificado de Estudios</p>
                                    <p className="text-xs text-gray-500">Solicitado el 2{i}/11/2025</p>
                                </div>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-lg">Pendiente</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Procedures;
