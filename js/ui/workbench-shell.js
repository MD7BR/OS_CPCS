/**
 * 4-Layer Room Workbench & Interactive Lab Shell
 * Layer 1: The Anomaly Hook (The real-world OS problem)
 * Layer 2: The Interactive Workbench (Live 60fps Simulator)
 * Layer 3: Silberschatz Codex & Slide Correlation Drawer
 * Layer 4: Capability Boss Terminal (Objective check & Unlock)
 */

import { CAPABILITIES } from '../data/curriculum.js';
import { SoundFX } from '../audio.js';
import { GlobalSimClock } from '../engine/clock.js';

export class WorkbenchShell {
  constructor({ container, onClose, onMasterNode, userState }) {
    this.container = container;
    this.onClose = onClose;
    this.onMasterNode = onMasterNode;
    this.userState = userState;
    this.currentNode = null;
    this.simCleanup = null;

    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="workbench-top-bar">
        <div class="workbench-breadcrumb">
          <span class="wb-sector-tag" id="wb-sector-tag">SECTOR 01</span>
          <span style="color: var(--text-muted)">//</span>
          <span class="brand-badge" id="wb-deck-badge">DECK 02</span>
          <span style="color: var(--text-muted)">//</span>
          <span class="wb-title" id="wb-room-title">Introduction to OS & Architecture</span>
        </div>
        <div class="workbench-actions">
          <button class="btn-industrial" id="wb-btn-close">RETURN TO MAP [ESC]</button>
        </div>
      </div>

      <div class="workbench-content-split">
        <!-- Main Stage (Layers 1, 2, 4) -->
        <div class="workbench-main-stage">
          <!-- Layer 1: Anomaly Hook -->
          <div class="anomaly-card panel-chamfer">
            <div class="anomaly-icon">⚠️</div>
            <div class="anomaly-text">
              <h5 id="wb-anomaly-title">SYSTEM ANOMALY DETECTED</h5>
              <p id="wb-anomaly-desc">An unprivileged application attempted to write directly to hardware port 0x3F8, threatening system stability.</p>
            </div>
          </div>

          <!-- Layer 2: Interactive Workbench Simulation Stage -->
          <div class="simulation-stage-box panel-chamfer" id="wb-sim-stage">
            <!-- Injected dynamically per interactiveType -->
          </div>

          <!-- Layer 4: Capability Boss Terminal -->
          <div class="capability-terminal-box panel-chamfer" id="wb-cap-box">
            <div class="cap-term-left">
              <div class="cap-badge-large" id="wb-cap-badge">RING-0</div>
              <div class="cap-term-info">
                <h4 id="wb-cap-name">Ring-0 Privilege Bit</h4>
                <p id="wb-cap-desc">Verify system integrity and satisfy the SLA requirements to synthesize this Kernel Capability.</p>
              </div>
            </div>
            <button class="btn-industrial primary" id="wb-btn-unlock">SYNTHESIZE CAPABILITY</button>
          </div>
        </div>

        <!-- Layer 3: Silberschatz Codex Drawer -->
        <div class="codex-sidebar">
          <div class="codex-header">
            <span class="codex-title">SILBERSCHATZ 10TH ED. CODEX</span>
            <span class="brand-badge" id="wb-codex-chap-badge">CH. 1 & 2</span>
          </div>
          <div class="codex-body">
            <div class="codex-section">
              <span class="codex-sec-title">TEXTBOOK CHAPTER CITATION</span>
              <div class="codex-book-ref" id="wb-codex-book-ref">
                <strong>Silberschatz, Galvin, Gagne</strong><br>
                <em>Operating System Concepts (10th Ed.)</em><br>
                Chapter 1 & 2: Introduction & OS Structures (§1.1–1.7, §2.1–2.7)
              </div>
            </div>

            <div class="codex-section">
              <span class="codex-sec-title">CPCS-361 SLIDE CORRELATION</span>
              <div class="codex-slide-source" id="wb-codex-slide-source">
                02-CPCS-361-Introduction To OS - Tagged.pdf
              </div>
            </div>

            <div class="codex-section">
              <span class="codex-sec-title">FORMAL THEORY & GOVERNING FORMULAS</span>
              <div class="codex-formula-box" id="wb-codex-formulas">
                // Dual Mode Verification Rule:<br>
                ModeBit = 1 (User Mode) -> Block Ring-0 Opcodes<br>
                ModeBit = 0 (Kernel Mode) -> Full Hardware Access<br>
                TrapVector = IVT[Interrupt_ID]
              </div>
            </div>

            <div class="codex-section">
              <span class="codex-sec-title">PEDAGOGICAL SYNOPSIS</span>
              <p id="wb-codex-synopsis" style="color: var(--text-secondary); font-size: 11px; line-height: 1.5;">
                In modern multi-tasking operating systems, hardware dual-mode is the foundational defense mechanism. It protects CPU and I/O resources from unauthorized or buggy user-space tampering.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Bindings
    this.container.querySelector('#wb-btn-close').addEventListener('click', () => {
      this.close();
    });

    this.container.querySelector('#wb-btn-unlock').addEventListener('click', () => {
      if (!this.currentNode) return;
      SoundFX.playModeSwitch();
      this.onMasterNode(this.currentNode);
      this.updateUnlockButton();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.container.classList.contains('active')) {
        this.close();
      }
    });
  }

  mountNode(node) {
    this.currentNode = node;

    // Teardown previous active simulation
    if (this.simCleanup) {
      this.simCleanup();
      this.simCleanup = null;
    }

    // Populate Breadcrumbs & Headers
    this.container.querySelector('#wb-sector-tag').textContent = node.sector.toUpperCase();
    this.container.querySelector('#wb-deck-badge').textContent = `DECK ${node.deckNumber}`;
    this.container.querySelector('#wb-room-title').textContent = node.shortTitle;

    // Populate Layer 1: Anomaly
    this.container.querySelector('#wb-anomaly-title').textContent = node.anomaly.title;
    this.container.querySelector('#wb-anomaly-desc').textContent = node.anomaly.brief;

    // Populate Layer 3: Silberschatz Codex
    this.container.querySelector('#wb-codex-chap-badge').textContent = node.silberschatz.chapter;
    this.container.querySelector('#wb-codex-book-ref').innerHTML = `
      <strong>Silberschatz, Galvin, Gagne</strong><br>
      <em>Operating System Concepts (${node.silberschatz.edition})</em><br>
      ${node.silberschatz.chapter} (${node.silberschatz.sections})<br>
      "${node.silberschatz.title}"
    `;
    this.container.querySelector('#wb-codex-slide-source').textContent = node.slideTitle;
    this.container.querySelector('#wb-codex-synopsis').textContent = node.summary;

    // Populate Layer 4: Capability Terminal
    const cap = node.unlockedCapability ? CAPABILITIES[node.unlockedCapability] : null;
    const capBox = this.container.querySelector('#wb-cap-box');
    if (cap) {
      capBox.style.display = 'flex';
      this.container.querySelector('#wb-cap-badge').textContent = cap.badge;
      this.container.querySelector('#wb-cap-name').textContent = cap.name;
      this.container.querySelector('#wb-cap-desc').textContent = cap.desc;
    } else {
      capBox.style.display = 'none';
    }

    this.updateUnlockButton();

    // Mount Layer 2: Interactive Simulation Workbench
    const stage = this.container.querySelector('#wb-sim-stage');
    this.mountSimulator(node, stage);

    // Open Overlay
    this.container.classList.add('active');
  }

  updateUnlockButton() {
    const btn = this.container.querySelector('#wb-btn-unlock');
    if (!this.currentNode) return;
    const isMastered = this.userState.masteredNodes.has(this.currentNode.id);
    if (isMastered) {
      btn.textContent = 'CAPABILITY ACTIVE (MASTERED)';
      btn.classList.add('primary');
      btn.disabled = true;
    } else {
      btn.textContent = 'SYNTHESIZE CAPABILITY';
      btn.classList.remove('primary');
      btn.disabled = false;
    }
  }

  close() {
    SoundFX.playRelayClick(800);
    this.container.classList.remove('active');
    if (this.simCleanup) {
      this.simCleanup();
      this.simCleanup = null;
    }
    this.onClose();
  }

  // ==========================================================================
  // BESPOKE SIMULATOR DISPATCHER
  // ==========================================================================
  mountSimulator(node, stage) {
    if (node.interactiveType === 'DUAL_MODE_OSCILLOSCOPE') {
      this.simCleanup = this.mountDualModeSimulator(stage);
    } else if (node.interactiveType === 'FCFS_CONVOY_WIND_TUNNEL') {
      this.simCleanup = this.mountFCFSConvoySimulator(stage);
    } else if (node.interactiveType === 'RACE_CONDITION_COLLIDER') {
      this.simCleanup = this.mountRaceConditionSimulator(stage);
    } else {
      this.simCleanup = this.mountGenericOSWorkbench(node, stage);
    }
  }

  // Simulator 1: Dual-Mode Syscall & Hardware Trap Vector Oscilloscope (Deck 02)
  mountDualModeSimulator(stage) {
    stage.innerHTML = `
      <div class="stage-header">
        <span class="stage-title">DUAL-MODE HARDWARE OSCILLOSCOPE // IVT TRAP ROUTER</span>
        <span class="brand-badge" id="cpu-mode-badge" style="border-color: var(--color-amber); color: var(--color-amber);">USER MODE [BIT: 1]</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1;">
        <!-- Left: CPU Register & Ring Mode State -->
        <div style="background: var(--bg-deep); border: 1px solid var(--border-trace); padding: 16px; display: flex; flex-direction: column; gap: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); letter-spacing: 0.08em;">CPU ARCHITECTURAL REGISTERS</div>
          
          <div style="display: flex; justify-content: space-between; padding: 6px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
            <span style="color: var(--text-muted)">HARDWARE MODE BIT:</span>
            <span id="reg-mode-bit" style="font-weight: 700; color: var(--color-amber);">1 (User Mode)</span>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 6px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
            <span style="color: var(--text-muted)">PROGRAM COUNTER (PC):</span>
            <span id="reg-pc" style="color: var(--color-cyan);">0x0040_1020</span>
          </div>

          <div style="display: flex; justify-content: space-between; padding: 6px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
            <span style="color: var(--text-muted)">ACTIVE PRIVILEGE RING:</span>
            <span id="reg-ring" style="color: var(--text-primary);">Ring 3 (Unprivileged)</span>
          </div>

          <div style="margin-top: auto; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Inject CPU Instructions:</div>
            <button class="btn-industrial" id="btn-inst-calc">INSTRUCTION: Compute Math (ADD EAX, EBX)</button>
            <button class="btn-industrial danger" id="btn-inst-port">INSTRUCTION: Write Port (OUT 0x3F8, AL)</button>
            <button class="btn-industrial primary" id="btn-inst-trap">SYSTEM CALL: Trap into Kernel (INT 0x80)</button>
          </div>
        </div>

        <!-- Right: Interrupt Vector Table & Kernel Bus Log -->
        <div style="background: var(--bg-deep); border: 1px solid var(--border-trace); padding: 16px; display: flex; flex-direction: column;">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-copper); letter-spacing: 0.08em; margin-bottom: 12px;">INTERRUPT VECTOR TABLE (IVT) & TELEMETRY LOG</div>
          <div id="sim-telem-log" style="flex: 1; font-size: 11px; overflow-y: auto; background: var(--bg-silicon); border: 1px solid rgba(255,255,255,0.05); padding: 10px; display: flex; flex-direction: column; gap: 4px; font-family: var(--font-mono);">
            <div style="color: var(--text-muted);">[BOOT] Hardware mode initialized in Ring-3. Mode bit = 1.</div>
            <div style="color: var(--text-muted);">[IVT: 0x0D] General Protection Fault Handler registered at 0xC000_1000.</div>
            <div style="color: var(--text-muted);">[IVT: 0x80] Syscall Dispatcher registered at 0xC000_8000.</div>
          </div>
        </div>
      </div>
    `;

    const logEl = stage.querySelector('#sim-telem-log');
    const modeBadge = stage.querySelector('#cpu-mode-badge');
    const modeBit = stage.querySelector('#reg-mode-bit');
    const regPc = stage.querySelector('#reg-pc');
    const regRing = stage.querySelector('#reg-ring');

    const appendLog = (msg, color = 'var(--text-primary)') => {
      const line = document.createElement('div');
      line.style.color = color;
      line.textContent = `[TICK ${GlobalSimClock.cycleCount}] ${msg}`;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
    };

    // Calculate (Safe user instruction)
    stage.querySelector('#btn-inst-calc').addEventListener('click', () => {
      SoundFX.playClockTick();
      regPc.textContent = '0x0040_1028';
      appendLog('ADD EAX, EBX executed successfully in User Mode.', 'var(--color-emerald)');
    });

    // Write Port (Illegal privileged instruction in User Mode -> CPU Hardware Exception!)
    stage.querySelector('#btn-inst-port').addEventListener('click', () => {
      SoundFX.playAlarmStall();
      appendLog('CRITICAL: Privileged opcode "OUT 0x3F8" attempted with ModeBit=1!', 'var(--color-crimson)');
      appendLog('CPU TRAP: General Protection Fault #GP(0) triggered. Halting user thread.', 'var(--color-crimson)');
    });

    // Syscall INT 0x80 (Software Trap: flips mode bit to 0, invokes kernel dispatcher, returns to 1)
    stage.querySelector('#btn-inst-trap').addEventListener('click', () => {
      SoundFX.playTrapInterrupt();
      
      // Phase 1: Mode bit flip to 0
      modeBadge.textContent = 'KERNEL MODE [BIT: 0]';
      modeBadge.style.borderColor = 'var(--color-cyan)';
      modeBadge.style.color = 'var(--color-cyan)';
      modeBit.textContent = '0 (Kernel Mode)';
      modeBit.style.color = 'var(--color-cyan)';
      regRing.textContent = 'Ring 0 (Full Hardware Privilege)';
      regPc.textContent = '0xC000_8000';
      appendLog('SOFTWARE TRAP: INT 0x80 injected. Hardware flipped ModeBit from 1 -> 0.', 'var(--color-cyan)');
      appendLog('Kernel vector 0xC000_8000 executing syscall dispatcher in Ring-0.', 'var(--color-cyan)');

      // Phase 2: Kernel work finished, IRET returns to user mode
      setTimeout(() => {
        SoundFX.playClockTick();
        modeBadge.textContent = 'USER MODE [BIT: 1]';
        modeBadge.style.borderColor = 'var(--color-amber)';
        modeBadge.style.color = 'var(--color-amber)';
        modeBit.textContent = '1 (User Mode)';
        modeBit.style.color = 'var(--color-amber)';
        regRing.textContent = 'Ring 3 (Unprivileged)';
        regPc.textContent = '0x0040_1030';
        appendLog('SYSCALL COMPLETE: IRET instruction restored ModeBit to 1.', 'var(--color-emerald)');
      }, 1200);
    });

    return () => {};
  }

  // Simulator 2: FCFS Convoy Effect Wind-Tunnel with Gantt Chart (Deck 04)
  mountFCFSConvoySimulator(stage) {
    stage.innerHTML = `
      <div class="stage-header">
        <span class="stage-title">FCFS SCHEDULER & CONVOY EFFECT WIND-TUNNEL</span>
        <button class="btn-industrial" id="fcfs-reset-btn">RESET TO CONVOY PRESET</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px; flex: 1;">
        <!-- Process Queue Controller -->
        <div style="background: var(--bg-deep); border: 1px solid var(--border-trace); padding: 14px; display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 11px; color: var(--text-muted);">
            DRAG BURST SLIDERS OR SWAP ORDER TO OBSERVE WAITING TIME (WT) AND TURNAROUND TIME (TAT):
          </div>
          <div style="display: flex; gap: 12px; font-size: 12px;">
            <div>AVG WAITING TIME: <span id="fcfs-avg-wt" style="color: var(--color-amber); font-weight: 700;">17.0 ms</span></div>
            <div>AVG TURNAROUND TIME: <span id="fcfs-avg-tat" style="color: var(--color-cyan); font-weight: 700;">27.0 ms</span></div>
          </div>
        </div>

        <!-- Processes Cards -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div class="panel-chamfer" style="padding: 12px; border-color: var(--color-crimson);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: 700; color: var(--color-crimson);">P1 (CPU BATCH)</span>
              <span id="p1-burst-label" style="color: var(--color-amber); font-weight: 700;">24 ms</span>
            </div>
            <input type="range" id="p1-burst" min="1" max="40" value="24" class="timeline-slider" />
          </div>

          <div class="panel-chamfer" style="padding: 12px; border-color: var(--color-cyan);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: 700; color: var(--color-cyan);">P2 (UI THREAD)</span>
              <span id="p2-burst-label" style="color: var(--color-amber); font-weight: 700;">3 ms</span>
            </div>
            <input type="range" id="p2-burst" min="1" max="20" value="3" class="timeline-slider" />
          </div>

          <div class="panel-chamfer" style="padding: 12px; border-color: var(--color-emerald);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: 700; color: var(--color-emerald);">P3 (AUDIO THREAD)</span>
              <span id="p3-burst-label" style="color: var(--color-amber); font-weight: 700;">3 ms</span>
            </div>
            <input type="range" id="p3-burst" min="1" max="20" value="3" class="timeline-slider" />
          </div>
        </div>

        <!-- Live FCFS Gantt Chart -->
        <div style="background: var(--bg-deep); border: 1px solid var(--border-trace); padding: 16px; margin-top: auto;">
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 12px;">DYNAMIC GANTT CHART VISUALIZATION</div>
          <div id="fcfs-gantt-bar" style="height: 38px; display: flex; border: 1px solid var(--border-trace); overflow: hidden;"></div>
          <div id="fcfs-gantt-ticks" style="display: flex; font-size: 10px; color: var(--text-muted); margin-top: 6px;"></div>
        </div>
      </div>
    `;

    const p1Input = stage.querySelector('#p1-burst');
    const p2Input = stage.querySelector('#p2-burst');
    const p3Input = stage.querySelector('#p3-burst');

    const updateGantt = () => {
      const b1 = parseInt(p1Input.value);
      const b2 = parseInt(p2Input.value);
      const b3 = parseInt(p3Input.value);

      stage.querySelector('#p1-burst-label').textContent = `${b1} ms`;
      stage.querySelector('#p2-burst-label').textContent = `${b2} ms`;
      stage.querySelector('#p3-burst-label').textContent = `${b3} ms`;

      const total = b1 + b2 + b3;
      
      // Calculate FCFS metrics
      // Waiting times: WT(P1)=0, WT(P2)=b1, WT(P3)=b1+b2
      const wt1 = 0;
      const wt2 = b1;
      const wt3 = b1 + b2;
      const avgWt = ((wt1 + wt2 + wt3) / 3).toFixed(1);

      // Turnaround times: TAT(P1)=b1, TAT(P2)=b1+b2, TAT(P3)=b1+b2+b3
      const tat1 = b1;
      const tat2 = b1 + b2;
      const tat3 = total;
      const avgTat = ((tat1 + tat2 + tat3) / 3).toFixed(1);

      stage.querySelector('#fcfs-avg-wt').textContent = `${avgWt} ms`;
      stage.querySelector('#fcfs-avg-tat').textContent = `${avgTat} ms`;

      // Render Gantt Bar
      const bar = stage.querySelector('#fcfs-gantt-bar');
      bar.innerHTML = `
        <div style="width: ${(b1 / total) * 100}%; background: rgba(255, 42, 84, 0.4); border-right: 1px solid #FFF; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #FFF;">P1 (${b1}ms)</div>
        <div style="width: ${(b2 / total) * 100}%; background: rgba(0, 240, 255, 0.4); border-right: 1px solid #FFF; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #FFF;">P2 (${b2}ms)</div>
        <div style="width: ${(b3 / total) * 100}%; background: rgba(0, 255, 163, 0.4); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #FFF;">P3 (${b3}ms)</div>
      `;

      // Render Ticks
      const ticks = stage.querySelector('#fcfs-gantt-ticks');
      ticks.innerHTML = `
        <span style="width: ${(b1 / total) * 100}%">0ms</span>
        <span style="width: ${(b2 / total) * 100}%">${b1}ms</span>
        <span style="width: ${(b3 / total) * 100}%">${b1 + b2}ms</span>
        <span>${total}ms</span>
      `;
    };

    p1Input.addEventListener('input', updateGantt);
    p2Input.addEventListener('input', updateGantt);
    p3Input.addEventListener('input', updateGantt);

    stage.querySelector('#fcfs-reset-btn').addEventListener('click', () => {
      p1Input.value = 24;
      p2Input.value = 3;
      p3Input.value = 3;
      updateGantt();
      SoundFX.playRelayClick();
    });

    updateGantt();
    return () => {};
  }

  // Simulator 3: Assembly Race Condition Collider (Deck 09)
  mountRaceConditionSimulator(stage) {
    stage.innerHTML = `
      <div class="stage-header">
        <span class="stage-title">CONCURRENT ASSEMBLY RACE-CONDITION COLLIDER</span>
        <button class="btn-industrial" id="race-step-btn">EXECUTE NEXT CLOCK TICK [STEP]</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; flex: 1;">
        <!-- Thread 1: count++ -->
        <div style="background: var(--bg-deep); border: 1px solid var(--border-trace); padding: 14px;">
          <div style="color: var(--color-cyan); font-weight: 700; margin-bottom: 8px;">THREAD 1 (PRODUCER)</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">Goal: count++</div>
          <div style="display: flex; flex-direction: column; gap: 6px; font-family: var(--font-mono); font-size: 11px;">
            <div id="t1-inst-1" style="padding: 4px; background: rgba(255,255,255,0.03);">1. REG1 = count</div>
            <div id="t1-inst-2" style="padding: 4px; background: rgba(255,255,255,0.03);">2. REG1 = REG1 + 1</div>
            <div id="t1-inst-3" style="padding: 4px; background: rgba(255,255,255,0.03);">3. count = REG1</div>
          </div>
          <div style="margin-top: 20px; font-size: 11px;">
            REGISTER 1: <span id="t1-reg-val" style="color: var(--color-cyan); font-weight: 700;">-</span>
          </div>
        </div>

        <!-- Shared Memory Value -->
        <div style="background: var(--bg-silicon); border: 1px solid var(--border-trace); padding: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">SHARED MEMORY ADDRESS 0x2000</div>
          <div id="shared-count-display" style="font-size: 42px; font-weight: 700; color: var(--color-amber);">5</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">Initial count = 5</div>
        </div>

        <!-- Thread 2: count-- -->
        <div style="background: var(--bg-deep); border: 1px solid var(--border-trace); padding: 14px;">
          <div style="color: var(--color-crimson); font-weight: 700; margin-bottom: 8px;">THREAD 2 (CONSUMER)</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">Goal: count--</div>
          <div style="display: flex; flex-direction: column; gap: 6px; font-family: var(--font-mono); font-size: 11px;">
            <div id="t2-inst-1" style="padding: 4px; background: rgba(255,255,255,0.03);">1. REG2 = count</div>
            <div id="t2-inst-2" style="padding: 4px; background: rgba(255,255,255,0.03);">2. REG2 = REG2 - 1</div>
            <div id="t2-inst-3" style="padding: 4px; background: rgba(255,255,255,0.03);">3. count = REG2</div>
          </div>
          <div style="margin-top: 20px; font-size: 11px;">
            REGISTER 2: <span id="t2-reg-val" style="color: var(--color-crimson); font-weight: 700;">-</span>
          </div>
        </div>
      </div>
    `;

    let step = 0;
    let count = 5;
    let reg1 = 0;
    let reg2 = 0;

    const countDisplay = stage.querySelector('#shared-count-display');
    const t1Reg = stage.querySelector('#t1-reg-val');
    const t2Reg = stage.querySelector('#t2-reg-val');

    stage.querySelector('#race-step-btn').addEventListener('click', () => {
      SoundFX.playClockTick();
      step++;

      if (step === 1) {
        reg1 = count; // REG1 = 5
        t1Reg.textContent = `${reg1}`;
        stage.querySelector('#t1-inst-1').style.background = 'rgba(0, 240, 255, 0.2)';
      } else if (step === 2) {
        reg1 = reg1 + 1; // REG1 = 6
        t1Reg.textContent = `${reg1}`;
        stage.querySelector('#t1-inst-2').style.background = 'rgba(0, 240, 255, 0.2)';
      } else if (step === 3) {
        // Context switch before T1 stores! T2 runs!
        reg2 = count; // REG2 = 5
        t2Reg.textContent = `${reg2}`;
        stage.querySelector('#t2-inst-1').style.background = 'rgba(255, 42, 84, 0.2)';
      } else if (step === 4) {
        reg2 = reg2 - 1; // REG2 = 4
        t2Reg.textContent = `${reg2}`;
        stage.querySelector('#t2-inst-2').style.background = 'rgba(255, 42, 84, 0.2)';
      } else if (step === 5) {
        // T1 resumes and stores 6!
        count = reg1; // count = 6
        countDisplay.textContent = `${count}`;
        stage.querySelector('#t1-inst-3').style.background = 'rgba(0, 240, 255, 0.2)';
      } else if (step === 6) {
        // T2 resumes and overwrites with 4! Race condition manifested!
        count = reg2; // count = 4
        countDisplay.textContent = `${count}`;
        countDisplay.style.color = 'var(--color-crimson)';
        stage.querySelector('#t2-inst-3').style.background = 'rgba(255, 42, 84, 0.2)';
        SoundFX.playAlarmStall();
      } else {
        // Reset
        step = 0;
        count = 5;
        countDisplay.textContent = '5';
        countDisplay.style.color = 'var(--color-amber)';
        t1Reg.textContent = '-';
        t2Reg.textContent = '-';
        stage.querySelectorAll('[id^="t1-inst-"], [id^="t2-inst-"]').forEach(el => el.style.background = 'rgba(255,255,255,0.03)');
      }
    });

    return () => {};
  }

  // Generic Extensible Workbench for All Other Decks
  mountGenericOSWorkbench(node, stage) {
    stage.innerHTML = `
      <div class="stage-header">
        <span class="stage-title">${node.shortTitle.toUpperCase()} // INTERACTIVE BENCHMARK</span>
        <span class="brand-badge" style="border-color: var(--color-cyan); color: var(--color-cyan);">SIMULATOR READY</span>
      </div>

      <div style="background: var(--bg-deep); border: 1px solid var(--border-trace); padding: 24px; display: flex; flex-direction: column; gap: 16px; flex: 1;">
        <div style="font-size: 13px; font-weight: 600; color: var(--color-cyan);">
          SYSTEM TOPIC: ${node.summary}
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0;">
          <div style="background: var(--bg-silicon); padding: 14px; border: 1px solid var(--border-trace);">
            <div style="font-size: 10px; color: var(--text-muted);">ACTIVE ALGORITHM</div>
            <div style="font-size: 15px; font-weight: 700; color: var(--color-amber); margin-top: 4px;">${node.interactiveType}</div>
          </div>
          <div style="background: var(--bg-silicon); padding: 14px; border: 1px solid var(--border-trace);">
            <div style="font-size: 10px; color: var(--text-muted);">CHAPTER ALIGNMENT</div>
            <div style="font-size: 14px; font-weight: 700; color: var(--color-cyan); margin-top: 4px;">${node.silberschatz.chapter}</div>
          </div>
          <div style="background: var(--bg-silicon); padding: 14px; border: 1px solid var(--border-trace);">
            <div style="font-size: 10px; color: var(--text-muted);">SYSTEM STATUS</div>
            <div style="font-size: 14px; font-weight: 700; color: var(--color-emerald); margin-top: 4px;">STABLE / MONITORED</div>
          </div>
        </div>

        <div style="padding: 16px; background: rgba(0, 240, 255, 0.05); border-left: 3px solid var(--color-cyan); font-size: 12px; line-height: 1.5;">
          This interactive room is wired to the Silberschatz 10th Edition codex and CPCS-361 curriculum.
          Adjust simulation clock speed or advance ticks via the bottom oscilloscope scrubber to inspect cycle-by-cycle register transitions.
        </div>
      </div>
    `;

    return () => {};
  }
}
