import { useRef, useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import Mesh2DBase from "./Mesh2DBase";
import Mesh2DUpBase from "./Mesh2DUpBase";
import { useGlobalMeshStore, useUserMeshesStore } from "../data/MeshConsts";
import Kitchen2DBase from "./Kitchen2DBase";

const Canvas2D = () => {
  const stageRef = useRef(null);
  const gridLayerRef = useRef(null);

  const { cellSize, currentLayer } = useGlobalMeshStore();

  const width = window.innerWidth;
  const height = window.innerHeight;

  const [stageScale, setStageScale] = useState(0.3);
  const [stagePos, setStagePos] = useState({
    x: (document.body.getBoundingClientRect().width - 600) / 2,
    y: (document.body.getBoundingClientRect().height - 200) / 2,
  });
  const [isMovingObject, setIsMovingObject] = useState(false);
  const [isPinching, setIsPinching] = useState(false);

  const gridSize = cellSize * 10;

  const { deselectAllMeshes } = useUserMeshesStore();

  const lastTouchDist = useRef(null);

  const pendingTransform = useRef(null);
  const animationFrameId = useRef(null);

  const MIN_SCALE = 0.1;
  const MAX_SCALE = 3;

  const drawGrid = () => {
    const layer = gridLayerRef.current;
    if (!layer) return;

    layer.destroyChildren();

    const scale = stageScale;

    const offsetX = -stagePos.x / scale;
    const offsetY = -stagePos.y / scale;

    const startX = Math.floor(offsetX / gridSize) * gridSize;
    const endX = startX + width / scale;

    const startY = Math.floor(offsetY / gridSize) * gridSize;
    const endY = startY + height / scale;

    for (let x = startX; x <= endX; x += gridSize) {
      const line = new window.Konva.Line({
        points: [x, startY, x, endY],
        stroke: "#ddd",
        strokeWidth: 1,
        listening: false,
      });
      layer.add(line);
    }

    for (let y = startY; y <= endY; y += gridSize) {
      const line = new window.Konva.Line({
        points: [startX, y, endX, y],
        stroke: "#ddd",
        strokeWidth: 1,
        listening: false,
      });
      layer.add(line);
    }

    layer.batchDraw();
  };

  useEffect(() => {
    drawGrid();
  }, [stagePos, stageScale, isMovingObject, cellSize]);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const oldScale = stageScale;

    const pointer = stageRef.current.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    setStageScale(clampedScale);
    setStagePos(newPos);
  };

  const handleDragMove = (e) => {
    if (!isMovingObject && !isPinching) {
      setStagePos(e.target.position());
    }
  };

  const updateTransform = () => {
    if (pendingTransform.current) {
      const { scale, pos } = pendingTransform.current;
      setStageScale(scale);
      setStagePos(pos);
      pendingTransform.current = null;
    }
    animationFrameId.current = null;
  };

  const scheduleUpdate = () => {
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(updateTransform);
    }
  };

  const handleTouchMove = (e) => {
    const touchEvent = e.evt;
    if (touchEvent.touches.length === 2) {
      e.evt.preventDefault();
      setIsPinching(true);

      const touch1 = touchEvent.touches[0];
      const touch2 = touchEvent.touches[1];

      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Центр экрана
      const center = {
        x: width / 2,
        y: height / 2,
      };

      if (lastTouchDist.current) {
        const scaleChange = dist / lastTouchDist.current;

        let newScale = stageScale * scaleChange;
        newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

        // Координаты точки центра экрана относительно контента
        const contentX = (center.x - stagePos.x) / stageScale;
        const contentY = (center.y - stagePos.y) / stageScale;

        // Новая позиция stage так, чтобы центр экрана остался на том же контенте
        const newPos = {
          x: center.x - contentX * newScale,
          y: center.y - contentY * newScale,
        };

        pendingTransform.current = { scale: newScale, pos: newPos };
        scheduleUpdate();
      }

      lastTouchDist.current = dist;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.evt.touches.length < 2) {
      setIsPinching(false);
      lastTouchDist.current = null;
    }
  };

  return (
    <Stage
      width={width}
      height={height}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stagePos.x}
      y={stagePos.y}
      draggable={!isMovingObject && !isPinching}
      onDragMove={handleDragMove}
      onWheel={handleWheel}
      ref={stageRef}
      style={{ background: "#fdfdfd", touchAction: "none" }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Layer
        ref={gridLayerRef}
        onClick={() => {
          deselectAllMeshes();
        }}
      />

      <Kitchen2DBase setIsMovingObject={setIsMovingObject} />

      <Layer
        opacity={currentLayer === 2 ? 0.2 : 1}
        listening={currentLayer === 1}
      >
        <Mesh2DBase setIsMovingObject={setIsMovingObject} />
      </Layer>

      <Layer
        opacity={currentLayer === 1 ? 0.2 : 1}
        listening={currentLayer === 2}
      >
        <Mesh2DUpBase setIsMovingObject={setIsMovingObject} />
      </Layer>
    </Stage>
  );
};

export default Canvas2D;
