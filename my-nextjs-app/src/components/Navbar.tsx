import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
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
          <Link href="/about" className="text-white">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;