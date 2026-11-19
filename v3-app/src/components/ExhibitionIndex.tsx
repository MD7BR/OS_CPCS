import React, { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Search, Star } from 'lucide-react';
import { CAPABILITIES, CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { useKernelStore } from '@/store/useKernelStore';
import { CountUp, DecryptedText, SpotlightCard } from '@/components/reactbits';
import {
  Button,
  HairlineProgress,
  Input,
  Pill,
  ShutaToggleGroup,
  ShutaToggleItem,
} from '@/components/ui';

type ScopeFilter = 'all' | 'midterm' | 'final' | 'flagged' | 'incomplete' | 'bugs';

interface ExhibitionIndexProps {
  onOpenBossRaid: (sectorId: string) => void;
}

export const ExhibitionIndex: React.FC<ExhibitionIndexProps> = ({ onOpenBossRaid }) => {
  const {
    state,
    openDeck,
    getDeckClearance,
    toggleFlagDeck,
    triggerRedPill,
    triggerBluePill,
  } = useKernelStore();

  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<ScopeFilter>('all');

  const resumeNode =
    (state.lastDeckId && CURRICULUM_NODES.find((n) => n.id === state.lastDeckId)) || CURRICULUM_NODES[0];

  const filteredBySector = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTORS.map((sec, sIdx) => {
      const nodes = CURRICULUM_NODES.filter((node) => {
        if (node.sector !== sec.id) return false;
        if (scope === 'midterm' && sec.examScope !== 'midterm') return false;
        if (scope === 'final' && sec.examScope !== 'final') return false;
        if (scope === 'flagged' && !state.flaggedDecks.includes(node.id)) return false;
        if (scope === 'incomplete' && state.masteredNodes.includes(node.id)) return false;
        if (scope === 'bugs') {
          const st = getDeckClearance(node.id);
          if (st.bugsSolved >= st.bugsTotal) return false;
        }
        if (!q) return true;
        return (
          node.shortTitle.toLowerCase().includes(q) ||
          node.deckNumber.includes(q) ||
          node.summary.toLowerCase().includes(q) ||
          node.silberschatz.chapter.toLowerCase().includes(q) ||
          node.silberschatz.sections.toLowerCase().includes(q)
        );
      });
      return { sector: sec, index: sIdx + 1, nodes };
    }).filter((s) => s.nodes.length > 0);
  }, [getDeckClearance, query, scope, state.flaggedDecks, state.masteredNodes]);

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Editorial Exhibition Hero Colophon */}
      <section className="border-b border-[var(--shuta-line)] px-5 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="ink">EDITION 03 · ALPHA</Pill>
              <Pill tone="warn">UNOFFICIAL · AI-GENERATED STUDY COMPANION</Pill>
              <span className="shuta-chrome text-[var(--shuta-dim)]">SILBERSCHATZ 10TH ED.</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={triggerRedPill}
                className="shuta-link shuta-chrome text-[var(--shuta-ink)]"
                title="Unlock all 21 plates & 12 capabilities (Full Access Mode)"
              >
                Full Access Mode
              </button>
              <button
                type="button"
                onClick={triggerBluePill}
                className="shuta-link shuta-chrome text-[var(--shuta-dim)] hover:text-[var(--shuta-error)]"
                title="Reset mastery back to Plate 02 (preserves notes & highlights)"
              >
                Reset Archive
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-[0.01em] text-[var(--shuta-ink)] sm:text-5xl md:text-6xl">
                <DecryptedText text="OPERATING SYSTEMS" speed={24} maxIterations={10} />
                <br />
                <span className="text-[var(--shuta-dim)]">MONOGRAPH &amp; LAB</span>
              </h1>
              <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                Twenty-one Silberschatz chapters paired side-by-side with twenty-two live hardware machines,
                handwritten exam derivations, and active recall drills — curated as an archival print index.
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-[var(--shuta-line)] pt-4 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="shuta-chrome text-[var(--shuta-dim)]">PLATES</div>
                  <div className="mt-1 font-display text-2xl font-extrabold text-[var(--shuta-ink)]">
                    <CountUp to={state.masteredNodes.length} />
                    <span className="text-sm font-normal text-[var(--shuta-dim)]">/21</span>
                  </div>
                </div>
                <div>
                  <div className="shuta-chrome text-[var(--shuta-dim)]">CAPS</div>
                  <div className="mt-1 font-display text-2xl font-extrabold text-[var(--shuta-ink)]">
                    <CountUp to={state.capabilities.length} />
                    <span className="text-sm font-normal text-[var(--shuta-dim)]">/12</span>
                  </div>
                </div>
                <div>
                  <div className="shuta-chrome text-[var(--shuta-dim)]">XP</div>
                  <div className="mt-1 font-display text-2xl font-extrabold text-[var(--shuta-warn)]">
                    <CountUp to={state.xp} />
                  </div>
                </div>
              </div>
              <Button variant="ink" size="lg" onClick={() => openDeck(resumeNode.id, true)} className="w-full justify-between">
                <span>
                  Open Plate {resumeNode.deckNumber} · {resumeNode.shortTitle}
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hairline Search & Scope Filter Bar */}
      <div className="sticky top-0 z-20 border-b border-[var(--shuta-line)] bg-[var(--shuta-veil)] px-5 py-3 backdrop-blur-md md:px-10">
        <div className="mx-auto flex max-w-[82rem] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--shuta-dim)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter catalog by topic, algorithm, or §section..."
              className="pl-9"
            />
          </div>

          <ShutaToggleGroup
            type="single"
            value={scope}
            onValueChange={(v) => v && setScope(v as ScopeFilter)}
            className="flex flex-wrap gap-1.5"
          >
            <ShutaToggleItem value="all">All 21</ShutaToggleItem>
            <ShutaToggleItem value="midterm">Midterm (02–12)</ShutaToggleItem>
            <ShutaToggleItem value="final">Final (13–22)</ShutaToggleItem>
            <ShutaToggleItem value="flagged">Saved / Flagged</ShutaToggleItem>
            <ShutaToggleItem value="incomplete">Unmastered</ShutaToggleItem>
            <ShutaToggleItem value="bugs">Open Bug Hunts</ShutaToggleItem>
          </ShutaToggleGroup>
        </div>
      </div>

      {/* Asymmetric 12-Column Sector Exhibition Spreads */}
      <div className="mx-auto max-w-[82rem] px-5 md:px-10">
        {filteredBySector.length === 0 && (
          <div className="py-20 text-center font-serif text-base italic text-[var(--shuta-dim)]">
            No archival plates match your current filter.
          </div>
        )}

        {filteredBySector.map(({ sector, index, nodes }) => {
          const totalInSec = sector.nodes.length;
          const masteredInSec = sector.nodes.filter((id) => state.masteredNodes.includes(id)).length;
          const pct = Math.round((masteredInSec / totalInSec) * 100);
          const bossCleared = state.clearedBosses.includes(sector.id);

          return (
            <section
              key={sector.id}
              className="grid grid-cols-1 gap-8 border-b border-[var(--shuta-line)] py-10 lg:grid-cols-12"
            >
              {/* Sticky Editorial Left Column */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-20">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-5xl font-extrabold leading-none text-[var(--shuta-ink)]">
                      {String(index).padStart(2, '0')}
                    </span>
                    <span className="shuta-chrome text-[var(--shuta-dim)]">{sector.hex}</span>
                  </div>

                  <h2 className="mt-3 font-display text-xl font-extrabold uppercase leading-tight tracking-[0.01em] text-[var(--shuta-ink)]">
                    {sector.name.replace(/^Sector \d+:\s*/, '')}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Pill>{sector.bookChapters}</Pill>
                    <Pill tone={sector.examScope === 'midterm' ? 'warn' : 'default'}>
                      {sector.examScope}
                    </Pill>
                    {bossCleared && <Pill tone="live">Gauntlet Cleared</Pill>}
                  </div>

                  <div className="mt-5 max-w-xs">
                    <div className="mb-1.5 flex items-center justify-between shuta-chrome text-[var(--shuta-dim)]">
                      <span>Sector Clearance</span>
                      <span className="text-[var(--shuta-ink)]">
                        {masteredInSec}/{totalInSec}
                      </span>
                    </div>
                    <HairlineProgress value={pct} />
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => onOpenBossRaid(sector.id)}
                      className="shuta-link shuta-chrome text-[var(--shuta-ink)]"
                    >
                      <span>{bossCleared ? 'Replay Sector Gauntlet' : 'Engage Sector Gauntlet'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Archival Print-Plate Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
                {nodes.map((node) => {
                  const mastered = state.masteredNodes.includes(node.id);
                  const flagged = state.flaggedDecks.includes(node.id);
                  const st = getDeckClearance(node.id);
                  const cap = node.unlockedCapability ? CAPABILITIES[node.unlockedCapability] : null;
                  const hlCount = (state.highlights[node.id] || []).length;
                  const hasNote = Boolean((state.notes[node.id] || '').trim());

                  return (
                    <SpotlightCard
                      key={node.id}
                      onClick={() => openDeck(node.id, true)}
                      spotlightColor="rgba(var(--spotlight-rgb), 0.08)"
                      className="group cursor-pointer rounded-[3px] border border-[var(--shuta-line)] bg-[var(--shuta-card)] transition-colors duration-200 hover:border-[var(--shuta-ink)]"
                    >
                      <div className="flex h-full flex-col justify-between gap-4 p-5">
                        <div>
                          <div className="mb-3 flex items-center justify-between gap-2 border-b border-[var(--shuta-line)] pb-2.5">
                            <span className="shuta-chrome font-bold text-[var(--shuta-ink)]">
                              PLATE № {node.deckNumber}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-[var(--shuta-dim)]">
                                {node.silberschatz.sections}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFlagDeck(node.id);
                                }}
                                aria-label="Save plate"
                                className={`p-0.5 transition-colors ${
                                  flagged ? 'text-[var(--shuta-warn)]' : 'text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]'
                                }`}
                              >
                                <Star className="h-3.5 w-3.5" fill={flagged ? 'currentColor' : 'none'} />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display text-base font-extrabold uppercase leading-snug tracking-[0.01em] text-[var(--shuta-ink)]">
                              {node.shortTitle}
                            </h3>
                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--shuta-dim)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--shuta-ink)]" />
                          </div>

                          <p className="mt-2 line-clamp-2 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                            {node.summary}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2.5 border-t border-[var(--shuta-line)] pt-3">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--shuta-dim)]">
                            <span className={st.simDone ? 'font-bold text-[var(--shuta-live)]' : ''}>
                              Lab {st.simDone ? '✓' : '—'}
                            </span>
                            <span className={st.qBest >= 3 ? 'font-bold text-[var(--shuta-ink)]' : ''}>
                              Drill {st.qBest}/{st.qTotal}
                            </span>
                            <span className={st.bugsSolved >= st.bugsTotal && st.bugsTotal > 0 ? 'font-bold text-[var(--shuta-live)]' : ''}>
                              Bugs {st.bugsSolved}/{st.bugsTotal}
                            </span>
                            {hlCount > 0 && <span className="text-[var(--shuta-warn)]">{hlCount} Marks</span>}
                            {hasNote && <span className="text-[var(--shuta-ink)]">Notes</span>}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            {cap ? (
                              <Pill tone={state.capabilities.includes(cap.id) ? 'ink' : 'default'}>
                                {cap.badge}
                              </Pill>
                            ) : (
                              <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--shuta-dim)]">
                                {node.silberschatz.chapter}
                              </span>
                            )}
                            {mastered && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--shuta-live)]">
                                <Check className="h-3 w-3" /> Mastered
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Archival Colophon Footer */}
        <footer className="flex flex-col justify-between gap-3 py-8 font-mono text-[10.5px] text-[var(--shuta-dim)] sm:flex-row sm:items-center">
          <div>
            <strong>KERNEL//BREACH v3 ALPHA</strong> — Unofficial AI-generated independent study archive aligned with
            Silberschatz <em>Operating System Concepts (10th Ed.)</em>. Zero instructor or faculty affiliation.
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <a href="../v2/" className="shuta-link text-[var(--shuta-ink)]">
              v2 Beta (Silicon)
            </a>
            <a href="../" className="shuta-link text-[var(--shuta-ink)]">
              v1 Classic
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};
