import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5020/api/auth/login', { email, password });
      console.log('Login response:', res);  
      if (res.data && res.data.token) {
        setUser(res.data);
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return res.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post('http://localhost:5020/api/auth/register', { username, email, password });
      console.log('Register response:', res);  
      if (res.data && res.data.token) {
        setUser(res.data);
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        return res.data;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('http://localhost:5020/api/auth/forgot-password', { email });
      console.log('Forgot password response:', res);  
      return res.data;
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const res = await axios.post(`http://localhost:5020/api/auth/reset-password/${token}`, { password });
      console.log('Reset password response:', res);  
      return res.data;
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);