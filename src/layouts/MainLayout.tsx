import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';
import Footer from '../components/Footer';
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

    // Redirect authenticated users from landing page to dashboard
    if (isAuthenticated && location.pathname === '/') {
        return <Navigate to="/dashboard" replace />;
    }

    // Redirect unauthenticated users to login for protected routes (not landing page)
    if (!isAuthenticated && location.pathname !== '/') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {location.pathname !== '/dashboard' && <Header isAuthenticated={isAuthenticated} />}
            <main className={location.pathname === '/dashboard' ? '' : 'pt-20 flex-1'}>
                <div className={location.pathname === '/dashboard' ? '' : 'p-6 max-w-7xl mx-auto'}>
                    <Outlet />
                </div>
            </main>
            {location.pathname === '/' && <Footer />}
            <ChatBot />
        </div>
    );
};

export default MainLayout;
