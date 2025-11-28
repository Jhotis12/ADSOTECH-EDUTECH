import { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGeminiResponse } from '../lib/gemini';
import { useLocation } from 'react-router-dom';

const ChatBot = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
        { text: '¡Hola! Soy el asistente virtual de EduTech. ¿En qué puedo ayudarte hoy?', isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hide chatbot on dashboard page
    if (location.pathname === '/dashboard') {
        return null;
    }

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

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50 ${isOpen ? 'hidden' : 'block'}`}
            >
                <MessageCircle size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
                        style={{ maxHeight: '600px', height: '80vh' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <MessageCircle size={18} />
                                </div>
                                <div>
                                    <h3 className="font-medium">Asistente EduTech</h3>
                                    <p className="text-xs text-indigo-200">En línea</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isUser
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
                                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Shortcuts */}
                        {messages.length === 1 && (
                            <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto">
                                <div className="flex gap-2">
                                    {['Horarios', 'Asignaturas', 'Reuniones', 'Fechas de entrega', 'Actividades'].map((shortcut) => (
                                        <button
                                            key={shortcut}
                                            onClick={() => handleSend(shortcut)}
                                            className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full hover:bg-indigo-100 transition-colors"
                                        >
                                            {shortcut}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe tu pregunta..."
                                    disabled={isLoading}
                                    className="flex-1 p-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none text-sm disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
