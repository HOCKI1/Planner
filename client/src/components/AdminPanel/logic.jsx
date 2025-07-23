import { useStore } from '../../state'

export function useAdminPanelLogic() {
  const { 
    categories,
    sections,
    selectedCategory,
    selectedSubcategory,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    addItem,
    updateItem,
    deleteItem,
    setSelectedCategory,
    setSelectedSubcategory,
    addSection,
    updateSection,
    deleteSection
  } = useStore()

  const handleAddCategory = (category) => {
    addCategory({
      id: category.name.toLowerCase().replace(/\s+/g, '_'),
      title: category.name,
      description: category.description,
      subcategories: []
    })
  }

  const handleEditCategory = (categoryId, updates) => {
    updateCategory(categoryId, {
      ...updates,
      title: updates.name
    })
  }

  const handleDeleteCategory = (categoryId) => {
    deleteCategory(categoryId)
  }

  const handleAddSubcategory = (categoryId, subcategory) => {
    addSubcategory(categoryId, {
      id: subcategory.id || subcategory.name.toLowerCase().replace(/\s+/g, '_'),
      name: subcategory.name,
      image: subcategory.image,
      items: []
    })
  }

  const handleEditSubcategory = (categoryId, subcategoryId, updates) => {
    updateSubcategory(categoryId, subcategoryId, updates)
  }

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    deleteSubcategory(categoryId, subcategoryId)
  }

  const handleAddItem = (categoryId, subcategoryId, item) => {
    addItem(categoryId, subcategoryId, {
      id: item.id || Date.now().toString(),
      name: item.name,
      modelPath: item.modelPath,
      properties: item.properties
    })
  }

  const handleEditItem = (categoryId, subcategoryId, itemId, updates) => {
    updateItem(categoryId, subcategoryId, itemId, updates)
  }

  const handleDeleteItem = (categoryId, subcategoryId, itemId) => {
    deleteItem(categoryId, subcategoryId, itemId)
  }

  const handleAddSection = (section) => {
    addSection({
      id: section.title.toLowerCase().replace(/\s+/g, '_'),
      title: section.title,
      type: section.type,
      categoryId: section.categoryId,
      items: []
    })
  }

  const handleEditSection = (sectionId, updates) => {
    updateSection(sectionId, updates)
  }

  const handleDeleteSection = (sectionId) => {
    deleteSection(sectionId)
  }

  return {
    categories,
    sections,
    selectedCategory,
    selectedSubcategory,
    addCategory: handleAddCategory,
    editCategory: handleEditCategory,
    deleteCategory: handleDeleteCategory,
    addSubcategory: handleAddSubcategory,
    editSubcategory: handleEditSubcategory,
    deleteSubcategory: handleDeleteSubcategory,
    addItem: handleAddItem,
    editItem: handleEditItem,
    deleteItem: handleDeleteItem,
    addSection: handleAddSection,
    editSection: handleEditSection,
    deleteSection: handleDeleteSection,
    setSelectedCategory,
    setSelectedSubcategory
  }
}