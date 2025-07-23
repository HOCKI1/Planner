import { useState } from 'react'
import { IconPlus, IconX, IconRuler, IconPalette, IconCurrencyDollar } from '@tabler/icons-react'
import styles from './AdminPanel.module.css'

const availableModels = [
  { id: 'tumba1', name: 'Тумба 1' },
  { id: 'tumba2', name: 'Тумба 2' },
  { id: 'tumba3', name: 'Тумба 3' },
  { id: 'tumba5', name: 'Тумба 5' },
  { id: 'tumba6', name: 'Тумба 6' },
  { id: 'tumba7', name: 'Тумба 7' },
  { id: 'holodilnik', name: 'Холодильник' }
]

const availableMtlFiles = [
  { id: 'tumba1.mtl', name: 'Тумба 1 материал' },
  { id: 'tumba2.mtl', name: 'Тумба 2 материал' },
  { id: 'tumba3.mtl', name: 'Тумба 3 материал' },
  { id: 'tumba5.mtl', name: 'Тумба 5 материал' },
  { id: 'holodilnik.mtl', name: 'Холодильник материал' }
]

export default function ItemForm({ 
  item = null,
  onSave,
  onCancel
}) {
  const [activeTab, setActiveTab] = useState('properties')

  const [formData, setFormData] = useState(item ? {
    id: item.id,
    show: item.show !== undefined ? item.show : true,
    name: item.name,
    width: item.width,
    depth: item.depth,
    height: item.height,
    rotZ: item.rotZ || 0,
    modelPath: item.modelPath || '',
    price: item.price || '',
    imgPreviewPath: item.imgPreviewPath || '',
    img2dPath: item.img2dPath || '',
    width_variants: item.width_variants || [],
    color_variants: item.color_variants || [],
    materials: item.materials || [],
    properties: item.properties || {}
  } : {
    id: '',
    show: true,
    name: '',
    width: 0.6,
    depth: 0.6,
    height: 0.85,
    rotZ: 0,
    modelPath: '',
    price: '',
    imgPreviewPath: '',
    img2dPath: '',
    width_variants: [],
    color_variants: [],
    materials: [],
    properties: {}
  })

  const handleSubmit = () => {
    if (formData.name && formData.id) {
      onSave(formData)
    }
  }

  const addWidthVariant = () => {
    setFormData(prev => ({
      ...prev,
      width_variants: [...prev.width_variants, { width: 0.6, id: Date.now() }]
    }))
  }

  const updateWidthVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      width_variants: prev.width_variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }))
  }

  const removeWidthVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      width_variants: prev.width_variants.filter((_, i) => i !== index)
    }))
  }

  const addColorVariant = () => {
    setFormData(prev => ({
      ...prev,
      color_variants: [...prev.color_variants, { color: '#ffffff', id: Date.now() }]
    }))
  }

  const updateColorVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      color_variants: prev.color_variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }))
  }

  const removeColorVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      color_variants: prev.color_variants.filter((_, i) => i !== index)
    }))
  }

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { color: '#ffffff', matPath: '' }]
    }))
  }

  const updateMaterial = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }))
  }

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>
        {item ? 'Edit Item' : 'Add New Item'}
      </h2>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'properties' ? styles.active : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'variants' ? styles.active : ''}`}
          onClick={() => setActiveTab('variants')}
        >
          Variants
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'materials' ? styles.active : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
      </div>

      {activeTab === 'properties' && (
        <>
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.show}
                onChange={(e) => setFormData({ ...formData, show: e.target.checked })}
              />
              <span>Show item</span>
            </label>
          </div>

          <input
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Item name"
          />

          <input
            type="number"
            className={styles.input}
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: Number(e.target.value) })}
            placeholder="Item ID"
            disabled={!!item}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Width (m)</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Depth (m)</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.depth}
                onChange={(e) => setFormData({ ...formData, depth: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height (m)</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <input
            type="text"
            className={styles.input}
            value={formData.modelPath}
            onChange={(e) => setFormData({ ...formData, modelPath: e.target.value })}
            placeholder="Model path (e.g., /models/tumba1.glb)"
          />

          <input
            type="text"
            className={styles.input}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Price"
          />

          <input
            type="text"
            className={styles.input}
            value={formData.imgPreviewPath}
            onChange={(e) => setFormData({ ...formData, imgPreviewPath: e.target.value })}
            placeholder="Preview image path"
          />

          <input
            type="text"
            className={styles.input}
            value={formData.img2dPath}
            onChange={(e) => setFormData({ ...formData, img2dPath: e.target.value })}
            placeholder="2D image path"
          />
        </>
      )}

      {activeTab === 'variants' && (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Width Variants</h3>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={addWidthVariant}
              >
                <IconPlus size={16} />
                Add Width Variant
              </button>
            </div>
            
            {formData.width_variants.map((variant, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  step="0.01"
                  className={styles.input}
                  value={variant.width}
                  onChange={(e) => updateWidthVariant(index, 'width', parseFloat(e.target.value))}
                  placeholder="Width (m)"
                />
                <input
                  type="number"
                  className={styles.input}
                  value={variant.id}
                  onChange={(e) => updateWidthVariant(index, 'id', Number(e.target.value))}
                  placeholder="Variant ID"
                />
                <button
                  className={styles.removeButton}
                  onClick={() => removeWidthVariant(index)}
                >
                  <IconX size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Color Variants</h3>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={addColorVariant}
              >
                <IconPlus size={16} />
                Add Color Variant
              </button>
            </div>
            
            {formData.color_variants.map((variant, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className={styles.input}
                  value={variant.color}
                  onChange={(e) => updateColorVariant(index, 'color', e.target.value)}
                  placeholder="Color name"
                />
                <input
                  type="number"
                  className={styles.input}
                  value={variant.id}
                  onChange={(e) => updateColorVariant(index, 'id', Number(e.target.value))}
                  placeholder="Variant ID"
                />
                <button
                  className={styles.removeButton}
                  onClick={() => removeColorVariant(index)}
                >
                  <IconX size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'materials' && (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Materials</h3>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={addMaterial}
              >
                <IconPlus size={16} />
                Add Material
              </button>
            </div>
            
            {formData.materials.map((material, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="color"
                  value={material.color}
                  onChange={(e) => updateMaterial(index, 'color', e.target.value)}
                  className="w-12 h-10 rounded border"
                />
                <select
                  className={styles.input}
                  value={material.matPath}
                  onChange={(e) => updateMaterial(index, 'matPath', e.target.value)}
                >
                  <option value="">Select MTL file</option>
                  {availableMtlFiles.map(mtl => (
                    <option key={mtl.id} value={`/models/${mtl.id}`}>
                      {mtl.name}
                    </option>
                  ))}
                </select>
                <button
                  className={styles.removeButton}
                  onClick={() => removeMaterial(index)}
                >
                  <IconX size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Properties</h3>
            <textarea
              className={styles.input}
              value={JSON.stringify(formData.properties, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  setFormData({ ...formData, properties: parsed })
                } catch (e) {
                  // Ignore invalid JSON
                }
              }}
              rows={10}
              placeholder="Properties JSON"
            />
          </div>
        </>
      )}

      <div className={styles.modalActions}>
        <button 
          className={`${styles.button} ${styles.primaryButton}`}
          onClick={handleSubmit}
        >
          {item ? 'Save Changes' : 'Add Item'}
        </button>
        <button 
          className={`${styles.button} ${styles.secondaryButton}`}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}