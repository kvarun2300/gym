import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext(null);

const ROLE_HOME = {
  admin: '/admin/dashboard',
  trainer: '/trainer/dashboard',
  member: '/member/dashboard',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('xf_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const persistSession = (userData, accessToken, refreshToken) => {
    localStorage.setItem('xf_access_token', accessToken);
    localStorage.setItem('xf_refresh_token', refreshToken);
    localStorage.setItem('xf_user', JSON.stringify(userData));
    setUser(userData);
  };

  const clearSession = () => {
    localStorage.removeItem('xf_access_token');
    localStorage.removeItem('xf_refresh_token');
    localStorage.removeItem('xf_user');
    setUser(null);
  };

  // Rehydrate / verify session on load
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('xf_access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authService.getMe();
        setUser(data.data.user);
        localStorage.setItem('xf_user', JSON.stringify(data.data.user));
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    const { user: userData, accessToken, refreshToken } = data.data;
    persistSession(userData, accessToken, refreshToken);
    toast.success(`Welcome back, ${userData.name.split(' ')[0]}!`);
    return userData;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authService.register(payload);
    const { user: userData, accessToken, refreshToken } = data.data;
    persistSession(userData, accessToken, refreshToken);
    toast.success('Account created! Welcome to Xtreme Fitness.');
    return userData;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    toast.success('Logged out successfully');
  }, []);

  const homePathForRole = (role) => ROLE_HOME[role] || '/';

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, homePathForRole, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
