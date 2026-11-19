import React, { useMemo, useState } from 'react';
import {
  Bug,
  CheckCircle2,
  Cpu,
  FileText,
  Highlighter,
  Search,
  Sparkles,
  Star,
  Swords,
} from 'lucide-react';
import { CAPABILITIES, CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { useKernelStore } from '@/store/useKernelStore';
import { SpotlightCard, StarBorder, ShinyText } from '@/components/reactbits';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Progress } from '@/components/ui/primitives';
import { KernelToggleGroup, KernelToggleItem } from '@/components/ui/interactive';

type FilterScope = 'all' | 'midterm' | 'final' | 'flagged' | 'incomplete' | 'bugs';

interface BentoSyllabusTrackProps {
  focusedSector: string | null;
  onClearSectorFocus: () => void;
  onOpenBossRaid: (sectorId: string) => void;
}

export const BentoSyllabusTrack: React.FC<BentoSyllabusTrackProps> = ({
  focusedSector,
  onClearSectorFocus,
  onOpenBossRaid,
}) => {
  const { state, openDeck, getDeckClearance, toggleFlagDeck } = useKernelStore();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<FilterScope>('all');

  const filteredBySector = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTORS.filter((sec) => !focusedSector || sec.id === focusedSector)
      .map((sec) => {
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
        return { sector: sec, nodes };
      })
      .filter((entry) => entry.nodes.length > 0);
  }, [focusedSector, getDeckClearance, query, scope, state.flaggedDecks, state.masteredNodes]);

  return (
    <div
      className="h-full overflow-y-auto px-4 py-5 md:px-6"
      style={{ paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Top Filter Bar */}
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card/85 p-3.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[210px] flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter 21 decks, Silberschatz §sections, or algorithms..."
              className="pl-8"
            />
          </div>
          {focusedSector && (
            <Button size="sm" variant="cyber" onClick={onClearSectorFocus}>
              Showing {SECTORS.find((s) => s.id === focusedSector)?.shortName} ✕
            </Button>
          )}
        </div>

        <KernelToggleGroup
          type="single"
          value={scope}
          onValueChange={(v) => v && setScope(v as FilterScope)}
          className="flex flex-wrap gap-1.5"
        >
          <KernelToggleItem value="all">ALL (21)</KernelToggleItem>
          <KernelToggleItem value="midterm">MIDTERM (D02–12)</KernelToggleItem>
          <KernelToggleItem value="final">FINAL (D13–22)</KernelToggleItem>
          <KernelToggleItem value="flagged">⭐ FLAGGED</KernelToggleItem>
          <KernelToggleItem value="incomplete">INCOMPLETE</KernelToggleItem>
          <KernelToggleItem value="bugs">🐞 UNSOLVED BUGS</KernelToggleItem>
        </KernelToggleGroup>
      </div>

      {/* 7-Sector Bento Grid */}
      <div className="flex flex-col gap-6">
        {filteredBySector.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-card/50 py-14 text-center font-mono text-xs text-muted-foreground">
            No study modules match your active search/filter criteria.
          </div>
        )}

        {filteredBySector.map(({ sector, nodes }) => {
          const totalInSec = sector.nodes.length;
          const masteredInSec = sector.nodes.filter((id) => state.masteredNodes.includes(id)).length;
          const pct = Math.round((masteredInSec / totalInSec) * 100);
          const bossCleared = state.clearedBosses.includes(sector.id);

          return (
            <section key={sector.id} className="flex flex-col gap-3">
              {/* Sector Bento Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/70 px-4 py-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: sector.color, boxShadow: `0 0 10px ${sector.color}` }}
                  />
                  <h2 className="font-display text-sm font-bold tracking-wider text-foreground">
                    {sector.name}
                  </h2>
                  <Badge variant="outline">{sector.bookChapters}</Badge>
                  <Badge variant={sector.examScope === 'midterm' ? 'amber' : 'default'}>
                    {sector.examScope.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="w-24" />
                    <span className="font-mono text-[11px] font-bold text-muted-foreground">
                      {masteredInSec}/{totalInSec}
                    </span>
                  </div>
                  <StarBorder active={!bossCleared} color={sector.color} speed="5s">
                    <Button
                      size="sm"
                      variant={bossCleared ? 'emerald' : 'cyber'}
                      onClick={() => onOpenBossRaid(sector.id)}
                      className="rounded-[6px] border-0"
                    >
                      <Swords className="h-3.5 w-3.5" />
                      {bossCleared ? 'Boss Cleared' : 'Boss Gauntlet'}
                    </Button>
                  </StarBorder>
                </div>
              </div>

              {/* Deck Spotlight Cards */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
                      className={`bezel-card group cursor-pointer border transition-all hover:border-primary/70 ${
                        mastered ? 'border-accent/45' : 'border-border'
                      }`}
                    >
                      <div className="flex h-full flex-col justify-between gap-3 p-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                                style={{
                                  backgroundColor: `${sector.color}20`,
                                  color: sector.color,
                                }}
                              >
                                DECK {node.deckNumber}
                              </span>
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {node.silberschatz.sections}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFlagDeck(node.id);
                                }}
                                title={flagged ? 'Unflag deck' : 'Flag deck for review'}
                                className={`rounded p-1 transition-colors hover:bg-muted ${
                                  flagged ? 'text-amber-400' : 'text-muted-foreground/60 hover:text-foreground'
                                }`}
                              >
                                <Star className="h-3.5 w-3.5" fill={flagged ? 'currentColor' : 'none'} />
                              </button>
                              {mastered && <CheckCircle2 className="h-4 w-4 text-accent" />}
                            </div>
                          </div>

                          <h3 className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                            {node.shortTitle}
                          </h3>
                          <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-muted-foreground">
                            {node.summary}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-border/70 pt-2.5">
                          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                            <span
                              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${
                                st.simDone ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <Cpu className="h-2.5 w-2.5" />
                              Sim {st.simDone ? '✓' : '·'}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${
                                st.qBest >= 3 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              Quiz {st.qBest}/{st.qTotal}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 ${
                                st.bugsSolved >= st.bugsTotal && st.bugsTotal > 0
                                  ? 'bg-accent/15 text-accent'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <Bug className="h-2.5 w-2.5" />
                              {st.bugsSolved}/{st.bugsTotal}
                            </span>
                            {hlCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-amber-500/15 px-1.5 py-0.5 text-amber-400">
                                <Highlighter className="h-2.5 w-2.5" />
                                {hlCount}
                              </span>
                            )}
                            {hasNote && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-primary/15 px-1.5 py-0.5 text-primary">
                                <FileText className="h-2.5 w-2.5" />
                                Notes
                              </span>
                            )}
                          </div>

                          {cap && (
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-muted-foreground">Reward Capability</span>
                              <span className="inline-flex items-center gap-1 rounded border border-primary/35 bg-primary/10 px-1.5 py-0.5 font-bold text-primary">
                                <Sparkles className="h-2.5 w-2.5" />
                                {state.capabilities.includes(cap.id) ? (
                                  <ShinyText text={cap.badge} />
                                ) : (
                                  cap.badge
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
