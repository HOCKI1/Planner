import { useState } from 'react'
import { 
  IconPlus, IconPencil, IconTrash, IconChevronDown, 
  IconChevronRight, IconFile, IconFolderPlus 
} from '@tabler/icons-react'
import { useStore } from '../../state' 
import ItemForm from './ItemForm' 
import ItemList from './ItemList' 
import SubcategoryForm from './SubcategoryForm' 
import styles from './AdminPanel.module.css' 

export default function Categories() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    addItem,
    updateItem,
    deleteItem
  } = useStore()

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false)
  const [itemListModalOpen, setItemListModalOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: ''
  })

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
    setSelectedCategory(categoryId)
  }

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory({
        id: newCategory.name.toLowerCase().replace(/\s+/g, '_'),
        title: newCategory.name,
        description: newCategory.description,
        subcategories: []
      })
      setNewCategory({ name: '', description: '', icon: '' })
      setCategoryModalOpen(false)
    }
  }

  const handleEditCategory = () => {
    if (editingCategory && editingCategory.title.trim()) {
      updateCategory(editingCategory.id, {
        title: editingCategory.title,
        description: editingCategory.description
      })
      setEditingCategory(null)
      setCategoryModalOpen(false)
    }
  }

  const handleSaveSubcategory = (subcategory) => {
    if (selectedCategory) {
      if (editingSubcategory) {
        updateSubcategory(selectedCategory, editingSubcategory.id, subcategory)
      } else {
        addSubcategory(selectedCategory, subcategory)
      }
      setSubcategoryModalOpen(false)
      setEditingSubcategory(null)
    }
  }

  const handleAddItem = (item) => {
    if (selectedCategory && selectedSubcategory) {
      addItem(selectedCategory, selectedSubcategory.id, item)
    }
  }

  const handleEditItem = (itemId, updates) => {
    if (selectedCategory && selectedSubcategory) {
      updateItem(selectedCategory, selectedSubcategory.id, itemId, updates)
    }
  }

  const handleDeleteItem = (itemId) => {
    if (selectedCategory && selectedSubcategory) {
      deleteItem(selectedCategory, selectedSubcategory.id, itemId)
    }
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <button 
          className={`${styles.button} ${styles.primaryButton}`}
          onClick={() => {
            setEditingCategory(null)
            setCategoryModalOpen(true)
          }}
        >
          <IconPlus size={20} />
          Add Category
        </button>
      </div>

      <div className={styles.categoryList}>
        {categories.map(category => (
          <div
            key={category.id}
            className={`${styles.categoryItem} ${selectedCategory === category.id ? styles.selected : ''}`}
          >
            <div className={styles.categoryHeader}>
              <h3 className={styles.categoryName}>{category.title}</h3>
              <div className="flex gap-2">
                <button
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setEditingSubcategory(null)
                    setSubcategoryModalOpen(true)
                  }}
                >
                  <IconFolderPlus size={20} />
                  Add Subcategory
                </button>
                <button
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {expandedCategories[category.id] 
                    ? <IconChevronDown size={20} /> 
                    : <IconChevronRight size={20} />}
                </button>
                <button
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={() => {
                    setEditingCategory({ 
                      ...category, 
                      title: category.title, 
                      description: category.description 
                    })
                    setCategoryModalOpen(true)
                  }}
                >
                  <IconPencil size={20} />
                </button>
                <button
                  className={`${styles.button} ${styles.dangerButton}`}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this category?')) {
                      deleteCategory(category.id)
                    }
                  }}
                >
                  <IconTrash size={20} />
                </button>
              </div>
            </div>

            {expandedCategories[category.id] && (
              <div className={styles.subCategoryList}>
                {category.subcategories?.map(subcategory => (
                  <div key={subcategory.id} className={styles.subCategoryItem}>
                    {subcategory.img ? (
                      <img 
                        src={subcategory.img} 
                        alt={subcategory.name}
                        className={styles.subCategoryImage}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <IconFile size={24} />
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{subcategory.name}</span>
                        <span className="text-sm text-gray-500">
                          {subcategory.items?.length || 0} items
                          {subcategory.items?.filter(item => item.show).length !== subcategory.items?.length && 
                            ` (${subcategory.items?.filter(item => item.show).length || 0} visible)`
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className={`${styles.button} ${styles.primaryButton}`}
                        onClick={() => {
                          setSelectedSubcategory(subcategory)
                          setItemListModalOpen(true)
                        }}
                      >
                        Items
                      </button>
                      <button
                        className={`${styles.button} ${styles.secondaryButton}`}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setEditingSubcategory(subcategory)
                          setSubcategoryModalOpen(true)
                        }}
                      >
                        <IconPencil size={20} />
                      </button>
                      <button
                        className={`${styles.button} ${styles.dangerButton}`}
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this subcategory?')) {
                            deleteSubcategory(category.id, subcategory.id)
                          }
                        }}
                      >
                        <IconTrash size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {categoryModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <input
              type="text"
              className={styles.input}
              value={editingCategory ? editingCategory.title : newCategory.name}
              onChange={(e) => editingCategory
                ? setEditingCategory({ ...editingCategory, title: e.target.value })
                : setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Category name"
            />
            <textarea
              className={styles.input}
              value={editingCategory ? editingCategory.description : newCategory.description}
              onChange={(e) => editingCategory
                ? setEditingCategory({ ...editingCategory, description: e.target.value })
                : setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Category description"
            />
            <div className={styles.modalActions}>
              <button
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={editingCategory ? handleEditCategory : handleAddCategory}
              >
                {editingCategory ? 'Save Changes' : 'Add Category'}
              </button>
              <button
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={() => {
                  setCategoryModalOpen(false)
                  setEditingCategory(null)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {subcategoryModalOpen && (
        <div className={styles.modal}>
          <SubcategoryForm
            initialData={editingSubcategory}
            onSave={handleSaveSubcategory}
            onCancel={() => {
              setSubcategoryModalOpen(false)
              setEditingSubcategory(null)
            }}
          />
        </div>
      )}

      {itemListModalOpen && selectedSubcategory && (
        <div className={styles.modal}>
          <ItemList
            items={selectedSubcategory.items || []}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onClose={() => {
              setItemListModalOpen(false)
              setSelectedSubcategory(null)
            }}
          />
        </div>
      )}
    </>
  )
}