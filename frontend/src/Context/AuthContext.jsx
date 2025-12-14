import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const authDataContext = createContext();

function AuthContext({ children }) {
    const serverUrl = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

const login = useCallback(async (email, password) => {
    try {
        setLoading(true);
        setError(null);
        console.log('Attempting login with:', { email });
        
        const response = await axios.post(
            `${serverUrl}/api/auth/login`,
            { email, password },
            { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Login response:', response.data);
        setUser(response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'An error occurred during login';
        setError(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setLoading(false);
    }
}, [serverUrl]);

    // Function to handle user logout
    const logout = useCallback(async () => {
        try {
            setLoading(true);
            await axios.post(
                `${serverUrl}/api/auth/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    }, [serverUrl, navigate]);

    // Check if user is authenticated
    const checkAuth = useCallback(async () => {
        try {
            const response = await axios.get(
                `${serverUrl}/api/auth/check-auth`,
                { withCredentials: true }
            );
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            setUser(null);
            return null;
        }
    }, [serverUrl]);

    const value = {
        serverUrl,
        loading,
        error,
        user,
        login,
        logout,
        checkAuth,
        setLoading,
        setError
    };

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    );
}

export default AuthContext;