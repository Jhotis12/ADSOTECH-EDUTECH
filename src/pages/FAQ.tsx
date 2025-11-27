
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQ = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <HelpCircle size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes</h1>
                    <p className="text-gray-500">Encuentra respuestas a las dudas más comunes</p>
                </div>
            </div>

            <div className="grid gap-4">
                {['Horarios de Atención', 'Proceso de Matrícula', 'Certificados de Estudio', 'Rutas Escolares'].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">{item}</span>
                            <ChevronDown size={20} className="text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
