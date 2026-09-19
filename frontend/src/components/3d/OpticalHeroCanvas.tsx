'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

type StageProps = {
  index: number;
  hovered: number | null;
  setHovered: (value: number | null) => void;
};

const PAPER = '#efede6';
const SIGNAL = '#ff5b35';
const DATA = '#5d73ff';
const OK = '#8bd450';

function StageLabel({ text, active }: { text: string; active: boolean }) {
  return (
    <Text
      position={[0, -1.08, 0]}
      fontSize={0.14}
      color={active ? PAPER : '#817d74'}
      anchorX="center"
      anchorY="middle"
      letterSpacing={0.08}
    >
      {text}
    </Text>
  );
}

function SceneStage({ index, hovered, setHovered }: StageProps) {
  const active = hovered === index;
  return (
    <group
      position={[-4.2, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(index); }}
      onPointerOut={() => setHovered(null)}
    >
      <mesh>
        <planeGeometry args={[1.45, 1.45]} />
        <meshBasicMaterial color="#121210" />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.45, 1.45)]} />
        <lineBasicMaterial color={active ? SIGNAL : PAPER} />
      </lineSegments>
      {[0.42, 0.22].map((r) => (
        <mesh key={r} position={[0, 0, 0.02]}>
          <ringGeometry args={[r - 0.006, r, 48]} />
          <meshBasicMaterial color={active ? SIGNAL : PAPER} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.72, 0.012]} />
        <meshBasicMaterial color={active ? SIGNAL : PAPER} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.012, 0.72]} />
        <meshBasicMaterial color={active ? SIGNAL : PAPER} />
      </mesh>
      <StageLabel text="01 / SCENE x" active={active} />
    </group>
  );
}

function EncoderStage({ index, hovered, setHovered }: StageProps) {
  const active = hovered === index;
  return (
    <group
      position={[-2.1, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(index); }}
      onPointerOut={() => setHovered(null)}
    >
      <mesh rotation={[0, active ? 0.12 : 0, 0]}>
        <planeGeometry args={[1.5, 1.5, 12, 12]} />
        <meshBasicMaterial color={active ? SIGNAL : '#77736b'} wireframe transparent opacity={0.82} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.5, 1.5)]} />
        <lineBasicMaterial color={active ? SIGNAL : '#a29d92'} />
      </lineSegments>
      <StageLabel text="02 / ENCODER H" active={active} />
    </group>
  );
}

function SensorStage({ index, hovered, setHovered }: StageProps) {
  const active = hovered === index;
  return (
    <group
      position={[0, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(index); }}
      onPointerOut={() => setHovered(null)}
    >
      <mesh>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="#090908" />
      </mesh>
      <gridHelper args={[1.5, 11, active ? SIGNAL : '#8a857b', '#292824']} rotation={[Math.PI / 2, 0, 0]} />
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.5, 1.5)]} />
        <lineBasicMaterial color={active ? SIGNAL : PAPER} />
      </lineSegments>
      <StageLabel text="03 / SENSOR y" active={active} />
    </group>
  );
}

function InverseStage({ index, hovered, setHovered }: StageProps) {
  const active = hovered === index;
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.24;
  });
  return (
    <group
      position={[2.1, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(index); }}
      onPointerOut={() => setHovered(null)}
    >
      <group ref={ref}>
        <mesh>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshBasicMaterial color={active ? SIGNAL : DATA} wireframe />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.32, 0]} />
          <meshBasicMaterial color={active ? PAPER : DATA} wireframe />
        </mesh>
      </group>
      <StageLabel text="04 / INVERSE fθ" active={active} />
    </group>
  );
}

function ReconstructionStage({ index, hovered, setHovered }: StageProps) {
  const active = hovered === index;
  return (
    <group
      position={[4.2, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(index); }}
      onPointerOut={() => setHovered(null)}
    >
      <mesh>
        <planeGeometry args={[1.45, 1.45]} />
        <meshBasicMaterial color="#11110f" />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.45, 1.45)]} />
        <lineBasicMaterial color={active ? SIGNAL : OK} />
      </lineSegments>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.34, 64]} />
        <meshBasicMaterial color={active ? SIGNAL : OK} wireframe />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <ringGeometry args={[0.11, 0.12, 40]} />
        <meshBasicMaterial color={PAPER} />
      </mesh>
      <StageLabel text="05 / RECOVERY x̂" active={active} />
    </group>
  );
}

function PhotonField() {
  const ref = useRef<THREE.Points>(null);
  const count = 150;
  const { positions, colors, speed } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const warm = new THREE.Color(SIGNAL);
    const light = new THREE.Color(PAPER);
    const blue = new THREE.Color(DATA);
    const green = new THREE.Color(OK);
    const unit = (i: number, salt: number) => {
      const raw = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
      return raw - Math.floor(raw);
    };
    for (let i = 0; i < count; i++) {
      p[i * 3] = -4.7 + unit(i, 1) * 9.4;
      p[i * 3 + 1] = (unit(i, 2) - 0.5) * 1.15;
      p[i * 3 + 2] = (unit(i, 3) - 0.5) * 0.86;
      s[i] = 0.012 + unit(i, 4) * 0.016;
      const col = p[i * 3] < -2.1 ? light : p[i * 3] < 0 ? warm : p[i * 3] < 2.1 ? blue : green;
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    return { positions: p, colors: c, speed: s };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pa = ref.current.geometry.attributes.position;
    const ca = ref.current.geometry.attributes.color;
    const p = pa.array as Float32Array;
    const c = ca.array as Float32Array;
    const warm = new THREE.Color(SIGNAL);
    const light = new THREE.Color(PAPER);
    const blue = new THREE.Color(DATA);
    const green = new THREE.Color(OK);

    for (let i = 0; i < count; i++) {
      p[i * 3] += speed[i];
      if (p[i * 3] > 4.7) {
        p[i * 3] = -4.7;
        p[i * 3 + 1] = (Math.random() - 0.5) * 1.15;
        p[i * 3 + 2] = (Math.random() - 0.5) * 0.86;
      }
      if (p[i * 3] > -2.1 && p[i * 3] < 0) {
        p[i * 3 + 1] += (Math.random() - 0.5) * 0.009;
        p[i * 3 + 2] += (Math.random() - 0.5) * 0.009;
      }
      const x = p[i * 3];
      const col = x < -2.1 ? light : x < 0 ? warm : x < 2.1 ? blue : green;
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    pa.needsUpdate = true;
    ca.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.78} />
    </points>
  );
}

function Rig({ hovered, setHovered }: { hovered: number | null; setHovered: (value: number | null) => void }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.08, 0.045);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -state.pointer.y * 0.045, 0.045);
  });
  return (
    <group ref={ref}>
      <SceneStage index={0} hovered={hovered} setHovered={setHovered} />
      <EncoderStage index={1} hovered={hovered} setHovered={setHovered} />
      <SensorStage index={2} hovered={hovered} setHovered={setHovered} />
      <InverseStage index={3} hovered={hovered} setHovered={setHovered} />
      <ReconstructionStage index={4} hovered={hovered} setHovered={setHovered} />
      <PhotonField />
    </group>
  );
}

export const OpticalHeroCanvas: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const descriptions = [
    ['01 / SCENE x', 'Reference scene before optical encoding.'],
    ['02 / FORWARD MODEL H', 'Diffuser or coded mask encodes scene information spatially.'],
    ['03 / MEASUREMENT y', 'Sensor records an encoded pattern rather than a recognisable photograph.'],
    ['04 / INVERSE MODEL fθ', 'The reconstruction model estimates the scene from the measurement.'],
    ['05 / RECOVERY x̂', 'Recovered image estimate produced by computation.'],
  ];

  return (
    <div className="relative w-full h-[580px] lg:h-full min-h-[580px] overflow-hidden bg-[#070706]">
      <Canvas camera={{ position: [0, 0.35, 7.6], fov: 47 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.8} />
        <Rig hovered={hovered} setHovered={setHovered} />
      </Canvas>

      <div className="absolute left-4 right-4 bottom-4 border border-white/15 bg-[#0a0a09]/92 min-h-[64px] px-4 py-3 flex items-center justify-between gap-4 pointer-events-none">
        <div>
          <div className="tech-label text-[#efede6]">{hovered === null ? 'MOVE POINTER ACROSS THE OPTICAL PATH' : descriptions[hovered][0]}</div>
          <p className="text-[11px] sm:text-xs text-[#8e8a80] mt-1">{hovered === null ? 'Each stage represents one part of the forward / inverse imaging chain.' : descriptions[hovered][1]}</p>
        </div>
        <div className="hidden sm:block font-mono text-[9px] text-[#5f5b53]">X / 000—100</div>
      </div>
    </div>
  );
};
