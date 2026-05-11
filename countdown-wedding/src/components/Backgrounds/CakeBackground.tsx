import { useEffect, useRef } from 'react';
import styles from './CakeBackground.module.css';

interface CakeBackgroundProps {
  colors: string[];
}

export function CakeBackground({ colors }: CakeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let html = '';
    
    const cakeHtml = `
      <div class="${styles.cakeWrapper}">
        <div class="${styles.candles}">
          <div class="${styles.candle}"><div class="${styles.flame}"></div></div>
          <div class="${styles.candle}"><div class="${styles.flame}"></div></div>
          <div class="${styles.candle}"><div class="${styles.flame}"></div></div>
        </div>
        <div class="${styles.cake}">
          <div class="${styles.cakeTop}" style="background: ${colors[2]}"></div>
          <div class="${styles.cakeMiddle}" style="background: ${colors[0]}"></div>
          <div class="${styles.cakeBottom}" style="background: ${colors[3]}"></div>
        </div>
        <div class="${styles.confetti}">
          ${Array.from({ length: 30 }).map(() => {
            const size = Math.random() * 8 + 4;
            const delay = Math.random() * 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            return `<div class="${styles.confettiPiece}" style="width: ${size}px; height: ${size}px; background: ${color}; animation-delay: ${delay}s; left: ${Math.random() * 100}%"></div>`;
          }).join('')}
        </div>
      </div>
    `;
    
    html += cakeHtml;
    container.innerHTML = html;
  }, [colors]);

  return <div ref={containerRef} className={styles.container} />;
}
