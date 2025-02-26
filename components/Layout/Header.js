import React from 'react';

export default function Header({ title, onLogout }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button 
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>
  );
}
