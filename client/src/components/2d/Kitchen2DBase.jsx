import { useMemo } from "react";
import { Layer, Line, Circle, Group, Text } from "react-konva";
import { useGlobalMeshStore } from "../data/MeshConsts";

export default function Kitchen2DBase({ setIsMovingObject }) {
  const cellSize = useGlobalMeshStore((state) => state.cellSize);
  const kitchenPoints = useGlobalMeshStore((state) => state.kitchenPoints);
  const saveKitchenPoints = useGlobalMeshStore(
    (state) => state.saveKitchenPoints
  );
  const setKitchenPointAtIndex = useGlobalMeshStore(
    (state) => state.setKitchenPointAtIndex
  );

  const WIDTH = 10 * cellSize;
  const HEIGHT = 10 * cellSize;
  const mesh_multiplier = 1000;

  const points = useMemo(() => {
    return kitchenPoints.map((point) => ({
      x: point.x * mesh_multiplier,
      y: point.y * mesh_multiplier,
    }));
  }, [kitchenPoints]);

  const flatPoints = useMemo(() => points.flatMap((p) => [p.x, p.y]), [points]);

  const getDistance = (a, b) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2).toFixed(1);

  const getAngleDeg = (a, b, c) => {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.hypot(ab.x, ab.y);
    const magCB = Math.hypot(cb.x, cb.y);
    const angleRad = Math.acos(dot / (magAB * magCB));
    return (angleRad * 180) / Math.PI;
  };

  const getInsetPosition = (prev, curr, next, offset = 100) => {
    const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };
    const bisector = { x: v1.x + v2.x, y: v1.y + v2.y };
    const mag = Math.hypot(bisector.x, bisector.y) || 1;
    return {
      x: curr.x + (bisector.x / mag) * offset,
      y: curr.y + (bisector.y / mag) * offset,
    };
  };

  const getOutsetPosition = (a, b, offset = 100) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy) || 1;
    const normal = { x: -dy / length, y: dx / length };
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    return {
      x: mid.x + normal.x * offset,
      y: mid.y + normal.y * offset,
    };
  };

  return (
    <Layer>
      <Group draggable={false}>
        {/* Полигон */}
        <Line
          points={flatPoints}
          closed
          stroke="black"
          fill="#00000020"
          strokeWidth={3}
        />

        {/* Длины сторон */}
        {points.map((p1, i) => {
          const p2 = points[(i + 1) % points.length];
          const distance = getDistance(p1, p2);
          const pos = getOutsetPosition(p1, p2, 100);
          return (
            <Text
              key={`length-${i}`}
              x={pos.x}
              y={pos.y}
              text={`${(distance / 10).toFixed(1)} cm`}
              fontSize={96}
              fill="#f97316"
              offsetX={30}
              offsetY={30}
            />
          );
        })}

        {/* Углы */}
        {points.map((curr, i) => {
          const prev = points[(i - 1 + points.length) % points.length];
          const next = points[(i + 1) % points.length];
          const angle = getAngleDeg(prev, curr, next);
          const pos = getInsetPosition(prev, curr, next, 120);
          return (
            <Text
              key={`angle-${i}`}
              x={pos.x}
              y={pos.y}
              text={`${angle.toFixed(1)}°`}
              fontSize={96}
              fill="#f000000"
              offsetX={30}
              offsetY={30}
            />
          );
        })}

        {/* Узлы */}
        {points.map((point, i) => (
          <Circle
            key={i}
            x={point.x}
            y={point.y}
            radius={35}
            fill="#f97316"
            stroke="black"
            strokeWidth={2}
            draggable
            onPointerDown={() => setIsMovingObject(true)}
            onTouchStart={() => setIsMovingObject(true)}
            onPointerUp={() => setIsMovingObject(false)}
            onTouchEnd={() => setIsMovingObject(false)}
            onDragEnd={(e) => {
              setIsMovingObject(false);
              const snappedX = Math.round(e.target.x() / WIDTH) * WIDTH;
              const snappedY = Math.round(e.target.y() / HEIGHT) * HEIGHT;
              setKitchenPointAtIndex(i, {
                x: snappedX / mesh_multiplier,
                y: snappedY / mesh_multiplier,
              });
            }}
            onDragMove={(e) => {
              setKitchenPointAtIndex(i, {
                x: e.target.x() / mesh_multiplier,
                y: e.target.y() / mesh_multiplier,
              });
            }}
            onDblClick={() => {
              if (kitchenPoints.length <= 3) return;
              const updated = [...kitchenPoints];
              updated.splice(i, 1);
              saveKitchenPoints(updated);
            }}
          />
        ))}
      </Group>
    </Layer>
  );
}
