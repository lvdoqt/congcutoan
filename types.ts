import type React from 'react';

export type ToolId = 'triangle-relations-10' | 'trigonometry-11' | 'function-analysis-12' | 'scientific-calculator';

export interface Tool {
  id: ToolId;
  name: string;
  component: React.FC;
}

export interface ToolCategory {
  id: string;
  name: string;
  tools: Tool[];
}
