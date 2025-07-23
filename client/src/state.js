import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GRID_SIZE } from './config/constants'

const initialState = {
  sections: [],
  categories: [],
  selectedCategory: null,
  selectedSubcategory: null,
  objects: [],
  selectedObject: null,
  gridSize: GRID_SIZE,
  is3DMode: false,
  camera3D: {
    position: { x: 10, y: 10, z: 10 },
    rotation: { x: -Math.PI / 4, y: Math.PI / 4, z: 0 },
    target: { x: 0, y: 0, z: 0 }
  }
}

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Load data from data.json
      loadInitialData: async () => {
        try {
          const response = await fetch('/data.json')
          const data = await response.json()
          set({
            sections: data.sections || [],
            categories: data.categories || []
          })
          console.log('Data loaded from data.json:', data)
        } catch (error) {
          console.error('Failed to load initial data:', error)
        }
      },

      setCategories: (categories) => set({ categories }),
      setSections: (sections) => set({ sections }),

      // Section management
      addSection: (section) => set((state) => ({
        sections: [...state.sections, {
          ...section,
          id: section.title.toLowerCase().replace(/\s+/g, '_'),
          number: (state.sections.length + 1).toString()
        }]
      })),

      updateSection: (sectionId, updates) => set((state) => ({
        sections: state.sections.map(section =>
          section.id === sectionId ? { ...section, ...updates } : section
        )
      })),

      deleteSection: (sectionId) => set((state) => ({
        sections: state.sections.filter(section => section.id !== sectionId)
      })),

      // Category management
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, { ...category, subcategories: [] }]
      })),

      updateCategory: (categoryId, updates) => set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId ? { ...cat, ...updates } : cat
        )
      })),

      deleteCategory: (categoryId) => set((state) => ({
        categories: state.categories.filter(cat => cat.id !== categoryId),
        selectedCategory: state.selectedCategory === categoryId ? null : state.selectedCategory
      })),

      // Subcategory management
      addSubcategory: (categoryId, subcategory) => set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? { ...cat, subcategories: [...cat.subcategories, { ...subcategory, items: [] }] }
            : cat
        )
      })),

      updateSubcategory: (categoryId, subcategoryId, updates) => set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId ? { ...sub, ...updates } : sub
              )
            }
            : cat
        )
      })),

      deleteSubcategory: (categoryId, subcategoryId) => set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? {
              ...cat,
              subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
            }
            : cat
        ),
        selectedSubcategory: state.selectedSubcategory === subcategoryId ? null : state.selectedSubcategory
      })),

      // Item management
      addItem: (categoryId, subcategoryId, item) => set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? { ...sub, items: [...sub.items, item] }
                  : sub
              )
            }
            : cat
        )
      })),

      updateItem: (categoryId, subcategoryId, itemId, updates) => set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? {
                    ...sub,
                    items: sub.items.map(item =>
                      item.id === itemId ? { ...item, ...updates } : item
                    )
                  }
                  : sub
              )
            }
            : cat
        )
      })),

      deleteItem: (categoryId, subcategoryId, itemId) => set((state) => ({
        categories: state.categories.map(cat =>
          cat.id === categoryId
            ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? { ...sub, items: sub.items.filter(item => item.id !== itemId) }
                  : sub
              )
            }
            : cat
        )
      })),

      // UI State management
      setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
      setSelectedSubcategory: (subcategoryId) => set({ selectedSubcategory: subcategoryId }),
      setSelectedObject: (object) => set({ selectedObject: object }),
      setIs3DMode: (is3DMode) => set({ is3DMode }),
      setCamera3D: (camera3D) => set((state) => ({
        camera3D: { ...state.camera3D, ...camera3D }
      })),

      // Project management
      exportProject: () => {
        const state = get()
        const projectData = {
          sections: state.sections,
          categories: state.categories,
          objects: state.objects,
          camera3D: state.camera3D,
          exportedAt: new Date().toISOString()
        }
        
        const blob = new Blob([JSON.stringify(projectData, null, 2)], {
          type: 'application/json'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `kitchen-project-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
      },

      importProject: async (file) => {
        try {
          const text = await file.text()
          const projectData = JSON.parse(text)
          
          set({
            sections: projectData.sections || state.sections,
            categories: projectData.categories || state.categories,
            objects: projectData.objects || [],
            camera3D: projectData.camera3D || state.camera3D
          })
        } catch (error) {
          throw new Error('Invalid project file format')
        }
      },

      resetProject: () => {
        set({
          objects: [],
          selectedObject: null,
          selectedCategory: null,
          selectedSubcategory: null
        })
      },

      // Object management
      addObject: (type) => {
        const { categories } = get()
        let objectData = null

        // Search for the object in categories
        for (const category of categories) {
          for (const subcategory of category.subcategories) {
            const item = subcategory.items.find(item => item.id === type)
            if (item) {
              objectData = item
              break
            }
          }
          if (objectData) break
        }

        if (!objectData) return null

        const object = {
          id: Date.now(),
          type,
          name: objectData.name,
          x: 0,
          y: 0,
          width: objectData.properties?.width?.[0]?.value || 60,
          height: objectData.properties?.height?.[0]?.value || 85,
          depth: objectData.properties?.depth?.[0]?.value || 60,
          rotation: 0,
          modelPath: objectData.modelPath,
          properties: {
            color: objectData.properties?.colors?.[0] || '#8B4513'
          }
        }

        set((state) => ({
          objects: [...state.objects, object],
          selectedObject: object
        }))

        return object
      },

      updateObjectPosition: (object, position) => set((state) => ({
        objects: state.objects.map(obj =>
          obj.id === object.id
            ? { ...obj, ...position }
            : obj
        )
      })),

      updateObjectSize: (object, size) => set((state) => ({
        objects: state.objects.map(obj =>
          obj.id === object.id
            ? { ...obj, ...size }
            : obj
        ),
        selectedObject: state.selectedObject?.id === object.id
          ? { ...state.selectedObject, ...size }
          : state.selectedObject
      })),

      updateObjectProperties: (object, properties) => set((state) => ({
        objects: state.objects.map(obj =>
          obj.id === object.id
            ? { ...obj, properties }
            : obj
        )
      })),

      updateObjectRotation: (object, rotation) => set((state) => ({
        objects: state.objects.map(obj =>
          obj.id === object.id
            ? { ...obj, rotation }
            : obj
        )
      })),

      rotateObject: (object, angle) => set((state) => ({
        objects: state.objects.map(obj =>
          obj.id === object.id
            ? { ...obj, rotation: (obj.rotation || 0) + angle }
            : obj
        )
      })),

      deleteObject: (object) => set((state) => ({
        objects: state.objects.filter(obj => obj.id !== object.id),
        selectedObject: state.selectedObject?.id === object.id ? null : state.selectedObject
      }))
    }),
    {
      name: 'kitchen-planner-storage',
      partialize: (state) => ({
        sections: state.sections,
        categories: state.categories,
        objects: state.objects,
        selectedCategory: state.selectedCategory,
        selectedSubcategory: state.selectedSubcategory,
        gridSize: state.gridSize,
        camera3D: state.camera3D
      })
    }
  )
)