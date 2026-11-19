import React, { useEffect } from 'react';
import * as DialogPrim from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { CURRICULUM_NODES } from '@/data/curriculum';
import { FORMULAS_DATA, GLOSSARY_DATA } from '@/data/trove';
import { useKernelStore } from '@/store/useKernelStore';

export type OverlayId = 'formulas' | 'glossary' | 'exam' | 'raid' | 'profile' | 'tutorial' | null;

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenOverlay: (id: OverlayId, sectorId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange, onOpenOverlay }) => {
  const { state, openDeck, setView, toggleTheme, triggerRedPill } = useKernelStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <DialogPrim.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrim.Portal>
        <DialogPrim.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[5px]" />
        <DialogPrim.Content className="fixed left-1/2 top-[12vh] z-50 w-[min(640px,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-[4px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-bg)] text-[var(--shuta-ink)] shadow-2xl">
          <DialogPrim.Title className="sr-only">Archive Search</DialogPrim.Title>
          <Command className="flex flex-col" loop>
            <div className="flex items-center gap-3 border-b border-[var(--shuta-line)] px-4 py-3">
              <Search className="h-4 w-4 text-[var(--shuta-dim)]" />
              <Command.Input
                placeholder="Search 21 plates, 134 glossary terms, 26 formulas..."
                className="w-full bg-transparent font-serif text-sm text-[var(--shuta-ink)] outline-none placeholder:text-[var(--shuta-dim)]"
              />
              <kbd className="rounded-[2px] border border-[var(--shuta-line)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--shuta-dim)]">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-[60dvh] overflow-y-auto p-2">
              <Command.Empty className="py-8 text-center font-serif text-sm italic text-[var(--shuta-dim)]">
                No matching archival entries.
              </Command.Empty>

              <Command.Group heading="Navigation & Studio" className="shuta-chrome mb-2 px-2 text-[var(--shuta-dim)]">
                <Command.Item
                  value="Switch View Gallery Room List Index Drafting Map Canvas"
                  onSelect={() =>
                    run(() =>
                      setView(state.view === 'gallery' ? 'list' : state.view === 'list' ? 'canvas' : 'gallery')
                    )
                  }
                  className="flex cursor-pointer items-center justify-between rounded-[2px] px-3 py-2 font-mono text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                >
                  <span>
                    Switch View → {state.view === 'gallery' ? 'Editorial List' : state.view === 'list' ? 'Drafting Map' : 'Gallery Room'}
                  </span>
                  <span className="text-[10px] opacity-70">TAB</span>
                </Command.Item>
                <Command.Item
                  value="Toggle Paper Light Dark Obsidian Theme"
                  onSelect={() => run(toggleTheme)}
                  className="flex cursor-pointer items-center justify-between rounded-[2px] px-3 py-2 font-mono text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                >
                  <span>Switch Surface → {state.theme === 'paper' ? 'Pitch Obsidian Dark' : 'Warm Gallery Paper'}</span>
                </Command.Item>
                <Command.Item
                  value="Open Formula Sheet Equations"
                  onSelect={() => run(() => onOpenOverlay('formulas'))}
                  className="flex cursor-pointer items-center justify-between rounded-[2px] px-3 py-2 font-mono text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                >
                  <span>Open Master Formula Sheet (26)</span>
                </Command.Item>
                <Command.Item
                  value="Open A-Z Glossary Dictionary"
                  onSelect={() => run(() => onOpenOverlay('glossary'))}
                  className="flex cursor-pointer items-center justify-between rounded-[2px] px-3 py-2 font-mono text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                >
                  <span>Open A–Z OS Glossary (134)</span>
                </Command.Item>
                <Command.Item
                  value="Open 30-Mark Practice Mock Midterm Exam"
                  onSelect={() => run(() => onOpenOverlay('exam'))}
                  className="flex cursor-pointer items-center justify-between rounded-[2px] px-3 py-2 font-mono text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                >
                  <span>Open 30-Mark Practice Mock Midterm</span>
                </Command.Item>
                <Command.Item
                  value="Full Access Mode Unlock All Red Pill"
                  onSelect={() => run(triggerRedPill)}
                  className="flex cursor-pointer items-center justify-between rounded-[2px] px-3 py-2 font-mono text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                >
                  <span>Enable Full Access Mode (Unlock All 21 Plates)</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="21 Monograph Plates" className="shuta-chrome mb-2 px-2 text-[var(--shuta-dim)]">
                {CURRICULUM_NODES.map((node) => (
                  <Command.Item
                    key={node.id}
                    value={`Plate ${node.deckNumber} Deck ${node.deckNumber} ${node.shortTitle} ${node.silberschatz.chapter} ${node.summary}`}
                    onSelect={() => run(() => openDeck(node.id, true))}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-[2px] px-3 py-2 text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                  >
                    <span className="truncate font-serif text-sm">
                      <span className="mr-2 font-mono text-[10px] font-bold opacity-70">{node.deckNumber}</span>
                      {node.shortTitle}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] opacity-65">{node.silberschatz.chapter}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Formulas & Glossary" className="shuta-chrome px-2 text-[var(--shuta-dim)]">
                {FORMULAS_DATA.slice(0, 12).map((f, i) => (
                  <Command.Item
                    key={`f-${i}`}
                    value={`Formula ${f.name} ${f.category} ${f.formula}`}
                    onSelect={() => run(() => onOpenOverlay('formulas'))}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-[2px] px-3 py-1.5 font-serif text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                  >
                    <span className="truncate">{f.name}</span>
                    <span className="shrink-0 font-mono text-[10px] opacity-65">{f.category}</span>
                  </Command.Item>
                ))}
                {GLOSSARY_DATA.slice(0, 24).map((g, i) => (
                  <Command.Item
                    key={`g-${i}`}
                    value={`Glossary ${g.term} ${g.def}`}
                    onSelect={() => run(() => onOpenOverlay('glossary'))}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-[2px] px-3 py-1.5 font-serif text-xs text-[var(--shuta-ink)] aria-selected:bg-[var(--shuta-ink)] aria-selected:text-[var(--shuta-bg)]"
                  >
                    <span className="truncate">{g.term}</span>
                    <span className="shrink-0 font-mono text-[10px] opacity-65">{g.mod}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </DialogPrim.Content>
      </DialogPrim.Portal>
    </DialogPrim.Root>
  );
};
