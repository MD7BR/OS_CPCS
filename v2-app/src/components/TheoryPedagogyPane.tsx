import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookMarked,
  Bug,
  CheckCircle2,
  Eraser,
  Eye,
  EyeOff,
  HelpCircle,
  ListTree,
  Minus,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  GLOSSARY_LOOKUP,
  KEYWORDS_LEXICON,
  TEACHING_TROVE_DATA,
  THEORY_KNOWLEDGE_BASE,
  type GlossaryItem,
} from '@/data/trove';
import { attachFormulaSandboxes } from '@/simulators/legacySimulators';
import { useKernelStore, type HighlightColor, type PenTool } from '@/store/useKernelStore';
import { Sound } from '@/lib/sound';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  KernelAccordion,
  KernelAccordionContent,
  KernelAccordionItem,
  KernelAccordionTrigger,
} from '@/components/ui/interactive';

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const KEYWORD_MATCHER = (() => {
  const sorted = [...KEYWORDS_LEXICON].sort((a, b) => b[0].length - a[0].length);
  const classMap = new Map<string, string>();
  const parts: string[] = [];
  for (const [term, cls] of sorted) {
    classMap.set(term.toLowerCase(), cls);
    parts.push(escapeRegExp(term));
  }
  const regex = parts.length ? new RegExp(`\\b(${parts.join('|')})\\b`, 'gi') : null;
  return { regex, classMap };
})();

function collectTextNodes(root: HTMLElement): { node: Text; start: number; end: number }[] {
  const out: { node: Text; start: number; end: number }[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let pos = 0;
  let cur: Node | null;
  while ((cur = walker.nextNode())) {
    const t = cur as Text;
    const parent = t.parentElement;
    if (parent && (parent.closest('.formula-sandbox') || parent.closest('script, style'))) continue;
    const len = t.nodeValue?.length || 0;
    out.push({ node: t, start: pos, end: pos + len });
    pos += len;
  }
  return out;
}

function nodePointToOffset(root: HTMLElement, container: Node, localOffset: number): number | null {
  if (!root.contains(container)) return null;
  const range = document.createRange();
  range.selectNodeContents(root);
  try {
    range.setEnd(container, localOffset);
  } catch {
    return null;
  }
  return range.toString().length;
}

interface TheoryPedagogyPaneProps {
  deckId: string;
}

export const TheoryPedagogyPane: React.FC<TheoryPedagogyPaneProps> = ({ deckId }) => {
  const {
    state,
    addHighlight,
    removeHighlight,
    clearHighlights,
    toggleKeywords,
    toggleRecallBlur,
    adjustFontSize,
    markBugSolved,
    markSabotageCaught,
  } = useKernelStore();

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const bugSectionRef = useRef<HTMLDivElement | null>(null);
  const [activePen, setActivePen] = useState<PenTool>(null);
  const [sabotageMode, setSabotageMode] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [showMarks, setShowMarks] = useState(false);
  const [outlineItems, setOutlineItems] = useState<{ id: string; text: string }[]>([]);
  const [hoveredKw, setHoveredKw] = useState<{
    term: string;
    item: GlossaryItem;
    x: number;
    y: number;
  } | null>(null);

  const theoryEntry = THEORY_KNOWLEDGE_BASE[deckId];
  const teachingEntry = TEACHING_TROVE_DATA[deckId];
  const deckHighlights = state.highlights[deckId] || [];
  const sabotageCaught = state.spottedSabotages.includes(deckId);

  // Reset per-deck transient modes when deck switches
  useEffect(() => {
    setSabotageMode(false);
    setHoveredKw(null);
  }, [deckId]);

  const rawHtml = useMemo(() => {
    const base = theoryEntry?.html || '<p>No theory content available.</p>';
    if (sabotageMode && teachingEntry?.inlineSabotage && !sabotageCaught) {
      const { find, corrupt } = teachingEntry.inlineSabotage;
      if (find && corrupt && base.includes(find)) {
        return base.replace(find, `<span class="sabotage-target" data-sabotage="true">${corrupt}</span>`);
      }
    }
    return base;
  }, [theoryEntry, sabotageMode, teachingEntry, sabotageCaught]);

  // Hydrate DOM: semantic keywords -> persistent character-offset highlights -> outline -> live formula sandboxes
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    root.innerHTML = rawHtml;

    // 1. Semantic 4-color keyword pass
    if (state.kwEnabled && KEYWORD_MATCHER.regex) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const targets: Text[] = [];
      let cur: Node | null;
      while ((cur = walker.nextNode())) {
        const t = cur as Text;
        const p = t.parentElement;
        if (!t.nodeValue?.trim()) continue;
        if (p && p.closest('code, pre, script, style, .ascii-diagram, .kw-term, .formula-sandbox, h2, h3')) continue;
        targets.push(t);
      }
      for (const textNode of targets) {
        const val = textNode.nodeValue || '';
        KEYWORD_MATCHER.regex.lastIndex = 0;
        if (!KEYWORD_MATCHER.regex.test(val)) continue;
        KEYWORD_MATCHER.regex.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let lastIdx = 0;
        let m: RegExpExecArray | null;
        while ((m = KEYWORD_MATCHER.regex.exec(val)) !== null) {
          if (m.index > lastIdx) {
            frag.appendChild(document.createTextNode(val.slice(lastIdx, m.index)));
          }
          const matched = m[0];
          const cls = KEYWORD_MATCHER.classMap.get(matched.toLowerCase()) || 'kw-hw';
          const span = document.createElement('span');
          span.className = `kw-term ${cls}`;
          span.dataset.kw = matched.toLowerCase();
          span.textContent = matched;
          frag.appendChild(span);
          lastIdx = m.index + matched.length;
        }
        if (lastIdx < val.length) {
          frag.appendChild(document.createTextNode(val.slice(lastIdx)));
        }
        textNode.parentNode?.replaceChild(frag, textNode);
      }
    }

    // 2. Restore persistent character-offset user highlights
    if (deckHighlights.length > 0 && !sabotageMode) {
      const nodes = collectTextNodes(root);
      const sortedDesc = [...deckHighlights].sort((a, b) => b.start - a.start);
      for (const hl of sortedDesc) {
        for (let i = nodes.length - 1; i >= 0; i--) {
          const entry = nodes[i];
          if (entry.end <= hl.start || entry.start >= hl.end) continue;
          const localStart = Math.max(0, hl.start - entry.start);
          const localEnd = Math.min(entry.node.nodeValue?.length || 0, hl.end - entry.start);
          if (localEnd <= localStart) continue;
          try {
            const range = document.createRange();
            range.setStart(entry.node, localStart);
            range.setEnd(entry.node, localEnd);
            const mark = document.createElement('mark');
            mark.className = `user-hl user-hl-${hl.color}`;
            mark.dataset.hlId = hl.id;
            range.surroundContents(mark);
          } catch {
            // Skip spans crossing non-splittable boundaries
          }
        }
      }
    }

    // 3. Index section headings for Outline drawer
    const headings = Array.from(root.querySelectorAll('h3')).map((h, idx) => {
      const id = `sec-h-${deckId}-${idx}`;
      h.id = id;
      return { id, text: h.textContent?.trim() || `Section ${idx + 1}` };
    });
    setOutlineItems(headings);

    // 4. Attach live interactive Formula Sandboxes inside matching .formula-display blocks
    attachFormulaSandboxes(root);
  }, [rawHtml, state.kwEnabled, deckHighlights, sabotageMode, deckId]);

  const tryApplyHighlight = useCallback(() => {
    if (!activePen || activePen === 'eraser' || sabotageMode) return;
    const root = bodyRef.current;
    if (!root) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return;
    const start = nodePointToOffset(root, range.startContainer, range.startOffset);
    const end = nodePointToOffset(root, range.endContainer, range.endOffset);
    if (start === null || end === null || end <= start) return;
    addHighlight(deckId, start, end, activePen);
    sel.removeAllRanges();
    Sound.click(1050);
  }, [activePen, addHighlight, deckId, sabotageMode]);

  const handleBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // 1. Recall blur click-to-reveal
    if (state.recallBlur) {
      const blurEl = target.closest('strong, code, .kw-term');
      if (blurEl) {
        blurEl.classList.toggle('recall-revealed');
        Sound.click(880);
        return;
      }
    }

    // 2. Lecture sabotage click detection
    if (sabotageMode && teachingEntry?.inlineSabotage && !sabotageCaught) {
      const sabEl = target.closest('[data-sabotage="true"]');
      if (sabEl) {
        sabEl.classList.add('sabotage-caught');
        Sound.chime();
        markSabotageCaught(deckId);
        return;
      }
    }

    // 3. Highlight eraser
    const hlMark = target.closest<HTMLElement>('.user-hl');
    if (hlMark && (activePen === 'eraser' || e.altKey)) {
      const id = hlMark.dataset.hlId;
      if (id) {
        removeHighlight(deckId, id);
        Sound.click(720);
      }
    }
  };

  const handleBodyMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const kw = (e.target as HTMLElement).closest<HTMLElement>('.kw-term');
    if (!kw) return;
    const key = (kw.dataset.kw || kw.textContent || '').trim().toLowerCase();
    const item = GLOSSARY_LOOKUP.get(key);
    if (!item) return;
    const rect = kw.getBoundingClientRect();
    setHoveredKw({
      term: kw.textContent || item.term,
      item,
      x: Math.min(window.innerWidth - 300, Math.max(12, rect.left)),
      y: rect.bottom + 8 > window.innerHeight - 140 ? Math.max(12, rect.top - 110) : rect.bottom + 8,
    });
  };

  const handleBodyMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    const kw = (e.target as HTMLElement).closest('.kw-term');
    if (kw) setHoveredKw(null);
  };

  const hunts = teachingEntry?.bugHunts || [];
  const socratic = teachingEntry?.socratic || [];
  const bugsSolvedCount = hunts.filter((_, i) => state.spottedBugs.includes(`${deckId}:${i}`)).length;

  const pens: { id: HighlightColor; label: string; dot: string }[] = [
    { id: 'amber', label: 'Core', dot: '#FFB800' },
    { id: 'emerald', label: 'Proof', dot: '#00FFA3' },
    { id: 'cyan', label: 'HW/Trap', dot: '#00F0FF' },
    { id: 'crimson', label: 'Critical', dot: '#FF2A6D' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Compact Active Pedagogy Toolbar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-popover/95 px-3 py-2 shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {pens.map((p) => (
            <button
              key={p.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setActivePen(activePen === p.id ? null : p.id)}
              className={`inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[10px] font-semibold transition-colors ${
                activePen === p.id
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.dot }} />
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActivePen(activePen === 'eraser' ? null : 'eraser')}
            className={`inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[10px] font-semibold ${
              activePen === 'eraser'
                ? 'border-destructive bg-destructive/15 text-destructive'
                : 'border-border bg-secondary/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eraser className="h-3 w-3" />
            Erase
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button size="sm" variant={state.kwEnabled ? 'cyber' : 'outline'} onClick={toggleKeywords}>
            <Sparkles className="h-3 w-3" />
            Keywords
          </Button>
          <Button size="sm" variant={state.recallBlur ? 'cyber' : 'outline'} onClick={toggleRecallBlur}>
            {state.recallBlur ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            Recall Blur
          </Button>
          {teachingEntry?.inlineSabotage && (
            <Button
              size="sm"
              variant={sabotageMode ? 'destructive' : sabotageCaught ? 'emerald' : 'outline'}
              onClick={() => {
                setSabotageMode((v) => !v);
                Sound.click(900);
              }}
            >
              <AlertTriangle className="h-3 w-3" />
              {sabotageCaught ? 'Sabotage ✓' : sabotageMode ? 'Hunting Lie...' : 'Sabotage'}
            </Button>
          )}
          <Button size="sm" variant={showOutline ? 'cyber' : 'outline'} onClick={() => setShowOutline((v) => !v)}>
            <ListTree className="h-3 w-3" />
            Outline
          </Button>
          <Button size="sm" variant={showMarks ? 'cyber' : 'outline'} onClick={() => setShowMarks((v) => !v)}>
            <BookMarked className="h-3 w-3" />
            Marks ({deckHighlights.length})
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => bugSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Bug className="h-3 w-3" />
            {bugsSolvedCount}/{hunts.length}
          </Button>
          <div className="inline-flex items-center overflow-hidden rounded border border-border">
            <button
              type="button"
              onClick={() => adjustFontSize(-1)}
              className="px-1.5 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Decrease text size"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => adjustFontSize(1)}
              className="border-l border-border px-1.5 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Increase text size"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Sabotage Active Banner */}
      {sabotageMode && teachingEntry?.inlineSabotage && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3.5 py-2.5 font-mono text-xs text-destructive">
          <span>
            {sabotageCaught
              ? `✓ Sabotage Exposed: ${teachingEntry.inlineSabotage.why}`
              : '⚠️ SABOTAGE ACTIVE: One factual error was silently injected into the lecture text below. Click the falsified phrase to catch it!'}
          </span>
          <Button size="sm" variant="outline" onClick={() => setSabotageMode(false)}>
            Exit Sabotage
          </Button>
        </div>
      )}

      {/* Collapsible Outline Drawer */}
      {showOutline && (
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
            Section Outline ({outlineItems.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {outlineItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="rounded border border-border bg-secondary/70 px-2 py-1 font-mono text-[10.5px] text-foreground hover:border-primary hover:text-primary"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible Highlights Drawer */}
      {showMarks && (
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
              Saved Highlights ({deckHighlights.length})
            </span>
            {deckHighlights.length > 0 && (
              <Button size="sm" variant="destructive" onClick={() => clearHighlights(deckId)}>
                <Trash2 className="h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
          {deckHighlights.length === 0 ? (
            <p className="font-mono text-[11px] text-muted-foreground">
              Select a pen color above and drag across any sentence to save persistent highlights.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {deckHighlights.map((hl, i) => (
                <button
                  key={hl.id}
                  type="button"
                  onClick={() => {
                    const el = bodyRef.current?.querySelector(`[data-hl-id="${hl.id}"]`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="inline-flex items-center gap-1.5 rounded border border-border bg-muted px-2 py-1 font-mono text-[10px] text-foreground hover:border-primary"
                >
                  <span>Mark #{i + 1}</span>
                  <span className="uppercase text-muted-foreground">{hl.color}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exhaustive Silberschatz 10th Ed. Theory Body */}
      <div
        ref={bodyRef}
        onClick={handleBodyClick}
        onMouseUp={tryApplyHighlight}
        onTouchEnd={() => {
          if (activePen && activePen !== 'eraser') {
            window.setTimeout(tryApplyHighlight, 120);
          }
        }}
        onMouseOver={handleBodyMouseOver}
        onMouseOut={handleBodyMouseOut}
        className={`rounded-lg border border-border bg-card/70 p-4 md:p-5 ${
          state.recallBlur ? 'recall-blur-active' : ''
        } ${activePen === 'eraser' ? 'eraser-cursor' : ''}`}
        style={{ fontSize: `${state.fontSize}px` }}
      />

      {/* Inline Floating Glossary HoverCard Preview on OS Keywords */}
      {hoveredKw && (
        <div
          className="pointer-events-none fixed z-50 w-72 rounded-lg border border-primary/50 bg-popover p-3 shadow-2xl"
          style={{ left: hoveredKw.x, top: hoveredKw.y }}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="font-display text-xs font-bold text-primary">{hoveredKw.item.term}</span>
            <Badge variant="outline">{hoveredKw.item.mod}</Badge>
          </div>
          <p className="font-sans text-[11.5px] leading-relaxed text-muted-foreground">{hoveredKw.item.def}</p>
        </div>
      )}

      {/* Active Teaching Trove: Spot-the-Mistake Bug Hunts & Socratic Pause & Predict */}
      <div ref={bugSectionRef} className="mt-2 flex flex-col gap-4 border-t border-dashed border-border pt-5">
        {hunts.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-amber-400">
                <Bug className="h-4 w-4" />
                Spot-the-Mistake Bug Hunts
              </h3>
              <Badge variant={bugsSolvedCount === hunts.length ? 'emerald' : 'amber'}>
                {bugsSolvedCount} / {hunts.length} Solved
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {hunts.map((h, hIdx) => {
                const solved = state.spottedBugs.includes(`${deckId}:${hIdx}`);
                return (
                  <div key={hIdx} className="rounded-lg border border-border bg-card p-3.5">
                    <div className="mb-1 font-display text-xs font-bold text-foreground">{h.type}</div>
                    <p className="mb-2.5 font-sans text-xs text-muted-foreground">{h.prompt}</p>
                    <div className="flex flex-col gap-1.5">
                      {(h.items || []).map((stmt, iIdx) => {
                        const isBug = iIdx === h.bugIdx;
                        const hasNumPrefix = /^\d+\.\s/.test(stmt);
                        return (
                          <button
                            key={iIdx}
                            type="button"
                            onClick={() => {
                              if (isBug) {
                                Sound.chime();
                                markBugSolved(deckId, hIdx);
                              } else {
                                Sound.alarm();
                                toast.error('That statement is textbook-accurate — look for the subtle flaw!');
                              }
                            }}
                            className={`spark-trigger flex items-start gap-2 rounded border px-2.5 py-2 text-left font-sans text-xs transition-colors ${
                              solved && isBug
                                ? 'border-accent bg-accent/15 text-accent'
                                : 'border-border bg-secondary/50 text-foreground hover:border-amber-400/70'
                            }`}
                          >
                            {!hasNumPrefix && (
                              <span className="font-mono text-[10px] font-bold opacity-70">{iIdx + 1}.</span>
                            )}
                            <span className="flex-1">{stmt}</span>
                            {solved && isBug && <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />}
                          </button>
                        );
                      })}
                    </div>
                    {solved && (
                      <div className="mt-2.5 rounded border-l-2 border-accent bg-accent/10 px-3 py-2 font-sans text-xs text-accent">
                        <strong>Fix: </strong>
                        {h.fix}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {socratic.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-primary">
              <HelpCircle className="h-4 w-4" />
              Socratic Pause &amp; Predict
            </h3>
            <KernelAccordion type="multiple" className="flex flex-col gap-2">
              {socratic.map((s, idx) => (
                <KernelAccordionItem key={idx} value={`soc-${idx}`}>
                  <KernelAccordionTrigger>{s.q}</KernelAccordionTrigger>
                  <KernelAccordionContent>
                    <p className="font-sans text-xs leading-relaxed text-foreground">{s.a}</p>
                  </KernelAccordionContent>
                </KernelAccordionItem>
              ))}
            </KernelAccordion>
          </div>
        )}
      </div>
    </div>
  );
};
