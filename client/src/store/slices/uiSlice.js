import { StateCreator } from 'zustand'
import { GRID_SIZE } from '../../config/constants'

export const createUISlice = (set) => ({
  selectedCategory: null,
  selectedSubcategory: null,
  gridSize: GRID_SIZE,
  is3DMode: false,
  camera3D: {
    position: { x: 10, y: 10, z: 10 },
    rotation: { x: -Math.PI / 4, y: Math.PI / 4, z: 0 },
    target: { x: 0, y: 0, z: 0 }
  },

  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSelectedSubcategory: (subcategoryId) => set({ selectedSubcategory: subcategoryId }),
  setIs3DMode: (is3DMode) => set({ is3DMode }),
  setCamera3D: (camera3D) => set((state) => ({
    camera3D: { ...state.camera3D, ...camera3D }
  })),
})