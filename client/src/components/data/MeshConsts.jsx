import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export const useUserMeshesStore = create((set, get) => ({
  user_meshes: [
    // posX - позиция по X(горизонталь в 2D)
    // posY - позиция по Z(вертикаль в 2D)
    // scaleX - размер по ширине(в 2D)(ось X в 3D)
    // scaleY - размер по (высоте в 2D)(ширине(ось Z) в 3D)
    // height - размер по высоте(в 3D)(ось Y в 3D)
    // rotZ - поворот по Y(в 3D)
    // ВАЖНО!!! по умолчанию ширина меша должна быть расположена по оси X, а глубина по оси Z
    //{ uuid: uuidv4(), id: 1, posX: 0.7, posY: 0, scaleX: 0.55, scaleY: 0.6, height: 0.85, rotZ: 0, modelPath: '/models/tumba1.obj', matPath: '/models/tumba1.mtl', isSelected: false },
  ],

  // добавление меша
  addUserMesh: (mesh) =>
    set((state) => ({
      user_meshes: [...state.user_meshes, mesh],
    })),

  // удаление меша
  removeUserMesh: (uuid) =>
    set((state) => ({
      user_meshes: state.user_meshes.filter((mesh) => mesh.uuid !== uuid),
    })),

  // выбор меша
  isSelected: (uuid) =>
    set((state) => ({
      user_meshes: state.user_meshes.map((mesh) =>
        mesh.uuid === uuid ? { ...mesh, isSelected: !mesh.isSelected } : mesh
      ),
    })),

  // снятие выбора со всех мешей
  deselectAllMeshes: () =>
    set((state) => ({
      user_meshes: state.user_meshes.map((mesh) =>
        mesh.isSelected ? { ...mesh, isSelected: false } : mesh
      ),
    })),

  // снятие выбора с предыдущего меша
  deselectPreviousMesh: (mesh_id) =>
    set((state) => ({
      user_meshes: state.user_meshes.map((mesh) =>
        mesh.isSelected && mesh.id !== mesh_id
          ? { ...mesh, isSelected: false }
          : mesh
      ),
    })),

  // обновление позиции меша
  updateMeshPos: (uuid, newPosX, newPosY) => {
    set((state) => ({
      user_meshes: state.user_meshes.map((mesh) =>
        mesh.uuid === uuid ? { ...mesh, posX: newPosX, posY: newPosY } : mesh
      ),
    }));
  },

  // обновление поворота меша
  updateMeshRot: (id, newRotZ) =>
    set((state) => ({
      user_meshes: state.user_meshes.map((mesh) =>
        mesh.id === id ? { ...mesh, rotZ: newRotZ } : mesh
      ),
    })),

  importUserMeshes: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      const validated = parsed.map((mesh) => ({
        ...mesh,
        uuid: uuidv4(), // генерация новых uuid
      }));
      set({
        user_meshes: [...validated],
      });
    } catch (e) {
      console.error("Ошибка при импорте мешей:", e);
    }
  },

  exportUserMeshes: () => {
    const userMeshes = get().user_meshes;
    const json = JSON.stringify(userMeshes, null, 2); // красиво отформатированный JSON

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const uuid = crypto.randomUUID();
    a.download = `scene-${uuid}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));

export const useGlobalMeshStore = create((set) => ({
  kitchenPoints: [],

  setKitchenPointAtIndex: (index, newPoint) =>
    set((state) => {
      const updated = [...state.kitchenPoints];
      updated[index] = newPoint;
      return { kitchenPoints: updated };
    }),

  saveKitchenPoints: (points) => set({ kitchenPoints: points }),

  setFourPointKitchen: () =>
    set({
      kitchenPoints: [
        { x: 0, y: 0 },
        { x: 0, y: 3 },
        { x: 3, y: 3 },
        { x: 3, y: 0 },
      ],
    }),

  setFivePointKitchen: () =>
    set({
      kitchenPoints: [
        { x: 1.5, y: 0 },
        { x: 0, y: 1.5 },
        { x: 0, y: 3 },
        { x: 3, y: 3 },
        { x: 3, y: 0 },
      ],
    }),

  setSixPointKitchen: () =>
    set({
      kitchenPoints: [
        { x: 0, y: 0 },
        { x: 0, y: 3 },
        { x: 3, y: 3 },
        { x: 3, y: 1.5 },
        { x: 1.5, y: 1.5 },
        { x: 1.5, y: 0 },
      ],
    }),

  setEightPointKitchen: () =>
    set({
      kitchenPoints: [
        { x: 0, y: 0 },
        { x: 0, y: 3 },
        { x: 4.5, y: 3 },
        { x: 4.5, y: 0 },
        { x: 3, y: 0 },
        { x: 3, y: 1.5 },
        { x: 1.5, y: 1.5 },
        { x: 1.5, y: 0 },
      ],
    }),

  global_meshes: null,

  // загрузка списка мешей и категорий
  loadGlobalMeshes: async () => {
    try {
      const response = await fetch("/data.json");
      const jsonData = await response.json();
      set({ global_meshes: jsonData });
    } catch (error) {
      console.error("Failed to load global meshes:", error);
    }
  },

  // переменные для leftpanel категорий
  selectedCategory: null,
  selectedSubcategory: null,
  // selectedObject: null,

  // выбор категорий
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSelectedSubcategory: (subcategoryId) =>
    set({ selectedSubcategory: subcategoryId }),
  // setSelectedObject: (object) => set({ selectedObject: object }),

  // размер сетки
  cellSize: 10,

  // изменение размера сетки
  setCellSize: (size, oldSize) => {
    // доступные размеры
    const availableSizes = [1, 2, 5, 10, 20, 50];

    // новый размер
    let newSize = 0;

    // предыдущий размер сетки
    const currentSize = oldSize;

    // проверка на первый элемент массива
    if (size < availableSizes[0]) {
      newSize = availableSizes[0];
    }
    // проверка на любой другой элемент
    else if (
      availableSizes[0] <
      size <
      availableSizes[availableSizes.length - 1]
    ) {
      if (currentSize > size) {
        // если новый размер меньше текущего
        newSize = availableSizes[availableSizes.indexOf(currentSize) - 1];
      } else if (currentSize < size) {
        // если новый размер больше текущего
        newSize = availableSizes[availableSizes.indexOf(currentSize) + 1];
      }
    }
    // проверка на последний элемент
    else if (size > availableSizes[availableSizes.length - 1]) {
      size = availableSizes[availableSizes.length - 1];
    }

    // установка нового размера
    set({ cellSize: newSize });
  },

  // слой в 2D виде
  currentLayer: 1,

  // смена слоя
  setCurrentLayer: (layer) => set({ currentLayer: layer }),
}));
