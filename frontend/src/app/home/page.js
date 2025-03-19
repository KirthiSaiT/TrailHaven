'use client';

import { useState, useEffect } from 'react';
import Map from '../../components/Map';
import Chatbot from '../../components/Chatbot';
import Alert from '../../components/Alert';
import io from 'socket.io-client';

export default function Home() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Connect to Socket.io (mock for now, backend later)
    const socket = io('http://localhost:3001'); // Adjust URL when backend is added
    socket.on('alert', (message) => setAlert(message));

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-2">
        <h2 className="text-2xl font-bold mb-4">Crime Hotspot Map & Safe Routes</h2>
        <Map setAlert={setAlert} />
      </div>
      <div>
        <Chatbot />
      </div>
      <Alert message={alert} clearAlert={() => setAlert(null)} />
    </div>
  );
}