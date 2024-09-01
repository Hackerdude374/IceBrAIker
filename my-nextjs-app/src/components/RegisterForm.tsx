// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useRouter } from 'next/router';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerUser(email, password);
      console.log('User registered:', result);
      localStorage.setItem('token', result.token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLinkedInLogin = () => {
    window.location.href = 'YOUR_LINKEDIN_OAUTH_URL';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
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
      <button
        type="button"
        onClick={handleLinkedInLogin}
        className="w-full p-2 bg-blue-700 text-white rounded mt-2"
      >
        Sign up with LinkedIn
      </button>
    </form>
  );
};

export default RegisterForm;
