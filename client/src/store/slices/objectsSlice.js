import { StateCreator } from 'zustand'

/**
 * Слайс для управления 3D-объектами.
 * Хранит список объектов, выбранный объект и методы для их модификации.
 */
export const createObjectsSlice = (set, get) => ({
  // Список всех объектов, добавленных пользователем
  objects: [],

  // Выбранный в данный момент объект (например, для редактирования)
  selectedObject: null,

  /**
   * Добавляет объект по типу (id) из списка категорий.
   * @param {string} type - ID объекта
   */
  addObject: (type) => {
    const { categories } = get()
    let objectData = null

    // Поиск объекта в списке категорий
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

    // делаем новый объект с параметрами по умолчанию
    const object = {
      id: Date.now(), // Уникальный ID на основе времени
      type, // Тип (id из item)
      name: objectData.name, // Название из данных
      x: 0, // Начальная позиция
      y: 0,
      width: objectData.properties?.width?.[0]?.value || 60, // Размер по ширине
      height: objectData.properties?.height?.[0]?.value || 85, // Размер по высоте
      depth: objectData.properties?.depth?.[0]?.value || 60, // Глубина
      rotation: 0, // Начальный угол поворота
      modelPath: objectData.modelPath, // Путь к 3D модели
      properties: {
        // Цвет по умолчанию или коричневый
        color: objectData.properties?.colors?.[0] || '#8B4513'
      }
    }

    // Добавления объекта в список и делаем его выбранным
    set((state) => ({
      objects: [...state.objects, object],
      selectedObject: object
    }))

    return object
  },

  /**
   * Обновляет позицию указанного объекта.
   * @param {object} object - Целевой объект
   * @param {object} position - Новая позиция (x, y)
   */
  updateObjectPosition: (object, position) => set((state) => ({
    objects: state.objects.map(obj =>
      obj.id === object.id
        ? { ...obj, ...position } // Обновляем координаты
        : obj
    )
  })),

  /**
   * Обновляет размер объекта.
   * обновляет selectedObject
   * @param {object} object - Целевой объект
   * @param {object} size - Новые размеры (width, height, depth)
   */
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

  /**
   * Обновляет свойства объекта 
   * @param {object} object - Целевой объект
   * @param {object} properties - Новые свойства
   */
  updateObjectProperties: (object, properties) => set((state) => ({
    objects: state.objects.map(obj =>
      obj.id === object.id
        ? { ...obj, properties }
        : obj
    )
  })),

  /**
   * Поворачивает объект на указанный угол.
   * @param {object} object - Целевой объект
   * @param {number} angle - Угол, на который нужно повернуть
   */
  rotateObject: (object, angle) => set((state) => ({
    objects: state.objects.map(obj =>
      obj.id === object.id
        ? { ...obj, rotation: (obj.rotation || 0) + angle }
        : obj
    )
  })),

  /**
   * Удаляет объект из списка.
   * @param {object} object - Целевой объект
   */
  deleteObject: (object) => set((state) => ({
    objects: state.objects.filter(obj => obj.id !== object.id),
    selectedObject: state.selectedObject?.id === object.id ? null : state.selectedObject
  })),

  /**
   * Устанавливает выбранный объект.
   * @param {object|null} object - Новый выбранный объект или null
   */
  setSelectedObject: (object) => set({ selectedObject: object }),
})
