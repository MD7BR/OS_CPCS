import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Cpu,
  ExternalLink,
  FileSpreadsheet,
  GraduationCap,
  LayoutGrid,
  Map as MapIcon,
  Menu,
  Monitor,
  Palette,
  Pill,
  Search,
  ShieldAlert,
  ShieldCheck,
  Swords,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { CURRICULUM_NODES, SECTORS } from '@/data/curriculum';
import { useKernelStore, type ThemeId } from '@/store/useKernelStore';
import { CountUp, DecryptedText, ShinyText } from '@/components/reactbits';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress, Separator } from '@/components/ui/primitives';
import { KernelSwitch } from '@/components/ui/interactive';
import { KernelSheet, KernelSheetPanel } from '@/components/ui/overlays';
import { CommandPalette, type ModalId } from './CommandPalette';
import { SiliconDieMap } from './SiliconDieMap';
import { BentoSyllabusTrack } from './BentoSyllabusTrack';
import { SplitWorkbench } from './SplitWorkbench';
import { ModalsSuite } from './ModalsSuite';

const THEMES: { id: ThemeId; label: string; dot: string }[] = [
  { id: 'cyan', label: 'CYAN', dot: '#00F0FF' },
  { id: 'amber', label: 'AMBER', dot: '#FFB800' },
  { id: 'matrix', label: 'MATRIX', dot: '#00FF88' },
  { id: 'cobalt', label: 'COBALT', dot: '#4DA3FF' },
  { id: 'light', label: 'LIGHT', dot: '#F8FAFC' },
];

export const AppShell: React.FC = () => {
  const {
    state,
    activeDeckId,
    setLens,
    setTheme,
    toggleCrt,
    toggleSound,
    toggleStrictGate,
    triggerRedPill,
    triggerBluePill,
    openDeck,
    rankInfo,
  } = useKernelStore();

  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalId>(null);
  const [raidSectorId, setRaidSectorId] = useState<string | null>(null);
  const [focusedSector, setFocusedSector] = useState<string | null>(null);

  const openModal = (modal: ModalId, sectorId?: string) => {
    setMobileNavOpen(false);
    if (modal === 'raid') {
      setRaidSectorId(sectorId || null);
    }
    setActiveModal(modal);
  };

  // Global keyboard shortcuts when outside workbench/inputs
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (activeDeckId || activeModal || cmdOpen) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        setLens(state.lens === 'map' ? 'bento' : 'map');
      } else if (e.key === '?') {
        e.preventDefault();
        openModal('tutorial');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDeckId, activeModal, cmdOpen, setLens, state.lens]);

  const sidebarContent = (
    <div className="flex h-full flex-col gap-4">
      {/* Dual-Lens Navigation */}
      <div>
        <div className="mb-1.5 px-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Exploration Lens
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <Button
            size="sm"
            variant={state.lens === 'bento' ? 'cyber' : 'secondary'}
            onClick={() => {
              setLens('bento');
              setMobileNavOpen(false);
            }}
            className="justify-start"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Bento
          </Button>
          <Button
            size="sm"
            variant={state.lens === 'map' ? 'cyber' : 'secondary'}
            onClick={() => {
              setLens('map');
              setMobileNavOpen(false);
            }}
            className="justify-start"
          >
            <MapIcon className="h-3.5 w-3.5" />
            Die Map
          </Button>
        </div>
      </div>

      {/* 7 Sector Jump Links */}
      <div className="flex flex-col gap-1">
        <div className="mb-1 flex items-center justify-between px-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>7 OS Sectors</span>
          {focusedSector && (
            <button
              type="button"
              onClick={() => setFocusedSector(null)}
              className="text-primary hover:underline"
            >
              Show All
            </button>
          )}
        </div>
        {SECTORS.map((sec) => {
          const mastered = sec.nodes.filter((id) => state.masteredNodes.includes(id)).length;
          const active = focusedSector === sec.id && state.lens === 'bento';
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setLens('bento');
                setFocusedSector(active ? null : sec.id);
                setMobileNavOpen(false);
              }}
              className={`flex items-center justify-between rounded-md border px-2.5 py-1.5 text-left font-mono text-[11px] transition-colors ${
                active
                  ? 'border-primary/60 bg-primary/15 text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: sec.color }} />
                <span className="truncate">{sec.shortName}</span>
              </span>
              <span className="shrink-0 text-[10px] font-bold">
                {mastered}/{sec.nodes.length}
              </span>
            </button>
          );
        })}
      </div>

      <Separator />

      {/* Study Tools & Arenas */}
      <div className="flex flex-col gap-1">
        <div className="mb-1 px-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Knowledge &amp; Arenas
        </div>
        <Button size="sm" variant="ghost" className="justify-start" onClick={() => openModal('formulas')}>
          <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
          Formula Sheet (26)
        </Button>
        <Button size="sm" variant="ghost" className="justify-start" onClick={() => openModal('glossary')}>
          <BookOpen className="h-3.5 w-3.5 text-accent" />
          A–Z Glossary (134)
        </Button>
        <Button size="sm" variant="ghost" className="justify-start" onClick={() => openModal('exam')}>
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
          30-Mark Mock Midterm
        </Button>
        <Button size="sm" variant="ghost" className="justify-start" onClick={() => openModal('raid')}>
          <Swords className="h-3.5 w-3.5 text-destructive" />
          Sector Boss Arena
        </Button>
        <Button size="sm" variant="ghost" className="justify-start" onClick={() => openModal('profile')}>
          <Award className="h-3.5 w-3.5 text-primary" />
          Operator Profile &amp; Backup
        </Button>
        <Button size="sm" variant="ghost" className="justify-start" onClick={() => openModal('tutorial')}>
          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
          6-Step Split-Deck Guide
        </Button>
      </div>

      <Separator />

      {/* Theme, Hardware Controls & Pill Protocols */}
      <div className="mt-auto flex flex-col gap-3">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 px-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Palette className="h-3 w-3" />
            Phosphor Theme
          </div>
          <div className="grid grid-cols-5 gap-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                title={t.label}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-1 rounded border py-1.5 font-mono text-[8.5px] font-bold transition-colors ${
                  state.theme === t.id
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-secondary/40 text-muted-foreground hover:border-primary/40'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/30"
                  style={{ backgroundColor: t.dot }}
                />
                {t.label.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/40 p-2.5 font-mono text-[10.5px]">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Monitor className="h-3 w-3" />
              CRT Scanlines
            </span>
            <KernelSwitch checked={state.crtEnabled} onCheckedChange={toggleCrt} />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              Strict Gate
            </span>
            <KernelSwitch checked={state.strictGateMode} onCheckedChange={toggleStrictGate} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Button size="sm" variant="destructive" onClick={triggerRedPill} title="Unlock all 21 decks (Full Access Mode)">
            <Pill className="h-3 w-3" />
            <ShinyText text="Red Pill" />
          </Button>
          <Button size="sm" variant="secondary" onClick={triggerBluePill} title="Reset mastery back to Deck 02 (preserves notes)">
            <Pill className="h-3 w-3 text-primary" />
            Blue Pill
          </Button>
        </div>

        <div className="rounded border border-border/80 bg-muted/30 px-2.5 py-2 font-mono text-[9.5px] leading-relaxed text-muted-foreground">
          <strong className="text-foreground">UNOFFICIAL · AI STUDY TOOL</strong> — Zero instructor or faculty
          affiliation. Aligned with Silberschatz 10th Ed.
        </div>
      </div>
    </div>
  );

  const resumeNode =
    (state.lastDeckId && CURRICULUM_NODES.find((n) => n.id === state.lastDeckId)) || CURRICULUM_NODES[0];

  return (
    <div className="flex h-full w-full overflow-hidden bg-background text-foreground">
      {state.crtEnabled && <div className="crt-overlay" />}

      {/* Persistent Desktop Command Rail */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/85 p-3 lg:flex">
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-border pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-display text-sm font-bold tracking-wider text-primary">
              <Cpu className="h-4 w-4 shrink-0" />
              <DecryptedText text="KERNEL//BREACH" speed={25} maxIterations={12} />
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge variant="default">v2 SILICON</Badge>
              <Badge variant="amber">UNOFFICIAL · AI</Badge>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">{sidebarContent}</div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Telemetry Bar */}
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/90 px-3 py-2 md:px-4">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5 font-display text-xs font-bold tracking-wider text-primary lg:hidden">
              <Cpu className="h-3.5 w-3.5" />
              <span>KERNEL//BREACH</span>
              <Badge variant="amber" className="hidden sm:inline-flex">
                UNOFFICIAL · AI
              </Badge>
            </div>

            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-background/80 px-2.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Search 21 decks, 134 terms...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[9.5px]">⌘K</kbd>
            </button>

            <Button
              size="sm"
              variant="cyber"
              onClick={() => openDeck(resumeNode.id, true)}
              className="hidden md:inline-flex"
            >
              Resume D{resumeNode.deckNumber} →
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Live XP & Rank HUD */}
            <button
              type="button"
              onClick={() => openModal('profile')}
              className="flex items-center gap-2 rounded-md border border-primary/35 bg-primary/10 px-2.5 py-1 transition-colors hover:bg-primary/20"
            >
              <ShinyText text={`LVL ${rankInfo.level}`} className="font-mono text-[10.5px] font-bold" />
              <Progress value={rankInfo.pct} className="hidden w-14 sm:block" />
              <span className="font-mono text-[10.5px] font-bold text-primary">
                <CountUp to={state.xp} /> XP
              </span>
            </button>

            <Button
              size="icon"
              variant="secondary"
              onClick={toggleSound}
              title={state.soundMuted ? 'Unmute WebAudio UI feedback' : 'Mute WebAudio UI feedback'}
            >
              {state.soundMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </Button>

            <a
              href="../v3/"
              className="inline-flex h-8 items-center gap-1 rounded-md border border-amber-500/50 bg-amber-500/15 px-2.5 font-mono text-[10.5px] font-bold text-amber-400 transition-colors hover:bg-amber-500/25"
              title="Open KERNEL//BREACH v3 Alpha (Archival Editorial Edition)"
            >
              <span>✦ v3 ALPHA</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href="../"
              className="inline-flex h-8 items-center gap-1 rounded-md border border-border bg-secondary px-2.5 font-mono text-[10.5px] font-semibold text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              title="Open preserved v1 Classic single-file version"
            >
              <span>v1 Classic</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </header>

        {/* Active Lens Surface */}
        <main className="relative min-h-0 flex-1 overflow-hidden">
          {state.lens === 'map' ? (
            <SiliconDieMap
              paused={Boolean(activeDeckId || activeModal || cmdOpen)}
              onOpenBossRaid={(secId) => openModal('raid', secId)}
            />
          ) : (
            <BentoSyllabusTrack
              focusedSector={focusedSector}
              onClearSectorFocus={() => setFocusedSector(null)}
              onOpenBossRaid={(secId) => openModal('raid', secId)}
            />
          )}
        </main>
      </div>

      {/* Mobile / iPad Navigation Sheet */}
      <KernelSheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <KernelSheetPanel side="left" title="KERNEL//BREACH v2" badge={<Badge variant="amber">UNOFFICIAL · AI</Badge>}>
          {sidebarContent}
        </KernelSheetPanel>
      </KernelSheet>

      {/* Synchronized Split-Screen Workbench Overlay */}
      <SplitWorkbench />

      {/* Global Command-K Search Palette */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} onOpenModal={openModal} />

      {/* Study Modals & Arenas */}
      <ModalsSuite
        activeModal={activeModal}
        raidSectorId={raidSectorId}
        onClose={() => setActiveModal(null)}
        onOpenBossRaid={(secId) => openModal('raid', secId || undefined)}
      />

      {/* Sonner Hardware Telemetry Toast Container */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'border border-primary/40 bg-popover text-popover-foreground font-mono text-xs shadow-xl',
        }}
      />
    </div>
  );
};
