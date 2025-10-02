import React, { useState } from 'react';

const ScientificCalculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');

    const safeEval = (expr: string): string => {
        try {
            // Sanitize and replace for evaluation
            let sanitizedExpr = expr
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/%/g, '/100')
                .replace(/sin\(/g, 'sin(Math.PI/180*') // Assume degrees
                .replace(/cos\(/g, 'cos(Math.PI/180*')
                .replace(/tan\(/g, 'tan(Math.PI/180*')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/√\(/g, 'Math.sqrt(')
                .replace(/\^/g, '**');

            // More advanced: auto-close parentheses
            const openParen = (sanitizedExpr.match(/\(/g) || []).length;
            const closeParen = (sanitizedExpr.match(/\)/g) || []).length;
            sanitizedExpr += ')'.repeat(openParen - closeParen);
            
            // Final check for safety - very basic
            if (/[^0-9.+\-*/() Math.PIe\w,]/g.test(sanitizedExpr)) {
                return 'Error: Invalid Chars';
            }
            
            const result = new Function('return ' + sanitizedExpr)();
            if (typeof result !== 'number' || !isFinite(result)) {
                return 'Error';
            }
            return String(parseFloat(result.toFixed(10)));
        } catch (e) {
            return 'Error';
        }
    };

    const handleButtonClick = (value: string) => {
        if (display === 'Error') {
             setDisplay('0');
             setExpression('');
             return;
        }

        switch (value) {
            case 'C':
                setDisplay('0');
                setExpression('');
                break;
            case 'CE':
                setDisplay('0');
                break;
            case '⌫':
                if (display.length > 1) {
                    setDisplay(display.slice(0, -1));
                } else {
                    setDisplay('0');
                }
                break;
            case '=':
                const result = safeEval(expression + display);
                setDisplay(result);
                setExpression('');
                break;
            case '+':
            case '-':
            case '×':
            case '÷':
            case '^':
                setExpression(prev => prev + display + ` ${value} `);
                setDisplay('0');
                break;
            case '%':
                 setDisplay(String(parseFloat(display) / 100));
                 break;
            case '±':
                 setDisplay(String(parseFloat(display) * -1));
                 break;
            case '.':
                if (!display.includes('.')) {
                    setDisplay(display + '.');
                }
                break;
            case 'sin(':
            case 'cos(':
            case 'tan(':
            case 'log(':
            case 'ln(':
            case '√(':
                setExpression(prev => prev + value);
                setDisplay('0');
                break;
            default: // Numbers
                if (display === '0') {
                    setDisplay(value);
                } else {
                    setDisplay(display + value);
                }
                break;
        }
    };
    
    const buttons = [
        'sin(', 'cos(', 'tan(', 'C', 'CE',
        'log(', 'ln(', '√(', '^', '⌫',
        '7', '8', '9', '÷', '%',
        '4', '5', '6', '×', '±',
        '1', '2', '3', '-', '=',
        '(', '0', ')', '+', '.'
    ];

    const getButtonClass = (btn: string) => {
        if (['=', '+', '-', '×', '÷', '^'].includes(btn)) return 'bg-blue-500 hover:bg-blue-600 text-white';
        if (['C', 'CE', '⌫'].includes(btn)) return 'bg-red-500 hover:bg-red-600 text-white';
        if (['sin(', 'cos(', 'tan(', 'log(', 'ln(', '√(', '%', '±'].includes(btn)) return 'bg-gray-200 hover:bg-gray-300';
        return 'bg-white hover:bg-gray-100';
    }

    return (
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl p-4 space-y-4">
            <div className="bg-gray-900 text-white text-right rounded p-4">
                <div className="text-gray-400 text-sm h-6 truncate">{expression.replace(/\s/g, '') + (display !== '0' || expression === '' ? display : '')}</div>
                <div className="text-4xl font-bold">{display}</div>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {buttons.map(btn => (
                     <button 
                        key={btn}
                        onClick={() => handleButtonClick(btn)} 
                        className={`text-xl font-semibold p-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${getButtonClass(btn)} ${btn === '=' ? 'row-span-2' : ''}`}
                     >
                        {btn}
                     </button>
                ))}
            </div>
        </div>
    );
};

export default ScientificCalculator;
