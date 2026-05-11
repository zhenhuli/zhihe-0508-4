import { useEffect, useRef } from 'react';
import styles from './StarsBackground.module.css';

interface StarsBackgroundProps {
  colors: string[];
}

export function StarsBackground({ colors }: StarsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars = 100;
    let html = '';
    
    for (let i = 0; i < stars; i++) {
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 3 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      html += `
        <div 
          class="${styles.star}"
          style="
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${top}%;
            background: ${color};
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
          "
        ></div>
      `;
    }
    
    container.innerHTML = html;
  }, [colors]);

  return <div ref={containerRef} className={styles.container} />;
}
