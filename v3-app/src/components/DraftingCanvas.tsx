import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Lock, Maximize2, Minus, Plus, ArrowUpRight } from 'lucide-react';
import { CAPABILITIES, CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { useKernelStore } from '@/store/useKernelStore';
import { Magnet, Squares } from '@/components/reactbits';
import { Button, Pill } from '@/components/ui';

const NODE_W = 204;
const NODE_H = 96;

interface ConduitGeom {
  d: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  junction?: { x: number; y: number };
}

function buildConduitPath(pre: { x: number; y: number }, node: { x: number; y: number }): ConduitGeom {
  const preCy = pre.y + NODE_H / 2;
  const nodeCy = node.y + NODE_H / 2;
  const preCx = pre.x + NODE_W / 2;
  const nodeCx = node.x + NODE_W / 2;

  if (Math.abs(pre.y - node.y) <= 12) {
    const start = { x: pre.x + NODE_W, y: preCy };
    const end = { x: node.x, y: nodeCy };
    return { d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, start, end };
  }

  if (Math.abs(pre.x - node.x) <= 12) {
    const goingDown = node.y > pre.y;
    const start = { x: preCx, y: goingDown ? pre.y + NODE_H : pre.y };
    const end = { x: nodeCx, y: goingDown ? node.y : node.y + NODE_H };
    return { d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, start, end };
  }

  const start = { x: pre.x + NODE_W, y: preCy };
  const end = { x: node.x, y: nodeCy };
  const channelX = Math.round((start.x + end.x) / 2);
  const r = 10;
  const dirY = end.y < start.y ? -1 : 1;
  const d = [
    `M ${start.x} ${start.y}`,
    `L ${channelX - r} ${start.y}`,
    `Q ${channelX} ${start.y} ${channelX} ${start.y + dirY * r}`,
    `L ${channelX} ${end.y - dirY * r}`,
    `Q ${channelX} ${end.y} ${channelX + r} ${end.y}`,
    `L ${end.x} ${end.y}`,
  ].join(' ');
  return { d, start, end, junction: { x: channelX, y: start.y } };
}

function getDefaultView() {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  if (vw <= 640) return { x: 10, y: 74, scale: 0.36 };
  if (vw <= 1024) return { x: 20, y: 48, scale: 0.56 };
  return { x: 36, y: 24, scale: 0.72 };
}

interface DraftingCanvasProps {
  paused: boolean;
  onOpenBossRaid: (sectorId: string) => void;
}

export const DraftingCanvas: React.FC<DraftingCanvasProps> = ({ paused, onOpenBossRaid }) => {
  const { state, openDeck, isNodeUnlocked } = useKernelStore();
  const [view, setView] = useState(getDefaultView);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const touchRef = useRef({
    mode: 'none' as 'none' | 'pan' | 'pinch',
    moved: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    pinchDist: 1,
    pinchScale: 1,
    midWorldX: 0,
    midWorldY: 0,
  });

  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      setView((prev) => ({
        ...prev,
        x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
        y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
      }));
    };
    const onUp = () => {
      dragRef.current.active = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    setView((prev) => ({ ...prev, scale: Math.max(0.3, Math.min(1.8, prev.scale * factor)) }));
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-hud="true"]')) {
      touchRef.current.mode = 'none';
      return;
    }
    const cur = viewRef.current;
    if (e.touches.length === 1) {
      touchRef.current = {
        ...touchRef.current,
        mode: 'pan',
        moved: false,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        origX: cur.x,
        origY: cur.y,
      };
    } else if (e.touches.length === 2 && viewportRef.current) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const rect = viewportRef.current.getBoundingClientRect();
      const midX = (t0.clientX + t1.clientX) * 0.5 - rect.left;
      const midY = (t0.clientY + t1.clientY) * 0.5 - rect.top;
      touchRef.current = {
        ...touchRef.current,
        mode: 'pinch',
        moved: true,
        pinchDist: Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY) || 1,
        pinchScale: cur.scale,
        midWorldX: (midX - cur.x) / cur.scale,
        midWorldY: (midY - cur.y) / cur.scale,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const tr = touchRef.current;
    if (tr.mode === 'pan' && e.touches.length === 1) {
      const dx = e.touches[0].clientX - tr.startX;
      const dy = e.touches[0].clientY - tr.startY;
      if (!tr.moved && Math.hypot(dx, dy) > 6) tr.moved = true;
      if (tr.moved) {
        setView((prev) => ({ ...prev, x: tr.origX + dx, y: tr.origY + dy }));
      }
    } else if (tr.mode === 'pinch' && e.touches.length >= 2 && viewportRef.current) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY) || 1;
      const nextScale = Math.max(0.3, Math.min(1.8, tr.pinchScale * (dist / tr.pinchDist)));
      const rect = viewportRef.current.getBoundingClientRect();
      const midX = (t0.clientX + t1.clientX) * 0.5 - rect.left;
      const midY = (t0.clientY + t1.clientY) * 0.5 - rect.top;
      setView({
        scale: nextScale,
        x: midX - tr.midWorldX * nextScale,
        y: midY - tr.midWorldY * nextScale,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) touchRef.current.mode = 'none';
  };

  const nodeMap = new Map(CURRICULUM_NODES.map((n) => [n.id, n]));
  const capsList = Object.values(CAPABILITIES);
  const isDark = state.theme === 'dark';

  return (
    <div
      ref={viewportRef}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-node="true"]') || target.closest('[data-hud="true"]')) return;
        dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, origX: view.x, origY: view.y };
      }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-full w-full cursor-grab select-none overflow-hidden bg-[var(--shuta-bg)] active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      {/* Subtle Archival Drafting Grid */}
      <Squares
        paused={paused}
        speed={0.08}
        squareSize={48}
        borderColor={isDark ? 'rgba(245, 245, 242, 0.06)' : 'rgba(17, 17, 16, 0.06)'}
        hoverFillColor={isDark ? 'rgba(201, 169, 97, 0.07)' : 'rgba(17, 17, 16, 0.035)'}
      />

      {/* World Drafting Table */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: 2040,
          height: 1360,
          transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          willChange: 'transform',
        }}
      >
        {/* Layer 1: Architectural Sector Plinths */}
        {SECTORS.map((sec) => (
          <div
            key={sec.id}
            className="pointer-events-none absolute z-[5] rounded-[4px]"
            style={{
              left: sec.bounds.x,
              top: sec.bounds.y,
              width: sec.bounds.w,
              height: sec.bounds.h,
              border: '1.5px solid var(--shuta-line-strong)',
              background: isDark ? 'rgba(20, 20, 18, 0.72)' : 'rgba(255, 255, 253, 0.65)',
            }}
          />
        ))}

        {/* Layer 2: Zero-Collision Ink Conduits */}
        <svg className="pointer-events-none absolute inset-0 z-[12] h-full w-full" width={2040} height={1360}>
          {CURRICULUM_NODES.map((node) =>
            node.prerequisites.map((preId) => {
              const pre = nodeMap.get(preId);
              if (!pre) return null;
              const geom = buildConduitPath(pre.mapCoords, node.mapCoords);
              const active = state.masteredNodes.includes(preId) && isNodeUnlocked(node.id);
              const bothMastered = state.masteredNodes.includes(preId) && state.masteredNodes.includes(node.id);
              const stroke = bothMastered
                ? isDark
                  ? '#4CCF7F'
                  : '#17703C'
                : active
                  ? isDark
                    ? '#F5F5F2'
                    : '#111110'
                  : isDark
                    ? 'rgba(245,245,242,0.22)'
                    : 'rgba(17,17,16,0.22)';
              return (
                <g key={`${preId}-${node.id}`}>
                  <path
                    d={geom.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={bothMastered ? 2.4 : active ? 1.8 : 1.3}
                    strokeDasharray={active ? undefined : '5 5'}
                    strokeLinecap="round"
                  />
                  <circle cx={geom.start.x} cy={geom.start.y} r={3.5} fill={stroke} />
                  <circle cx={geom.end.x} cy={geom.end.y} r={3.5} fill={stroke} />
                  {geom.junction && <circle cx={geom.junction.x} cy={geom.junction.y} r={4.5} fill={stroke} />}
                </g>
              );
            })
          )}
        </svg>

        {/* Layer 3: High-Contrast Editorial Sector Header Strips (above vertical passes) */}
        {SECTORS.map((sec, idx) => {
          const bossCleared = state.clearedBosses.includes(sec.id);
          const masteredCount = sec.nodes.filter((id) => state.masteredNodes.includes(id)).length;
          return (
            <div
              key={`${sec.id}-hdr`}
              className="pointer-events-none absolute z-[16] flex items-center justify-between gap-2 overflow-hidden rounded-t-[3px] border-b border-[var(--shuta-line-strong)] bg-[var(--shuta-panel)] px-3 py-2"
              style={{
                left: sec.bounds.x + 1.5,
                top: sec.bounds.y + 1.5,
                width: sec.bounds.w - 3,
              }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 rounded-[2px] bg-[var(--shuta-ink)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--shuta-bg)]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="truncate font-display text-[12px] font-extrabold uppercase tracking-[0.03em] text-[var(--shuta-ink)]">
                  {sec.name.replace(/^Sector \d+:\s*/, '')}
                </span>
                <span className="shrink-0 font-mono text-[9.5px] text-[var(--shuta-dim)]">{sec.bookChapters}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2 font-mono text-[10px]">
                <span className="font-bold text-[var(--shuta-ink)]">
                  {masteredCount}/{sec.nodes.length}
                </span>
                {bossCleared && <span className="font-bold text-[var(--shuta-live)]">✓</span>}
              </div>
            </div>
          );
        })}

        {/* Layer 4: 21 Archival Plate Nodes */}
        {CURRICULUM_NODES.map((node) => {
          const unlocked = isNodeUnlocked(node.id);
          const mastered = state.masteredNodes.includes(node.id);
          const cap = node.unlockedCapability ? CAPABILITIES[node.unlockedCapability] : null;

          return (
            <div
              key={node.id}
              data-node="true"
              className="absolute z-[20]"
              style={{ left: node.mapCoords.x, top: node.mapCoords.y, width: NODE_W }}
            >
              <Magnet padding={14} magnetStrength={6} disabled={!unlocked}>
                <button
                  type="button"
                  onClick={() => openDeck(node.id)}
                  style={{ height: NODE_H }}
                  className={`group flex w-full flex-col justify-between rounded-[3px] border p-3 text-left transition-all ${
                    mastered
                      ? 'border-[var(--shuta-live)] bg-[var(--shuta-card)] shadow-sm hover:border-[var(--shuta-ink)]'
                      : unlocked
                        ? 'border-[var(--shuta-ink)] bg-[var(--shuta-card)] shadow-sm hover:-translate-y-0.5'
                        : 'border-[var(--shuta-line)] bg-[var(--shuta-panel)] opacity-60 hover:opacity-85'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--shuta-dim)]">
                      PLATE {node.deckNumber}
                    </span>
                    {mastered ? (
                      <Check className="h-3.5 w-3.5 text-[var(--shuta-live)]" />
                    ) : !unlocked ? (
                      <Lock className="h-3 w-3 text-[var(--shuta-dim)]" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5 text-[var(--shuta-ink)]" />
                    )}
                  </div>

                  <div className="line-clamp-2 font-display text-[11.5px] font-extrabold uppercase leading-snug text-[var(--shuta-ink)]">
                    {node.shortTitle}
                  </div>

                  <div className="flex items-center justify-between gap-1 font-mono text-[9.5px] text-[var(--shuta-dim)]">
                    <span className="truncate">{node.silberschatz.chapter}</span>
                    {cap && (
                      <span className="shrink-0 rounded-[2px] border border-[var(--shuta-line-strong)] px-1 py-0.5 text-[8.5px] font-bold text-[var(--shuta-ink)]">
                        {cap.badge}
                      </span>
                    )}
                  </div>
                </button>
              </Magnet>
            </div>
          );
        })}
      </div>

      {/* Minimal Top-Left Capabilities Strip */}
      <div
        data-hud="true"
        className="absolute left-4 top-4 z-20 max-w-[calc(100%-15rem)] rounded-[3px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-veil)] p-2.5 backdrop-blur-md"
      >
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="shuta-chrome text-[var(--shuta-dim)]">Capabilities</span>
          <Pill tone="ink">
            {state.capabilities.length}/{capsList.length}
          </Pill>
        </div>
        <div className="flex max-w-[520px] gap-1.5 overflow-x-auto pb-0.5">
          {capsList.map((cap) => {
            const has = state.capabilities.includes(cap.id);
            return (
              <span
                key={cap.id}
                title={`${cap.name}: ${cap.desc}`}
                className={`shrink-0 rounded-[2px] border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] ${
                  has
                    ? 'border-[var(--shuta-ink)] bg-[var(--shuta-ink)] font-bold text-[var(--shuta-bg)]'
                    : 'border-[var(--shuta-line)] text-[var(--shuta-dim)] opacity-60'
                }`}
              >
                {cap.badge}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom-Left Sector Gauntlet Radar */}
      <div
        data-hud="true"
        className="absolute bottom-3 left-3 z-20 rounded-[3px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-veil)] p-2.5 backdrop-blur-md"
        style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mb-1.5 shuta-chrome text-[var(--shuta-dim)]">Sector Gauntlets</div>
        <div className="grid grid-cols-7 gap-1">
          {SECTORS.map((sec, idx) => {
            const cleared = state.clearedBosses.includes(sec.id);
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onOpenBossRaid(sec.id)}
                title={`${sec.name} — Launch Gauntlet`}
                className={`flex h-7 w-7 items-center justify-center rounded-[2px] border font-mono text-[10px] font-bold transition-colors ${
                  cleared
                    ? 'border-[var(--shuta-live)] bg-[var(--shuta-live)] text-[var(--shuta-bg)]'
                    : 'border-[var(--shuta-line-strong)] text-[var(--shuta-ink)] hover:bg-[var(--shuta-ink)] hover:text-[var(--shuta-bg)]'
                }`}
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom-Right Zoom Controls */}
      <div
        data-hud="true"
        className="absolute bottom-3 right-3 z-20 flex items-center gap-1 rounded-[3px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-veil)] p-1.5 backdrop-blur-md"
        style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
      >
        <Button size="icon" variant="outline" onClick={() => setView((v) => ({ ...v, scale: Math.max(0.3, v.scale * 0.85) }))}>
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-10 text-center font-mono text-[10px] text-[var(--shuta-dim)]">
          {Math.round(view.scale * 100)}%
        </span>
        <Button size="icon" variant="outline" onClick={() => setView((v) => ({ ...v, scale: Math.min(1.8, v.scale * 1.15) }))}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="ink" onClick={() => setView(getDefaultView())} title="Center Canvas">
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
