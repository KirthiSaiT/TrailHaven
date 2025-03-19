'use client';

import { useState } from 'react';

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const responses = {
    "how to report a crime?": "Call 100 or visit your nearest police station.",
    "what is this app?": "TrailHaven helps you navigate safely with crime data and legal assistance.",
  };

  const handleSend = () => {
    if (!message) return;
    const reply = responses[message.toLowerCase()] || "Sorry, I don’t have an answer for that yet.";
    setChat([...chat, { user: message, bot: reply }]);
    setMessage('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">Chatbot</h3>
      <div className="h-48 overflow-y-auto mb-2">
        {chat.map((entry, idx) => (
          <div key={idx} className="mb-2">
            <p className="text-blue-600">You: {entry.user}</p>
            <p className="text-gray-600">Bot: {entry.bot}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border rounded-md p-2 mb-2"
        placeholder="Ask something..."
      />
      <button
        onClick={handleSend}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}