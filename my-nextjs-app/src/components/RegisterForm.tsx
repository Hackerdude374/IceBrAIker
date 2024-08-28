// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { registerUser } from '../services/api';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerUser(email, password);
      console.log('User registered:', result);
      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error
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
        Register
      </button>
    </form>
  );
};

export default RegisterForm;