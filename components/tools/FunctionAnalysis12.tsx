import React from 'react';
import KatexRenderer from '../ui/KatexRenderer';

const FunctionAnalysis12: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow text-center">
      <h3 className="text-2xl font-bold text-gray-700 mb-4">Công cụ Khảo sát và Vẽ đồ thị Hàm số</h3>
      <p className="text-gray-600 mb-4">
        Tính năng này sẽ cho phép bạn nhập vào một hàm số và tự động thực hiện các bước khảo sát, bao gồm:
      </p>
      <ul className="list-disc list-inside text-left mx-auto max-w-md text-gray-600 mb-6">
        <li>Tìm tập xác định</li>
        <li>Tính đạo hàm bậc nhất và bậc hai</li>
        <li>Tìm điểm cực trị, điểm uốn</li>
        <li>Xét tính đơn điệu, tính lồi lõm</li>
        <li>Tìm tiệm cận (đứng, ngang, xiên)</li>
        <li>Vẽ bảng biến thiên và đồ thị hàm số</li>
      </ul>
       <div className="flex justify-center items-center my-6 space-x-4 text-2xl">
          <KatexRenderer latex="y = ax^3 + bx^2 + cx + d" />
          <KatexRenderer latex="y = \frac{ax+b}{cx+d}" />
      </div>
      <p className="text-blue-600 font-semibold animate-pulse">
        Tính năng đang được phát triển và sẽ sớm ra mắt!
      </p>
    </div>
  );
};

export default FunctionAnalysis12;
