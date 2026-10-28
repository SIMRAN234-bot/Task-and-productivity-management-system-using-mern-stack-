import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication state on mount
  const checkAuth = useCallback(async () => {
    if (authService.isAuthenticated()) {
      try {
        const data = await authService.getMe();
        setUser(data.user);
        localStorage.setItem('taskflow_user', JSON.stringify(data.user));
      } catch (error) {
        console.error('Session expired or invalid:', error);
        authService.logout();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  };

  // Register handler
  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update profile handler
  const updateUser = async (profileData) => {
    const data = await authService.updateProfile(profileData);
    setUser(data.user);
    return data;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to consume AuthContext cleanly
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
