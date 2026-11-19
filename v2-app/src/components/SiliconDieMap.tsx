import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Lock, Maximize2, Minus, Plus, Swords, CheckCircle2, Sparkles } from 'lucide-react';
import { CAPABILITIES, CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { useKernelStore } from '@/store/useKernelStore';
import { Magnet, ShinyText, Squares, StarBorder } from '@/components/reactbits';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function getDefaultView() {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  if (vw <= 640) return { x: 14, y: 78, scale: 0.42 };
  if (vw <= 1024) return { x: 24, y: 52, scale: 0.6 };
  return { x: 40, y: 24, scale: 0.78 };
}

interface SiliconDieMapProps {
  paused: boolean;
  onOpenBossRaid: (sectorId: string) => void;
}

export const SiliconDieMap: React.FC<SiliconDieMapProps> = ({ paused, onOpenBossRaid }) => {
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
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      setView((prev) => ({
        ...prev,
        x: dragRef.current.origX + (e.clientX - dragRef.current.startX),
        y: dragRef.current.origY + (e.clientY - dragRef.current.startY),
      }));
    };
    const onMouseUp = () => {
      dragRef.current.active = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
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
    if (e.touches.length === 0) {
      touchRef.current.mode = 'none';
    }
  };

  const nodeMap = new Map(CURRICULUM_NODES.map((n) => [n.id, n]));
  const capsList = Object.values(CAPABILITIES);

  return (
    <div
      ref={viewportRef}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-node="true"]') || target.closest('[data-hud="true"]')) return;
        dragRef.current = {
          active: true,
          startX: e.clientX,
          startY: e.clientY,
          origX: view.x,
          origY: view.y,
        };
      }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-full w-full cursor-grab select-none overflow-hidden bg-background active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      {/* ReactBits <Squares /> Hardware Wafer Substrate (Paused automatically when Workbench opens) */}
      <Squares
        paused={paused}
        speed={0.18}
        squareSize={44}
        borderColor="rgba(30, 41, 59, 0.45)"
        hoverFillColor="rgba(0, 240, 255, 0.06)"
      />

      {/* Die World Canvas */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: 1920,
          height: 1320,
          transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          willChange: 'transform',
        }}
      >
        {/* Sector Silicon Regions */}
        {SECTORS.map((sec) => {
          const bossCleared = state.clearedBosses.includes(sec.id);
          return (
            <div
              key={sec.id}
              className="pointer-events-none absolute rounded-lg border border-dashed"
              style={{
                left: sec.bounds.x,
                top: sec.bounds.y,
                width: sec.bounds.w,
                height: sec.bounds.h,
                borderColor: `${sec.color}44`,
                background: `${sec.color}08`,
              }}
            >
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="font-display text-[11px] font-bold uppercase tracking-widest" style={{ color: sec.color }}>
                  {sec.name} · {sec.bookChapters}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {sec.hex} {bossCleared ? '· ✓ BOSS CLEARED' : ''}
                </span>
              </div>
            </div>
          );
        })}

        {/* Orthogonal SVG Bus Conduits */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" width={1920} height={1320}>
          {CURRICULUM_NODES.map((node) =>
            node.prerequisites.map((preId) => {
              const pre = nodeMap.get(preId);
              if (!pre) return null;
              const x1 = pre.mapCoords.x + 96;
              const y1 = pre.mapCoords.y + 42;
              const x2 = node.mapCoords.x + 96;
              const y2 = node.mapCoords.y + 42;
              const midX = (x1 + x2) / 2;
              const active = state.masteredNodes.includes(preId) && isNodeUnlocked(node.id);
              const bothMastered = state.masteredNodes.includes(preId) && state.masteredNodes.includes(node.id);
              const stroke = bothMastered ? '#00FFA3' : active ? '#00F0FF' : 'rgba(148,163,184,0.22)';
              return (
                <path
                  key={`${preId}-${node.id}`}
                  d={`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={bothMastered ? 2.5 : active ? 2 : 1.5}
                  strokeDasharray={active ? undefined : '5 5'}
                />
              );
            })
          )}
        </svg>

        {/* 21 IC Chip Nodes wrapped in ReactBits <Magnet /> + <StarBorder /> */}
        {CURRICULUM_NODES.map((node) => {
          const sec = SECTORS.find((s) => s.id === node.sector);
          const unlocked = isNodeUnlocked(node.id);
          const mastered = state.masteredNodes.includes(node.id);
          const isCurrent = state.lastDeckId === node.id || (!state.lastDeckId && node.id === 'deck_02');
          const cap = node.unlockedCapability ? CAPABILITIES[node.unlockedCapability] : null;

          return (
            <div
              key={node.id}
              data-node="true"
              className="absolute"
              style={{ left: node.mapCoords.x, top: node.mapCoords.y, width: 196 }}
            >
              <Magnet padding={16} magnetStrength={5} disabled={!unlocked}>
                <StarBorder
                  active={isCurrent || (unlocked && !mastered)}
                  color={mastered ? '#00FFA3' : sec?.color || '#00F0FF'}
                  speed="4.2s"
                >
                  <button
                    type="button"
                    onClick={() => openDeck(node.id)}
                    className={`bezel-card flex w-full flex-col gap-1.5 rounded-[7px] border p-3 text-left transition-all ${
                      mastered
                        ? 'border-accent/60 bg-card hover:border-accent'
                        : unlocked
                          ? 'border-primary/45 bg-card hover:border-primary'
                          : 'border-border/70 bg-card/75 opacity-60 hover:opacity-85'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="font-mono text-[10px] font-bold tracking-wider"
                        style={{ color: mastered ? 'var(--color-emerald)' : sec?.color }}
                      >
                        DECK {node.deckNumber}
                      </span>
                      {mastered ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                      ) : !unlocked ? (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <Sparkles className="h-3 w-3 text-primary" />
                      )}
                    </div>

                    <div className="line-clamp-2 font-display text-xs font-bold leading-snug text-foreground">
                      {node.shortTitle}
                    </div>

                    <div className="flex items-center justify-between gap-1 font-mono text-[9.5px] text-muted-foreground">
                      <span className="truncate">{node.silberschatz.chapter}</span>
                      {cap && (
                        <span className="shrink-0 rounded bg-primary/15 px-1 py-0.5 text-[9px] font-bold text-primary">
                          {cap.icon} {cap.badge}
                        </span>
                      )}
                    </div>
                  </button>
                </StarBorder>
              </Magnet>
            </div>
          );
        })}
      </div>

      {/* Floating Top-Left HUD: Kernel Capabilities */}
      <div
        data-hud="true"
        className="absolute left-3 top-3 z-20 max-w-[calc(100%-1.5rem)] rounded-lg border border-border bg-popover/95 p-2.5 shadow-xl backdrop-blur-sm"
      >
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Kernel Capabilities
          </span>
          <Badge variant="default">
            {state.capabilities.length} / {capsList.length}
          </Badge>
        </div>
        <div className="flex max-w-[540px] gap-1.5 overflow-x-auto pb-0.5">
          {capsList.map((cap) => {
            const has = state.capabilities.includes(cap.id);
            return (
              <div
                key={cap.id}
                title={`${cap.name}: ${cap.desc}`}
                className={`flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] ${
                  has
                    ? 'border-primary/50 bg-primary/15 text-primary'
                    : 'border-border bg-muted/50 text-muted-foreground opacity-55'
                }`}
              >
                <span>{cap.icon}</span>
                {has ? <ShinyText text={cap.badge} className="font-bold" /> : <span>{cap.badge}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom-Left HUD: Sector Radar Matrix (Boss Gauntlet Launcher) */}
      <div
        data-hud="true"
        className="absolute bottom-3 left-3 z-20 rounded-lg border border-border bg-popover/95 p-2.5 shadow-xl backdrop-blur-sm"
        style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mb-1.5 flex items-center gap-1.5 font-display text-[9.5px] font-bold uppercase tracking-widest text-muted-foreground">
          <Swords className="h-3 w-3 text-destructive" />
          Sector Boss Radar
        </div>
        <div className="grid grid-cols-7 gap-1">
          {SECTORS.map((sec, idx) => {
            const cleared = state.clearedBosses.includes(sec.id);
            const allMastered = sec.nodes.every((id) => state.masteredNodes.includes(id));
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onOpenBossRaid(sec.id)}
                title={`${sec.name} — Click to launch Boss Gauntlet`}
                className={`flex h-7 w-7 items-center justify-center rounded border font-mono text-[10px] font-bold transition-transform hover:scale-110 ${
                  cleared
                    ? 'border-accent bg-accent/20 text-accent'
                    : allMastered
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border bg-muted text-muted-foreground hover:border-primary'
                }`}
              >
                S{idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom-Right HUD: Zoom Controls */}
      <div
        data-hud="true"
        className="absolute bottom-3 right-3 z-20 flex items-center gap-1 rounded-lg border border-border bg-popover/95 p-1.5 shadow-xl backdrop-blur-sm"
        style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
      >
        <Button
          size="icon"
          variant="secondary"
          title="Zoom Out"
          onClick={() => setView((v) => ({ ...v, scale: Math.max(0.3, v.scale * 0.85) }))}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-10 text-center font-mono text-[10px] text-muted-foreground">
          {Math.round(view.scale * 100)}%
        </span>
        <Button
          size="icon"
          variant="secondary"
          title="Zoom In"
          onClick={() => setView((v) => ({ ...v, scale: Math.min(1.8, v.scale * 1.15) }))}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="cyber"
          title="Reset Map View"
          onClick={() => setView(getDefaultView())}
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
