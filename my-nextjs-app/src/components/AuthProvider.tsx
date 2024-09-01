import React, { useState, useEffect, createContext } from 'react';
import { loginUser, registerUser, logoutUser, loginWithLinkedIn } from '../services/api';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginLinkedIn: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and set user
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await loginUser(email, password);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { token, user } = await registerUser(email, password, name);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const loginLinkedIn = async () => {
    try {
      await loginWithLinkedIn();
      // The actual login process will be handled in the callback
    } catch (error) {
      console.error('LinkedIn login error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginLinkedIn }}>
      {children}
    </AuthContext.Provider>
  );
};