import { StateCreator } from 'zustand'

export const createCategoriesSlice = (set, get) => ({
  categories: [
    {
      id: 'storage',
      title: 'Пространство для хранения',
      description: 'Шкафы, тумбы и системы хранения',
      subcategories: [
        {
          id: 'cabinets',
          name: 'Шкафы',
          items: [
            {
              id: 1,
              width: 0.55,
              depth: 0.6,
              height: 0.85,
              rotZ: 0,
              modelPath: '/models/tumba1.obj',
              materials: [
                {
                  color: '#C0C0C0',
                  matPath: '/models/tumba1.mtl',
                },
                {
                  color: '#FFFFFF',
                  matPath: '/models/tumba1.mtl',
                },
              ],
              imgPath: '/models/tumba1.png',
              name: 'Тумба обычная',
            },
            {
              id: 2,
              width: 0.3,
              depth: 0.6,
              height: 0.85,
              rotZ: 0,
              modelPath: '/models/tumba2.obj',
              materials: [
                {
                  color: '#C0C0C0',
                  matPath: '/models/tumba2.mtl',
                },
                {
                  color: '#FFFFFF',
                  matPath: '/models/tumba2.mtl',
                },
              ],
              imgPath: '/models/tumba2.png',
              name: 'Тумба узкая',
            },
            {
              id: 3,
              width: 0.8,
              depth: 0.6,
              height: 0.85,
              rotZ: 0,
              modelPath: '/models/tumba3.obj',
              materials: [
                {
                  color: '#C0C0C0',
                  matPath: '/models/tumba3.mtl',
                },
                {
                  color: '#FFFFFF',
                  matPath: '/models/tumba3.mtl',
                },
              ],
              imgPath: '/models/tumba3.png',
              name: 'Тумба широкая',
            },
          ]
        }
      ]
    },
    {
      id: 'appliances',
      title: 'Техника',
      description: 'Бытовая техника',
      subcategories: [
        {
          id: 'refrigerators',
          name: 'Холодильники',
          items: [
            {
              id: 4,
              width: 0.75,
              depth: 0.8,
              height: 1.7,
              rotZ: 0,
              modelPath: '/models/holodilnik.obj',
              materials: [
                {
                  color: '#C0C0C0',
                  matPath: '/models/holodilnik.mtl',
                },
                {
                  color: '#FFFFFF',
                  matPath: '/models/holodilnik.mtl',
                },
              ],
              imgPath: '/models/holodilnik.png',
              name: 'Холодильник обычный',
            },
          ]
        }
      ]
    }
  ],

  addCategory: (category) => set((state) => ({
    categories: [...state.categories, { ...category, subcategories: [] }]
  })),

  updateCategory: (categoryId, updates) => set((state) => ({
    categories: state.categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    )
  })),

  deleteCategory: (categoryId) => set((state) => ({
    categories: state.categories.filter(cat => cat.id !== categoryId)
  })),

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
    )
  })),

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
})