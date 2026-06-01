import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import {
  BoxGeometry,
  type BufferGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  type Mesh,
  OctahedronGeometry,
  Quaternion,
  TetrahedronGeometry,
  Vector3,
} from 'three';
import { cn } from '@/lib/utils';
import type { DiceType } from '../types';

interface DiceMeshProps {
  dice: DiceType;
  spinning: boolean;
  color: string;
}

interface FaceInfo {
  center: [number, number, number];
  quaternion: [number, number, number, number];
  label: string;
}

const Z_AXIS = new Vector3(0, 0, 1);

function diceStretch(dice: DiceType): number {
  return dice === 'd10' || dice === 'd100' ? 1.35 : 1;
}

function buildGeometry(dice: DiceType): BufferGeometry {
  switch (dice) {
    case 'd4':
      return new TetrahedronGeometry(0.95);
    case 'd6':
      return new BoxGeometry(1.3, 1.3, 1.3);
    case 'd8':
      return new OctahedronGeometry(1);
    case 'd10':
    case 'd100':
      return new OctahedronGeometry(1);
    case 'd12':
      return new DodecahedronGeometry(1);
    case 'd20':
    default:
      return new IcosahedronGeometry(1);
  }
}

function labelsFor(dice: DiceType, count: number): string[] {
  if (dice === 'd100') {
    return Array.from({ length: count }, (_, index) => String(index * 10).padStart(2, '0'));
  }
  return Array.from({ length: count }, (_, index) => String(index + 1));
}

function computeFaces(dice: DiceType): FaceInfo[] {
  const geometry = buildGeometry(dice).toNonIndexed();
  const position = geometry.attributes.position;
  const triangleCount = position.count / 3;
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  const ab = new Vector3();
  const ac = new Vector3();
  const buckets = new Map<string, { center: Vector3; normal: Vector3; count: number }>();

  for (let index = 0; index < triangleCount; index += 1) {
    a.fromBufferAttribute(position, index * 3);
    b.fromBufferAttribute(position, index * 3 + 1);
    c.fromBufferAttribute(position, index * 3 + 2);

    ab.subVectors(b, a);
    ac.subVectors(c, a);
    const normal = new Vector3().crossVectors(ab, ac).normalize();
    const key = `${normal.x.toFixed(1)},${normal.y.toFixed(1)},${normal.z.toFixed(1)}`;
    const center = new Vector3(
      (a.x + b.x + c.x) / 3,
      (a.y + b.y + c.y) / 3,
      (a.z + b.z + c.z) / 3,
    );
    const existing = buckets.get(key);

    if (existing) {
      existing.center.add(center);
      existing.count += 1;
    } else {
      buckets.set(key, { center, normal, count: 1 });
    }
  }

  geometry.dispose();

  const faces = Array.from(buckets.values()).map(({ center, normal, count }) => {
    const normalized = normal.clone().normalize();
    const finalPosition = center
      .clone()
      .divideScalar(count)
      .add(normalized.clone().multiplyScalar(0.018));
    const quaternion = new Quaternion().setFromUnitVectors(Z_AXIS, normalized);

    return {
      center: [finalPosition.x, finalPosition.y, finalPosition.z] as [number, number, number],
      quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w] as [number, number, number, number],
    };
  });

  const labels = labelsFor(dice, faces.length);
  return faces.map((face, index) => ({ ...face, label: labels[index] }));
}

/** Geometria aproximada para cada tipo de dado. */
function DiceGeometry({ dice }: { dice: DiceType }) {
  switch (dice) {
    case 'd4':
      return <tetrahedronGeometry args={[0.95]} />;
    case 'd6':
      return <boxGeometry args={[1.3, 1.3, 1.3]} />;
    case 'd8':
      return <octahedronGeometry args={[1]} />;
    case 'd10':
    case 'd100':
      // aproximação visual de um d10 (bipirâmide) usando octaedro alongado
      return <octahedronGeometry args={[1]} />;
    case 'd12':
      return <dodecahedronGeometry args={[1]} />;
    case 'd20':
    default:
      return <icosahedronGeometry args={[1]} />;
  }
}

function DiceMesh({ dice, spinning, color }: DiceMeshProps) {
  const ref = useRef<Mesh>(null);
  const stretch = diceStretch(dice);
  const faces = useMemo(() => computeFaces(dice), [dice]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (spinning) {
      ref.current.rotation.x += delta * 9;
      ref.current.rotation.y += delta * 12;
      ref.current.rotation.z += delta * 6;
    } else {
      // giro idle suave
      ref.current.rotation.x += delta * 0.5;
      ref.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <mesh ref={ref} scale={[1, stretch, 1]}>
      <DiceGeometry dice={dice} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.45}
        flatShading
      />
      {faces.map((face, index) => (
        <Text
          key={`${dice}-${index}`}
          position={face.center}
          quaternion={face.quaternion}
          fontSize={dice === 'd20' ? 0.26 : dice === 'd6' ? 0.5 : 0.32}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#f8fafc"
        >
          {face.label}
        </Text>
      ))}
    </mesh>
  );
}

interface DiceRollerProps {
  dice: DiceType;
  spinning: boolean;
  /** valor exibido quando a rolagem termina */
  value?: number | null;
  color?: string;
  size?: number;
  className?: string;
}

/**
 * Dado 3D reutilizável. Gira rápido enquanto `spinning` é true e,
 * ao parar, exibe `value` em um badge sobreposto.
 */
export function DiceRoller({
  dice,
  spinning,
  value = null,
  color = '#f59e0b',
  size = 120,
  className,
}: DiceRollerProps) {
  const showValue = !spinning && value != null;
  const dpr = useMemo<[number, number]>(() => [1, 2], []);

  return (
    <div
      className={cn('relative select-none', className)}
      style={{ width: size, height: size }}
      aria-label={`Dado ${dice}${showValue ? `: ${value}` : ''}`}
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 3.4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 5]} intensity={1.3} />
        <directionalLight position={[-4, -3, -4]} intensity={0.4} color="#a78bfa" />
        <Suspense fallback={null}>
          <DiceMesh dice={dice} spinning={spinning} color={color} />
        </Suspense>
      </Canvas>

      {showValue && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-background/85 px-3 py-1 text-2xl font-extrabold tabular-nums shadow-lg ring-1 ring-border backdrop-blur">
            {value}
          </span>
        </div>
      )}

      <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {dice}
      </span>
    </div>
  );
}
