// src/BackendGame.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Html,
  Environment,
  Float,
  Sparkles,
  Grid,
  RoundedBox,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import ThemeToggleButton from "./components/ThemeToggleButton.jsx";

/**
 * Servidor Node.js + Express + MongoDB (Mongoose)
 * Versión ULTRA con estética game, animaciones y HUD (Tailwind + r3f + drei)
 * + Caballeros emergentes por bloque + control para girar el mundo
 */


function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [breakpoint]);

  return isMobile;
}

/* ---------------------- WORLD DATA (usa tu estructura real) ---------------------- */
const worldData = [
  {
    id: "root",
    type: "root",
    name: "server-game",
    position: [0, 0, 0],
    color: "#4f46e5",
    size: [2.6, 0.5, 2.6],
    description: "Mundo base del proyecto. Aquí montas Express, el puerto y la conexión a MongoDB.",
  },
  {
    id: "controllers",
    type: "folder",
    name: "controllers/",
    position: [2.7, 0.7, 0],
    color: "#0ea5e9",
    size: [1.2, 0.7, 1.2],
    description:
      "Controladores (opcional): aquí va la lógica de cada endpoint. Si no los usas aún, puedes añadirlos después.",
    codePath: "controllers/user.controller.js",
    code: `// controllers/user.controller.js (CommonJS)
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};`,
  },
  {
    id: "models",
    type: "folder",
    name: "models/",
    position: [1.9, 0.7, 1.9],
    color: "#22c55e",
    size: [1.2, 0.7, 1.2],
    description: "Modelos Mongoose: definen el shape de los documentos en MongoDB.",
    codePath: "models/User.js",
    code: `// models/User.js (CommonJS)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);`,
  },
  {
    id: "routes",
    type: "folder",
    name: "routes/",
    position: [0, 0.7, 2.7],
    color: "#f59e0b",
    size: [1.2, 0.7, 1.2],
    description:
      "Rutas Express: reciben solicitudes y (si quieres) llaman a controladores. Aquí expones /api/user.",
    codePath: "routes/user/user.js",
    code: `// routes/user/user.js (CommonJS)
const express = require('express');
const router = express.Router();

// GET /api/user
router.get('/', async (req, res) => {
  // demo mínima: devolver algo estático
  res.json([{ id: 1, name: 'Demo User' }]);
});

// POST /api/user
router.post('/', async (req, res) => {
  // aquí podrías crear en Mongo si ya tienes el modelo
  // const created = await User.create(req.body);
  // return res.status(201).json(created);
  res.status(201).json({ ok: true, payload: req.body });
});

module.exports = router;`,
  },
  {
    id: "appjs",
    type: "file",
    name: "app.js",
    position: [-1.9, 0.5, 1.9],
    color: "#06b6d4",
    size: [0.9, 0.3, 0.9],
    description:
      "Tu Express real: setea el puerto, aplica middlewares y monta /api/user. Exporta la app.",
    codePath: "app.js",
    code: `// app.js (CommonJS)
const express = require('express')
const cors = require('cors')
const app = express()

app.set('port', process.env.PORT || 3000)

// middleware
app.use(express.json())
app.use(cors())

// routes User
app.use('/api/user', require('./routes/user/user'))

module.exports = app`,
  },
  {
    id: "indexjs",
    type: "file",
    name: "index.js",
    position: [-2.7, 0.5, 0],
    color: "#10b981",
    size: [0.9, 0.3, 0.9],
    description:
      "Tu punto de arranque: requiere DB (conecta) y levanta el servidor en el puerto configurado en app.",
    codePath: "index.js",
    code: `// index.js (CommonJS)
const app = require('./app')
require('./db')

function main(){
  app.listen(app.get('port'))
  console.log('server is on port :', app.get('port'))
}

main()`,
  },
  {
    id: "dbjs",
    type: "file",
    name: "db.js",
    position: [-1.9, 0.5, -1.9],
    color: "#ef4444",
    size: [0.9, 0.3, 0.9],
    description:
      "Conexión a MongoDB (Mongoose). Conecta al requerir este archivo (no necesitas llamar una función).",
    codePath: "db.js",
    code: `// db.js (CommonJS) — conecta al requerir
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/express_game';

mongoose.connection.on('connected', () => console.log('MongoDB conectado'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));

(async () => {
  try {
    // Usa el nombre de la base del propio URI como dbName (último segmento)
    await mongoose.connect(uri, { dbName: uri.split('/').pop() });
  } catch (e) {
    console.error('No se pudo conectar a MongoDB:', e.message);
    process.exit(1);
  }
})();

module.exports = mongoose;`,
  },
];

/* ---------------------- Utils ---------------------- */
const easeOutBack = (x) => {
  const c1 = 1.70158,
    c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const easeOutQuad = (t) => t * (2 - t);
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function makeVariant() {
  return {
    armor: pick(["#5b6875", "#74828f", "#9aa6b2", "#6b7280", "#7b8794"]),
    accent: pick(["#f59e0b", "#10b981", "#ef4444", "#22c55e", "#a855f7", "#06b6d4", "#eab308"]),
    plume: pick([true, false]),
    cape: pick([true, false]),
    weapon: pick(["sword", "axe", "spear", "hammer"]),
    shield: pick([true, false]),
  };
}

/* ---------------------- VFX de aparición ---------------------- */
function SpawnVFX({ position, color, token }) {
  const ring = useRef();
  const dots = useRef();
  const t = useRef(0);
  const seeds = useMemo(
    () =>
      new Array(16).fill(0).map(() => ({
        dir: new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 1.5, (Math.random() - 0.5) * 2).normalize(),
        speed: 1 + Math.random() * 1.2,
        size: 0.04 + Math.random() * 0.06,
      })),
    [token]
  );

  useFrame((_, delta) => {
    t.current += delta * 1.8;
    const k = Math.min(1, t.current);
    const s = 0.8 + k * 3.2;
    const opacity = 1 - k;
    if (ring.current) {
      ring.current.scale.set(s, s, s);
      ring.current.material.opacity = opacity * 0.6;
    }
    if (dots.current) {
      dots.current.children.forEach((m, i) => {
        const { dir, speed } = seeds[i];
        m.position.addScaledVector(dir, delta * speed);
        m.material.opacity = opacity;
        m.scale.setScalar(THREE.MathUtils.lerp(1, 0.4, k));
      });
    }
  });

  return (
    <group position={position}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.35, 48]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={dots}>
        {seeds.map((s, i) => (
          <mesh key={i} position={[0, 0.1, 0]}>
            <sphereGeometry args={[s.size, 8, 8]} />
            <meshStandardMaterial color={color} transparent opacity={1} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------------------- Armas/Escudo ---------------------- */
function Sword({ color = "#e5e7eb" }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.08, 0.7, 0.04]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.22, 0.06, 0.06]} />
        <meshStandardMaterial color="#374151" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.28, 12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}
function Axe({ color = "#e5e7eb" }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0.12, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.35, 0.18, 0.06]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.18} />
      </mesh>
    </group>
  );
}
function Spear({ color = "#e5e7eb" }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 10]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.08, 0.18, 8]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.18} />
      </mesh>
    </group>
  );
}
function Hammer({ color = "#e5e7eb" }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.18]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.18} />
      </mesh>
    </group>
  );
}
function Shield({ color = "#374151" }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 20]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.033]}>
        <torusGeometry args={[0.2, 0.03, 10, 24]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.02, 0.033]}>
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
function Weapon({ type, color }) {
  if (type === "axe") return <Axe color={color} />;
  if (type === "spear") return <Spear color={color} />;
  if (type === "hammer") return <Hammer color={color} />;
  return <Sword color={color} />;
}

/* ---------------------- Caballero ---------------------- */
function Knight({ variant, block, appearKey }) {
  const armR = useRef();
  const group = useRef();
  const lightRef = useRef();
  const startY = block.position[1] - block.size[1] / 2;
  const endY = block.position[1] + block.size[1] / 2 + 0.95;

  const tRef = useRef(0);
  const idle = useRef(0);
  useFrame((_, delta) => {
    if (tRef.current < 1) tRef.current = Math.min(1, tRef.current + delta * 1.6);
    idle.current += delta;
    const eased = easeOutBack(tRef.current);
    const y = THREE.MathUtils.lerp(startY, endY, eased);
    const s = 0.5 + 0.5 * eased;
    if (group.current) {
      const bob = Math.sin(idle.current * 2.0) * 0.03;
      group.current.position.set(block.position[0], y + bob, block.position[2]);
      group.current.scale.setScalar(s);
      group.current.rotation.y = Math.sin(idle.current * 0.6) * 0.05;
    }
    if (armR.current) {
      const raise = -1.2 * eased + Math.sin(idle.current * 3.0) * 0.08 * easeOutQuad(eased);
      armR.current.rotation.z = raise;
    }
    if (lightRef.current) lightRef.current.intensity = 2 * (1 - Math.abs(0.5 - tRef.current));
  });

  return (
    <group ref={group}>
      <pointLight ref={lightRef} distance={3} intensity={0} color={variant.accent} />
      <SpawnVFX position={[0, 0, 0]} color={variant.accent} token={appearKey} />

      {/* Botas */}
      <mesh position={[-0.18, 0.12, 0]}>
        <boxGeometry args={[0.2, 0.24, 0.26]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>
      <mesh position={[0.18, 0.12, 0]}>
        <boxGeometry args={[0.2, 0.24, 0.26]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>

      {/* Piernas */}
      <mesh position={[-0.18, 0.35, 0]}>
        <boxGeometry args={[0.18, 0.4, 0.18]} />
        <meshStandardMaterial color={variant.armor} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0.18, 0.35, 0]}>
        <boxGeometry args={[0.18, 0.4, 0.18]} />
        <meshStandardMaterial color={variant.armor} metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Rodilleras */}
      <mesh position={[-0.18, 0.56, 0]}>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial color={variant.armor} metalness={0.6} />
      </mesh>
      <mesh position={[0.18, 0.56, 0]}>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial color={variant.armor} metalness={0.6} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.26, 0.3, 0.7, 16]} />
        <meshStandardMaterial color={variant.armor} metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.02, 0.14]}>
        <boxGeometry args={[0.46, 0.3, 0.08]} />
        <meshStandardMaterial color={variant.accent} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.05, 12, 24]} />
        <meshStandardMaterial color="#374151" metalness={0.4} />
      </mesh>

      {/* Cabeza */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color={variant.armor} metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.34, 0.2]}>
        <boxGeometry args={[0.36, 0.12, 0.06]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {variant.plume && (
        <mesh position={[0, 1.6, 0]}>
          <coneGeometry args={[0.12, 0.24, 10]} />
          <meshStandardMaterial color={variant.accent} />
        </mesh>
      )}

      {/* Hombros */}
      <mesh position={[-0.4, 1.12, 0]}>
        <sphereGeometry args={[0.14, 12, 10]} />
        <meshStandardMaterial color={variant.armor} />
      </mesh>
      <mesh position={[0.4, 1.12, 0]}>
        <sphereGeometry args={[0.14, 12, 10]} />
        <meshStandardMaterial color={variant.armor} />
      </mesh>

      {/* Brazo izq (escudo) */}
      <group position={[-0.58, 1.0, 0]}>
        <mesh>
          <boxGeometry args={[0.16, 0.42, 0.16]} />
          <meshStandardMaterial color={variant.armor} />
        </mesh>
        {variant.shield && (
          <group position={[-0.24, 0, 0]} rotation={[0, 0, Math.PI / 10]}>
            <Shield color="#475569" />
          </group>
        )}
      </group>

      {/* Brazo der (arma) */}
      <group ref={armR} position={[0.58, 1.0, 0]}>
        <mesh>
          <boxGeometry args={[0.16, 0.42, 0.16]} />
          <meshStandardMaterial color={variant.armor} />
        </mesh>
        <group position={[0.2, 0.12, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <Weapon type={variant.weapon} color="#e5e7eb" />
        </group>
      </group>

      {/* Capa */}
      {variant.cape && (
        <mesh position={[0, 1.0, -0.05]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.9, 1.2, 1, 1]} />
          <meshStandardMaterial color={variant.accent} side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      )}

      {/* Base */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.32, 32]} />
        <meshStandardMaterial color={variant.accent} emissive={variant.accent} emissiveIntensity={0.18} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ---------------------- Cámara ---------------------- */
function CameraRig({ target, controlsRef, zoom = 1 }) {
  const { camera } = useThree();
  useFrame(() => {
    const to = target ? new THREE.Vector3(...target) : new THREE.Vector3(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(to, 0.08);
      controlsRef.current.update();
    }
    const ox = 3.2 * zoom;
    const oy = 2.8 * zoom;
    const oz = 5.2 * zoom;
    const desired = target ? new THREE.Vector3(to.x + ox, to.y + oy, to.z + oz) : new THREE.Vector3(0, 3 * zoom, 7 * zoom);
    camera.position.lerp(desired, 0.04);
  });
  return null;
}

/* ---------------------- UI de selección ---------------------- */
function SelectionRing({ radius = 0.9, color = "#22d3ee" }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.z += 0.02;
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, 0.41, 0]}>
      <torusGeometry args={[radius, 0.035, 16, 64]} />
      <meshStandardMaterial emissive={color} color={color} metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

/* ---------------------- Bloque clicable ---------------------- */
function Block({ item, onSelect, selected }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += hovered ? 0.012 : 0.005;
  });
  const glow = selected || hovered;

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={item.position}>
        {selected && <SelectionRing radius={Math.max(item.size[0], item.size[2]) * 0.45} />}
        <mesh
          ref={ref}
          scale={hovered || selected ? 1.08 : 1}
          onPointerDown={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          onPointerOver={() => (setHovered(true), (document.body.style.cursor = "pointer"))}
          onPointerOut={() => (setHovered(false), (document.body.style.cursor = "auto"))}
          castShadow
          receiveShadow
        >
          <RoundedBox args={item.size} radius={0.18} smoothness={4}>
            <meshStandardMaterial
              color={item.color}
              metalness={0.25}
              roughness={0.45}
              emissive={glow ? item.color : "#000000"}
              emissiveIntensity={glow ? 0.25 : 0}
            />
          </RoundedBox>
          <Html center distanceFactor={6} pointerEvents="none">
            <div className="px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold bg-white/90 text-gray-900 shadow">
              {item.name}
            </div>
          </Html>
        </mesh>
      </group>
    </Float>
  );
}

/* ---------------------- Escena ---------------------- */
function Scene3D({ onSelect, selectedId, warriors, rotationY, zoom }) {
  const controlsRef = useRef();
  const ringRef = useRef();
  const selected = worldData.find((w) => w.id === selectedId);
  const target = selected ? selected.position : [0, 0, 0];

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.y = THREE.MathUtils.lerp(ringRef.current.rotation.y, rotationY, 0.1);
    }
  });

  return (
    <>
      <color attach="background" args={["#f6f7fb"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 8, 4]} intensity={0.95} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Environment preset="city" />
      <AccumulativeShadows temporal frames={60} alphaTest={0.9} scale={16} position={[0, -0.21, 0]}>
        <RandomizedLight amount={8} radius={6} intensity={0.8} ambient={0.5} position={[5, 5, -5]} />
      </AccumulativeShadows>
      <Sparkles position={[0, 1.2, 0]} scale={6} size={2} speed={0.6} count={50} opacity={0.2} />
      <Grid
        position={[0, -0.205, 0]}
        args={[30, 30]}
        cellSize={0.6}
        cellThickness={0.6}
        sectionSize={3}
        sectionThickness={1}
        fadeDistance={22}
        fadeStrength={1}
        cellColor="#e2e8f0"
        sectionColor="#94a3b8"
      />

      <group ref={ringRef}>
        {worldData.map((item) => (
          <Block key={item.id} item={item} onSelect={onSelect} selected={item.id === selectedId} />
        ))}
        {Object.entries(warriors).map(([id, w]) => {
          const block = worldData.find((b) => b.id === id);
          if (!block) return null;
          return <Knight key={`${id}-${w.spawn}`} variant={w.variant} block={block} appearKey={w.spawn} />;
        })}
        <Text position={[0, 1.25, 0]} fontSize={0.3} color="#0f172a" anchorX="center" anchorY="middle">
          Node.js + Express + MongoDB
        </Text>
      </group>

      <OrbitControls ref={controlsRef} enableDamping maxPolarAngle={Math.PI / 2.05} minDistance={2.5} maxDistance={18} />
      <CameraRig target={target} controlsRef={controlsRef} zoom={zoom} />
    </>
  );
}

/* ---------------------- Wrapper Canvas ---------------------- */
function World3D({ onSelect, selectedId, warriors, rotationY, zoom }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4.8, 12.5], fov: 38 }} className="w-full h-full rounded-2xl">
      <Scene3D onSelect={onSelect} selectedId={selectedId} warriors={warriors} rotationY={rotationY} zoom={zoom} />
    </Canvas>
  );
}

/* ---------------------- Lateral: árbol y pasos ---------------------- */
const fileTree = `
server-game/
├─ controllers/
│  └─ user.controller.js        (opcional)
├─ models/
│  └─ User.js                    (opcional, recomendado)
├─ routes/
│  └─ user/
│     └─ user.js
├─ app.js
├─ index.js
├─ db.js
└─ .env (MONGODB_URI=mongodb://localhost:27017/express_game)
`;

const setupSteps = [
  {
    title: "1) Inicializa el proyecto",
    text: `mkdir server-game && cd server-game
npm init -y
npm i express mongoose cors dotenv
# (opcional) npm i -D nodemon
`,
  },
  { title: "2) Estructura de carpetas", text: fileTree },
  {
    title: "3) Scripts en package.json",
    text: `"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}`,
  },
  {
    title: "4) Variables de entorno",
    text: `Crea .env con:
MONGODB_URI=mongodb://localhost:27017/express_game
PORT=3000`,
  },
  {
    title: "5) Levanta el servidor",
    text: `npm run dev
# Prueba: GET http://localhost:3000/api/user
# Deberías recibir un arreglo con un usuario demo`,
  },
];

/* ---------------------- Componente principal ---------------------- */
export default function BackendGame() {
  const [selected, setSelected] = useState(worldData[0]);
  const [progress, setProgress] = useState(0);
  const [dark, setDark] = useState(false);
  const [warriors, setWarriors] = useState({});
  const [rotationY, setRotationY] = useState(0);
  const [camZoom, setCamZoom] = useState(1.45);
  const isMobile = useIsMobile(); // 👈 NUEVO


  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const onSelect = (item) => {
    setSelected(item);
    setProgress((p) => Math.min(100, p + 12));
    setWarriors((prev) => {
      const current = prev[item.id];
      const variant = current?.variant || makeVariant();
      return { [item.id]: { variant, spawn: (current?.spawn || 0) + 1 } };
    });
  };

  const colorByType = useMemo(() => ({ root: "bg-indigo-600", folder: "bg-sky-500", file: "bg-emerald-500" }), []);

  const rotateLeft = () => setRotationY((r) => r + Math.PI / 6);
  const rotateRight = () => setRotationY((r) => r - Math.PI / 6);
  const resetRotate = () => setRotationY(0);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Header/HUD */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto p-3 flex items-center justify-between">
        <h1 className="hidden md:block md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
  Server Builder • Express + MongoDB
</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600 dark:text-slate-300">Progreso</span>
            <div className="w-36 bg-slate-200/70 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-indigo-600 to-sky-500" style={{ width: `${progress}%` }} />
            </div>
            <ThemeToggleButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel 3D */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                <span className="text-indigo-600">▶</span> mern
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Haz click en los bloques para ver qué hace cada parte y copia el código (CommonJS con <code>require()</code>).
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-300">Girar mundo:</span>
                <button onClick={rotateLeft} className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50">
                  ◄
                </button>
                <button onClick={rotateRight} className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50">
                  ►
                </button>
                <button onClick={resetRotate} className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50">
                  Reset
                </button>
                <span className="mx-2 h-4 w-px bg-slate-300/60 dark:bg-slate-700" />
                <span className="text-slate-600 dark:text-slate-300">Zoom:</span>
                <button
                  onClick={() => setCamZoom((z) => Math.min(2.2, +(z + 0.15).toFixed(2)))}
                  className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50"
                >
                  −
                </button>
                <button
                  onClick={() => setCamZoom((z) => Math.max(0.7, +(z - 0.15).toFixed(2)))}
                  className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50"
                >
                  ＋
                </button>
                <button
                  onClick={() => setCamZoom(1.45)}
                  className="px-2 py-1 rounded-md border bg-white/70 dark:bg-slate-800/70 hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="p-4">
  <div className="relative rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 h-[560px] md:h-[680px] lg:h-[780px]">
    {isMobile ? (
      <div className="w-full h-full flex items-center justify-center text-center p-6 bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-slate-900 dark:to-slate-800">
        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Vista simplificada</div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            El efecto tridimensional se desactiva en móviles para mejorar el rendimiento.
            Abre esta página en un computador para explorar el entorno 3D.
          </p>
        </div>
      </div>
    ) : (
      <World3D
        onSelect={onSelect}
        selectedId={selected?.id}
        warriors={warriors}
        rotationY={rotationY}
        zoom={camZoom}
      />
    )}
  </div>
</div>

          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xl">
              <div className="p-5 border-b border-slate-200/80 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Elemento seleccionado</h3>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 mt-2 rounded-full text-white text-xs ${
                    colorByType[selected?.type] || "bg-slate-500"
                  }`}
                >
                  {selected?.type?.toUpperCase()} — {selected?.name}
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-700 dark:text-slate-300 mb-3">{selected?.description}</p>
                {selected?.code && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ruta: {selected.codePath}</p>
                    <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded-xl overflow-x-auto">
                      {selected.code}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xl">
              <div className="p-5 border-b border-slate-200/80 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Guía paso a paso (require + Express + Mongoose)
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {setupSteps.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border dark:border-slate-800">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{s.title}</div>
                    <pre className="mt-2 bg-slate-900 text-slate-100 text-xs p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                      {s.text}
                    </pre>
                  </div>
                ))}
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Consejo: si usas <code>require()</code> en Node 18+, asegúrate de <b>NO</b> poner{" "}
                  <code>"type": "module"</code> en <code>package.json</code>.
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm"
                    onClick={() => navigator.clipboard.writeText(fileTree)}
                  >
                    Copiar árbol
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm"
                    onClick={() => navigator.clipboard.writeText((worldData.find((w) => w.id === "appjs") || {}).code || "")}
                  >
                    Copiar app.js
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm"
                    onClick={() => navigator.clipboard.writeText((worldData.find((w) => w.id === "indexjs") || {}).code || "")}
                  >
                    Copiar index.js
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm"
                    onClick={() => navigator.clipboard.writeText((worldData.find((w) => w.id === "dbjs") || {}).code || "")}
                  >
                    Copiar db.js
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xl">
              <div className="p-5 border-b border-slate-200/80 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Cómo se conectan las piezas (metáfora gamer)
                </h3>
              </div>
              <div className="p-5 space-y-3 text-slate-700 dark:text-slate-300">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-semibold">index.js</span>: pulsa <em>Play</em> —{" "}
                    <code>require('./db')</code> conecta y <code>app.listen(app.get('port'))</code> levanta el server.
                  </li>
                  <li>
                    <span className="font-semibold">db.js</span>: portal a la mazmorra de datos (MongoDB). Conecta al
                    requerir y exporta <code>mongoose</code>.
                  </li>
                  <li>
                    <span className="font-semibold">app.js</span>: zona segura con buffs (middlewares:
                    <code> cors</code> y <code>express.json</code>) y puertas (<code>/api/user</code>).
                  </li>
                  <li>
                    <span className="font-semibold">routes/</span>: pasillos que llevan a las salas (endpoints).
                  </li>
                  <li>
                    <span className="font-semibold">controllers/</span>: movimientos especiales — lógica de negocio
                    (opcional).
                  </li>
                  <li>
                    <span className="font-semibold">models/</span>: tu equipamiento — define el build de los datos con
                    esquemas.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Panel lateral */}
        </div>
      </div>
    </div>
  );
}
