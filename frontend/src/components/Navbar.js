// src/components/Navbar.js
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AuthCard from './AuthCard';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-gray-800/90 backdrop-blur-md border-b border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white">HavenTrail</h1>
          </Link>

          <div className="flex space-x-6 items-center">
            <Link href="/about" className="text-white hover:text-gray-300 transition">
              About Us
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/maps" className="text-white hover:text-gray-300 transition">
                  Maps
                </Link>
                <Link href="/contact" className="text-white hover:text-gray-300 transition">
                  Contact Us
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin/dashboard">
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-semibold transition">
                      Dashboard
                    </button>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {isAuthOpen && <AuthCard onClose={() => setIsAuthOpen(false)} />}
    </>
  );
}