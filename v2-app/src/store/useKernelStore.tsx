import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { CAPABILITIES, CURRICULUM_NODES, SECTORS, getComboMultiplier, getRankInfo } from '@/data/curriculum';
import { TEACHING_TROVE_DATA } from '@/data/trove';
import { Sound } from '@/lib/sound';

export type ThemeId = 'cyan' | 'amber' | 'matrix' | 'cobalt' | 'light';
export type LensMode = 'map' | 'bento';
export type HighlightColor = 'amber' | 'emerald' | 'cyan' | 'crimson';
export type PenTool = HighlightColor | 'eraser' | null;

export interface HighlightRange {
  id: string;
  start: number;
  end: number;
  color: HighlightColor;
}

export interface QuizScoreRecord {
  bestCorrect: number;
  total: number;
  answers: Record<number, { selected: number; correct: boolean }>;
}

export interface AchievementDef {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export const KERNEL_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_blood', icon: '🩸', title: 'First Fault Isolated', desc: 'Catch your first Bug Hunt or Lecture Sabotage.' },
  { id: 'bug_hunter_10', icon: '🐛', title: 'Bug Exterminator', desc: 'Isolate at least 10 interactive Bug Hunts.' },
  { id: 'lie_detector', icon: '🕵️', title: 'Textbook Auditor', desc: 'Catch 5 silently planted Lecture Sabotages.' },
  { id: 'quiz_ace', icon: '🎯', title: '5/5 Exam Ace', desc: 'Score 5/5 on any deck Exam Drill.' },
  { id: 'overclock_5', icon: '🔥', title: 'Overclock x2.0', desc: 'Reach a 5x consecutive zero-mistake combo streak.' },
  { id: 'sim_explorer', icon: '🧪', title: 'Silicon Lab Rat', desc: 'Inspect at least 6 different interactive simulators.' },
  { id: 'boss_slayer', icon: '⚔️', title: 'Boss Breaker', desc: 'Defeat at least 1 Sector Boss Gauntlet.' },
  { id: 'midterm_ready', icon: '📜', title: 'Midterm Cleared', desc: 'Master all Midterm decks (Decks 02–12).' },
  { id: 'kernel_root', icon: '🛡️', title: 'Ring 0 Kernel Root', desc: 'Master all 21 decks or defeat all 7 Sector Bosses.' },
];

export interface PersistedKernelState {
  lens: LensMode;
  theme: ThemeId;
  crtEnabled: boolean;
  soundMuted: boolean;
  strictGateMode: boolean;
  masteredNodes: string[];
  capabilities: string[];
  flaggedDecks: string[];
  exploredSims: string[];
  spottedBugs: string[];
  spottedSabotages: string[];
  clearedBosses: string[];
  unlockedAchievements: string[];
  awardedEvents: string[];
  quizScores: Record<string, QuizScoreRecord>;
  notes: Record<string, string>;
  highlights: Record<string, HighlightRange[]>;
  xp: number;
  streak: number;
  bestStreak: number;
  lastDeckId: string | null;
  tutorialSeen: boolean;
  kwEnabled: boolean;
  recallBlur: boolean;
  fontSize: number;
}

const STORAGE_KEY = 'kernel_breach_v2_state';

const DEFAULT_STATE: PersistedKernelState = {
  lens: 'bento',
  theme: 'cyan',
  crtEnabled: false,
  soundMuted: false,
  strictGateMode: false,
  masteredNodes: [],
  capabilities: [],
  flaggedDecks: [],
  exploredSims: [],
  spottedBugs: [],
  spottedSabotages: [],
  clearedBosses: [],
  unlockedAchievements: [],
  awardedEvents: [],
  quizScores: {},
  notes: {},
  highlights: {},
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastDeckId: null,
  tutorialSeen: false,
  kwEnabled: true,
  recallBlur: false,
  fontSize: 15,
};

function loadInitialState(): PersistedKernelState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    }
    // Seamlessly import progress from v1 localStorage keys if present
    const v1Mastered = JSON.parse(window.localStorage.getItem('kb_mastered') || '[]');
    const v1Caps = JSON.parse(window.localStorage.getItem('kb_caps') || '[]');
    const v1Notes = JSON.parse(window.localStorage.getItem('kb_notes') || '{}');
    const v1Highlights = JSON.parse(window.localStorage.getItem('kb_highlights') || '{}');
    const v1Xp = Number(window.localStorage.getItem('kb_xp') || '0') || 0;
    if (v1Mastered.length || v1Caps.length || Object.keys(v1Notes).length || v1Xp > 0) {
      return {
        ...DEFAULT_STATE,
        masteredNodes: Array.isArray(v1Mastered) ? v1Mastered : [],
        capabilities: Array.isArray(v1Caps) ? v1Caps : [],
        notes: v1Notes || {},
        highlights: v1Highlights || {},
        xp: v1Xp,
      };
    }
  } catch {
    // ignore storage errors
  }
  return DEFAULT_STATE;
}

function checkAchievements(s: PersistedKernelState): { nextIds: string[]; newlyUnlocked: AchievementDef[] } {
  const existing = new Set(s.unlockedAchievements);
  const newlyUnlocked: AchievementDef[] = [];
  const rules: Record<string, boolean> = {
    first_blood: s.spottedBugs.length >= 1 || s.spottedSabotages.length >= 1,
    bug_hunter_10: s.spottedBugs.length >= 10,
    lie_detector: s.spottedSabotages.length >= 5,
    quiz_ace: Object.values(s.quizScores).some((q) => q && q.bestCorrect >= 5),
    overclock_5: s.bestStreak >= 5,
    sim_explorer: s.exploredSims.length >= 6,
    boss_slayer: s.clearedBosses.length >= 1,
    midterm_ready: CURRICULUM_NODES.filter((n) => ['sec_01', 'sec_02', 'sec_03'].includes(n.sector)).every((n) =>
      s.masteredNodes.includes(n.id)
    ),
    kernel_root: s.masteredNodes.length >= 21 || s.clearedBosses.length >= 7,
  };
  for (const ach of KERNEL_ACHIEVEMENTS) {
    if (!existing.has(ach.id) && rules[ach.id]) {
      existing.add(ach.id);
      newlyUnlocked.push(ach);
    }
  }
  return { nextIds: Array.from(existing), newlyUnlocked };
}

interface KernelContextValue {
  state: PersistedKernelState;
  activeDeckId: string | null;
  setActiveDeckId: (id: string | null) => void;
  openDeck: (id: string, bypassLock?: boolean) => void;
  stepDeck: (delta: number) => void;
  isNodeUnlocked: (nodeId: string) => boolean;
  getDeckClearance: (deckId: string) => {
    simDone: boolean;
    qBest: number;
    qTotal: number;
    bugsSolved: number;
    bugsTotal: number;
    sabCaught: boolean;
    readyToUnlock: boolean;
  };
  setLens: (lens: LensMode) => void;
  setTheme: (theme: ThemeId) => void;
  toggleCrt: () => void;
  toggleSound: () => void;
  toggleStrictGate: () => void;
  toggleFlagDeck: (deckId: string) => void;
  markSimExplored: (deckId: string) => void;
  recordQuizAnswer: (deckId: string, qIdx: number, optIdx: number, isCorrect: boolean, totalQuestions: number) => void;
  markBugSolved: (deckId: string, bugIdx: number) => void;
  markSabotageCaught: (deckId: string) => void;
  synthesizeNode: (deckId: string) => void;
  markBossCleared: (sectorId: string, bonusXp: number) => void;
  updateNote: (deckId: string, text: string) => void;
  addHighlight: (deckId: string, start: number, end: number, color: HighlightColor) => void;
  removeHighlight: (deckId: string, hlId: string) => void;
  clearHighlights: (deckId: string) => void;
  toggleKeywords: () => void;
  toggleRecallBlur: () => void;
  adjustFontSize: (delta: number) => void;
  triggerRedPill: () => void;
  triggerBluePill: () => void;
  markTutorialSeen: () => void;
  exportBackupJson: () => void;
  importBackupJson: (file: File) => void;
  exportNotesMarkdown: () => void;
  rankInfo: ReturnType<typeof getRankInfo>;
  comboMult: number;
}

const KernelContext = createContext<KernelContextValue | null>(null);

export const KernelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedKernelState>(loadInitialState);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  // Apply theme & sound mute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  useEffect(() => {
    Sound.muted = state.soundMuted;
  }, [state.soundMuted]);

  // Debounced localStorage persistence
  useEffect(() => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // ignore quota errors
      }
    }, 200);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  const isNodeUnlocked = useCallback(
    (nodeId: string) => {
      const node = CURRICULUM_NODES.find((n) => n.id === nodeId);
      if (!node) return false;
      if (node.requiredCapabilities.length === 0) return true;
      return node.requiredCapabilities.every((cap) => state.capabilities.includes(cap));
    },
    [state.capabilities]
  );

  const getDeckClearance = useCallback(
    (deckId: string) => {
      const simDone = state.exploredSims.includes(deckId);
      const qRec = state.quizScores[deckId];
      const qBest = qRec ? qRec.bestCorrect : 0;
      const qTotal = qRec ? qRec.total : 5;
      const hunts = TEACHING_TROVE_DATA[deckId]?.bugHunts || [];
      const bugsTotal = hunts.length;
      const bugsSolved = hunts.filter((_, i) => state.spottedBugs.includes(`${deckId}:${i}`)).length;
      const sabCaught = state.spottedSabotages.includes(deckId);
      const readyToUnlock = qBest >= 3 && (bugsTotal === 0 || bugsSolved >= 1);
      return { simDone, qBest, qTotal, bugsSolved, bugsTotal, sabCaught, readyToUnlock };
    },
    [state.exploredSims, state.quizScores, state.spottedBugs, state.spottedSabotages]
  );

  const applyAwardedUpdate = useCallback(
    (updater: (prev: PersistedKernelState) => { next: PersistedKernelState; toastMsg?: string }) => {
      setState((prev) => {
        const { next, toastMsg } = updater(prev);
        const { nextIds, newlyUnlocked } = checkAchievements(next);
        const finalState = { ...next, unlockedAchievements: nextIds };
        if (toastMsg) {
          setTimeout(() => toast.success(toastMsg), 0);
        }
        newlyUnlocked.forEach((a) => {
          setTimeout(() => {
            Sound.chime();
            toast.success(`${a.icon} Achievement Unlocked: ${a.title}`);
          }, 120);
        });
        return finalState;
      });
    },
    []
  );

  const openDeck = useCallback(
    (id: string, bypassLock = false) => {
      const node = CURRICULUM_NODES.find((n) => n.id === id);
      if (!node) return;
      if (!bypassLock && state.lens === 'map' && !isNodeUnlocked(id)) {
        Sound.alarm();
        const reqs = node.requiredCapabilities.map((c) => CAPABILITIES[c]?.badge || c).join(', ');
        toast.error(`Capability Gate Locked — Requires: ${reqs}. Switch to Bento Track or use Red Pill (Full Access Mode).`);
        return;
      }
      Sound.click(940);
      setActiveDeckId(id);
      setState((prev) => ({ ...prev, lastDeckId: id }));
    },
    [isNodeUnlocked, state.lens]
  );

  const stepDeck = useCallback(
    (delta: number) => {
      if (!activeDeckId) return;
      const idx = CURRICULUM_NODES.findIndex((n) => n.id === activeDeckId);
      if (idx < 0) return;
      const nextNode = CURRICULUM_NODES[(idx + delta + CURRICULUM_NODES.length) % CURRICULUM_NODES.length];
      Sound.click(980);
      setActiveDeckId(nextNode.id);
      setState((prev) => ({ ...prev, lastDeckId: nextNode.id }));
    },
    [activeDeckId]
  );

  const markSimExplored = useCallback(
    (deckId: string) => {
      applyAwardedUpdate((prev) => {
        if (prev.exploredSims.includes(deckId)) return { next: prev };
        const eventId = `sim:${deckId}`;
        const bonus = prev.awardedEvents.includes(eventId) ? 0 : 15;
        return {
          next: {
            ...prev,
            exploredSims: [...prev.exploredSims, deckId],
            awardedEvents: bonus ? [...prev.awardedEvents, eventId] : prev.awardedEvents,
            xp: prev.xp + bonus,
          },
        };
      });
    },
    [applyAwardedUpdate]
  );

  const recordQuizAnswer = useCallback(
    (deckId: string, qIdx: number, optIdx: number, isCorrect: boolean, totalQuestions: number) => {
      applyAwardedUpdate((prev) => {
        const cur = prev.quizScores[deckId] || { bestCorrect: 0, total: totalQuestions, answers: {} };
        const answers = { ...cur.answers, [qIdx]: { selected: optIdx, correct: isCorrect } };
        const correctCount = Object.values(answers).filter((a) => a.correct).length;
        const bestCorrect = Math.max(cur.bestCorrect, correctCount);

        let xp = prev.xp;
        let streak = prev.streak;
        let bestStreak = prev.bestStreak;
        const awardedEvents = [...prev.awardedEvents];
        let toastMsg: string | undefined;

        if (isCorrect) {
          streak += 1;
          bestStreak = Math.max(bestStreak, streak);
          const evId = `quiz:${deckId}:${qIdx}`;
          if (!awardedEvents.includes(evId)) {
            awardedEvents.push(evId);
            const mult = getComboMultiplier(streak);
            const gained = Math.round(20 * mult);
            xp += gained;
            toastMsg = `+${gained} XP · Correct Answer${mult > 1 ? ` (${mult}x Streak!)` : ''}`;
          }
        } else {
          streak = 0;
        }

        const next: PersistedKernelState = {
          ...prev,
          quizScores: { ...prev.quizScores, [deckId]: { bestCorrect, total: totalQuestions, answers } },
          xp,
          streak,
          bestStreak,
          awardedEvents,
        };
        return { next, toastMsg };
      });
    },
    [applyAwardedUpdate]
  );

  const markBugSolved = useCallback(
    (deckId: string, bugIdx: number) => {
      const key = `${deckId}:${bugIdx}`;
      applyAwardedUpdate((prev) => {
        if (prev.spottedBugs.includes(key)) return { next: prev };
        const streak = prev.streak + 1;
        const bestStreak = Math.max(prev.bestStreak, streak);
        const mult = getComboMultiplier(streak);
        const gained = Math.round(35 * mult);
        return {
          next: {
            ...prev,
            spottedBugs: [...prev.spottedBugs, key],
            xp: prev.xp + gained,
            streak,
            bestStreak,
            awardedEvents: [...prev.awardedEvents, `bug:${key}`],
          },
          toastMsg: `+${gained} XP · Bug Hunt Isolated!`,
        };
      });
    },
    [applyAwardedUpdate]
  );

  const markSabotageCaught = useCallback(
    (deckId: string) => {
      applyAwardedUpdate((prev) => {
        if (prev.spottedSabotages.includes(deckId)) return { next: prev };
        const streak = prev.streak + 1;
        const bestStreak = Math.max(prev.bestStreak, streak);
        const mult = getComboMultiplier(streak);
        const gained = Math.round(50 * mult);
        return {
          next: {
            ...prev,
            spottedSabotages: [...prev.spottedSabotages, deckId],
            xp: prev.xp + gained,
            streak,
            bestStreak,
            awardedEvents: [...prev.awardedEvents, `sab:${deckId}`],
          },
          toastMsg: `+${gained} XP · Lecture Sabotage Exposed!`,
        };
      });
    },
    [applyAwardedUpdate]
  );

  const synthesizeNode = useCallback(
    (deckId: string) => {
      const node = CURRICULUM_NODES.find((n) => n.id === deckId);
      if (!node) return;
      if (state.strictGateMode && !state.masteredNodes.includes(deckId)) {
        const st = getDeckClearance(deckId);
        if (!st.readyToUnlock) {
          Sound.alarm();
          toast.error(`Strict Gate active: Score ≥3/5 Exam Drill (${st.qBest}/5) + ≥1 Bug Hunt (${st.bugsSolved}/${st.bugsTotal}).`);
          return;
        }
      }
      Sound.chime();
      applyAwardedUpdate((prev) => {
        const already = prev.masteredNodes.includes(deckId);
        const masteredNodes = already ? prev.masteredNodes : [...prev.masteredNodes, deckId];
        const capabilities =
          node.unlockedCapability && !prev.capabilities.includes(node.unlockedCapability)
            ? [...prev.capabilities, node.unlockedCapability]
            : prev.capabilities;
        const evId = `master:${deckId}`;
        const gained = prev.awardedEvents.includes(evId) ? 0 : 75;
        const capLabel = node.unlockedCapability ? CAPABILITIES[node.unlockedCapability]?.badge : null;
        return {
          next: {
            ...prev,
            masteredNodes,
            capabilities,
            xp: prev.xp + gained,
            awardedEvents: gained ? [...prev.awardedEvents, evId] : prev.awardedEvents,
          },
          toastMsg: capLabel
            ? `Deck ${node.deckNumber} Mastered · Synthesized [${capLabel}]${gained ? ` (+${gained} XP)` : ''}`
            : `Deck ${node.deckNumber} Mastered${gained ? ` (+${gained} XP)` : ''}`,
        };
      });
    },
    [applyAwardedUpdate, getDeckClearance, state.masteredNodes, state.strictGateMode]
  );

  const markBossCleared = useCallback(
    (sectorId: string, bonusXp: number) => {
      Sound.chime();
      applyAwardedUpdate((prev) => {
        const clearedBosses = prev.clearedBosses.includes(sectorId)
          ? prev.clearedBosses
          : [...prev.clearedBosses, sectorId];
        return {
          next: {
            ...prev,
            clearedBosses,
            xp: prev.xp + bonusXp,
          },
          toastMsg: `Sector Boss Defeated! (+${bonusXp} XP)`,
        };
      });
    },
    [applyAwardedUpdate]
  );

  const triggerRedPill = useCallback(() => {
    Sound.chime();
    applyAwardedUpdate((prev) => ({
      next: {
        ...prev,
        masteredNodes: CURRICULUM_NODES.map((n) => n.id),
        capabilities: Object.keys(CAPABILITIES),
        xp: Math.max(prev.xp, 3000),
      },
      toastMsg: '💊 Red Pill Activated — Full Access Mode: All 21 decks & 12 capabilities unlocked.',
    }));
  }, [applyAwardedUpdate]);

  const triggerBluePill = useCallback(() => {
    if (
      !window.confirm(
        'Reset mastery, capabilities, XP, quiz scores, and bug clears back to Deck 02?\n\nYour written Notes and Text Highlights will be preserved.'
      )
    ) {
      return;
    }
    Sound.alarm();
    setState((prev) => ({
      ...DEFAULT_STATE,
      theme: prev.theme,
      crtEnabled: prev.crtEnabled,
      soundMuted: prev.soundMuted,
      lens: prev.lens,
      notes: prev.notes,
      highlights: prev.highlights,
      tutorialSeen: true,
    }));
    toast.info('💊 Blue Pill Activated — Progress reset to Deck 02 (Notes & Highlights preserved).');
  }, []);

  const exportBackupJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kernel-breach-v2-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported JSON progress backup.');
  }, [state]);

  const importBackupJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        setState((prev) => ({ ...prev, ...parsed }));
        Sound.chime();
        toast.success('Imported JSON backup successfully.');
      } catch {
        Sound.alarm();
        toast.error('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  }, []);

  const exportNotesMarkdown = useCallback(() => {
    const lines: string[] = [
      '# KERNEL//BREACH — Personal OS Study Notes',
      `Exported: ${new Date().toLocaleString()}`,
      '',
    ];
    for (const node of CURRICULUM_NODES) {
      const note = (state.notes[node.id] || '').trim();
      const hls = state.highlights[node.id] || [];
      if (!note && hls.length === 0) continue;
      lines.push(`## Deck ${node.deckNumber}: ${node.shortTitle} (${node.silberschatz.chapter} · ${node.silberschatz.sections})`);
      if (note) {
        lines.push('', note);
      }
      if (hls.length > 0) {
        lines.push('', `> Highlighted passages: ${hls.length}`);
      }
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kernel-breach-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported study notes as Markdown (.md).');
  }, [state.highlights, state.notes]);

  const value = useMemo<KernelContextValue>(
    () => ({
      state,
      activeDeckId,
      setActiveDeckId,
      openDeck,
      stepDeck,
      isNodeUnlocked,
      getDeckClearance,
      setLens: (lens) => {
        Sound.modeSwitch();
        setState((prev) => ({ ...prev, lens }));
      },
      setTheme: (theme) => {
        Sound.click(860);
        setState((prev) => ({ ...prev, theme }));
      },
      toggleCrt: () => {
        Sound.click(780);
        setState((prev) => ({ ...prev, crtEnabled: !prev.crtEnabled }));
      },
      toggleSound: () => {
        setState((prev) => ({ ...prev, soundMuted: !prev.soundMuted }));
      },
      toggleStrictGate: () => {
        Sound.click(820);
        setState((prev) => ({ ...prev, strictGateMode: !prev.strictGateMode }));
      },
      toggleFlagDeck: (deckId) => {
        Sound.click(920);
        setState((prev) => {
          const exists = prev.flaggedDecks.includes(deckId);
          return {
            ...prev,
            flaggedDecks: exists ? prev.flaggedDecks.filter((d) => d !== deckId) : [...prev.flaggedDecks, deckId],
          };
        });
      },
      markSimExplored,
      recordQuizAnswer,
      markBugSolved,
      markSabotageCaught,
      synthesizeNode,
      markBossCleared,
      updateNote: (deckId, text) => {
        setState((prev) => ({ ...prev, notes: { ...prev.notes, [deckId]: text } }));
      },
      addHighlight: (deckId, start, end, color) => {
        if (end <= start) return;
        setState((prev) => {
          const existing = prev.highlights[deckId] || [];
          const cleaned = existing.filter((h) => h.end <= start || h.start >= end);
          const nextList = [
            ...cleaned,
            { id: `hl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, start, end, color },
          ].sort((a, b) => a.start - b.start);
          return { ...prev, highlights: { ...prev.highlights, [deckId]: nextList } };
        });
      },
      removeHighlight: (deckId, hlId) => {
        setState((prev) => ({
          ...prev,
          highlights: {
            ...prev.highlights,
            [deckId]: (prev.highlights[deckId] || []).filter((h) => h.id !== hlId),
          },
        }));
      },
      clearHighlights: (deckId) => {
        setState((prev) => ({
          ...prev,
          highlights: { ...prev.highlights, [deckId]: [] },
        }));
      },
      toggleKeywords: () => setState((prev) => ({ ...prev, kwEnabled: !prev.kwEnabled })),
      toggleRecallBlur: () => setState((prev) => ({ ...prev, recallBlur: !prev.recallBlur })),
      adjustFontSize: (delta) =>
        setState((prev) => ({ ...prev, fontSize: Math.max(12, Math.min(19, prev.fontSize + delta)) })),
      triggerRedPill,
      triggerBluePill,
      markTutorialSeen: () => setState((prev) => ({ ...prev, tutorialSeen: true })),
      exportBackupJson,
      importBackupJson,
      exportNotesMarkdown,
      rankInfo: getRankInfo(state.xp),
      comboMult: getComboMultiplier(state.streak),
    }),
    [
      activeDeckId,
      exportBackupJson,
      exportNotesMarkdown,
      getDeckClearance,
      importBackupJson,
      isNodeUnlocked,
      markBossCleared,
      markBugSolved,
      markSabotageCaught,
      markSimExplored,
      openDeck,
      recordQuizAnswer,
      state,
      stepDeck,
      synthesizeNode,
      triggerBluePill,
      triggerRedPill,
    ]
  );

  return <KernelContext.Provider value={value}>{children}</KernelContext.Provider>;
};

export function useKernelStore() {
  const ctx = useContext(KernelContext);
  if (!ctx) throw new Error('useKernelStore must be used inside KernelProvider');
  return ctx;
}
