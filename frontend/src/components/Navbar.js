'use client';

import { useState } from 'react';
import LoginModal from './LoginModal';
import { LockClosedIcon } from '@heroicons/react/24/solid';

export default function Navbar({ user, setUser }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">TrailHaven</h1>
        <div className="space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.username} ({user.role})</span>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center space-x-1 hover:underline"
            >
              <LockClosedIcon className="h-5 w-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
      {isLoginOpen && <LoginModal setUser={setUser} closeModal={() => setIsLoginOpen(false)} />}
    </nav>
  );
}