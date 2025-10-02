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
    <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 z-40`}>
      <div className="p-4 bg-gray-900 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-center text-white" onClick={() => setIsOpen(false)}>
          Công cụ Toán
        </Link>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <nav className="p-4">
        <ul>
          {TOOLS_MENU.map((category) => (
            <li key={category.id} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {category.name}
              </h2>
              <ul>
                {category.tools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      to={`/tool/${tool.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                        activeToolId === tool.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'hover:bg-gray-700 text-gray-300'
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