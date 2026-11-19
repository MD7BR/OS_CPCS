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
  const w = 640;
  const h = 560;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const p = ART_PALETTES[deckId] || ART_PALETTES.deck_02;

  // Vibrant art canvas background
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle architectural sun/horizon wash
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(255,255,255,0.12)');
  grad.addColorStop(1, 'rgba(0,0,0,0.14)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Crisp Bauhaus / Afro-Modernist geometric artwork unique to each OS module
  ctx.save();
  const idx = Math.max(0, parseInt(deckNumber, 10) - 2);
  const cx = w * 0.5;
  const cy = h * 0.49;

  // Ground plane horizon block on alternating pieces for painterly depth
  if (idx % 2 === 0) {
    ctx.fillStyle = p.fg;
    ctx.globalAlpha = 0.14;
    ctx.fillRect(0, h * 0.68, w, h * 0.32);
    ctx.globalAlpha = 1;
  }

  switch (idx % 7) {
    case 0: {
      // Concentric Ring-0 / Sun & Diagonal Hardware Trap Bolt
      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.arc(cx, cy, 195, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(cx, cy, 138, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.secondary;
      ctx.beginPath();
      ctx.arc(cx - 42, cy - 34, 62, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx, cy, 48, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(90, h - 85);
      ctx.lineTo(w - 95, 85);
      ctx.stroke();
      break;
    }
    case 1: {
      // Binary Fork Tree / Branching Columns
      ctx.fillStyle = p.secondary;
      ctx.fillRect(72, 120, 110, 340);
      ctx.fillStyle = p.accent;
      ctx.fillRect(212, 185, 110, 275);
      ctx.fillStyle = p.pop;
      ctx.fillRect(352, 96, 110, 364);
      ctx.fillStyle = p.fg;
      ctx.fillRect(492, 235, 76, 225);

      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(127, 460);
      ctx.lineTo(267, 290);
      ctx.lineTo(407, 170);
      ctx.lineTo(530, 290);
      ctx.stroke();

      [
        [127, 185],
        [267, 290],
        [407, 170],
        [530, 290],
      ].forEach(([x, y]) => {
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = p.fg;
        ctx.lineWidth = 4;
        ctx.stroke();
      });
      break;
    }
    case 2: {
      // Bold Scheduler / Convoy Monoliths + Floating Sun
      ctx.fillStyle = p.fg;
      ctx.fillRect(62, 130, 275, 320);
      ctx.fillStyle = p.accent;
      ctx.fillRect(360, 240, 56, 210);
      ctx.fillStyle = p.secondary;
      ctx.fillRect(434, 290, 56, 160);
      ctx.fillStyle = p.pop;
      ctx.fillRect(508, 335, 56, 115);

      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(200, 285, 78, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(200, 285, 34, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 3: {
      // Quantum Dial / Circular Mandala / Dining Philosophers Ring
      ctx.strokeStyle = p.fg;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 182, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const px = cx + Math.cos(a) * 145;
        const py = cy + Math.sin(a) * 145;
        ctx.strokeStyle = p.fg;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.fillStyle = i % 2 === 0 ? p.accent : p.secondary;
        ctx.beginPath();
        ctx.arc(px, py, 26, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.fg;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 4: {
      // Intersecting Collider Discs & Synchronization Sanctum
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(cx - 88, cy, 145, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.secondary;
      ctx.globalAlpha = 0.88;
      ctx.beginPath();
      ctx.arc(cx + 88, cy, 145, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = p.fg;
      ctx.fillRect(cx - 58, cy - 115, 116, 230);
      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 5: {
      // Vault Matrix / Paging Grid & Diagonal Beam
      const cols = 4;
      const rows = 4;
      const cell = 78;
      const ox = cx - (cols * cell) / 2;
      const oy = cy - (rows * cell) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = (r + c) % 3 === 0 ? p.accent : (r + c) % 2 === 0 ? p.fg : p.secondary;
          ctx.fillRect(ox + c * cell + 6, oy + r * cell + 6, cell - 12, cell - 12);
        }
      }
      ctx.strokeStyle = p.pop;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(ox, oy + rows * cell);
      ctx.lineTo(ox + cols * cell, oy);
      ctx.stroke();
      break;
    }
    default: {
      // Sweeping Architectural Arch & Head Seek Arm
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(cx, cy + 50, 175, Math.PI, 0);
      ctx.lineTo(cx + 175, cy + 165);
      ctx.lineTo(cx - 175, cy + 165);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = p.pop;
      ctx.beginPath();
      ctx.arc(cx, cy + 50, 108, Math.PI, 0);
      ctx.lineTo(cx + 108, cy + 165);
      ctx.lineTo(cx - 108, cy + 165);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = p.fg;
      ctx.beginPath();
      ctx.arc(cx, cy + 40, 48, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.secondary;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w - 80, h - 75);
      ctx.lineTo(cx + 26, cy + 28);
      ctx.stroke();
      break;
    }
  }
  ctx.restore();

  // Signature Deck Number watermark top-right (painterly corner stamp)
  ctx.fillStyle = p.fg;
  ctx.globalAlpha = 0.72;
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`№ ${deckNumber}`, w - 26, 42);
  ctx.globalAlpha = 1;

  // Mastered wax seal top-left
  if (mastered) {
    ctx.fillStyle = '#17703C';
    ctx.beginPath();
    ctx.arc(38, 36, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(31, 36);
    ctx.lineTo(36, 41);
    ctx.lineTo(46, 30);
    ctx.stroke();
  }

  // Subtle title strip at very bottom edge
  ctx.fillStyle = 'rgba(12, 12, 12, 0.22)';
  ctx.fillRect(0, h - 38, w, 38);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(title.toUpperCase().slice(0, 38), 22, h - 14);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createMuseumPlaqueTexture(deckNumber: string, title: string, chapter: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F7F6F2';
  ctx.fillRect(0, 0, 320, 140);
  ctx.strokeStyle = 'rgba(17,17,16,0.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 318, 138);

  ctx.fillStyle = '#141413';
  ctx.font = '700 20px "Newsreader", Georgia, serif';
  ctx.fillText(`Plate ${deckNumber}`, 18, 38);

  ctx.fillStyle = '#383836';
  ctx.font = 'italic 17px "Newsreader", Georgia, serif';
  const short = title.length > 26 ? `${title.slice(0, 25)}…` : title;
  ctx.fillText(short, 18, 68);

  ctx.fillStyle = '#757570';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillText(`${chapter.toUpperCase()} · SILBERSCHATZ 10TH`, 18, 108);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSectorWallCardTexture(
  sectorIndex: number,
  sectorName: string,
  chapters: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#D9D8D3';
  ctx.fillRect(0, 0, 480, 600);
  ctx.strokeStyle = 'rgba(17,17,16,0.12)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 476, 596);

  ctx.fillStyle = '#575652';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText(`SECTOR ${String(sectorIndex).padStart(2, '0')}`, 42, 104);

  const clean = sectorName.replace(/^Sector \d+:\s*/, '').toUpperCase();
  const words = clean.split(' ');
  ctx.fillStyle = '#181816';
  ctx.font = '800 44px "Syne", sans-serif';
  let y = 185;
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > 395) {
      ctx.fillText(line, 42, y);
      line = word;
      y += 52;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, 42, y);

  ctx.fillStyle = '#5A5954';
  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillText(chapters.toUpperCase(), 42, y + 66);

  ctx.fillStyle = '#181816';
  ctx.fillRect(42, 515, 76, 3);

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
  const grad = ctx.createRadialGradient(128, 128, 6, 128, 128, 126);
  grad.addColorStop(0, `rgba(${rgb}, ${peakAlpha})`);
  grad.addColorStop(0.45, `rgba(${rgb}, ${(peakAlpha * 0.48).toFixed(3)})`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}
