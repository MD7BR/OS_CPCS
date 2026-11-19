import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Download,
  FileText,
  Star,
  X,
} from 'lucide-react';
import { CAPABILITIES, CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { THEORY_KNOWLEDGE_BASE } from '@/data/trove';
import { useKernelStore } from '@/store/useKernelStore';
import { ClickSpark, DecryptedText } from '@/components/reactbits';
import {
  Button,
  Pill,
  ShutaDrawer,
  ShutaDrawerPanel,
  ShutaTabs,
  ShutaTabsContent,
  ShutaTabsList,
  ShutaTabsTrigger,
  SplitHandle,
  SplitPanel,
  SplitPanelGroup,
  Textarea,
} from '@/components/ui';
import { TheoryPedagogyPane } from './TheoryPedagogyPane';
import { SimulatorHost } from './SimulatorHost';
import { ExamDrillPane } from './ExamDrillPane';

type DesktopLayout = 'split' | 'monograph' | 'machine';
type RightTab = 'sim' | 'quiz';
type MobileTab = 'monograph' | 'sim' | 'quiz';

export const SplitWorkbench: React.FC = () => {
  const {
    state,
    activeDeckId,
    setActiveDeckId,
    stepDeck,
    toggleFlagDeck,
    synthesizeNode,
    getDeckClearance,
    updateNote,
    exportNotesMarkdown,
  } = useKernelStore();

  const [desktopLayout, setDesktopLayout] = useState<DesktopLayout>('split');
  const [rightTab, setRightTab] = useState<RightTab>('sim');
  const [mobileTab, setMobileTab] = useState<MobileTab>('monograph');
  const [codexOpen, setCodexOpen] = useState(false);
  const [liveFormulaHtml, setLiveFormulaHtml] = useState('');
  const [readProgress, setReadProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!activeDeckId) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Escape') {
        if (codexOpen) setCodexOpen(false);
        else setActiveDeckId(null);
      } else if (e.key === '[') stepDeck(-1);
      else if (e.key === ']') stepDeck(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDeckId, codexOpen, setActiveDeckId, stepDeck]);

  const node = CURRICULUM_NODES.find((n) => n.id === activeDeckId);
  if (!node) return null;

  const sector = SECTORS.find((s) => s.id === node.sector);
  const theory = THEORY_KNOWLEDGE_BASE[node.id];
  const mastered = state.masteredNodes.includes(node.id);
  const flagged = state.flaggedDecks.includes(node.id);
  const clearance = getDeckClearance(node.id);
  const cap = node.unlockedCapability ? CAPABILITIES[node.unlockedCapability] : null;

  const handleTheoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setReadProgress(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0);
  };

  return (
    <ClickSpark
      sparkColor={state.theme === 'dark' ? '#C9A961' : '#17703C'}
      sparkCount={8}
      sparkRadius={20}
      className="fixed inset-0 z-40 flex flex-col bg-[var(--shuta-bg)] text-[var(--shuta-ink)]"
    >
      {/* Exhibition Workbench Top Chrome Bar */}
      <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-[var(--shuta-line)] bg-[var(--shuta-bg)] px-4 py-3 md:px-6">
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[var(--shuta-ink)] transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />

        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <Pill tone="ink">PLATE {node.deckNumber}</Pill>
          <h1 className="truncate font-display text-sm font-extrabold uppercase tracking-[0.02em] text-[var(--shuta-ink)] md:text-base">
            <DecryptedText text={node.shortTitle} speed={22} maxIterations={8} />
          </h1>
          <span className="hidden shuta-chrome text-[var(--shuta-dim)] xl:inline">
            · {sector?.shortName} · {node.silberschatz.chapter}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isDesktop && (
            <div className="mr-1 inline-flex items-center border border-[var(--shuta-line)] bg-[var(--shuta-panel)] p-0.5 rounded-[2px]">
              <button
                type="button"
                onClick={() => setDesktopLayout('split')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] ${
                  desktopLayout === 'split'
                    ? 'bg-[var(--shuta-ink)] text-[var(--shuta-bg)]'
                    : 'text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]'
                }`}
              >
                <Columns2 className="h-3 w-3" /> Split
              </button>
              <button
                type="button"
                onClick={() => setDesktopLayout('monograph')}
                className={`px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] ${
                  desktopLayout === 'monograph'
                    ? 'bg-[var(--shuta-ink)] text-[var(--shuta-bg)]'
                    : 'text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]'
                }`}
              >
                Monograph
              </button>
              <button
                type="button"
                onClick={() => setDesktopLayout('machine')}
                className={`px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] ${
                  desktopLayout === 'machine'
                    ? 'bg-[var(--shuta-ink)] text-[var(--shuta-bg)]'
                    : 'text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]'
                }`}
              >
                Machine
              </button>
            </div>
          )}

          <Button size="sm" variant="outline" onClick={() => stepDeck(-1)} title="Previous Plate ([)">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => stepDeck(1)} title="Next Plate (])">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant={flagged ? 'ink' : 'outline'} onClick={() => toggleFlagDeck(node.id)}>
            <Star className="h-3.5 w-3.5" fill={flagged ? 'currentColor' : 'none'} />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCodexOpen(true)}>
            <FileText className="h-3.5 w-3.5" />
            Codex &amp; Notes
          </Button>
          <Button size="sm" variant={mastered ? 'live' : 'ink'} onClick={() => synthesizeNode(node.id)}>
            {mastered && <Check className="h-3.5 w-3.5" />}
            {mastered ? 'Mastered' : cap ? `Unlock ${cap.badge}` : 'Mark Mastered'}
          </Button>
          <button
            type="button"
            onClick={() => setActiveDeckId(null)}
            className="shuta-close-btn"
            aria-label="Close Workbench"
            title="Close Workbench (ESC)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Case Study Anomaly Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--shuta-line)] bg-[var(--shuta-panel)] px-4 py-1.5 md:px-6">
        <div className="flex items-center gap-2 font-serif text-xs">
          <span className="shuta-chrome font-bold text-[var(--shuta-error)]">{node.anomaly.title}:</span>
          <span className="text-[var(--text-secondary)]">{node.anomaly.brief}</span>
        </div>
        <div className="shuta-chrome flex items-center gap-3 text-[var(--shuta-dim)]">
          <span>Lab {clearance.simDone ? '✓' : '—'}</span>
          <span>Drill {clearance.qBest}/{clearance.qTotal}</span>
          <span>Bugs {clearance.bugsSolved}/{clearance.bugsTotal}</span>
        </div>
      </div>

      {/* Synchronized Split Monograph Workspace */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {isDesktop ? (
          desktopLayout === 'split' ? (
            <SplitPanelGroup direction="horizontal" className="h-full">
              <SplitPanel defaultSize={54} minSize={32}>
                <div onScroll={handleTheoryScroll} className="h-full overflow-y-auto px-6 pb-10 pt-2">
                  <TheoryPedagogyPane deckId={node.id} />
                </div>
              </SplitPanel>

              <SplitHandle />

              <SplitPanel defaultSize={46} minSize={30}>
                <div className="flex h-full flex-col overflow-hidden bg-[var(--shuta-bg)]">
                  <div className="flex items-center justify-between border-b border-[var(--shuta-line)] px-5 py-2.5">
                    <ShutaTabs value={rightTab} onValueChange={(v) => setRightTab(v as RightTab)}>
                      <ShutaTabsList>
                        <ShutaTabsTrigger value="sim">Live Machine &amp; Math</ShutaTabsTrigger>
                        <ShutaTabsTrigger value="quiz">
                          Exam Drill ({clearance.qBest}/{clearance.qTotal})
                        </ShutaTabsTrigger>
                      </ShutaTabsList>
                    </ShutaTabs>
                    <span className="shuta-chrome text-[var(--shuta-dim)]">Resize ⇄</span>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    {rightTab === 'sim' ? (
                      <SimulatorHost deckId={node.id} onFormulasExtracted={setLiveFormulaHtml} />
                    ) : (
                      <ExamDrillPane deckId={node.id} />
                    )}
                  </div>
                </div>
              </SplitPanel>
            </SplitPanelGroup>
          ) : desktopLayout === 'monograph' ? (
            <div onScroll={handleTheoryScroll} className="mx-auto h-full max-w-4xl overflow-y-auto px-6 pb-12 pt-2">
              <TheoryPedagogyPane deckId={node.id} />
            </div>
          ) : (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex justify-center border-b border-[var(--shuta-line)] py-2.5">
                <ShutaTabs value={rightTab} onValueChange={(v) => setRightTab(v as RightTab)}>
                  <ShutaTabsList>
                    <ShutaTabsTrigger value="sim">Live Machine &amp; Ruled Workings</ShutaTabsTrigger>
                    <ShutaTabsTrigger value="quiz">
                      Exam Drill ({clearance.qBest}/{clearance.qTotal})
                    </ShutaTabsTrigger>
                  </ShutaTabsList>
                </ShutaTabs>
              </div>
              <div className="mx-auto min-h-0 w-full max-w-5xl flex-1 overflow-y-auto px-6 py-5">
                {rightTab === 'sim' ? (
                  <SimulatorHost deckId={node.id} onFormulasExtracted={setLiveFormulaHtml} />
                ) : (
                  <ExamDrillPane deckId={node.id} />
                )}
              </div>
            </div>
          )
        ) : (
          <ShutaTabs
            value={mobileTab}
            onValueChange={(v) => setMobileTab(v as MobileTab)}
            className="flex h-full flex-col overflow-hidden"
          >
            <div className="border-b border-[var(--shuta-line)] px-4 py-2">
              <ShutaTabsList className="grid w-full grid-cols-3">
                <ShutaTabsTrigger value="monograph">Monograph</ShutaTabsTrigger>
                <ShutaTabsTrigger value="sim">Machine</ShutaTabsTrigger>
                <ShutaTabsTrigger value="quiz">Drill ({clearance.qBest}/{clearance.qTotal})</ShutaTabsTrigger>
              </ShutaTabsList>
            </div>
            <ShutaTabsContent
              value="monograph"
              onScroll={handleTheoryScroll}
              className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-2"
            >
              <TheoryPedagogyPane deckId={node.id} />
            </ShutaTabsContent>
            <ShutaTabsContent value="sim" className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <SimulatorHost deckId={node.id} onFormulasExtracted={setLiveFormulaHtml} />
            </ShutaTabsContent>
            <ShutaTabsContent value="quiz" className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <ExamDrillPane deckId={node.id} />
            </ShutaTabsContent>
          </ShutaTabs>
        )}
      </div>

      {/* Shutabug Frosted Slide-Over Codex & Notes Drawer */}
      <ShutaDrawer open={codexOpen} onOpenChange={setCodexOpen}>
        <ShutaDrawerPanel
          side="right"
          title="Codex & Notes"
          kicker={`PLATE ${node.deckNumber} · ${node.silberschatz.chapter} (${node.silberschatz.sections})`}
        >
          <div className="flex flex-col gap-6">
            <div className="border-b border-[var(--shuta-line)] pb-5">
              <div className="shuta-chrome mb-2 text-[var(--shuta-dim)]">Clearance Telemetry</div>
              <ul className="space-y-1.5 font-mono text-xs text-[var(--shuta-ink)]">
                <li className={clearance.simDone ? 'text-[var(--shuta-live)]' : 'text-[var(--shuta-dim)]'}>
                  {clearance.simDone ? '✓' : '○'} Interactive Machine Inspected (+15 XP)
                </li>
                <li className={clearance.qBest >= 3 ? 'text-[var(--shuta-live)]' : 'text-[var(--shuta-dim)]'}>
                  {clearance.qBest >= 3 ? '✓' : '○'} Exam Drill Clearance ({clearance.qBest}/{clearance.qTotal})
                </li>
                <li className={clearance.bugsSolved > 0 ? 'text-[var(--shuta-live)]' : 'text-[var(--shuta-dim)]'}>
                  {clearance.bugsSolved > 0 ? '✓' : '○'} Spot-the-Mistake Audits ({clearance.bugsSolved}/{clearance.bugsTotal})
                </li>
                <li className={clearance.sabCaught ? 'text-[var(--shuta-live)]' : 'text-[var(--shuta-dim)]'}>
                  {clearance.sabCaught ? '✓' : '○'} Lecture Sabotage ({clearance.sabCaught ? 'Caught' : 'Optional'})
                </li>
              </ul>
            </div>

            <div className="border-b border-[var(--shuta-line)] pb-5">
              <div className="shuta-chrome mb-2 text-[var(--shuta-dim)]">Governing Equations</div>
              <div
                className="border-l-2 border-[var(--shuta-ink)] bg-[var(--shuta-panel)] px-3.5 py-2.5 font-mono text-xs leading-relaxed text-[var(--shuta-ink)]"
                dangerouslySetInnerHTML={{ __html: liveFormulaHtml || theory?.formulas || '' }}
              />
            </div>

            {cap && (
              <div className="border-b border-[var(--shuta-line)] pb-5">
                <div className="shuta-chrome mb-2 text-[var(--shuta-dim)]">Unlockable Capability</div>
                <div className="flex items-center gap-2">
                  <Pill tone="ink">{cap.badge}</Pill>
                  <span className="font-display text-sm font-bold uppercase text-[var(--shuta-ink)]">{cap.name}</span>
                </div>
                <p className="mt-1.5 font-serif text-sm text-[var(--text-secondary)]">{cap.desc}</p>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="shuta-chrome text-[var(--shuta-dim)]">Personal Notes (Auto-Saved)</span>
                <Button size="sm" variant="outline" onClick={exportNotesMarkdown}>
                  <Download className="h-3 w-3" /> Export .md
                </Button>
              </div>
              <Textarea
                value={state.notes[node.id] || ''}
                onChange={(e) => updateNote(node.id, e.target.value)}
                placeholder="Write mnemonics, edge-case exam traps, or worked derivations for this plate..."
              />
            </div>
          </div>
        </ShutaDrawerPanel>
      </ShutaDrawer>
    </ClickSpark>
  );
};
