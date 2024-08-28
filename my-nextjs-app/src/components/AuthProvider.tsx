// src/components/AuthProvider.tsx
import React, { useState, useEffect, createContext } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/api';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in (e.g., by verifying token in localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set user
      // This is a placeholder and should be replaced with actual token verification
      setUser({ id: 1, email: 'user@example.com', name: 'John Doe' });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    localStorage.setItem('token', userData.token);
  };

  const signup = async (email: string, password: string) => {
    const userData = await registerUser(email, password);
    setUser(userData);
    localStorage.setItem('token', userData.token);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};