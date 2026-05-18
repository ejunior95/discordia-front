import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Bounds } from '@react-three/drei';
import type { Group } from 'three';
import { cn } from '@/lib/utils';

const MODEL_URL = '/discordia-logo-3D.glb';
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

useGLTF.preload(MODEL_URL, DRACO_DECODER_PATH);

function Model({ onLoaded }: { onLoaded: () => void }) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL, DRACO_DECODER_PATH);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5;
  });

  return (
    <group ref={ref} onUpdate={onLoaded}>
      <primitive object={scene} />
    </group>
  );
}

interface DiscordiaLogo3DProps {
  className?: string;
  fallbackSrc: string;
  fallbackAlt?: string;
}

export function DiscordiaLogo3D({ className, fallbackSrc, fallbackAlt = '' }: DiscordiaLogo3DProps) {
  const [ready, setReady] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <img
        src={fallbackSrc}
        alt={fallbackAlt}
        aria-hidden={ready}
        className={cn(
          'absolute inset-0 w-full h-full object-contain transition-opacity duration-500',
          ready ? 'opacity-0' : 'opacity-100',
        )}
      />
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        className={cn(
          'relative transition-opacity duration-500',
          ready ? 'opacity-80' : 'opacity-0',
        )}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -2, -5]} intensity={0.4} color="#a78bfa" />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.1}>
            <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
              <Model onLoaded={() => setReady(true)} />
            </Float>
          </Bounds>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
