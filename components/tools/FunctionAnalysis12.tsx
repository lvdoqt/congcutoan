import React, { useState, useRef } from 'react';
import * as math from 'mathjs';
import KatexRenderer from '../ui/KatexRenderer';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AnalysisResult {
  domain: string;
  derivative1: string;
  derivative2: string;
  criticalPoints: { x: number; y: number; type: string }[];
  inflectionPoints: { x: number; y: number }[];
  variationTable: any; // Simplified for now
}

const FunctionAnalysis12: React.FC = () => {
    const [funcStr, setFuncStr] = useState('x^3 - 3*x^2 + 2');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<any>(null);
    
    const nodeRef = useRef(null);

    const analyzeFunction = () => {
        try {
            setError(null);
            setResult(null);
            setChartData(null);
            const node = math.parse(funcStr);
            nodeRef.current = node;

            const derivative1Node = math.derivative(node, 'x');
            const derivative2Node = math.derivative(derivative1Node, 'x');
            
            const derivative1Str = derivative1Node.toString();
            const derivative2Str = derivative2Node.toString();

            // --- Find Critical Points (y' = 0) ---
            // This is a simplified solver for polynomials up to degree 2 (for y')
            let criticalPoints: { x: number; y: number; type: string }[] = [];
            const simplifiedDeriv1 = math.simplify(derivative1Node);
            
            if (simplifiedDeriv1.isPolynomial()) {
                const coeffs = (simplifiedDeriv1 as any).getCoefficients().reverse(); // [c, b, a] for ax^2+bx+c
                if (coeffs.length === 3) { // Quadratic a*x^2 + b*x + c = 0
                    const [a, b, c] = coeffs;
                    const delta = b * b - 4 * a * c;
                    if (delta >= 0) {
                        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
                        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
                        [x1, x2].forEach(x => {
                             if (!isNaN(x)) criticalPoints.push({x, y: 0, type: ''});
                        });
                    }
                } else if (coeffs.length === 2) { // Linear b*x + c = 0
                    const [b, c] = coeffs;
                    if (b !== 0) criticalPoints.push({ x: -c / b, y: 0, type: '' });
                }
            }
            
            // --- Find Inflection Points (y'' = 0) ---
            let inflectionPoints: { x: number; y: number }[] = [];
             const simplifiedDeriv2 = math.simplify(derivative2Node);
             if (simplifiedDeriv2.isPolynomial()) {
                const coeffs = (simplifiedDeriv2 as any).getCoefficients().reverse();
                 if (coeffs.length === 2) { // Linear b*x + c = 0
                    const [b, c] = coeffs;
                     if (b !== 0) inflectionPoints.push({ x: -c / b, y: 0 });
                }
             }

            // --- Evaluate points and determine type ---
            criticalPoints = criticalPoints.map(p => {
                const y = node.evaluate({ x: p.x });
                const y_double_prime = derivative2Node.evaluate({ x: p.x });
                let type = 'Không xác định';
                if (y_double_prime > 0) type = 'Cực tiểu';
                if (y_double_prime < 0) type = 'Cực đại';
                return { ...p, y, type };
            });

             inflectionPoints = inflectionPoints.map(p => ({
                ...p,
                y: node.evaluate({ x: p.x }),
             }));

            setResult({
                domain: 'D = R',
                derivative1: derivative1Str,
                derivative2: derivative2Str,
                criticalPoints,
                inflectionPoints,
                variationTable: null,
            });

            // --- Generate Chart Data ---
            generateChartData(node, criticalPoints);

        } catch (e: any) {
            setError(`Lỗi phân tích hàm số: ${e.message}. Vui lòng kiểm tra lại cú pháp (ví dụ: x^3 - 3*x).`);
        }
    };

    const generateChartData = (node: math.MathNode, criticalPoints: any[]) => {
        const xValues = [];
        const yValues = [];
        
        const xCoords = criticalPoints.map(p => p.x);
        const minX = xCoords.length > 0 ? Math.min(...xCoords) - 2 : -5;
        const maxX = xCoords.length > 0 ? Math.max(...xCoords) + 2 : 5;
        const step = (maxX - minX) / 100;

        for (let x = minX; x <= maxX; x += step) {
            xValues.push(x.toFixed(2));
            yValues.push(node.evaluate({ x }));
        }

        setChartData({
            labels: xValues,
            datasets: [{
                label: `y = ${funcStr}`,
                data: yValues,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.1,
            }]
        });
    };

    return (
        <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow-inner border">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Nhập hàm số</h3>
                <div className="flex flex-wrap items-center gap-4">
                    <span className="font-mono text-lg">y =</span>
                    <input 
                        type="text" 
                        value={funcStr} 
                        onChange={e => setFuncStr(e.target.value)} 
                        placeholder="VD: x^3 - 3*x + 2" 
                        className="p-2 border rounded-md w-full md:w-80 font-mono"
                    />
                    <button onClick={analyzeFunction} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Khảo sát
                    </button>
                </div>
                 <p className="text-sm text-gray-500 mt-2">Hiện tại hỗ trợ các hàm đa thức bậc 2, 3. Sử dụng `*` cho phép nhân, ví dụ: `3*x^2`.</p>
            </section>
            
            {error && <div className="p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">{error}</div>}

            {result && (
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-lg shadow-inner border">
                        <h3 className="text-xl font-semibold text-blue-700 mb-4">Kết quả Khảo sát</h3>
                        <div className="space-y-3 text-gray-800">
                             <p><strong>Tập xác định:</strong> {result.domain}</p>
                            <p><strong>Đạo hàm bậc nhất (y'):</strong> <KatexRenderer latex={math.parse(result.derivative1).toTex()} /></p>
                            <p><strong>Đạo hàm bậc hai (y''):</strong> <KatexRenderer latex={math.parse(result.derivative2).toTex()} /></p>
                            
                            <div>
                                <strong>Điểm cực trị:</strong>
                                {result.criticalPoints.length > 0 ? (
                                    <ul className="list-disc list-inside ml-4">
                                        {result.criticalPoints.map((p, i) => (
                                            <li key={i}>
                                                {p.type} tại <KatexRenderer latex={`(${p.x.toFixed(2)}; ${p.y.toFixed(2)})`} />
                                            </li>
                                        ))}
                                    </ul>
                                ) : ( <p className="ml-4">Không có điểm cực trị.</p> )
                                }
                            </div>
                            <div>
                                <strong>Điểm uốn:</strong>
                                 {result.inflectionPoints.length > 0 ? (
                                    <ul className="list-disc list-inside ml-4">
                                        {result.inflectionPoints.map((p, i) => (
                                            <li key={i}>
                                               Điểm uốn tại <KatexRenderer latex={`(${p.x.toFixed(2)}; ${p.y.toFixed(2)})`} />
                                            </li>
                                        ))}
                                    </ul>
                                ) : ( <p className="ml-4">Không có điểm uốn.</p> )
                                }
                            </div>
                        </div>
                    </section>
                    
                    {chartData && (
                        <section className="bg-white p-6 rounded-lg shadow-inner border">
                            <h3 className="text-xl font-semibold text-blue-700 mb-4">Đồ thị Hàm số</h3>
                            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default FunctionAnalysis12;