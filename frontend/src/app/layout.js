'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null); // { role: 'user' | 'admin', username, policeId?, photo? }

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Navbar user={user} setUser={setUser} />
        <main>{children}</main>
      </body>
    </html>
  );
}