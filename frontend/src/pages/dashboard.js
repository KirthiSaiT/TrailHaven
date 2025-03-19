// src/pages/admin/dashboard.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      router.push('/');
      return;
    }

    if (role !== 'admin') {
      router.push('/');
      return;
    }

    setUserRole(role);
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter((user) => user._id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  if (!userRole) {
    return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-lg mb-8">Welcome, Admin! Manage your application from here.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <div>
                      <p className="text-gray-100">{user.email}</p>
                      <p className="text-gray-400 text-sm">Role: {user.role}</p>
                    </div>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Reports</h2>
            <p className="text-gray-300 mb-4">Generate and view system reports.</p>
            <Link href="/admin/reports">
              <button className="px-4 py-2 bg-indigo-600 text-gray-100 rounded-lg hover:bg-indigo-700 transition-all duration-300">
                View Reports
              </button>
            </Link>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-300 mb-4">Configure system settings.</p>
            <Link href="/admin/settings">
              <button className="px-4 py-2 bg-indigo-600 text-gray-100 rounded-lg hover:bg-indigo-700 transition-all duration-300">
                Configure Settings
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-green-600 text-gray-100 rounded-lg hover:bg-green-700 transition-all duration-300">
              Add New User
            </button>
            <button className="px-6 py-3 bg-yellow-600 text-gray-100 rounded-lg hover:bg-yellow-700 transition-all duration-300">
              Generate Report
            </button>
            <button className="px-6 py-3 bg-red-600 text-gray-100 rounded-lg hover:bg-red-700 transition-all duration-300">
              Emergency Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}