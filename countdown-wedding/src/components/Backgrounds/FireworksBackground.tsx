import { useEffect, useRef } from 'react';
import styles from './FireworksBackground.module.css';

interface FireworksBackgroundProps {
  colors: string[];
}

export function FireworksBackground({ colors }: FireworksBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let html = '';
    
    for (let i = 0; i < 25; i++) {
      const left = Math.random() * 80 + 10;
      const top = Math.random() * 50 + 20;
      const delay = Math.random() * 6;
      const duration = Math.random() * 2 + 2.5;
      const particles = Math.floor(Math.random() * 20) + 25;
      
      let particlesHtml = '';
      for (let j = 0; j < particles; j++) {
        const angle = (360 / particles) * j;
        const distance = Math.random() * 100 + 80;
        const size = Math.random() * 8 + 3;
        const particleColor = colors[Math.floor(Math.random() * colors.length)];
        const particleDelay = Math.random() * 0.3;
        
        particlesHtml += `
          <div 
            class="${styles.particle}"
            style="
              width: ${size}px;
              height: ${size}px;
              background: ${particleColor};
              --angle: ${angle}deg;
              --distance: ${distance}px;
              animation-delay: ${0.1 + particleDelay}s;
              --particle-duration: ${0.8 + Math.random() * 0.4}s;
            "
          ></div>
        `;
      }
      
      html += `
        <div 
          class="${styles.firework}"
          style="
            left: ${left}%;
            top: ${top}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
          "
        >
          ${particlesHtml}
        </div>
      `;
    }
    
    container.innerHTML = html;
  }, [colors]);

  return <div ref={containerRef} className={styles.container} />;
}
