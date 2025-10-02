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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500">{activeTool.name}</h1>
      <ToolComponent />
    </div>
  );
};

export default MainContent;