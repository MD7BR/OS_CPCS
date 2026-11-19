import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import { CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { useKernelStore } from '@/store/useKernelStore';
import { DeckPosterArt } from './DeckPosterArt';

type ListScope = 'all' | 'midterm' | 'final' | 'flagged' | 'bugs';

export const EditorialListView: React.FC = () => {
  const { state, openDeck, getDeckClearance, toggleFlagDeck } = useKernelStore();
  const [scope, setScope] = useState<ListScope>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Smooth cursor-following preview plate physics (Shutabug list-motion DNA)
  const previewRef = useRef<HTMLDivElement | null>(null);
  const pointer = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, vx: 0 });

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = pointer.current;
      const prevX = p.cx;
      p.cx += (p.tx - p.cx) * 0.14;
      p.cy += (p.ty - p.cy) * 0.14;
      p.vx = p.vx * 0.78 + (p.cx - prevX) * 0.22;

      if (previewRef.current) {
        const tilt = Math.max(-7, Math.min(7, p.vx * 0.25));
        previewRef.current.style.transform = `translate3d(${(p.cx + 28).toFixed(1)}px, ${(p.cy - 140).toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = useMemo(() => {
    return CURRICULUM_NODES.filter((node) => {
      const sec = SECTORS.find((s) => s.id === node.sector);
      if (scope === 'midterm' && sec?.examScope !== 'midterm') return false;
      if (scope === 'final' && sec?.examScope !== 'final') return false;
      if (scope === 'flagged' && !state.flaggedDecks.includes(node.id)) return false;
      if (scope === 'bugs') {
        const st = getDeckClearance(node.id);
        if (st.bugsSolved >= st.bugsTotal) return false;
      }
      return true;
    });
  }, [getDeckClearance, scope, state.flaggedDecks]);

  const hoveredNode = hoveredId ? CURRICULUM_NODES.find((n) => n.id === hoveredId) : null;

  return (
    <div
      onMouseMove={(e) => {
        pointer.current.tx = Math.min(window.innerWidth - 260, e.clientX);
        pointer.current.ty = Math.max(170, Math.min(window.innerHeight - 200, e.clientY));
      }}
      className="relative h-full w-full overflow-y-auto bg-[var(--shuta-bg)] px-5 pb-28 pt-24 md:px-12 md:pt-28"
    >
      {/* Subtle Paper Grain */}
      <div className="shuta-grain pointer-events-none fixed inset-0 z-[1]" />

      {/* Floating Cursor-Following 5:7 Print Poster Preview (Desktop only) */}
      <div
        ref={previewRef}
        className={`pointer-events-none fixed left-0 top-0 z-30 hidden w-[210px] transition-opacity duration-200 lg:block ${
          hoveredNode ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        {hoveredNode && (
          <div
            className="aspect-[5/7] w-full overflow-hidden rounded-[2px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-card)]"
            style={{
              boxShadow:
                state.theme === 'dark'
                  ? '0 24px 56px rgba(0, 0, 0, 0.85)'
                  : '0 24px 50px rgba(17, 17, 16, 0.28)',
            }}
          >
            <DeckPosterArt
              deckId={hoveredNode.id}
              deckNumber={hoveredNode.deckNumber}
              chapter={hoveredNode.silberschatz.chapter}
              mastered={state.masteredNodes.includes(hoveredNode.id)}
              className="h-full w-full"
            />
          </div>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-[76rem]">
        {/* Quiet Editorial Filter Line — Zero Pill Bloat */}
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--shuta-line)] pb-4">
          <div className="flex flex-wrap items-center gap-5">
            {(
              [
                ['all', 'All (21)'],
                ['midterm', 'Midterm'],
                ['final', 'Final'],
                ['flagged', 'Saved'],
                ['bugs', 'Open Bugs'],
              ] as [ListScope, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                data-active={scope === key}
                onClick={() => setScope(key)}
                className={`shuta-link shuta-chrome ${
                  scope === key ? 'font-bold text-[var(--shuta-ink)]' : 'text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="shuta-chrome text-[var(--shuta-dim)]">
            {state.masteredNodes.length} / 21 Mastered · Silberschatz 10th Ed.
          </span>
        </div>

        {/* Pure Typographic Archive Index Rows */}
        <div className="divide-y divide-[var(--shuta-line)] border-b border-[var(--shuta-line)]">
          {items.length === 0 && (
            <div className="py-20 text-center font-serif italic text-[var(--shuta-dim)]">
              No plates in this selection.
            </div>
          )}

          {items.map((node) => {
            const sec = SECTORS.find((s) => s.id === node.sector);
            const mastered = state.masteredNodes.includes(node.id);
            const flagged = state.flaggedDecks.includes(node.id);
            const isHovered = hoveredId === node.id;
            const isDimmed = hoveredId !== null && !isHovered;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => openDeck(node.id, true)}
                className="group grid cursor-pointer grid-cols-12 items-baseline gap-3 py-5 transition-opacity duration-200 md:py-6"
                style={{ opacity: isDimmed ? 0.28 : 1 }}
              >
                <div className="col-span-2 flex items-center gap-2 font-mono text-xs text-[var(--shuta-dim)] md:col-span-1">
                  <span className="font-bold text-[var(--shuta-ink)]">{node.deckNumber}</span>
                  {mastered && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[var(--shuta-live)]"
                      title="Mastered"
                    />
                  )}
                </div>

                <div className="col-span-9 md:col-span-7">
                  <h2 className="font-display text-lg font-extrabold uppercase leading-tight tracking-[0.01em] text-[var(--shuta-ink)] transition-transform duration-300 group-hover:translate-x-2 sm:text-2xl md:text-[1.75rem]">
                    {node.shortTitle}
                  </h2>
                  <p className="mt-1 line-clamp-1 font-serif text-sm text-[var(--shuta-dim)] md:hidden">
                    {node.silberschatz.chapter} · {node.silberschatz.sections}
                  </p>
                </div>

                <div className="hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--shuta-dim)] md:col-span-3 md:block">
                  <div>{node.silberschatz.chapter}</div>
                  <div className="mt-0.5 opacity-70">{sec?.shortName}</div>
                </div>

                <div className="col-span-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFlagDeck(node.id);
                    }}
                    aria-label="Save plate"
                    className={`hidden p-1 transition-colors sm:inline-flex ${
                      flagged ? 'text-[var(--shuta-warn)]' : 'text-[var(--shuta-dim)] opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" fill={flagged ? 'currentColor' : 'none'} />
                  </button>
                  <ArrowUpRight className="h-4 w-4 text-[var(--shuta-dim)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--shuta-ink)]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
