import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookMarked,
  Bug,
  Check,
  Eraser,
  Eye,
  EyeOff,
  ListTree,
  Minus,
  Plus,
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
import {
  Button,
  Pill,
  ShutaAccordion,
  ShutaAccordionContent,
  ShutaAccordionItem,
  ShutaAccordionTrigger,
} from '@/components/ui';

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

export const TheoryPedagogyPane: React.FC<{ deckId: string }> = ({ deckId }) => {
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
  const [hoveredKw, setHoveredKw] = useState<{ item: GlossaryItem; x: number; y: number } | null>(null);

  const theoryEntry = THEORY_KNOWLEDGE_BASE[deckId];
  const teachingEntry = TEACHING_TROVE_DATA[deckId];
  const deckHighlights = state.highlights[deckId] || [];
  const sabotageCaught = state.spottedSabotages.includes(deckId);

  useEffect(() => {
    setSabotageMode(false);
    setHoveredKw(null);
  }, [deckId]);

  const rawHtml = useMemo(() => {
    const base = theoryEntry?.html || '<p>No monograph text available.</p>';
    if (sabotageMode && teachingEntry?.inlineSabotage && !sabotageCaught) {
      const { find, corrupt } = teachingEntry.inlineSabotage;
      if (find && corrupt && base.includes(find)) {
        return base.replace(find, `<span class="sabotage-target" data-sabotage="true">${corrupt}</span>`);
      }
    }
    return base;
  }, [theoryEntry, sabotageMode, teachingEntry, sabotageCaught]);

  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    root.innerHTML = rawHtml;

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
          if (m.index > lastIdx) frag.appendChild(document.createTextNode(val.slice(lastIdx, m.index)));
          const matched = m[0];
          const cls = KEYWORD_MATCHER.classMap.get(matched.toLowerCase()) || 'kw-hw';
          const span = document.createElement('span');
          span.className = `kw-term ${cls}`;
          span.dataset.kw = matched.toLowerCase();
          span.textContent = matched;
          frag.appendChild(span);
          lastIdx = m.index + matched.length;
        }
        if (lastIdx < val.length) frag.appendChild(document.createTextNode(val.slice(lastIdx)));
        textNode.parentNode?.replaceChild(frag, textNode);
      }
    }

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
            // Skip non-splittable boundary spans
          }
        }
      }
    }

    const headings = Array.from(root.querySelectorAll('h3')).map((h, idx) => {
      const id = `v3-h-${deckId}-${idx}`;
      h.id = id;
      return { id, text: h.textContent?.trim() || `Section ${idx + 1}` };
    });
    setOutlineItems(headings);

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
    if (state.recallBlur) {
      const blurEl = target.closest('strong, code, .kw-term');
      if (blurEl) {
        blurEl.classList.toggle('recall-revealed');
        Sound.click(880);
        return;
      }
    }
    if (sabotageMode && teachingEntry?.inlineSabotage && !sabotageCaught) {
      const sabEl = target.closest('[data-sabotage="true"]');
      if (sabEl) {
        sabEl.classList.add('sabotage-caught');
        Sound.chime();
        markSabotageCaught(deckId);
        return;
      }
    }
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
      item,
      x: Math.min(window.innerWidth - 300, Math.max(12, rect.left)),
      y: rect.bottom + 8 > window.innerHeight - 140 ? Math.max(12, rect.top - 110) : rect.bottom + 8,
    });
  };

  const handleBodyMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.kw-term')) setHoveredKw(null);
  };

  const hunts = teachingEntry?.bugHunts || [];
  const socratic = teachingEntry?.socratic || [];
  const bugsSolvedCount = hunts.filter((_, i) => state.spottedBugs.includes(`${deckId}:${i}`)).length;

  const pens: { id: HighlightColor; label: string; dot: string }[] = [
    { id: 'amber', label: 'Ochre', dot: '#C9A961' },
    { id: 'emerald', label: 'Proof', dot: '#17703C' },
    { id: 'cyan', label: 'HW', dot: '#0284C7' },
    { id: 'crimson', label: 'Trap', dot: '#A40000' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Hairline Pedagogy Studio Bar */}
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--shuta-line)] bg-[var(--shuta-veil)] py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          {pens.map((p) => (
            <button
              key={p.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setActivePen(activePen === p.id ? null : p.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                activePen === p.id
                  ? 'border-[var(--shuta-ink)] bg-[var(--shuta-ink)] text-[var(--shuta-bg)]'
                  : 'border-[var(--shuta-line)] text-[var(--shuta-dim)] hover:border-[var(--shuta-ink)] hover:text-[var(--shuta-ink)]'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.dot }} />
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActivePen(activePen === 'eraser' ? null : 'eraser')}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] ${
              activePen === 'eraser'
                ? 'border-[var(--shuta-error)] bg-[var(--shuta-error)] text-[var(--shuta-bg)]'
                : 'border-[var(--shuta-line)] text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]'
            }`}
          >
            <Eraser className="h-3 w-3" />
            Erase
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button size="sm" variant={state.kwEnabled ? 'ink' : 'outline'} onClick={toggleKeywords}>
            Terms
          </Button>
          <Button size="sm" variant={state.recallBlur ? 'ink' : 'outline'} onClick={toggleRecallBlur}>
            {state.recallBlur ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            Cloze
          </Button>
          {teachingEntry?.inlineSabotage && (
            <Button
              size="sm"
              variant={sabotageMode ? 'danger' : sabotageCaught ? 'live' : 'outline'}
              onClick={() => {
                setSabotageMode((v) => !v);
                Sound.click(900);
              }}
            >
              <AlertTriangle className="h-3 w-3" />
              {sabotageCaught ? 'Sabotage ✓' : sabotageMode ? 'Hunting...' : 'Sabotage'}
            </Button>
          )}
          <Button size="sm" variant={showOutline ? 'ink' : 'outline'} onClick={() => setShowOutline((v) => !v)}>
            <ListTree className="h-3 w-3" />
          </Button>
          <Button size="sm" variant={showMarks ? 'ink' : 'outline'} onClick={() => setShowMarks((v) => !v)}>
            <BookMarked className="h-3 w-3" />
            {deckHighlights.length}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => bugSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Bug className="h-3 w-3" />
            {bugsSolvedCount}/{hunts.length}
          </Button>
          <div className="inline-flex items-center overflow-hidden rounded-[2px] border border-[var(--shuta-line-strong)]">
            <button
              type="button"
              onClick={() => adjustFontSize(-1)}
              className="px-1.5 py-1 text-[var(--shuta-dim)] hover:bg-[var(--shuta-ink)] hover:text-[var(--shuta-bg)]"
              title="Smaller type"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => adjustFontSize(1)}
              className="border-l border-[var(--shuta-line)] px-1.5 py-1 text-[var(--shuta-dim)] hover:bg-[var(--shuta-ink)] hover:text-[var(--shuta-bg)]"
              title="Larger type"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {sabotageMode && teachingEntry?.inlineSabotage && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[2px] border border-[var(--shuta-error)] bg-[color-mix(in_srgb,var(--shuta-error)_8%,transparent)] px-4 py-3 font-serif text-sm text-[var(--shuta-error)]">
          <span>
            {sabotageCaught
              ? `✓ Sabotage Exposed — ${teachingEntry.inlineSabotage.why}`
              : 'Sabotage Active: One factual error was silently altered in the monograph below. Click the falsified phrase to expose it.'}
          </span>
          <Button size="sm" variant="outline" onClick={() => setSabotageMode(false)}>
            Exit
          </Button>
        </div>
      )}

      {showOutline && (
        <div className="border-b border-[var(--shuta-line)] pb-4">
          <div className="shuta-chrome mb-2 text-[var(--shuta-dim)]">Chapter Index ({outlineItems.length})</div>
          <div className="flex flex-wrap gap-2">
            {outlineItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="shuta-link font-mono text-[10.5px] text-[var(--shuta-ink)]"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {showMarks && (
        <div className="border-b border-[var(--shuta-line)] pb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="shuta-chrome text-[var(--shuta-dim)]">Saved Highlights ({deckHighlights.length})</span>
            {deckHighlights.length > 0 && (
              <Button size="sm" variant="danger" onClick={() => clearHighlights(deckId)}>
                <Trash2 className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>
          {deckHighlights.length === 0 ? (
            <p className="font-serif text-sm italic text-[var(--shuta-dim)]">
              Select a pen above and drag across any passage to save persistent highlights.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {deckHighlights.map((hl, i) => (
                <button
                  key={hl.id}
                  type="button"
                  onClick={() =>
                    bodyRef.current?.querySelector(`[data-hl-id="${hl.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                  className="rounded-full border border-[var(--shuta-line-strong)] px-2.5 py-0.5 font-mono text-[10px] uppercase text-[var(--shuta-ink)] hover:bg-[var(--shuta-ink)] hover:text-[var(--shuta-bg)]"
                >
                  Mark #{i + 1} · {hl.color}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editorial Monograph Body */}
      <div
        ref={bodyRef}
        onClick={handleBodyClick}
        onMouseUp={tryApplyHighlight}
        onTouchEnd={() => {
          if (activePen && activePen !== 'eraser') window.setTimeout(tryApplyHighlight, 120);
        }}
        onMouseOver={handleBodyMouseOver}
        onMouseOut={handleBodyMouseOut}
        className={`${state.recallBlur ? 'recall-blur-active' : ''} ${activePen === 'eraser' ? 'eraser-cursor' : ''}`}
        style={{ fontSize: `${state.fontSize}px` }}
      />

      {/* Floating Archival Footnote Card on Keyword Hover */}
      {hoveredKw && (
        <div
          className="pointer-events-none fixed z-50 w-72 rounded-[3px] border border-[var(--shuta-ink)] bg-[var(--shuta-bg)] p-3.5 shadow-2xl"
          style={{ left: hoveredKw.x, top: hoveredKw.y }}
        >
          <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-[var(--shuta-line)] pb-1.5">
            <span className="font-display text-xs font-extrabold uppercase text-[var(--shuta-ink)]">
              {hoveredKw.item.term}
            </span>
            <Pill>{hoveredKw.item.mod}</Pill>
          </div>
          <p className="font-serif text-xs leading-relaxed text-[var(--text-secondary)]">{hoveredKw.item.def}</p>
        </div>
      )}

      {/* Active Verification Appendix: Bug Hunts & Socratic Checks */}
      <div ref={bugSectionRef} className="mt-4 flex flex-col gap-6 border-t-2 border-[var(--shuta-ink)] pt-6">
        {hunts.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-extrabold uppercase tracking-[0.02em] text-[var(--shuta-ink)]">
                Spot-the-Mistake Audits
              </h3>
              <Pill tone={bugsSolvedCount === hunts.length ? 'live' : 'warn'}>
                {bugsSolvedCount} / {hunts.length} Solved
              </Pill>
            </div>

            {hunts.map((h, hIdx) => {
              const solved = state.spottedBugs.includes(`${deckId}:${hIdx}`);
              return (
                <div key={hIdx} className="rounded-[3px] border border-[var(--shuta-line)] bg-[var(--shuta-card)] p-4">
                  <div className="shuta-chrome mb-1 text-[var(--shuta-warn)]">{h.type}</div>
                  <p className="mb-3 font-serif text-sm font-medium text-[var(--shuta-ink)]">{h.prompt}</p>
                  <div className="flex flex-col gap-2">
                    {(h.items || []).map((stmt, iIdx) => {
                      const isBug = iIdx === h.bugIdx;
                      const hasNum = /^\d+\.\s/.test(stmt);
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
                              toast.error('That claim is textbook-accurate — locate the subtle flaw.');
                            }
                          }}
                          className={`spark-trigger flex items-start gap-2 rounded-[2px] border px-3 py-2 text-left font-serif text-sm transition-colors ${
                            solved && isBug
                              ? 'border-[var(--shuta-live)] bg-[color-mix(in_srgb,var(--shuta-live)_10%,transparent)] text-[var(--shuta-live)]'
                              : 'border-[var(--shuta-line)] bg-[var(--shuta-bg)] text-[var(--shuta-ink)] hover:border-[var(--shuta-ink)]'
                          }`}
                        >
                          {!hasNum && <span className="font-mono text-[10px] font-bold opacity-65">{iIdx + 1}.</span>}
                          <span className="flex-1">{stmt}</span>
                          {solved && isBug && <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--shuta-live)]" />}
                        </button>
                      );
                    })}
                  </div>
                  {solved && (
                    <div className="mt-3 border-l-2 border-[var(--shuta-live)] bg-[color-mix(in_srgb,var(--shuta-live)_8%,transparent)] px-3 py-2 font-serif text-sm text-[var(--shuta-ink)]">
                      <strong>Correction: </strong>
                      {h.fix}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {socratic.length > 0 && (
          <div>
            <h3 className="mb-2 font-display text-base font-extrabold uppercase tracking-[0.02em] text-[var(--shuta-ink)]">
              Socratic Pause &amp; Predict
            </h3>
            <ShutaAccordion type="multiple" className="border-t border-[var(--shuta-line)]">
              {socratic.map((s, idx) => (
                <ShutaAccordionItem key={idx} value={`soc-${idx}`}>
                  <ShutaAccordionTrigger>{s.q}</ShutaAccordionTrigger>
                  <ShutaAccordionContent>{s.a}</ShutaAccordionContent>
                </ShutaAccordionItem>
              ))}
            </ShutaAccordion>
          </div>
        )}
      </div>
    </div>
  );
};
