import React, { useMemo, useRef, useState } from 'react';
import { Check, Download, Heart, Search, Upload, X } from 'lucide-react';
import { CURRICULUM_NODES, MOCK_EXAM_QUESTIONS, SECTORS } from '@/data/curriculum';
import { FORMULAS_DATA, GLOSSARY_DATA, QUIZ_KNOWLEDGE_BASE, TEACHING_TROVE_DATA } from '@/data/trove';
import { KERNEL_ACHIEVEMENTS, useKernelStore } from '@/store/useKernelStore';
import { Sound } from '@/lib/sound';
import { AnimatedList, CountUp } from '@/components/reactbits';
import {
  Button,
  HairlineProgress,
  Input,
  Pill,
  ShutaAccordion,
  ShutaAccordionContent,
  ShutaAccordionItem,
  ShutaAccordionTrigger,
  ShutaDrawer,
  ShutaDrawerPanel,
  ShutaModal,
  ShutaModalBody,
  ShutaSwitch,
} from '@/components/ui';
import type { OverlayId } from './CommandPalette';

interface StudioDrawersProps {
  activeOverlay: OverlayId;
  raidSectorId: string | null;
  onClose: () => void;
}

interface ArenaQuestion {
  sourceLabel: string;
  prompt: string;
  opts: string[];
  answer: number;
  explanation: string;
}

export const StudioDrawers: React.FC<StudioDrawersProps> = ({ activeOverlay, raidSectorId, onClose }) => {
  const {
    state,
    rankInfo,
    markBossCleared,
    toggleStrictGate,
    exportBackupJson,
    importBackupJson,
    exportNotesMarkdown,
    markTutorialSeen,
  } = useKernelStore();

  const [formulaCat, setFormulaCat] = useState('ALL');
  const [glossaryQuery, setGlossaryQuery] = useState('');
  const [tutStep, setTutStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [arena, setArena] = useState<{
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
    const targetDecks = sec ? sec.nodes : CURRICULUM_NODES.map((n) => n.id);
    for (const did of targetDecks) {
      const node = CURRICULUM_NODES.find((n) => n.id === did);
      (QUIZ_KNOWLEDGE_BASE[did] || []).forEach((q) =>
        pool.push({
          sourceLabel: `Plate ${node?.deckNumber} · Drill`,
          prompt: q.q,
          opts: q.opts || [],
          answer: q.answer,
          explanation: q.explanation,
        })
      );
      (TEACHING_TROVE_DATA[did]?.bugHunts || []).forEach((h) =>
        pool.push({
          sourceLabel: `Plate ${node?.deckNumber} · Audit`,
          prompt: `${h.type} — ${h.prompt}`,
          opts: h.items || [],
          answer: h.bugIdx,
          explanation: h.fix,
        })
      );
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    Sound.modeSwitch();
    setArena({
      sectorId,
      title: sec ? sec.name : 'Full Archive Gauntlet',
      questions: shuffled,
      idx: 0,
      hp: 3,
      score: 0,
      picked: null,
    });
  };

  const GUIDE_STEPS = [
    {
      title: '01 · 3D Museum Maze, Kinetic Sculptures & Dollhouse Orbit',
      body: 'Explore 7 interconnected Three.js museum halls—each with a central kinetic 3D OS sculpture, recessed skylight lighting, and framed plates. Walk in first-person (WASD/Scroll, [L] for Mouse Free-Look) or press [V] for 3D Dollhouse Cutaway Orbit. Press TAB anytime to switch between Gallery, List, and Map.',
    },
    {
      title: '02 · Synchronized Split Monograph Workbench',
      body: 'On desktop and iPad landscape, read literary Newsreader serif chapters on the left while stepping through live OS hardware simulators (W0–W19) and ruled exam sheets on the right. Use [ and ] to flip seamlessly between plates.',
    },
    {
      title: '03 · Active Pedagogy & Inline Footnote Cards',
      body: 'Hover any highlighted OS term to inspect its Silberschatz glossary definition inline. Highlight passages persistently across sessions, activate Cloze Blur for recall testing, and hunt planted Lecture Sabotages.',
    },
    {
      title: '04 · Warm Gallery Stone & Pitch Obsidian',
      body: 'Toggle the Sun/Moon switch in the top exhibition bar to move effortlessly between Warm Gallery Paper (#F2F2F0) and Pitch Obsidian (#080807) with brushed ochre accents.',
    },
    {
      title: '05 · Full Access Mode & Non-Destructive Reset',
      body: 'Full Access Mode unlocks all 21 plates and 12 capabilities immediately for exam prep. Reset Archive returns mastery to Plate 02 while keeping your written Notes and Highlights intact.',
    },
    {
      title: '06 · Unofficial AI Study Companion Notice',
      body: 'KERNEL//BREACH is an unofficial, AI-generated independent study companion aligned with Silberschatz 10th Ed., with zero relation or endorsement from any instructor, faculty, or university.',
    },
  ];

  return (
    <>
      {/* 1. MASTER FORMULA SHEET SLIDE-OVER DRAWER */}
      <ShutaDrawer open={activeOverlay === 'formulas'} onOpenChange={(o) => !o && onClose()}>
        <ShutaDrawerPanel
          side="right"
          title="Formulas"
          kicker={`${FORMULAS_DATA.length} GOVERNING IDENTITIES · SILBERSCHATZ 10TH ED.`}
          widthClass="w-[min(42rem,100vw)]"
        >
          <div className="mb-5 flex flex-wrap gap-1.5">
            {formulaCategories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={formulaCat === cat ? 'ink' : 'outline'}
                onClick={() => setFormulaCat(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <AnimatedList
            items={filteredFormulas}
            keyExtractor={(f, i) => `${f.name}-${i}`}
            className="gap-4"
            renderItem={(f) => (
              <div className="border-b border-[var(--shuta-line)] pb-4">
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <h4 className="font-display text-sm font-extrabold uppercase text-[var(--shuta-ink)]">{f.name}</h4>
                  <Pill>{f.category}</Pill>
                </div>
                <div
                  className="my-2 border-l-2 border-[var(--shuta-ink)] bg-[var(--shuta-panel)] px-3 py-2 font-mono text-xs text-[var(--shuta-ink)]"
                  dangerouslySetInnerHTML={{ __html: f.formula }}
                />
                <p className="font-serif text-sm leading-relaxed text-[var(--text-secondary)]">{f.desc}</p>
                {f.vars && (
                  <p className="mt-1 font-mono text-[10.5px] text-[var(--shuta-dim)]">
                    <strong>Vars:</strong> {f.vars}
                  </p>
                )}
              </div>
            )}
          />
        </ShutaDrawerPanel>
      </ShutaDrawer>

      {/* 2. A-Z GLOSSARY SLIDE-OVER DRAWER */}
      <ShutaDrawer open={activeOverlay === 'glossary'} onOpenChange={(o) => !o && onClose()}>
        <ShutaDrawerPanel
          side="right"
          title="Glossary"
          kicker={`${filteredGlossary.length} / ${GLOSSARY_DATA.length} INDEXED OS CONCEPTS`}
          widthClass="w-[min(40rem,100vw)]"
        >
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--shuta-dim)]" />
            <Input
              value={glossaryQuery}
              onChange={(e) => setGlossaryQuery(e.target.value)}
              placeholder="Filter concepts (semaphore, thrashing, convoy, TLB)..."
              className="pl-9"
            />
          </div>
          <AnimatedList
            items={filteredGlossary}
            keyExtractor={(g, i) => `${g.term}-${i}`}
            className="gap-3"
            renderItem={(g) => (
              <div className="border-b border-[var(--shuta-line)] pb-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-display text-xs font-extrabold uppercase text-[var(--shuta-ink)]">
                    {g.term}
                  </span>
                  <Pill>{g.mod}</Pill>
                </div>
                <p className="font-serif text-sm leading-relaxed text-[var(--text-secondary)]">{g.def}</p>
              </div>
            )}
          />
        </ShutaDrawerPanel>
      </ShutaDrawer>

      {/* 3. 30-MARK PRACTICE MOCK MIDTERM */}
      <ShutaModal open={activeOverlay === 'exam'} onOpenChange={(o) => !o && onClose()}>
        <ShutaModalBody
          title="Unofficial AI Practice Mock Midterm"
          kicker="30 MARKS · 1 HOUR 20 MINS · NOT AFFILIATED WITH ANY INSTRUCTOR OR FACULTY"
          maxWidth="max-w-4xl"
        >
          <div className="mb-6 border-l-2 border-[var(--shuta-warn)] bg-[var(--shuta-panel)] px-4 py-3 font-serif text-sm text-[var(--text-secondary)]">
            Independent AI-generated practice exam based on Silberschatz 10th Ed. concepts. Work through each problem on
            paper before expanding the model rubric.
          </div>

          <div className="flex flex-col gap-6">
            {MOCK_EXAM_QUESTIONS.map((q) => (
              <div key={q.id} className="border-b border-[var(--shuta-line)] pb-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-sm font-extrabold uppercase text-[var(--shuta-ink)]">
                    {q.number} ({q.points} Points)
                  </span>
                  <Pill tone="warn">{q.topic}</Pill>
                </div>
                <ShutaAccordion type="multiple" className="border-t border-[var(--shuta-line)]">
                  {q.parts.map((part, pIdx) => (
                    <ShutaAccordionItem key={pIdx} value={`${q.id}-${pIdx}`}>
                      <div className="pt-3 font-serif text-sm font-semibold text-[var(--shuta-ink)]">{part.label}</div>
                      <div
                        className="pt-1 font-serif text-sm leading-relaxed text-[var(--text-secondary)]"
                        dangerouslySetInnerHTML={{ __html: part.promptHtml }}
                      />
                      <ShutaAccordionTrigger className="shuta-chrome text-[var(--shuta-dim)]">
                        Reveal Model Answer &amp; Rubric
                      </ShutaAccordionTrigger>
                      <ShutaAccordionContent>
                        <div
                          className="border-l-2 border-[var(--shuta-live)] bg-[var(--shuta-panel)] px-4 py-3 font-serif text-sm leading-relaxed text-[var(--shuta-ink)]"
                          dangerouslySetInnerHTML={{ __html: part.answerHtml }}
                        />
                      </ShutaAccordionContent>
                    </ShutaAccordionItem>
                  ))}
                </ShutaAccordion>
              </div>
            ))}
          </div>
        </ShutaModalBody>
      </ShutaModal>

      {/* 4. SECTOR BOSS GAUNTLET ARENA */}
      <ShutaModal
        open={activeOverlay === 'raid'}
        onOpenChange={(o) => {
          if (!o) {
            setArena(null);
            onClose();
          }
        }}
      >
        <ShutaModalBody
          title="Sector Gauntlet Arena"
          kicker="6-WAVE RAPID SURVIVAL AUDIT · 3 INTEGRITY HEARTS"
          maxWidth="max-w-4xl"
        >
          {!arena ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {SECTORS.map((sec, idx) => {
                const cleared = state.clearedBosses.includes(sec.id);
                const focused = raidSectorId === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`flex flex-col justify-between gap-4 rounded-[3px] border p-4 ${
                      focused ? 'border-[var(--shuta-ink)] bg-[var(--shuta-panel)]' : 'border-[var(--shuta-line)] bg-[var(--shuta-card)]'
                    }`}
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-display text-2xl font-extrabold leading-none text-[var(--shuta-ink)]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <Pill tone={cleared ? 'live' : 'error'}>{cleared ? 'Cleared' : 'Active'}</Pill>
                      </div>
                      <h4 className="font-display text-sm font-extrabold uppercase text-[var(--shuta-ink)]">
                        {sec.name.replace(/^Sector \d+:\s*/, '')}
                      </h4>
                      <p className="mt-1 shuta-chrome text-[var(--shuta-dim)]">
                        {sec.bookChapters} · {sec.nodes.length} Plates
                      </p>
                    </div>
                    <Button variant="ink" size="sm" onClick={() => startBossGauntlet(sec.id)}>
                      Engage Gauntlet (+120 XP) →
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : arena.hp <= 0 || arena.idx >= arena.questions.length ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="font-display text-2xl font-extrabold uppercase text-[var(--shuta-ink)]">
                {arena.hp > 0 ? 'Sector Gauntlet Cleared' : 'Kernel Fault — Gauntlet Ended'}
              </div>
              <p className="shuta-chrome text-[var(--shuta-dim)]">
                Score {arena.score}/{arena.questions.length} · Remaining Hearts {arena.hp}/3
              </p>
              <div className="flex gap-2">
                <Button variant="ink" onClick={() => setArena(null)}>
                  All Sectors
                </Button>
                <Button variant="outline" onClick={() => startBossGauntlet(arena.sectorId)}>
                  Replay
                </Button>
              </div>
            </div>
          ) : (
            (() => {
              const q = arena.questions[arena.idx];
              return (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-[var(--shuta-line)] pb-3">
                    <div>
                      <div className="font-display text-sm font-extrabold uppercase text-[var(--shuta-ink)]">
                        {arena.title}
                      </div>
                      <div className="shuta-chrome mt-0.5 text-[var(--shuta-dim)]">
                        Wave {arena.idx + 1} / {arena.questions.length} · {q.sourceLabel}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <Heart
                          key={i}
                          className={`h-4 w-4 ${i < arena.hp ? 'text-[var(--shuta-error)]' : 'text-[var(--shuta-line-strong)]'}`}
                          fill={i < arena.hp ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="font-serif text-base font-medium leading-relaxed text-[var(--shuta-ink)]">{q.prompt}</p>

                  <div className="grid grid-cols-1 gap-2">
                    {(q.opts || []).map((opt, oIdx) => {
                      const answered = arena.picked !== null;
                      const isCorrect = oIdx === q.answer;
                      const isChosen = arena.picked === oIdx;
                      let cls = 'border-[var(--shuta-line)] bg-[var(--shuta-card)] text-[var(--shuta-ink)] hover:border-[var(--shuta-ink)]';
                      if (answered) {
                        if (isCorrect) cls = 'border-[var(--shuta-live)] bg-[color-mix(in_srgb,var(--shuta-live)_10%,transparent)] text-[var(--shuta-live)]';
                        else if (isChosen) cls = 'border-[var(--shuta-error)] bg-[color-mix(in_srgb,var(--shuta-error)_9%,transparent)] text-[var(--shuta-error)]';
                        else cls = 'border-[var(--shuta-line)] opacity-55';
                      }
                      const hasPrefix = /^([A-D]\)|\d+\.)\s/.test(opt);
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={answered}
                          onClick={() => {
                            const ok = oIdx === q.answer;
                            if (ok) Sound.click(1150);
                            else Sound.alarm();
                            setArena((prev) =>
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
                          className={`flex items-start gap-2 rounded-[2px] border px-3.5 py-2.5 text-left font-serif text-sm transition-colors ${cls}`}
                        >
                          {!hasPrefix && (
                            <span className="mt-0.5 font-mono text-[10px] font-bold opacity-65">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                          )}
                          <span className="flex-1">{opt}</span>
                          {answered && isCorrect && <Check className="mt-0.5 h-4 w-4 text-[var(--shuta-live)]" />}
                          {answered && isChosen && !isCorrect && <X className="mt-0.5 h-4 w-4 text-[var(--shuta-error)]" />}
                        </button>
                      );
                    })}
                  </div>

                  {arena.picked !== null && (
                    <div className="flex flex-col gap-3">
                      <div className="border-l-2 border-[var(--shuta-ink)] bg-[var(--shuta-panel)] px-3.5 py-2.5 font-serif text-sm text-[var(--text-secondary)]">
                        {q.explanation}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="ink"
                          onClick={() => {
                            const nextIdx = arena.idx + 1;
                            if (arena.hp > 0 && nextIdx >= arena.questions.length) {
                              markBossCleared(arena.sectorId, 120);
                            }
                            setArena((prev) => (prev ? { ...prev, idx: nextIdx, picked: null } : null));
                          }}
                        >
                          {arena.idx + 1 >= arena.questions.length ? 'Finish Gauntlet' : 'Next Wave →'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </ShutaModalBody>
      </ShutaModal>

      {/* 5. OPERATOR PROFILE & BACKUP DRAWER */}
      <ShutaDrawer open={activeOverlay === 'profile'} onOpenChange={(o) => !o && onClose()}>
        <ShutaDrawerPanel
          side="right"
          title="Operator"
          kicker={`LVL ${rankInfo.level} · ${rankInfo.title}`}
          widthClass="w-[min(34rem,100vw)]"
        >
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-3 border-b border-[var(--shuta-line)] pb-5">
              <div>
                <div className="shuta-chrome text-[var(--shuta-dim)]">Total XP</div>
                <div className="mt-1 font-display text-2xl font-extrabold text-[var(--shuta-ink)]">
                  <CountUp to={state.xp} />
                </div>
              </div>
              <div>
                <div className="shuta-chrome text-[var(--shuta-dim)]">Mastered</div>
                <div className="mt-1 font-display text-2xl font-extrabold text-[var(--shuta-live)]">
                  {state.masteredNodes.length}/21
                </div>
              </div>
              <div>
                <div className="shuta-chrome text-[var(--shuta-dim)]">Best Streak</div>
                <div className="mt-1 font-display text-2xl font-extrabold text-[var(--shuta-warn)]">
                  {state.bestStreak}x
                </div>
              </div>
            </div>

            <div className="border-b border-[var(--shuta-line)] pb-5">
              <div className="mb-2 flex items-center justify-between shuta-chrome text-[var(--shuta-dim)]">
                <span>{rankInfo.title}</span>
                <span>{rankInfo.pct}%</span>
              </div>
              <HairlineProgress value={rankInfo.pct} />
              <label className="mt-4 flex cursor-pointer items-center justify-between font-mono text-xs text-[var(--shuta-ink)]">
                <span>Strict Gate (Require ≥3/5 Drill + ≥1 Bug Audit to Master)</span>
                <ShutaSwitch checked={state.strictGateMode} onCheckedChange={toggleStrictGate} />
              </label>
            </div>

            <div className="border-b border-[var(--shuta-line)] pb-5">
              <div className="shuta-chrome mb-3 text-[var(--shuta-dim)]">
                Distinctions ({state.unlockedAchievements.length}/{KERNEL_ACHIEVEMENTS.length})
              </div>
              <div className="flex flex-col gap-2">
                {KERNEL_ACHIEVEMENTS.map((a) => {
                  const earned = state.unlockedAchievements.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      className={`flex items-start gap-3 border-b border-[var(--shuta-line)] pb-2 ${
                        earned ? 'opacity-100' : 'opacity-45'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold text-[var(--shuta-warn)]">{a.icon}</span>
                      <div>
                        <div className="font-display text-xs font-extrabold uppercase text-[var(--shuta-ink)]">
                          {a.title}
                        </div>
                        <div className="font-serif text-xs text-[var(--text-secondary)]">{a.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="ink" size="sm" onClick={exportBackupJson}>
                <Download className="h-3.5 w-3.5" /> Backup JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-3.5 w-3.5" /> Import JSON
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
              <Button variant="outline" size="sm" onClick={exportNotesMarkdown}>
                <Download className="h-3.5 w-3.5" /> Notes (.md)
              </Button>
            </div>
          </div>
        </ShutaDrawerPanel>
      </ShutaDrawer>

      {/* 6. STUDIO GUIDE */}
      <ShutaModal
        open={activeOverlay === 'tutorial'}
        onOpenChange={(o) => {
          if (!o) {
            markTutorialSeen();
            onClose();
          }
        }}
      >
        <ShutaModalBody title="Archive Guide" kicker="KERNEL//BREACH v3 ALPHA · 6-STEP ORIENTATION" maxWidth="max-w-xl">
          <div className="border-y border-[var(--shuta-line)] py-5">
            <div className="font-display text-base font-extrabold uppercase text-[var(--shuta-ink)]">
              {GUIDE_STEPS[tutStep].title}
            </div>
            <p className="mt-2 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
              {GUIDE_STEPS[tutStep].body}
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={tutStep === 0} onClick={() => setTutStep((s) => s - 1)}>
              ← Prev
            </Button>
            <span className="shuta-chrome text-[var(--shuta-dim)]">
              {tutStep + 1} / {GUIDE_STEPS.length}
            </span>
            {tutStep < GUIDE_STEPS.length - 1 ? (
              <Button variant="ink" size="sm" onClick={() => setTutStep((s) => s + 1)}>
                Next →
              </Button>
            ) : (
              <Button
                variant="live"
                size="sm"
                onClick={() => {
                  markTutorialSeen();
                  onClose();
                }}
              >
                Enter Archive ✓
              </Button>
            )}
          </div>
        </ShutaModalBody>
      </ShutaModal>
    </>
  );
};
