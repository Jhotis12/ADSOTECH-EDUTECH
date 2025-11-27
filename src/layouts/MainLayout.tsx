import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';
import { supabase } from '../lib/supabase';

const MainLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

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
