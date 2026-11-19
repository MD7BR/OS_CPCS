import React, { useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Heart,
  Search,
  ShieldAlert,
  Swords,
  Upload,
  XCircle,
} from 'lucide-react';
import { CURRICULUM_NODES, MOCK_EXAM_QUESTIONS, SECTORS } from '@/data/curriculum';
import { FORMULAS_DATA, GLOSSARY_DATA, QUIZ_KNOWLEDGE_BASE, TEACHING_TROVE_DATA } from '@/data/trove';
import { KERNEL_ACHIEVEMENTS, useKernelStore } from '@/store/useKernelStore';
import { Sound } from '@/lib/sound';
import { AnimatedList, CountUp, ShinyText, StarBorder } from '@/components/reactbits';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Progress } from '@/components/ui/primitives';
import { KernelDialog, KernelDialogBody } from '@/components/ui/overlays';
import {
  KernelAccordion,
  KernelAccordionContent,
  KernelAccordionItem,
  KernelAccordionTrigger,
} from '@/components/ui/interactive';
import type { ModalId } from './CommandPalette';

interface ModalsSuiteProps {
  activeModal: ModalId;
  raidSectorId: string | null;
  onClose: () => void;
  onOpenBossRaid: (sectorId: string | null) => void;
}

interface ArenaQuestion {
  sourceLabel: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const ModalsSuite: React.FC<ModalsSuiteProps> = ({
  activeModal,
  raidSectorId,
  onClose,
}) => {
  const {
    state,
    rankInfo,
    markBossCleared,
    exportBackupJson,
    importBackupJson,
    exportNotesMarkdown,
    markTutorialSeen,
  } = useKernelStore();

  const [formulaCat, setFormulaCat] = useState('ALL');
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [tutStep, setTutStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Boss Raid State
  const [arenaActive, setArenaActive] = useState<{
    sectorId: string;
    title: string;
    questions: ArenaQuestion[];
    idx: number;
    hp: number;
    score: number;
    picked: number | null;
  } | null>(null);

  const formulaCategories = useMemo(
    () => ['ALL', ...Array.from(new Set(FORMULAS_DATA.map((f) => f.category)))],
    []
  );

  const filteredFormulas = useMemo(
    () => (formulaCat === 'ALL' ? FORMULAS_DATA : FORMULAS_DATA.filter((f) => f.category === formulaCat)),
    [formulaCat]
  );

  const filteredGlossary = useMemo(() => {
    const q = glossaryQuery.trim().toLowerCase();
    if (!q) return GLOSSARY_DATA;
    return GLOSSARY_DATA.filter(
      (g) => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q) || g.mod.toLowerCase().includes(q)
    );
  }, [glossaryQuery]);

  const startBossGauntlet = (sectorId: string) => {
    const sec = SECTORS.find((s) => s.id === sectorId);
    const pool: ArenaQuestion[] = [];
    const targetDeckIds = sec ? sec.nodes : CURRICULUM_NODES.map((n) => n.id);
    for (const did of targetDeckIds) {
      const node = CURRICULUM_NODES.find((n) => n.id === did);
      const qs = QUIZ_KNOWLEDGE_BASE[did] || [];
      qs.forEach((q) =>
        pool.push({
          sourceLabel: `Deck ${node?.deckNumber} · MCQ`,
          prompt: q.q,
          options: q.opts || [],
          answer: q.answer,
          explanation: q.explanation,
        })
      );
      const hunts = TEACHING_TROVE_DATA[did]?.bugHunts || [];
      hunts.forEach((h) =>
        pool.push({
          sourceLabel: `Deck ${node?.deckNumber} · Bug Hunt`,
          prompt: `${h.type} — ${h.prompt}`,
          options: h.items || [],
          answer: h.bugIdx,
          explanation: h.fix,
        })
      );
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    Sound.modeSwitch();
    setArenaActive({
      sectorId,
      title: sec ? `${sec.name} Boss Gauntlet` : 'Weak-Spot Survival Raid',
      questions: shuffled,
      idx: 0,
      hp: 3,
      score: 0,
      picked: null,
    });
  };

  const TUTORIAL_SLIDES = [
    {
      title: '1 / 6 · Dual-Lens Navigation & Command-K',
      body: 'Switch seamlessly with TAB between the Silicon Die Map (pan/pinch hardware wafer with 12 capability gates) and the 7-Sector Bento Track. Press ⌘K / Ctrl+K anytime to jump to any of the 21 decks, 134 glossary terms, or 26 formulas.',
    },
    {
      title: '2 / 6 · Synchronized Split-Screen Workbench',
      body: 'On desktop and iPad landscape, read exhaustive Silberschatz 10th Ed. theory on the left while stepping through live interactive simulators (W0–W19) and handwritten exam math sheets on the right. Drag the center handle to resize or switch to Full Theory / Full Lab.',
    },
    {
      title: '3 / 6 · Active Pedagogy & Inline Glossary Hover',
      body: 'Hover any color-coded OS keyword inside theory to see its instant glossary definition. Use the 4-color Highlighter (desktop drag or mobile touch), Recall Blur for cloze self-testing, and Lecture Sabotage mode to catch silently injected factual lies.',
    },
    {
      title: '4 / 6 · Handwritten Exam Workings & Formula Sandboxes',
      body: 'Every numerical simulator renders a ruled Blueprint Sheet ("As Written By Hand") updating live as you drag sliders for Quantum q, Smoothing α, TLB Hit Ratio, Page Frames, and Disk Cylinders.',
    },
    {
      title: '5 / 6 · Red Pill (Full Access Mode) & Blue Pill',
      body: 'Need urgent exam cramming? Red Pill unlocks all 21 rooms & 12 capabilities immediately (Full Access Mode). Blue Pill resets mastery & XP back to Deck 02 while keeping your written Notes and Highlights safe.',
    },
    {
      title: '6 / 6 · Unofficial AI Study Companion Notice',
      body: 'This project is an unofficial, AI-generated independent study tool aligned with Silberschatz Operating System Concepts (10th Ed.), with zero affiliation to any instructor, faculty, or university. Always cross-check against official course materials.',
    },
  ];

  return (
    <>
      {/* 1. MASTER FORMULA SHEET */}
      <KernelDialog open={activeModal === 'formulas'} onOpenChange={(o) => !o && onClose()}>
        <KernelDialogBody
          title={
            <>
              <FileSpreadsheet className="h-4 w-4" />
              MASTER FORMULA SHEET ({FORMULAS_DATA.length} FORMULAS)
            </>
          }
          subtitle="Silberschatz 10th Ed. governing equations & exam identities"
          maxWidth="max-w-5xl"
        >
          <div className="mb-4 flex flex-wrap gap-1.5">
            {formulaCategories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={formulaCat === cat ? 'cyber' : 'secondary'}
                onClick={() => setFormulaCat(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <AnimatedList
            items={filteredFormulas}
            keyExtractor={(f, i) => `${f.name}-${i}`}
            className="grid grid-cols-1 gap-3 md:grid-cols-2"
            renderItem={(f) => (
              <div className="flex h-full flex-col justify-between gap-2 rounded-lg border border-border bg-card p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-xs font-bold text-foreground">{f.name}</h4>
                  <Badge variant="outline">{f.category}</Badge>
                </div>
                <div
                  className="rounded border-l-2 border-primary bg-muted/70 px-3 py-2 font-mono text-xs text-primary"
                  dangerouslySetInnerHTML={{ __html: f.formula }}
                />
                <p className="font-sans text-[11.5px] leading-relaxed text-muted-foreground">{f.desc}</p>
                {f.vars && (
                  <p className="font-mono text-[10px] text-muted-foreground/80">
                    <strong>Vars:</strong> {f.vars}
                  </p>
                )}
              </div>
            )}
          />
        </KernelDialogBody>
      </KernelDialog>

      {/* 2. A-Z GLOSSARY */}
      <KernelDialog open={activeModal === 'glossary'} onOpenChange={(o) => !o && onClose()}>
        <KernelDialogBody
          title={
            <>
              <BookOpen className="h-4 w-4" />
              A–Z OPERATING SYSTEMS GLOSSARY ({filteredGlossary.length} / {GLOSSARY_DATA.length})
            </>
          }
          subtitle="Instant search across Silberschatz 10th Ed. terms & definitions"
          maxWidth="max-w-5xl"
        >
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              value={glossaryQuery}
              onChange={(e) => setGlossaryQuery(e.target.value)}
              placeholder="Filter concepts (e.g. semaphore, thrashing, convoy, aging, TLB)..."
              className="pl-9"
            />
          </div>
          <AnimatedList
            items={filteredGlossary}
            keyExtractor={(g, i) => `${g.term}-${i}`}
            className="grid grid-cols-1 gap-2.5 md:grid-cols-2"
            renderItem={(g) => (
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-display text-xs font-bold text-primary">{g.term}</span>
                  <Badge variant="outline">{g.mod}</Badge>
                </div>
                <p className="font-sans text-xs leading-relaxed text-muted-foreground">{g.def}</p>
              </div>
            )}
          />
        </KernelDialogBody>
      </KernelDialog>

      {/* 3. 30-MARK UNOFFICIAL AI PRACTICE MOCK MIDTERM */}
      <KernelDialog open={activeModal === 'exam'} onOpenChange={(o) => !o && onClose()}>
        <KernelDialogBody
          title={
            <>
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              UNOFFICIAL AI PRACTICE MOCK MIDTERM (30 MARKS)
            </>
          }
          subtitle="Independent AI-generated practice exam · Not affiliated with any instructor or faculty"
          maxWidth="max-w-4xl"
        >
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 font-sans text-xs text-foreground">
            <strong>Disclaimer:</strong> Unofficial AI-generated practice exam based on Silberschatz 10th Ed. OS concepts.
            Expand any rubric below after working through the problem on paper.
          </div>

          <div className="flex flex-col gap-4">
            {MOCK_EXAM_QUESTIONS.map((q) => (
              <div key={q.id} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between border-b border-border pb-2 font-mono text-[11px] font-bold">
                  <span className="text-primary">
                    {q.number} ({q.points} POINTS)
                  </span>
                  <Badge variant="amber">{q.topic}</Badge>
                </div>
                <KernelAccordion type="multiple" className="flex flex-col gap-2.5">
                  {q.parts.map((part, pIdx) => (
                    <KernelAccordionItem key={pIdx} value={`${q.id}-${pIdx}`}>
                      <div className="pt-2.5 font-sans text-xs font-semibold text-foreground">{part.label}</div>
                      <div
                        className="pt-1 font-sans text-xs leading-relaxed text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: part.promptHtml }}
                      />
                      <KernelAccordionTrigger className="font-mono text-[11px] text-primary">
                        Reveal Model Answer &amp; Rubric
                      </KernelAccordionTrigger>
                      <KernelAccordionContent>
                        <div
                          className="rounded border-l-2 border-accent bg-accent/10 px-3 py-2 font-sans text-xs leading-relaxed text-foreground"
                          dangerouslySetInnerHTML={{ __html: part.answerHtml }}
                        />
                      </KernelAccordionContent>
                    </KernelAccordionItem>
                  ))}
                </KernelAccordion>
              </div>
            ))}
          </div>
        </KernelDialogBody>
      </KernelDialog>

      {/* 4. SECTOR BOSS RAID ARENA */}
      <KernelDialog
        open={activeModal === 'raid'}
        onOpenChange={(o) => {
          if (!o) {
            setArenaActive(null);
            onClose();
          }
        }}
      >
        <KernelDialogBody
          title={
            <>
              <Swords className="h-4 w-4 text-destructive" />
              SECTOR BOSS RAID ARENA
            </>
          }
          subtitle="6-question rapid survival gauntlet · 3 Kernel Integrity Hearts"
          maxWidth="max-w-4xl"
        >
          {!arenaActive ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {SECTORS.map((sec) => {
                const cleared = state.clearedBosses.includes(sec.id);
                const focused = raidSectorId === sec.id;
                return (
                  <StarBorder key={sec.id} active={focused || !cleared} color={sec.color} speed="4.5s">
                    <div className="flex h-full flex-col justify-between gap-3 p-4">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold" style={{ color: sec.color }}>
                            {sec.hex}
                          </span>
                          <Badge variant={cleared ? 'emerald' : 'destructive'}>
                            {cleared ? '✓ BOSS CLEARED' : 'HOSTILE'}
                          </Badge>
                        </div>
                        <h4 className="font-display text-sm font-bold text-foreground">{sec.name}</h4>
                        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                          Scope: {sec.bookChapters} ({sec.nodes.length} Decks)
                        </p>
                      </div>
                      <Button size="sm" variant="cyber" onClick={() => startBossGauntlet(sec.id)}>
                        <Swords className="h-3.5 w-3.5" />
                        Engage Boss Gauntlet (+120 XP)
                      </Button>
                    </div>
                  </StarBorder>
                );
              })}
            </div>
          ) : arenaActive.hp <= 0 || arenaActive.idx >= arenaActive.questions.length ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="font-display text-xl font-bold text-foreground">
                {arenaActive.hp > 0 ? '🛡️ SECTOR BOSS NEUTRALIZED!' : '💥 KERNEL PANIC — GAUNTLET FAILED'}
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Final Score: {arenaActive.score} / {arenaActive.questions.length} · Remaining Integrity: {arenaActive.hp}/3
              </p>
              <div className="flex gap-2">
                <Button variant="cyber" onClick={() => setArenaActive(null)}>
                  Return to Sector Select
                </Button>
                <Button variant="secondary" onClick={() => startBossGauntlet(arenaActive.sectorId)}>
                  Retry Gauntlet
                </Button>
              </div>
            </div>
          ) : (
            (() => {
              const q = arenaActive.questions[arenaActive.idx];
              return (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between rounded-md border border-border bg-card px-3.5 py-2.5">
                    <div>
                      <div className="font-display text-xs font-bold text-primary">{arenaActive.title}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        Wave {arenaActive.idx + 1} / {arenaActive.questions.length} · {q.sourceLabel}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <Heart
                          key={i}
                          className={`h-4 w-4 ${i < arenaActive.hp ? 'text-destructive' : 'text-muted-foreground/30'}`}
                          fill={i < arenaActive.hp ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="font-sans text-sm font-semibold text-foreground">{q.prompt}</p>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const answered = arenaActive.picked !== null;
                      const isCorrect = oIdx === q.answer;
                      const isChosen = arenaActive.picked === oIdx;
                      let cls = 'border-border bg-secondary/60 text-foreground hover:border-primary';
                      if (answered) {
                        if (isCorrect) cls = 'border-accent bg-accent/15 text-accent';
                        else if (isChosen) cls = 'border-destructive bg-destructive/15 text-destructive';
                        else cls = 'border-border/50 opacity-60';
                      }
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={answered}
                          onClick={() => {
                            const ok = oIdx === q.answer;
                            if (ok) Sound.click(1150);
                            else Sound.alarm();
                            setArenaActive((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    picked: oIdx,
                                    score: prev.score + (ok ? 1 : 0),
                                    hp: prev.hp - (ok ? 0 : 1),
                                  }
                                : null
                            );
                          }}
                          className={`flex items-start gap-2 rounded-md border px-3 py-2.5 text-left font-sans text-xs transition-colors ${cls}`}
                        >
                          {!/^([A-D]\)|\d+\.)\s/.test(opt) && (
                            <span className="font-mono text-[10px] font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          )}
                          <span className="flex-1">{opt}</span>
                          {answered && isCorrect && <CheckCircle2 className="h-4 w-4 text-accent" />}
                          {answered && isChosen && !isCorrect && <XCircle className="h-4 w-4 text-destructive" />}
                        </button>
                      );
                    })}
                  </div>

                  {arenaActive.picked !== null && (
                    <div className="flex flex-col gap-3">
                      <div className="rounded border-l-2 border-primary bg-muted/60 px-3 py-2 font-sans text-xs text-muted-foreground">
                        {q.explanation}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="default"
                          onClick={() => {
                            const nextIdx = arenaActive.idx + 1;
                            if (arenaActive.hp > 0 && nextIdx >= arenaActive.questions.length) {
                              markBossCleared(arenaActive.sectorId, 120);
                            }
                            setArenaActive((prev) => (prev ? { ...prev, idx: nextIdx, picked: null } : null));
                          }}
                        >
                          {arenaActive.idx + 1 >= arenaActive.questions.length ? 'Finish Gauntlet' : 'Next Wave →'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </KernelDialogBody>
      </KernelDialog>

      {/* 5. OPERATOR PROFILE & BACKUP */}
      <KernelDialog open={activeModal === 'profile'} onOpenChange={(o) => !o && onClose()}>
        <KernelDialogBody
          title={
            <>
              <Award className="h-4 w-4" />
              OPERATOR PROFILE &amp; TELEMETRY
            </>
          }
          subtitle="XP Progression, Achievements, JSON Backup & Markdown Notes"
          maxWidth="max-w-3xl"
        >
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="font-mono text-[10px] text-muted-foreground">TOTAL XP</div>
              <div className="mt-1 font-display text-lg font-bold text-primary">
                <CountUp to={state.xp} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="font-mono text-[10px] text-muted-foreground">RANK</div>
              <div className="mt-1 font-display text-sm font-bold">
                <ShinyText text={`LVL ${rankInfo.level} · ${rankInfo.short}`} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="font-mono text-[10px] text-muted-foreground">DECKS MASTERED</div>
              <div className="mt-1 font-display text-lg font-bold text-accent">
                {state.masteredNodes.length} / 21
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="font-mono text-[10px] text-muted-foreground">BEST STREAK</div>
              <div className="mt-1 font-display text-lg font-bold text-amber-400">{state.bestStreak}x</div>
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-border bg-card p-3">
            <div className="mb-1.5 flex items-center justify-between font-mono text-[11px]">
              <span className="text-foreground">{rankInfo.title}</span>
              <span className="text-muted-foreground">{rankInfo.pct}% to next tier</span>
            </div>
            <Progress value={rankInfo.pct} />
          </div>

          <div className="mb-4">
            <h4 className="mb-2 font-mono text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
              Kernel Achievements ({state.unlockedAchievements.length} / {KERNEL_ACHIEVEMENTS.length})
            </h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {KERNEL_ACHIEVEMENTS.map((a) => {
                const earned = state.unlockedAchievements.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={`flex items-start gap-2.5 rounded-md border p-2.5 ${
                      earned ? 'border-accent/50 bg-accent/10' : 'border-border bg-muted/40 opacity-60'
                    }`}
                  >
                    <span className="text-base">{a.icon}</span>
                    <div>
                      <div className="font-display text-xs font-bold text-foreground">{a.title}</div>
                      <div className="font-sans text-[11px] text-muted-foreground">{a.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <Button size="sm" variant="cyber" onClick={exportBackupJson}>
              <Download className="h-3.5 w-3.5" />
              Export JSON Backup
            </Button>
            <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" />
              Import JSON Backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importBackupJson(f);
              }}
            />
            <Button size="sm" variant="emerald" onClick={exportNotesMarkdown}>
              <Download className="h-3.5 w-3.5" />
              Export Notes (.md)
            </Button>
          </div>
        </KernelDialogBody>
      </KernelDialog>

      {/* 6. 6-STEP INTERACTIVE TUTORIAL */}
      <KernelDialog
        open={activeModal === 'tutorial'}
        onOpenChange={(o) => {
          if (!o) {
            markTutorialSeen();
            onClose();
          }
        }}
      >
        <KernelDialogBody
          title={
            <>
              <GraduationCap className="h-4 w-4" />
              KERNEL//BREACH v2 · SOVEREIGN SPLIT-DECK GUIDE
            </>
          }
          subtitle="6-Step Quick Orientation"
          maxWidth="max-w-xl"
        >
          <div className="rounded-lg border border-primary/30 bg-card p-4">
            <div className="mb-2 font-display text-sm font-bold text-primary">
              {TUTORIAL_SLIDES[tutStep].title}
            </div>
            <p className="font-sans text-xs leading-relaxed text-foreground">{TUTORIAL_SLIDES[tutStep].body}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button size="sm" variant="secondary" disabled={tutStep === 0} onClick={() => setTutStep((s) => s - 1)}>
              ← Back
            </Button>
            <span className="font-mono text-[11px] text-muted-foreground">
              {tutStep + 1} / {TUTORIAL_SLIDES.length}
            </span>
            {tutStep < TUTORIAL_SLIDES.length - 1 ? (
              <Button size="sm" variant="default" onClick={() => setTutStep((s) => s + 1)}>
                Next →
              </Button>
            ) : (
              <Button
                size="sm"
                variant="emerald"
                onClick={() => {
                  markTutorialSeen();
                  onClose();
                }}
              >
                Launch Workspace ✓
              </Button>
            )}
          </div>
        </KernelDialogBody>
      </KernelDialog>
    </>
  );
};
