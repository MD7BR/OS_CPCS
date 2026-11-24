import * as THREE from 'three';

interface ArtPalette {
  bg: string;
  fg: string;
  accent: string;
  secondary: string;
  pop: string;
}

const ART_PALETTES: Record<string, ArtPalette> = {
  deck_02: { bg: '#72C2DF', fg: '#151922', accent: '#E04F26', secondary: '#F2C94C', pop: '#F7F3E9' },
  deck_03: { bg: '#1B365D', fg: '#F5EFE4', accent: '#F2A93B', secondary: '#5FA8D3', pop: '#D9532F' },
  deck_04: { bg: '#E6DDD0', fg: '#171716', accent: '#C82D2D', secondary: '#3B6E8C', pop: '#F2B84B' },
  deck_05: { bg: '#21262D', fg: '#F5F0E6', accent: '#F0AE3C', secondary: '#3AA685', pop: '#E05A3F' },
  deck_06: { bg: '#1D6B52', fg: '#F6F1E6', accent: '#F07C3A', secondary: '#80D4B4', pop: '#182420' },
  deck_07: { bg: '#CE5D3B', fg: '#161412', accent: '#F4C95D', secondary: '#F5F0E6', pop: '#233B59' },
  deck_08: { bg: '#233F70', fg: '#F6F2EA', accent: '#EE562E', secondary: '#77B6EA', pop: '#F4C95D' },
  deck_09: { bg: '#D14F9B', fg: '#18141A', accent: '#F5C94C', secondary: '#F6F2EC', pop: '#235391' },
  deck_10: { bg: '#1D2228', fg: '#F5F1E8', accent: '#3AC282', secondary: '#E8B042', pop: '#E05446' },
  deck_11: { bg: '#125E4E', fg: '#F5F0E6', accent: '#F0B43C', secondary: '#6CD6BE', pop: '#D94E2A' },
  deck_12: { bg: '#7D3B8C', fg: '#F8F2E8', accent: '#F27441', secondary: '#F5CA5C', pop: '#1A1423' },
  deck_13: { bg: '#ECE4D8', fg: '#181615', accent: '#C42026', secondary: '#2A4E7A', pop: '#E8A838' },
  deck_14: { bg: '#1D5258', fg: '#F5F0E5', accent: '#EAB348', secondary: '#67C2C4', pop: '#DA5632' },
  deck_15: { bg: '#282321', fg: '#F5F0E8', accent: '#E04141', secondary: '#D9A74A', pop: '#5885AF' },
  deck_16: { bg: '#3E2F6B', fg: '#F5EFE6', accent: '#F0B849', secondary: '#9B87E0', pop: '#E35B3A' },
  deck_17: { bg: '#1C4B7A', fg: '#F4F1EA', accent: '#42C792', secondary: '#F2B84B', pop: '#E05236' },
  deck_18: { bg: '#8C2743', fg: '#F7F1E7', accent: '#F2B84B', secondary: '#EB7D8E', pop: '#1E1A20' },
  deck_19: { bg: '#211F1E', fg: '#F5F0E8', accent: '#E55A34', secondary: '#D6B15C', pop: '#4B96B4' },
  deck_20: { bg: '#246647', fg: '#F6F1E6', accent: '#F0B342', secondary: '#77CF9E', pop: '#D94D29' },
  deck_21: { bg: '#68A8CC', fg: '#152030', accent: '#E8622E', secondary: '#F5D061', pop: '#F7F3EA' },
  deck_22: { bg: '#1A1B1E', fg: '#F5F2EB', accent: '#D4AF5A', secondary: '#4C8DAE', pop: '#D94A38' },
};

export function createDeckArtTexture(
  deckId: string,
  deckNumber: string,
  title: string,
  mastered: boolean
): THREE.CanvasTexture {
  const W = 768;
  const H = 672;
  const MAT = 30; // Crisp archival museum mat board around inner canvas
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const p = ART_PALETTES[deckId] || ART_PALETTES.deck_02;

  // Archival warm museum mat board
  ctx.fillStyle = '#F4F2EC';
  ctx.fillRect(0, 0, W, H);

  // Inner artwork bounds
  const ax = MAT;
  const ay = MAT;
  const aw = W - MAT * 2;
  const ah = H - MAT * 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(ax, ay, aw, ah);
  ctx.clip();

  // Vibrant art canvas background
  ctx.fillStyle = p.bg;
  ctx.fillRect(ax, ay, aw, ah);

  // Subtle architectural sun/horizon wash
  const grad = ctx.createLinearGradient(0, ay, 0, ay + ah);
  grad.addColorStop(0, 'rgba(255,255,255,0.14)');
  grad.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = grad;
  ctx.fillRect(ax, ay, aw, ah);

  const idx = Math.max(0, parseInt(deckNumber, 10) - 2);
  const cx = W * 0.5;
  const cy = H * 0.48;

  // Ground plane horizon block on alternating pieces for painterly depth
  if (idx % 2 === 0) {
    ctx.fillStyle = p.fg;
    ctx.globalAlpha = 0.14;
    ctx.fillRect(ax, ay + ah * 0.67, aw, ah * 0.33);
    ctx.globalAlpha = 1;
  }

  // Subtle geometric drafting grid lines
  ctx.strokeStyle = p.fg;
  ctx.globalAlpha = 0.07;
  ctx.lineWidth = 1;
  for (let gx = ax + 48; gx < ax + aw; gx += 64) {
    ctx.beginPath();
    ctx.moveTo(gx, ay);
    ctx.lineTo(gx, ay + ah);
    ctx.stroke();
  }
  for (let gy = ay + 48; gy < ay + ah; gy += 64) {
    ctx.beginPath();
    ctx.moveTo(ax, gy);
    ctx.lineTo(ax + aw, gy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // 11 distinct OS architectural art motifs across the 21 plates
  switch (idx % 11) {
    case 0: {
      // Concentric Ring-0 / Sun & Diagonal Hardware Trap Bolt
      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 4.5;
      ctx.setLineDash([14, 10]);
      ctx.beginPath();
      ctx.arc(cx, cy, 215, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(cx, cy, 152, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.secondary;
      ctx.beginPath();
      ctx.arc(cx - 48, cy - 38, 68, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(ax + 70, ay + ah - 70);
      ctx.lineTo(ax + aw - 75, ay + 70);
      ctx.stroke();
      break;
    }
    case 1: {
      // Binary Fork Tree / Branching Process Columns
      ctx.fillStyle = p.secondary;
      ctx.fillRect(ax + 58, ay + 110, 120, 380);
      ctx.fillStyle = p.accent;
      ctx.fillRect(ax + 210, ay + 180, 120, 310);
      ctx.fillStyle = p.pop;
      ctx.fillRect(ax + 362, ay + 85, 120, 405);
      ctx.fillStyle = p.fg;
      ctx.fillRect(ax + 514, ay + 230, 96, 260);

      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(ax + 118, ay + 470);
      ctx.lineTo(ax + 270, ay + 290);
      ctx.lineTo(ax + 422, ay + 165);
      ctx.lineTo(ax + 562, ay + 290);
      ctx.stroke();

      [
        [ax + 118, ay + 185],
        [ax + 270, ay + 290],
        [ax + 422, ay + 165],
        [ax + 562, ay + 290],
      ].forEach(([x, y]) => {
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = p.fg;
        ctx.lineWidth = 4.5;
        ctx.stroke();
      });
      break;
    }
    case 2: {
      // Bold Scheduler / Convoy Monolith + Queued Threads
      ctx.fillStyle = p.fg;
      ctx.fillRect(ax + 52, ay + 115, 305, 365);
      ctx.fillStyle = p.accent;
      ctx.fillRect(ax + 388, ay + 230, 66, 250);
      ctx.fillStyle = p.secondary;
      ctx.fillRect(ax + 474, ay + 285, 66, 195);
      ctx.fillStyle = p.pop;
      ctx.fillRect(ax + 560, ay + 335, 66, 145);

      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(ax + 204, ay + 295, 88, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(ax + 204, ay + 295, 38, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 3: {
      // Exponential Burst Predictor Wave & Target Horizon
      ctx.fillStyle = p.secondary;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.moveTo(ax, ay + ah);
      for (let x = 0; x <= aw; x += 24) {
        const y = cy + Math.sin(x * 0.014) * 110 - x * 0.12;
        ctx.lineTo(ax + x, y);
      }
      ctx.lineTo(ax + aw, ay + ah);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 10;
      ctx.beginPath();
      for (let x = 30; x <= aw - 30; x += 16) {
        const y = cy + 30 + Math.cos(x * 0.018) * 95 * Math.exp(-x / 650);
        if (x === 30) ctx.moveTo(ax + x, y);
        else ctx.lineTo(ax + x, y);
      }
      ctx.stroke();

      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx + 120, cy - 55, 64, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 4: {
      // Preemptive Slicer / Stepped Gantt Terraces
      const bars = [
        { y: 120, x: 60, w: 190, c: p.accent },
        { y: 195, x: 180, w: 260, c: p.secondary },
        { y: 270, x: 110, w: 380, c: p.pop },
        { y: 345, x: 260, w: 310, c: p.fg },
        { y: 420, x: 80, w: 220, c: p.accent },
      ];
      bars.forEach((b) => {
        ctx.fillStyle = b.c;
        ctx.fillRect(ax + b.x, ay + b.y, b.w, 52);
      });
      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(cx, ay + 75);
      ctx.lineTo(cx, ay + ah - 75);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    case 5: {
      // Quantum Dial / Circular Mandala / Dining Philosophers Ring
      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const px = cx + Math.cos(a) * 160;
        const py = cy + Math.sin(a) * 160;
        ctx.strokeStyle = p.fg;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.fillStyle = i % 2 === 0 ? p.accent : p.secondary;
        ctx.beginPath();
        ctx.arc(px, py, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx, cy, 66, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.fg;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 6: {
      // Intersecting Collider Discs & Critical-Section Sanctum
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(cx - 98, cy, 162, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.secondary;
      ctx.globalAlpha = 0.88;
      ctx.beginPath();
      ctx.arc(cx + 98, cy, 162, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = p.fg;
      ctx.fillRect(cx - 64, cy - 132, 128, 264);
      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx, cy, 44, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 7: {
      // Semaphore Gateways & Bounded Buffer Slots
      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 8;
      ctx.strokeRect(cx - 220, cy - 85, 440, 170);
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i < 3 ? p.accent : p.secondary;
        ctx.fillRect(cx - 198 + i * 82, cy - 62, 68, 124);
      }
      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx - 220, cy - 130, 34, 0, Math.PI * 2);
      ctx.arc(cx + 220, cy + 130, 34, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 8: {
      // Resource Allocation Cycle Knot (Deadlock / Banker Matrix)
      const pts = [
        [cx, cy - 165],
        [cx + 175, cy],
        [cx, cy + 165],
        [cx - 175, cy],
      ];
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 9;
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.closePath();
      ctx.stroke();

      pts.forEach(([x, y], i) => {
        ctx.fillStyle = i % 2 === 0 ? p.pop : p.secondary;
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 42, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(x - 38, y - 38, 76, 76);
        }
      });
      ctx.fillStyle = p.fg;
      ctx.beginPath();
      ctx.arc(cx, cy, 46, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 9: {
      // Vault Matrix / Paging Frame Grid & TLB Lookup Beam
      const cols = 4;
      const rows = 4;
      const cell = 88;
      const ox = cx - (cols * cell) / 2;
      const oy = cy - (rows * cell) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = (r + c) % 3 === 0 ? p.accent : (r + c) % 2 === 0 ? p.fg : p.secondary;
          ctx.fillRect(ox + c * cell + 7, oy + r * cell + 7, cell - 14, cell - 14);
        }
      }
      ctx.strokeStyle = p.pop;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(ox, oy + rows * cell);
      ctx.lineTo(ox + cols * cell, oy);
      ctx.stroke();
      break;
    }
    default: {
      // Sweeping Architectural Arch & Magnetic Platter Seek Arm
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(cx, cy + 55, 198, Math.PI, 0);
      ctx.lineTo(cx + 198, cy + 185);
      ctx.lineTo(cx - 198, cy + 185);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx, cy + 55, 122, Math.PI, 0);
      ctx.lineTo(cx + 122, cy + 185);
      ctx.lineTo(cx - 122, cy + 185);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = p.fg;
      ctx.beginPath();
      ctx.arc(cx, cy + 44, 54, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.secondary;
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ax + aw - 65, ay + ah - 65);
      ctx.lineTo(cx + 28, cy + 32);
      ctx.stroke();
      break;
    }
  }

  // Subtle canvas linen micro-weave
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  for (let y = ay; y < ay + ah; y += 4) {
    ctx.fillRect(ax, y, aw, 1);
  }

  // Signature Deck Number watermark top-right
  ctx.fillStyle = p.fg;
  ctx.globalAlpha = 0.78;
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`№ ${deckNumber}`, ax + aw - 22, ay + 42);
  ctx.globalAlpha = 1;

  // Mastered emerald museum seal top-left
  if (mastered) {
    ctx.fillStyle = '#17703C';
    ctx.beginPath();
    ctx.arc(ax + 36, ay + 36, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(ax + 28, ay + 36);
    ctx.lineTo(ax + 34, ay + 42);
    ctx.lineTo(ax + 45, ay + 30);
    ctx.stroke();
  }

  // Subtle title strip along bottom of inner canvas
  ctx.fillStyle = 'rgba(10, 10, 10, 0.34)';
  ctx.fillRect(ax, ay + ah - 42, aw, 42);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(title.toUpperCase().slice(0, 40), ax + 20, ay + ah - 15);

  ctx.restore();

  // Crisp inner mat bevel shadow around artwork
  ctx.strokeStyle = 'rgba(17, 17, 16, 0.24)';
  ctx.lineWidth = 2;
  ctx.strokeRect(ax, ay, aw, ah);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createMuseumPlaqueTexture(deckNumber: string, title: string, chapter: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 168;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F7F6F2';
  ctx.fillRect(0, 0, 384, 168);
  ctx.strokeStyle = 'rgba(17,17,16,0.18)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 380, 164);

  ctx.fillStyle = '#141413';
  ctx.font = '700 24px "Newsreader", Georgia, serif';
  ctx.fillText(`Plate ${deckNumber}`, 22, 46);

  ctx.fillStyle = '#383836';
  ctx.font = 'italic 20px "Newsreader", Georgia, serif';
  const short = title.length > 28 ? `${title.slice(0, 27)}…` : title;
  ctx.fillText(short, 22, 84);

  ctx.fillStyle = '#757570';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.fillText(`${chapter.toUpperCase()} · SILBERSCHATZ 10TH`, 22, 132);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createSectorWallCardTexture(
  sectorIndex: number,
  sectorName: string,
  chapters: string,
  accentHex = '#181816'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 520;
  canvas.height = 650;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#EAE8E1';
  ctx.fillRect(0, 0, 520, 650);
  ctx.fillStyle = accentHex;
  ctx.fillRect(0, 0, 520, 14);
  ctx.strokeStyle = 'rgba(17,17,16,0.15)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 516, 646);

  ctx.fillStyle = '#575652';
  ctx.font = '700 19px "JetBrains Mono", monospace';
  ctx.fillText(`HALL ${String(sectorIndex).padStart(2, '0')} · EXHIBITION`, 44, 96);

  const clean = sectorName.replace(/^Sector \d+:\s*/, '').toUpperCase();
  const words = clean.split(' ');
  ctx.fillStyle = '#141413';
  ctx.font = '800 46px "Syne", sans-serif';
  let y = 180;
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > 430) {
      ctx.fillText(line, 44, y);
      line = word;
      y += 54;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, 44, y);

  ctx.fillStyle = '#4B4A46';
  ctx.font = '600 21px "JetBrains Mono", monospace';
  ctx.fillText(chapters.toUpperCase(), 44, y + 66);

  // Gauntlet CTA badge at bottom
  ctx.fillStyle = '#141413';
  ctx.fillRect(44, 525, 432, 64);
  ctx.fillStyle = accentHex;
  ctx.fillRect(44, 525, 8, 64);
  ctx.fillStyle = '#F7F6F2';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText('LAUNCH SECTOR GAUNTLET →', 72, 564);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createRadialGlowTexture(rgb: string, peakAlpha: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 4, 128, 128, 126);
  grad.addColorStop(0, `rgba(${rgb}, ${peakAlpha})`);
  grad.addColorStop(0.45, `rgba(${rgb}, ${(peakAlpha * 0.46).toFixed(3)})`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Procedural seamless Venetian terrazzo / honed architectural concrete floor
 * with color map + roughness variation map for PBR environment reflections.
 */
export function createTerrazzoFloorTextures(isDark: boolean): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const S = 512;
  const colCanvas = document.createElement('canvas');
  colCanvas.width = S;
  colCanvas.height = S;
  const cctx = colCanvas.getContext('2d')!;

  const rghCanvas = document.createElement('canvas');
  rghCanvas.width = S;
  rghCanvas.height = S;
  const rctx = rghCanvas.getContext('2d')!;

  cctx.fillStyle = isDark ? '#14161B' : '#262930';
  cctx.fillRect(0, 0, S, S);

  rctx.fillStyle = isDark ? '#787878' : '#888888';
  rctx.fillRect(0, 0, S, S);

  // Deterministic mineral terrazzo flecks
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 420; i++) {
    const x = rand() * S;
    const y = rand() * S;
    const r = 1.2 + rand() * 3.2;
    const bright = rand() > 0.45;
    cctx.fillStyle = bright
      ? isDark
        ? 'rgba(255,250,240,0.055)'
        : 'rgba(255,252,244,0.08)'
      : 'rgba(0,0,0,0.14)';
    cctx.beginPath();
    cctx.arc(x, y, r, 0, Math.PI * 2);
    cctx.fill();

    // Polished mineral chips are smoother (darker in roughnessMap)
    rctx.fillStyle = bright ? '#4A4A4A' : '#9C9C9C';
    rctx.beginPath();
    rctx.arc(x, y, r, 0, Math.PI * 2);
    rctx.fill();
  }

  // Architectural 2x2 slab expansion joints
  cctx.strokeStyle = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.085)';
  cctx.lineWidth = 2;
  cctx.strokeRect(1, 1, S - 2, S - 2);
  cctx.beginPath();
  cctx.moveTo(S / 2, 0);
  cctx.lineTo(S / 2, S);
  cctx.moveTo(0, S / 2);
  cctx.lineTo(S, S / 2);
  cctx.stroke();

  rctx.strokeStyle = '#C8C8C8';
  rctx.lineWidth = 3;
  rctx.strokeRect(1, 1, S - 2, S - 2);
  rctx.beginPath();
  rctx.moveTo(S / 2, 0);
  rctx.lineTo(S / 2, S);
  rctx.moveTo(0, S / 2);
  rctx.lineTo(S, S / 2);
  rctx.stroke();

  const map = new THREE.CanvasTexture(colCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 3);
  map.anisotropy = 8;

  const roughnessMap = new THREE.CanvasTexture(rghCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(3, 3);

  return { map, roughnessMap };
}

/**
 * Subtle gallery plaster micro-grain bump texture so grazing spotlights feel architectural.
 */
export function createPlasterBumpTexture(): THREE.CanvasTexture {
  const S = 256;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, S, S);

  let seed = 4242;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 1600; i++) {
    const v = Math.floor(110 + rand() * 36);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(rand() * S, rand() * S, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 3);
  return tex;
}
