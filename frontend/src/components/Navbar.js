// src/components/Navbar.js
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl font-bold text-white">HavenTrail</h1>
        </Link>

        {/* Links */}
        <div className="flex space-x-6 items-center">
          <Link href="/about" className="text-white hover:text-blue-300 transition">
            About Us
          </Link>
          <Link href="/maps" className="text-white hover:text-blue-300 transition">
            Maps
          </Link>
          <Link href="/contact" className="text-white hover:text-blue-300 transition">
            Contact Us
          </Link>
          <Link href="/login">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}