import { Grid as DreiGrid } from "@react-three/drei";
import { useGlobalMeshStore } from "../data/MeshConsts";

const GRID_CONFIG = {
  minorColor: "#e9ecef",
  majorColor: "#ced4da",
  minorOpacity: 0.5,
  majorOpacity: 1,
};
// 3D сетка
export const CanvasGrid = () => {
  const { cellSize } = useGlobalMeshStore();

  const multiplier = 10; // множитель всех размеров

  return (
    <DreiGrid
      args={[100, 100]}
      cellSize={(cellSize / 100) * multiplier}
      cellThickness={1}
      cellColor={GRID_CONFIG.majorColor}
      sectionSize={1 * multiplier}
      sectionThickness={1.5}
      sectionColor={GRID_CONFIG.minorColor}
      fadeDistance={100}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid={true}
      position={[0, 0.01, 0]}
      rotation={[0, 0, 0]}
    />
  );
};
