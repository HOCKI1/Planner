import { useState, useEffect } from 'react'
import { IconPlus, IconPencil, IconTrash, IconSearch, IconEye, IconEyeOff } from '@tabler/icons-react'
import ItemForm from './ItemForm'
import styles from './AdminPanel.module.css'

export default function ItemList({
  items = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onClose
}) {
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [displayedItems, setDisplayedItems] = useState(items)

  useEffect(() => {
    setDisplayedItems(items)
  }, [items])

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setDisplayedItems(filtered)
  }, [searchQuery, items])

  const handleSaveItem = (item) => {
    if (editingItem) {
      onEditItem(editingItem.id, item)
    } else {
      onAddItem(item)
    }
    setItemModalOpen(false)
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onDeleteItem(itemId)
    }
  }

  const toggleItemVisibility = (item) => {
    onEditItem(item.id, { ...item, show: !item.show })
  }

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Items</h2>

      <div className="mb-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <IconSearch 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={() => {
              setEditingItem(null)
              setItemModalOpen(true)
            }}
          >
            <IconPlus size={20} />
            Create New Item
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {displayedItems.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border flex items-center justify-between ${
              item.show ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-75'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{item.name}</h3>
                {!item.show && (
                  <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                ID: {item.id} • 
                Size: {Math.floor(item.width * 100)}×{Math.floor(item.depth * 100)}×{Math.floor(item.height * 100)} cm • 
                Price: {item.price || 'Not set'}
              </div>
              {item.width_variants && item.width_variants.length > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  {item.width_variants.length} width variant(s)
                </div>
              )}
              {item.color_variants && item.color_variants.length > 0 && (
                <div className="text-xs text-purple-600 mt-1">
                  {item.color_variants.length} color variant(s)
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={() => toggleItemVisibility(item)}
                title={item.show ? 'Hide item' : 'Show item'}
              >
                {item.show ? <IconEye size={20} /> : <IconEyeOff size={20} />}
              </button>
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={() => {
                  setEditingItem(item)
                  setItemModalOpen(true)
                }}
              >
                <IconPencil size={20} />
              </button>
              <button
                className={`${styles.button} ${styles.dangerButton}`}
                onClick={() => handleDeleteItem(item.id)}
              >
                <IconTrash size={20} />
              </button>
            </div>
          </div>
        ))}

        {displayedItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No items found matching your search.' : 'No items yet. Click "Create New Item" to add one.'}
          </div>
        )}
      </div>

      <div className={styles.modalActions}>
        <button
          className={`${styles.button} ${styles.secondaryButton}`}
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {itemModalOpen && (
        <div className={styles.modal}>
          <ItemForm
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={() => {
              setItemModalOpen(false)
              setEditingItem(null)
            }}
          />
        </div>
      )}
    </div>
  )
}