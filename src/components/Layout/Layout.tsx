import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MatrixBackground } from '../UI/MatrixBackground';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <MatrixBackground />
      <div className="flex h-screen relative z-10">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6 bg-gray-900/50 backdrop-blur-sm">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};