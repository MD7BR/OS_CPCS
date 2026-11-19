import React, { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Search, Sun, Volume2, VolumeX } from 'lucide-react';
import { Toaster } from 'sonner';
import { useKernelStore } from '@/store/useKernelStore';
import { Pill, ShutaDrawer, ShutaDrawerPanel } from '@/components/ui';
import { CommandPalette, type OverlayId } from './CommandPalette';
import { GalleryRoom } from './GalleryRoom';
import { EditorialListView } from './EditorialListView';
import { DraftingCanvas } from './DraftingCanvas';
import { SplitWorkbench } from './SplitWorkbench';
import { StudioDrawers } from './StudioDrawers';

export const ExhibitionShell: React.FC = () => {
  const {
    state,
    activeDeckId,
    setView,
    toggleTheme,
    toggleSound,
    triggerRedPill,
    triggerBluePill,
    rankInfo,
  } = useKernelStore();

  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<OverlayId>(null);
  const [raidSectorId, setRaidSectorId] = useState<string | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);

  const openOverlay = (id: OverlayId, sectorId?: string) => {
    setMobileMenuOpen(false);
    setInfoOpen(false);
    if (id === 'raid') setRaidSectorId(sectorId || null);
    setActiveOverlay(id);
  };

  // Close Info popover on outside click
  useEffect(() => {
    if (!infoOpen) return;
    const onDown = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setInfoOpen(false);
      }
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [infoOpen]);

  // Global keyboard shortcuts: TAB cycles Gallery -> List -> Map, ? opens Guide
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (activeDeckId || activeOverlay || cmdOpen) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        setView(state.view === 'gallery' ? 'list' : state.view === 'list' ? 'canvas' : 'gallery');
      } else if (e.key === '?') {
        e.preventDefault();
        openOverlay('tutorial');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDeckId, activeOverlay, cmdOpen, setView, state.view]);

  const stagePaused = Boolean(activeDeckId || activeOverlay || cmdOpen);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--shuta-bg)] text-[var(--shuta-ink)]">
      {/* Borderless Floating Top Chrome (Shutabug BAu-nW_top DNA) */}
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex h-[4.2rem] items-center justify-between px-5 md:px-8">
        {/* Left: Crisp Geometric Die Monogram + Minimal Text Links */}
        <div className="pointer-events-auto flex items-center gap-7">
          <button
            type="button"
            onClick={() => setView('gallery')}
            aria-label="KERNEL//BREACH — Gallery"
            className="group flex items-center gap-2.5 text-[var(--shuta-ink)] transition-opacity hover:opacity-75"
          >
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="26" height="26" stroke="currentColor" strokeWidth="1.5" />
              <rect x="7" y="7" width="14" height="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="1" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="21" y1="14" x2="27" y2="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="1" x2="14" y2="7" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="21" x2="14" y2="27" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="2.2" fill="currentColor" />
            </svg>
            <span className="hidden font-display text-xs font-extrabold uppercase tracking-[0.06em] sm:inline">
              KERNEL//BREACH
            </span>
          </button>

          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            <button
              type="button"
              onClick={() => openOverlay('formulas')}
              className="shuta-link shuta-chrome text-[var(--shuta-ink)]/75 hover:text-[var(--shuta-ink)]"
            >
              Formulas
            </button>
            <button
              type="button"
              onClick={() => openOverlay('glossary')}
              className="shuta-link shuta-chrome text-[var(--shuta-ink)]/75 hover:text-[var(--shuta-ink)]"
            >
              Glossary
            </button>
            <button
              type="button"
              onClick={() => openOverlay('exam')}
              className="shuta-link shuta-chrome text-[var(--shuta-ink)]/75 hover:text-[var(--shuta-ink)]"
            >
              Mock Exam
            </button>
            <button
              type="button"
              onClick={() => openOverlay('raid')}
              className="shuta-link shuta-chrome text-[var(--shuta-ink)]/75 hover:text-[var(--shuta-ink)]"
            >
              Gauntlets
            </button>

            {/* Shutabug-style Compact Info / Colophon Popover (tUPvRa_panel DNA) */}
            <div ref={infoRef} className="relative">
              <button
                type="button"
                aria-expanded={infoOpen}
                onClick={() => setInfoOpen((v) => !v)}
                className="shuta-link shuta-chrome text-[var(--shuta-ink)]/75 hover:text-[var(--shuta-ink)]"
              >
                Info
              </button>

              {infoOpen && (
                <div className="absolute left-0 top-9 w-80 rounded-[3px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-bg)] p-5 shadow-2xl">
                  <div className="shuta-chrome text-[var(--shuta-dim)]">EDITION 03 · ALPHA</div>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-[var(--shuta-ink)]">
                    Unofficial AI-generated independent study archive aligned with Silberschatz{' '}
                    <em>Operating System Concepts (10th Ed.)</em>. Zero instructor or faculty affiliation.
                  </p>
                  <div className="mt-4 flex flex-col divide-y divide-[var(--shuta-line)] border-y border-[var(--shuta-line)]">
                    <button
                      type="button"
                      onClick={() => {
                        setInfoOpen(false);
                        triggerRedPill();
                      }}
                      className="flex items-center justify-between py-2.5 text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--shuta-ink)] hover:opacity-65"
                    >
                      <span>Full Access Mode (Unlock All)</span>
                      <span>→</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInfoOpen(false);
                        triggerBluePill();
                      }}
                      className="flex items-center justify-between py-2.5 text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--shuta-dim)] hover:text-[var(--shuta-error)]"
                    >
                      <span>Reset Archive (Keep Notes)</span>
                      <span>→</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openOverlay('tutorial')}
                      className="flex items-center justify-between py-2.5 text-left font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--shuta-ink)] hover:opacity-65"
                    >
                      <span>Archive Orientation Guide</span>
                      <span>→</span>
                    </button>
                    <a
                      href="../v2/"
                      className="flex items-center justify-between py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--shuta-ink)] hover:opacity-65"
                    >
                      <span>Switch to v2 Beta (Silicon)</span>
                      <span>↗</span>
                    </a>
                    <a
                      href="../"
                      className="flex items-center justify-between py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--shuta-ink)] hover:opacity-65"
                    >
                      <span>Switch to v1 Classic</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Ultra-Minimal 1px-Stroke Utility Icons Only */}
        <div className="pointer-events-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            aria-label="Search Archive (⌘K)"
            title="Search Archive (⌘K)"
            className="inline-flex items-center gap-1.5 text-[var(--shuta-ink)] transition-opacity hover:opacity-55"
          >
            <Search className="h-[16px] w-[16px]" strokeWidth={1.5} />
            <span className="hidden font-mono text-[10px] tracking-[0.12em] text-[var(--shuta-dim)] sm:inline">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={state.theme === 'paper' ? 'Switch to Dark Mode' : 'Switch to Gallery Paper Mode'}
            title={state.theme === 'paper' ? 'Switch to Dark Mode' : 'Switch to Gallery Paper Mode'}
            className="text-[var(--shuta-ink)] transition-opacity hover:opacity-55"
          >
            {state.theme === 'paper' ? (
              <Moon className="h-[17px] w-[17px]" strokeWidth={1.5} />
            ) : (
              <Sun className="h-[17px] w-[17px]" strokeWidth={1.5} />
            )}
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle UI Audio"
            title={state.soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="hidden text-[var(--shuta-ink)] transition-opacity hover:opacity-55 sm:inline-flex"
          >
            {state.soundMuted ? (
              <VolumeX className="h-[17px] w-[17px]" strokeWidth={1.5} />
            ) : (
              <Volume2 className="h-[17px] w-[17px]" strokeWidth={1.5} />
            )}
          </button>

          <button
            type="button"
            onClick={() => openOverlay('profile')}
            title={`Operator Profile · LVL ${rankInfo.level} · ${state.xp} XP`}
            className="shuta-chrome text-[var(--shuta-ink)] transition-opacity hover:opacity-55"
          >
            {String(state.masteredNodes.length).padStart(2, '0')}/21
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
            className="text-[var(--shuta-ink)] md:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Full-Viewport Open Stage */}
      <main className="h-full w-full">
        {state.view === 'gallery' ? (
          <GalleryRoom paused={stagePaused} />
        ) : state.view === 'list' ? (
          <EditorialListView />
        ) : (
          <DraftingCanvas
            paused={stagePaused}
            onOpenBossRaid={(secId) => openOverlay('raid', secId)}
          />
        )}
      </main>

      {/* Bottom-Center Floating Shutabug Gallery | List | Map Pill Switch (_7NwgQq_switch DNA) */}
      {!activeDeckId && (
        <div
          className="fixed left-1/2 z-20 -translate-x-1/2"
          style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        >
          <fieldset className="shuta-switch">
            <legend className="sr-only">View</legend>
            <button
              type="button"
              aria-pressed={state.view === 'gallery'}
              onClick={() => setView('gallery')}
            >
              Gallery
            </button>
            <button
              type="button"
              aria-pressed={state.view === 'list'}
              onClick={() => setView('list')}
            >
              List
            </button>
            <button
              type="button"
              aria-pressed={state.view === 'canvas'}
              onClick={() => setView('canvas')}
            >
              Map
            </button>
          </fieldset>
        </div>
      )}

      {/* Mobile Navigation Slide-Over Drawer */}
      <ShutaDrawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <ShutaDrawerPanel side="right" title="Archive" kicker="KERNEL//BREACH v3 ALPHA · UNOFFICIAL AI">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Pill tone="ink">LVL {rankInfo.level}</Pill>
              <Pill tone="warn">{state.xp} XP</Pill>
              <Pill>{state.masteredNodes.length}/21 Plates</Pill>
            </div>
            <nav className="flex flex-col divide-y divide-[var(--shuta-line)] border-y border-[var(--shuta-line)]">
              {[
                { label: 'Formula Sheet (26)', fn: () => openOverlay('formulas') },
                { label: 'A–Z Glossary (134)', fn: () => openOverlay('glossary') },
                { label: '30-Mark Mock Midterm', fn: () => openOverlay('exam') },
                { label: 'Sector Boss Gauntlets', fn: () => openOverlay('raid') },
                { label: 'Operator Profile & Backup', fn: () => openOverlay('profile') },
                { label: 'Full Access Mode', fn: () => { setMobileMenuOpen(false); triggerRedPill(); } },
                { label: 'Reset Archive', fn: () => { setMobileMenuOpen(false); triggerBluePill(); } },
                { label: 'Guide', fn: () => openOverlay('tutorial') },
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
            <div className="flex items-center gap-5 shuta-chrome text-[var(--shuta-dim)]">
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

      {/* Focused Split Monograph & Simulator Studio */}
      <SplitWorkbench />

      {/* Global Command-K Search */}
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
