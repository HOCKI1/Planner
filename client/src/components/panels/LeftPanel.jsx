import { useState, useEffect } from "react";
import { IconChevronRight, IconHome } from "@tabler/icons-react";
import { useGlobalMeshStore } from "../data/MeshConsts";

/**
 * Компонент LeftPanel — основная навигационная панель
 * Отображает секции, категории и подкатегории в иерархическом виде
 */
export default function LeftPanel() {
  // Получаем необходимые состояния и методы из глобального стора
  const {
    global_meshes,
    loadGlobalMeshes,
    selectedCategory,
    selectedSubcategory,
    setSelectedCategory,
    setSelectedSubcategory,
    setFourPointKitchen,
    setFivePointKitchen,
    setSixPointKitchen,
    setEightPointKitchen,
  } = useGlobalMeshStore();

  // Локальное состояние: открытые секции и категории
  const [openSections, setOpenSections] = useState({});
  const [openCategories, setOpenCategories] = useState({});

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadGlobalMeshes();
  }, [loadGlobalMeshes]);

  // Извлечение секции и категории из глобального состояния
  const sections = global_meshes?.sections;
  const categories = global_meshes?.categories;

  /**
   * Обработка клика по секции — переключение раскрытия секции
   * @param {string} sectionId — ID нажатой секции
   */
  const handleSectionClick = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  /**
   * Обработка клика по категории — аккордеонная логика (открытие одной)
   * @param {string} categoryId — ID нажатой категории
   */
  const handleCategoryClick = (categoryId) => {
    setOpenCategories((prev) => {
      if (prev[categoryId]) {
        return { ...prev, [categoryId]: false };
      } else {
        return { [categoryId]: true };
      }
    });

    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  /**
   * Обработка клика по подкатегории — выбор подкатегории
   * @param {string} subcategoryId — ID подкатегории
   */
  const handleSubcategoryClick = (subcategoryId) => {
    if (selectedSubcategory === subcategoryId) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategoryId);
    }
  };

  /**
   * Получение изображения категории — пытается найти изображение из первой подкатегории
   * @param {object} category — объект категории
   */
  const getCategoryImage = (category) => {
    const firstSubcategory = category.subcategories?.[0];
    if (firstSubcategory?.img) return firstSubcategory.img;

    const firstItem = firstSubcategory?.items?.[0];
    if (firstItem?.imgPreviewPath) return firstItem.imgPreviewPath;
    if (firstItem?.imgPath) return firstItem.imgPath;

    return null;
  };

  // Варианты планировок кухни
  const kitchenLayouts = [
    {
      id: 'four-point',
      name: '4 угла',
      action: setFourPointKitchen,
      image: '/image copy.png'
    },
    {
      id: 'five-point',
      name: '5 углов',
      action: setFivePointKitchen,
      image: '/image copy.png'
    },
    {
      id: 'six-point',
      name: '6 углов',
      action: setSixPointKitchen,
      image: '/image copy.png'
    },
    {
      id: 'eight-point',
      name: '8 углов',
      action: setEightPointKitchen,
      image: '/image copy.png'
    }
  ];

  // Пока данные не загружены — ничего не отображаем
  if (!sections || !categories) return <></>;

  return (
    <div className="flex flex-col">
      {/* Блок выбора планировки кухни */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <IconHome size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Выбор планировки</h3>
        </div>

        {/* Сетка с вариантами планировок */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {kitchenLayouts.map((layout) => (
            <button
              key={layout.id}
              className="group relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg border-gray-200 bg-white hover:border-orange-300"
              onClick={layout.action}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2 transition-colors group-hover:scale-110 transform duration-200 overflow-hidden border border-gray-200">
                  <img
                    src={layout.image}
                    alt={layout.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #ff9100, #ff6d00)';
                    }}
                  />
                </div>
                <div className="text-sm font-semibold text-gray-800 mb-1">
                  {layout.name}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  Количество углов комнаты
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Перебор секций */}
      {sections.map((section) => {
        const sectionCategories = categories.filter((c) =>
          (section.categories || []).includes(c.id)
        );

        return (
          <div key={section.id} className="mb-6">
            {/* Заголовок секции */}
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => (
                handleSectionClick(section.id), setSelectedSubcategory(null)
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {section.number || "•"}
                </div>
                <span className="font-bold text-gray-700">{section.title}</span>
              </div>
              <IconChevronRight
                size={20}
                className={`transition-transform ${openSections[section.id] ? "rotate-90" : ""}`}
              />
            </button>

            {/* Список категорий (если секция раскрыта) */}
            {openSections[section.id] && (
              <div className="mt-2 pl-4">
                {sectionCategories.map((category) => {
                  const categoryImage = getCategoryImage(category);

                  return (
                    <div key={category.id} className="mb-2">
                      {/* Кнопка категории */}
                      <button
                        className={`w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedCategory === category.id
                          ? "bg-orange-100"
                          : "hover:bg-gray-100"
                          }`}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <div className="flex items-center gap-3">
                          {/* Изображение категории */}
                          {categoryImage ? (
                            <img
                              src={categoryImage}
                              alt={category.title}
                              className="w-8 h-8 object-cover rounded border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500">📁</span>
                            </div>
                          )}
                          <span className="text-gray-700">{category.title}</span>
                        </div>
                        <IconChevronRight
                          size={18}
                          className={`transition-transform ${openCategories[category.id] ? "rotate-90" : ""}`}
                        />
                      </button>

                      {/* Список подкатегорий (если категория раскрыта) */}
                      {openCategories[category.id] && (
                        <div className="pl-4 mt-2 space-y-1">
                          {category.subcategories?.map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() => handleSubcategoryClick(subcategory.id)}
                              className={`w-full p-2 text-left hover:bg-orange-50 rounded-md transition-colors flex items-center gap-3 ${selectedSubcategory === subcategory.id
                                ? "bg-orange-100"
                                : ""}`}
                            >
                              {/* Изображение подкатегории */}
                              {subcategory.img ? (
                                <img
                                  src={subcategory.img}
                                  alt={subcategory.name}
                                  className="w-6 h-6 object-cover rounded border border-gray-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-xs text-gray-500">📄</span>
                                </div>
                              )}
                              <span>{subcategory.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
