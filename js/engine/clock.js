/**
 * Deterministic Simulation Clock & Oscilloscope Scrubber
 * Governs simulation time-dilation, single-stepping, paused execution,
 * and historical snapshot scrubbing.
 */

export class SimClock {
  constructor() {
    this.simTimeMs = 0;
    this.cycleCount = 0;
    this.speedMultiplier = 1.0;
    this.isPaused = true;
    this.tickSubscribers = new Set();
    this.history = [];
    this.maxHistorySteps = 1000;
    
    this.lastRealTimestamp = null;
    this.stepSizeMs = 1; // 1 millisecond base tick
    this.accumulatedTime = 0;
  }

  subscribe(callback) {
    this.tickSubscribers.add(callback);
    return () => this.tickSubscribers.delete(callback);
  }

  setSpeed(multiplier) {
    this.speedMultiplier = Math.max(0.1, Math.min(10.0, multiplier));
  }

  play() {
    this.isPaused = false;
    this.lastRealTimestamp = performance.now();
  }

  pause() {
    this.isPaused = true;
  }

  togglePlay() {
    if (this.isPaused) this.play();
    else this.pause();
    return !this.isPaused;
  }

  stepForward(steps = 1) {
    this.pause();
    for (let i = 0; i < steps; i++) {
      this.advanceTick(this.stepSizeMs);
    }
  }

  advanceTick(deltaMs) {
    this.simTimeMs += deltaMs;
    this.cycleCount += 1;
    
    // Notify all active simulation subsystems
    for (const callback of this.tickSubscribers) {
      callback(this.simTimeMs, deltaMs, this.cycleCount);
    }
  }

  reset() {
    this.simTimeMs = 0;
    this.cycleCount = 0;
    this.isPaused = true;
    this.history = [];
  }

  update(nowTimestamp) {
    if (this.isPaused) {
      this.lastRealTimestamp = nowTimestamp;
      return;
    }

    if (this.lastRealTimestamp === null) {
      this.lastRealTimestamp = nowTimestamp;
      return;
    }

    const realDt = (nowTimestamp - this.lastRealTimestamp);
    this.lastRealTimestamp = nowTimestamp;

    // Cap real delta to prevent runaway calculations if tab goes background
    const clampedRealDt = Math.min(realDt, 100);
    this.accumulatedTime += clampedRealDt * this.speedMultiplier;

    // Fixed timestep execution for deterministic simulation
    const fixedStep = 10; // 10ms chunks
    while (this.accumulatedTime >= fixedStep) {
      this.advanceTick(fixedStep);
      this.accumulatedTime -= fixedStep;
    }
  }
}

export const GlobalSimClock = new SimClock();
