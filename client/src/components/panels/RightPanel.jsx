import { useEffect, useState } from "react";
import {
  IconRotate,
  IconRotateClockwise,
  IconRuler,
  IconPalette,
  IconTrash,
  IconSettings,
  IconResize,
} from "@tabler/icons-react";
import { useStore } from "../../state";
import { useUserMeshesStore, useGlobalMeshStore } from "../data/MeshConsts";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
/**
 * Компонент RightPanel — управление свойствами и изменениями объекта
 * Предоставляет интерфейс для редактирования размеров, поворота и других свойств выбранного объекта
 */
export default function RightPanel() {
  // Получаем нужные методы и состояния из глобального хранилища
  const {
    selectedObject,
    categories,
  } = useStore();

  const { user_meshes, updateMeshRot, removeUserMesh, addUserMesh } =
    useUserMeshesStore();

  const { global_meshes } = useGlobalMeshStore();

  // Локальное состояние для активной вкладки и выбора размеров
  const [activeTab, setActiveTab] = useState("edit");

  /**
   * Получить размеры выбранного объекта из категорий
   * @returns {Object} Объект с массивами ширины, высоты и глубины
   */
  const getObjectDimensions = () => {
    if (!selectedObject || !categories || !Array.isArray(categories)) {
      return { width: [], height: [], depth: [] };
    }

    // Поиск по категориям нужного объекта и его размеров
    for (const category of categories) {
      if (category && Array.isArray(category.subcategories)) {
        for (const subcategory of category.subcategories) {
          if (subcategory && Array.isArray(subcategory.items)) {
            const item = subcategory.items.find(
              (item) => item.id === selectedObject.type
            );
            if (item && item.properties) {
              return {
                width: item.properties.width || [],
                height: item.properties.height || [],
                depth: item.properties.depth || [],
              };
            }
          }
        }
      }
    }

    return { width: [], height: [], depth: [] };
  };

  /**
   * Получить локализованную метку размера
   * @param {string} type - Тип размера (width/height/depth)
   * @returns {string} Локализованная строка
   */
  const getDimensionLabel = (type) => {
    switch (type) {
      case "width":
        return "Ширина";
      case "depth":
        return "Глубина";
      case "height":
        return "Высота";
      default:
        return "";
    }
  };

  /**
   * Получить данные текущего элемента из глобальных мешей
   * @param {number} itemId - ID элемента
   * @returns {Object|null} Данные элемента или null, если не найден
   */
  const getCurrentItemData = (itemId) => {
    if (!global_meshes?.categories) return null;

    for (const category of global_meshes.categories) {
      for (const subcategory of category.subcategories) {
        const item = subcategory.items.find((item) => item.id === itemId);
        if (item) return item;
      }
    }
    return null;
  };

  /**
   * Получить все элементы из той же подкатегории, что и выбранный меш
   * @param {number} itemId - ID текущего элемента
   * @returns {Array} Массив элементов из подкатегории
   */
  const getSubcategoryItems = (itemId) => {
    if (!global_meshes?.categories) return [];

    for (const category of global_meshes.categories) {
      for (const subcategory of category.subcategories) {
        const hasItem = subcategory.items.some((item) => item.id === itemId);
        if (hasItem) {
          return subcategory.items;
        }
      }
    }
    return [];
  };

  /**
   * Сменить вариант модели (размер или цвет)
   * @param {number} newItemId - ID нового варианта
   */
  const changeModelVariant = (newItemId) => {
    const selected_mesh = user_meshes?.find((mesh) => mesh.isSelected === true);
    if (!selected_mesh) return;

    const newItemData = getCurrentItemData(newItemId);
    if (!newItemData) {
      toast.error("Вариант модели не найден");
      return;
    }

    // Сохраняем текущую позицию и поворот
    const { posX, posY, rotZ, uuid } = selected_mesh;

    // Удаляем текущий меш
    removeUserMesh(uuid);

    // Добавляем новый меш с теми же координатами и поворотом
    addUserMesh({
      uuid: uuidv4(),
      id: newItemData.id,
      posX,
      posY,
      scaleX: newItemData.width,
      scaleY: newItemData.depth,
      height: newItemData.height,
      rotZ,
    });

    toast.success(`Вариант "${newItemData.name}" применён!`);
  };

  const selected_mesh = user_meshes?.find((mesh) => mesh.isSelected === true);

  useEffect(() => {
    if (selected_mesh) {
      setActiveTab("edit");
    }
  }, [selected_mesh]);

  // Получаем данные текущего элемента и варианты
  const currentItemData = selected_mesh ? getCurrentItemData(selected_mesh.id) : null;
  const subcategoryItems = selected_mesh ? getSubcategoryItems(selected_mesh.id) : [];

  // Получаем варианты размеров
  const widthVariants = currentItemData?.width_variants?.map((variant) => {
    const variantItem = subcategoryItems.find((item) => item.id === variant.id);
    return variantItem ? {
      id: variant.id,
      name: `${Math.floor(variantItem.width * 100)}×${Math.floor(variantItem.depth * 100)}×${Math.floor(variantItem.height * 100)} см`,
      item: variantItem
    } : null;
  }).filter(Boolean) || [];

  // Получаем варианты цветов
  const colorVariants = currentItemData?.color_variants?.map((variant) => {
    const variantItem = subcategoryItems.find((item) => item.id === variant.id);
    return variantItem ? {
      id: variant.id,
      color: variant.color,
      name: variantItem.name,
      item: variantItem
    } : null;
  }).filter(Boolean) || [];

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Панель навигации - только 2 кнопки */}
      <div className="flex-shrink-0 bg-gray-50 p-1 rounded-xl mb-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-1">
          <button
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm ${activeTab === "edit"
                ? "bg-white text-orange-600 shadow-sm border border-orange-200"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("edit")}
          >
            <div className="flex items-center justify-center gap-2">
              <IconSettings size={16} />
              <span>Редактировать</span>
            </div>
          </button>
          <button
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm ${activeTab === "design"
                ? "bg-white text-orange-600 shadow-sm border border-orange-200"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            onClick={() => setActiveTab("design")}
          >
            <div className="flex items-center justify-center gap-2">
              <IconPalette size={16} />
              <span>Дизайн</span>
            </div>
          </button>
        </div>
      </div>

      {/* Правая панель с прокруткой */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {/* Панель редактирования */}
        {activeTab === "edit" && selected_mesh && (
          <div className="space-y-4">
            {/* Информация об объекте */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <IconRuler size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    {currentItemData?.name || "Объект"}
                  </h3>
                  <p className="text-xs text-gray-600">Текущие размеры</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-2 rounded-lg text-center border border-orange-200">
                  <div className="text-xs text-gray-500 mb-1">Ширина</div>
                  <div className="font-bold text-gray-800 text-sm">
                    {Math.floor(selected_mesh.scaleX * 100)} см
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg text-center border border-orange-200">
                  <div className="text-xs text-gray-500 mb-1">Глубина</div>
                  <div className="font-bold text-gray-800 text-sm">
                    {Math.floor(selected_mesh.scaleY * 100)} см
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg text-center border border-orange-200">
                  <div className="text-xs text-gray-500 mb-1">Высота</div>
                  <div className="font-bold text-gray-800 text-sm">
                    {Math.floor(selected_mesh.height * 100)} см
                  </div>
                </div>
              </div>
            </div>

            {/* Варианты размеров - теперь в редактировании */}
            {widthVariants.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                    <IconResize size={12} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Варианты размеров
                  </h3>
                </div>

                <div className="space-y-2">
                  {widthVariants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`w-full p-3 text-left rounded-xl border transition-all duration-200 hover:shadow-md ${variant.id === selected_mesh.id
                          ? "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 shadow-sm"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                        }`}
                      onClick={() => changeModelVariant(variant.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-medium text-sm ${variant.id === selected_mesh.id ? "text-orange-800" : "text-gray-800"
                            }`}>
                            {variant.name}
                          </div>
                          {variant.item.price && (
                            <div className="text-xs font-semibold text-green-600 mt-1">
                              ${variant.item.price}
                            </div>
                          )}
                        </div>
                        {variant.id === selected_mesh.id && (
                          <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопки поворота */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                  <IconRotate size={12} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">Поворот</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  className="group flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 hover:shadow-md"
                  onClick={() =>
                    updateMeshRot(selected_mesh.id, selected_mesh.rotZ + 5)
                  }
                >
                  <IconRotate size={16} className="text-blue-600 group-hover:rotate-12 transition-transform" />
                  <span className="font-medium text-blue-700 text-sm">Против часовой</span>
                </button>

                <button
                  className="group flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 hover:shadow-md"
                  onClick={() =>
                    updateMeshRot(selected_mesh.id, selected_mesh.rotZ - 5)
                  }
                >
                  <IconRotateClockwise size={16} className="text-green-600 group-hover:-rotate-12 transition-transform" />
                  <span className="font-medium text-green-700 text-sm">По часовой</span>
                </button>
              </div>
            </div>

            {/* Кнопка удаления объекта */}
            <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                  <IconTrash size={12} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-red-800">Удалить объект</h3>
              </div>

              <button
                className="group w-full flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-200 hover:shadow-md"
                onClick={() => {
                  if (confirm("Вы уверены, что хотите удалить объект?")) {
                    removeUserMesh(selected_mesh.uuid);
                  }
                }}
              >
                <IconTrash size={16} className="text-red-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-red-700 text-sm">Удалить объект</span>
              </button>
            </div>
          </div>
        )}

        {/* Вкладка дизайна */}
        {activeTab === "design" && selected_mesh && (
          <div className="space-y-4">
            {/* Варианты цвета */}
            {colorVariants.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                    <IconPalette size={12} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Варианты цвета
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {colorVariants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`group relative w-full aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${variant.id === selected_mesh.id
                          ? "border-orange-400 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                        }`}
                      style={{
                        backgroundColor: variant.color,
                      }}
                      onClick={() => changeModelVariant(variant.id)}
                      title={`${variant.name} - ${variant.color}`}
                    >
                      {/* Индикатор выбранного цвета */}
                      {variant.id === selected_mesh.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                        </div>
                      )}

                      {/* Подсказка с названием цвета */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        {variant.color}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Информация о текущем цвете */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">
                    Текущий цвет: <span className="font-medium text-gray-800">{
                      colorVariants.find(v => v.id === selected_mesh.id)?.color || "Не определен"
                    }</span>
                  </div>
                </div>
              </div>
            )}

            {/* Дополнительные настройки дизайна */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <IconSettings size={12} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  Дополнительные настройки
                </h3>
              </div>

              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <IconPalette size={24} className="text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-600 mb-2">Скоро будет доступно</h3>
                <p className="text-sm text-gray-500">Дополнительные настройки дизайна будут добавлены позже</p>
              </div>
            </div>

            {/* Если нет вариантов цвета */}
            {colorVariants.length === 0 && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                    <IconPalette size={12} className="text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Варианты цвета
                  </h3>
                </div>

                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconPalette size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-600 mb-2">Нет доступных цветов</h3>
                  <p className="text-sm text-gray-500">Для этого объекта не настроены варианты цвета</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* когда ни один объект не выделен */}
        {!selected_mesh && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <IconSettings size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-600 mb-2">Объект не выбран</h3>
            <p className="text-sm text-gray-500">Выберите объект на сцене для редактирования</p>
          </div>
        )}
      </div>
    </div>
  );
}