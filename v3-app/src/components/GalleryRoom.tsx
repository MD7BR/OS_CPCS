import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { useKernelStore } from '@/store/useKernelStore';
import { DeckPosterArt } from './DeckPosterArt';

interface GalleryRoomProps {
  paused: boolean;
  onActiveIndexChange?: (idx: number) => void;
}

// Curated editorial hanging heights (in px from wire) so the gallery breathes like a physical print exhibition
const HANG_DROPS = [34, 62, 24, 54, 40, 70, 28, 56, 36, 66, 30, 52, 42, 64, 26, 58, 38, 68, 32, 54, 44];

export const GalleryRoom: React.FC<GalleryRoomProps> = ({ paused, onActiveIndexChange }) => {
  const { state, openDeck } = useKernelStore();

  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Physics state stored in refs for zero-re-render 60fps inertial gliding
  const phys = useRef({
    targetX: 0,
    currentX: 0,
    velocity: 0,
    isDragging: false,
    dragStartX: 0,
    dragOriginTarget: 0,
    dragDistance: 0,
    maxScroll: 3000,
    cardStep: 330,
    lastReportedIdx: 0,
  });

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [centeredIdx, setCenteredIdx] = useState(0);

  const computeBounds = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const vw = stage.clientWidth;
    const cardW = vw < 640 ? 228 : vw < 1024 ? 268 : 292;
    const gap = vw < 640 ? 34 : 62;
    const step = cardW + gap;
    const totalW = CURRICULUM_NODES.length * step - gap;
    const max = Math.max(0, totalW - vw + (vw < 640 ? 80 : Math.round(vw * 0.48)));
    phys.current.cardStep = step;
    phys.current.maxScroll = max;
    phys.current.targetX = Math.max(0, Math.min(max, phys.current.targetX));
  }, []);

  useEffect(() => {
    computeBounds();
    window.addEventListener('resize', computeBounds);
    return () => window.removeEventListener('resize', computeBounds);
  }, [computeBounds]);

  // Smooth 60fps inertial spring + pendulum tilt loop
  useEffect(() => {
    if (paused) return;
    let raf = 0;

    const tick = () => {
      const p = phys.current;
      const prev = p.currentX;
      p.currentX += (p.targetX - p.currentX) * 0.11;
      const v = p.currentX - prev;
      p.velocity = p.velocity * 0.8 + v * 0.2;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-p.currentX.toFixed(2)}px, 0, 0)`;
      }

      // Apply subtle physical pendulum sway proportional to wire glide velocity
      const swayDeg = Math.max(-5.5, Math.min(5.5, p.velocity * 0.22));
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        // Slight phase variance per poster makes the hanging wire feel organic
        const phaseScale = 0.85 + ((i % 4) * 0.08);
        el.style.transform = `rotate(${(swayDeg * phaseScale).toFixed(2)}deg)`;
      }

      const idx = Math.max(
        0,
        Math.min(CURRICULUM_NODES.length - 1, Math.round(p.currentX / Math.max(1, p.cardStep)))
      );
      if (idx !== p.lastReportedIdx) {
        p.lastReportedIdx = idx;
        setCenteredIdx(idx);
        onActiveIndexChange?.(idx);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, onActiveIndexChange]);

  // Keyboard arrow navigation across the gallery wire
  useEffect(() => {
    if (paused) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        phys.current.targetX = Math.min(phys.current.maxScroll, phys.current.targetX + phys.current.cardStep);
      } else if (e.key === 'ArrowLeft') {
        phys.current.targetX = Math.max(0, phys.current.targetX - phys.current.cardStep);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paused]);

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    phys.current.targetX = Math.max(0, Math.min(phys.current.maxScroll, phys.current.targetX + delta * 1.15));
  };

  const beginDrag = (clientX: number) => {
    phys.current.isDragging = true;
    phys.current.dragStartX = clientX;
    phys.current.dragOriginTarget = phys.current.targetX;
    phys.current.dragDistance = 0;
  };

  const moveDrag = (clientX: number) => {
    if (!phys.current.isDragging) return;
    const dx = phys.current.dragStartX - clientX;
    phys.current.dragDistance = Math.max(phys.current.dragDistance, Math.abs(dx));
    phys.current.targetX = Math.max(
      0,
      Math.min(phys.current.maxScroll, phys.current.dragOriginTarget + dx * 1.35)
    );
  };

  const endDrag = () => {
    phys.current.isDragging = false;
  };

  const activeNode = CURRICULUM_NODES[centeredIdx] || CURRICULUM_NODES[0];
  const activeSector = SECTORS.find((s) => s.id === activeNode.sector);

  return (
    <div
      ref={stageRef}
      onWheel={handleWheel}
      onMouseDown={(e) => beginDrag(e.clientX)}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={(e) => e.touches.length === 1 && beginDrag(e.touches[0].clientX)}
      onTouchMove={(e) => e.touches.length === 1 && moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
      className="relative flex h-full w-full cursor-grab select-none items-center overflow-hidden bg-[var(--shuta-bg)] active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      {/* Subtle Paper Film Grain Overlay (Shutabug _4I8VBG_grain DNA) */}
      <div className="shuta-grain pointer-events-none absolute inset-0 z-[2]" />

      {/* Soft Top & Bottom Translucent Edge Veils (Shutabug lYEmGa_veil DNA) */}
      <div
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{
          background:
            'linear-gradient(to bottom, var(--shuta-bg) 0%, color-mix(in srgb, var(--shuta-bg) 60%, transparent) 3.8rem, transparent 7.5rem), linear-gradient(to top, var(--shuta-bg) 0%, color-mix(in srgb, var(--shuta-bg) 65%, transparent) 4.2rem, transparent 8.5rem)',
        }}
      />

      {/* Continuous Gallery Exhibition Wire Spanning the Room */}
      <svg
        className="pointer-events-none absolute left-0 right-0 top-[14.5vh] z-[5] h-8 w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 1440 32"
      >
        <path
          d="M -40 8 Q 720 26 1480 8"
          fill="none"
          stroke="var(--shuta-line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Inertial Horizontal Hanging Track */}
      <div
        ref={trackRef}
        className="relative z-[10] flex items-start pl-[10vw] pr-[24vw] pt-[15.2vh] will-change-transform md:pl-[20vw]"
        style={{ gap: 'clamp(34px, 4.5vw, 64px)' }}
      >
        {CURRICULUM_NODES.map((node, idx) => {
          const mastered = state.masteredNodes.includes(node.id);
          const drop = HANG_DROPS[idx % HANG_DROPS.length];
          const isHovered = hoveredId === node.id;
          const isDimmed = hoveredId !== null && !isHovered;

          return (
            <div
              key={node.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative shrink-0 origin-top transition-opacity duration-300"
              style={{
                opacity: isDimmed ? 0.42 : 1,
                width: 'clamp(228px, 21vw, 292px)',
              }}
            >
              {/* Physical Hanging Pin & Eyelet */}
              <div className="pointer-events-none flex flex-col items-center">
                <span className="h-2 w-2 rounded-full border border-[var(--shuta-line-strong)] bg-[var(--shuta-bg)]" />
                <span
                  className="w-[1px] bg-[var(--shuta-line-strong)]"
                  style={{ height: `${drop}px` }}
                />
              </div>

              {/* Collectible 5:7 Framed OS Art Print */}
              <button
                type="button"
                onClick={() => {
                  if (phys.current.dragDistance > 8) return;
                  openDeck(node.id, true);
                }}
                className="group relative block w-full text-left focus-visible:outline-none"
              >
                <div
                  className="aspect-[5/7] w-full overflow-hidden rounded-[2px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-card)] transition-transform duration-500 ease-out group-hover:-translate-y-2"
                  style={{
                    boxShadow:
                      state.theme === 'dark'
                        ? '0 26px 56px -18px rgba(0, 0, 0, 0.85)'
                        : '0 22px 48px -18px rgba(17, 17, 16, 0.24)',
                  }}
                >
                  <DeckPosterArt
                    deckId={node.id}
                    deckNumber={node.deckNumber}
                    chapter={node.silberschatz.chapter}
                    mastered={mastered}
                    className="h-full w-full"
                  />
                </div>

                {/* Quiet Archival Caption Below Plate */}
                <div className="mt-3.5 flex items-baseline justify-between gap-2 px-0.5">
                  <span className="font-display text-xs font-extrabold uppercase tracking-[0.02em] text-[var(--shuta-ink)]">
                    {node.shortTitle}
                  </span>
                  <span className="shrink-0 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--shuta-dim)]">
                    {node.deckNumber}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between px-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--shuta-dim)]">
                  <span>{node.silberschatz.sections}</span>
                  {mastered && <span className="font-bold text-[var(--shuta-live)]">Mastered</span>}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom-Left Quiet Telemetry Counter (Shutabug _4I8VBG_count DNA) */}
      <div
        className="pointer-events-none fixed left-5 z-20 hidden items-center gap-3 shuta-chrome text-[var(--shuta-dim)] md:left-8 md:flex"
        style={{ bottom: 'calc(22px + env(safe-area-inset-bottom, 0px))' }}
      >
        <span className="font-bold text-[var(--shuta-ink)]">{activeNode.deckNumber}</span>
        <span className="block h-[1px] w-7 bg-[var(--shuta-line-strong)]" />
        <span>22</span>
        <span className="ml-2 hidden max-w-[260px] truncate text-[var(--shuta-ink)] lg:inline">
          {activeSector?.shortName} · {activeNode.shortTitle}
        </span>
      </div>

      {/* Bottom-Right Subtle Gesture Hint (Shutabug _4I8VBG_hint DNA) */}
      <div
        className="pointer-events-none fixed right-5 z-20 hidden shuta-chrome text-[var(--shuta-dim)] md:right-8 md:block"
        style={{ bottom: 'calc(22px + env(safe-area-inset-bottom, 0px))' }}
      >
        Drag or scroll · Click plate to inspect
      </div>
    </div>
  );
};
