import { StateCreator } from 'zustand'

export const createSidebarItemPanelSlice = (set, get) => ({
  handleAddObject: (item) => {
    const { addObject, updateObjectSize } = get()
    const object = addObject(item.id)
    
    if (object && item.properties) {
      const initialDimensions = {
        width: item.properties.width?.[0]?.value,
        height: item.properties.height?.[0]?.value,
        depth: item.properties.depth?.[0]?.value
      }
      updateObjectSize(object, initialDimensions)
    }
  }
})