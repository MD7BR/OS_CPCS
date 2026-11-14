/**
 * KERNEL//BREACH - Master Application Controller
 * Coordinates mode toggling, user capabilities, audio synthesizer,
 * simulation clock, and view transitions.
 */

import { MetroidvaniaMap } from './ui/metroidvania-map.js';
import { LinearSyllabus } from './ui/linear-syllabus.js';
import { WorkbenchShell } from './ui/workbench-shell.js';
import { GlobalSimClock } from './engine/clock.js';
import { SoundFX } from './audio.js';

class KernelBreachApp {
  constructor() {
    // Persistent user state
    this.userState = {
      isLinearMode: false,
      unlockedCapabilities: new Set(['RING0_PRIVILEGE']), // Initial starter capability
      masteredNodes: new Set(),
      activeNode: null
    };

    this.loadSavedState();
    this.initViews();
    this.initHeader();
    this.initScrubber();
    this.startMainClockLoop();
  }

  loadSavedState() {
    try {
      const saved = localStorage.getItem('kernel_breach_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unlockedCapabilities) {
          this.userState.unlockedCapabilities = new Set(parsed.unlockedCapabilities);
        }
        if (parsed.masteredNodes) {
          this.userState.masteredNodes = new Set(parsed.masteredNodes);
        }
        if (typeof parsed.isLinearMode === 'boolean') {
          this.userState.isLinearMode = parsed.isLinearMode;
        }
      }
    } catch (e) {
      console.warn('Could not load saved state', e);
    }
  }

  saveState() {
    try {
      const payload = {
        unlockedCapabilities: Array.from(this.userState.unlockedCapabilities),
        masteredNodes: Array.from(this.userState.masteredNodes),
        isLinearMode: this.userState.isLinearMode
      };
      localStorage.setItem('kernel_breach_save', JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }

  initViews() {
    const metroidContainer = document.getElementById('metroidvania-view');
    const linearContainer = document.getElementById('linear-view');
    const workbenchContainer = document.getElementById('workbench-overlay');

    // 1. Initialize Metroidvania Map
    this.metroidMap = new MetroidvaniaMap({
      container: metroidContainer,
      onSelectNode: (node, isUnlocked) => this.handleNodeSelect(node, isUnlocked),
      userState: this.userState
    });

    // 2. Initialize Linear Syllabus
    this.linearSyllabus = new LinearSyllabus({
      container: linearContainer,
      onSelectNode: (node) => this.handleNodeSelect(node, true),
      userState: this.userState
    });

    // 3. Initialize Workbench Room Shell
    this.workbench = new WorkbenchShell({
      container: workbenchContainer,
      onClose: () => {
        this.metroidMap.refresh();
        this.linearSyllabus.refresh();
      },
      onMasterNode: (node) => this.handleNodeMastered(node),
      userState: this.userState
    });

    this.updateActiveModeView();
  }

  handleNodeSelect(node, isUnlocked) {
    if (!isUnlocked) {
      SoundFX.playAlarmStall();
      alert(`[CAPABILITY LOCKED]\nThis sector requires: ${node.requiredCapabilities.join(', ')}.\nComplete prerequisite sectors or toggle to Linear Syllabus Mode to access directly.`);
      return;
    }
    this.workbench.mountNode(node);
  }

  handleNodeMastered(node) {
    this.userState.masteredNodes.add(node.id);
    if (node.unlockedCapability) {
      this.userState.unlockedCapabilities.add(node.unlockedCapability);
    }
    this.saveState();
    this.metroidMap.refresh();
    this.linearSyllabus.refresh();
  }

  initHeader() {
    const modeMetroidBtn = document.getElementById('btn-mode-metroid');
    const modeLinearBtn = document.getElementById('btn-mode-linear');
    const muteBtn = document.getElementById('btn-toggle-sound');

    const toggleMode = (targetMode) => {
      if (this.userState.isLinearMode === targetMode) return;
      SoundFX.playModeSwitch();
      this.userState.isLinearMode = targetMode;
      this.saveState();
      this.updateActiveModeView();
    };

    // Metroidvania Mode Switch
    modeMetroidBtn.addEventListener('click', () => {
      toggleMode(false);
    });

    // Linear Syllabus Mode Switch
    modeLinearBtn.addEventListener('click', () => {
      toggleMode(true);
    });

    // Global Keyboard Shortcut: TAB or 'M' to toggle mode
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Tab' || e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMode(!this.userState.isLinearMode);
      }
    });

    // Sound Synthesizer Mute Toggle
    muteBtn.addEventListener('click', () => {
      const isMuted = SoundFX.toggleMute();
      muteBtn.textContent = isMuted ? 'AUDIO: OFF' : 'AUDIO: ON';
      muteBtn.classList.toggle('active', !isMuted);
      if (!isMuted) SoundFX.playRelayClick();
    });
  }

  updateActiveModeView() {
    const metroidContainer = document.getElementById('metroidvania-view');
    const linearContainer = document.getElementById('linear-view');
    const modeMetroidBtn = document.getElementById('btn-mode-metroid');
    const modeLinearBtn = document.getElementById('btn-mode-linear');

    if (this.userState.isLinearMode) {
      metroidContainer.classList.remove('active');
      linearContainer.classList.add('active');
      modeMetroidBtn.classList.remove('active', 'metroid');
      modeLinearBtn.classList.add('active', 'linear');
      this.linearSyllabus.refresh();
    } else {
      linearContainer.classList.remove('active');
      metroidContainer.classList.add('active');
      modeLinearBtn.classList.remove('active', 'linear');
      modeMetroidBtn.classList.add('active', 'metroid');
      this.metroidMap.refresh();
    }
  }

  initScrubber() {
    const playBtn = document.getElementById('btn-sim-play');
    const stepBtn = document.getElementById('btn-sim-step');
    const resetBtn = document.getElementById('btn-sim-reset');
    const timeDisplay = document.getElementById('sim-clock-display');
    const cycleDisplay = document.getElementById('telem-cycle-count');
    const speedChips = document.querySelectorAll('.speed-chip');

    playBtn.addEventListener('click', () => {
      const isRunning = GlobalSimClock.togglePlay();
      playBtn.textContent = isRunning ? '❚❚ PAUSE' : '▶ RUN';
      playBtn.classList.toggle('playing', isRunning);
      SoundFX.playRelayClick();
    });

    stepBtn.addEventListener('click', () => {
      GlobalSimClock.stepForward(1);
      SoundFX.playClockTick();
      playBtn.textContent = '▶ RUN';
      playBtn.classList.remove('playing');
    });

    resetBtn.addEventListener('click', () => {
      GlobalSimClock.reset();
      playBtn.textContent = '▶ RUN';
      playBtn.classList.remove('playing');
      timeDisplay.textContent = '00:00.000';
      cycleDisplay.textContent = '0x0000_0000';
      SoundFX.playRelayClick(600);
    });

    speedChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const speed = parseFloat(chip.dataset.speed);
        GlobalSimClock.setSpeed(speed);
        speedChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        SoundFX.playRelayClick(1400);
      });
    });

    // Subscribe to clock ticks to update bottom bar HUD
    GlobalSimClock.subscribe((timeMs, dt, cycles) => {
      const totalSec = Math.floor(timeMs / 1000);
      const ms = Math.floor(timeMs % 1000);
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      
      const pad = (n, len = 2) => String(n).padStart(len, '0');
      timeDisplay.textContent = `${pad(min)}:${pad(sec)}.${pad(ms, 3)}`;
      cycleDisplay.textContent = `0x${cycles.toString(16).toUpperCase().padStart(8, '0')}`;
    });
  }

  startMainClockLoop() {
    const loop = (timestamp) => {
      GlobalSimClock.update(timestamp);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Bootstrap Application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  new KernelBreachApp();
});
