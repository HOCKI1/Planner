import { useGlobalMeshStore } from "../data/MeshConsts";
import { useMemo } from "react";
import * as THREE from "three";

// Компонент с полом, потолком и стенами — без поворота геометрии
function KitchenShell({ points, height = 20 }) {
  const validPoints = useMemo(() => {
    if (!points || points.length < 3) return null;
    return points.filter(
      (p) =>
        typeof p.x === "number" &&
        !isNaN(p.x) &&
        typeof p.y === "number" &&
        !isNaN(p.y)
    );
  }, [points]);

  const shape = useMemo(() => {
    if (!validPoints || validPoints.length < 3) return null;
    const s = new THREE.Shape();
    s.moveTo(validPoints[0].x * 10, validPoints[0].y * 10);
    for (let i = 1; i < validPoints.length; i++) {
      const p = validPoints[i];
      s.lineTo(p.x * 10, p.y * 10);
    }
    s.lineTo(validPoints[0].x * 10, validPoints[0].y * 10);
    return s;
  }, [validPoints]);

  const floorGeom = useMemo(() => {
    if (!shape) return null;
    return new THREE.ShapeGeometry(shape);
  }, [shape]);

  const ceilingGeom = useMemo(() => {
    if (!shape) return null;
    return new THREE.ShapeGeometry(shape);
  }, [shape]);

  const wallsGeom = useMemo(() => {
    if (!validPoints || validPoints.length < 2) return null;

    const vertices = [];
    for (let i = 0; i < validPoints.length; i++) {
      const curr = validPoints[i];
      const next = validPoints[(i + 1) % validPoints.length];

      const x1 = curr.x * 10,
        z1 = curr.y * 10;
      const x2 = next.x * 10,
        z2 = next.y * 10;

      // Два треугольника на стену
      vertices.push(
        x1, 0, z1,
        x2, 0, z2,
        x2, height, z2,
        x1, 0, z1,
        x2, height, z2,
        x1, height, z1
      );
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geom.computeVertexNormals();
    return geom;
  }, [validPoints, height]);

  return (
    <>
      {/* Пол */}
      {floorGeom && (
        <mesh
          geometry={floorGeom}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color="#ffc061" side={THREE.BackSide} />
        </mesh>
      )}

      {/* Потолок */}
      {ceilingGeom && (
        <mesh
          geometry={ceilingGeom}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, height, 0]}
        >
          <meshStandardMaterial color="white" side={THREE.FrontSide} />
        </mesh>
      )}

      {/* Стены */}
      {wallsGeom && (
        <mesh geometry={wallsGeom}>
          <meshStandardMaterial color="#428fc7" side={THREE.BackSide} />
        </mesh>
      )}
    </>
  );
}

// Основной компонент
export default function Kitchen3DBase() {
  const { kitchenPoints } = useGlobalMeshStore((state) => state);

  return (
    <>
      {kitchenPoints && kitchenPoints.length >= 3 && (
        <KitchenShell points={kitchenPoints} height={20} />
      )}
    </>
  );
}
