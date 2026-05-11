export interface CountdownConfig {
  id: string;
  name: string;
  targetDate: string;
  title: string;
  subtitle?: string;
  backgroundColor: string;
  backgroundType: 'gradient' | 'stars' | 'particles' | 'hearts' | 'balloons' | 'cake' | 'snow' | 'fireworks';
  createdAt: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface BackgroundStyle {
  id: string;
  name: string;
  type: 'gradient' | 'stars' | 'particles' | 'hearts' | 'balloons' | 'cake' | 'snow' | 'fireworks';
  colors: string[];
}
