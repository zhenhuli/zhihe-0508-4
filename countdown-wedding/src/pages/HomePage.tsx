import { useState } from 'react';
import { CountdownDisplay } from '@/components/CountdownDisplay';
import { StarsBackground, ParticlesBackground, HeartsBackground, BalloonsBackground, CakeBackground, SnowBackground, FireworksBackground } from '@/components/Backgrounds';
import { CountdownConfig } from '@/types';
import { backgroundStyles, getGradientStyle } from '@/utils/backgrounds';
import styles from './HomePage.module.css';

interface HomePageProps {
  config: CountdownConfig;
  configs: CountdownConfig[];
  onNavigateToSettings: () => void;
  onSelectConfig: (id: string) => void;
}

export function HomePage({ config, configs, onNavigateToSettings, onSelectConfig }: HomePageProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const getBackgroundStyle = () => {
    const bg = backgroundStyles.find(b => b.type === config.backgroundType);
    if (bg && bg.type === 'gradient') {
      return { background: getGradientStyle(bg.colors) };
    }
    return { backgroundColor: config.backgroundColor };
  };

  const renderBackground = () => {
    const bg = backgroundStyles.find(b => b.type === config.backgroundType);
    if (!bg) return null;

    switch (bg.type) {
      case 'stars':
        return <StarsBackground colors={bg.colors} />;
      case 'particles':
        return <ParticlesBackground colors={bg.colors} />;
      case 'hearts':
        return <HeartsBackground colors={bg.colors} />;
      case 'balloons':
        return <BalloonsBackground colors={bg.colors} />;
      case 'cake':
        return <CakeBackground colors={bg.colors} />;
      case 'snow':
        return <SnowBackground colors={bg.colors} />;
      case 'fireworks':
        return <FireworksBackground colors={bg.colors} />;
      default:
        return null;
    }
  };

  const handleConfigSelect = (id: string) => {
    onSelectConfig(id);
    setShowDropdown(false);
  };

  return (
    <div className={styles.page} style={getBackgroundStyle()}>
      {renderBackground()}
      
      <button className={styles.settingsButton} onClick={onNavigateToSettings}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      <div className={styles.dropdownContainer}>
        <button 
          className={styles.dropdownButton} 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className={styles.dropdownLabel}>{config.name}</span>
          <svg 
            className={`${styles.dropdownIcon} ${showDropdown ? styles.rotated : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            {configs.map((cfg) => (
              <button
                key={cfg.id}
                className={`${styles.dropdownItem} ${cfg.id === config.id ? styles.active : ''}`}
                onClick={() => handleConfigSelect(cfg.id)}
              >
                <span 
                  className={styles.dropdownColor} 
                  style={{ backgroundColor: cfg.backgroundColor }} 
                />
                <span className={styles.dropdownText}>{cfg.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <main className={styles.content}>
        <CountdownDisplay
          targetDate={config.targetDate}
          title={config.title}
          subtitle={config.subtitle}
        />
      </main>
    </div>
  );
}
