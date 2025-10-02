import React, { useState } from 'react';
import KatexRenderer from '../ui/KatexRenderer';

const Trigonometry11: React.FC = () => {
    const [angle, setAngle] = useState('30');
    const [unit, setUnit] = useState<'deg' | 'rad'>('deg');
    const [result, setResult] = useState<{ sin: string, cos: string, tan: string, cot: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const f = (num: number, precision = 4) => parseFloat(num.toFixed(precision));

    const calculate = () => {
        setResult(null);
        setError(null);

        const angleValue = parseFloat(angle);
        if (isNaN(angleValue)) {
            setError('Giá trị góc không hợp lệ.');
            return;
        }

        const angleInRadians = unit === 'deg' ? angleValue * Math.PI / 180 : angleValue;
        
        const sinVal = Math.sin(angleInRadians);
        const cosVal = Math.cos(angleInRadians);
        const tanVal = Math.tan(angleInRadians);
        
        let tanStr: string;
        let cotStr: string;

        // Check for vertical asymptotes for tan and cot
        const cosIsZero = Math.abs(cosVal) < 1e-10;
        const sinIsZero = Math.abs(sinVal) < 1e-10;

        if (cosIsZero) {
            tanStr = 'Không xác định';
            cotStr = '0';
        } else if (sinIsZero) {
            tanStr = '0';
            cotStr = 'Không xác định';
        } else {
            tanStr = String(f(tanVal));
            cotStr = String(f(1 / tanVal));
        }

        setResult({
            sin: String(f(sinVal)),
            cos: String(f(cosVal)),
            tan: tanStr,
            cot: cotStr
        });
    };


    return (
        <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Lý thuyết cơ bản</h3>
                <div className="space-y-4 text-gray-700">
                    <div>
                        <strong>1. Hệ thức cơ bản:</strong> <KatexRenderer latex="\sin^2 \alpha + \cos^2 \alpha = 1" />
                    </div>
                    <div>
                        <strong>2. Định nghĩa Tang và Cotang:</strong>
                         <div className="ml-4 mt-2 space-y-2">
                             <p><KatexRenderer latex="\tan \alpha = \frac{\sin \alpha}{\cos \alpha} \quad (\cos \alpha \neq 0)" /></p>
                             <p><KatexRenderer latex="\cot \alpha = \frac{\cos \alpha}{\sin \alpha} \quad (\sin \alpha \neq 0)" /></p>
                             <p><KatexRenderer latex="\tan \alpha \cdot \cot \alpha = 1" /></p>
                        </div>
                    </div>
                     <div>
                        <strong>3. Cung liên kết (Góc đặc biệt):</strong>
                         <div className="ml-4 mt-2 space-y-2">
                            <p><strong>Đối:</strong> <KatexRenderer latex="\sin(-\alpha) = -\sin \alpha, \quad \cos(-\alpha) = \cos \alpha" /></p>
                            <p><strong>Bù:</strong> <KatexRenderer latex="\sin(\pi - \alpha) = \sin \alpha, \quad \cos(\pi - \alpha) = -\cos \alpha" /></p>
                            <p><strong>Phụ:</strong> <KatexRenderer latex="\sin(\frac{\pi}{2} - \alpha) = \cos \alpha, \quad \cos(\frac{\pi}{2} - \alpha) = \sin \alpha" /></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Thực hành: Tính giá trị lượng giác</h3>
                <p className="text-gray-600 mb-4">Nhập một góc để tính các giá trị sin, cos, tan, cot tương ứng.</p>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                     <label className="flex items-center space-x-2">
                        <span className="font-semibold">Góc:</span>
                        <input type="number" value={angle} onChange={e => setAngle(e.target.value)} placeholder="VD: 30" className="p-2 border rounded-md w-40" />
                    </label>
                    <div className="flex items-center space-x-4">
                         <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="unit" value="deg" checked={unit === 'deg'} onChange={() => setUnit('deg')} className="form-radio text-blue-600"/>
                            <span>Độ (°)</span>
                        </label>
                         <label className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="unit" value="rad" checked={unit === 'rad'} onChange={() => setUnit('rad')} className="form-radio text-blue-600"/>
                            <span>Radian (rad)</span>
                        </label>
                    </div>
                </div>

                <div className="text-center">
                    <button onClick={calculate} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Tính toán
                    </button>
                </div>
                
                {(result || error) && (
                    <div className="mt-6 p-4 rounded-md bg-gray-50 border">
                        <h4 className="font-semibold text-lg mb-2">Kết quả</h4>
                        {error && <p className="text-red-600 font-medium">{error}</p>}
                        {result && (
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-800">
                                <p><KatexRenderer latex={`\\sin(${angle}${unit === 'deg' ? '^{\\circ}' : ''}) \\approx ${result.sin}`} /></p>
                                <p><KatexRenderer latex={`\\cos(${angle}${unit === 'deg' ? '^{\\circ}' : ''}) \\approx ${result.cos}`} /></p>
                                <p><KatexRenderer latex={`\\tan(${angle}${unit === 'deg' ? '^{\\circ}' : ''}) = ${result.tan}`} /></p>
                                <p><KatexRenderer latex={`\\cot(${angle}${unit === 'deg' ? '^{\\circ}' : ''}) = ${result.cot}`} /></p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Trigonometry11;
