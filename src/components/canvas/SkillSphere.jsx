import React, { Suspense, useRef, useMemo, useState, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Html, 
  Sphere, 
  MeshDistortMaterial, 
  Float,
  Torus,
  Preload
} from "@react-three/drei";
import * as THREE from "three";

// memoizing for performance
const SkillIconSphere = memo(({ position, children, name, isCore }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  
  const baseScale = isCore ? 1.2 : 0.7;
  const scale = hovered ? baseScale * 1.6 : baseScale;

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
        <Sphere 
          ref={meshRef}
          args={[0.4, 16, 16]} 
          scale={scale}
          onPointerOver={(e) => {
             e.stopPropagation();
             setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial 
            color={isCore ? '#915EFF' : '#232631'} 
            emissive={isCore ? '#915EFF' : '#111111'}
            emissiveIntensity={hovered ? 3 : (isCore ? 0.6 : 0.1)}
            metalness={0.8} 
            roughness={0.2} 
            transparent 
            opacity={0.7} 
          />
          
          {/* Optimization: ONLY render HTML when hovered to save CPU/GPU cycles */}
          {hovered && (
            <Html distanceFactor={10} center zIndexRange={[100, 0]}>
                <div className="flex flex-col items-center justify-center p-4 scale-150 pointer-events-none">
                    <div className="text-5xl text-white drop-shadow-[0_0_20px_#915EFF] animate-pulse">
                        {children}
                    </div>
                    <div className="mt-4 px-4 py-1 bg-accent/90 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
                        <p className='text-[14px] text-white font-bold whitespace-nowrap uppercase tracking-widest'>
                        {name}
                        </p>
                    </div>
                </div>
            </Html>
          )}

          {/* Fallback passive icon (Simplified) */}
          {!hovered && (
             <Html distanceFactor={12} center>
                 <div className="text-secondary/40 text-2xl pointer-events-none">
                    {children}
                 </div>
             </Html>
          )}
        </Sphere>
      </Float>
    </group>
  );
});

const SkillCloud = ({ skills, iconMap }) => {
  const groupRef = useRef();
  const innerCoreRef = useRef();
  
  const skillPositions = useMemo(() => {
    const points = [];
    const count = skills.length;
    const radius = 6.8;
    
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = 2.399963229728653 * i;
      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;
      points.push(new THREE.Vector3(x, y * radius, z));
    }
    return points;
  }, [skills]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.08;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x = time * 0.15;
      innerCoreRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => {
        const isCore = ["Unity", "C#", "XR", "Three.js", "React", "Node.js", "Supabase"].includes(skill.name);
        return (
          <SkillIconSphere 
            key={skill.name} 
            position={skillPositions[index]} 
            name={skill.name}
            isCore={isCore}
          >
            {iconMap[skill.iconKey]}
          </SkillIconSphere>
        );
      })}
      
      <group ref={innerCoreRef}>
        <Sphere args={[2, 16, 16]}>
          <MeshDistortMaterial
            color='#915EFF'
            attach='material'
            distort={0.4}
            speed={1.5}
            transparent
            opacity={0.1}
          />
        </Sphere>
        <Torus args={[2.5, 0.015, 12, 48]} rotation={[Math.PI/4, 0, 0]}>
          <meshStandardMaterial color="#915EFF" emissive="#915EFF" emissiveIntensity={1} transparent opacity={0.5} />
        </Torus>
      </group>

      <pointLight intensity={2} color="#915EFF" distance={15} />
    </group>
  );
};

const SkillSphereCanvas = ({ skills, iconMap }) => {
  return (
    <div className='w-full h-[600px] cursor-grab active:cursor-grabbing relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(145,94,255,0.05)_0%,_transparent_70%)] pointer-events-none' />
      
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 40 }} 
        dpr={[1, 1.5]} // Performance: Capping DPR for high-res screens
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <SkillCloud skills={skills} iconMap={iconMap} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            rotateSpeed={0.4}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default memo(SkillSphereCanvas);
