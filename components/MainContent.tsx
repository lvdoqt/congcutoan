import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TOOLS_MENU } from '../constants';

const MainContent: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();

  if (!toolId) {
    // This case should ideally not be hit if routing is set up correctly,
    // but as a fallback, redirect to home.
    return <Navigate to="/" />;
  }

  const activeTool = TOOLS_MENU.flatMap(category => category.tools).find(tool => tool.id === toolId);

  if (!activeTool) {
    return <div className="text-center text-red-500">Lỗi: Không tìm thấy công cụ.</div>;
  }

  const ToolComponent = activeTool.component;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-soft hover:shadow-hover transition-all animate-fadeIn">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 pb-4 border-b-4 border-gradient-primary">
        {activeTool.name}
      </h1>
      <ToolComponent />
    </div>
  );
};

export default MainContent;