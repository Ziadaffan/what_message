import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { decodeToken } from '../utils/jwt.utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        try {
          const decodedToken = decodeToken(token);
          setUser(decodedToken);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      const token = res.data.token;
      const decodedToken = decodeToken(token);
      setUser(decodedToken);
      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await api.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', res.data.token);
      const token = res.data.token;
      const decodedToken = decodeToken(token);
      setUser(decodedToken);
      return res.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
