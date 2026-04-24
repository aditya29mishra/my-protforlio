import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Float, MeshDistortMaterial } from "@react-three/drei";

const QuestModel = ({ isMobile }) => {
  return (
    <mesh>
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
        <mesh scale={isMobile ? 1.2 : 2.2}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial
            color='#915EFF'
            attach='material'
            distort={0.3}
            speed={2}
          />
        </mesh>
      </Float>
    </mesh>
  );
};

const QuestCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows={false}
      dpr={[1, 1.5]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <QuestModel isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default QuestCanvas;
