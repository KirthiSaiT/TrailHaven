'use client';

export default function Alert({ message, clearAlert }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-md">
      <p>{message}</p>
      <button
        onClick={clearAlert}
        className="mt-2 text-sm underline"
      >
        Dismiss
      </button>
    </div>
  );
}