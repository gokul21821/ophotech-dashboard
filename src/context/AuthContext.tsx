'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { User, AuthResponse } from '@/types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/api/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      // Store token and user
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    email: string,
    username: string,
    password: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/api/auth/register', {
        email,
        username,
        password,
        confirmPassword: password,
      });

      const { user, token } = response.data;

      // Store token and user
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}