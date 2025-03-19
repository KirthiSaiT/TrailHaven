
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
    idPicture: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = role === 'admin' && isRegister 
      ? formData 
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isRegister ? 'Register' : 'Login'}
        </h2>
        
        <div className="mb-4">
          <button 
            onClick={() => setRole('user')} 
            className={`mr-2 px-4 py-2 ${role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            User
          </button>
          <button 
            onClick={() => setRole('admin')} 
            className={`px-4 py-2 ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          {role === 'admin' && isRegister && (
            <>
              <input
                type="text"
                placeholder="Police ID"
                className="w-full p-2 mb-4 border rounded"
                value={formData.policeId}
                onChange={(e) => setFormData({...formData, policeId: e.target.value})}
              />
              <input
                type="file"
                className="w-full p-2 mb-4"
                onChange={(e) => setFormData({...formData, idPicture: e.target.files[0]})}
              />
            </>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <button 
          onClick={() => setIsRegister(!isRegister)}
          className="mt-2 text-blue-600"
        >
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
        <button 
          onClick={onClose}
          className="mt-2 text-gray-600"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}