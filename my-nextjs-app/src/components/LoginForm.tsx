// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { loginUser } from '../services/api';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginUser(email, password);
      console.log('User logged in:', result);
      // Handle successful login (e.g., store token, redirect to dashboard)
      localStorage.setItem('token', result.token);
      // Redirect to dashboard (you'll need to implement this)
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (e.g., show error message)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;