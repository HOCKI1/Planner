import { useGlobalMeshStore } from "../data/MeshConsts";
import ItemCard from "./ItemCard";

export default function LeftItemPanel() {
  const { global_meshes, selectedCategory, selectedSubcategory } =
    useGlobalMeshStore();

  const categories = global_meshes?.categories;

  if (!selectedCategory || !selectedSubcategory) return null;

  const category = categories?.find((c) => c.id === selectedCategory);
  const subcategory = category?.subcategories?.find(
    (s) => s.id === selectedSubcategory
  );

  if (!category || !subcategory) return null;

  return (
    <div
      className="w-[var(--leftpanel-width)] bg-white p-6 border-r border-gray-200 shadow-sm transform transition-all duration-300 ease-in-out animate-slideIn"
      style={{ animation: "slide 0.3s ease forwards", color: "black" }}
    >
      {/* Заголовок подкатегории с изображением */}
      <div className="flex items-center gap-3 mb-4">
        {subcategory.img && (
          <img
            src={subcategory.img}
            alt={subcategory.name}
            className="w-8 h-8 object-cover rounded border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <h2 className="text-lg font-semibold text-gray-800">
          {subcategory.name}
        </h2>
      </div>

      <div className="space-y-3">
        {subcategory.items
          .filter((item) => item.show !== false) // Показывать только те элементы, у которых show не равен false
          .map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              subcategoryItems={subcategory.items}
            />
          ))}

        {subcategory.items.filter(item => item.show !== false).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            В этой подкатегории пока нет доступных элементов
          </div>
        )}
      </div>
    </div>
  );
}
