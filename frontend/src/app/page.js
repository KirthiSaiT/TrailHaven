'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js
import Chatbot from '../components/Chatbot';
import Alert from '../components/Alert';
import io from 'socket.io-client';

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Connect to Socket.io for real-time alerts (mock for now)
    const socket = io('http://localhost:3001'); // Adjust URL when backend is added
    socket.on('alert', (message) => setAlert(message));

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">TrailHaven Dashboard</h1>
        <p className="text-gray-600 mt-2">Stay safe with real-time crime insights and navigation tools.</p>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map Section (Crime Hotspots & Safe Routes) */}
        <section className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Crime Hotspots & Safe Routes</h2>
          <Map setAlert={setAlert} />
        </section>

        {/* Chatbot Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Legal Assistance Chatbot</h2>
          <Chatbot />
        </section>
      </div>

      {/* Alerts Section */}
      <Alert message={alert} clearAlert={() => setAlert(null)} />

      {/* Optional Image Section */}
      {/* <div className="mt-8 flex justify-center">
        <Image
          src="/trailhaven-logo.png"
          alt="TrailHaven Logo"
          width={200}
          height={200}
          className="rounded-full shadow-lg"
        />
      </div> */}
    </div>
  );
}