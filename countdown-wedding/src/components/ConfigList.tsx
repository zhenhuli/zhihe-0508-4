import { CountdownConfig } from '@/types';
import styles from './ConfigList.module.css';

interface ConfigListProps {
  configs: CountdownConfig[];
  selectedId: string;
  onSelect: (id: string) => void;
  onEdit: (config: CountdownConfig) => void;
  onDelete: (id: string) => void;
}

export function ConfigList({ configs, selectedId, onSelect, onEdit, onDelete }: ConfigListProps) {
  return (
    <div className={styles.list}>
      {configs.map((config) => (
        <div
          key={config.id}
          className={`${styles.item} ${selectedId === config.id ? styles.selected : ''}`}
        >
          <button className={styles.selectButton} onClick={() => onSelect(config.id)}>
            <div className={styles.colorIndicator} style={{ backgroundColor: config.backgroundColor }} />
            <span className={styles.name}>{config.name}</span>
          </button>
          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={() => onEdit(config)}>
              编辑
            </button>
            <button className={styles.actionButtonDelete} onClick={() => onDelete(config.id)}>
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
