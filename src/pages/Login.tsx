import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, GraduationCap, BookOpen, Users, Award } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await login(email, password);

            if (error) throw new Error(error);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-20 -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 translate-x-32 translate-y-32"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="w-full max-w-6xl relative">
                {/* Back to Home Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowRight size={16} className="rotate-180" />
                    Volver al inicio
                </Link>

                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Illustration (Desktop Only) */}
                    <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl text-white relative overflow-hidden min-h-[600px]">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                <GraduationCap size={40} />
                            </div>
                            <h2 className="text-4xl font-bold mb-4">Bienvenido a EduTech</h2>
                            <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                                Plataforma integral de gestión educativa que conecta estudiantes, padres y docentes.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Gestión Académica</h3>
                                        <p className="text-sm text-indigo-100">Accede a calificaciones, tareas y recursos educativos</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Comunidad Conectada</h3>
                                        <p className="text-sm text-indigo-100">Comunicación directa con profesores y padres</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Seguimiento de Progreso</h3>
                                        <p className="text-sm text-indigo-100">Monitorea el rendimiento académico en tiempo real</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                        {/* Header with Gradient (Mobile Only) */}
                        <div className="lg:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-6 sm:p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <GraduationCap size={32} className="sm:w-10 sm:h-10" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bienvenido</h1>
                                <p className="text-indigo-100 text-sm sm:text-base">Inicia sesión en EduTech Platform</p>
                            </div>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:block p-8 border-b border-gray-100">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
                            <p className="text-gray-600">Ingresa tus credenciales para acceder a la plataforma</p>
                        </div>

                        {/* Form Section */}
                        <div className="p-6 sm:p-8 lg:p-10">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs">!</span>
                                    </div>
                                    <p className="flex-1">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-5">
                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                                            placeholder="tu-correo@ejemplo.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Contraseña
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 py-3 sm:py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Recordarme</span>
                                    </label>
                                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Iniciando sesión...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Iniciar Sesión</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Note */}
                            <p className="mt-6 text-center text-xs sm:text-sm text-gray-500">
                                ¿No tienes una cuenta? Contacta con la{' '}
                                <span className="text-indigo-600 font-medium">secretaría académica</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <Lock size={14} />
                        <span>Conexión segura</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div>Datos protegidos</div>
                </div>
            </div>
        </div>
    );
};

export default Login;
