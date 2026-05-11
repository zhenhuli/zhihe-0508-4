import { useState } from 'react';
import { CountdownConfig } from '@/types';
import { backgroundStyles } from '@/utils/backgrounds';
import styles from './ConfigForm.module.css';

interface ConfigFormProps {
  initialConfig?: CountdownConfig | null;
  onSave: (config: Omit<CountdownConfig, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function ConfigForm({ initialConfig, onSave, onCancel }: ConfigFormProps) {
  const [formData, setFormData] = useState({
    name: initialConfig?.name || '',
    targetDate: initialConfig?.targetDate || '',
    title: initialConfig?.title || '',
    subtitle: initialConfig?.subtitle || '',
    backgroundColor: initialConfig?.backgroundColor || '#ff6b9d',
    backgroundType: initialConfig?.backgroundType || 'hearts',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const filteredBackgrounds = backgroundStyles.filter(
    (bg) => bg.type === formData.backgroundType
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>名称</label>
        <input
          type="text"
          className={styles.input}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="如：我们的婚礼"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>目标日期</label>
        <input
          type="date"
          className={styles.input}
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>标题文案</label>
        <input
          type="text"
          className={styles.input}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="如：距离我们的婚礼"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>副标题（可选）</label>
        <input
          type="text"
          className={styles.input}
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="如：爱你每一天"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>背景类型</label>
        <select
          className={styles.select}
          value={formData.backgroundType}
          onChange={(e) => setFormData({ ...formData, backgroundType: e.target.value as CountdownConfig['backgroundType'] })}
        >
          <option value="gradient">渐变背景</option>
          <option value="stars">星空</option>
          <option value="particles">粒子</option>
          <option value="hearts">爱心</option>
          <option value="balloons">气球</option>
          <option value="cake">蛋糕</option>
          <option value="snow">雪花</option>
          <option value="fireworks">烟花</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>背景配色</label>
        <div className={styles.colorOptions}>
          {filteredBackgrounds.length > 0 ? (
            filteredBackgrounds.map((bg) => (
              <button
                key={bg.id}
                type="button"
                className={`${styles.colorButton} ${formData.backgroundColor === bg.colors[0] ? styles.selected : ''}`}
                style={{ background: bg.colors.length > 1 ? `linear-gradient(135deg, ${bg.colors.join(', ')})` : bg.colors[0] }}
                onClick={() => setFormData({ ...formData, backgroundColor: bg.colors[0] })}
                title={bg.name}
              />
            ))
          ) : (
            <div className={styles.colorPickerWrapper}>
              <input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{formData.backgroundColor}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.buttons}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          取消
        </button>
        <button type="submit" className={styles.saveButton}>
          {initialConfig ? '保存修改' : '创建'}
        </button>
      </div>
    </form>
  );
}
