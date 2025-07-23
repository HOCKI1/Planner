import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useUserMeshesStore } from "../data/MeshConsts";

export default function ItemCard({ item, subcategoryItems }) {
  const { addUserMesh } = useUserMeshesStore();

  const [selectedVariantId, setSelectedVariantId] = useState(item.id);

  const matchedItem =
    subcategoryItems.find((i) => i.id === selectedVariantId) || item;

  const currentDimensions = `${Math.floor(
    matchedItem.width * 100
  )}x${Math.floor(matchedItem.depth * 100)}x${Math.floor(
    matchedItem.height * 100
  )} см`;

  const sizeOptions =
    item.width_variants
      ?.map((variant) => {
        const optionItem = subcategoryItems.find((i) => i.id === variant.id);
        return {
          id: variant.id,
          label: `${Math.floor(optionItem.width * 100)}x${Math.floor(
            optionItem.depth * 100
          )}x${Math.floor(optionItem.height * 100)} см`,
        };
      })
      .filter(Boolean) || [];

  // Получение изображения элемента — проверка разных вариантов свойств изображения
  const getItemImage = () => {
    if (matchedItem.imgPreviewPath) return matchedItem.imgPreviewPath;
    if (matchedItem.img2dPath) return matchedItem.img2dPath;
    if (matchedItem.imgPath) return matchedItem.imgPath;
    return null;
  };

  const itemImage = getItemImage();

  return (
    <div className="w-full p-3 text-left bg-gray-50 hover:bg-orange-100 rounded-lg transition-colors flex gap-3 group">
      {/* Изображение элемента */}
      <div className="flex-shrink-0">
        {itemImage ? (
          <img
            src={itemImage}
            alt={matchedItem.name}
            className="w-16 h-16 object-cover rounded border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-16 h-16 bg-gray-200 rounded border border-gray-200 flex items-center justify-center ${itemImage ? 'hidden' : 'flex'}`}
        >
          <span className="text-xs text-gray-500">🏠</span>
        </div>
      </div>

      {/* Контент элемента */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-medium text-gray-900">{matchedItem.name}</div>
            <div className="text-sm text-gray-500">{currentDimensions}</div>
            {matchedItem.price && (
              <div className="text-sm font-semibold text-green-600">
                ${matchedItem.price}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              addUserMesh({
                uuid: uuidv4(),
                id: matchedItem.id,
                posX: 0,
                posY: 0,
                scaleX: matchedItem.width,
                scaleY: matchedItem.depth,
                height: matchedItem.height,
                rotZ: 0,
              });
              toast.success(`Объект "${matchedItem.name}" добавлен!`);
            }}
            className="bg-gray-300 hover:bg-orange-300 rounded p-1 transition-colors flex-shrink-0"
          >
            <IconPlus
              size={18}
              className="opacity-100 text-white transition-opacity"
            />
          </button>
        </div>

        {sizeOptions.length > 0 && (
          <select
            className="mt-2 text-sm border border-gray-300 rounded p-1 text-gray-700 bg-white"
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(Number(e.target.value))}
          >
            {sizeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
