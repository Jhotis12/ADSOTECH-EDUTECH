import { useState } from 'react';
import { Send, Loader2, LogOut, User } from 'lucide-react';
import { getGeminiResponse } from '../lib/gemini';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
        { text: '¡Hola! Soy el asistente virtual de EduTech. ¿En qué puedo ayudarte hoy?', isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (textToSend?: string) => {
        const messageText = textToSend || input;
        if (!messageText.trim()) return;

        setMessages(prev => [...prev, { text: messageText, isUser: true }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getGeminiResponse(messageText);
            setMessages(prev => [...prev, {
                text: response,
                isUser: false
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                text: "Lo siento, hubo un error al conectar con el asistente.",
                isUser: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('https://adsotech-edutech.vercel.app/');
    };

    return (
        <div className="fixed inset-0 bg-gray-50">
            {/* Floating User Icon - Top Right */}
            <div className="fixed top-6 right-6 z-50">
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg border border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">
                            {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user?.idrol === 1 ? 'Administrador' :
                                user?.idrol === 2 ? 'Rector' :
                                    user?.idrol === 3 ? 'Docente' :
                                        user?.idrol === 4 ? 'Estudiante' :
                                            user?.idrol === 5 ? 'Padre' :
                                                user?.idrol === 6 ? 'Secretaría' : 'Usuario'}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden">
                        {user?.urlfotoperfil ? (
                            <img src={user.urlfotoperfil} alt="Perfil" className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </div>
            </div>

            {/* Logout Button - Bottom Right */}
            <button
                onClick={handleLogout}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-full shadow-lg border border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
                <LogOut size={20} />
                <span className="font-medium">Cerrar Sesión</span>
            </button>

            {/* Chatbot - Full Screen */}
            <div className="h-full flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] p-4 rounded-2xl text-sm ${msg.isUser
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shortcuts */}
                {messages.length === 1 && (
                    <div className="px-6 py-3 bg-white border-t border-gray-100">
                        <div className="max-w-4xl mx-auto">
                            <p className="text-xs text-gray-500 mb-2">Preguntas sugeridas:</p>
                            <div className="flex flex-wrap gap-2">
                                {['Horarios', 'Calificaciones', 'Asistencia', 'Próximas actividades', 'Información del colegio'].map((shortcut) => (
                                    <button
                                        key={shortcut}
                                        onClick={() => handleSend(shortcut)}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                                    >
                                        {shortcut}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-6 bg-white border-t border-gray-200">
                    <div className="max-w-4xl mx-auto">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-3"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu pregunta aquí..."
                                disabled={isLoading}
                                className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
