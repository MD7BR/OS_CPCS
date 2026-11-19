import React from 'react';

interface PosterPalette {
  bg: string;
  fg: string;
  accent: string;
  secondary: string;
}

const POSTER_PALETTES: Record<string, PosterPalette> = {
  deck_02: { bg: '#EFECE3', fg: '#151412', accent: '#D94E1F', secondary: '#C9A048' },
  deck_03: { bg: '#162844', fg: '#F3EFE6', accent: '#E5A93C', secondary: '#4A8FE7' },
  deck_04: { bg: '#EFECE3', fg: '#141413', accent: '#C72C2C', secondary: '#8E8A80' },
  deck_05: { bg: '#181715', fg: '#F4EFE4', accent: '#E5A93C', secondary: '#7D796F' },
  deck_06: { bg: '#153F32', fg: '#F2EDE2', accent: '#E57A3C', secondary: '#52B788' },
  deck_07: { bg: '#F2ECE1', fg: '#1D1814', accent: '#A84420', secondary: '#D9A036' },
  deck_08: { bg: '#1B2D4F', fg: '#F4F1EA', accent: '#E04F26', secondary: '#6BA3D6' },
  deck_09: { bg: '#F1ECE3', fg: '#141413', accent: '#B8292F', secondary: '#214F8A' },
  deck_10: { bg: '#151513', fg: '#F2EFE8', accent: '#3CA370', secondary: '#D4A34A' },
  deck_11: { bg: '#0F453B', fg: '#F4F0E6', accent: '#E5A93C', secondary: '#5AC4A8' },
  deck_12: { bg: '#2B1B3D', fg: '#F5EFE6', accent: '#DE6439', secondary: '#B08CE0' },
  deck_13: { bg: '#F3EFE6', fg: '#151412', accent: '#B91C1C', secondary: '#5A5852' },
  deck_14: { bg: '#183639', fg: '#F4EFE4', accent: '#D9A441', secondary: '#56A3A6' },
  deck_15: { bg: '#181615', fg: '#F3EFE6', accent: '#D63838', secondary: '#9E998E' },
  deck_16: { bg: '#262040', fg: '#F4EFE6', accent: '#E5B248', secondary: '#8E7CC3' },
  deck_17: { bg: '#153152', fg: '#F3F0E8', accent: '#38B287', secondary: '#E0A441' },
  deck_18: { bg: '#5C1E2E', fg: '#F5EFE6', accent: '#E8B14A', secondary: '#D96B78' },
  deck_19: { bg: '#171716', fg: '#F2EFE8', accent: '#D9532F', secondary: '#C9A961' },
  deck_20: { bg: '#1B4431', fg: '#F3EFE4', accent: '#E0A63A', secondary: '#67B892' },
  deck_21: { bg: '#F1EDE3', fg: '#182438', accent: '#DF622C', secondary: '#2A5B94' },
  deck_22: { bg: '#131312', fg: '#F4F1EA', accent: '#C9A961', secondary: '#6B6962' },
};

function renderArtMotif(deckId: string, p: PosterPalette) {
  switch (deckId) {
    case 'deck_02': // Dual-Mode Concentric Rings + Hardware Trap Slash
      return (
        <>
          <circle cx="250" cy="330" r="175" fill="none" stroke={p.fg} strokeWidth="3" strokeDasharray="8 8" />
          <circle cx="250" cy="330" r="120" fill={p.accent} />
          <circle cx="250" cy="330" r="56" fill={p.bg} />
          <circle cx="250" cy="330" r="22" fill={p.fg} />
          <line x1="75" y1="510" x2="425" y2="150" stroke={p.fg} strokeWidth="6" />
          <polygon points="425,150 385,158 417,190" fill={p.fg} />
          <rect x="64" y="540" width="372" height="2" fill={p.fg} opacity="0.4" />
          <circle cx="110" cy="180" r="14" fill={p.secondary} />
        </>
      );
    case 'deck_03': // Binary Fork Tree & Thread Loom
      return (
        <>
          <line x1="250" y1="530" x2="250" y2="410" stroke={p.fg} strokeWidth="4" />
          <line x1="250" y1="410" x2="150" y2="300" stroke={p.accent} strokeWidth="3.5" />
          <line x1="250" y1="410" x2="350" y2="300" stroke={p.accent} strokeWidth="3.5" />
          <line x1="150" y1="300" x2="100" y2="190" stroke={p.secondary} strokeWidth="2.5" />
          <line x1="150" y1="300" x2="200" y2="190" stroke={p.secondary} strokeWidth="2.5" />
          <line x1="350" y1="300" x2="300" y2="190" stroke={p.secondary} strokeWidth="2.5" />
          <line x1="350" y1="300" x2="400" y2="190" stroke={p.secondary} strokeWidth="2.5" />
          {[100, 200, 300, 400].map((x) => (
            <circle key={x} cx={x} cy="190" r="18" fill={p.fg} />
          ))}
          <circle cx="150" cy="300" r="24" fill={p.accent} />
          <circle cx="350" cy="300" r="24" fill={p.accent} />
          <circle cx="250" cy="410" r="32" fill={p.fg} />
          <rect x="195" y="520" width="110" height="36" fill={p.accent} />
        </>
      );
    case 'deck_04': // FCFS Convoy Effect Monolith
      return (
        <>
          <rect x="58" y="185" width="230" height="300" fill={p.fg} />
          <rect x="308" y="345" width="32" height="140" fill={p.accent} />
          <rect x="354" y="385" width="32" height="100" fill={p.accent} />
          <rect x="400" y="425" width="32" height="60" fill={p.accent} />
          <line x1="58" y1="518" x2="432" y2="518" stroke={p.fg} strokeWidth="3" />
          <circle cx="173" cy="335" r="56" fill={p.bg} />
          <circle cx="173" cy="335" r="24" fill={p.accent} />
        </>
      );
    case 'deck_05': // SJF Ascending Bars + Exponential Smoothing Curve
      return (
        <>
          <rect x="74" y="460" width="54" height="75" fill={p.secondary} opacity="0.55" />
          <rect x="150" y="390" width="54" height="145" fill={p.secondary} opacity="0.7" />
          <rect x="226" y="305" width="54" height="230" fill={p.fg} opacity="0.88" />
          <rect x="302" y="210" width="54" height="325" fill={p.accent} />
          <rect x="378" y="155" width="54" height="380" fill={p.fg} />
          <path
            d="M 66 490 C 170 465, 250 320, 434 155"
            fill="none"
            stroke={p.accent}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="434" cy="155" r="11" fill={p.accent} />
        </>
      );
    case 'deck_06': // SRTF Preemptive Sliced Prisms
      return (
        <>
          <rect x="90" y="160" width="320" height="58" fill={p.fg} />
          <rect x="145" y="238" width="210" height="58" fill={p.accent} />
          <rect x="195" y="316" width="110" height="58" fill={p.secondary} />
          <rect x="145" y="394" width="210" height="58" fill={p.fg} opacity="0.85" />
          <rect x="90" y="472" width="320" height="58" fill={p.accent} opacity="0.75" />
          <line x1="250" y1="125" x2="250" y2="565" stroke={p.fg} strokeWidth="2" strokeDasharray="6 6" />
        </>
      );
    case 'deck_07': // Priority Tiers + Aging Upward Escalation Vector
      return (
        <>
          <polygon points="250,150 420,490 80,490" fill="none" stroke={p.fg} strokeWidth="3.5" />
          <line x1="193" y1="265" x2="307" y2="265" stroke={p.fg} strokeWidth="2.5" />
          <line x1="138" y1="378" x2="362" y2="378" stroke={p.fg} strokeWidth="2.5" />
          <polygon points="250,150 307,265 193,265" fill={p.accent} />
          <line x1="250" y1="540" x2="250" y2="220" stroke={p.secondary} strokeWidth="7" />
          <polygon points="250,198 228,236 272,236" fill={p.secondary} />
          <circle cx="250" cy="540" r="14" fill={p.fg} />
        </>
      );
    case 'deck_08': // Round Robin Circular Quantum Dial
      return (
        <>
          <circle cx="250" cy="340" r="170" fill="none" stroke={p.fg} strokeWidth="3" />
          <circle cx="250" cy="340" r="110" fill="none" stroke={p.secondary} strokeWidth="2" strokeDasharray="6 6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={250 + Math.cos(rad) * 110}
                y1={340 + Math.sin(rad) * 110}
                x2={250 + Math.cos(rad) * 170}
                y2={340 + Math.sin(rad) * 170}
                stroke={p.fg}
                strokeWidth="2.5"
              />
            );
          })}
          <path d="M 250 340 L 250 170 A 170 170 0 0 1 370 220 Z" fill={p.accent} />
          <circle cx="250" cy="340" r="46" fill={p.bg} stroke={p.fg} strokeWidth="3" />
          <circle cx="250" cy="340" r="14" fill={p.accent} />
        </>
      );
    case 'deck_09': // Race Condition Collider (Overlapping Moire Discs)
      return (
        <>
          <circle cx="190" cy="340" r="135" fill={p.accent} opacity="0.88" />
          <circle cx="310" cy="340" r="135" fill={p.secondary} opacity="0.82" />
          <path d="M 250 220 A 135 135 0 0 1 250 460 A 135 135 0 0 1 250 220 Z" fill={p.fg} />
          <line x1="65" y1="340" x2="435" y2="340" stroke={p.bg} strokeWidth="3" strokeDasharray="10 6" />
        </>
      );
    case 'deck_10': // Critical Section Interlocking Gates
      return (
        <>
          <rect x="70" y="170" width="160" height="340" fill="none" stroke={p.fg} strokeWidth="4" />
          <rect x="270" y="170" width="160" height="340" fill="none" stroke={p.fg} strokeWidth="4" />
          <rect x="165" y="255" width="170" height="170" fill={p.accent} />
          <rect x="208" y="298" width="84" height="84" fill={p.bg} />
          <circle cx="250" cy="340" r="18" fill={p.secondary} />
        </>
      );
    case 'deck_11': // Semaphores & Circular Bounded Buffer
      return (
        <>
          <circle cx="250" cy="340" r="158" fill="none" stroke={p.fg} strokeWidth="2.5" opacity="0.35" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const rad = (i * Math.PI) / 4 - Math.PI / 2;
            const cx = 250 + Math.cos(rad) * 158;
            const cy = 340 + Math.sin(rad) * 158;
            const filled = i < 5;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="26"
                fill={filled ? (i === 0 ? p.accent : p.secondary) : p.bg}
                stroke={p.fg}
                strokeWidth="3"
              />
            );
          })}
          <rect x="208" y="298" width="84" height="84" rx="42" fill={p.accent} />
          <rect x="235" y="325" width="30" height="30" fill={p.bg} />
        </>
      );
    case 'deck_12': // Dining Philosophers Pentagonal Mandala
      return (
        <>
          <circle cx="250" cy="345" r="95" fill={p.fg} opacity="0.12" stroke={p.fg} strokeWidth="2.5" />
          {[0, 1, 2, 3, 4].map((i) => {
            const rad = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const px = 250 + Math.cos(rad) * 165;
            const py = 345 + Math.sin(rad) * 165;
            const stickRad = rad + Math.PI / 5;
            const sx1 = 250 + Math.cos(stickRad) * 65;
            const sy1 = 345 + Math.sin(stickRad) * 65;
            const sx2 = 250 + Math.cos(stickRad) * 145;
            const sy2 = 345 + Math.sin(stickRad) * 145;
            return (
              <g key={i}>
                <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={p.accent} strokeWidth="5" strokeLinecap="round" />
                <circle cx={px} cy={py} r="28" fill={i % 2 === 0 ? p.fg : p.secondary} />
              </g>
            );
          })}
          <circle cx="250" cy="345" r="24" fill={p.accent} />
        </>
      );
    case 'deck_13': // Coffman 4-Condition Deadlock Cycle
      return (
        <>
          <rect x="110" y="190" width="90" height="90" fill={p.fg} />
          <rect x="300" y="190" width="90" height="90" fill={p.accent} />
          <rect x="300" y="380" width="90" height="90" fill={p.fg} />
          <rect x="110" y="380" width="90" height="90" fill={p.accent} />
          <path
            d="M 200 235 L 300 235 M 345 280 L 345 380 M 300 425 L 200 425 M 155 380 L 155 280"
            stroke={p.accent}
            strokeWidth="7"
          />
          <circle cx="250" cy="330" r="34" fill={p.bg} stroke={p.fg} strokeWidth="4" />
          <line x1="232" y1="312" x2="268" y2="348" stroke={p.accent} strokeWidth="5" />
          <line x1="268" y1="312" x2="232" y2="348" stroke={p.accent} strokeWidth="5" />
        </>
      );
    case 'deck_14': // Banker's Vault & Safe Sequence Staircase
      return (
        <>
          {[0, 1, 2, 3, 4].map((row) => (
            <g key={row}>
              <rect x="75" y={175 + row * 70} width={90 + row * 62} height="48" fill={row === 4 ? p.accent : p.fg} opacity={0.3 + row * 0.16} />
              <circle cx={140 + row * 62} cy={199 + row * 70} r="10" fill={p.accent} />
            </g>
          ))}
          <polyline
            points="140,199 202,269 264,339 326,409 388,479"
            fill="none"
            stroke={p.accent}
            strokeWidth="4"
          />
        </>
      );
    case 'deck_15': // Wait-For Cycle + Recovery Slash
      return (
        <>
          <polygon points="250,165 405,465 95,465" fill="none" stroke={p.fg} strokeWidth="4" />
          <circle cx="250" cy="165" r="28" fill={p.fg} />
          <circle cx="405" cy="465" r="28" fill={p.fg} />
          <circle cx="95" cy="465" r="28" fill={p.accent} />
          <line x1="70" y1="260" x2="430" y2="410" stroke={p.accent} strokeWidth="8" />
          <circle cx="250" cy="355" r="20" fill={p.bg} stroke={p.accent} strokeWidth="4" />
        </>
      );
    case 'deck_16': // Contiguous Memory Holes & Compaction
      return (
        <>
          <rect x="85" y="155" width="135" height="380" fill="none" stroke={p.fg} strokeWidth="3" />
          <rect x="85" y="155" width="135" height="82" fill={p.fg} />
          <rect x="85" y="270" width="135" height="65" fill={p.secondary} />
          <rect x="85" y="385" width="135" height="90" fill={p.accent} />

          <rect x="280" y="155" width="135" height="380" fill="none" stroke={p.fg} strokeWidth="3" />
          <rect x="280" y="155" width="135" height="82" fill={p.fg} />
          <rect x="280" y="237" width="135" height="65" fill={p.secondary} />
          <rect x="280" y="302" width="135" height="90" fill={p.accent} />
          <line x1="230" y1="345" x2="270" y2="345" stroke={p.accent} strokeWidth="4" />
        </>
      );
    case 'deck_17': // Paging Frame Grid & TLB Associative Beams
      return (
        <>
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x="65" y={175 + r * 85} width="110" height="62" fill={r === 1 ? p.accent : p.fg} opacity={r === 1 ? 1 : 0.85} />
              <rect x="325" y={175 + r * 85} width="110" height="62" fill={r === 2 ? p.secondary : p.fg} opacity={r === 2 ? 1 : 0.35} />
            </g>
          ))}
          <line x1="175" y1="206" x2="325" y2="291" stroke={p.fg} strokeWidth="2.5" opacity="0.5" />
          <line x1="175" y1="291" x2="325" y2="376" stroke={p.accent} strokeWidth="5" />
          <line x1="175" y1="376" x2="325" y2="206" stroke={p.secondary} strokeWidth="3" />
          <circle cx="250" cy="334" r="24" fill={p.accent} />
        </>
      );
    case 'deck_18': // Virtual Memory & Belady's Paradoxical Spike
      return (
        <>
          {[140, 210, 180, 270, 340, 290, 390].map((h, i) => (
            <rect
              key={i}
              x={64 + i * 54}
              y={530 - h}
              width="38"
              height={h}
              fill={i === 6 ? p.accent : i % 2 === 0 ? p.fg : p.secondary}
            />
          ))}
          <line x1="64" y1="260" x2="436" y2="260" stroke={p.accent} strokeWidth="3" strokeDasharray="8 6" />
        </>
      );
    case 'deck_19': // Disk Platter & Seek Arm
      return (
        <>
          <circle cx="250" cy="330" r="180" fill="none" stroke={p.fg} strokeWidth="2.5" />
          <circle cx="250" cy="330" r="142" fill="none" stroke={p.fg} strokeWidth="1.5" opacity="0.55" />
          <circle cx="250" cy="330" r="104" fill="none" stroke={p.secondary} strokeWidth="2.5" />
          <circle cx="250" cy="330" r="66" fill="none" stroke={p.fg} strokeWidth="1.5" opacity="0.55" />
          <circle cx="250" cy="330" r="26" fill={p.fg} />
          <line x1="415" y1="530" x2="288" y2="296" stroke={p.accent} strokeWidth="12" strokeLinecap="round" />
          <circle cx="415" cy="530" r="22" fill={p.secondary} />
          <circle cx="288" cy="296" r="12" fill={p.fg} />
        </>
      );
    case 'deck_20': // Inode & Indexed Block Constellation
      return (
        <>
          <rect x="85" y="160" width="330" height="72" fill={p.accent} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <line x1={126 + i * 82} y1="232" x2={126 + i * 82} y2="335" stroke={p.fg} strokeWidth="3" />
              <rect x={96 + i * 82} y="335" width="60" height="60" fill={i === 3 ? p.secondary : p.fg} />
            </g>
          ))}
          <line x1="372" y1="395" x2="290" y2="475" stroke={p.accent} strokeWidth="3" />
          <line x1="372" y1="395" x2="372" y2="475" stroke={p.accent} strokeWidth="3" />
          <line x1="372" y1="395" x2="430" y2="475" stroke={p.accent} strokeWidth="3" />
          <circle cx="290" cy="485" r="20" fill={p.fg} />
          <circle cx="372" cy="485" r="20" fill={p.accent} />
          <circle cx="430" cy="485" r="20" fill={p.secondary} />
        </>
      );
    case 'deck_21': // I/O Bus & Direct DMA Bypass Bridge
      return (
        <>
          <circle cx="250" cy="220" r="68" fill="none" stroke={p.fg} strokeWidth="4" />
          <circle cx="250" cy="220" r="24" fill={p.fg} />
          <rect x="65" y="420" width="110" height="90" fill={p.secondary} />
          <rect x="325" y="420" width="110" height="90" fill={p.fg} />
          <path d="M 175 465 C 215 395, 285 395, 325 465" fill="none" stroke={p.accent} strokeWidth="10" strokeLinecap="round" />
          <line x1="65" y1="365" x2="435" y2="365" stroke={p.fg} strokeWidth="2.5" strokeDasharray="8 6" />
        </>
      );
    default: // deck_22: Citadel Access Matrix Crest
      return (
        <>
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={94 + c * 80}
                y={170 + r * 80}
                width="72"
                height="72"
                fill={(r + c) % 2 === 0 ? p.fg : p.secondary}
                opacity={(r + c) % 2 === 0 ? 0.92 : 0.25}
              />
            ))
          )}
          <polygon points="250,235 335,280 320,385 250,435 180,385 165,280" fill={p.accent} stroke={p.bg} strokeWidth="6" />
          <circle cx="250" cy="332" r="24" fill={p.bg} />
        </>
      );
  }
}

export const DeckPosterArt: React.FC<{
  deckId: string;
  deckNumber: string;
  chapter: string;
  mastered?: boolean;
  className?: string;
}> = ({ deckId, deckNumber, chapter, mastered, className }) => {
  const p = POSTER_PALETTES[deckId] || POSTER_PALETTES.deck_02;

  return (
    <svg
      viewBox="0 0 500 700"
      className={className}
      role="img"
      aria-label={`Archival OS Poster ${deckNumber}`}
    >
      <rect width="500" height="700" fill={p.bg} />
      {/* Subtle Inner Lithograph Frame */}
      <rect x="26" y="26" width="448" height="648" fill="none" stroke={p.fg} strokeWidth="1.5" opacity="0.22" />

      {/* Top Print Index Chrome */}
      <text
        x="48"
        y="76"
        fill={p.fg}
        opacity="0.72"
        fontFamily="JetBrains Mono, monospace"
        fontSize="20"
        fontWeight="700"
        letterSpacing="4"
      >
        № {deckNumber}
      </text>
      <text
        x="452"
        y="76"
        textAnchor="end"
        fill={p.fg}
        opacity="0.55"
        fontFamily="JetBrains Mono, monospace"
        fontSize="16"
        letterSpacing="2.5"
      >
        {chapter.toUpperCase()}
      </text>
      <line x1="48" y1="96" x2="452" y2="96" stroke={p.fg} strokeWidth="1.5" opacity="0.22" />

      {/* Bespoke Geometric OS Artwork */}
      {renderArtMotif(deckId, p)}

      {/* Bottom Lithograph Colophon */}
      <line x1="48" y1="604" x2="452" y2="604" stroke={p.fg} strokeWidth="1.5" opacity="0.22" />
      <text
        x="48"
        y="642"
        fill={p.fg}
        opacity="0.62"
        fontFamily="JetBrains Mono, monospace"
        fontSize="15"
        letterSpacing="3"
      >
        SILBERSCHATZ · 10TH ED.
      </text>
      {mastered && (
        <g transform="translate(432, 636)">
          <circle r="14" fill={p.accent} />
          <path d="M -6 0 L -1.5 4.5 L 7 -5" fill="none" stroke={p.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};
