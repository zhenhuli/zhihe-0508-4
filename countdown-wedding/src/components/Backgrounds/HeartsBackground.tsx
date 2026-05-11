import { useEffect, useRef } from 'react';
import styles from './HeartsBackground.module.css';

interface HeartsBackgroundProps {
  colors: string[];
}

export function HeartsBackground({ colors }: HeartsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hearts = 30;
    let html = '';
    
    for (let i = 0; i < hearts; i++) {
      const size = Math.random() * 20 + 15;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 15 + 10;
      const sway = Math.random() * 30 + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      html += `
        <div 
          class="${styles.heart}"
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
