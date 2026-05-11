import { useEffect, useRef } from 'react';
import styles from './ParticlesBackground.module.css';

interface ParticlesBackgroundProps {
  colors: string[];
}

export function ParticlesBackground({ colors }: ParticlesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = 50;
    let html = '';
    
    for (let i = 0; i < particles; i++) {
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 10 + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      html += `
        <div 
          class="${styles.particle}"
          style="
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
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
