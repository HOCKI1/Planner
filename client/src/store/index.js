import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createCategoriesSlice } from './slices/categoriesSlice'
import { createSectionsSlice } from './slices/sectionsSlice'
import { createObjectsSlice } from './slices/objectsSlice'
import { createUISlice } from './slices/uiSlice'
import { createSidebarItemPanelSlice } from './slices/sidebarItemPanelSlice'

export const useStore = create(
  persist(
    (...a) => ({
      ...createCategoriesSlice(...a),
      ...createSectionsSlice(...a),
      ...createObjectsSlice(...a),
      ...createUISlice(...a),
      ...createSidebarItemPanelSlice(...a),
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