import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ArrowLeft, ArrowRight, ArrowUp, Box, Compass, Crosshair, Eye, Sparkles } from 'lucide-react';
import { CURRICULUM_NODES, SECTORS, type CurriculumNode, type SectorDef } from '@/data/curriculum';
import { useKernelStore } from '@/store/useKernelStore';
import { createRoomKineticSculpture, type KineticSculptureHandle } from './kineticSculptures3D';
import {
  createDeckArtTexture,
  createMuseumPlaqueTexture,
  createPlasterBumpTexture,
  createRadialGlowTexture,
  createSectorWallCardTexture,
  createTerrazzoFloorTextures,
} from './posterCanvasRenderer';

interface GalleryMaze3DProps {
  paused: boolean;
  onOpenBossRaid: (sectorId: string) => void;
}

type WallSide = 'N' | 'S' | 'E' | 'W';
type CameraMode = 'walk' | 'orbit';
type HitKind = 'deck' | 'portal' | 'boss' | 'sculpture' | 'roomFloor';

interface HoverInfo {
  kind: HitKind;
  id: string;
  label: string;
  sub: string;
  standX?: number;
  standZ?: number;
  standYaw?: number;
}

interface RoomDef {
  sectorId: string;
  num: number;
  gx: number;
  gz: number;
  cx: number;
  cz: number;
  doors: Partial<Record<WallSide, string>>;
}

const ROOM_SIZE = 16;
const HALF_ROOM = ROOM_SIZE / 2; // 8m
const CORRIDOR_LEN = 6;
const GRID_STEP = ROOM_SIZE + CORRIDOR_LEN; // 22m center-to-center
const DOOR_W = 4.8;
const HALF_DOOR = DOOR_W / 2; // 2.4m
const WALL_H = 6.8;
const DOOR_H = 4.7;
const WALL_T = 0.36;
const PLINTH_COLLIDE_R = 1.74; // Smooth walk-around clearance around central kinetic sculpture

// Interconnected 7-Room Architectural Maze Floorplan
const MAZE_ROOMS: RoomDef[] = [
  { sectorId: 'sec_01', num: 1, gx: 0, gz: 0, cx: 0, cz: 0, doors: { N: 'sec_02', E: 'sec_03', S: 'sec_05' } },
  { sectorId: 'sec_02', num: 2, gx: 0, gz: -1, cx: 0, cz: -GRID_STEP, doors: { S: 'sec_01' } },
  { sectorId: 'sec_03', num: 3, gx: 1, gz: 0, cx: GRID_STEP, cz: 0, doors: { W: 'sec_01', S: 'sec_04' } },
  { sectorId: 'sec_04', num: 4, gx: 1, gz: 1, cx: GRID_STEP, cz: GRID_STEP, doors: { N: 'sec_03', W: 'sec_05', S: 'sec_07' } },
  { sectorId: 'sec_05', num: 5, gx: 0, gz: 1, cx: 0, cz: GRID_STEP, doors: { N: 'sec_01', E: 'sec_04', S: 'sec_06' } },
  { sectorId: 'sec_06', num: 6, gx: 0, gz: 2, cx: 0, cz: GRID_STEP * 2, doors: { N: 'sec_05', E: 'sec_07' } },
  { sectorId: 'sec_07', num: 7, gx: 1, gz: 2, cx: GRID_STEP, cz: GRID_STEP * 2, doors: { W: 'sec_06', N: 'sec_04' } },
];

const ROOM_BY_ID = new Map(MAZE_ROOMS.map((r) => [r.sectorId, r]));

const CORRIDORS: { a: RoomDef; b: RoomDef; axis: 'NS' | 'EW' }[] = [
  { a: ROOM_BY_ID.get('sec_02')!, b: ROOM_BY_ID.get('sec_01')!, axis: 'NS' },
  { a: ROOM_BY_ID.get('sec_01')!, b: ROOM_BY_ID.get('sec_03')!, axis: 'EW' },
  { a: ROOM_BY_ID.get('sec_01')!, b: ROOM_BY_ID.get('sec_05')!, axis: 'NS' },
  { a: ROOM_BY_ID.get('sec_03')!, b: ROOM_BY_ID.get('sec_04')!, axis: 'NS' },
  { a: ROOM_BY_ID.get('sec_05')!, b: ROOM_BY_ID.get('sec_04')!, axis: 'EW' },
  { a: ROOM_BY_ID.get('sec_05')!, b: ROOM_BY_ID.get('sec_06')!, axis: 'NS' },
  { a: ROOM_BY_ID.get('sec_06')!, b: ROOM_BY_ID.get('sec_07')!, axis: 'EW' },
  { a: ROOM_BY_ID.get('sec_04')!, b: ROOM_BY_ID.get('sec_07')!, axis: 'NS' },
];

interface WalkBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

const MARGIN = 1.08;
const WALK_BOXES: WalkBox[] = [
  ...MAZE_ROOMS.map((r) => ({
    minX: r.cx - HALF_ROOM + MARGIN,
    maxX: r.cx + HALF_ROOM - MARGIN,
    minZ: r.cz - HALF_ROOM + MARGIN,
    maxZ: r.cz + HALF_ROOM - MARGIN,
  })),
  ...CORRIDORS.map((c) => {
    const midX = (c.a.cx + c.b.cx) / 2;
    const midZ = (c.a.cz + c.b.cz) / 2;
    if (c.axis === 'NS') {
      return {
        minX: midX - HALF_DOOR + 0.72,
        maxX: midX + HALF_DOOR - 0.72,
        minZ: Math.min(c.a.cz, c.b.cz) + HALF_ROOM - MARGIN - 0.25,
        maxZ: Math.max(c.a.cz, c.b.cz) - HALF_ROOM + MARGIN + 0.25,
      };
    }
    return {
      minX: Math.min(c.a.cx, c.b.cx) + HALF_ROOM - MARGIN - 0.25,
      maxX: Math.max(c.a.cx, c.b.cx) - HALF_ROOM + MARGIN + 0.25,
      minZ: midZ - HALF_DOOR + 0.72,
      maxZ: midZ + HALF_DOOR - 0.72,
    };
  }),
];

function isInsideBoxes(x: number, z: number): boolean {
  for (let i = 0; i < WALK_BOXES.length; i++) {
    const b = WALK_BOXES[i];
    if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ) return true;
  }
  return false;
}

function isWalkable(x: number, z: number): boolean {
  if (!isInsideBoxes(x, z)) return false;
  for (let i = 0; i < MAZE_ROOMS.length; i++) {
    const r = MAZE_ROOMS[i];
    if (Math.hypot(x - r.cx, z - r.cz) < PLINTH_COLLIDE_R) return false;
  }
  return true;
}

/**
 * Resolves smooth wall-sliding AND circular radial sliding around central kinetic sculpture plinths.
 */
function stepWithCollision(curX: number, curZ: number, dx: number, dz: number): { x: number; z: number } {
  let nx = curX + dx;
  let nz = curZ + dz;

  // Radial slide around any central sculpture plinth
  for (let i = 0; i < MAZE_ROOMS.length; i++) {
    const r = MAZE_ROOMS[i];
    const rx = nx - r.cx;
    const rz = nz - r.cz;
    const dist = Math.hypot(rx, rz);
    if (dist < PLINTH_COLLIDE_R) {
      const safeDist = Math.max(0.001, dist);
      nx = r.cx + (rx / safeDist) * (PLINTH_COLLIDE_R + 0.02);
      nz = r.cz + (rz / safeDist) * (PLINTH_COLLIDE_R + 0.02);
    }
  }

  if (isWalkable(nx, nz)) return { x: nx, z: nz };
  if (isWalkable(curX + dx, curZ)) return { x: curX + dx, z: curZ };
  if (isWalkable(curX, curZ + dz)) return { x: curX, z: curZ + dz };
  return { x: curX, z: curZ };
}

function nearestRoomId(x: number, z: number): string {
  let best = MAZE_ROOMS[0].sectorId;
  let bestD = Infinity;
  for (const r of MAZE_ROOMS) {
    const d = Math.hypot(x - r.cx, z - r.cz);
    if (d < bestD) {
      bestD = d;
      best = r.sectorId;
    }
  }
  return best;
}

function doorThresholdPoint(room: RoomDef, side: WallSide, inset = 1.4): { x: number; z: number } {
  const d = HALF_ROOM - inset;
  if (side === 'N') return { x: room.cx, z: room.cz - d };
  if (side === 'S') return { x: room.cx, z: room.cz + d };
  if (side === 'W') return { x: room.cx - d, z: room.cz };
  return { x: room.cx + d, z: room.cz };
}

function oppositeSide(side: WallSide): WallSide {
  if (side === 'N') return 'S';
  if (side === 'S') return 'N';
  if (side === 'E') return 'W';
  return 'E';
}

/**
 * BFS corridor pathfinder that cleanly navigates doorways and arcs safely around central 3D sculptures.
 */
function findRoomWaypoints(startId: string, goalId: string): { x: number; z: number }[] {
  const goalRoom = ROOM_BY_ID.get(goalId);
  if (!goalRoom) return [];

  if (startId === goalId) {
    return [{ x: goalRoom.cx - 2.8, z: goalRoom.cz + 3.0 }];
  }

  const queue: string[][] = [[startId]];
  const seen = new Set<string>([startId]);
  let roomPath: string[] = [];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const cur = ROOM_BY_ID.get(path[path.length - 1]);
    if (!cur) continue;
    for (const nextId of Object.values(cur.doors)) {
      if (!nextId || seen.has(nextId)) continue;
      const nextPath = [...path, nextId];
      if (nextId === goalId) {
        roomPath = nextPath;
        queue.length = 0;
        break;
      }
      seen.add(nextId);
      queue.push(nextPath);
    }
  }

  if (roomPath.length < 2) return [];

  const waypoints: { x: number; z: number }[] = [];
  let prevEntrySide: WallSide | null = null;

  for (let i = 0; i < roomPath.length - 1; i++) {
    const cur = ROOM_BY_ID.get(roomPath[i])!;
    const nextId = roomPath[i + 1];
    const next = ROOM_BY_ID.get(nextId)!;
    const exitSide = (Object.keys(cur.doors) as WallSide[]).find((s) => cur.doors[s] === nextId)!;

    // If crossing straight across a room (N<->S or E<->W), add a graceful bypass point around the central plinth
    if (prevEntrySide && oppositeSide(prevEntrySide) === exitSide) {
      if (exitSide === 'N' || exitSide === 'S') {
        waypoints.push({ x: cur.cx + 2.9, z: cur.cz });
      } else {
        waypoints.push({ x: cur.cx, z: cur.cz + 2.9 });
      }
    }

    waypoints.push(doorThresholdPoint(cur, exitSide, 1.2));
    const entrySide = oppositeSide(exitSide);
    waypoints.push(doorThresholdPoint(next, entrySide, 1.6));
    prevEntrySide = entrySide;
  }

  // Final comfortable viewing position inside destination hall
  waypoints.push({ x: goalRoom.cx - 2.7, z: goalRoom.cz + 2.9 });
  return waypoints;
}

interface PaintingSlot {
  x: number;
  z: number;
  rotY: number;
  side: WallSide;
}

function getRoomPaintingSlots(room: RoomDef): PaintingSlot[] {
  const slots: PaintingSlot[] = [];
  const inset = HALF_ROOM - WALL_T / 2 - 0.02;
  const sides: WallSide[] = ['W', 'N', 'E', 'S'];
  const closedSides = sides.filter((s) => !room.doors[s]);
  const openSides = sides.filter((s) => Boolean(room.doors[s]));

  const pushOnSide = (side: WallSide, offset: number) => {
    if (side === 'N') slots.push({ x: room.cx + offset, z: room.cz - inset, rotY: 0, side });
    else if (side === 'S') slots.push({ x: room.cx + offset, z: room.cz + inset, rotY: Math.PI, side });
    else if (side === 'W') slots.push({ x: room.cx - inset, z: room.cz + offset, rotY: Math.PI / 2, side });
    else slots.push({ x: room.cx + inset, z: room.cz + offset, rotY: -Math.PI / 2, side });
  };

  closedSides.forEach((s) => {
    pushOnSide(s, -3.55);
    pushOnSide(s, 3.55);
  });

  openSides.forEach((s) => {
    pushOnSide(s, -5.35);
    pushOnSide(s, 5.35);
  });

  return slots;
}

function createDoorSignTexture(label: string, accentHex: string, sub: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0F1116';
  ctx.fillRect(0, 0, 640, 160);
  ctx.fillStyle = accentHex;
  ctx.fillRect(0, 0, 640, 10);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 636, 156);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 32px "Syne", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label.toUpperCase(), 320, 76);

  ctx.fillStyle = accentHex;
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText(sub.toUpperCase(), 320, 122);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export const GalleryMaze3D: React.FC<GalleryMaze3DProps> = ({ paused, onOpenBossRaid }) => {
  const { state, openDeck } = useKernelStore();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const openDeckRef = useRef(openDeck);
  openDeckRef.current = openDeck;

  const openBossRef = useRef(onOpenBossRaid);
  openBossRef.current = onOpenBossRaid;

  const [cameraMode, setCameraMode] = useState<CameraMode>('walk');
  const cameraModeRef = useRef<CameraMode>('walk');
  cameraModeRef.current = cameraMode;

  const [bloomEnabled, setBloomEnabled] = useState(true);
  const bloomRef = useRef(true);
  bloomRef.current = bloomEnabled;

  const [pointerLocked, setPointerLocked] = useState(false);
  const pointerLockedRef = useRef(false);

  const playerRef = useRef({
    x: -3.1,
    z: 3.9,
    yaw: -0.56, // Facing across Hall 01's Ring-0 Gyroscope toward framed plates & portals
    targetYaw: -0.56,
    pitch: 0.02,
    targetPitch: 0.02,
    velX: 0,
    velZ: 0,
    bobPhase: 0,
    autoWaypoints: [] as { x: number; z: number }[],
    keys: new Set<string>(),
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragDist: 0,
    mouseNdcX: 0,
    mouseNdcY: 0,
    hoverHit: null as HoverInfo | null,
  });

  const [currentRoomId, setCurrentRoomId] = useState('sec_01');
  const [minimapPos, setMinimapPos] = useState({ x: -3.1, z: 3.9, yaw: -0.56 });
  const [hoveredObj, setHoveredObj] = useState<HoverInfo | null>(null);
  const [webglError, setWebglError] = useState(false);

  const glideToRoom = (sectorId: string) => {
    const p = playerRef.current;
    if (cameraModeRef.current === 'orbit') {
      const target = ROOM_BY_ID.get(sectorId);
      if (target) {
        p.x = target.cx - 2.8;
        p.z = target.cz + 3.0;
        const lookYaw = Math.atan2(-(target.cx - p.x), -(target.cz - p.z));
        p.yaw = lookYaw;
        p.targetYaw = lookYaw;
        p.autoWaypoints = [];
        setCameraMode('walk');
      }
      return;
    }
    const fromId = nearestRoomId(p.x, p.z);
    const pts = findRoomWaypoints(fromId, sectorId);
    if (pts.length > 0) {
      p.autoWaypoints = pts;
    }
  };

  const nudgeStep = (forwardDist: number, turnRad = 0) => {
    if (cameraModeRef.current === 'orbit') {
      setCameraMode('walk');
    }
    const p = playerRef.current;
    p.autoWaypoints = [];
    p.targetYaw += turnRad;
    if (forwardDist !== 0) {
      const fx = -Math.sin(p.targetYaw) * forwardDist;
      const fz = -Math.cos(p.targetYaw) * forwardDist;
      const next = stepWithCollision(p.x, p.z, fx, fz);
      p.x = next.x;
      p.z = next.z;
    }
  };

  const togglePointerLock = () => {
    const el = mountRef.current;
    if (!el) return;
    if (document.pointerLockElement === el) {
      document.exitPointerLock?.();
    } else {
      if (cameraModeRef.current === 'orbit') setCameraMode('walk');
      el.requestPointerLock?.();
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      setWebglError(true);
      return;
    }

    const isDark = state.theme === 'dark';
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.02 : 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x06070a : 0x0e121a);
    const walkFog = new THREE.FogExp2(isDark ? 0x07080c : 0x131722, 0.0185);
    const orbitFog = new THREE.FogExp2(isDark ? 0x07080c : 0x131722, 0.0042);
    scene.fog = walkFog;

    // Physically-Based IBL Environment via Three.js RoomEnvironment + PMREMGenerator
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = isDark ? 0.55 : 0.88;
    roomEnv.dispose();
    pmrem.dispose();
    disposables.push(envRT);

    const w0 = Math.max(1, container.clientWidth);
    const h0 = Math.max(1, container.clientHeight);
    const camera = new THREE.PerspectiveCamera(60, w0 / h0, 0.1, 180);

    // OrbitControls for 3D Dollhouse Cutaway Mode
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = false;
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.07;
    orbitControls.maxPolarAngle = Math.PI * 0.46;
    orbitControls.minDistance = 12;
    orbitControls.maxDistance = 92;
    orbitControls.target.set(GRID_STEP * 0.45, 0, GRID_STEP * 0.65);
    disposables.push(orbitControls);

    // Post-Processing Pipeline: RenderPass -> Half-Res UnrealBloomPass -> OutputPass
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(dpr);
    composer.setSize(w0, h0);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(Math.max(1, Math.floor(w0 / 2)), Math.max(1, Math.floor(h0 / 2))),
      isDark ? 0.34 : 0.2,
      0.55,
      0.84
    );
    const outputPass = new OutputPass();
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);
    disposables.push(composer, bloomPass, outputPass);

    // Ambient + Directional Fill Lighting
    const hemi = new THREE.HemisphereLight(
      isDark ? 0xe0dacd : 0xffffff,
      isDark ? 0x13151b : 0x262932,
      isDark ? 0.68 : 0.95
    );
    scene.add(hemi);

    const sunDir = new THREE.DirectionalLight(0xfff6e8, isDark ? 0.42 : 0.65);
    sunDir.position.set(16, 28, 14);
    scene.add(sunDir);

    // Procedural PBR Architectural Materials
    const terrazzo = createTerrazzoFloorTextures(isDark);
    const plasterBump = createPlasterBumpTexture();
    disposables.push(terrazzo.map, terrazzo.roughnessMap, plasterBump);

    const wallMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1c1c1a : 0xf0efe9,
      bumpMap: plasterBump,
      bumpScale: 0.015,
      roughness: 0.88,
      metalness: 0.02,
    });
    const floorMat = new THREE.MeshStandardMaterial({
      map: terrazzo.map,
      roughnessMap: terrazzo.roughnessMap,
      roughness: isDark ? 0.42 : 0.48,
      metalness: 0.16,
    });
    const ceilMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0b0d11 : 0x181c24,
      roughness: 0.92,
      metalness: 0.05,
    });
    const skylightMat = new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      emissive: new THREE.Color(isDark ? 0xd9cbb0 : 0xfff8eb),
      emissiveIntensity: isDark ? 0.55 : 0.92,
      roughness: 0.2,
    });
    const bronzeTrimMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x262420 : 0x222327,
      roughness: 0.34,
      metalness: 0.78,
    });
    const brassInlayMat = new THREE.MeshStandardMaterial({
      color: 0xc9a961,
      roughness: 0.26,
      metalness: 0.86,
    });
    const frameWoodMat = new THREE.MeshStandardMaterial({
      color: 0x171615,
      roughness: 0.36,
      metalness: 0.42,
    });
    disposables.push(wallMat, floorMat, ceilMat, skylightMat, bronzeTrimMat, brassInlayMat, frameWoodMat);

    // Shared Glow Halos & Floor Light Pools
    const wallHaloTex = createRadialGlowTexture(isDark ? '245, 228, 194' : '255, 252, 242', isDark ? 0.28 : 0.68);
    const floorPoolTex = createRadialGlowTexture(isDark ? '228, 212, 180' : '255, 250, 238', isDark ? 0.16 : 0.24);
    const haloGeo = new THREE.PlaneGeometry(3.9, 4.3);
    const haloMat = new THREE.MeshBasicMaterial({
      map: wallHaloTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const poolGeo = new THREE.PlaneGeometry(3.8, 3.8);
    const poolMat = new THREE.MeshBasicMaterial({
      map: floorPoolTex,
      transparent: true,
      depthWrite: false,
    });
    disposables.push(wallHaloTex, floorPoolTex, haloGeo, haloMat, poolGeo, poolMat);

    // Ceiling group so 3D Dollhouse Orbit mode can cleanly hide roofs to reveal all 7 interiors
    const ceilingGroup = new THREE.Group();
    scene.add(ceilingGroup);

    const addBox = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      mat: THREE.Material,
      parent: THREE.Object3D = scene
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      disposables.push(geo);
      return mesh;
    };

    const clickableMeshes: THREE.Mesh[] = [];
    const interactiveCards: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; baseEmissive: number }[] = [];
    const sculptures: KineticSculptureHandle[] = [];

    // Shared Frame & Fixture Geometries
    const outerFrameGeo = new THREE.BoxGeometry(2.86, 2.52, 0.1);
    const artCanvasGeo = new THREE.PlaneGeometry(2.7, 2.36);
    const plaqueBoxGeo = new THREE.BoxGeometry(0.94, 0.42, 0.03);
    const plaqueFaceGeo = new THREE.PlaneGeometry(0.92, 0.4);
    const lampArmGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.42, 8);
    const lampHeadGeo = new THREE.CylinderGeometry(0.055, 0.07, 0.18, 12);
    disposables.push(outerFrameGeo, artCanvasGeo, plaqueBoxGeo, plaqueFaceGeo, lampArmGeo, lampHeadGeo);

    // Build all 7 Interconnected Sector Halls
    MAZE_ROOMS.forEach((room) => {
      const sec = SECTORS.find((s) => s.id === room.sectorId)!;
      const secColor = new THREE.Color(sec.color);

      const accentStripMat = new THREE.MeshStandardMaterial({
        color: secColor,
        emissive: secColor,
        emissiveIntensity: 1.15,
        roughness: 0.2,
      });
      disposables.push(accentStripMat);

      // Room Terrazzo Floor (Clickable in 3D Dollhouse Orbit mode to swoop right into this room!)
      const roomFloor = addBox(ROOM_SIZE, 0.22, ROOM_SIZE, room.cx, -0.11, room.cz, floorMat);
      roomFloor.userData = {
        kind: 'roomFloor',
        id: room.sectorId,
        label: sec.name,
        sub: `Click to swoop into Hall 0${room.num} (${sec.bookChapters})`,
      };
      clickableMeshes.push(roomFloor);

      // Recessed Ceiling Coffer + Illuminated Skylight Panel (inside ceilingGroup)
      const rim = 3.8;
      addBox(ROOM_SIZE, 0.24, rim, room.cx, WALL_H + 0.12, room.cz - HALF_ROOM + rim / 2, ceilMat, ceilingGroup);
      addBox(ROOM_SIZE, 0.24, rim, room.cx, WALL_H + 0.12, room.cz + HALF_ROOM - rim / 2, ceilMat, ceilingGroup);
      addBox(rim, 0.24, ROOM_SIZE - rim * 2, room.cx - HALF_ROOM + rim / 2, WALL_H + 0.12, room.cz, ceilMat, ceilingGroup);
      addBox(rim, 0.24, ROOM_SIZE - rim * 2, room.cx + HALF_ROOM - rim / 2, WALL_H + 0.12, room.cz, ceilMat, ceilingGroup);
      // Skylight diffuser above coffer
      addBox(ROOM_SIZE - rim * 2 + 0.2, 0.16, ROOM_SIZE - rim * 2 + 0.2, room.cx, WALL_H + 0.42, room.cz, skylightMat, ceilingGroup);
      // Sector-tinted LED cove strips inside ceiling skylight
      const coveSpan = ROOM_SIZE - rim * 2;
      addBox(coveSpan, 0.04, 0.05, room.cx, WALL_H + 0.04, room.cz - coveSpan / 2, accentStripMat, ceilingGroup);
      addBox(coveSpan, 0.04, 0.05, room.cx, WALL_H + 0.04, room.cz + coveSpan / 2, accentStripMat, ceilingGroup);
      addBox(0.05, 0.04, coveSpan, room.cx - coveSpan / 2, WALL_H + 0.04, room.cz, accentStripMat, ceilingGroup);
      addBox(0.05, 0.04, coveSpan, room.cx + coveSpan / 2, WALL_H + 0.04, room.cz, accentStripMat, ceilingGroup);

      // Real Warm Architectural PointLight per Sector Hall
      const roomLight = new THREE.PointLight(isDark ? 0xfff1dc : 0xfff8ee, isDark ? 16 : 22, 24, 1.45);
      roomLight.position.set(room.cx, WALL_H - 0.55, room.cz);
      scene.add(roomLight);

      // Center Kinetic Sculpture Installation + Plinth
      const sculpture = createRoomKineticSculpture(
        room.sectorId,
        room.num,
        room.cx,
        room.cz,
        sec.color,
        sec.name,
        isDark
      );
      scene.add(sculpture.group);
      clickableMeshes.push(sculpture.hitMesh);
      sculptures.push(sculpture);
      disposables.push(...sculpture.disposables);

      // Subtle center light pool around plinth
      const centerPool = new THREE.Mesh(poolGeo, poolMat);
      centerPool.scale.set(2.3, 2.3, 1);
      centerPool.rotation.x = -Math.PI / 2;
      centerPool.position.set(room.cx, 0.012, room.cz);
      scene.add(centerPool);

      // 4 Room Walls + Baseboard Skirting + 3D Bronze Portal Architraves
      const sideLen = (ROOM_SIZE - DOOR_W) / 2; // 5.6m
      const lintelH = WALL_H - DOOR_H;

      const buildWall = (side: WallSide) => {
        const hasDoor = Boolean(room.doors[side]);
        const isNS = side === 'N' || side === 'S';
        const wx = side === 'W' ? room.cx - HALF_ROOM : side === 'E' ? room.cx + HALF_ROOM : room.cx;
        const wz = side === 'N' ? room.cz - HALF_ROOM : side === 'S' ? room.cz + HALF_ROOM : room.cz;
        const inwardSign = side === 'N' || side === 'W' ? 1 : -1;

        if (!hasDoor) {
          if (isNS) {
            addBox(ROOM_SIZE, WALL_H, WALL_T, wx, WALL_H / 2, wz, wallMat);
            addBox(ROOM_SIZE - 0.2, 0.16, 0.05, wx, 0.08, wz + inwardSign * (WALL_T / 2 + 0.02), bronzeTrimMat);
          } else {
            addBox(WALL_T, WALL_H, ROOM_SIZE, wx, WALL_H / 2, wz, wallMat);
            addBox(0.05, 0.16, ROOM_SIZE - 0.2, wx + inwardSign * (WALL_T / 2 + 0.02), 0.08, wz, bronzeTrimMat);
          }
        } else {
          const offset = HALF_DOOR + sideLen / 2;
          if (isNS) {
            addBox(sideLen, WALL_H, WALL_T, wx - offset, WALL_H / 2, wz, wallMat);
            addBox(sideLen, WALL_H, WALL_T, wx + offset, WALL_H / 2, wz, wallMat);
            addBox(DOOR_W, lintelH, WALL_T, wx, DOOR_H + lintelH / 2, wz, wallMat);
            // Skirting on flanking segments
            addBox(sideLen - 0.2, 0.16, 0.05, wx - offset, 0.08, wz + inwardSign * (WALL_T / 2 + 0.02), bronzeTrimMat);
            addBox(sideLen - 0.2, 0.16, 0.05, wx + offset, 0.08, wz + inwardSign * (WALL_T / 2 + 0.02), bronzeTrimMat);
            // 3D Bronze Portal Jamb Columns + Header Architrave + Glowing Threshold Strips
            addBox(0.16, DOOR_H, WALL_T + 0.12, wx - HALF_DOOR + 0.06, DOOR_H / 2, wz, bronzeTrimMat);
            addBox(0.16, DOOR_H, WALL_T + 0.12, wx + HALF_DOOR - 0.06, DOOR_H / 2, wz, bronzeTrimMat);
            addBox(DOOR_W + 0.16, 0.18, WALL_T + 0.14, wx, DOOR_H - 0.06, wz, bronzeTrimMat);
            // Brass floor inlay line leading from doorway toward central stanchion ring
            const inlayLen = HALF_ROOM - 1.75;
            addBox(0.06, 0.012, inlayLen, wx, 0.01, room.cz + (side === 'N' ? -1 : 1) * (1.72 + inlayLen / 2), brassInlayMat);
          } else {
            addBox(WALL_T, WALL_H, sideLen, wx, WALL_H / 2, wz - offset, wallMat);
            addBox(WALL_T, WALL_H, sideLen, wx, WALL_H / 2, wz + offset, wallMat);
            addBox(WALL_T, lintelH, DOOR_W, wx, DOOR_H + lintelH / 2, wz, wallMat);
            addBox(0.05, 0.16, sideLen - 0.2, wx + inwardSign * (WALL_T / 2 + 0.02), 0.08, wz - offset, bronzeTrimMat);
            addBox(0.05, 0.16, sideLen - 0.2, wx + inwardSign * (WALL_T / 2 + 0.02), 0.08, wz + offset, bronzeTrimMat);
            addBox(WALL_T + 0.12, DOOR_H, 0.16, wx, DOOR_H / 2, wz - HALF_DOOR + 0.06, bronzeTrimMat);
            addBox(WALL_T + 0.12, DOOR_H, 0.16, wx, DOOR_H / 2, wz + HALF_DOOR - 0.06, bronzeTrimMat);
            addBox(WALL_T + 0.14, 0.18, DOOR_W + 0.16, wx, DOOR_H - 0.06, wz, bronzeTrimMat);
            const inlayLen = HALF_ROOM - 1.75;
            addBox(inlayLen, 0.012, 0.06, room.cx + (side === 'W' ? -1 : 1) * (1.72 + inlayLen / 2), 0.01, wz, brassInlayMat);
          }

          // Clickable Backlit Museum Portal Lintel Sign
          const targetSecId = room.doors[side]!;
          const targetSec = SECTORS.find((s) => s.id === targetSecId)!;
          const targetRoom = ROOM_BY_ID.get(targetSecId)!;
          const signTex = createDoorSignTexture(
            `→ ${targetSec.shortName}`,
            targetSec.color,
            `${targetSec.bookChapters} · Click to glide`
          );
          const signGeo = new THREE.PlaneGeometry(3.65, 0.92);
          const signMat = new THREE.MeshStandardMaterial({
            map: signTex,
            emissive: new THREE.Color(targetSec.color),
            emissiveIntensity: 0.08,
            roughness: 0.35,
          });
          const signMesh = new THREE.Mesh(signGeo, signMat);
          const inward = WALL_T / 2 + 0.06;
          if (side === 'N') {
            signMesh.position.set(wx, DOOR_H + 0.72, wz + inward);
            signMesh.rotation.y = 0;
          } else if (side === 'S') {
            signMesh.position.set(wx, DOOR_H + 0.72, wz - inward);
            signMesh.rotation.y = Math.PI;
          } else if (side === 'W') {
            signMesh.position.set(wx + inward, DOOR_H + 0.72, wz);
            signMesh.rotation.y = Math.PI / 2;
          } else {
            signMesh.position.set(wx - inward, DOOR_H + 0.72, wz);
            signMesh.rotation.y = -Math.PI / 2;
          }
          signMesh.userData = {
            kind: 'portal',
            id: targetSecId,
            label: targetSec.name,
            sub: `Glide into Hall 0${targetRoom.num} (${targetSec.bookChapters})`,
          };
          scene.add(signMesh);
          clickableMeshes.push(signMesh);
          interactiveCards.push({ mesh: signMesh, mat: signMat, baseEmissive: 0.08 });
          disposables.push(signTex, signGeo, signMat);
        }
      };

      buildWall('N');
      buildWall('S');
      buildWall('E');
      buildWall('W');

      // Mount Sector Exhibition Title Card + 3D Framed OS Plates
      const slots = getRoomPaintingSlots(room);
      const roomNodes = sec.nodes
        .map((nid) => CURRICULUM_NODES.find((n) => n.id === nid))
        .filter((n): n is CurriculumNode => Boolean(n));

      const titleSlot = slots[0];
      if (titleSlot) {
        const nx = Math.sin(titleSlot.rotY);
        const nz = Math.cos(titleSlot.rotY);
        const secTex = createSectorWallCardTexture(room.num, sec.name, sec.bookChapters, sec.color);
        const secGeo = new THREE.PlaneGeometry(1.9, 2.38);
        const secMat = new THREE.MeshStandardMaterial({
          map: secTex,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 0.03,
          roughness: 0.45,
        });
        const secBacking = addBox(1.98, 2.46, 0.07, titleSlot.x + nx * 0.04, 3.08, titleSlot.z + nz * 0.04, frameWoodMat);
        secBacking.rotation.y = titleSlot.rotY;

        const secMesh = new THREE.Mesh(secGeo, secMat);
        secMesh.position.set(titleSlot.x + nx * 0.082, 3.08, titleSlot.z + nz * 0.082);
        secMesh.rotation.y = titleSlot.rotY;
        secMesh.userData = {
          kind: 'boss',
          id: sec.id,
          label: `${sec.name} Gauntlet`,
          sub: `Click to engage Sector 0${room.num} Boss Audit`,
        };
        scene.add(secMesh);
        clickableMeshes.push(secMesh);
        interactiveCards.push({ mesh: secMesh, mat: secMat, baseEmissive: 0.03 });
        disposables.push(secTex, secGeo, secMat);

        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.set(titleSlot.x + nx * 0.02, 3.95, titleSlot.z + nz * 0.02);
        halo.rotation.y = titleSlot.rotY;
        scene.add(halo);
      }

      roomNodes.forEach((node, nIdx) => {
        const slot = slots[nIdx + 1];
        if (!slot) return;
        const nx = Math.sin(slot.rotY);
        const nz = Math.cos(slot.rotY);
        const mastered = state.masteredNodes.includes(node.id);

        // Overhead wall spotlight halo + floor reflection pool
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.set(slot.x + nx * 0.02, 4.1, slot.z + nz * 0.02);
        halo.rotation.y = slot.rotY;
        scene.add(halo);

        const pool = new THREE.Mesh(poolGeo, poolMat);
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(slot.x + nx * 1.75, 0.015, slot.z + nz * 1.75);
        scene.add(pool);

        // 3D Shadowbox Picture Frame
        const frameMesh = new THREE.Mesh(outerFrameGeo, mastered ? brassInlayMat : frameWoodMat);
        frameMesh.position.set(slot.x + nx * 0.055, 3.16, slot.z + nz * 0.055);
        frameMesh.rotation.y = slot.rotY;
        scene.add(frameMesh);

        // Overhead 3D Gallery Track Lamp Fixture angled at painting
        const lampGroup = new THREE.Group();
        lampGroup.position.set(slot.x + nx * 0.52, 4.95, slot.z + nz * 0.52);
        lampGroup.rotation.y = slot.rotY;
        const stem = new THREE.Mesh(lampArmGeo, bronzeTrimMat);
        stem.rotation.x = Math.PI / 2;
        stem.position.z = -0.21;
        const head = new THREE.Mesh(lampHeadGeo, brassInlayMat);
        head.rotation.x = 0.65;
        lampGroup.add(stem, head);
        scene.add(lampGroup);

        // Satin-Varnished High-DPI OS Artwork Canvas
        const artTex = createDeckArtTexture(node.id, node.deckNumber, node.shortTitle, mastered);
        const artMat = new THREE.MeshStandardMaterial({
          map: artTex,
          roughness: 0.34,
          metalness: 0.05,
          emissive: new THREE.Color(0xfff6e5),
          emissiveIntensity: 0.04,
        });
        const artMesh = new THREE.Mesh(artCanvasGeo, artMat);
        artMesh.position.set(slot.x + nx * 0.112, 3.16, slot.z + nz * 0.112);
        artMesh.rotation.y = slot.rotY;
        artMesh.userData = {
          kind: 'deck',
          id: node.id,
          label: `Plate ${node.deckNumber} · ${node.shortTitle}`,
          sub: `${node.silberschatz.chapter} (${node.silberschatz.sections}) — Click to study`,
          standX: slot.x + nx * 2.95,
          standZ: slot.z + nz * 2.95,
          standYaw: slot.rotY,
        };
        scene.add(artMesh);
        clickableMeshes.push(artMesh);
        interactiveCards.push({ mesh: artMesh, mat: artMat, baseEmissive: 0.04 });
        disposables.push(artTex, artMat);

        // 3D Extruded Museum Wall Plaque
        const plaqueTex = createMuseumPlaqueTexture(node.deckNumber, node.shortTitle, node.silberschatz.chapter);
        const plaqueMat = new THREE.MeshBasicMaterial({ map: plaqueTex });
        const leftShift = -0.88;
        const px = slot.x + nx * 0.025 + nz * leftShift;
        const pz = slot.z + nz * 0.025 - nx * leftShift;

        const pBack = new THREE.Mesh(plaqueBoxGeo, bronzeTrimMat);
        pBack.position.set(px, 1.58, pz);
        pBack.rotation.y = slot.rotY;
        scene.add(pBack);

        const plaqueMesh = new THREE.Mesh(plaqueFaceGeo, plaqueMat);
        plaqueMesh.position.set(px + nx * 0.018, 1.58, pz + nz * 0.018);
        plaqueMesh.rotation.y = slot.rotY;
        scene.add(plaqueMesh);
        disposables.push(plaqueTex, plaqueMat);
      });
    });

    // Build all 8 Connecting Architectural Corridor Hallways
    CORRIDORS.forEach((c) => {
      const midX = (c.a.cx + c.b.cx) / 2;
      const midZ = (c.a.cz + c.b.cz) / 2;
      if (c.axis === 'NS') {
        addBox(DOOR_W, 0.22, CORRIDOR_LEN, midX, -0.11, midZ, floorMat);
        addBox(DOOR_W, 0.22, CORRIDOR_LEN, midX, DOOR_H + 0.11, midZ, ceilMat, ceilingGroup);
        addBox(WALL_T, DOOR_H, CORRIDOR_LEN, midX - HALF_DOOR, DOOR_H / 2, midZ, wallMat);
        addBox(WALL_T, DOOR_H, CORRIDOR_LEN, midX + HALF_DOOR, DOOR_H / 2, midZ, wallMat);
        addBox(0.06, 0.014, CORRIDOR_LEN, midX, 0.01, midZ, brassInlayMat);
        addBox(0.22, 0.05, CORRIDOR_LEN - 0.8, midX, DOOR_H - 0.03, midZ, skylightMat, ceilingGroup);
      } else {
        addBox(CORRIDOR_LEN, 0.22, DOOR_W, midX, -0.11, midZ, floorMat);
        addBox(CORRIDOR_LEN, 0.22, DOOR_W, midX, DOOR_H + 0.11, midZ, ceilMat, ceilingGroup);
        addBox(CORRIDOR_LEN, DOOR_H, WALL_T, midX, DOOR_H / 2, midZ - HALF_DOOR, wallMat);
        addBox(CORRIDOR_LEN, DOOR_H, WALL_T, midX, DOOR_H / 2, midZ + HALF_DOOR, wallMat);
        addBox(CORRIDOR_LEN, 0.014, 0.06, midX, 0.01, midZ, brassInlayMat);
        addBox(CORRIDOR_LEN - 0.8, 0.05, 0.22, midX, DOOR_H - 0.03, midZ, skylightMat, ceilingGroup);
      }
      const hPool = new THREE.Mesh(poolGeo, poolMat);
      hPool.rotation.x = -Math.PI / 2;
      hPool.position.set(midX, 0.015, midZ);
      scene.add(hPool);
    });

    // 3D Operator Avatar Beacon (visible in ORBIT 3D Dollhouse mode so you see where you stand!)
    const avatarGroup = new THREE.Group();
    const avPillarGeo = new THREE.CylinderGeometry(0.18, 0.36, 2.2, 16);
    const avPillarMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: new THREE.Color(0x00f0ff),
      emissiveIntensity: 1.4,
      roughness: 0.2,
    });
    const avPillar = new THREE.Mesh(avPillarGeo, avPillarMat);
    avPillar.position.y = 1.1;
    const avConeGeo = new THREE.ConeGeometry(0.55, 1.5, 16);
    const avConeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
    });
    const avCone = new THREE.Mesh(avConeGeo, avConeMat);
    avCone.rotation.x = -Math.PI / 2;
    avCone.position.set(0, 0.35, -1.05);
    avatarGroup.add(avPillar, avCone);
    avatarGroup.visible = false;
    scene.add(avatarGroup);
    disposables.push(avPillarGeo, avPillarMat, avConeGeo, avConeMat);

    // Floating Sunlit Gallery Dust Motes (THREE.Points)
    const MOTE_COUNT = 320;
    const motePos = new Float32Array(MOTE_COUNT * 3);
    const moteSeeds = new Float32Array(MOTE_COUNT);
    for (let i = 0; i < MOTE_COUNT; i++) {
      const rm = MAZE_ROOMS[i % MAZE_ROOMS.length];
      motePos[i * 3] = rm.cx + (Math.random() - 0.5) * (ROOM_SIZE - 2.5);
      motePos[i * 3 + 1] = 0.8 + Math.random() * (WALL_H - 1.4);
      motePos[i * 3 + 2] = rm.cz + (Math.random() - 0.5) * (ROOM_SIZE - 2.5);
      moteSeeds[i] = Math.random() * Math.PI * 2;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    const moteSprite = createRadialGlowTexture('255, 248, 230', 0.85);
    const moteMat = new THREE.PointsMaterial({
      size: 0.085,
      map: moteSprite,
      transparent: true,
      opacity: isDark ? 0.42 : 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);
    disposables.push(moteGeo, moteSprite, moteMat);

    const raycaster = new THREE.Raycaster();
    const pointerVec = new THREE.Vector2();
    const startClock = performance.now();
    let lastTime = startClock;
    let lastRoom = 'sec_01';
    let lastMiniTick = 0;
    let prevMode: CameraMode = 'walk';
    let rafId = 0;

    const onResize = () => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.resolution.set(Math.max(1, Math.floor(w / 2)), Math.max(1, Math.floor(h / 2)));
    };
    window.addEventListener('resize', onResize);

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === container;
      pointerLockedRef.current = locked;
      setPointerLocked(locked);
      if (locked) {
        playerRef.current.mouseNdcX = 0;
        playerRef.current.mouseNdcY = 0;
      }
    };
    const onMouseMoveDoc = (e: MouseEvent) => {
      if (!pointerLockedRef.current || pausedRef.current) return;
      const p = playerRef.current;
      p.autoWaypoints = [];
      p.targetYaw -= e.movementX * 0.0024;
      p.targetPitch = Math.max(-0.42, Math.min(0.45, p.targetPitch - e.movementY * 0.002));
    };
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('mousemove', onMouseMoveDoc);

    const onKeyDown = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const k = e.key.toLowerCase();
      if (k === 'v') {
        if (document.pointerLockElement === container) document.exitPointerLock?.();
        setCameraMode((m) => (m === 'walk' ? 'orbit' : 'walk'));
        return;
      }
      if (k === 'l') {
        togglePointerLock();
        return;
      }
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
        if (cameraModeRef.current === 'orbit') setCameraMode('walk');
        playerRef.current.autoWaypoints = [];
        playerRef.current.keys.add(k);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      playerRef.current.keys.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      const elapsed = (now - startClock) / 1000;
      lastTime = now;
      if (pausedRef.current) return;

      const p = playerRef.current;
      const mode = cameraModeRef.current;

      // Handle seamless camera mode switch between 1P Walk and 3D Dollhouse Orbit
      if (mode !== prevMode) {
        prevMode = mode;
        if (mode === 'orbit') {
          if (document.pointerLockElement === container) document.exitPointerLock?.();
          ceilingGroup.visible = false;
          avatarGroup.visible = true;
          scene.fog = orbitFog;
          orbitControls.enabled = true;
          orbitControls.target.set(p.x, 0.5, p.z);
          camera.position.set(p.x - 16, 36, p.z + 24);
          orbitControls.update();
        } else {
          ceilingGroup.visible = true;
          avatarGroup.visible = false;
          scene.fog = walkFog;
          orbitControls.enabled = false;
        }
      }

      if (mode === 'walk') {
        // Auto-glide cleanly along doorway & plinth-safe waypoints
        if (p.autoWaypoints.length > 0) {
          const wp = p.autoWaypoints[0];
          const dx = wp.x - p.x;
          const dz = wp.z - p.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 0.45) {
            p.autoWaypoints.shift();
          } else {
            const desiredYaw = Math.atan2(-dx, -dz);
            let diff = desiredYaw - p.targetYaw;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            p.targetYaw += diff * 0.11;

            const step = Math.min(dist, 13.0 * dt);
            const next = stepWithCollision(p.x, p.z, (dx / dist) * step, (dz / dist) * step);
            if (Math.hypot(next.x - p.x, next.z - p.z) < 0.0005) {
              p.autoWaypoints = [];
            } else {
              p.x = next.x;
              p.z = next.z;
            }
          }
        }

        // Inertial WASD / Arrow first-person movement
        const turnSpeed = 2.15 * dt;
        if (p.keys.has('arrowleft')) p.targetYaw += turnSpeed;
        if (p.keys.has('arrowright')) p.targetYaw -= turnSpeed;

        let moveFwd = 0;
        let moveRight = 0;
        if (p.keys.has('w') || p.keys.has('arrowup')) moveFwd += 1;
        if (p.keys.has('s') || p.keys.has('arrowdown')) moveFwd -= 1;
        if (p.keys.has('d')) moveRight += 1;
        if (p.keys.has('a')) moveRight -= 1;

        const fx = -Math.sin(p.yaw);
        const fz = -Math.cos(p.yaw);
        const rx = Math.cos(p.yaw);
        const rz = -Math.sin(p.yaw);

        const norm = moveFwd !== 0 && moveRight !== 0 ? 0.7071 : 1;
        const targetVx = (fx * moveFwd + rx * moveRight) * norm * 8.2;
        const targetVz = (fz * moveFwd + rz * moveRight) * norm * 8.2;

        const accel = 1 - Math.exp(-12 * dt);
        p.velX += (targetVx - p.velX) * accel;
        p.velZ += (targetVz - p.velZ) * accel;

        const speedMag = Math.hypot(p.velX, p.velZ);
        if (speedMag > 0.02) {
          const next = stepWithCollision(p.x, p.z, p.velX * dt, p.velZ * dt);
          p.x = next.x;
          p.z = next.z;
          p.bobPhase += speedMag * dt * 1.65;
        }

        p.yaw += (p.targetYaw - p.yaw) * 0.18;
        p.pitch += (p.targetPitch - p.pitch) * 0.18;

        const bobOffset = speedMag > 0.25 ? Math.sin(p.bobPhase) * 0.032 * Math.min(1, speedMag / 6) : 0;
        camera.position.set(p.x, 2.56 + bobOffset, p.z);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = p.yaw;
        camera.rotation.x = p.pitch;
      } else {
        orbitControls.update();
        avatarGroup.position.set(p.x, 0, p.z);
        avatarGroup.rotation.y = p.yaw;
      }

      // Animate all 7 Central 3D Kinetic OS Sculptures
      const hoverId = p.hoverHit?.id;
      const hoverKind = p.hoverHit?.kind;
      for (let i = 0; i < sculptures.length; i++) {
        const sc = sculptures[i];
        const isScHovered = hoverKind === 'sculpture' && hoverId === sc.hitMesh.userData.id;
        sc.update(elapsed, isScHovered);
      }

      // Gently drift floating sunlit gallery dust motes
      const posAttr = moteGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < MOTE_COUNT; i++) {
        let my = posAttr.getY(i) + Math.sin(elapsed * 0.7 + moteSeeds[i]) * 0.0025;
        if (my > WALL_H - 0.6) my = 0.9;
        posAttr.setY(i, my);
      }
      posAttr.needsUpdate = true;

      // Raycast hovered plate / doorway portal / sculpture / floor (in orbit mode)
      pointerVec.set(pointerLockedRef.current ? 0 : p.mouseNdcX, pointerLockedRef.current ? 0 : p.mouseNdcY);
      raycaster.setFromCamera(pointerVec, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      const maxRayDist = mode === 'orbit' ? 140 : 20;

      let chosenData: Record<string, unknown> | null = null;
      for (let i = 0; i < hits.length; i++) {
        if (hits[i].distance > maxRayDist) break;
        const ud = hits[i].object.userData;
        if (ud.kind === 'roomFloor' && mode !== 'orbit') continue;
        chosenData = ud;
        break;
      }

      const nextHover: HoverInfo | null = chosenData
        ? {
            kind: chosenData.kind as HitKind,
            id: chosenData.id as string,
            label: chosenData.label as string,
            sub: chosenData.sub as string,
            standX: chosenData.standX as number | undefined,
            standZ: chosenData.standZ as number | undefined,
            standYaw: chosenData.standYaw as number | undefined,
          }
        : null;

      if (nextHover?.id !== p.hoverHit?.id || nextHover?.kind !== p.hoverHit?.kind) {
        p.hoverHit = nextHover;
        setHoveredObj(nextHover);
      }

      // Smooth emissive & subtle scale highlight on hovered 3D framed plates / portals
      for (let i = 0; i < interactiveCards.length; i++) {
        const item = interactiveCards[i];
        const ud = item.mesh.userData;
        const isHit = nextHover?.kind === ud.kind && nextHover?.id === ud.id;
        const targetEm = isHit ? 0.24 : item.baseEmissive;
        item.mat.emissiveIntensity += (targetEm - item.mat.emissiveIntensity) * 0.16;
        const targetS = isHit ? 1.028 : 1.0;
        item.mesh.scale.x += (targetS - item.mesh.scale.x) * 0.16;
        item.mesh.scale.y += (targetS - item.mesh.scale.y) * 0.16;
      }

      // Track current room & update minimap (~12Hz)
      const roomNow = nearestRoomId(p.x, p.z);
      if (roomNow !== lastRoom) {
        lastRoom = roomNow;
        setCurrentRoomId(roomNow);
      }
      if (now - lastMiniTick > 80) {
        lastMiniTick = now;
        setMinimapPos({ x: p.x, z: p.z, yaw: p.yaw });
      }

      if (bloomRef.current) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      if (document.pointerLockElement === container) document.exitPointerLock?.();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('mousemove', onMouseMoveDoc);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [state.theme, state.masteredNodes]);

  const handleWheel = (e: React.WheelEvent) => {
    if (cameraModeRef.current === 'orbit') return; // OrbitControls handles zoom
    const p = playerRef.current;
    p.autoWaypoints = [];
    const step = -Math.sign(e.deltaY) * Math.min(1.45, Math.abs(e.deltaY) * 0.012);
    nudgeStep(step, 0);
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    const p = playerRef.current;
    p.isDragging = true;
    p.dragStartX = clientX;
    p.dragStartY = clientY;
    p.dragDist = 0;
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    const el = mountRef.current;
    const p = playerRef.current;
    if (el && !pointerLockedRef.current) {
      const rect = el.getBoundingClientRect();
      p.mouseNdcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      p.mouseNdcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    }
    if (!p.isDragging) return;
    const dx = clientX - p.dragStartX;
    const dy = clientY - p.dragStartY;
    p.dragStartX = clientX;
    p.dragStartY = clientY;
    p.dragDist += Math.hypot(dx, dy);

    if (cameraModeRef.current === 'orbit') return;
    p.autoWaypoints = [];
    p.targetYaw += dx * 0.0046;
    p.targetPitch = Math.max(-0.36, Math.min(0.38, p.targetPitch + dy * 0.0028));
  };

  const handlePointerUp = () => {
    const p = playerRef.current;
    const wasClick = p.dragDist < 8;
    p.isDragging = false;
    if (!wasClick || !p.hoverHit) return;

    const hit = p.hoverHit;
    if (hit.kind === 'deck') {
      // Frame avatar squarely in front of the selected painting so closing Workbench returns right to it
      if (hit.standX !== undefined && hit.standZ !== undefined && hit.standYaw !== undefined) {
        if (isWalkable(hit.standX, hit.standZ)) {
          p.x = hit.standX;
          p.z = hit.standZ;
          p.yaw = hit.standYaw;
          p.targetYaw = hit.standYaw;
          p.targetPitch = 0.03;
          p.autoWaypoints = [];
        }
      }
      if (cameraModeRef.current === 'orbit') setCameraMode('walk');
      if (document.pointerLockElement) document.exitPointerLock?.();
      openDeckRef.current(hit.id, true);
    } else if (hit.kind === 'boss' || hit.kind === 'sculpture') {
      if (document.pointerLockElement) document.exitPointerLock?.();
      openBossRef.current(hit.id);
    } else if (hit.kind === 'portal' || hit.kind === 'roomFloor') {
      glideToRoom(hit.id);
    }
  };

  const activeSector: SectorDef = SECTORS.find((s) => s.id === currentRoomId) || SECTORS[0];
  const activeRoom = ROOM_BY_ID.get(currentRoomId) || MAZE_ROOMS[0];
  const neighborIds = Object.values(activeRoom.doors).filter((v): v is string => Boolean(v));

  if (webglError) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--shuta-bg)] p-8 text-center font-serif text-base text-[var(--shuta-dim)]">
        WebGL is unavailable in this browser. Switch to <strong>List</strong> or <strong>Map</strong> above.
      </div>
    );
  }

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseUp={handlePointerUp}
      onMouseLeave={() => {
        playerRef.current.isDragging = false;
      }}
      onTouchStart={(e) => e.touches.length === 1 && handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => e.touches.length === 1 && handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handlePointerUp}
      className={`relative h-full w-full select-none overflow-hidden ${
        hoveredObj ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* 3D WebGL PBR Museum Maze & Kinetic Sculptures */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Center Reticle when FPS Pointer-Lock Free-Look is active */}
      {pointerLocked && (
        <div className="pointer-events-none fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`h-2.5 w-2.5 rounded-full border transition-transform ${
              hoveredObj ? 'scale-150 border-white bg-white/80' : 'border-white/70 bg-white/20'
            }`}
          />
        </div>
      )}

      {/* Top-Left 3D Camera & Shader Controls Bar (Walk 1P | Dollhouse 3D Orbit | FPS Lock | Bloom FX) */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="fixed left-4 top-14 z-20 flex flex-wrap items-center gap-1.5 md:left-6"
      >
        <div className="inline-flex items-center rounded-full border border-white/15 bg-[#0D0F14]/85 p-[2px] shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => setCameraMode('walk')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.13em] transition-colors ${
              cameraMode === 'walk' ? 'bg-white text-[#111110]' : 'text-white/70 hover:text-white'
            }`}
          >
            <Eye className="h-3 w-3" />
            Walk 1P
          </button>
          <button
            type="button"
            onClick={() => setCameraMode('orbit')}
            title="3D Cutaway Dollhouse View (Shortcut: V)"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.13em] transition-colors ${
              cameraMode === 'orbit' ? 'bg-white text-[#111110]' : 'text-white/70 hover:text-white'
            }`}
          >
            <Box className="h-3 w-3" />
            Orbit 3D
          </button>
        </div>

        {cameraMode === 'walk' && (
          <button
            type="button"
            onClick={togglePointerLock}
            title="Toggle Mouse Free-Look (Shortcut: L / Esc)"
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] shadow-lg backdrop-blur-md transition-colors md:inline-flex ${
              pointerLocked
                ? 'border-white bg-white text-[#111110] font-bold'
                : 'border-white/15 bg-[#0D0F14]/85 text-white/75 hover:border-white/40 hover:text-white'
            }`}
          >
            <Crosshair className="h-3 w-3" />
            {pointerLocked ? 'Free-Look ON' : 'Mouse Lock'}
          </button>
        )}

        <button
          type="button"
          onClick={() => setBloomEnabled((b) => !b)}
          title="Toggle UnrealBloom Post-Processing Shader"
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] shadow-lg backdrop-blur-md transition-colors ${
            bloomEnabled
              ? 'border-amber-300/45 bg-[#0D0F14]/85 text-amber-200 hover:border-amber-200'
              : 'border-white/15 bg-[#0D0F14]/85 text-white/55 hover:text-white'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          Bloom
        </button>
      </div>

      {/* Bottom-Left Architectural Maze Floorplan Minimap */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="fixed left-4 z-20 rounded-[4px] border border-white/15 bg-[#0D0F14]/85 p-3 text-white shadow-xl backdrop-blur-md md:left-6"
        style={{ bottom: 'calc(18px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mb-2 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">
          <span className="flex items-center gap-1.5">
            <Compass className="h-3 w-3 text-white/80" />
            MAZE FLOORPLAN
          </span>
          <span className="font-bold text-white">HALL 0{activeRoom.num}/07</span>
        </div>

        <svg width="144" height="162" viewBox="-26 -46 98 118" className="block">
          {CORRIDORS.map((c, i) => (
            <line
              key={i}
              x1={c.a.gx * 38}
              y1={c.a.gz * 32}
              x2={c.b.gx * 38}
              y2={c.b.gz * 32}
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          ))}

          {MAZE_ROOMS.map((r) => {
            const sec = SECTORS.find((s) => s.id === r.sectorId)!;
            const isHere = r.sectorId === currentRoomId;
            const rx = r.gx * 38;
            const rz = r.gz * 32;
            return (
              <g key={r.sectorId} onClick={() => glideToRoom(r.sectorId)} className="cursor-pointer">
                <rect
                  x={rx - 13}
                  y={rz - 10}
                  width="26"
                  height="20"
                  rx="2"
                  fill={isHere ? sec.color : 'rgba(255,255,255,0.12)'}
                  stroke={isHere ? '#FFFFFF' : sec.color}
                  strokeWidth={isHere ? '1.8' : '1'}
                />
                <text
                  x={rx}
                  y={rz + 3.5}
                  textAnchor="middle"
                  fill={isHere ? '#0B0C0E' : '#FFFFFF'}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="8"
                  fontWeight="700"
                >
                  S{r.num}
                </text>
              </g>
            );
          })}

          {(() => {
            const px = (minimapPos.x / GRID_STEP) * 38;
            const pz = (minimapPos.z / GRID_STEP) * 32;
            const fx = -Math.sin(minimapPos.yaw);
            const fz = -Math.cos(minimapPos.yaw);
            return (
              <g>
                <line
                  x1={px}
                  y1={pz}
                  x2={px + fx * 11}
                  y2={pz + fz * 11}
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx={px} cy={pz} r="3.2" fill="#FFFFFF" stroke="#0B0C0E" strokeWidth="1" />
              </g>
            );
          })()}
        </svg>

        <div className="mt-2 flex flex-wrap gap-1">
          {neighborIds.map((nid) => {
            const nr = ROOM_BY_ID.get(nid)!;
            return (
              <button
                key={nid}
                type="button"
                onClick={() => glideToRoom(nid)}
                className="rounded-[2px] border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] uppercase text-white/80 hover:bg-white hover:text-black"
              >
                → S{nr.num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom-Center Exhibition Placard */}
      <div
        className="pointer-events-none fixed left-1/2 z-20 flex w-[min(86vw,36rem)] -translate-x-1/2 flex-col items-center text-center text-[#F5F4F0]"
        style={{ bottom: 'calc(22px + env(safe-area-inset-bottom, 0px))' }}
      >
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/60">
          {hoveredObj
            ? hoveredObj.kind === 'deck'
              ? 'FRAMED OS ARTWORK'
              : hoveredObj.kind === 'sculpture'
                ? '3D KINETIC INSTALLATION'
                : hoveredObj.kind === 'portal'
                  ? 'CONNECTING ARCHWAY'
                  : hoveredObj.kind === 'roomFloor'
                    ? 'DOLLHOUSE SECTOR HALL'
                    : 'SECTOR GAUNTLET WALL'
            : cameraMode === 'orbit'
              ? '3D ARCHITECTURAL CUTAWAY · CLICK ANY HALL OR PLATE'
              : `YOU ARE INSIDE HALL 0${activeRoom.num} OF 07`}
        </span>

        <h2 className="mt-1 font-display text-xl font-extrabold uppercase leading-tight tracking-[0.02em] text-white drop-shadow sm:text-3xl">
          {hoveredObj ? hoveredObj.label : activeSector.name.replace(/^Sector \d+:\s*/, '')}
        </h2>

        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
          {hoveredObj
            ? hoveredObj.sub
            : `${activeSector.bookChapters} · ${activeSector.nodes.length} Framed Plates + Kinetic Sculpture`}
        </span>
      </div>

      {/* Bottom-Right First-Person Walk & Turn Controls */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="fixed right-4 z-20 flex flex-col items-end gap-2 md:right-6"
        style={{ bottom: 'calc(18px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => nudgeStep(0, 0.55)}
            aria-label="Turn left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white/85 backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => nudgeStep(3.2, 0)}
            aria-label="Walk forward"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => nudgeStep(0, -0.55)}
            aria-label="Turn right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white/85 backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="pointer-events-none hidden text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.15em] text-white/50 sm:block">
          <div>
            {cameraMode === 'orbit'
              ? 'DRAG TO ORBIT 3D · SCROLL TO ZOOM · [V] WALK MODE'
              : 'WASD / SCROLL TO WALK · DRAG TO LOOK · [V] 3D ORBIT'}
          </div>
          <div>CLICK SCULPTURES, ARCHWAYS, OR PLATES TO INTERACT</div>
        </div>
      </div>
    </div>
  );
};
