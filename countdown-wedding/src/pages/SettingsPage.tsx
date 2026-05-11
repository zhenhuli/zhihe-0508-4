import { useState } from 'react';
import { CountdownConfig } from '@/types';
import { ConfigList } from '@/components/ConfigList';
import { ConfigForm } from '@/components/ConfigForm';
import { saveConfigs, createConfig } from '@/utils/storage';
import styles from './SettingsPage.module.css';

interface SettingsPageProps {
  configs: CountdownConfig[];
  onConfigsChange: (configs: CountdownConfig[]) => void;
  onNavigateBack: () => void;
  selectedConfigId: string;
  onSelectConfig: (id: string) => void;
}

export function SettingsPage({ configs, onConfigsChange, onNavigateBack, selectedConfigId, onSelectConfig }: SettingsPageProps) {
  const [editingConfig, setEditingConfig] = useState<CountdownConfig | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSave = (configData: Omit<CountdownConfig, 'id' | 'createdAt'>) => {
    if (editingConfig) {
      const updatedConfigs = configs.map(c =>
        c.id === editingConfig.id ? { ...c, ...configData } : c
      );
      saveConfigs(updatedConfigs);
      onConfigsChange(updatedConfigs);
    } else {
      const newConfig = createConfig(configData);
      const updatedConfigs = [...configs, newConfig];
      saveConfigs(updatedConfigs);
      onConfigsChange(updatedConfigs);
      onSelectConfig(newConfig.id);
    }
    setEditingConfig(null);
    setShowCreateForm(false);
  };

  const handleDelete = (id: string) => {
    if (configs.length <= 1) {
      alert('至少需要保留一个倒计时配置');
      return;
    }
    const updatedConfigs = configs.filter(c => c.id !== id);
    saveConfigs(updatedConfigs);
    onConfigsChange(updatedConfigs);
    if (selectedConfigId === id) {
      onSelectConfig(updatedConfigs[0].id);
    }
  };

  const handleEdit = (config: CountdownConfig) => {
    setEditingConfig(config);
    setShowCreateForm(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={onNavigateBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          返回
        </button>
        <h1 className={styles.title}>设置</h1>
        <div className={styles.spacer} />
      </header>

      <main className={styles.main}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>倒计时列表</h2>
            <button className={styles.addButton} onClick={() => { setShowCreateForm(true); setEditingConfig(null); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"/>
                <path d="M5 12h14"/>
              </svg>
              添加
            </button>
          </div>

          {showCreateForm ? (
            <div className={styles.formContainer}>
              <h3 className={styles.formTitle}>创建新倒计时</h3>
              <ConfigForm onSave={handleSave} onCancel={() => setShowCreateForm(false)} />
            </div>
          ) : editingConfig ? (
            <div className={styles.formContainer}>
              <h3 className={styles.formTitle}>编辑倒计时</h3>
              <ConfigForm initialConfig={editingConfig} onSave={handleSave} onCancel={() => setEditingConfig(null)} />
            </div>
          ) : (
            <ConfigList
              configs={configs}
              selectedId={selectedConfigId}
              onSelect={onSelectConfig}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
