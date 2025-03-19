// src/components/AuthCard.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AuthCard({ onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    policeId: '',
    idPicture: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const url = `http://localhost:5000/api/auth/${isRegister ? 'register' : 'login'}`;
    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    if (role === 'admin' && isRegister) {
      formDataToSend.append('role', role);
      formDataToSend.append('policeId', formData.policeId);
      if (formData.idPicture) {
        formDataToSend.append('idPicture', formData.idPicture);
      }
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: isRegister ? formDataToSend : JSON.stringify({ email: formData.email, password: formData.password }),
        headers: isRegister ? {} : { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (res.ok) {
        if (isRegister) {
          setMessage('Registration successful! Please log in.');
          setIsRegister(false);
          setFormData({ email: '', password: '', policeId: '', idPicture: null });
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          // Set adminLoginSuccess flag correctly
          if (data.role === 'admin') {
            localStorage.setItem('adminLoginSuccess', 'true');
          } else {
            localStorage.setItem('adminLoginSuccess', 'false');
          }
          onClose();
          window.location.reload(); // Refresh the page to update the navbar
        }
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl w-96 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-100">
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        {message && (
          <div className={`mb-4 p-2 rounded-lg ${message.includes('successful') ? 'bg-green-600' : 'bg-red-600'} text-gray-100`}>
            {message}
          </div>
        )}

        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => setRole('user')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              role === 'user'
                ? 'bg-indigo-600 text-gray-100 shadow-md'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
            disabled={loading}
          >
            User
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              role === 'admin'
                ? 'bg-indigo-600 text-gray-100 shadow-md'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
            disabled={loading}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-400"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {role === 'admin' && isRegister && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Police ID"
                  className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-400"
                  value={formData.policeId}
                  onChange={(e) => setFormData({ ...formData, policeId: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  onChange={(e) => setFormData({ ...formData, idPicture: e.target.files[0] })}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full bg-indigo-600 text-gray-100 p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
            disabled={loading}
          >
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 font-medium transition-colors duration-300"
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}