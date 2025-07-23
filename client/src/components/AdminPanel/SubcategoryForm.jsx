import { useState } from 'react';
import { IconUpload, IconX } from '@tabler/icons-react';
import styles from './AdminPanel.module.css';

export default function SubcategoryForm({ 
  onSave, 
  onCancel, 
  initialData = null 
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    id: initialData?.id || '',
    img: initialData?.img || '',
    items: initialData?.items || []
  });

  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    const id = formData.id || formData.name.toLowerCase().replace(/\s+/g, '_');
    onSave({
      ...formData,
      id: initialData?.id || id
    });
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>
        {initialData ? 'Edit Subcategory' : 'Create Subcategory'}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <input
        type="text"
        className={styles.input}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Subcategory name"
      />

      <input
        type="text"
        className={styles.input}
        value={formData.id}
        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        placeholder="Subcategory ID (optional - will be auto-generated)"
        disabled={!!initialData}
      />

      <input
        type="text"
        className={styles.input}
        value={formData.img}
        onChange={(e) => setFormData({ ...formData, img: e.target.value })}
        placeholder="Image path (e.g., /models/shkaf1.png)"
      />

      {formData.img && (
        <div className="mt-2 mb-4">
          <img 
            src={formData.img} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-lg border"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className={styles.modalActions}>
        <button 
          className={`${styles.button} ${styles.primaryButton}`}
          onClick={handleSubmit}
        >
          {initialData ? 'Save Changes' : 'Create Subcategory'}
        </button>
        <button 
          className={`${styles.button} ${styles.secondaryButton}`}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}