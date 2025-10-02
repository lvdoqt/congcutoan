import React from 'react';
import { TOOLS_MENU } from '../constants';
import type { ToolId } from '../types';

interface SidebarProps {
  activeToolId: ToolId | null;
  setActiveToolId: (id: ToolId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeToolId, setActiveToolId }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0">
      <div className="p-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold text-center">Công cụ Toán</h1>
      </div>
      <nav className="p-4">
        <ul>
          {TOOLS_MENU.map((category) => (
            <li key={category.id} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {category.name}
              </h2>
              <ul>
                {category.tools.map((tool) => (
                  <li key={tool.id}>
                    <button
                      onClick={() => setActiveToolId(tool.id)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                        activeToolId === tool.id
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tool.name}
                    </button>
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
