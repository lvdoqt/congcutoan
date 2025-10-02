import React, { useState } from 'react';
import KatexRenderer from '../ui/KatexRenderer';

const TriangleRelations10: React.FC = () => {
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    const [angleA, setAngleA] = useState('');
    const [angleB, setAngleB] = useState('');
    const [angleC, setAngleC] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const degToRad = (degrees: number) => degrees * Math.PI / 180;
    const radToDeg = (radians: number) => radians * 180 / Math.PI;
    const f = (num: number) => parseFloat(num.toFixed(4)); // Format to 4 decimal places

    const calculate = () => {
        setResult(null);
        setError(null);

        const sideA = parseFloat(a);
        const sideB = parseFloat(b);
        const sideC = parseFloat(c);
        const angA = parseFloat(angleA);
        const angB = parseFloat(angleB);
        const angC = parseFloat(angleC);

        const sides = [sideA, sideB, sideC].filter(s => !isNaN(s) && s > 0);
        const angles = [angA, angB, angC].filter(ang => !isNaN(ang) && ang > 0);

        // --- VALIDATION ---
        if (sides.length + angles.length < 3) {
            setError('Vui lòng nhập ít nhất 3 giá trị.');
            return;
        }
        if (sides.length === 0) {
            setError('Phải có ít nhất một cạnh được cung cấp.');
            return;
        }
        if (angles.reduce((sum, val) => sum + val, 0) >= 180) {
            setError('Tổng các góc không thể lớn hơn hoặc bằng 180 độ.');
            return;
        }

        let resA = sideA, resB = sideB, resC = sideC, resAngA = angA, resAngB = angB, resAngC = angC;

        try {
            // Case SSS: 3 sides
            if (sides.length === 3) {
                if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) throw new Error('Các cạnh không tạo thành tam giác hợp lệ.');
                const cosA = (sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC);
                const cosB = (sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC);
                resAngA = radToDeg(Math.acos(cosA));
                resAngB = radToDeg(Math.acos(cosB));
                resAngC = 180 - resAngA - resAngB;
            }
            // Case SAS: 2 sides and included angle
            else if (sides.length === 2 && angles.length === 1) {
                if (!isNaN(sideA) && !isNaN(sideB) && !isNaN(angC)) { // a, b, C
                    resC = Math.sqrt(sideA * sideA + sideB * sideB - 2 * sideA * sideB * Math.cos(degToRad(angC)));
                    resAngA = radToDeg(Math.asin(sideA * Math.sin(degToRad(angC)) / resC));
                    resAngB = 180 - resAngA - angC;
                } else if (!isNaN(sideB) && !isNaN(sideC) && !isNaN(angA)) { // b, c, A
                    resA = Math.sqrt(sideB * sideB + sideC * sideC - 2 * sideB * sideC * Math.cos(degToRad(angA)));
                    resAngB = radToDeg(Math.asin(sideB * Math.sin(degToRad(angA)) / resA));
                    resAngC = 180 - angA - resAngB;
                } else if (!isNaN(sideA) && !isNaN(sideC) && !isNaN(angB)) { // a, c, B
                    resB = Math.sqrt(sideA * sideA + sideC * sideC - 2 * sideA * sideC * Math.cos(degToRad(angB)));
                    resAngA = radToDeg(Math.asin(sideA * Math.sin(degToRad(angB)) / resB));
                    resAngC = 180 - angB - resAngA;
                } else {
                    throw new Error('Trường hợp Cạnh-Cạnh-Góc (SSA) chưa được hỗ trợ vì có thể không xác định duy nhất. Vui lòng cung cấp góc giữa hai cạnh (SAS).');
                }
            }
            // Case ASA/AAS: 2 angles and 1 side
            else if (angles.length === 2 && sides.length === 1) {
                if (isNaN(angA)) resAngA = 180 - angB - angC;
                else if (isNaN(angB)) resAngB = 180 - angA - angC;
                else resAngC = 180 - angA - angB;

                if (!isNaN(sideA)) {
                    resB = sideA * Math.sin(degToRad(resAngB)) / Math.sin(degToRad(resAngA));
                    resC = sideA * Math.sin(degToRad(resAngC)) / Math.sin(degToRad(resAngA));
                } else if (!isNaN(sideB)) {
                    resA = sideB * Math.sin(degToRad(resAngA)) / Math.sin(degToRad(resAngB));
                    resC = sideB * Math.sin(degToRad(resAngC)) / Math.sin(degToRad(resAngB));
                } else { // sideC
                    resA = sideC * Math.sin(degToRad(resAngA)) / Math.sin(degToRad(resAngC));
                    resB = sideC * Math.sin(degToRad(resAngB)) / Math.sin(degToRad(resAngC));
                }
            } else {
                 throw new Error('Dữ liệu nhập vào không đủ hoặc không hợp lệ để giải tam giác.');
            }

            const p = (resA + resB + resC) / 2;
            const area = Math.sqrt(p * (p - resA) * (p - resB) * (p - resC));
            const perimeter = resA + resB + resC;
            
            setResult(`
                <strong>Các cạnh:</strong> a ≈ ${f(resA)}, b ≈ ${f(resB)}, c ≈ ${f(resC)} <br/>
                <strong>Các góc:</strong> A ≈ ${f(resAngA)}°, B ≈ ${f(resAngB)}°, C ≈ ${f(resAngC)}° <br/>
                <hr class="my-2"/>
                <strong>Chu vi:</strong> P ≈ ${f(perimeter)} <br/>
                <strong>Diện tích:</strong> S ≈ ${f(area)}
            `);

        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="space-y-8">
            <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Lý thuyết</h3>
                <div className="space-y-4 text-gray-700">
                    <div>
                        <strong>1. Định lý Cosin:</strong> <KatexRenderer latex="a^2 = b^2 + c^2 - 2bc \cos A" />
                    </div>
                    <div>
                        <strong>2. Định lý Sin:</strong> <KatexRenderer latex="\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R" />
                    </div>
                     <div>
                        <strong>3. Công thức tính diện tích:</strong>
                         <div className="ml-4 mt-2 space-y-2">
                            <p><KatexRenderer latex="S = \frac{1}{2}ab \sin C" /></p>
                            <p><strong>Công thức Heron:</strong> <KatexRenderer latex="S = \sqrt{p(p-a)(p-b)(p-c)}" /></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">Thực hành: Giải tam giác</h3>
                <p className="text-gray-600 mb-4">Nhập các giá trị đã biết (ít nhất 3, phải có 1 cạnh). Để trống các giá trị cần tính.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2">Nhập các cạnh</h4>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-2">
                                <span className="w-12">Cạnh a:</span>
                                <input type="number" value={a} onChange={e => setA(e.target.value)} placeholder="VD: 5" className="p-2 border rounded-md w-full" />
                            </label>
                            <label className="flex items-center space-x-2">
                                <span className="w-12">Cạnh b:</span>
                                <input type="number" value={b} onChange={e => setB(e.target.value)} placeholder="VD: 6" className="p-2 border rounded-md w-full" />
                            </label>
                            <label className="flex items-center space-x-2">
                                <span className="w-12">Cạnh c:</span>
                                <input type="number" value={c} onChange={e => setC(e.target.value)} placeholder="VD: 7" className="p-2 border rounded-md w-full" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Nhập các góc (độ)</h4>
                         <div className="space-y-3">
                            <label className="flex items-center space-x-2">
                                <span className="w-12">Góc A:</span>
                                <input type="number" value={angleA} onChange={e => setAngleA(e.target.value)} placeholder="VD: 60" className="p-2 border rounded-md w-full" />
                            </label>
                            <label className="flex items-center space-x-2">
                                <span className="w-12">Góc B:</span>
                                <input type="number" value={angleB} onChange={e => setAngleB(e.target.value)} placeholder="..." className="p-2 border rounded-md w-full" />
                            </label>
                            <label className="flex items-center space-x-2">
                                <span className="w-12">Góc C:</span>
                                <input type="number" value={angleC} onChange={e => setAngleC(e.target.value)} placeholder="..." className="p-2 border rounded-md w-full" />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <button onClick={calculate} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Tính toán
                    </button>
                </div>
                
                {(result || error) && (
                    <div className="mt-6 p-4 rounded-md bg-gray-50 border">
                        <h4 className="font-semibold text-lg mb-2">Kết quả</h4>
                        {error && <p className="text-red-600 font-medium">{error}</p>}
                        {result && <div className="text-green-700 space-y-1" dangerouslySetInnerHTML={{ __html: result }} />}
                    </div>
                )}
            </section>
        </div>
    );
};

export default TriangleRelations10;
