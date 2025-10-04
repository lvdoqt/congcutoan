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
  limitAtInfinity: { posInf: string; negInf: string };
  asymptotes: { vertical: number[]; horizontal: number | null; oblique: string | null };
  monotonicity: { interval: string; trend: string }[];
  concavity: { interval: string; type: string }[];
}

const FunctionAnalysis12: React.FC = () => {
    const [funcStr, setFuncStr] = useState('x^3 - 3*x^2 + 2');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<any>(null);
    const [variationData, setVariationData] = useState<any>(null);
    
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

            const limitAtInfinity = calculateLimits(node);
            const asymptotes = findAsymptotes(node, funcStr);
            const monotonicity = analyzeMonotonicity(derivative1Node, criticalPoints);
            const concavity = analyzeConcavity(derivative2Node, inflectionPoints);

            setResult({
                domain: 'D = ℝ',
                derivative1: derivative1Str,
                derivative2: derivative2Str,
                criticalPoints,
                inflectionPoints,
                limitAtInfinity,
                asymptotes,
                monotonicity,
                concavity,
            });

            buildVariationTable(criticalPoints, monotonicity);

            generateChartData(node, criticalPoints, inflectionPoints);

        } catch (e: any) {
            setError(`Lỗi phân tích hàm số: ${e.message}. Vui lòng kiểm tra lại cú pháp (ví dụ: x^3 - 3*x).`);
        }
    };

    const calculateLimits = (node: math.MathNode) => {
        try {
            const posInfVal = node.evaluate({ x: 10000 });
            const negInfVal = node.evaluate({ x: -10000 });
            return {
                posInf: isFinite(posInfVal) ? (Math.abs(posInfVal) > 1000 ? (posInfVal > 0 ? '+∞' : '-∞') : posInfVal.toFixed(2)) : '+∞',
                negInf: isFinite(negInfVal) ? (Math.abs(negInfVal) > 1000 ? (negInfVal > 0 ? '+∞' : '-∞') : negInfVal.toFixed(2)) : '-∞',
            };
        } catch {
            return { posInf: 'Không xác định', negInf: 'Không xác định' };
        }
    };

    const findAsymptotes = (node: math.MathNode, funcStr: string) => {
        const asymptotes: { vertical: number[]; horizontal: number | null; oblique: string | null } = {
            vertical: [],
            horizontal: null,
            oblique: null,
        };

        if (funcStr.includes('/')) {
            const testPoints = [-100, -10, -1, 0, 1, 10, 100];
            for (const x of testPoints) {
                try {
                    const y = node.evaluate({ x });
                    if (!isFinite(y)) asymptotes.vertical.push(x);
                } catch {}
            }
        }

        try {
            const yAtLargeX = node.evaluate({ x: 10000 });
            if (isFinite(yAtLargeX) && Math.abs(yAtLargeX) < 1000) {
                asymptotes.horizontal = Number(yAtLargeX.toFixed(2));
            }
        } catch {}

        return asymptotes;
    };

    const analyzeMonotonicity = (derivative1Node: math.MathNode, criticalPoints: any[]) => {
        const monotonicity: { interval: string; trend: string }[] = [];
        const criticalXs = criticalPoints.map(p => p.x).sort((a, b) => a - b);

        if (criticalXs.length === 0) {
            const testY = derivative1Node.evaluate({ x: 0 });
            monotonicity.push({
                interval: '(-∞, +∞)',
                trend: testY > 0 ? 'Tăng' : 'Giảm',
            });
        } else {
            const testX1 = criticalXs[0] - 1;
            const testY1 = derivative1Node.evaluate({ x: testX1 });
            monotonicity.push({
                interval: `(-∞, ${criticalXs[0].toFixed(2)})`,
                trend: testY1 > 0 ? 'Tăng' : 'Giảm',
            });

            for (let i = 0; i < criticalXs.length - 1; i++) {
                const testX = (criticalXs[i] + criticalXs[i + 1]) / 2;
                const testY = derivative1Node.evaluate({ x: testX });
                monotonicity.push({
                    interval: `(${criticalXs[i].toFixed(2)}, ${criticalXs[i + 1].toFixed(2)})`,
                    trend: testY > 0 ? 'Tăng' : 'Giảm',
                });
            }

            const testXn = criticalXs[criticalXs.length - 1] + 1;
            const testYn = derivative1Node.evaluate({ x: testXn });
            monotonicity.push({
                interval: `(${criticalXs[criticalXs.length - 1].toFixed(2)}, +∞)`,
                trend: testYn > 0 ? 'Tăng' : 'Giảm',
            });
        }

        return monotonicity;
    };

    const analyzeConcavity = (derivative2Node: math.MathNode, inflectionPoints: any[]) => {
        const concavity: { interval: string; type: string }[] = [];
        const inflectionXs = inflectionPoints.map(p => p.x).sort((a, b) => a - b);

        if (inflectionXs.length === 0) {
            const testY = derivative2Node.evaluate({ x: 0 });
            concavity.push({
                interval: '(-∞, +∞)',
                type: testY > 0 ? 'Lồi' : 'Lõm',
            });
        } else {
            const testX1 = inflectionXs[0] - 1;
            const testY1 = derivative2Node.evaluate({ x: testX1 });
            concavity.push({
                interval: `(-∞, ${inflectionXs[0].toFixed(2)})`,
                type: testY1 > 0 ? 'Lồi' : 'Lõm',
            });

            for (let i = 0; i < inflectionXs.length - 1; i++) {
                const testX = (inflectionXs[i] + inflectionXs[i + 1]) / 2;
                const testY = derivative2Node.evaluate({ x: testX });
                concavity.push({
                    interval: `(${inflectionXs[i].toFixed(2)}, ${inflectionXs[i + 1].toFixed(2)})`,
                    type: testY > 0 ? 'Lồi' : 'Lõm',
                });
            }

            const testXn = inflectionXs[inflectionXs.length - 1] + 1;
            const testYn = derivative2Node.evaluate({ x: testXn });
            concavity.push({
                interval: `(${inflectionXs[inflectionXs.length - 1].toFixed(2)}, +∞)`,
                type: testYn > 0 ? 'Lồi' : 'Lõm',
            });
        }

        return concavity;
    };

    const buildVariationTable = (criticalPoints: any[], monotonicity: any[]) => {
        const tableData: any[] = [];

        monotonicity.forEach((item, idx) => {
            const critPoint = criticalPoints.find(cp => item.interval.includes(cp.x.toFixed(2)));
            tableData.push({
                interval: item.interval,
                derivative: item.trend === 'Tăng' ? '+' : '-',
                function: item.trend,
                criticalPoint: critPoint ? `(${critPoint.x.toFixed(2)}, ${critPoint.y.toFixed(2)})` : null,
            });
        });

        setVariationData(tableData);
    };

    const generateChartData = (node: math.MathNode, criticalPoints: any[], inflectionPoints: any[]) => {
        const xValues = [];
        const yValues = [];

        const allXs = [...criticalPoints.map(p => p.x), ...inflectionPoints.map(p => p.x)];
        const minX = allXs.length > 0 ? Math.min(...allXs) - 3 : -5;
        const maxX = allXs.length > 0 ? Math.max(...allXs) + 3 : 5;
        const step = (maxX - minX) / 200;

        for (let x = minX; x <= maxX; x += step) {
            try {
                const y = node.evaluate({ x });
                if (isFinite(y) && Math.abs(y) < 10000) {
                    xValues.push(x.toFixed(2));
                    yValues.push(y);
                }
            } catch {}
        }

        setChartData({
            labels: xValues,
            datasets: [{
                label: `y = ${funcStr}`,
                data: yValues,
                borderColor: 'rgb(14, 165, 233)',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 3,
            }]
        });
    };

    return (
        <div className="space-y-8">
            <section className="bg-gradient-to-br from-sky-50 to-white p-6 md:p-8 rounded-2xl shadow-soft border border-sky-100">
                <h3 className="text-2xl font-bold text-sky-700 mb-6">Nhập hàm số</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <span className="font-mono text-xl font-semibold text-gray-700">y =</span>
                    <input
                        type="text"
                        value={funcStr}
                        onChange={e => setFuncStr(e.target.value)}
                        placeholder="VD: x^3 - 3*x^2 + 2"
                        className="flex-1 p-3 border-2 border-sky-200 rounded-xl w-full md:w-auto font-mono text-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                    />
                    <button
                        onClick={analyzeFunction}
                        className="bg-gradient-primary text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all w-full md:w-auto"
                    >
                        Khảo sát
                    </button>
                </div>
                <p className="text-sm text-gray-600 mt-4 bg-white p-3 rounded-lg border-l-4 border-sky-500">
                    Hỗ trợ hàm đa thức (bậc 2, 3, 4) và hàm hữu tỷ. Sử dụng <code className="bg-gray-100 px-2 py-1 rounded">*</code> cho phép nhân, ví dụ: <code className="bg-gray-100 px-2 py-1 rounded">3*x^2</code>
                </p>
            </section>
            
            {error && (
                <div className="p-5 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-xl shadow-soft animate-fadeIn">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="font-medium">{error}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-fadeIn">
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-soft border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-3xl">📊</span> Kết quả Khảo sát
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-sky-50 p-4 rounded-xl border-l-4 border-sky-500">
                                    <p className="font-semibold text-gray-700 mb-1">Tập xác định:</p>
                                    <p className="text-lg font-mono">{result.domain}</p>
                                </div>

                                <div className="bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-500">
                                    <p className="font-semibold text-gray-700 mb-2">Đạo hàm bậc nhất:</p>
                                    <div className="text-lg"><KatexRenderer latex={`y' = ${math.parse(result.derivative1).toTex()}`} /></div>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500">
                                    <p className="font-semibold text-gray-700 mb-2">Đạo hàm bậc hai:</p>
                                    <div className="text-lg"><KatexRenderer latex={`y'' = ${math.parse(result.derivative2).toTex()}`} /></div>
                                </div>

                                <div className="bg-teal-50 p-4 rounded-xl border-l-4 border-teal-500">
                                    <p className="font-semibold text-gray-700 mb-2">Giới hạn:</p>
                                    <div className="space-y-1 text-gray-700">
                                        <p><KatexRenderer latex={`\\lim_{x \\to +\\infty} f(x) = ${result.limitAtInfinity.posInf}`} /></p>
                                        <p><KatexRenderer latex={`\\lim_{x \\to -\\infty} f(x) = ${result.limitAtInfinity.negInf}`} /></p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
                                    <p className="font-semibold text-gray-700 mb-2">Điểm cực trị:</p>
                                    {result.criticalPoints.length > 0 ? (
                                        <ul className="space-y-2">
                                            {result.criticalPoints.map((p, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-purple-600 font-bold">•</span>
                                                    <span>{p.type} tại <KatexRenderer latex={`(${p.x.toFixed(2)}; ${p.y.toFixed(2)})`} /></span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600 italic">Không có điểm cực trị</p>
                                    )}
                                </div>

                                <div className="bg-rose-50 p-4 rounded-xl border-l-4 border-rose-500">
                                    <p className="font-semibold text-gray-700 mb-2">Điểm uốn:</p>
                                    {result.inflectionPoints.length > 0 ? (
                                        <ul className="space-y-2">
                                            {result.inflectionPoints.map((p, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-rose-600 font-bold">•</span>
                                                    <span>Điểm uốn tại <KatexRenderer latex={`(${p.x.toFixed(2)}; ${p.y.toFixed(2)})`} /></span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600 italic">Không có điểm uốn</p>
                                    )}
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-500">
                                    <p className="font-semibold text-gray-700 mb-2">Tính đơn điệu:</p>
                                    <ul className="space-y-1 text-sm">
                                        {result.monotonicity.map((m, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m.trend === 'Tăng' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                    {m.trend === 'Tăng' ? '↗' : '↘'}
                                                </span>
                                                <span>{m.interval}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-cyan-50 p-4 rounded-xl border-l-4 border-cyan-500">
                                    <p className="font-semibold text-gray-700 mb-2">Tính lồi/lõm:</p>
                                    <ul className="space-y-1 text-sm">
                                        {result.concavity.map((c, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.type === 'Lồi' ? 'bg-blue-200 text-blue-800' : 'bg-orange-200 text-orange-800'}`}>
                                                    {c.type === 'Lồi' ? '⌢' : '⌣'}
                                                </span>
                                                <span>{c.interval}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {variationData && variationData.length > 0 && (
                        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-soft border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="text-3xl">📈</span> Bảng biến thiên
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border-2 border-gray-300 p-3 font-semibold">Khoảng</th>
                                            <th className="border-2 border-gray-300 p-3 font-semibold">y'</th>
                                            <th className="border-2 border-gray-300 p-3 font-semibold">y</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variationData.map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="border-2 border-gray-300 p-3 text-center font-mono">{row.interval}</td>
                                                <td className="border-2 border-gray-300 p-3 text-center font-bold text-lg">{row.derivative}</td>
                                                <td className="border-2 border-gray-300 p-3 text-center">
                                                    <span className={`font-semibold ${row.function === 'Tăng' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {row.function}
                                                    </span>
                                                    {row.criticalPoint && <div className="text-xs text-gray-600 mt-1">{row.criticalPoint}</div>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                    
                    {chartData && (
                        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-soft border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="text-3xl">📉</span> Đồ thị Hàm số
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <Line
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        plugins: {
                                            legend: { display: true, position: 'top' },
                                            tooltip: { enabled: true },
                                        },
                                        scales: {
                                            x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                                            y: { grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                                        },
                                    }}
                                />
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default FunctionAnalysis12;