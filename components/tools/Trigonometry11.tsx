import React, { useState } from 'react';
import KatexRenderer from '../ui/KatexRenderer';

const Trigonometry11: React.FC = () => {
    const [angle, setAngle] = useState('30');
    const [unit, setUnit] = useState<'deg' | 'rad'>('deg');
    const [calcResult, setCalcResult] = useState('');

    const [eqType, setEqType] = useState('sin');
    const [eqValue, setEqValue] = useState('0.5');
    const [eqResult, setEqResult] = useState('');
    const [eqError, setEqError] = useState('');

    const calculateTrigValue = (func: (val: number) => number) => {
        const angleVal = parseFloat(angle);
        if (isNaN(angleVal)) {
            setCalcResult('Giá trị góc không hợp lệ');
            return;
        }
        const radians = unit === 'deg' ? angleVal * Math.PI / 180 : angleVal;
        let result = func(radians);
        // Handle floating point inaccuracies for common values
        if (Math.abs(result) < 1e-10) result = 0;
        if (Math.abs(result - 1) < 1e-10) result = 1;
        if (Math.abs(result + 1) < 1e-10) result = -1;
        setCalcResult(result.toFixed(5));
    };

    const solveEquation = () => {
        setEqError('');
        setEqResult('');
        const m = parseFloat(eqValue);
        if (isNaN(m)) {
            setEqError('Giá trị m không hợp lệ.');
            return;
        }

        if (Math.abs(m) > 1 && (eqType === 'sin' || eqType === 'cos')) {
            setEqError('Phương trình vô nghiệm vì |m| > 1.');
            return;
        }

        let alphaRad = 0;
        switch (eqType) {
            case 'sin': alphaRad = Math.asin(m); break;
            case 'cos': alphaRad = Math.acos(m); break;
            case 'tan': alphaRad = Math.atan(m); break;
        }
        const alphaDeg = (alphaRad * 180 / Math.PI).toFixed(2);

        let solution = '';
        switch (eqType) {
            case 'sin':
                solution = `
                    <p class="mb-2">Với <KatexRenderer latex="\\alpha = \\arcsin(${m}) \\approx ${alphaDeg}^\\circ" /></p>
                    <KatexRenderer latex="x = \\alpha + k2\\pi" /> <br/>
                    <KatexRenderer latex="x = \\pi - \\alpha + k2\\pi" />
                    <p class="mt-2 text-sm">(k ∈ ℤ)</p>`;
                break;
            case 'cos':
                solution = `
                    <p class="mb-2">Với <KatexRenderer latex="\\alpha = \\arccos(${m}) \\approx ${alphaDeg}^\\circ" /></p>
                    <KatexRenderer latex="x = \\alpha + k2\\pi" /> <br/>
                    <KatexRenderer latex="x = -\\alpha + k2\\pi" />
                    <p class="mt-2 text-sm">(k ∈ ℤ)</p>`;
                break;
            case 'tan':
                solution = `
                    <p class="mb-2">Với <KatexRenderer latex="\\alpha = \\arctan(${m}) \\approx ${alphaDeg}^\\circ" /></p>
                    <KatexRenderer latex="x = \\alpha + k\\pi" />
                    <p class="mt-2 text-sm">(k ∈ ℤ)</p>`;
                break;
        }
        setEqResult(solution);
    }

    return (
        <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">1. Tính giá trị hàm lượng giác</h3>
                <div className="flex flex-wrap items-center gap-4">
                    <input type="number" value={angle} onChange={e => setAngle(e.target.value)} className="p-2 border rounded-md w-32" />
                    <select value={unit} onChange={e => setUnit(e.target.value as 'deg' | 'rad')} className="p-2 border rounded-md">
                        <option value="deg">Độ (°)</option>
                        <option value="rad">Radian</option>
                    </select>
                    <div className="flex gap-2">
                        <button onClick={() => calculateTrigValue(Math.sin)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">sin</button>
                        <button onClick={() => calculateTrigValue(Math.cos)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">cos</button>
                        <button onClick={() => calculateTrigValue(Math.tan)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">tan</button>
                        <button onClick={() => calculateTrigValue(x => 1/Math.tan(x))} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">cot</button>
                    </div>
                </div>
                {calcResult && (
                    <div className="mt-4 p-3 bg-gray-50 border rounded-md">
                        <span className="font-semibold text-gray-800">Kết quả:</span>
                        <span className="ml-2 text-green-700 font-bold text-lg">{calcResult}</span>
                    </div>
                )}
            </section>
            
            <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">2. Giải phương trình lượng giác cơ bản</h3>
                <div className="flex flex-wrap items-center gap-4">
                     <select value={eqType} onChange={e => setEqType(e.target.value)} className="p-2 border rounded-md">
                        <option value="sin">sin(x)</option>
                        <option value="cos">cos(x)</option>
                        <option value="tan">tan(x)</option>
                    </select>
                    <span className="font-bold">=</span>
                     <input type="number" value={eqValue} onChange={e => setEqValue(e.target.value)} placeholder="m" className="p-2 border rounded-md w-32" />
                    <button onClick={solveEquation} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Giải
                    </button>
                </div>
                
                 {(eqResult || eqError) && (
                    <div className="mt-6 p-4 rounded-md bg-gray-50 border">
                        <h4 className="font-semibold text-lg mb-2">Nghiệm của phương trình</h4>
                        {eqError && <p className="text-red-600 font-medium">{eqError}</p>}
                        {eqResult && <div className="text-green-700 space-y-1" dangerouslySetInnerHTML={{ __html: eqResult }} />}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Trigonometry11;
