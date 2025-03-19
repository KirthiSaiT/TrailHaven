'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function LoginModal({ setUser, closeModal }) {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [policeId, setPoliceId] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin' && (!policeId || !photo)) {
      alert('Police ID and photo are required for admin login.');
      return;
    }
    // Mock login (MongoDB will replace this later)
    setUser({ role, username, ...(role === 'admin' && { policeId, photo }) });
    closeModal();
  };

  return (
    <Dialog open={true} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <Dialog.Title className="text-lg font-bold">Login</Dialog.Title>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            {role === 'admin' && (
              <>
                <div>
                  <label className="block text-sm font-medium">Police ID</label>
                  <input
                    type="text"
                    value={policeId}
                    onChange={(e) => setPoliceId(e.target.value)}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Upload Photo</label>
                  <input
                    type="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    className="mt-1 block w-full"
                    required
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
}