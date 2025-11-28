
import { Bell, Search, User, LogIn, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    isAuthenticated: boolean;
}

const getRoleName = (idrol: number | undefined): string => {
    const roles: { [key: number]: string } = {
        1: 'Administrador',
        2: 'Rector',
        3: 'Docente',
        4: 'Estudiante',
        5: 'Padre',
        6: 'Secretaría'
    };
    return roles[idrol || 0] || 'Usuario';
};

const Header = ({ isAuthenticated }: HeaderProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 right-0 left-0 z-10 px-6 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-4 w-full max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">
                                    {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {getRoleName(user?.idrol)}
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

                        <button
                            onClick={handleLogout}
                            className="ml-3 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-sm font-medium">
                        <LogIn size={18} />
                        <span>Iniciar Sesión</span>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
