import { useEffect, useRef } from 'react';
import styles from './SnowBackground.module.css';

interface SnowBackgroundProps {
  colors: string[];
}

export function SnowBackground({ colors }: SnowBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const snowflakes = 80;
    let html = '';
    
    for (let i = 0; i < snowflakes; i++) {
      const size = Math.random() * 6 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;
      const sway = Math.random() * 50 + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      html += `
        <div 
          class="${styles.snowflake}"
          style="
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            background: ${color};
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            --sway: ${sway}px;
          "
        ></div>
      `;
    }
    
    container.innerHTML = html;
  }, [colors]);

  return <div ref={containerRef} className={styles.container} />;
}
