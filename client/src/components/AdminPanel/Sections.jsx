import { useState } from 'react'
import { IconPlus, IconPencil, IconTrash, IconX } from '@tabler/icons-react'
import { useStore } from '../../state'
import './Section.css'

export default function Sections() {
  const { sections, categories, addSection, updateSection, deleteSection } = useStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  
  const [newSection, setNewSection] = useState({
    title: '',
    type: '',
    categories: []
  })

  const handleAddSection = () => {
    if (newSection.title) {
      addSection({
        ...newSection,
        categories: selectedCategories
      })
      setNewSection({
        title: '',
        type: '',
        categories: []
      })
      setSelectedCategories([])
      setModalOpen(false)
    }
  }

  const handleEditSection = () => {
    if (editingSection && editingSection.title) {
      updateSection(editingSection.id, {
        ...editingSection,
        categories: selectedCategories
      })
      setEditingSection(null)
      setSelectedCategories([])
      setModalOpen(false)
    }
  }

  const handleCategorySelect = (categoryId) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
  }

  const getCategoryName = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.title || ''
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1 className="section-title">Sections</h1>
        <button 
          className="add-category-btn"
          onClick={() => {
            setEditingSection(null)
            setSelectedCategories([])
            setModalOpen(true)
          }}
        >
          <IconPlus size={20} />
          Add Section
        </button>
      </div>

      <div className="category-list">
        {sections.map(section => (
          <div key={section.id} className="category-item">
            <div className="category-header">
              <h3 className="category-name">{section.title}</h3>
              <div className="category-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingSection(section)
                    setSelectedCategories(section.categories || [])
                    setModalOpen(true)
                  }}
                >
                  <IconPencil size={20} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteSection(section.id)}
                >
                  <IconTrash size={20} />
                </button>
              </div>
            </div>
            
            <div className="selected-categories">
              {section.categories?.map(categoryId => (
                <span key={categoryId} className="category-tag">
                  {getCategoryName(categoryId)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </h2>
            
            <input
              type="text"
              className="input"
              value={editingSection ? editingSection.title : newSection.title}
              onChange={(e) => {
                if (editingSection) {
                  setEditingSection({ ...editingSection, title: e.target.value })
                } else {
                  setNewSection({ ...newSection, title: e.target.value })
                }
              }}
              placeholder="Section title"
            />

            <select
              className="category-selector"
              onChange={(e) => handleCategorySelect(e.target.value)}
              value=""
            >
              <option value="">Select categories to add</option>
              {categories.map(category => (
                <option 
                  key={category.id} 
                  value={category.id}
                  disabled={selectedCategories.includes(category.id)}
                >
                  {category.title}
                </option>
              ))}
            </select>

            <div className="selected-categories">
              {selectedCategories.map(categoryId => (
                <span key={categoryId} className="category-tag">
                  {getCategoryName(categoryId)}
                  <button
                    className="remove-tag"
                    onClick={() => handleRemoveCategory(categoryId)}
                  >
                    <IconX size={16} />
                  </button>
                </span>
              ))}
            </div>

            <div className="modal-actions">
              <button 
                className="primary-btn"
                onClick={editingSection ? handleEditSection : handleAddSection}
              >
                {editingSection ? 'Save Changes' : 'Add Section'}
              </button>
              <button 
                className="secondary-btn"
                onClick={() => {
                  setModalOpen(false)
                  setEditingSection(null)
                  setSelectedCategories([])
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}