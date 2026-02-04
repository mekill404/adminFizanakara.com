// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import type { LoginRequestModel, RegisterRequestModel, AdminUpdateModel } from '../lib/types/models/admin.models.types';

/**
 * Hook personnalisé pour la gestion de l'authentification
 */
export const useAuth = () => {
  const [user, setUser] = useState<any>(() => {
    // Récupérer l'utilisateur depuis localStorage
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });
  
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return false;
    const parsedUser = JSON.parse(storedUser);
    return parsedUser?.role === 'SUPERADMIN';
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequestModel) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsSuperAdmin(response.role === 'SUPERADMIN');
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
  }, []);

  const register = useCallback(async (registerData: RegisterRequestModel) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(registerData);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updateData: AdminUpdateModel) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.updateMe(updateData);
      // Mettre à jour l'utilisateur localement
      if (response) {
        setUser((prev: any) => ({ ...prev, ...response }));
      }
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      setIsAuthenticated(!!token);
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setIsSuperAdmin(storedUser ? JSON.parse(storedUser)?.role === 'SUPERADMIN' : false);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    isAuthenticated,
    isSuperAdmin,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    clearError: () => setError(null),
  };
};