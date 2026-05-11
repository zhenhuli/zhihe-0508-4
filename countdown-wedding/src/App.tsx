import { useState, useEffect } from 'react';
import { CountdownConfig } from '@/types';
import { HomePage, SettingsPage } from '@/pages';
import { loadConfigs } from '@/utils/storage';

type Page = 'home' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [configs, setConfigs] = useState<CountdownConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');

  useEffect(() => {
    const savedConfigs = loadConfigs();
    setConfigs(savedConfigs);
    if (savedConfigs.length > 0) {
      setSelectedConfigId(savedConfigs[0].id);
    }
  }, []);

  const selectedConfig = configs.find(c => c.id === selectedConfigId) || configs[0];

  if (!selectedConfig) {
    return <div>加载中...</div>;
  }

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          config={selectedConfig}
          configs={configs}
          onNavigateToSettings={() => setCurrentPage('settings')}
          onSelectConfig={setSelectedConfigId}
        />
      )}
      {currentPage === 'settings' && (
        <SettingsPage
          configs={configs}
          onConfigsChange={setConfigs}
          onNavigateBack={() => setCurrentPage('home')}
          selectedConfigId={selectedConfigId}
          onSelectConfig={setSelectedConfigId}
        />
      )}
    </>
  );
}

export default App;
