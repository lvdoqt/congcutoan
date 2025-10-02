import React from 'react';
import { TOOLS_MENU } from '../constants';
import type { ToolId } from '../types';

interface MainContentProps {
  activeToolId: ToolId | null;
}

const WelcomeScreen: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-blue-600 mb-4">Chào mừng bạn!</h2>
      <p className="text-lg text-gray-600">
        Chọn một công cụ từ menu bên trái để bắt đầu.
      </p>
      <p className="mt-2 text-gray-500">
        Ứng dụng này cung cấp các công cụ trực quan để bạn thực hành và khám phá các khái niệm toán học.
      </p>
    </div>
  </div>
);

const MainContent: React.FC<MainContentProps> = ({ activeToolId }) => {
  if (!activeToolId) {
    return <WelcomeScreen />;
  }

  const activeTool = TOOLS_MENU.flatMap(category => category.tools).find(tool => tool.id === activeToolId);

  if (!activeTool) {
    return <div className="text-center text-red-500">Lỗi: Không tìm thấy công cụ.</div>;
  }

  const ToolComponent = activeTool.component;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500">{activeTool.name}</h1>
      <ToolComponent />
    </div>
  );
};

export default MainContent;
