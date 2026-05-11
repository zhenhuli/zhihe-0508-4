import { useEffect, useRef } from 'react';
import styles from './BalloonsBackground.module.css';

interface BalloonsBackgroundProps {
  colors: string[];
}

export function BalloonsBackground({ colors }: BalloonsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const balloons = 20;
    let html = '';
    
    for (let i = 0; i < balloons; i++) {
      const size = Math.random() * 40 + 30;
      const left = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = Math.random() * 20 + 15;
      const sway = Math.random() * 40 + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const flip = Math.random() > 0.5 ? 'scaleX(-1)' : 'scaleX(1)';
      
      html += `
        <div 
          class="${styles.balloon}"
          style="
            width: ${size}px;
            height: ${size * 1.2}px;
            left: ${left}%;
            background: ${color};
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
            --sway: ${sway}px;
            transform: ${flip};
          "
        >
          <div class="${styles.balloonKnot}" style="border-top-color: ${color}"></div>
          <div class="${styles.balloonShine}"></div>
        </div>
      `;
    }
    
    container.innerHTML = html;
  }, [colors]);

  return <div ref={containerRef} className={styles.container} />;
}
