import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Hola, {user?.nombre} {user?.apellido}
                </h1>
                <p className="text-gray-500">
                    Bienvenido a tu panel de control. Aquí encontrarás un resumen de tu actividad académica.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Información Personal</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Correo:</span>
                            <span className="font-medium text-gray-900">{user?.correo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Teléfono:</span>
                            <span className="font-medium text-gray-900">{user?.telefono || 'No registrado'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">ID Usuario:</span>
                            <span className="font-medium text-gray-900">{user?.idusuario}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
