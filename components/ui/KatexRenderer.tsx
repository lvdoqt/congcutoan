
import React, { useEffect, useRef } from 'react';

declare const katex: {
  render(expression: string, element: HTMLElement, options?: { throwOnError?: boolean }): void;
};

interface KatexRendererProps {
  latex: string;
  className?: string;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({ latex, className }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && typeof katex !== 'undefined') {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        if (containerRef.current) {
            containerRef.current.textContent = `Error rendering formula: ${latex}`;
        }
      }
    }
  }, [latex]);

  return <span ref={containerRef} className={className} />;
};

export default KatexRenderer;
