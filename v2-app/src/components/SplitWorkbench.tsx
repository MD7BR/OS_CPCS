import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Cpu,
  Download,
  FileText,
  Sparkles,
  Star,
  Target,
  X,
} from 'lucide-react';
import { CAPABILITIES, CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { THEORY_KNOWLEDGE_BASE } from '@/data/trove';
import { useKernelStore } from '@/store/useKernelStore';
import { ClickSpark, DecryptedText, Magnet, ShinyText } from '@/components/reactbits';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/primitives';
import { KernelSheet, KernelSheetPanel } from '@/components/ui/overlays';
import {
  KernelTabs,
  KernelTabsContent,
  KernelTabsList,
  KernelTabsTrigger,
  SplitHandle,
  SplitPanel,
  SplitPanelGroup,
} from '@/components/ui/interactive';
import { TheoryPedagogyPane } from './TheoryPedagogyPane';
import { SimulatorHost } from './SimulatorHost';
import { ExamDrillPane } from './ExamDrillPane';

type DesktopLayout = 'split' | 'theory' | 'lab';
type RightPaneTab = 'sim' | 'quiz';
type MobileTab = 'theory' | 'sim' | 'quiz';

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
  const [rightTab, setRightTab] = useState<RightPaneTab>('sim');
  const [mobileTab, setMobileTab] = useState<MobileTab>('theory');
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

  // Keyboard shortcuts inside Workbench: ESC close, [ / ] prev/next, 1/2/3 layout/tab
  useEffect(() => {
    if (!activeDeckId) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Escape') {
        if (codexOpen) setCodexOpen(false);
        else setActiveDeckId(null);
      } else if (e.key === '[') {
        stepDeck(-1);
      } else if (e.key === ']') {
        stepDeck(1);
      } else if (e.key === '1') {
        setDesktopLayout('split');
        setMobileTab('sim');
        setRightTab('sim');
      } else if (e.key === '2') {
        setDesktopLayout('theory');
        setMobileTab('theory');
      } else if (e.key === '3') {
        setRightTab('quiz');
        setMobileTab('quiz');
      }
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
    <ClickSpark sparkColor="#00FFA3" sparkCount={10} sparkRadius={22} className="fixed inset-0 z-40 flex flex-col bg-background">
      {/* Workbench Top Breadcrumb & Controls Bar */}
      <header className="relative flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/95 px-3 py-2.5 md:px-4">
        {/* Reading Progress Micro-Bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Badge variant="outline" style={{ borderColor: `${sector?.color}66`, color: sector?.color }}>
            {sector?.shortName}
          </Badge>
          <Badge variant="default">DECK {node.deckNumber}</Badge>
          <h1 className="truncate font-display text-sm font-bold tracking-wide text-foreground md:text-base">
            <DecryptedText text={node.shortTitle} speed={24} maxIterations={8} />
          </h1>
          <span className="hidden font-mono text-[10.5px] text-muted-foreground xl:inline">
            · {node.silberschatz.chapter} ({node.silberschatz.sections})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Desktop Split Presets */}
          {isDesktop && (
            <div className="mr-1 inline-flex items-center rounded-md border border-border bg-muted/80 p-0.5">
              <button
                type="button"
                onClick={() => setDesktopLayout('split')}
                className={`inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] font-semibold ${
                  desktopLayout === 'split' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Synchronized Split View (Theory + Live Simulator)"
              >
                <Columns2 className="h-3 w-3" />
                Split Lab
              </button>
              <button
                type="button"
                onClick={() => setDesktopLayout('theory')}
                className={`inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] font-semibold ${
                  desktopLayout === 'theory' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="h-3 w-3" />
                Theory
              </button>
              <button
                type="button"
                onClick={() => setDesktopLayout('lab')}
                className={`inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[10px] font-semibold ${
                  desktopLayout === 'lab' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Cpu className="h-3 w-3" />
                Lab
              </button>
            </div>
          )}

          <Button size="sm" variant="secondary" onClick={() => stepDeck(-1)} title="Previous Deck ([)">
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </Button>
          <Button size="sm" variant="secondary" onClick={() => stepDeck(1)} title="Next Deck (])">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={flagged ? 'cyber' : 'secondary'}
            onClick={() => toggleFlagDeck(node.id)}
            title="Flag deck for targeted review"
          >
            <Star className="h-3.5 w-3.5" fill={flagged ? 'currentColor' : 'none'} />
            <span className="hidden md:inline">{flagged ? 'Flagged' : 'Flag'}</span>
          </Button>
          <Button size="sm" variant="cyber" onClick={() => setCodexOpen(true)}>
            <FileText className="h-3.5 w-3.5" />
            Codex &amp; Notes
          </Button>

          <Magnet padding={12} magnetStrength={6}>
            <Button
              size="sm"
              variant={mastered ? 'emerald' : 'default'}
              onClick={() => synthesizeNode(node.id)}
            >
              {mastered ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              {mastered ? 'Mastered' : cap ? `Synthesize ${cap.badge}` : 'Mark Mastered'}
            </Button>
          </Magnet>

          <Button size="sm" variant="outline" onClick={() => setActiveDeckId(null)} title="Close Workbench (ESC)">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* Anomaly Alert Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-destructive/30 bg-destructive/10 px-4 py-1.5 font-mono text-[11px]">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span className="font-bold">{node.anomaly.title}:</span>
          <span className="text-foreground/85">{node.anomaly.brief}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Sim {clearance.simDone ? '✓' : '·'}</span>
          <span>Quiz {clearance.qBest}/{clearance.qTotal}</span>
          <span>Bugs {clearance.bugsSolved}/{clearance.bugsTotal}</span>
        </div>
      </div>

      {/* Main Content Area: Synchronized Split Workbench (Desktop) OR 3-Tab View (Mobile/iPad Portrait) */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {isDesktop ? (
          desktopLayout === 'split' ? (
            <SplitPanelGroup direction="horizontal" className="h-full">
              {/* LEFT PANE (52%): Exhaustive OS Theory & Active Pedagogy */}
              <SplitPanel defaultSize={52} minSize={30}>
                <div onScroll={handleTheoryScroll} className="h-full overflow-y-auto p-4 md:p-5">
                  <TheoryPedagogyPane deckId={node.id} />
                </div>
              </SplitPanel>

              <SplitHandle />

              {/* RIGHT PANE (48%): Synchronized Interactive Simulator + 5-MCQ Exam Drill */}
              <SplitPanel defaultSize={48} minSize={30}>
                <div className="flex h-full flex-col overflow-hidden bg-background/60">
                  <div className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-2">
                    <KernelTabs value={rightTab} onValueChange={(v) => setRightTab(v as RightPaneTab)}>
                      <KernelTabsList>
                        <KernelTabsTrigger value="sim">
                          <Cpu className="h-3.5 w-3.5" />
                          Live Simulator &amp; Math
                        </KernelTabsTrigger>
                        <KernelTabsTrigger value="quiz">
                          <Target className="h-3.5 w-3.5" />
                          Exam Drill ({clearance.qBest}/{clearance.qTotal})
                        </KernelTabsTrigger>
                      </KernelTabsList>
                    </KernelTabs>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Drag center handle to resize ⇄
                    </span>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    {rightTab === 'sim' ? (
                      <SimulatorHost deckId={node.id} onFormulasExtracted={setLiveFormulaHtml} />
                    ) : (
                      <ExamDrillPane deckId={node.id} />
                    )}
                  </div>
                </div>
              </SplitPanel>
            </SplitPanelGroup>
          ) : desktopLayout === 'theory' ? (
            <div onScroll={handleTheoryScroll} className="mx-auto h-full max-w-5xl overflow-y-auto p-5">
              <TheoryPedagogyPane deckId={node.id} />
            </div>
          ) : (
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-center border-b border-border bg-card/60 px-4 py-2">
                <KernelTabs value={rightTab} onValueChange={(v) => setRightTab(v as RightPaneTab)}>
                  <KernelTabsList>
                    <KernelTabsTrigger value="sim">
                      <Cpu className="h-3.5 w-3.5" />
                      Live Simulator &amp; Handwritten Math
                    </KernelTabsTrigger>
                    <KernelTabsTrigger value="quiz">
                      <Target className="h-3.5 w-3.5" />
                      Exam Drill ({clearance.qBest}/{clearance.qTotal})
                    </KernelTabsTrigger>
                  </KernelTabsList>
                </KernelTabs>
              </div>
              <div className="mx-auto min-h-0 w-full max-w-6xl flex-1 overflow-y-auto p-5">
                {rightTab === 'sim' ? (
                  <SimulatorHost deckId={node.id} onFormulasExtracted={setLiveFormulaHtml} />
                ) : (
                  <ExamDrillPane deckId={node.id} />
                )}
              </div>
            </div>
          )
        ) : (
          /* Mobile / iPad Portrait 3-Tab Segmented View */
          <KernelTabs
            value={mobileTab}
            onValueChange={(v) => setMobileTab(v as MobileTab)}
            className="flex h-full flex-col overflow-hidden"
          >
            <div className="border-b border-border bg-card/80 px-3 py-2">
              <KernelTabsList className="grid w-full grid-cols-3">
                <KernelTabsTrigger value="theory">
                  <BookOpen className="h-3.5 w-3.5" />
                  Theory
                </KernelTabsTrigger>
                <KernelTabsTrigger value="sim">
                  <Cpu className="h-3.5 w-3.5" />
                  Simulator
                </KernelTabsTrigger>
                <KernelTabsTrigger value="quiz">
                  <Target className="h-3.5 w-3.5" />
                  Drill ({clearance.qBest}/{clearance.qTotal})
                </KernelTabsTrigger>
              </KernelTabsList>
            </div>

            <KernelTabsContent
              value="theory"
              onScroll={handleTheoryScroll}
              className="min-h-0 flex-1 overflow-y-auto p-3"
              style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
            >
              <TheoryPedagogyPane deckId={node.id} />
            </KernelTabsContent>
            <KernelTabsContent
              value="sim"
              className="min-h-0 flex-1 overflow-y-auto p-3"
              style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
            >
              <SimulatorHost deckId={node.id} onFormulasExtracted={setLiveFormulaHtml} />
            </KernelTabsContent>
            <KernelTabsContent
              value="quiz"
              className="min-h-0 flex-1 overflow-y-auto p-3"
              style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
            >
              <ExamDrillPane deckId={node.id} />
            </KernelTabsContent>
          </KernelTabs>
        )}
      </div>

      {/* Silberschatz 10th Ed. Codex & Auto-Saved Personal Notes Sheet */}
      <KernelSheet open={codexOpen} onOpenChange={setCodexOpen}>
        <KernelSheetPanel
          side="right"
          title="Silberschatz 10th Ed. Codex"
          badge={<Badge variant="default">{node.silberschatz.chapter}</Badge>}
        >
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-border bg-card p-3">
              <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                Room Clearance Telemetry
              </div>
              <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                <li className={clearance.simDone ? 'text-accent' : ''}>
                  {clearance.simDone ? '✓' : '○'} Interactive Simulator Inspected (+15 XP)
                </li>
                <li className={clearance.qBest >= 3 ? 'text-accent' : ''}>
                  {clearance.qBest >= 3 ? '✓' : '○'} Exam Drill Clearance ({clearance.qBest}/{clearance.qTotal})
                </li>
                <li className={clearance.bugsSolved > 0 ? 'text-accent' : ''}>
                  {clearance.bugsSolved > 0 ? '✓' : '○'} Bug Hunt Audits ({clearance.bugsSolved}/{clearance.bugsTotal})
                </li>
                <li className={clearance.sabCaught ? 'text-accent' : ''}>
                  {clearance.sabCaught ? '✓' : '○'} Lecture Sabotage ({clearance.sabCaught ? 'Caught' : 'Optional'})
                </li>
              </ul>
            </div>

            <div className="rounded-md border border-border bg-card p-3">
              <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Textbook Correlation
              </div>
              <p className="font-sans text-xs font-semibold text-foreground">
                Silberschatz, Galvin, Gagne — <em>Operating System Concepts (10th Ed.)</em>
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-primary">
                {node.silberschatz.chapter} ({node.silberschatz.sections}) · {node.silberschatz.title}
              </p>
            </div>

            <div className="rounded-md border border-primary/30 bg-muted/60 p-3">
              <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                Governing Formulas
              </div>
              <div
                className="font-mono text-[11.5px] leading-relaxed text-foreground"
                dangerouslySetInnerHTML={{ __html: liveFormulaHtml || theory?.formulas || '' }}
              />
            </div>

            {cap && (
              <div className="rounded-md border border-primary/30 bg-primary/10 p-3">
                <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                  Capability Unlock Reward
                </div>
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span>{cap.icon}</span>
                  <ShinyText text={cap.badge} />
                  <span className="text-foreground">{cap.name}</span>
                </div>
                <p className="mt-1 font-sans text-xs text-muted-foreground">{cap.desc}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Personal Deck Notes (Auto-Saved)
                </span>
                <Button size="sm" variant="outline" onClick={exportNotesMarkdown}>
                  <Download className="h-3 w-3" />
                  Export .md
                </Button>
              </div>
              <Textarea
                value={state.notes[node.id] || ''}
                onChange={(e) => updateNote(node.id, e.target.value)}
                placeholder="Write mnemonics, exam traps, or worked formulas for this deck..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        </KernelSheetPanel>
      </KernelSheet>
    </ClickSpark>
  );
};
