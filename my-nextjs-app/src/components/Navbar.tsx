// src/components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          IceBrAIker 🧊
        </Link>
        <div>
          <Link href="/" className="text-white mr-4">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="text-white mr-4">
                My Profile
              </Link>
              <button onClick={logout} className="text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white mr-4">
                Login
              </Link>
              <Link href="/signup" className="text-white">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;