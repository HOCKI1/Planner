import { useState, useEffect } from 'react'
import { IconPlus, IconPencil, IconTrash, IconSearch } from '@tabler/icons-react'
import ItemForm from './ItemForm'
import styles from './AdminPanel.module.css'

export default function ItemList({
  items = [], // Список переданных элементов
  onAddItem,  // Функция для добавления элемента
  onEditItem, // Функция для редактирования элемента
  onDeleteItem, // Функция для удаления элемента
  onClose // Функция закрытия панели
}) {
  const [itemModalOpen, setItemModalOpen] = useState(false) // Состояние модального окна
  const [editingItem, setEditingItem] = useState(null) // Какой элемент редактируем
  const [searchQuery, setSearchQuery] = useState('') // Что введено в строке поиска
  const [displayedItems, setDisplayedItems] = useState(items) // Отображаемые элементы (с учетом фильтрации)

  // Обновляем список, если исходные items изменились
  useEffect(() => {
    setDisplayedItems(items)
  }, [items])

  // Фильтрация по введенному тексту
  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setDisplayedItems(filtered)
  }, [searchQuery, items])

  // Обработка сохранения нового или отредактированного элемента
  const handleSaveItem = (item) => {
    if (editingItem) {
      onEditItem(editingItem.id, item) // Редактирование
    } else {
      onAddItem(item) // Добавление нового
    }
    setItemModalOpen(false)
    setEditingItem(null)
  }

  // Удаление элемента по id
  const handleDeleteItem = (itemId) => {
    onDeleteItem(itemId)
  }

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Items</h2>

      {/* Поле поиска и кнопка создания */}
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
              onChange={(e) => setSearchQuery(e.target.value)} // Обновление состояния поиска
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

      {/* Список элементов */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {displayedItems.map(item => (
          <div
            key={item.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{item.name}</h3>
              {/* Отображение параметров, если есть */}
              <div className="text-sm text-gray-500 mt-1">
                {item.properties?.width && `Width: ${item.properties.width}cm`}
                {item.properties?.height && ` • Height: ${item.properties.height}cm`}
                {item.properties?.depth && ` • Depth: ${item.properties.depth}cm`}
              </div>
            </div>
            
            {/* Кнопки редактирования и удаления */}
            <div className="flex gap-2">
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

        {/* Пустой список — либо нет данных, либо ничего не найдено */}
        {displayedItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No items found matching your search.' : 'No items yet. Click "Create New Item" to add one.'}
          </div>
        )}
      </div>

      {/* Кнопка закрытия панели */}
      <div className={styles.modalActions}>
        <button
          className={`${styles.button} ${styles.secondaryButton}`}
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* Модальное окно с формой */}
      {itemModalOpen && (
        <div className={styles.modal}>
          <ItemForm
            item={editingItem} // Передаем редактируемый элемент или null
            onSave={handleSaveItem} // Обработчик сохранения
            onCancel={() => {
              setItemModalOpen(false)
              setEditingItem(null)
            }} // Отмена
          />
        </div>
      )}
    </div>
  )
}
