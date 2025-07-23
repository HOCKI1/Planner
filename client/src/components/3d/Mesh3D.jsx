import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const mesh_multiplier = 10;

// Кэш моделей
const glbCache = new Map();

// Загрузка модели glb
const loadGLBModel = (path) => {
  return new Promise((resolve, reject) => {
    if (glbCache.has(path)) {
      resolve(glbCache.get(path).clone());
    } else {
      const loader = new GLTFLoader();
      loader.load(
        path,
        (gltf) => {
          const scene = gltf.scene;
          scene.traverse((child) => {
            if (child.isMesh && child.material) {
              const material = child.material;
              if (material.map) {
                material.map.encoding = THREE.sRGBEncoding;
                material.map.needsUpdate = true;
              }
            }
          });
          glbCache.set(path, scene.clone());
          resolve(scene);
        },
        undefined,
        reject
      );
    }
  });
};

const Mesh3D = ({
  mesh3dKey,
  mesh3dGeometry,
  mesh3dPosition,
  mesh3dRotation,
}) => {
  const [object, setObject] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const glb = await loadGLBModel(mesh3dGeometry);
        if (isMounted) {
          setObject(glb);
        }
      } catch (err) {
        console.error("Ошибка при загрузке GLB модели:", err);
      }
    };

    load();

    return () => {
      isMounted = false;
      if (object) {
        object.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [mesh3dGeometry]);

  if (!object) return null;

  return (
    <primitive
      key={mesh3dKey}
      object={object}
      position={[mesh3dPosition.x, mesh3dPosition.y, mesh3dPosition.z]}
      rotation={[mesh3dRotation.x, mesh3dRotation.y, mesh3dRotation.z]}
      scale={[mesh_multiplier, mesh_multiplier, mesh_multiplier]}
    />
  );
};

export default Mesh3D;
