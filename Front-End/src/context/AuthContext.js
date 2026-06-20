import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleSetUser = (token) => {
        setUser({ token });
        const decoded = parseJwt(token);
        if (decoded && decoded.roles && decoded.roles.includes('PRIVILEGED')) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) handleSetUser(token);
    }, []);

    const login = async (email, password) => {
        const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);

        const response = await api.post('/login', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        handleSetUser(response.data.accessToken);
    };

    const logout = (navigate) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAdmin(false);
        navigate('/'); 
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};