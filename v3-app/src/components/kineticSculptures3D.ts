import * as THREE from 'three';

export interface KineticSculptureHandle {
  group: THREE.Group;
  hitMesh: THREE.Mesh;
  update: (elapsed: number, hovered: boolean) => void;
  disposables: { dispose: () => void }[];
}

const SCULPTURE_TITLES: Record<string, { title: string; concept: string }> = {
  sec_01: { title: 'RING-0 GYROSCOPE', concept: 'Dual-Mode Kernel / User Privilege Rings' },
  sec_02: { title: 'QUANTUM ORRERY', concept: 'Preemptive CPU Burst & Time-Slice Scheduler' },
  sec_03: { title: 'SEMAPHORE HELIX', concept: 'Phase-Locked Mutual Exclusion Interlock' },
  sec_04: { title: 'RAG CONSTELLATION', concept: 'Resource Allocation & Safe-Sequence Cage' },
  sec_05: { title: 'TLB HYPERCUBE', concept: 'Multi-Level Virtual Page Frame Lattice' },
  sec_06: { title: 'PLATTER SPINDLE', concept: 'Magnetic Cylinder Stack & Actuator Seek Arm' },
  sec_07: { title: 'CITADEL GEODESIC', concept: 'Protection Domain & Capability Vault' },
};

function createPedestalPlaqueTexture(
  roomNum: number,
  title: string,
  concept: string,
  accentHex: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111318';
  ctx.fillRect(0, 0, 512, 160);
  ctx.fillStyle = accentHex;
  ctx.fillRect(0, 0, 512, 8);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 508, 156);

  ctx.fillStyle = accentHex;
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`INSTALLATION 0${roomNum} · CLICK FOR GAUNTLET`, 256, 42);

  ctx.fillStyle = '#F7F6F2';
  ctx.font = '800 28px "Syne", sans-serif';
  ctx.fillText(title, 256, 86);

  ctx.fillStyle = 'rgba(247,246,242,0.72)';
  ctx.font = 'italic 18px "Newsreader", Georgia, serif';
  ctx.fillText(concept, 256, 126);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createRoomKineticSculpture(
  sectorId: string,
  roomNum: number,
  cx: number,
  cz: number,
  accentHex: string,
  sectorName: string,
  isDark: boolean
): KineticSculptureHandle {
  const disposables: { dispose: () => void }[] = [];
  const group = new THREE.Group();
  group.position.set(cx, 0, cz);

  const accentColor = new THREE.Color(accentHex);
  const meta = SCULPTURE_TITLES[sectorId] || SCULPTURE_TITLES.sec_01;

  // Shared Sculpture Materials
  const plinthMat = new THREE.MeshStandardMaterial({
    color: isDark ? 0x15171c : 0x1d2026,
    roughness: 0.42,
    metalness: 0.25,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xc9a961,
    roughness: 0.24,
    metalness: 0.88,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x262a33,
    roughness: 0.28,
    metalness: 0.85,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.45,
    roughness: 0.2,
    metalness: 0.55,
  });
  const coreGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: accentColor,
    emissiveIntensity: 1.35,
    roughness: 0.12,
    metalness: 0.1,
  });
  disposables.push(plinthMat, brassMat, darkMetalMat, accentMat, coreGlowMat);

  // 1. Architectural Octagonal/Cylindrical Museum Plinth + Brass Stanchion Ring
  const baseStepGeo = new THREE.CylinderGeometry(1.32, 1.4, 0.12, 32);
  const baseStep = new THREE.Mesh(baseStepGeo, darkMetalMat);
  baseStep.position.y = 0.06;
  group.add(baseStep);

  const plinthGeo = new THREE.CylinderGeometry(0.98, 1.06, 1.05, 8);
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.y = 0.58;
  group.add(plinth);

  const capRingGeo = new THREE.CylinderGeometry(1.03, 1.03, 0.05, 32);
  const capRing = new THREE.Mesh(capRingGeo, brassMat);
  capRing.position.y = 1.12;
  group.add(capRing);

  // Glowing accent collar under plinth top
  const collarGeo = new THREE.TorusGeometry(1.01, 0.018, 12, 48);
  const collar = new THREE.Mesh(collarGeo, coreGlowMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 1.09;
  group.add(collar);

  // Museum floor boundary brass ring (radius 1.62m matches collision buffer)
  const floorRingGeo = new THREE.RingGeometry(1.56, 1.62, 64);
  const floorRing = new THREE.Mesh(floorRingGeo, brassMat);
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.y = 0.018;
  group.add(floorRing);

  disposables.push(baseStepGeo, plinthGeo, capRingGeo, collarGeo, floorRingGeo);

  // Angled Pedestal Plaque on front & back so readable from any corridor approach
  const plaqueTex = createPedestalPlaqueTexture(roomNum, meta.title, meta.concept, accentHex);
  const plaqueGeo = new THREE.PlaneGeometry(0.86, 0.27);
  const plaqueMat = new THREE.MeshBasicMaterial({ map: plaqueTex });
  [0, Math.PI].forEach((rot) => {
    const pm = new THREE.Mesh(plaqueGeo, plaqueMat);
    const dirZ = Math.cos(rot);
    pm.position.set(0, 0.72, dirZ * 1.03);
    pm.rotation.y = rot;
    pm.rotation.x = dirZ > 0 ? -0.18 : 0.18;
    group.add(pm);
  });
  disposables.push(plaqueTex, plaqueGeo, plaqueMat);

  // 2. Kinetic Sculpture Rig floating above plinth (center at y = 2.45)
  const rig = new THREE.Group();
  rig.position.y = 2.42;
  group.add(rig);

  const animParts: THREE.Object3D[] = [];

  switch (sectorId) {
    case 'sec_01': {
      // Dual-Mode Privilege Gyroscope: Ring-0 Core + 3 Counter-Rotating Rings
      const coreGeo = new THREE.IcosahedronGeometry(0.36, 1);
      const core = new THREE.Mesh(coreGeo, coreGlowMat);
      rig.add(core);
      animParts.push(core);
      disposables.push(coreGeo);

      const radii = [0.62, 0.88, 1.14];
      radii.forEach((r, idx) => {
        const tGeo = new THREE.TorusGeometry(r, idx === 0 ? 0.032 : 0.024, 16, 64);
        const tMesh = new THREE.Mesh(tGeo, idx === 0 ? accentMat : idx === 1 ? brassMat : darkMetalMat);
        rig.add(tMesh);
        animParts.push(tMesh);
        disposables.push(tGeo);
      });
      break;
    }

    case 'sec_02': {
      // Quantum Scheduler Orrery: Central CPU Spindle + 4 Orbital Process Rings
      const spindleGeo = new THREE.OctahedronGeometry(0.34, 0);
      const spindle = new THREE.Mesh(spindleGeo, coreGlowMat);
      spindle.scale.set(1, 1.9, 1);
      rig.add(spindle);
      animParts.push(spindle);
      disposables.push(spindleGeo);

      const orbGeo = new THREE.SphereGeometry(0.085, 16, 16);
      disposables.push(orbGeo);

      [0.58, 0.8, 1.02, 1.22].forEach((r, idx) => {
        const holder = new THREE.Group();
        holder.rotation.x = (idx - 1.5) * 0.28;
        holder.rotation.z = idx * 0.22;

        const trackGeo = new THREE.TorusGeometry(r, 0.014, 12, 64);
        const track = new THREE.Mesh(trackGeo, idx % 2 === 0 ? brassMat : darkMetalMat);
        track.rotation.x = Math.PI / 2;
        holder.add(track);
        disposables.push(trackGeo);

        const proc = new THREE.Mesh(orbGeo, idx % 2 === 0 ? coreGlowMat : accentMat);
        proc.position.set(r, 0, 0);
        holder.add(proc);

        rig.add(holder);
        animParts.push(holder);
      });
      break;
    }

    case 'sec_03': {
      // Atomic Semaphore Helix: Twin Interlocking Phase-Locked Torus Rings + Mutex Core
      const mutexGeo = new THREE.OctahedronGeometry(0.26, 0);
      const mutex = new THREE.Mesh(mutexGeo, coreGlowMat);
      rig.add(mutex);
      animParts.push(mutex);
      disposables.push(mutexGeo);

      const ringGeo = new THREE.TorusGeometry(0.74, 0.055, 20, 64);
      const ringA = new THREE.Mesh(ringGeo, accentMat);
      ringA.position.x = -0.26;
      const ringB = new THREE.Mesh(ringGeo, brassMat);
      ringB.position.x = 0.26;
      ringB.rotation.x = Math.PI / 2;

      rig.add(ringA, ringB);
      animParts.push(ringA, ringB);
      disposables.push(ringGeo);
      break;
    }

    case 'sec_04': {
      // Deadlock Labyrinth: Resource Allocation Constellation Cage
      const cageGeo = new THREE.OctahedronGeometry(1.05, 0);
      const cageWire = new THREE.WireframeGeometry(cageGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: accentColor });
      const cage = new THREE.LineSegments(cageWire, lineMat);
      rig.add(cage);
      animParts.push(cage);

      const innerCage = new THREE.Group();
      const procGeo = new THREE.SphereGeometry(0.11, 16, 16);
      const resGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const pNode = new THREE.Mesh(procGeo, coreGlowMat);
        pNode.position.set(Math.cos(a) * 0.68, 0.22, Math.sin(a) * 0.68);
        const rNode = new THREE.Mesh(resGeo, brassMat);
        rNode.position.set(Math.cos(a + Math.PI / 4) * 0.68, -0.22, Math.sin(a + Math.PI / 4) * 0.68);
        innerCage.add(pNode, rNode);
      }
      rig.add(innerCage);
      animParts.push(innerCage);
      disposables.push(cageGeo, cageWire, lineMat, procGeo, resGeo);
      break;
    }

    case 'sec_05': {
      // Address Matrix: 3x3x3 Virtual Page-Table Hypercube + Translating TLB Core
      const lattice = new THREE.Group();
      const cellGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.18, 1.18, 1.18));
      const edgeMat = new THREE.LineBasicMaterial({ color: accentColor });
      const outerFrame = new THREE.LineSegments(edgeGeo, edgeMat);
      lattice.add(outerFrame);

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue;
            if ((Math.abs(x) + Math.abs(y) + Math.abs(z)) % 2 === 0) {
              const m = new THREE.Mesh(cellGeo, (x + y + z) % 2 === 0 ? darkMetalMat : brassMat);
              m.position.set(x * 0.38, y * 0.38, z * 0.38);
              lattice.add(m);
            }
          }
        }
      }
      const tlbCoreGeo = new THREE.BoxGeometry(0.34, 0.34, 0.34);
      const tlbCore = new THREE.Mesh(tlbCoreGeo, coreGlowMat);
      rig.add(lattice, tlbCore);
      animParts.push(lattice, tlbCore);
      disposables.push(cellGeo, edgeGeo, edgeMat, tlbCoreGeo);
      break;
    }

    case 'sec_06': {
      // Persistence & I/O Vault: 4 Spinning Magnetic Platters + Sweeping Seek Arm
      const spindleGroup = new THREE.Group();
      const axleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.15, 16);
      const axle = new THREE.Mesh(axleGeo, brassMat);
      spindleGroup.add(axle);

      const platterGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.035, 48);
      const trackGeo = new THREE.TorusGeometry(0.58, 0.012, 8, 48);
      [-0.38, -0.12, 0.14, 0.4].forEach((py, idx) => {
        const pl = new THREE.Mesh(platterGeo, idx % 2 === 0 ? darkMetalMat : brassMat);
        pl.position.y = py;
        const tr = new THREE.Mesh(trackGeo, coreGlowMat);
        tr.rotation.x = Math.PI / 2;
        tr.position.y = py + 0.022;
        spindleGroup.add(pl, tr);
      });
      spindleGroup.rotation.z = 0.16;
      rig.add(spindleGroup);
      animParts.push(spindleGroup);

      // Actuator Seek Arm Pivot
      const armPivot = new THREE.Group();
      armPivot.position.set(0.95, 0, 0.35);
      const postGeo = new THREE.CylinderGeometry(0.06, 0.08, 1.05, 16);
      const post = new THREE.Mesh(postGeo, brassMat);
      const armGeo = new THREE.BoxGeometry(0.78, 0.04, 0.07);
      const arm = new THREE.Mesh(armGeo, accentMat);
      arm.position.set(-0.36, 0.45, 0);
      const headGeo = new THREE.SphereGeometry(0.055, 12, 12);
      const head = new THREE.Mesh(headGeo, coreGlowMat);
      head.position.set(-0.74, 0.45, 0);
      armPivot.add(post, arm, head);
      rig.add(armPivot);
      animParts.push(armPivot);

      disposables.push(axleGeo, platterGeo, trackGeo, postGeo, armGeo, headGeo);
      break;
    }

    default: {
      // Sec 07 Citadel Firewall: Geodesic Dodecahedron Shield + Root-Seal Core
      const shieldGeo = new THREE.DodecahedronGeometry(0.98, 0);
      const shieldWire = new THREE.WireframeGeometry(shieldGeo);
      const shieldMat = new THREE.LineBasicMaterial({ color: accentColor });
      const shield = new THREE.LineSegments(shieldWire, shieldMat);
      rig.add(shield);
      animParts.push(shield);

      const sealGeo = new THREE.OctahedronGeometry(0.42, 0);
      const seal = new THREE.Mesh(sealGeo, coreGlowMat);
      rig.add(seal);
      animParts.push(seal);

      const guardGeo = new THREE.TorusGeometry(0.72, 0.024, 12, 48);
      const guard = new THREE.Mesh(guardGeo, brassMat);
      rig.add(guard);
      animParts.push(guard);

      disposables.push(shieldGeo, shieldWire, shieldMat, sealGeo, guardGeo);
      break;
    }
  }

  // 3. Invisible Raycast Hit Cylinder for effortless hovering/clicking on the kinetic sculpture
  const hitGeo = new THREE.CylinderGeometry(1.18, 1.18, 3.5, 16);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.position.y = 1.85;
  hitMesh.userData = {
    kind: 'sculpture',
    id: sectorId,
    label: `${meta.title} · ${sectorName.replace(/^Sector \d+:\s*/, '')}`,
    sub: `${meta.concept} — Click to launch Boss Gauntlet`,
  };
  group.add(hitMesh);
  disposables.push(hitGeo, hitMat);

  let currentScale = 1;

  const update = (t: number, hovered: boolean) => {
    const targetScale = hovered ? 1.07 : 1.0;
    currentScale += (targetScale - currentScale) * 0.14;
    rig.scale.setScalar(currentScale);
    rig.position.y = 2.42 + Math.sin(t * 1.4 + roomNum) * 0.06;

    coreGlowMat.emissiveIntensity = (hovered ? 2.1 : 1.3) + Math.sin(t * 2.6 + roomNum) * 0.25;
    accentMat.emissiveIntensity = hovered ? 0.95 : 0.45;

    switch (sectorId) {
      case 'sec_01': {
        const [core, r0, r1, r2] = animParts;
        if (core) {
          core.rotation.y = t * 0.9;
          core.rotation.x = t * 0.5;
        }
        if (r0) {
          r0.rotation.x = t * 1.1;
          r0.rotation.y = t * 0.7;
        }
        if (r1) {
          r1.rotation.y = -t * 0.85;
          r1.rotation.z = t * 0.55;
        }
        if (r2) {
          r2.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.4;
          r2.rotation.z = -t * 0.45;
        }
        break;
      }
      case 'sec_02': {
        const [spindle, ...rings] = animParts;
        if (spindle) spindle.rotation.y = -t * 1.2;
        rings.forEach((h, i) => {
          h.rotation.y = t * (1.5 - i * 0.26) * (i % 2 === 0 ? 1 : -1);
        });
        break;
      }
      case 'sec_03': {
        const [mutex, ringA, ringB] = animParts;
        if (mutex) {
          mutex.rotation.y = t * 1.4;
          mutex.rotation.z = t * 0.8;
        }
        if (ringA) ringA.rotation.y = t * 0.95;
        if (ringB) ringB.rotation.y = -t * 0.95;
        rig.rotation.y = t * 0.28;
        break;
      }
      case 'sec_04': {
        const [cage, inner] = animParts;
        if (cage) {
          cage.rotation.y = t * 0.35;
          cage.rotation.x = Math.sin(t * 0.4) * 0.22;
        }
        if (inner) {
          inner.rotation.y = -t * 0.65;
        }
        break;
      }
      case 'sec_05': {
        const [lattice, tlb] = animParts;
        if (lattice) {
          lattice.rotation.y = t * 0.38;
          lattice.rotation.x = Math.sin(t * 0.32) * 0.18;
        }
        if (tlb) {
          tlb.rotation.y = -t * 1.2;
          tlb.rotation.x = t * 0.9;
          tlb.position.x = Math.sin(t * 1.7) * 0.22;
          tlb.position.z = Math.cos(t * 1.3) * 0.22;
        }
        break;
      }
      case 'sec_06': {
        const [spindle, armPivot] = animParts;
        if (spindle) spindle.rotation.y = t * 2.4;
        if (armPivot) armPivot.rotation.y = Math.sin(t * 1.6) * 0.36 - 0.18;
        break;
      }
      default: {
        const [shield, seal, guard] = animParts;
        if (shield) {
          shield.rotation.y = t * 0.42;
          shield.rotation.z = t * 0.24;
        }
        if (seal) {
          seal.rotation.y = -t * 1.1;
          seal.rotation.x = t * 0.6;
        }
        if (guard) {
          guard.rotation.x = Math.PI / 2 + Math.sin(t * 0.9) * 0.5;
          guard.rotation.y = t * 0.8;
        }
        break;
      }
    }
  };

  return { group, hitMesh, update, disposables };
}
