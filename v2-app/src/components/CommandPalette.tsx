import React, { useEffect } from 'react';
import * as DialogPrim from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import {
  BookOpen,
  Cpu,
  FileSpreadsheet,
  Map as MapIcon,
  LayoutGrid,
  Search,
  ShieldAlert,
  Sparkles,
  Swords,
  Terminal,
} from 'lucide-react';
import { CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { FORMULAS_DATA, GLOSSARY_DATA } from '@/data/trove';
import { useKernelStore } from '@/store/useKernelStore';

export type ModalId = 'formulas' | 'glossary' | 'exam' | 'raid' | 'profile' | 'tutorial' | null;

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenModal: (modal: ModalId, sectorId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange, onOpenModal }) => {
  const { state, openDeck, setLens, toggleCrt, triggerRedPill } = useKernelStore();

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
        <DialogPrim.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px]" />
        <DialogPrim.Content className="fixed left-1/2 top-[12vh] z-50 w-[min(640px,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-lg border border-primary/40 bg-popover text-popover-foreground shadow-2xl">
          <DialogPrim.Title className="sr-only">KERNEL//BREACH Command Palette</DialogPrim.Title>
          <Command className="flex flex-col" loop>
            <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-2.5">
              <Search className="h-4 w-4 text-primary" />
              <Command.Input
                placeholder="Jump to any of 21 decks, 134 glossary terms, 26 formulas, or commands..."
                className="w-full bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-[60dvh] overflow-y-auto p-2">
              <Command.Empty className="py-8 text-center font-mono text-xs text-muted-foreground">
                No matching OS module, term, or command found.
              </Command.Empty>

              <Command.Group heading="Quick Actions" className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <Command.Item
                  value="Switch Lens Silicon Die Map Bento Grid"
                  onSelect={() => run(() => setLens(state.lens === 'map' ? 'bento' : 'map'))}
                  className="flex cursor-pointer items-center justify-between rounded px-2.5 py-2 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                >
                  <span className="flex items-center gap-2">
                    {state.lens === 'map' ? <LayoutGrid className="h-3.5 w-3.5" /> : <MapIcon className="h-3.5 w-3.5" />}
                    Switch Lens → {state.lens === 'map' ? '7-Sector Bento Track' : 'Silicon Die Map'}
                  </span>
                  <kbd className="text-[10px] text-muted-foreground">TAB</kbd>
                </Command.Item>
                <Command.Item
                  value="Open 30-Mark Practice Mock Midterm Exam"
                  onSelect={() => run(() => onOpenModal('exam'))}
                  className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  Open 30-Mark Practice Mock Midterm
                </Command.Item>
                <Command.Item
                  value="Launch Sector Boss Raid Arena Gauntlet"
                  onSelect={() => run(() => onOpenModal('raid'))}
                  className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                >
                  <Swords className="h-3.5 w-3.5 text-destructive" />
                  Launch Sector Boss Raid Arena
                </Command.Item>
                <Command.Item
                  value="Open Master Formula Sheet"
                  onSelect={() => run(() => onOpenModal('formulas'))}
                  className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
                  Open Master Formula Sheet (26 Formulas)
                </Command.Item>
                <Command.Item
                  value="Open A-Z OS Glossary"
                  onSelect={() => run(() => onOpenModal('glossary'))}
                  className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                >
                  <BookOpen className="h-3.5 w-3.5 text-accent" />
                  Open A–Z Searchable Glossary (134 Terms)
                </Command.Item>
                <Command.Item
                  value="Toggle CRT Scanlines"
                  onSelect={() => run(toggleCrt)}
                  className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  Toggle CRT Scanlines ({state.crtEnabled ? 'ON' : 'OFF'})
                </Command.Item>
                <Command.Item
                  value="Red Pill Unlock All Full Access Mode"
                  onSelect={() => run(triggerRedPill)}
                  className="flex cursor-pointer items-center gap-2 rounded px-2.5 py-2 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                >
                  <Sparkles className="h-3.5 w-3.5 text-destructive" />
                  Red Pill — Unlock All 21 Decks (Full Access Mode)
                </Command.Item>
              </Command.Group>

              <Command.Group heading="21 Study Decks (Silberschatz 10th Ed.)" className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {CURRICULUM_NODES.map((node) => {
                  const sec = SECTORS.find((s) => s.id === node.sector);
                  const mastered = state.masteredNodes.includes(node.id);
                  return (
                    <Command.Item
                      key={node.id}
                      value={`Deck ${node.deckNumber} ${node.shortTitle} ${node.silberschatz.chapter} ${node.silberschatz.sections} ${node.summary}`}
                      onSelect={() => run(() => openDeck(node.id, true))}
                      className="flex cursor-pointer items-center justify-between gap-2 rounded px-2.5 py-2 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Cpu className="h-3.5 w-3.5 shrink-0" style={{ color: sec?.color }} />
                        <span className="font-mono font-bold text-primary">D{node.deckNumber}</span>
                        <span className="truncate font-sans">{node.shortTitle}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {mastered ? '✓ MASTERED' : node.silberschatz.chapter}
                      </span>
                    </Command.Item>
                  );
                })}
              </Command.Group>

              <Command.Group heading="Formulas & Glossary Quick Lookup" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {FORMULAS_DATA.slice(0, 12).map((f, i) => (
                  <Command.Item
                    key={`f-${i}`}
                    value={`Formula ${f.name} ${f.category} ${f.formula}`}
                    onSelect={() => run(() => onOpenModal('formulas'))}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded px-2.5 py-1.5 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                  >
                    <span className="truncate">{f.name}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{f.category}</span>
                  </Command.Item>
                ))}
                {GLOSSARY_DATA.slice(0, 24).map((g, i) => (
                  <Command.Item
                    key={`g-${i}`}
                    value={`Glossary ${g.term} ${g.def}`}
                    onSelect={() => run(() => onOpenModal('glossary'))}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded px-2.5 py-1.5 text-xs text-foreground aria-selected:bg-primary/15 aria-selected:text-primary"
                  >
                    <span className="truncate">{g.term}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{g.mod}</span>
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
