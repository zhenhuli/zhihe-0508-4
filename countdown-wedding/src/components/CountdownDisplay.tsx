import { useCountdown } from '@/hooks/useCountdown';
import { formatNumber } from '@/utils/timeCalculator';
import styles from './CountdownDisplay.module.css';

interface CountdownDisplayProps {
  targetDate: string;
  title: string;
  subtitle?: string;
}

export function CountdownDisplay({ targetDate, title, subtitle }: CountdownDisplayProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const timeUnits = [
    { value: days, label: '天' },
    { value: hours, label: '时' },
    { value: minutes, label: '分' },
    { value: seconds, label: '秒' },
  ];

  return (
    <div className={styles.countdownContainer}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      
      <div className={styles.timeGrid}>
        {timeUnits.map(({ value, label }) => (
          <div key={label} className={styles.timeUnit}>
            <div className={styles.number}>
              <span className={styles.digit}>{formatNumber(value)}</span>
            </div>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
