import React, { useState } from 'react';
import { evaluate, round } from 'mathjs';

// A safer evaluation function with pre-validation and a limited scope.
const safeEval = (expr: string): string => {
  try {
    // 1. Pre-validation for common syntax errors
    if (/[+\-*/.]$/.test(expr)) {
      // Expression ends with an operator or dot, not a full error yet, just incomplete.
      // Let user continue typing. For the '=' action, we might show an error.
      // For now, we'll let evaluate handle it, which it will mark as unexpected end of expression.
    }
    if (/\(\s*\)/.test(expr)) {
      // Contains empty parentheses e.g. "5 + ()"
      throw new Error('Empty parentheses are not allowed.');
    }
    if ((expr.match(/\(/g) || []).length !== (expr.match(/\)/g) || []).length) {
      throw new Error('Unbalanced parentheses.');
    }

    // 2. Define a limited, safe scope with degree-based trigonometric functions
    const scope = {
      sin: (x: number) => Math.sin(x * Math.PI / 180),
      cos: (x: number) => Math.cos(x * Math.PI / 180),
      tan: (x: number) => {
        // Handle vertical asymptotes for tan
        const cosVal = Math.cos(x * Math.PI / 180);
        if (Math.abs(cosVal) < 1e-10) return Infinity;
        return Math.tan(x * Math.PI / 180);
      },
      log: (x: number) => Math.log10(x),
      ln: (x: number) => Math.log(x),
    };

    // Replace user-friendly symbols with standard function names
    const sanitizedExpr = expr.replace(/π/g, 'pi').replace(/√/g, 'sqrt');
    
    // 3. Evaluate the expression within the limited scope
    const result = evaluate(sanitizedExpr, scope);

    // 4. Validate the result
    if (typeof result === 'undefined' || !isFinite(result)) {
      throw new Error('Kết quả không hợp lệ');
    }
    
    // Round to a reasonable precision to avoid floating point inaccuracies
    return String(round(result, 10));

  } catch (error) {
    // Re-throw a user-friendly error message
    throw new Error("Lỗi cú pháp");
  }
};

const ScientificCalculator: React.FC = () => {
    const [displayValue, setDisplayValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const handleButtonClick = (btn: string) => {
        setError(null);
        if (btn === '=') {
            if (!displayValue) return;
            try {
                const result = safeEval(displayValue);
                setDisplayValue(result);
            } catch (e: any) {
                setError(e.message);
                setDisplayValue('');
            }
        } else if (btn === 'C') {
            setDisplayValue('');
        } else if (btn === '←') {
            setDisplayValue(d => d.slice(0, -1));
        } else if (['sin', 'cos', 'tan', 'log', 'ln'].includes(btn)) {
            setDisplayValue(d => d + `${btn}(`);
        } else if (btn === '√') {
            setDisplayValue(d => d + 'sqrt(');
        } else {
            setDisplayValue(d => d + btn);
        }
    };
    
    const buttons = [
        'sin', 'cos', 'tan', 'C',
        '(', ')', '√', '←',
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', 'π', '+',
        '=',
    ];

    const renderButton = (btn: string) => (
        <button
            key={btn}
            onClick={() => handleButtonClick(btn)}
            className={`
                p-3 sm:p-4 text-lg font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 active:scale-95
                ${['/', '*', '-', '+'].includes(btn) ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-md hover:shadow-lg focus:ring-sky-400' : ''}
                ${['C', '←'].includes(btn) ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-400' : ''}
                ${btn === '=' ? 'bg-gradient-primary hover:bg-gradient-secondary text-white col-span-4 shadow-lg hover:shadow-xl focus:ring-sky-400' : ''}
                ${!['/', '*', '-', '+', 'C', '←', '='].includes(btn) ? 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm hover:shadow-md focus:ring-sky-300' : ''}
            `}
        >
            {btn}
        </button>
    );

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-soft border border-gray-200">
            <div className="bg-gray-900 p-5 rounded-xl mb-6 text-right overflow-x-auto min-h-[100px] flex flex-col justify-between shadow-inner">
                <div className="text-red-400 text-sm h-5 font-medium">{error || ''}</div>
                <div className="text-3xl sm:text-4xl font-mono text-white break-all">{displayValue || '0'}</div>
            </div>
            <div className="grid grid-cols-4 gap-3">
                {buttons.map(btn => renderButton(btn))}
            </div>
        </div>
    );
};

export default ScientificCalculator;