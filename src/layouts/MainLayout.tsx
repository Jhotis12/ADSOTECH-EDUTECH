import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const location = useLocation();
    const { user, loading } = useAuth();
    const isAuthenticated = !!user;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Allow public access to landing page ('/')
    // For all other routes, require authentication
    if (!isAuthenticated && location.pathname !== '/') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {isAuthenticated && <Sidebar />}
            <Header isAuthenticated={isAuthenticated} />
            <main className={`pt-20 min-h-screen transition-all duration-300 ${isAuthenticated ? 'md:pl-64' : 'pl-0'}`}>
                <div className="p-6 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
            <ChatBot />
        </div>
    );
};

export default MainLayout;
