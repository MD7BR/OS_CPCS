import React, { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Search, Sun, Volume2, VolumeX } from 'lucide-react';
import { Toaster } from 'sonner';
import { useKernelStore } from '@/store/useKernelStore';
import { Pill, ShutaDrawer, ShutaDrawerPanel } from '@/components/ui';
import { CommandPalette, type OverlayId } from './CommandPalette';
import { GalleryRotunda3D } from './GalleryRotunda3D';
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

  useEffect(() => {
    if (!infoOpen) return;
    const onDown = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) setInfoOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [infoOpen]);

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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0B0C0E] text-[var(--shuta-ink)]">
      {/* Slim Pitch-Black Editorial Top Bar (Matching Shutabug Screenshot Header) */}
      <header className="z-30 flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-[#0B0C0E] px-4 text-[#F2F2EE] md:px-6">
        {/* Left: Crisp Monogram + Quiet Editorial Serif Links */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setView('gallery')}
            aria-label="KERNEL//BREACH Gallery"
            className="flex items-center gap-2 text-white transition-opacity hover:opacity-75"
          >
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="25" height="25" stroke="currentColor" strokeWidth="1.6" />
              <rect x="7" y="7" width="14" height="14" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="14" cy="14" r="2.4" fill="currentColor" />
            </svg>
          </button>

          <nav aria-label="Main" className="hidden items-center gap-5 font-serif text-[13px] md:flex">
            <button
              type="button"
              onClick={() => setView('gallery')}
              className={`transition-opacity hover:opacity-100 ${state.view === 'gallery' ? 'text-white opacity-100' : 'text-white/70'}`}
            >
              Index
            </button>
            <button
              type="button"
              onClick={() => openOverlay('formulas')}
              className="text-white/70 transition-opacity hover:text-white"
            >
              Formulas
            </button>
            <button
              type="button"
              onClick={() => openOverlay('glossary')}
              className="text-white/70 transition-opacity hover:text-white"
            >
              Glossary
            </button>
            <button
              type="button"
              onClick={() => openOverlay('exam')}
              className="text-white/70 transition-opacity hover:text-white"
            >
              Mock Exam
            </button>
            <button
              type="button"
              onClick={() => openOverlay('raid')}
              className="text-white/70 transition-opacity hover:text-white"
            >
              Gauntlets
            </button>

            <div ref={infoRef} className="relative">
              <button
                type="button"
                aria-expanded={infoOpen}
                onClick={() => setInfoOpen((v) => !v)}
                className="text-white/70 transition-opacity hover:text-white"
              >
                Info
              </button>

              {infoOpen && (
                <div className="absolute left-0 top-8 z-50 w-80 rounded-[3px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-bg)] p-5 text-[var(--shuta-ink)] shadow-2xl">
                  <div className="shuta-chrome text-[var(--shuta-dim)]">KERNEL//BREACH · v3 ALPHA</div>
                  <p className="mt-2 font-serif text-sm leading-relaxed">
                    Unofficial AI-generated independent OS study archive aligned with Silberschatz{' '}
                    <em>Operating System Concepts (10th Ed.)</em>. Zero instructor or faculty affiliation.
                  </p>
                  <div className="mt-4 flex flex-col divide-y divide-[var(--shuta-line)] border-y border-[var(--shuta-line)]">
                    <button
                      type="button"
                      onClick={() => {
                        setInfoOpen(false);
                        triggerRedPill();
                      }}
                      className="flex items-center justify-between py-2.5 text-left font-mono text-[10.5px] uppercase tracking-[0.12em] hover:opacity-65"
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
                      className="flex items-center justify-between py-2.5 text-left font-mono text-[10.5px] uppercase tracking-[0.12em] hover:opacity-65"
                    >
                      <span>Orientation Guide</span>
                      <span>→</span>
                    </button>
                    <a
                      href="../v2/"
                      className="flex items-center justify-between py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] hover:opacity-65"
                    >
                      <span>Switch to v2 Beta</span>
                      <span>↗</span>
                    </a>
                    <a
                      href="../"
                      className="flex items-center justify-between py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] hover:opacity-65"
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

        {/* Right: Pill Search Ctrl K + Minimal Utility Icons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="inline-flex h-7 items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-3 font-mono text-[10px] text-white/65 transition-colors hover:border-white/50 hover:text-white"
          >
            <Search className="h-3 w-3" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/75">Ctrl K</kbd>
          </button>

          <span className="hidden rounded-full border border-white/20 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-white/75 sm:inline-block">
            v3 α
          </span>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={state.theme === 'paper' ? 'Switch to Dark Gallery' : 'Switch to Light Gallery'}
            title={state.theme === 'paper' ? 'Dark Gallery' : 'Light Gallery'}
            className="text-white/75 transition-opacity hover:text-white"
          >
            {state.theme === 'paper' ? (
              <Moon className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Sun className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label="Toggle UI Audio"
            className="hidden text-white/75 transition-opacity hover:text-white sm:inline-flex"
          >
            {state.soundMuted ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>

          <button
            type="button"
            onClick={() => openOverlay('profile')}
            title={`Operator · LVL ${rankInfo.level} · ${state.xp} XP`}
            className="font-mono text-[10.5px] tracking-[0.12em] text-white/80 hover:text-white"
          >
            ({state.masteredNodes.length}/21)
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
            className="text-white md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Viewport Stage */}
      <main className="relative min-h-0 flex-1 overflow-hidden">
        {/* Top-Right Floating [ GALLERY | LIST | MAP ] Pill Switch (Exact Shutabug Screenshot Position) */}
        {!activeDeckId && (
          <div className="fixed right-4 top-14 z-20 md:right-6">
            <fieldset className="inline-flex items-center rounded-full border border-[#141413]/75 bg-[#2A2B2E]/90 p-[2px] shadow-md backdrop-blur-md">
              <legend className="sr-only">View</legend>
              <button
                type="button"
                aria-pressed={state.view === 'gallery'}
                onClick={() => setView('gallery')}
                className={`rounded-full px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  state.view === 'gallery' ? 'bg-white text-[#111110]' : 'text-white/70 hover:text-white'
                }`}
              >
                Gallery
              </button>
              <button
                type="button"
                aria-pressed={state.view === 'list'}
                onClick={() => setView('list')}
                className={`rounded-full px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  state.view === 'list' ? 'bg-white text-[#111110]' : 'text-white/70 hover:text-white'
                }`}
              >
                List
              </button>
              <button
                type="button"
                aria-pressed={state.view === 'canvas'}
                onClick={() => setView('canvas')}
                className={`rounded-full px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] transition-colors ${
                  state.view === 'canvas' ? 'bg-white text-[#111110]' : 'text-white/70 hover:text-white'
                }`}
              >
                Map
              </button>
            </fieldset>
          </div>
        )}

        {state.view === 'gallery' ? (
          <GalleryRotunda3D
            paused={stagePaused}
            onOpenBossRaid={(secId) => openOverlay('raid', secId)}
          />
        ) : state.view === 'list' ? (
          <EditorialListView />
        ) : (
          <DraftingCanvas
            paused={stagePaused}
            onOpenBossRaid={(secId) => openOverlay('raid', secId)}
          />
        )}
      </main>

      {/* Mobile Navigation Drawer */}
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

      {/* Split Monograph & Interactive Simulator Studio */}
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
