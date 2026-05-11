import { BackgroundStyle } from '@/types';

export const backgroundStyles: BackgroundStyle[] = [
  {
    id: 'gradient-sunset',
    name: '日落渐变',
    type: 'gradient',
    colors: ['#ff6b6b', '#feca57', '#ff9ff3'],
  },
  {
    id: 'gradient-ocean',
    name: '海洋渐变',
    type: 'gradient',
    colors: ['#00c6fb', '#005bea'],
  },
  {
    id: 'gradient-purple',
    name: '梦幻紫',
    type: 'gradient',
    colors: ['#a855f7', '#ec4899'],
  },
  {
    id: 'gradient-birthday',
    name: '生日渐变',
    type: 'gradient',
    colors: ['#ffd700', '#ff6b6b', '#ff8fab'],
  },
  {
    id: 'stars-night',
    name: '星空',
    type: 'stars',
    colors: ['#ffffff', '#f0f0f0', '#ffff00'],
  },
  {
    id: 'particles-pink',
    name: '粉色粒子',
    type: 'particles',
    colors: ['#ff6b9d', '#ffc0cb', '#ff8fab'],
  },
  {
    id: 'particles-gold',
    name: '金色粒子',
    type: 'particles',
    colors: ['#ffd700', '#ffec8b', '#ffb90f'],
  },
  {
    id: 'hearts-red',
    name: '爱心',
    type: 'hearts',
    colors: ['#ff4757', '#ff6b81', '#ff7f50'],
  },
  {
    id: 'balloons-birthday',
    name: '气球',
    type: 'balloons',
    colors: ['#ff6b6b', '#ffd700', '#4ecdc4', '#95e1d3', '#a855f7'],
  },
  {
    id: 'cake-birthday',
    name: '蛋糕',
    type: 'cake',
    colors: ['#ff6b6b', '#ffd700', '#ffffff', '#8b4513'],
  },
  {
    id: 'snow-christmas',
    name: '雪花',
    type: 'snow',
    colors: ['#ffffff', '#e0f7fa', '#b2ebf2'],
  },
  {
    id: 'fireworks-newyear',
    name: '烟花',
    type: 'fireworks',
    colors: ['#ff6b6b', '#ffd700', '#4ecdc4', '#a855f7', '#ff8fab'],
  },
];

export function getGradientStyle(colors: string[]): string {
  return `linear-gradient(135deg, ${colors.join(', ')})`;
}
