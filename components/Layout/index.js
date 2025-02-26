import React from 'react';
import Header from './Header';

export default function Layout({ children, title, onLogout }) {
  return (
    <div className="container mx-auto p-4">
      <Header title={title} onLogout={onLogout} />
      {children}
    </div>
  );
}

