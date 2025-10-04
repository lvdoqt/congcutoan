import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { TOOLS_MENU } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { toolId: activeToolId } = useParams<{ toolId: string }>();

  return (
    <aside className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 z-40`}>
      <div className="p-6 bg-gray-950 bg-opacity-50 flex justify-between items-center border-b border-gray-700">
        <Link to="/" className="text-2xl font-bold text-white hover:text-sky-400 transition-colors" onClick={() => setIsOpen(false)}>
          Công cụ Toán
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
          aria-label="Đóng menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
        <ul className="space-y-6">
          {TOOLS_MENU.map((category, idx) => (
            <li key={category.id} className="animate-slideIn" style={{ animationDelay: `${idx * 0.1}s` }}>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                {category.name}
              </h2>
              <ul className="space-y-1">
                {category.tools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      to={`/tool/${tool.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeToolId === tool.id
                          ? 'bg-gradient-primary text-white font-semibold shadow-lg scale-105'
                          : 'hover:bg-gray-700 text-gray-300 hover:text-white hover:translate-x-1'
                      }`}
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;