import React, { useEffect } from "react";
import { useState } from "react";
import { Rect } from "react-konva";
import { useUserMeshesStore, useGlobalMeshStore } from "../data/MeshConsts";

export default function Mesh2DBase({ setIsMovingObject }) {
  // импорт переменной с проверкой на движение объекта

  const { cellSize } = useGlobalMeshStore();

  // константы, не трогать!!!(типо привязка к 10 см)
  var WIDTH = 10 * cellSize;
  var HEIGHT = 10 * cellSize;
  var mesh_multiplier = 1000; // не трогать!

  const {
    user_meshes,
    updateMeshPos,
    isSelected,
    deselectAllMeshes,
    deselectPreviousMesh,
  } = useUserMeshesStore();

  // console.log(user_meshes);

  // начальная загрузка объектов
  const [allboxes, setAllBoxes] = useState(user_meshes);

  // обновление объектов на сцене
  useEffect(() => {
    setAllBoxes(user_meshes);
  }, [user_meshes]);

  const [isDragging, setIsDragging] = React.useState(false);

  return allboxes.map((box) => {
    if (box.height <= 1.5) {
      console.log("Слой 1" + box.id);
      return (
        <Rect
          x={box.posX * mesh_multiplier}
          y={box.posY * mesh_multiplier}
          width={box.scaleX * mesh_multiplier}
          height={box.scaleY * mesh_multiplier}
          rotation={box.rotZ * -1}
          fill={box.isSelected ? "#F97316" : "#909090"}
          stroke="black" // изменение цвета выделенного объекта
          strokeWidth={box.isSelected ? 8 : 4}
          draggable
          onClick={(e) => {
            // deselectAllMeshes();
            deselectPreviousMesh(box.id);
            isSelected(box.uuid);
            console.log(box.uuid);
          }}
          onTap={(e) => {
            deselectPreviousMesh(box.id);
            isSelected(box.uuid);
            console.log(box.uuid);
          }}
          onPointerDown={(e) => {
            // включение режима перемещения
            setIsMovingObject(true);
            e.target.moveToTop();
          }}
          onPointerUp={(e) => {
            // выключение режима перемещения
            setIsMovingObject(false);
          }}
          onDragStart={() => {
            setIsDragging(true);
          }}
          onDragEnd={(e) => {
            // выключение режима перемещения
            setIsMovingObject(false);
            // перемещение объекта к сетке
            e.target.to({
              x: Math.round(e.target.x() / WIDTH) * WIDTH,
              y: Math.round(e.target.y() / HEIGHT) * HEIGHT,
            });
            setAllBoxes(
              allboxes.map((currentBox) =>
                currentBox.uuid === box.uuid
                  ? {
                      ...currentBox,
                      x: Math.round(e.target.x() / WIDTH) * WIDTH,
                      y: Math.round(e.target.y() / HEIGHT) * HEIGHT,
                    }
                  : currentBox
              )
            );
            // сохранение позиции в стэйт
            setIsDragging(false);
            updateMeshPos(
              box.uuid,
              (Math.round(e.target.x() / WIDTH) * WIDTH) / mesh_multiplier,
              (Math.round(e.target.y() / HEIGHT) * HEIGHT) / mesh_multiplier
            );
          }}
        />
      );
    }
  });
}
