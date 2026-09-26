import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillbridge_token') || null);
  const [loading, setLoading] = useState(true);

  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  useEffect(() => {
    const handleSessionExpired = (e) => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('skillbridge_token');
      localStorage.removeItem('skillbridge_user');
      setSessionExpiredMessage(e.detail?.message || 'Your session has expired. Please sign in again.');
    };

    window.addEventListener('skillbridge_session_expired', handleSessionExpired);
    return () => window.removeEventListener('skillbridge_session_expired', handleSessionExpired);
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('skillbridge_user', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch (err) {
          if (err.response?.status === 401) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('skillbridge_token');
            localStorage.removeItem('skillbridge_user');
            setSessionExpiredMessage('Your session has expired. Please sign in again.');
          }
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const handleAuthSuccess = (data) => {
    const { token: newToken, user: newUser } = data;
    setToken(newToken);
    setUser(newUser);
    setSessionExpiredMessage('');
    localStorage.setItem('skillbridge_token', newToken);
    localStorage.setItem('skillbridge_user', JSON.stringify(newUser));
  };

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data?.success) {
        handleAuthSuccess(res.data);
        return res.data;
      }
      throw new Error(res.data?.message || 'Email or password is incorrect.');
    } catch (err) {
      if (err.response?.status === 401) {
        throw new Error('Email or password is incorrect.');
      }
      const msg = err.response?.data?.message || (err.message?.includes('401') ? 'Email or password is incorrect.' : err.message) || 'Email or password is incorrect.';
      throw new Error(msg);
    }
  };

  const register = async (formData) => {
    try {
      const res = await authAPI.register(formData);
      if (res.data?.success) {
        handleAuthSuccess(res.data);
        return res.data;
      }
      throw new Error(res.data?.message || 'Registration failed.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      throw new Error(msg);
    }
  };

  const demoLogin = async (role = 'jobseeker') => {
    try {
      const res = await authAPI.demoLogin(role);
      if (res.data?.success) {
        handleAuthSuccess(res.data);
        return res.data;
      }
      throw new Error(res.data?.message || 'Demo sign-in failed.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Demo sign-in failed.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user');
  };

  const updateProfile = async (profileData) => {
    const res = await authAPI.updateProfile(profileData);
    if (res.data?.success) {
      setUser(res.data.user);
      localStorage.setItem('skillbridge_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res.data?.message || 'Profile update failed');
  };

  const isJobSeeker = user?.role === 'jobseeker';
  const isEmployer = user?.role === 'employer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isJobSeeker,
        isEmployer,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        setUser,
        sessionExpiredMessage,
        setSessionExpiredMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
