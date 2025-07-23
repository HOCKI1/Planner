import { Routes, Route, Link } from "react-router-dom";
import {
  Icon3dCubeSphere,
  IconLayoutBoard,
  IconDownload,
  IconUpload,
  IconTrashX,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useStore } from "./state";
import {
  useGlobalMeshStore,
  useUserMeshesStore,
} from "./components/data/MeshConsts";
import Canvas2D from "./components/2d/Canvas2D";
import Canvas3D from "./components/3d/Canvas3D";
import AdminPanel from "./components/AdminPanel";
import LeftPanel from "./components/panels/LeftPanel";
import LeftItemPanel from "./components/panels/LeftItemPanel";
import RightPanel from "./components/panels/RightPanel";
import TopRightPanel from "./components/CartPanel";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const {
    is3DMode,
    setIs3DMode,
    loadInitialData,
  } = useStore();

  const {
    selectedCategory,
    cellSize,
    setCellSize,
    currentLayer,
    setCurrentLayer,
    global_meshes,
  } = useGlobalMeshStore();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Нижний слой"); // По умолчанию нижний слой

  const handleOptionSelect = (option, layerValue) => {
    setSelectedOption(option);
    setCurrentLayer(layerValue);
    setIsOpen(false);
  };

  // Load initial data on app start
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Устанавливаем слой 1 по умолчанию при первом запуске
  useEffect(() => {
    if (currentLayer === undefined || currentLayer === null) {
      setCurrentLayer(1); // Устанавливаем нижний слой по умолчанию
    }

    if (currentLayer === 1) {
      setSelectedOption("Нижний слой");
    } else if (currentLayer === 2) {
      setSelectedOption("Верхний слой");
    }
  }, [currentLayer]);

  const fileInputRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user_meshes, exportUserMeshes, importUserMeshes } =
    useUserMeshesStore();

  const [cart_items, setCartItems] = useState([]);

  const [total_price, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!global_meshes || !global_meshes.categories) return;

    const items = [];

    let price = 0;

    for (const mesh of user_meshes) {
      for (const category of global_meshes.categories) {
        for (const subcategory of category.subcategories) {
          for (const item of subcategory.items) {
            if (item.id === mesh.id) {
              items.push(item);
            }
          }
        }
      }
    }

    for (const item of items) {
      price += parseFloat(item["price"]);
    }

    setCartItems(items);
    setTotalPrice(price);
  }, [user_meshes, global_meshes]);

  const handleImportUserMeshes = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        importUserMeshes(text); // <-- вызывает метод из store
        toast.success("Сцена успешно импортирована");
      } catch (err) {
        console.error("Ошибка при импорте сцены:", err);
        toast.error("Ошибка при импорте сцены");
      }
    };
    reader.readAsText(file);

    // Сброс input чтобы можно было выбрать тот же файл заново
    event.target.value = "";
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert("Кэш успешно очищен! Страница будет перезагружена.");
    window.location.reload();
  };

  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/"
          element={
            <div className="w-full h-screen flex flex-col bg-gray-50">
              <header className="bg-orange-500 px-6 py-4 border-b border-gray-200 flex justify-between items-center h-16 shadow-sm">
                <div className="text-2xl font-bold text-gray-800">
                  <span className="text-white">PLANNER</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative inline-block">
                    <div className="flex">
                      {/* Основная кнопка */}
                      <button
                        // onClick={handleMainAction}
                        className="px-6 py-2 bg-green-500 text-white rounded-l-lg hover:bg-green-600 transition-colors"
                      >
                        {selectedOption}
                      </button>

                      {/* Кнопка выпадающего списка */}
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-3 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors border-l border-green-400"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleOptionSelect("Нижний слой", 1)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg transition-colors flex items-center justify-between ${
                            currentLayer === 1
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          <span>Нижний слой</span>
                          {currentLayer === 1 && (
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>

                        <button
                          onClick={() => handleOptionSelect("Верхний слой", 2)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 rounded-b-lg transition-colors flex items-center justify-between ${
                            currentLayer === 2
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          <span>Верхний слой</span>
                          {currentLayer === 2 && (
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-white">Размер сетки (см)</label>
                    <input
                      type="number"
                      value={cellSize}
                      onChange={(e) =>
                        setCellSize(Math.floor(e.target.value), cellSize)
                      }
                      min={1}
                      max={50}
                      step={1}
                      className="w-24 px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex p-1 bg-white/20 rounded-lg">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        !is3DMode
                          ? "bg-white text-orange-500"
                          : "text-white hover:bg-white/10"
                      }`}
                      onClick={() => setIs3DMode(false)}
                    >
                      <IconLayoutBoard size={20} />
                      2D
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        is3DMode
                          ? "bg-white text-orange-500"
                          : "text-white hover:bg-white/10"
                      }`}
                      onClick={() => setIs3DMode(true)}
                    >
                      <Icon3dCubeSphere size={20} />
                      3D
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                      title="Импорт проекта"
                    >
                      <IconDownload size={20} />
                    </button>
                    <button
                      onClick={exportUserMeshes}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                      title="Экспорт проекта"
                    >
                      <IconUpload size={20} />
                    </button>
                    <button
                      onClick={handleClearCache}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                      title="Очистить кэш"
                    >
                      <IconTrashX size={20} />
                    </button>
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                      title="Корзина"
                    >
                      <IconShoppingCart size={20} />
                    </button>
                   
                  </div>
                </div>
              </header>

              {/* Панель корзины */}
              <TopRightPanel
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
              >
                <h3 className="text-lg font-semibold mb-2">Корзина:</h3>

                <div className="cart-items">
                  {cart_items.length > 0 ? (
                    cart_items.map((item, index) => (
                      <div key={index} className="cart-item">
                        <span className="item-name-price ">
                          {item["name"] + " - " + item["price"] + "$"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>Корзина пуста</p>
                  )}
                </div>
                <hr style={{ margin: "10px 0", borderColor: "#ccc" }} />
                <div style={{ marginTop: "10px" }}>
                  <span className="font-bold">Итого:</span>
                </div>
                <div className="font-bold">{total_price.toFixed(2) + "$"}</div>
              </TopRightPanel>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportUserMeshes}
              />

              <div className="flex flex-1 h-[calc(100vh-4rem)]">
                {/* Левая панель - скрывается в 3D режиме */}
                {!is3DMode && (
                  <div className="w-[var(--leftpanel-width)] bg-white p-6 flex flex-col gap-4 overflow-y-auto border-r border-gray-200 shadow-sm">
                    <LeftPanel />
                  </div>
                )}

                {/* Панель элементов - скрывается в 3D режиме */}
                {!is3DMode && selectedCategory && <LeftItemPanel />}

                {/* Основная область канваса */}
                <div className="flex-1 relative overflow-hidden">
                  {is3DMode ? (
                    <Canvas
                      shadows
                      camera={{
                        position: [10, 10, 10],
                        fov: 50,
                      }}
                    >
                      <Canvas3D />
                    </Canvas>
                  ) : (
                    <Canvas2D />
                  )}
                </div>

                {/* Правая панель - скрывается в 3D режиме */}
                {!is3DMode && (
                  <div className="w-[var(--leftpanel-width)] bg-white p-6 flex flex-col gap-4 overflow-y-auto border-l border-gray-200 shadow-sm">
                    <RightPanel />
                  </div>
                )}
              </div>
            </div>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}