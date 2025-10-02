
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import type { ToolId } from './types';

function App() {
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);

  return (
    <div className="flex h-screen font-sans text-gray-800">
      <Sidebar activeToolId={activeToolId} setActiveToolId={setActiveToolId} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <MainContent activeToolId={activeToolId} />
      </main>
    </div>
  );
}

export default App;
