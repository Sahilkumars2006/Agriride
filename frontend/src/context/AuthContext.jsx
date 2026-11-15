import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Validate or refresh session on mount
  useEffect(() => {
    const initAuth = async () => {
      const tokens = authService.getTokens();
      if (tokens?.access) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('agriride_user', JSON.stringify(profile));
        } catch (error) {
          console.warn('Session verification failed, logging out:', error);
          authService.logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();

    // Listen for global logout events from axios interceptor
    const handleGlobalLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handleGlobalLogout);

    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      const message = 
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Invalid email or password. Please try again.';
      setAuthError(message);
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (error) {
      setLoading(false);
      let message = 'Registration failed.';
      if (error.response?.data) {
        const errors = error.response.data;
        const firstKey = Object.keys(errors)[0];
        message = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    authError,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
