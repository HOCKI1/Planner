import { useStore } from "../../state";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CanvasGrid } from "./Grid3D";
import MeshBase from "./Mesh3DBase";
import Kitchen3DBase from "./Kitchen3DBase";

// 3D канвас(сцена)
function Canvas3D() {
  const { camera3D, setCamera3D } = useStore();
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (camera && camera3D) {
      // console.log(camera3D);
      // console.log(camera);
      camera.position.set(
        camera3D.position.x,
        camera3D.position.y,
        camera3D.position.z
      );
      camera.rotation.set(
        camera3D.rotation.x,
        camera3D.rotation.y,
        camera3D.rotation.z
      );
    }
  }, [camera, camera3D]);

  useFrame(() => {
    if (controlsRef.current) {
      setCamera3D({
        position: {
          x: camera.position.x,
          // проверка на положения камеры по Y
          y: camera.position.y < 0.01 ? 0.01 : camera.position.y, // если камера ниже сетки, то сделать ее немного выше
          z: camera.position.z,
        },
        rotation: {
          x: camera.rotation.x,
          y: camera.rotation.y,
          z: camera.rotation.z,
        },
      });
    }
  }, [controlsRef]);

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <MeshBase dimensions={{ width: 1, height: 1, depth: 1 }} />
      <axesHelper args={[5]} />
      <Kitchen3DBase />
      <CanvasGrid />
      <OrbitControls
        ref={controlsRef}
        enableRotate={true}
        enableZoom={true}
        enablePan={true}
        minDistance={2}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2}
        zoomSpeed={1}
        panSpeed={1}
        rotateSpeed={0.5}
        target={[camera3D.target.x, camera3D.target.y, camera3D.target.z]}
      />
    </>
  );
}

export default Canvas3D;
