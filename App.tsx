import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import HomePage from './components/pages/HomePage';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen font-sans text-gray-800 bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white shadow-soft p-4 flex items-center transition-all">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg p-2 transition-colors"
            aria-label="Mở menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gradient ml-4">Công cụ Toán</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto animate-fadeIn">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tool/:toolId" element={<MainContent />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;