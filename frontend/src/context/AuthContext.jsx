import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('mm_token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // backend ainda não tem /auth/me → então simulamos usuário
    setUser({
      email: "teste@teste.com",
      is_admin: true
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password });

    localStorage.setItem('mm_token', r.data.token);

    // força estrutura consistente do user
    const loggedUser = {
      email,
      is_admin: true
    };

    setUser(loggedUser);

    return loggedUser;
  };

  const logout = () => {
    localStorage.removeItem('mm_token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);