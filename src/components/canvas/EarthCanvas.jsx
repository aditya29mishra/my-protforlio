import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Earth = () => {
  return (
    <mesh scale={2.5}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color='#915EFF' 
        wireframe={true} 
        transparent 
        opacity={0.3}
      />
      {/* Inner Core */}
      <mesh scale={0.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color='#915EFF' 
          transparent 
          opacity={0.1}
        />
      </mesh>
    </mesh>
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows={false}
      frameloop='demand'
      dpr={[1, 1.5]}
      gl={{ preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
