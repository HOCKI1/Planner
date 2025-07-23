import { Suspense } from "react";
import { useUserMeshesStore, useGlobalMeshStore } from "../data/MeshConsts";
import Mesh3D from "./Mesh3D";

const mesh_multiplier = 10; // не трогать!

export default function MeshBase({ dimensions }) {
  const { user_meshes } = useUserMeshesStore();
  const { global_meshes } = useGlobalMeshStore();

  return user_meshes.map((mesh_sample, index) => {
    // Поиск item по id в global_meshes
    let modelPath = null;

    for (const category of global_meshes?.categories || []) {
      for (const subcategory of category.subcategories || []) {
        for (const item of subcategory.items || []) {
          if (item.id === mesh_sample.id) {
            modelPath = item.modelPath;
            break;
          }
        }
      }
    }

    if (!modelPath) {
      console.warn(`Model path not found for mesh id: ${mesh_sample.id}`);
      return null;
    }

    const posX = mesh_sample.posX * mesh_multiplier;
    const posZ = mesh_sample.posY * mesh_multiplier;
    const rotY = mesh_sample.rotZ;

    return (
      <Suspense fallback={null} key={mesh_sample.id + "_" + index}>
        <Mesh3D
          mesh3dKey={mesh_sample.id}
          mesh3dGeometry={modelPath}
          mesh3dPosition={{ x: posX, y: 0, z: posZ }}
          mesh3dRotation={{ x: 0, y: (rotY * Math.PI) / 180, z: 0 }}
        />
      </Suspense>
    );
  });
}
