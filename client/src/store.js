import { create } from 'zustand'

// Загрузка из localStorage
const savedState = localStorage.getItem('kitchen-planner-state')
const initialState = savedState ? JSON.parse(savedState) : {
  zoom: 1,
  pan: { x: 0, y: 0 },
  objects: [],
  selectedObject: null,
  isSnapping: true
}

export const useStore = create((set, get) => ({
  ...initialState,

  setZoom: (zoom) => {
    set({ zoom })
    save()
  },
  setPan: (pan) => {
    set({ pan })
    save()
  },
  setObjects: (objects) => {
    set({ objects })
    save()
  },
  setSelectedObject: (selectedObject) => {
    set({ selectedObject })
    save()
  },
  setSnapping: (isSnapping) => {
    set({ isSnapping })
    save()
  },
  addObject: (object) => {
    const newObjects = [...get().objects, object]
    set({ objects: newObjects, selectedObject: object })
    save()
  },
  updateObject: (object, updates) => {
    const updatedObjects = get().objects.map(obj =>
      obj === object ? { ...obj, ...updates } : obj
    )
    set({ objects: updatedObjects })
    save()
  },
  deleteObject: (object) => {
    const filteredObjects = get().objects.filter(obj => obj !== object)
    set({ objects: filteredObjects, selectedObject: null })
    save()
  }
}))

// Функция для сохранения в localStorage
function save() {
  const state = useStore.getState()
  localStorage.setItem('kitchen-planner-state', JSON.stringify({
    zoom: state.zoom,
    pan: state.pan,
    objects: state.objects,
    selectedObject: state.selectedObject,
    isSnapping: state.isSnapping
  }))
}
