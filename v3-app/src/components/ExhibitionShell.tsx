import React, { useEffect, useState } from 'react';
import { Menu, Moon, Search, Sun, Volume2, VolumeX } from 'lucide-react';
import { Toaster } from 'sonner';
import { useKernelStore } from '@/store/useKernelStore';
import { CountUp } from '@/components/reactbits';
import { Pill, ShutaDrawer, ShutaDrawerPanel } from '@/components/ui';
import { CommandPalette, type OverlayId } from './CommandPalette';
import { ExhibitionIndex } from './ExhibitionIndex';
import { DraftingCanvas } from './DraftingCanvas';
import { SplitWorkbench } from './SplitWorkbench';
import { StudioDrawers } from './StudioDrawers';

export const ExhibitionShell: React.FC = () => {
  const { state, activeDeckId, setView, toggleTheme, toggleSound, rankInfo } = useKernelStore();

  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<OverlayId>(null);
  const [raidSectorId, setRaidSectorId] = useState<string | null>(null);

  const openOverlay = (id: OverlayId, sectorId?: string) => {
    setMobileMenuOpen(false);
    if (id === 'raid') setRaidSectorId(sectorId || null);
    setActiveOverlay(id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (activeDeckId || activeOverlay || cmdOpen) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        setView(state.view === 'index' ? 'canvas' : 'index');
      } else if (e.key === '?') {
        e.preventDefault();
        openOverlay('tutorial');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDeckId, activeOverlay, cmdOpen, setView, state.view]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[var(--shuta-bg)] text-[var(--shuta-ink)]">
      {/* Shutabug-Inspired 4.2rem Full-Width Top Exhibition Bar */}
      <header className="z-30 flex h-[4.2rem] shrink-0 items-center justify-between gap-4 border-b border-[var(--shuta-line)] bg-[var(--shuta-bg)] px-4 md:px-8">
        {/* Left: Brand Mark + Primary Editorial Links */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setView('index')}
            className="flex items-center gap-2.5 text-left"
          >
            {/* Geometric Architectural Die Monogram */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="26" height="26" stroke="currentColor" strokeWidth="1.5" />
              <rect x="6.5" y="6.5" width="15" height="15" stroke="currentColor" strokeWidth="1.5" />
              <line x1="1" y1="14" x2="6.5" y2="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="21.5" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="1" x2="14" y2="6.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="21.5" x2="14" y2="27" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="2.2" fill="currentColor" />
            </svg>
            <div className="leading-none">
              <span className="block font-display text-sm font-extrabold uppercase tracking-[0.04em] text-[var(--shuta-ink)]">
                KERNEL//BREACH
              </span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--shuta-dim)]">
                v3 Alpha · Archival Edition
              </span>
            </div>
          </button>

          <nav aria-label="Main" className="hidden items-center gap-5 lg:flex">
            <button
              type="button"
              data-active={state.view === 'index'}
              onClick={() => setView('index')}
              className={`shuta-link shuta-chrome ${
                state.view === 'index' ? 'font-bold text-[var(--shuta-ink)]' : 'text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]'
              }`}
            >
              Index
            </button>
            <button
              type="button"
              data-active={state.view === 'canvas'}
              onClick={() => setView('canvas')}
              className={`shuta-link shuta-chrome ${
                state.view === 'canvas' ? 'font-bold text-[var(--shuta-ink)]' : 'text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]'
              }`}
            >
              Canvas
            </button>
            <button
              type="button"
              onClick={() => openOverlay('formulas')}
              className="shuta-link shuta-chrome text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]"
            >
              Formulas
            </button>
            <button
              type="button"
              onClick={() => openOverlay('glossary')}
              className="shuta-link shuta-chrome text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]"
            >
              Glossary
            </button>
            <button
              type="button"
              onClick={() => openOverlay('exam')}
              className="shuta-link shuta-chrome text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]"
            >
              Mock Exam
            </button>
            <button
              type="button"
              onClick={() => openOverlay('raid')}
              className="shuta-link shuta-chrome text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]"
            >
              Gauntlets
            </button>
            <button
              type="button"
              onClick={() => openOverlay('tutorial')}
              className="shuta-link shuta-chrome text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]"
            >
              Guide
            </button>
          </nav>
        </div>

        {/* Right: Inline Search ⌘K, Paper/Obsidian Sun-Moon, Audio, Operator Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="inline-flex h-8 items-center gap-2 rounded-full border border-[var(--shuta-line-strong)] px-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--shuta-dim)] transition-colors hover:border-[var(--shuta-ink)] hover:text-[var(--shuta-ink)]"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <span className="opacity-70">⌘K</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={state.theme === 'paper' ? 'Switch to Pitch Obsidian Dark Mode' : 'Switch to Warm Gallery Paper Mode'}
            title={state.theme === 'paper' ? 'Switch to Dark Mode' : 'Switch to Gallery Paper Mode'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shuta-line-strong)] text-[var(--shuta-ink)] transition-colors hover:bg-[var(--shuta-ink)] hover:text-[var(--shuta-bg)]"
          >
            {state.theme === 'paper' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle UI Audio"
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-[var(--shuta-line)] text-[var(--shuta-dim)] transition-colors hover:border-[var(--shuta-ink)] hover:text-[var(--shuta-ink)] sm:inline-flex"
          >
            {state.soundMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => openOverlay('profile')}
            className="hidden items-center gap-2 rounded-full border border-[var(--shuta-ink)] bg-[var(--shuta-ink)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--shuta-bg)] transition-opacity hover:opacity-85 md:inline-flex"
          >
            <span>LVL {rankInfo.level}</span>
            <span>·</span>
            <span>
              <CountUp to={state.xp} /> XP
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Studio Menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--shuta-line-strong)] text-[var(--shuta-ink)] lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Active Surface: Editorial Index OR Architectural Drafting Canvas */}
      <main className="relative min-h-0 flex-1 overflow-hidden">
        {state.view === 'index' ? (
          <ExhibitionIndex onOpenBossRaid={(secId) => openOverlay('raid', secId)} />
        ) : (
          <DraftingCanvas
            paused={Boolean(activeDeckId || activeOverlay || cmdOpen)}
            onOpenBossRaid={(secId) => openOverlay('raid', secId)}
          />
        )}
      </main>

      {/* Mobile Navigation Drawer */}
      <ShutaDrawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <ShutaDrawerPanel side="right" title="Archive Menu" kicker="KERNEL//BREACH v3 ALPHA">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Pill tone="ink">LVL {rankInfo.level}</Pill>
              <Pill tone="warn">{state.xp} XP</Pill>
              <Pill>UNOFFICIAL · AI</Pill>
            </div>
            <nav className="flex flex-col divide-y divide-[var(--shuta-line)] border-y border-[var(--shuta-line)]">
              {[
                { label: 'Editorial Index', fn: () => { setView('index'); setMobileMenuOpen(false); } },
                { label: 'Drafting Canvas', fn: () => { setView('canvas'); setMobileMenuOpen(false); } },
                { label: 'Formula Sheet (26)', fn: () => openOverlay('formulas') },
                { label: 'A–Z Glossary (134)', fn: () => openOverlay('glossary') },
                { label: '30-Mark Mock Midterm', fn: () => openOverlay('exam') },
                { label: 'Sector Boss Gauntlets', fn: () => openOverlay('raid') },
                { label: 'Operator Profile & Backup', fn: () => openOverlay('profile') },
                { label: 'Archive Guide', fn: () => openOverlay('tutorial') },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.fn}
                  className="flex items-center justify-between py-3.5 text-left font-display text-lg font-extrabold uppercase text-[var(--shuta-ink)]"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-[var(--shuta-dim)]">→</span>
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-4 pt-2 shuta-chrome text-[var(--shuta-dim)]">
              <a href="../v2/" className="shuta-link text-[var(--shuta-ink)]">
                v2 Beta ↗
              </a>
              <a href="../" className="shuta-link text-[var(--shuta-ink)]">
                v1 Classic ↗
              </a>
            </div>
          </div>
        </ShutaDrawerPanel>
      </ShutaDrawer>

      {/* Split Monograph Workbench */}
      <SplitWorkbench />

      {/* Command-K Search */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} onOpenOverlay={openOverlay} />

      {/* Slide-Over Drawers & Modals */}
      <StudioDrawers
        activeOverlay={activeOverlay}
        raidSectorId={raidSectorId}
        onClose={() => setActiveOverlay(null)}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            'rounded-[2px] border border-[var(--shuta-ink)] bg-[var(--shuta-bg)] text-[var(--shuta-ink)] font-mono text-xs shadow-xl',
        }}
      />
    </div>
  );
};
