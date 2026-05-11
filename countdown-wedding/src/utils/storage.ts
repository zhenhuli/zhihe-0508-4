import { CountdownConfig } from '@/types';

const STORAGE_KEY = 'countdown-configs';

export function saveConfigs(configs: CountdownConfig[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

export function loadConfigs(): CountdownConfig[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return getDefaultConfigs();
  }
  try {
    return JSON.parse(data);
  } catch {
    return getDefaultConfigs();
  }
}

export function getDefaultConfigs(): CountdownConfig[] {
  return [
    {
      id: '1',
      name: '我们的婚礼',
      targetDate: '2026-12-25',
      title: '距离我们的婚礼',
      subtitle: '爱你每一天',
      backgroundColor: '#ff6b9d',
      backgroundType: 'hearts',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: '相识纪念日',
      targetDate: '2026-08-15',
      title: '距离相识纪念日',
      subtitle: '感谢遇见',
      backgroundColor: '#a855f7',
      backgroundType: 'stars',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: '我的生日',
      targetDate: '2026-09-01',
      title: '距离我的生日',
      subtitle: '生日快乐',
      backgroundColor: '#ff6b6b',
      backgroundType: 'balloons',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: '宝贝生日',
      targetDate: '2026-11-15',
      title: '距离宝贝生日',
      subtitle: 'Happy Birthday',
      backgroundColor: '#ffd700',
      backgroundType: 'cake',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: '圣诞节',
      targetDate: '2026-12-25',
      title: '距离圣诞节',
      subtitle: 'Merry Christmas',
      backgroundColor: '#1a1a2e',
      backgroundType: 'snow',
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: '新年倒计时',
      targetDate: '2027-01-01',
      title: '距离新年',
      subtitle: 'Happy New Year',
      backgroundColor: '#ff6b6b',
      backgroundType: 'fireworks',
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      name: '结婚周年',
      targetDate: '2026-06-01',
      title: '距离结婚周年',
      subtitle: '执子之手',
      backgroundColor: '#a855f7',
      backgroundType: 'particles',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function createConfig(config: Omit<CountdownConfig, 'id' | 'createdAt'>): CountdownConfig {
  return {
    ...config,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
}

export function updateConfig(id: string, updates: Partial<CountdownConfig>): CountdownConfig[] {
  const configs = loadConfigs();
  return configs.map(config =>
    config.id === id ? { ...config, ...updates } : config
  );
}

export function deleteConfig(id: string): CountdownConfig[] {
  return loadConfigs().filter(config => config.id !== id);
}
