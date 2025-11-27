import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Usuario } from '../types';

interface AuthContextType {
    user: Usuario | null;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted user in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase
                .from('usuario')
                .select('*')
                .eq('correo', email)
                .single();

            if (error) {
                return { error: 'Credenciales inválidas' };
            }

            if (data) {
                // Direct password comparison as requested for testing
                if (data.contrasena_hash === password) {
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data));
                    return { error: null };
                } else {
                    return { error: 'Contraseña incorrecta' };
                }
            }

            return { error: 'Usuario no encontrado' };
        } catch (err) {
            console.error('Login error:', err);
            return { error: 'Error al iniciar sesión' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
