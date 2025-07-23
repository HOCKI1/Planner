import { StateCreator } from 'zustand'

export const createSectionsSlice = (set, get) => ({
  sections: [
    {
      id: 'furniture_and_appliances',
      title: 'Мебель и техника',
      number: '1',
      categories: ['storage', 'appliances']
    },
    {
      id: 'interior',
      title: 'Интерьер',
      number: '2',
      categories: ['decor', 'lighting']
    }
  ],

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
})