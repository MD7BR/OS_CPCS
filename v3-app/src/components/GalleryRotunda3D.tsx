import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CURRICULUM_NODES, SECTORS, type CurriculumNode, type SectorDef } from '@/data/curriculum';
import { useKernelStore } from '@/store/useKernelStore';
import {
  createDeckArtTexture,
  createMuseumPlaqueTexture,
  createRadialGlowTexture,
  createSectorWallCardTexture,
} from './posterCanvasRenderer';

interface GalleryRotunda3DProps {
  paused: boolean;
  onOpenBossRaid: (sectorId: string) => void;
}

type ExhibitItem =
  | { kind: 'sector'; sector: SectorDef; sectorNum: number; angle: number }
  | { kind: 'deck'; node: CurriculumNode; sector: SectorDef; angle: number };

const R_OUTER = 22.0;
const R_INNER = 13.6;
const R_CAM = 16.4;
const WALL_H = 7.8;

function buildExhibitRing(): ExhibitItem[] {
  const ordered: (
    | { kind: 'sector'; sector: SectorDef; sectorNum: number }
    | { kind: 'deck'; node: CurriculumNode; sector: SectorDef }
  )[] = [];

  SECTORS.forEach((sec, idx) => {
    ordered.push({ kind: 'sector', sector: sec, sectorNum: idx + 1 });
    sec.nodes.forEach((nid) => {
      const node = CURRICULUM_NODES.find((n) => n.id === nid);
      if (node) ordered.push({ kind: 'deck', node, sector: sec });
    });
  });

  const step = (Math.PI * 2) / ordered.length;
  return ordered.map((item, i) => ({ ...item, angle: i * step }));
}

const EXHIBITS = buildExhibitRing();
const EXHIBIT_STEP = (Math.PI * 2) / EXHIBITS.length;

function wrapAngleDiff(a: number, b: number) {
  let d = (a - b) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return Math.abs(d);
}

export const GalleryRotunda3D: React.FC<GalleryRotunda3DProps> = ({ paused, onOpenBossRaid }) => {
  const { state, openDeck } = useKernelStore();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const openDeckRef = useRef(openDeck);
  openDeckRef.current = openDeck;

  const openBossRef = useRef(onOpenBossRaid);
  openBossRef.current = onOpenBossRaid;

  // Walk physics refs (clockwise angle around the rotunda)
  const walkRef = useRef({
    targetAngle: -0.14,
    currentAngle: -0.14,
    isDragging: false,
    dragStartX: 0,
    dragOriginAngle: 0,
    dragDist: 0,
    mouseNdcX: 0,
    mouseNdcY: 0,
    hoverDeckId: null as string | null,
    hoverSectorId: null as string | null,
  });

  const [focusedExhibit, setFocusedExhibit] = useState<ExhibitItem>(EXHIBITS[1] || EXHIBITS[0]);
  const [cursorPointer, setCursorPointer] = useState(false);
  const [webglError, setWebglError] = useState(false);

  const stepWalk = (deltaExhibits: number) => {
    walkRef.current.targetAngle += deltaExhibits * EXHIBIT_STEP;
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 0.96 : 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = isDark ? 0x07080a : 0x0d1118;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(isDark ? 0x090a0d : 0x181c24, 0.024);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      90
    );

    // Architectural Museum Lighting
    const hemi = new THREE.HemisphereLight(isDark ? 0xdad6cb : 0xffffff, isDark ? 0x151518 : 0x26282e, isDark ? 0.85 : 1.18);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff7ea, isDark ? 0.5 : 0.72);
    keyLight.position.set(8, 12, 6);
    scene.add(keyLight);

    const disposables: { dispose: () => void }[] = [];

    // 1. Sweeping Outer Curved Gallery Wall
    const wallColor = isDark ? 0x1b1b19 : 0xeeece7;
    const outerGeo = new THREE.CylinderGeometry(R_OUTER, R_OUTER, WALL_H, 160, 1, true);
    const outerMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.92,
      metalness: 0.0,
      side: THREE.BackSide,
    });
    const outerWall = new THREE.Mesh(outerGeo, outerMat);
    outerWall.position.y = WALL_H / 2;
    scene.add(outerWall);
    disposables.push(outerGeo, outerMat);

    // 2. Sweeping Inner Curved Gallery Wall (visible cleanly on the left)
    const innerGeo = new THREE.CylinderGeometry(R_INNER, R_INNER, WALL_H, 140, 1, true);
    const innerMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x171715 : 0xe9e7e1,
      roughness: 0.94,
      metalness: 0.0,
      side: THREE.FrontSide,
    });
    const innerWall = new THREE.Mesh(innerGeo, innerMat);
    innerWall.position.y = WALL_H / 2;
    scene.add(innerWall);
    disposables.push(innerGeo, innerMat);

    // 3. Matte Dark Slate Gallery Floor
    const floorGeo = new THREE.RingGeometry(R_INNER - 0.15, R_OUTER + 0.15, 160, 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0e0f12 : 0x24262b,
      roughness: 0.78,
      metalness: 0.08,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);
    disposables.push(floorGeo, floorMat);

    // 4. Pitch-Black Architectural Rotunda Ceiling
    const ceilGeo = new THREE.RingGeometry(R_INNER - 0.15, R_OUTER + 0.15, 160, 2);
    const ceilMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x050608 : 0x0e1219,
      side: THREE.FrontSide,
    });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = WALL_H;
    scene.add(ceil);
    disposables.push(ceilGeo, ceilMat);

    // Shared Overhead Spotlight Halo & Floor Reflection Pool Textures
    const wallHaloTex = createRadialGlowTexture(isDark ? '240, 224, 190' : '255, 252, 244', isDark ? 0.24 : 0.78);
    const floorPoolTex = createRadialGlowTexture(isDark ? '220, 206, 175' : '255, 250, 238', isDark ? 0.13 : 0.24);
    disposables.push(wallHaloTex, floorPoolTex);

    const haloGeo = new THREE.PlaneGeometry(4.4, 5.1);
    const haloMat = new THREE.MeshBasicMaterial({
      map: wallHaloTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const floorPoolGeo = new THREE.PlaneGeometry(4.6, 4.6);
    const floorPoolMat = new THREE.MeshBasicMaterial({
      map: floorPoolTex,
      transparent: true,
      depthWrite: false,
    });
    disposables.push(haloGeo, haloMat, floorPoolGeo, floorPoolMat);

    const clickableMeshes: THREE.Mesh[] = [];
    const hoverTargets = new Map<THREE.Mesh, { baseR: number; angle: number; currentLift: number }>();

    const placeOnRing = (obj: THREE.Object3D, radius: number, angle: number, y: number, faceOutward = false) => {
      const x = Math.cos(angle) * radius;
      const z = -Math.sin(angle) * radius;
      obj.position.set(x, y, z);
      if (faceOutward) {
        obj.lookAt(Math.cos(angle) * (radius + 10), y, -Math.sin(angle) * (radius + 10));
      } else {
        obj.lookAt(0, y, 0);
      }
    };

    // Mount all 28 Outer-Wall Exhibits (7 Sector Cards + 21 Deck Art Prints)
    EXHIBITS.forEach((ex) => {
      // Overhead gallery spotlight halo on curved plaster wall
      const halo = new THREE.Mesh(haloGeo, haloMat);
      placeOnRing(halo, R_OUTER - 0.04, ex.angle, 4.75, false);
      scene.add(halo);

      // Soft floor spotlight puddle reflection beneath each piece
      const pool = new THREE.Mesh(floorPoolGeo, floorPoolMat);
      pool.position.set(
        Math.cos(ex.angle) * (R_OUTER - 1.9),
        0.015,
        -Math.sin(ex.angle) * (R_OUTER - 1.9)
      );
      pool.rotation.x = -Math.PI / 2;
      scene.add(pool);

      if (ex.kind === 'sector') {
        const cardTex = createSectorWallCardTexture(ex.sectorNum, ex.sector.name, ex.sector.bookChapters);
        const cardGeo = new THREE.PlaneGeometry(1.9, 2.4);
        const cardMat = new THREE.MeshBasicMaterial({ map: cardTex });
        const cardMesh = new THREE.Mesh(cardGeo, cardMat);
        placeOnRing(cardMesh, R_OUTER - 0.1, ex.angle, 3.65, false);
        cardMesh.userData = { kind: 'sector', sectorId: ex.sector.id };
        scene.add(cardMesh);
        clickableMeshes.push(cardMesh);
        hoverTargets.set(cardMesh, { baseR: R_OUTER - 0.1, angle: ex.angle, currentLift: 0 });
        disposables.push(cardTex, cardGeo, cardMat);
      } else {
        const mastered = state.masteredNodes.includes(ex.node.id);
        const artTex = createDeckArtTexture(ex.node.id, ex.node.deckNumber, ex.node.shortTitle, mastered);
        const artGeo = new THREE.PlaneGeometry(2.95, 2.58);
        const artMat = new THREE.MeshBasicMaterial({ map: artTex });
        const artMesh = new THREE.Mesh(artGeo, artMat);
        placeOnRing(artMesh, R_OUTER - 0.12, ex.angle, 3.72, false);
        artMesh.userData = { kind: 'deck', deckId: ex.node.id };
        scene.add(artMesh);
        clickableMeshes.push(artMesh);
        hoverTargets.set(artMesh, { baseR: R_OUTER - 0.12, angle: ex.angle, currentLift: 0 });
        disposables.push(artTex, artGeo, artMat);

        // Crisp Museum Wall Plaque below bottom-left corner of painting
        const plaqueTex = createMuseumPlaqueTexture(
          ex.node.deckNumber,
          ex.node.shortTitle,
          ex.node.silberschatz.chapter
        );
        const plaqueGeo = new THREE.PlaneGeometry(0.95, 0.42);
        const plaqueMat = new THREE.MeshBasicMaterial({ map: plaqueTex });
        const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
        // Offset slightly counter-clockwise along wall (bottom-left when looking at outer wall)
        placeOnRing(plaqueMesh, R_OUTER - 0.08, ex.angle - 0.042, 2.02, false);
        scene.add(plaqueMesh);
        disposables.push(plaqueTex, plaqueGeo, plaqueMat);
      }
    });

    // Mount 10 Curated Inner-Wall Art Plates (so the sweeping left wall has framed gallery art too!)
    const innerStep = (Math.PI * 2) / 10;
    for (let i = 0; i < 10; i++) {
      const node = CURRICULUM_NODES[(i * 2) % CURRICULUM_NODES.length];
      const ang = i * innerStep + 0.12;
      const mastered = state.masteredNodes.includes(node.id);

      const halo = new THREE.Mesh(haloGeo, haloMat);
      placeOnRing(halo, R_INNER + 0.04, ang, 4.75, true);
      scene.add(halo);

      const artTex = createDeckArtTexture(node.id, node.deckNumber, node.shortTitle, mastered);
      const artGeo = new THREE.PlaneGeometry(2.6, 2.28);
      const artMat = new THREE.MeshBasicMaterial({ map: artTex });
      const artMesh = new THREE.Mesh(artGeo, artMat);
      placeOnRing(artMesh, R_INNER + 0.1, ang, 3.7, true);
      artMesh.userData = { kind: 'deck', deckId: node.id };
      scene.add(artMesh);
      clickableMeshes.push(artMesh);
      hoverTargets.set(artMesh, { baseR: R_INNER + 0.1, angle: ang, currentLift: 0 });
      disposables.push(artTex, artGeo, artMat);
    }

    const raycaster = new THREE.Raycaster();
    const pointerVec = new THREE.Vector2();
    let lastFocusedIdx = -1;
    let rafId = 0;

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const onKeyDown = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') walkRef.current.targetAngle += EXHIBIT_STEP;
      else if (e.key === 'ArrowLeft') walkRef.current.targetAngle -= EXHIBIT_STEP;
    };
    window.addEventListener('keydown', onKeyDown);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (pausedRef.current) return;

      const w = walkRef.current;
      w.currentAngle += (w.targetAngle - w.currentAngle) * 0.09;

      // Position camera inside curved corridor (outer wall sweeping on right, inner wall on left)
      const camX = Math.cos(w.currentAngle) * R_CAM;
      const camZ = -Math.sin(w.currentAngle) * R_CAM;
      camera.position.set(camX, 3.18, camZ);

      // Look ahead smoothly along the sweeping outer curve
      const lookAng = w.currentAngle + 0.36;
      const lookR = 19.3;
      camera.lookAt(Math.cos(lookAng) * lookR, 3.36, -Math.sin(lookAng) * lookR);

      // Raycast hover detection
      pointerVec.set(w.mouseNdcX, w.mouseNdcY);
      raycaster.setFromCamera(pointerVec, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      const hitMesh = hits.length > 0 && hits[0].distance < 22 ? (hits[0].object as THREE.Mesh) : null;

      const nextHoverDeck = hitMesh?.userData?.deckId || null;
      const nextHoverSec = hitMesh?.userData?.sectorId || null;
      if (nextHoverDeck !== w.hoverDeckId || nextHoverSec !== w.hoverSectorId) {
        w.hoverDeckId = nextHoverDeck;
        w.hoverSectorId = nextHoverSec;
        setCursorPointer(Boolean(hitMesh));
      }

      // Subtle tactile lift on hovered artwork
      hoverTargets.forEach((meta, mesh) => {
        const isHit = mesh === hitMesh;
        const targetLift = isHit ? 0.14 : 0;
        if (Math.abs(meta.currentLift - targetLift) > 0.002) {
          meta.currentLift += (targetLift - meta.currentLift) * 0.16;
          const isInner = meta.baseR < R_CAM;
          const r = isInner ? meta.baseR + meta.currentLift : meta.baseR - meta.currentLift;
          mesh.position.x = Math.cos(meta.angle) * r;
          mesh.position.z = -Math.sin(meta.angle) * r;
        }
      });

      // Update live bottom-center museum placard for the exhibit right in front of the viewer
      const frontAngle = w.currentAngle + 0.27;
      let bestIdx = 0;
      let bestDiff = Infinity;
      for (let i = 0; i < EXHIBITS.length; i++) {
        const diff = wrapAngleDiff(EXHIBITS[i].angle, frontAngle);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      }
      if (bestIdx !== lastFocusedIdx) {
        lastFocusedIdx = bestIdx;
        setFocusedExhibit(EXHIBITS[bestIdx]);
      }

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [state.theme, state.masteredNodes]);

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    walkRef.current.targetAngle += delta * 0.00075;
  };

  const handlePointerDown = (clientX: number) => {
    walkRef.current.isDragging = true;
    walkRef.current.dragStartX = clientX;
    walkRef.current.dragOriginAngle = walkRef.current.targetAngle;
    walkRef.current.dragDist = 0;
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    const el = mountRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      walkRef.current.mouseNdcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      walkRef.current.mouseNdcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    }
    if (!walkRef.current.isDragging) return;
    const dx = walkRef.current.dragStartX - clientX;
    walkRef.current.dragDist = Math.max(walkRef.current.dragDist, Math.abs(dx));
    walkRef.current.targetAngle = walkRef.current.dragOriginAngle + dx * 0.0028;
  };

  const handlePointerUp = () => {
    const wasClick = walkRef.current.dragDist < 7;
    walkRef.current.isDragging = false;
    if (wasClick) {
      if (walkRef.current.hoverDeckId) {
        openDeckRef.current(walkRef.current.hoverDeckId, true);
      } else if (walkRef.current.hoverSectorId) {
        openBossRef.current(walkRef.current.hoverSectorId);
      }
    }
  };

  if (webglError) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--shuta-bg)] p-8 text-center font-serif text-base text-[var(--shuta-dim)]">
        WebGL is unavailable in this browser. Switch to <strong>List</strong> or <strong>Map</strong> above to explore all 21 OS plates.
      </div>
    );
  }

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
      onMouseUp={handlePointerUp}
      onMouseLeave={() => {
        walkRef.current.isDragging = false;
      }}
      onTouchStart={(e) => e.touches.length === 1 && handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => e.touches.length === 1 && handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handlePointerUp}
      className={`relative h-full w-full select-none overflow-hidden ${
        cursorPointer ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* 3D WebGL Museum Rotunda Canvas */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Bottom-Center Museum Exhibition Placard (Exact Shutabug "YOU ARE WALKING PAST" Layout) */}
      <div
        className="pointer-events-none fixed left-1/2 z-20 flex w-[min(92vw,36rem)] -translate-x-1/2 flex-col items-center text-center text-[#F5F4F0]"
        style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-white/55">
          YOU ARE WALKING PAST
        </span>

        {focusedExhibit.kind === 'deck' ? (
          <>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold uppercase leading-[0.98] tracking-[0.02em] text-white drop-shadow sm:text-3xl md:text-4xl">
              {focusedExhibit.node.shortTitle}
            </h2>
            <button
              type="button"
              onClick={() => openDeck(focusedExhibit.node.id, true)}
              className="pointer-events-auto shuta-link mt-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 hover:text-white"
            >
              ENTER PLATE {focusedExhibit.node.deckNumber} · {focusedExhibit.node.silberschatz.chapter} →
            </button>
          </>
        ) : (
          <>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold uppercase leading-[0.98] tracking-[0.02em] text-white drop-shadow sm:text-3xl md:text-4xl">
              {focusedExhibit.sector.name.replace(/^Sector \d+:\s*/, '')}
            </h2>
            <button
              type="button"
              onClick={() => onOpenBossRaid(focusedExhibit.sector.id)}
              className="pointer-events-auto shuta-link mt-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 hover:text-white"
            >
              ENTER SECTOR {String(focusedExhibit.sectorNum).padStart(2, '0')} GAUNTLET →
            </button>
          </>
        )}
      </div>

      {/* Bottom-Right Circular Walk Arrows & Gesture Caption (Exact Shutabug Screenshot Position) */}
      <div
        className="fixed right-5 z-20 flex flex-col items-end gap-2 md:right-7"
        style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepWalk(-1)}
            aria-label="Walk left"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white/85 backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => stepWalk(1)}
            aria-label="Walk right"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white/85 backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="pointer-events-none hidden text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-white/50 sm:block">
          <div>SCROLL OR DRAG TO WALK ROUND</div>
          <div>CLICK A PLATE TO LOOK CLOSER</div>
        </div>
      </div>
    </div>
  );
};
