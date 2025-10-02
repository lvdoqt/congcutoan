import type { ToolCategory } from './types';
import TriangleRelations10 from './components/tools/TriangleRelations10';
import Trigonometry11 from './components/tools/Trigonometry11';
import FunctionAnalysis12 from './components/tools/FunctionAnalysis12';
import ScientificCalculator from './components/tools/ScientificCalculator';

export const TOOLS_MENU: ToolCategory[] = [
  {
    id: 'general',
    name: 'Công cụ chung',
    tools: [
      {
        id: 'scientific-calculator',
        name: 'Máy tính khoa học',
        component: ScientificCalculator,
      },
    ],
  },
  {
    id: 'grade-10',
    name: 'Toán Lớp 10',
    tools: [
      {
        id: 'triangle-relations-10',
        name: 'Hệ thức lượng trong tam giác',
        component: TriangleRelations10,
      },
    ],
  },
  {
    id: 'grade-11',
    name: 'Toán Lớp 11',
    tools: [
      {
        id: 'trigonometry-11',
        name: 'Tính toán Lượng giác',
        component: Trigonometry11,
      },
    ],
  },
  {
    id: 'grade-12',
    name: 'Toán Lớp 12',
    tools: [
      {
        id: 'function-analysis-12',
        name: 'Khảo sát hàm số',
        component: FunctionAnalysis12,
      },
    ],
  },
];
