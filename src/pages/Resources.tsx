
import { BookOpen, Video, FileText, Link as LinkIcon } from 'lucide-react';

const Resources = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                    <BookOpen size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recursos Integrados</h1>
                    <p className="text-gray-500">Material de apoyo y guías de estudio</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer">
                        <div className="aspect-video bg-gray-100 rounded-xl mb-4 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            {i % 2 === 0 ? <Video size={32} className="text-gray-400" /> : <FileText size={32} className="text-gray-400" />}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Recurso Educativo {i}</h3>
                        <p className="text-sm text-gray-500 mb-3">Matemáticas • Grado 11</p>
                        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                            <LinkIcon size={16} />
                            <span>Ver Material</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;
