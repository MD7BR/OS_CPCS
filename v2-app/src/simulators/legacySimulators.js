// Auto-extracted verbatim from v1 index.html by scripts/extract_from_v1.py
// Contains all 22 interactive OS simulators (W0-W19) + Formula Sandboxes.
/* eslint-disable */

let _soundRef = {
  click() {},
  chime() {},
  alarm() {},
  modeSwitch() {},
};

const Sound = {
  click(f) { _soundRef.click(f); },
  chime() { _soundRef.chime(); },
  alarm() { _soundRef.alarm(); },
  modeSwitch() { _soundRef.modeSwitch(); },
};

export function bindSimulatorSound(soundApi) {
  if (soundApi) _soundRef = soundApi;
}

const W0_DualModeSimulator = {
  modeBit: 1,
  currentInstruction: 'IDLE',
  status: 'Process running in User Space (Ring 3)',
  history: [],

  init() {
    this.modeBit = 1;
    this.currentInstruction = 'IDLE';
    this.status = 'Process running in User Space (Ring 3). Mode Bit = 1.';
    this.history = ['CPU initialized: Mode Bit = 1 (User Mode). Ready to dispatch instructions.'];
    this.render();
  },

  executeUser() {
    this.modeBit = 1;
    this.currentInstruction = 'ADD R1, #1';
    this.status = '✓ User instruction executed safely in Ring 3. Mode Bit remains 1.';
    this.history.unshift(`[USER] Executed '${this.currentInstruction}' -> Mode Bit = 1 (No trap)`);
    Sound.click();
    this.render();
  },

  executeHLT() {
    this.currentInstruction = 'HLT (Halt CPU)';
    this.history.unshift(`[VIOLATION] Attempted 'HLT' in User Mode (Mode Bit = 1)!`);
    this.triggerTrap('General Protection Fault (0x0D)', 'HLT is a privileged instruction. Hardware raised Trap #13. CPU switched Mode Bit 1 -> 0, vectored to IVT[0x0D], killed illegal process.');
  },

  executeCLI() {
    this.currentInstruction = 'CLI (Clear Interrupt Flag)';
    this.history.unshift(`[VIOLATION] Attempted 'CLI' in User Mode (Mode Bit = 1)!`);
    this.triggerTrap('Privileged Instruction Trap (0x0D)', 'Modifying interrupt flags is strictly privileged. Hardware trapped to kernel. Mode Bit flipped 1 -> 0.');
  },

  executeSyscall() {
    this.currentInstruction = 'INT 0x80 (sys_read)';
    this.modeBit = 0;
    this.status = '⚡ SYSTEM CALL TRAP: CPU transitioned to Kernel Mode (Mode Bit = 0). IVT[0x80] executed kernel service routine, then IRET flipped Mode Bit back to 1.';
    this.history.unshift(`[SYSCALL] INT 0x80 invoked -> Mode Bit: 1 -> 0 (Kernel) -> Service Routine -> IRET -> 0 -> 1 (User)`);
    Sound.chime();
    this.render();
  },

  executeTimer() {
    this.currentInstruction = 'TIMER_IRQ (Hardware Tick)';
    this.modeBit = 0;
    this.status = '⏱️ HARDWARE INTERRUPT: Timer decremented quantum to 0. Mode Bit switched 1 -> 0. Scheduler saved PCB context, selected next process, switched 0 -> 1.';
    this.history.unshift(`[IRQ] Timer tick fired -> Mode Bit: 1 -> 0 -> Context Switch -> 0 -> 1`);
    Sound.click(600);
    this.render();
  },

  triggerTrap(name, detail) {
    this.modeBit = 0;
    this.status = `⚠️ TRAP EXCEPTION: ${name} triggered! ${detail}`;
    Sound.alarm();
    this.render();
  },

  render() {
    const el = document.getElementById('w0-canvas');
    if (!el) return;
    const isKernel = this.modeBit === 0;
    el.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 14px;">
          <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.4); border: 1.5px solid ${isKernel ? 'var(--color-crimson)' : 'var(--color-cyan)'};">
            <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase;">CPU Hardware Register: Mode Bit</div>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
              <span style="font-family: var(--font-mono); font-size: 28px; font-weight: 800; color: ${isKernel ? 'var(--color-crimson)' : 'var(--color-cyan)'};">${this.modeBit}</span>
              <div>
                <strong style="color: ${isKernel ? 'var(--color-crimson)' : 'var(--color-cyan)'}; font-size: 13px;">${isKernel ? 'RING 0 : KERNEL MODE' : 'RING 3 : USER MODE'}</strong>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${isKernel ? 'All privileged hardware instructions unlocked' : 'Restricted execution; direct hardware access forbidden'}</div>
              </div>
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: var(--text-secondary);">
              Current Instruction: <code style="color: #fff; background: rgba(255,255,255,0.06); padding: 2px 6px;">${this.currentInstruction}</code>
            </div>
          </div>

          <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.4); border: 1px solid var(--border-trace);">
            <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--color-amber); text-transform: uppercase;">Dual-Mode Transition State</div>
            <div style="margin-top: 8px; font-size: 12px; line-height: 1.5; color: var(--text-primary);">${this.status}</div>
            <div style="margin-top: 10px; display: flex; align-items: center; gap: 6px; font-size: 10px; font-family: var(--font-mono);">
              <span class="brand-badge" style="border-color: ${!isKernel ? 'var(--color-cyan)' : 'var(--text-muted)'}; color: ${!isKernel ? 'var(--color-cyan)' : 'var(--text-muted)'};">USER SPACE (1)</span>
              <span>&harr; [TRAP / SYSCALL] &harr;</span>
              <span class="brand-badge" style="border-color: ${isKernel ? 'var(--color-crimson)' : 'var(--text-muted)'}; color: ${isKernel ? 'var(--color-crimson)' : 'var(--text-muted)'};">KERNEL SPACE (0)</span>
            </div>
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.6); border: 1px solid var(--border-trace); border-radius: 4px; padding: 10px 14px; font-family: var(--font-mono); font-size: 11px; max-height: 110px; overflow-y: auto;">
          <div style="color: var(--color-copper); font-weight: 700; margin-bottom: 6px; font-size: 9.5px; text-transform: uppercase;">Hardware Event Vector Log:</div>
          ${this.history.map(h => `<div style="margin-bottom: 3px; color: ${h.includes('VIOLATION') ? 'var(--color-crimson)' : h.includes('SYSCALL') ? 'var(--color-cyan)' : 'var(--text-secondary)'};">${h}</div>`).join('')}
        </div>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W11: Coffman Conditions & Deadlock Prevention (Deck 13)
// ----------------------------------------------------
const W11_CoffmanRAG = {
  conditions: {
    mutualExclusion: true,
    holdAndWait: true,
    noPreemption: true,
    circularWait: true
  },

  init() {
    this.render();
  },

  toggle(cond) {
    this.conditions[cond] = !this.conditions[cond];
    this.render();
    Sound.click();
  },

  render() {
    const el = document.getElementById('w11-canvas');
    if (!el) return;
    const c = this.conditions;
    const isDeadlock = c.mutualExclusion && c.holdAndWait && c.noPreemption && c.circularWait;

    el.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-trace);">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); margin-bottom: 8px;">THE 4 COFFMAN CONDITIONS (ALL 4 REQUIRED SIMULTANEOUSLY FOR DEADLOCK):</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 10px;">
            <button class="btn-industrial ${c.mutualExclusion ? 'danger' : ''}" onclick="W11_CoffmanRAG.toggle('mutualExclusion')" style="justify-content: space-between; padding: 10px 14px;">
              <span>1. Mutual Exclusion</span>
              <strong>${c.mutualExclusion ? '⚠️ ACTIVE (Locked)' : '✓ SPOOLED/SHARED'}</strong>
            </button>
            <button class="btn-industrial ${c.holdAndWait ? 'danger' : ''}" onclick="W11_CoffmanRAG.toggle('holdAndWait')" style="justify-content: space-between; padding: 10px 14px;">
              <span>2. Hold and Wait</span>
              <strong>${c.holdAndWait ? '⚠️ ACTIVE (Holding)' : '✓ ALLOCATE ALL AT ONCE'}</strong>
            </button>
            <button class="btn-industrial ${c.noPreemption ? 'danger' : ''}" onclick="W11_CoffmanRAG.toggle('noPreemption')" style="justify-content: space-between; padding: 10px 14px;">
              <span>3. No Preemption</span>
              <strong>${c.noPreemption ? '⚠️ ACTIVE (No steal)' : '✓ PREEMPT RESOURCES'}</strong>
            </button>
            <button class="btn-industrial ${c.circularWait ? 'danger' : ''}" onclick="W11_CoffmanRAG.toggle('circularWait')" style="justify-content: space-between; padding: 10px 14px;">
              <span>4. Circular Wait</span>
              <strong>${c.circularWait ? '⚠️ ACTIVE (Cycle P0->R1->P1->R0)' : '✓ STRICT RESOURCE ORDERING'}</strong>
            </button>
          </div>
        </div>

        <div class="panel-chamfer" style="padding: 14px; background: ${isDeadlock ? 'rgba(255,42,84,0.1)' : 'rgba(0,255,163,0.08)'}; border: 1.5px solid ${isDeadlock ? 'var(--color-crimson)' : 'var(--color-emerald)'};">
          <div style="font-weight: 700; font-size: 13px; color: ${isDeadlock ? 'var(--color-crimson)' : 'var(--color-emerald)'};">
            ${isDeadlock ? '🚨 FATAL DEADLOCK DETECTED! All 4 Coffman conditions hold.' : '🛡️ SYSTEM DEADLOCK-FREE! Deadlock prevented by breaking at least one Coffman condition.'}
          </div>
          <div style="margin-top: 6px; font-size: 12px; color: var(--text-primary); line-height: 1.5;">
            ${isDeadlock ? 'A circular dependency cycle has formed between processes P0, P1 and resources R0, R1. Neither process can proceed, causing indefinite freezing.' : 'Havender Prevention Protocol: By breaking one condition, a circular chain cannot form, mathematically guaranteeing zero deadlocks.'}
          </div>
        </div>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W12B: Wait-For Graph Deadlock Recovery (Deck 15)
// ----------------------------------------------------
const W12_DeadlockRecovery = {
  cycle: ['P1', 'P2', 'P3'],
  victim: null,
  recovered: false,

  init() {
    this.victim = null;
    this.recovered = false;
    this.render();
  },

  terminateVictim(p) {
    this.victim = p;
    this.recovered = true;
    Sound.chime();
    this.render();
  },

  render() {
    const el = document.getElementById('w12-recovery-canvas');
    if (!el) return;

    el.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-trace);">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); margin-bottom: 8px;">WAIT-FOR GRAPH CYCLE DETECTION:</div>
          <div style="font-family: var(--font-mono); font-size: 12px; color: ${this.recovered ? 'var(--color-emerald)' : 'var(--color-crimson)'};">
            ${this.recovered ? `✓ Cycle broken! Terminated victim ${this.victim} and reclaimed resources.` : `⚠️ Directed Cycle Detected: P1 &rarr; P2 &rarr; P3 &rarr; P1 (Deadlock)`}
          </div>
        </div>

        <div class="panel-chamfer" style="padding: 14px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-trace);">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-amber); margin-bottom: 8px;">VICTIM SELECTION BY RECOVERY COST (SILBERSCHATZ §8.8):</div>
          <div style="display: flex; gap: 10px;">
            <button class="btn-industrial ${this.victim === 'P1' ? 'primary' : ''}" onclick="W12_DeadlockRecovery.terminateVictim('P1')">Abort P1 (Priority 8, Cost: 40ms)</button>
            <button class="btn-industrial ${this.victim === 'P2' ? 'primary' : ''}" onclick="W12_DeadlockRecovery.terminateVictim('P2')">Abort P2 (Priority 2, Lowest Cost: 10ms - Optimal!)</button>
            <button class="btn-industrial ${this.victim === 'P3' ? 'primary' : ''}" onclick="W12_DeadlockRecovery.terminateVictim('P3')">Abort P3 (Priority 5, Cost: 25ms)</button>
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: var(--text-secondary);">
            ${this.recovered ? `<strong style="color:var(--color-emerald)">Recovery Action:</strong> Process ${this.victim} aborted. Held resource allocation returned to Available pool. Remaining processes resumed.` : 'Select a victim process to abort or rollback to safe checkpoint.'}
          </div>
        </div>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W17: File System & Inode Block Traversal (Deck 20)
// ----------------------------------------------------
const W17_InodeFileSystem = {
  fileSizeKB: 96,
  blockSizeKB: 4,

  init() {
    this.render();
  },

  setFileSize(sz) {
    this.fileSizeKB = Math.max(1, Math.min(32768, parseInt(sz, 10) || 4));
    this.render();
  },

  setBlockSize(bs) {
    this.blockSizeKB = Math.max(1, parseInt(bs, 10) || 4);
    this.render();
  },

  render() {
    const el = document.getElementById('w17-canvas');
    if (!el) return;
    const bs = this.blockSizeKB;
    const ptrsPerBlock = (bs * 1024) / 4; // 32-bit (4B) block pointers per block
    const blocksNeeded = Math.ceil(this.fileSizeKB / bs);
    const directMax = 12;
    const directUsed = Math.min(blocksNeeded, directMax);
    const remAfterDirect = Math.max(0, blocksNeeded - directMax);
    const singleUsed = Math.min(remAfterDirect, ptrsPerBlock);
    const remAfterSingle = Math.max(0, remAfterDirect - ptrsPerBlock);
    const doubleUsed = remAfterSingle;
    const indexBlocks = (singleUsed > 0 ? 1 : 0) + (doubleUsed > 0 ? 1 + Math.ceil(doubleUsed / ptrsPerBlock) : 0);

    el.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="play-controls-bar">
          <div class="play-ctrl">
            <label>File Size (KB):</label>
            <input type="range" class="play-range" min="4" max="8192" step="4" value="${Math.min(8192, this.fileSizeKB)}" oninput="W17_InodeFileSystem.setFileSize(this.value)" />
            <input type="number" class="play-num" min="1" max="32768" value="${this.fileSizeKB}" oninput="W17_InodeFileSystem.setFileSize(this.value)" />
          </div>
          <div class="play-ctrl">
            <label>Block Size:</label>
            <select class="play-num" style="width:92px;" onchange="W17_InodeFileSystem.setBlockSize(this.value)">
              <option value="1" ${bs===1?'selected':''}>1 KB</option>
              <option value="2" ${bs===2?'selected':''}>2 KB</option>
              <option value="4" ${bs===4?'selected':''}>4 KB</option>
              <option value="8" ${bs===8?'selected':''}>8 KB</option>
            </select>
          </div>
          <button class="btn-industrial ${this.fileSizeKB === 16 ? 'primary' : ''}" onclick="W17_InodeFileSystem.setFileSize(16)">16 KB</button>
          <button class="btn-industrial ${this.fileSizeKB === 44 ? 'primary' : ''}" onclick="W17_InodeFileSystem.setFileSize(44)">44 KB (Direct)</button>
          <button class="btn-industrial ${this.fileSizeKB === 96 ? 'primary' : ''}" onclick="W17_InodeFileSystem.setFileSize(96)">96 KB (Single Ind.)</button>
          <button class="btn-industrial ${this.fileSizeKB === 5000 ? 'primary' : ''}" onclick="W17_InodeFileSystem.setFileSize(5000)">5000 KB (Double Ind.)</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px;">
          <div style="padding: 10px; background: var(--primary-glow); border: 1px solid var(--color-cyan); border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: var(--color-cyan);">12 DIRECT POINTERS</div>
            <div style="font-size: 12px; margin-top: 4px; color: var(--text-primary);">Used: <strong>${directUsed}</strong> / 12 blocks</div>
            <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">Capacity &le; ${12 * bs} KB (1 disk read)</div>
          </div>
          <div style="padding: 10px; background: ${singleUsed > 0 ? 'var(--warning-bg)' : 'var(--bg-card)'}; border: 1px solid ${singleUsed > 0 ? 'var(--color-amber)' : 'var(--border)'}; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: var(--color-amber);">SINGLE INDIRECT POINTER</div>
            <div style="font-size: 12px; margin-top: 4px; color: var(--text-primary);">Used: <strong>${singleUsed}</strong> / ${ptrsPerBlock} ptrs</div>
            <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">+${ptrsPerBlock * bs} KB (2 disk reads)</div>
          </div>
          <div style="padding: 10px; background: ${doubleUsed > 0 ? 'var(--danger-bg)' : 'var(--bg-card)'}; border: 1px solid ${doubleUsed > 0 ? 'var(--color-crimson)' : 'var(--border)'}; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: ${doubleUsed > 0 ? 'var(--color-crimson)' : 'var(--text-secondary)'};">DOUBLE INDIRECT POINTER</div>
            <div style="font-size: 12px; margin-top: 4px; color: var(--text-primary);">Used: <strong>${doubleUsed}</strong> blocks</div>
            <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">Needs 3 disk reads per access</div>
          </div>
        </div>

        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Exam Workings (As Written By Hand)</span><span>4-Byte Pointer Assumption</span></div>
          <span class="hw-step">1) Data Blocks = &lceil; File Size / Block Size &rceil; = &lceil; ${this.fileSizeKB} / ${bs} &rceil; = <span class="hw-sub">${blocksNeeded} blocks</span></span>
          <span class="hw-step">2) Pointers per Index Block = (${bs} &times; 1024 B) / 4 B = <span class="hw-sub">${ptrsPerBlock} pointers/block</span></span>
          <span class="hw-step">3) Breakdown: 12 Direct (${directUsed} used) &rarr; Remaining = max(0, ${blocksNeeded} &minus; 12) = <span class="hw-sub">${remAfterDirect}</span></span>
          <span class="hw-step">   Single Indirect covers up to ${ptrsPerBlock} blocks (${singleUsed} used) &rarr; Double Indirect: <span class="hw-sub">${doubleUsed} blocks</span></span>
          <span class="hw-step">4) Index Overhead = <span class="hw-sub">${indexBlocks} index block(s)</span> | Total Allocated Disk Blocks = ${blocksNeeded} + ${indexBlocks} = <span class="hw-ans">${blocksNeeded + indexBlocks} blocks</span></span>
        </div>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W18: I/O Subsystems, Polling vs DMA (Deck 21)
// ----------------------------------------------------
const W18_IODMAModel = {
  mode: 'DMA',
  transferKB: 4,
  irqCostCycles: 120,

  init() {
    this.render();
  },

  setMode(m) {
    this.mode = m;
    this.render();
    Sound.click();
  },

  setTransferKB(val) {
    this.transferKB = Math.max(1, Math.min(256, parseInt(val, 10) || 4));
    this.render();
  },

  setIrqCost(val) {
    this.irqCostCycles = Math.max(10, Math.min(1000, parseInt(val, 10) || 120));
    this.render();
  },

  render() {
    const el = document.getElementById('w18-canvas');
    if (!el) return;
    const m = this.mode;
    const totalBytes = this.transferKB * 1024;
    const intIrqs = totalBytes;
    const dmaIrqs = 1;
    const intCycles = intIrqs * this.irqCostCycles;
    const dmaCycles = dmaIrqs * this.irqCostCycles;
    const speedup = (intCycles / dmaCycles).toLocaleString();

    el.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="play-controls-bar">
          <div class="play-ctrl">
            <label>Block Size (KB):</label>
            <input type="range" class="play-range" min="1" max="64" value="${this.transferKB}" oninput="W18_IODMAModel.setTransferKB(this.value)" />
            <input type="number" class="play-num" min="1" max="256" value="${this.transferKB}" oninput="W18_IODMAModel.setTransferKB(this.value)" />
          </div>
          <div class="play-ctrl">
            <label>ISR Overhead (cycles):</label>
            <input type="range" class="play-range" min="20" max="500" step="10" value="${this.irqCostCycles}" oninput="W18_IODMAModel.setIrqCost(this.value)" />
            <input type="number" class="play-num" min="10" max="1000" value="${this.irqCostCycles}" oninput="W18_IODMAModel.setIrqCost(this.value)" />
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-industrial ${m === 'Polling' ? 'danger' : ''}" onclick="W18_IODMAModel.setMode('Polling')">1. Programmed I/O (Polling)</button>
          <button class="btn-industrial ${m === 'Interrupt' ? 'primary' : ''}" onclick="W18_IODMAModel.setMode('Interrupt')">2. Interrupt-Driven I/O</button>
          <button class="btn-industrial ${m === 'DMA' ? 'primary' : ''}" onclick="W18_IODMAModel.setMode('DMA')">3. Direct Memory Access (DMA)</button>
        </div>

        <div class="panel-chamfer" style="padding: 14px; background: var(--bg-panel); border: 1.5px solid ${m === 'DMA' ? 'var(--color-emerald)' : m === 'Interrupt' ? 'var(--color-cyan)' : 'var(--color-crimson)'};">
          <div style="font-size: 12px; font-weight: 700; color: ${m === 'DMA' ? 'var(--color-emerald)' : m === 'Interrupt' ? 'var(--color-cyan)' : 'var(--color-crimson)'}; text-transform: uppercase;">
            ${m === 'Polling' ? 'POLLING (BUSY-WAITING) MODEL' : m === 'Interrupt' ? 'INTERRUPT-DRIVEN I/O MODEL' : 'DIRECT MEMORY ACCESS (DMA) BLOCK TRANSFER MODEL'}
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: var(--text-primary); line-height: 1.55;">
            ${m === 'Polling' ? '<strong>CPU Waste:</strong> CPU executes <code>while (device->busy);</code> polling status register every cycle. Zero interrupts, but 100% CPU wasted waiting.' : m === 'Interrupt' ? '<strong>Byte-by-Byte Interrupts:</strong> CPU gets interrupted after every single byte transferred over I/O bus — massive context-switch thrashing for fast disks/NICs.' : '<strong>Block Bypass:</strong> CPU programs DMA Controller (src, dst, count) once, then runs another process. DMA writes entire block directly into RAM using cycle-stealing, raising only <strong>1 interrupt at completion</strong>.'}
          </div>
        </div>

        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Exam Overhead Comparison (As Written By Hand)</span><span>${this.transferKB} KB Transfer</span></div>
          <span class="hw-step">Transfer Bytes = ${this.transferKB} KB &times; 1024 = <span class="hw-sub">${totalBytes.toLocaleString()} bytes</span></span>
          <span class="hw-step">&bull; Interrupt-Driven (1 IRQ/byte) = ${totalBytes.toLocaleString()} &times; ${this.irqCostCycles} cycles = <span class="hw-warn">${intCycles.toLocaleString()} CPU cycles lost</span></span>
          <span class="hw-step">&bull; DMA (1 IRQ/block) = 1 &times; ${this.irqCostCycles} cycles = <span class="hw-ans">${dmaCycles.toLocaleString()} CPU cycles lost (${speedup}&times; fewer IRQs!)</span></span>
        </div>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W19: Protection & Access Matrix Firewall (Deck 22)
// ----------------------------------------------------
const W19_AccessMatrix = {
  currentDomain: 'D1',
  testObject: 'File 1',
  testRight: 'W',
  matrix: {
    'D1': { 'File 1': 'R*, W', 'File 2': 'R', 'Printer': '-' },
    'D2': { 'File 1': '-', 'File 2': 'R, W, owner', 'Printer': 'Print' },
    'D3': { 'File 1': 'R', 'File 2': '-', 'Printer': 'Print' }
  },

  init() {
    this.render();
  },

  switchDomain(d) {
    this.currentDomain = d;
    this.render();
    Sound.click();
  },

  setCheck(obj, op) {
    if (obj) this.testObject = obj;
    if (op) this.testRight = op;
    this.render();
    Sound.click(900);
  },

  render() {
    const el = document.getElementById('w19-canvas');
    if (!el) return;
    const cellVal = (this.matrix[this.currentDomain] && this.matrix[this.currentDomain][this.testObject]) || '-';
    const allowed = cellVal.split(',').some(r => r.trim().replace('*', '').toLowerCase() === this.testRight.toLowerCase());

    el.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <label style="font-size: 11px; font-weight: 700; color: var(--color-cyan);">ACTIVE DOMAIN:</label>
          <button class="btn-industrial ${this.currentDomain === 'D1' ? 'primary' : ''}" onclick="W19_AccessMatrix.switchDomain('D1')">D1 (User App)</button>
          <button class="btn-industrial ${this.currentDomain === 'D2' ? 'primary' : ''}" onclick="W19_AccessMatrix.switchDomain('D2')">D2 (Spooler)</button>
          <button class="btn-industrial ${this.currentDomain === 'D3' ? 'primary' : ''}" onclick="W19_AccessMatrix.switchDomain('D3')">D3 (Auditor)</button>
        </div>

        <div class="play-controls-bar">
          <div class="play-ctrl">
            <label>Test Object:</label>
            <select class="play-num" style="width:105px;" onchange="W19_AccessMatrix.setCheck(this.value, null)">
              <option value="File 1" ${this.testObject==='File 1'?'selected':''}>File 1</option>
              <option value="File 2" ${this.testObject==='File 2'?'selected':''}>File 2</option>
              <option value="Printer" ${this.testObject==='Printer'?'selected':''}>Printer</option>
            </select>
          </div>
          <div class="play-ctrl">
            <label>Requested Op:</label>
            <select class="play-num" style="width:92px;" onchange="W19_AccessMatrix.setCheck(null, this.value)">
              <option value="R" ${this.testRight==='R'?'selected':''}>R (Read)</option>
              <option value="W" ${this.testRight==='W'?'selected':''}>W (Write)</option>
              <option value="Print" ${this.testRight==='Print'?'selected':''}>Print</option>
            </select>
          </div>
          <span class="nav-badge" style="background:${allowed ? 'var(--success-bg)' : 'var(--danger-bg)'}; color:${allowed ? 'var(--color-emerald)' : 'var(--color-crimson)'}; border-color:${allowed ? 'var(--color-emerald)' : 'var(--color-crimson)'};">
            ${allowed ? '✓ ACCESS GRANTED' : '✕ TRAP: ACCESS DENIED'}
          </span>
        </div>

        <table class="data-table">
          <thead>
            <tr><th>Domain (Row = Capability)</th><th>Object: File 1</th><th>Object: File 2</th><th>Object: Printer</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${Object.keys(this.matrix).map(dom => `
              <tr style="${dom === this.currentDomain ? 'background: var(--primary-glow); border-left: 3px solid var(--color-cyan);' : ''}">
                <td><strong>${dom}</strong> ${dom === this.currentDomain ? '(ACTIVE)' : ''}</td>
                <td><code>${this.matrix[dom]['File 1']}</code></td>
                <td><code>${this.matrix[dom]['File 2']}</code></td>
                <td><code>${this.matrix[dom]['Printer']}</code></td>
                <td>${dom === this.currentDomain ? '<span style="color:var(--color-cyan); font-weight:700;">ACTIVE PRIVILEGES</span>' : '<span style="color:var(--text-muted)">Dormant</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Access Lookup &amp; Implementation Split</span><span>M[Domain, Object]</span></div>
          <span class="hw-step">Lookup M[${this.currentDomain}, ${this.testObject}] = { <span class="hw-sub">${cellVal}</span> }</span>
          <span class="hw-step">Is requested operation '${this.testRight}' &isin; M[${this.currentDomain}, ${this.testObject}]? &rarr; <span class="${allowed ? 'hw-ans' : 'hw-warn'}">${allowed ? 'YES &rarr; GRANTED' : 'NO &rarr; PROTECTION FAULT'}</span></span>
          <span class="hw-step"><span class="hw-dim">Rule: Copy flag (*) allows vertical copy inside same column; ACL = column slice per object; Capability List = row slice per domain.</span></span>
        </div>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W1: Process State Machine (M2)
// ----------------------------------------------------
const W1_StateMachine = {
  currentState: 'New',
  states: ['New', 'Ready', 'Running', 'Waiting', 'Terminated'],
  transitions: {
    'New': [{ to: 'Ready', action: 'Admit', desc: 'Long-term scheduler admits process to ready queue.' }],
    'Ready': [{ to: 'Running', action: 'Dispatch', desc: 'Short-term scheduler selects process to execute.' }],
    'Running': [
      { to: 'Ready', action: 'Interrupt / Timeout', desc: 'Timer interrupt expired or higher-priority process arrived.' },
      { to: 'Waiting', action: 'I/O or Event Wait', desc: 'Process requested I/O or is waiting for an event/signal.' },
      { to: 'Terminated', action: 'Exit', desc: 'Process finished execution or encountered a fatal error.' }
    ],
    'Waiting': [{ to: 'Ready', action: 'I/O Completion', desc: 'I/O operation completed; moved back to ready queue.' }],
    'Terminated': [{ to: 'New', action: 'Reset New Process', desc: 'Spawn a new process.' }]
  },

  init() {
    this.render();
  },

  trigger(action) {
    const valid = (this.transitions[this.currentState] || []).find(t => t.action === action);
    const narr = document.getElementById('w1-narr');
    if (valid) {
      this.currentState = valid.to;
      if (narr) narr.innerHTML = `<strong>Action: ${valid.action}</strong> &rarr; Moved to state <strong>${valid.to}</strong>. <br><span style="color:var(--text-secondary)">${valid.desc}</span>`;
      Sound.click(960);
      this.render();
    } else {
      if (narr) narr.innerHTML = `<span style="color:var(--color-crimson)">⚠️ Invalid transition! Cannot perform '${action}' from '${this.currentState}'.</span>`;
      Sound.alarm();
    }
  },

  render() {
    const container = document.getElementById('w1-canvas');
    const actionsBar = document.getElementById('w1-actions');
    if (!container) return;

    const s = this.currentState;
    const nodeBox = (x, y, w, h, label) => {
      const active = s === label;
      const fillCol = active ? 'var(--primary)' : 'var(--bg-panel-elevated)';
      const strokeCol = active ? 'var(--color-amber)' : 'var(--color-cyan)';
      const textCol = active ? 'var(--on-primary)' : 'var(--text-primary)';
      return `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${fillCol}" stroke="${strokeCol}" stroke-width="${active ? '3' : '1.8'}" />
        <text x="${x + w/2}" y="${y + h/2 + 5}" fill="${textCol}" font-weight="800" text-anchor="middle" font-size="13.5" font-family="var(--font-mono)">${label}</text>
      `;
    };

    container.innerHTML = `
      <svg viewBox="0 0 700 245" style="width:100%; max-width:660px; display:block;">
        <defs>
          <marker id="w1-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-cyan)" />
          </marker>
        </defs>

        <!-- New State -->
        ${nodeBox(18, 92, 92, 44, 'New')}

        <!-- New -> Ready -->
        <path d="M 110 114 L 176 114" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="143" y="102" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">Admit</text>

        <!-- Ready State -->
        ${nodeBox(182, 92, 100, 44, 'Ready')}

        <!-- Ready -> Running -->
        <path d="M 282 114 L 358 114" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="320" y="102" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">Dispatch</text>

        <!-- Running State -->
        ${nodeBox(364, 92, 112, 44, 'Running')}

        <!-- Running -> Ready (Interrupt) -->
        <path d="M 405 92 C 365 36, 275 36, 240 88" fill="none" stroke="var(--color-amber)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="320" y="34" fill="var(--color-amber)" font-size="11" font-weight="600" text-anchor="middle">Interrupt / Quantum Expired</text>

        <!-- Waiting State -->
        ${nodeBox(270, 184, 110, 44, 'Waiting')}

        <!-- Running -> Waiting -->
        <path d="M 418 136 C 418 172, 398 196, 384 202" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="456" y="176" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">I/O Wait</text>

        <!-- Waiting -> Ready -->
        <path d="M 270 202 C 232 194, 218 170, 222 140" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="190" y="180" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">I/O Done</text>

        <!-- Running -> Terminated -->
        <path d="M 476 114 L 542 114" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#w1-arrow)"/>
        <text x="509" y="102" fill="var(--text-secondary)" font-size="11" font-weight="600" text-anchor="middle">Exit</text>

        <!-- Terminated State -->
        ${nodeBox(548, 92, 128, 44, 'Terminated')}
      </svg>
    `;

    if (actionsBar) {
      const possible = this.transitions[this.currentState] || [];
      actionsBar.innerHTML = possible.map(p => `
        <button class="btn-industrial primary" onclick="W1_StateMachine.trigger('${p.action}')">${p.action}</button>
      `).join(' ');
    }
  }
};

// ----------------------------------------------------
// W2: fork() Tree Visualizer (M2)
// ----------------------------------------------------
const W2_ForkVisualizer = {
  nForks: 3,
  init() {
    this.render();
  },
  update(val) {
    this.nForks = Math.max(1, Math.min(5, parseInt(val, 10) || 1));
    const rng = document.getElementById('w2-range');
    const num = document.getElementById('w2-num');
    if (rng && rng.value != this.nForks) rng.value = this.nForks;
    if (num && num.value != this.nForks) num.value = this.nForks;
    this.render();
  },
  render() {
    const container = document.getElementById('w2-canvas');
    const stats = document.getElementById('w2-stats');
    const hand = document.getElementById('w2-hand');
    if (!container) return;

    const totalProcesses = Math.pow(2, this.nForks);
    const childProcesses = totalProcesses - 1;

    if (stats) {
      stats.innerHTML = `
        <span>Total Processes: <strong style="color:var(--color-cyan)">${totalProcesses}</strong> (2<sup>${this.nForks}</sup>)</span> &nbsp;|&nbsp;
        <span>Unique Child Processes created: <strong style="color:var(--color-emerald)">${childProcesses}</strong> (2<sup>${this.nForks}</sup> &minus; 1)</span>
      `;
    }

    const width = 620;
    const height = 56 + this.nForks * 48;
    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; max-width:620px; display:block;">`;

    let currentLevel = [{ x: width / 2, y: 28, pid: 'P0' }];
    svg += `<text x="12" y="32" fill="var(--text-secondary)" font-size="10" font-family="var(--font-mono)">Init</text>`;

    let edgesSvg = '';
    let nodesSvg = `<circle cx="${width/2}" cy="28" r="14" fill="var(--color-cyan)" stroke="var(--color-amber)" stroke-width="2" />
      <text x="${width/2}" y="32" fill="var(--on-primary)" font-size="10" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">P0</text>`;

    let pCounter = 1;
    for (let level = 1; level <= this.nForks; level++) {
      let nextLevel = [];
      const y = 28 + level * 48;
      svg += `<text x="12" y="${y + 4}" fill="var(--text-secondary)" font-size="10" font-family="var(--font-mono)">fork #${level}</text>`;

      for (let i = 0; i < currentLevel.length; i++) {
        const parent = currentLevel[i];
        const dx = (width - 90) / Math.pow(2, level + 1);
        const leftX = parent.x - dx;
        const rightX = parent.x + dx;

        edgesSvg += `<line x1="${parent.x}" y1="${parent.y}" x2="${leftX}" y2="${y}" stroke="var(--border-light)" stroke-width="1.8"/>`;
        nodesSvg += `<circle cx="${leftX}" cy="${y}" r="12" fill="var(--bg-panel-elevated)" stroke="var(--color-cyan)" stroke-width="1.8"/>`;
        nodesSvg += `<text x="${leftX}" y="${y+3.5}" fill="var(--text-primary)" font-size="9" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${parent.pid}</text>`;

        const childPid = `P${pCounter++}`;
        edgesSvg += `<line x1="${parent.x}" y1="${parent.y}" x2="${rightX}" y2="${y}" stroke="var(--color-purple)" stroke-width="2"/>`;
        nodesSvg += `<circle cx="${rightX}" cy="${y}" r="12" fill="var(--color-purple)" stroke="var(--border-light)" stroke-width="1.2"/>`;
        nodesSvg += `<text x="${rightX}" y="${y+3.5}" fill="#fff" font-size="9" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">${childPid}</text>`;

        nextLevel.push({ x: leftX, y: y, pid: parent.pid });
        nextLevel.push({ x: rightX, y: y, pid: childPid });
      }
      currentLevel = nextLevel;
    }

    svg += edgesSvg + nodesSvg + `</svg>`;
    container.innerHTML = svg;

    if (hand) {
      hand.innerHTML = `
        <div class="hw-title"><span>✍️ Exam Derivation (As Written By Hand)</span><span>${this.nForks} sequential fork() calls</span></div>
        <span class="hw-step">Given n = ${this.nForks} fork() calls in sequence (Parent = P0)</span>
        <span class="hw-step">&bull; Total Processes = 2<sup>n</sup> = 2<sup>${this.nForks}</sup> = <span class="hw-ans">${totalProcesses} processes</span></span>
        <span class="hw-step">&bull; New Child Processes = 2<sup>n</sup> &minus; 1 = ${totalProcesses} &minus; 1 = <span class="hw-ans">${childProcesses} children</span> (P1..P${childProcesses})</span>
      `;
    }
  }
};

// ----------------------------------------------------
// W2B: Amdahl's Law Parallel Speedup Lab (Deck 03)
// ----------------------------------------------------
const W2B_AmdahlLab = {
  sPct: 25,
  cores: 4,
  init() { this.render(); },
  update(sPct, cores) {
    if (sPct !== null && sPct !== undefined) this.sPct = Math.max(1, Math.min(100, parseFloat(sPct) || 1));
    if (cores !== null && cores !== undefined) this.cores = Math.max(1, Math.min(64, parseInt(cores, 10) || 1));
    const sR = document.getElementById('w2b-s-range'), sN = document.getElementById('w2b-s-num');
    const nR = document.getElementById('w2b-n-range'), nN = document.getElementById('w2b-n-num');
    if (sR) sR.value = this.sPct;
    if (sN) sN.value = this.sPct;
    if (nR) nR.value = this.cores;
    if (nN) nN.value = this.cores;
    this.render();
  },
  render() {
    const out = document.getElementById('w2b-canvas');
    if (!out) return;
    const S = +(this.sPct / 100).toFixed(2);
    const P = +(1 - S).toFixed(2);
    const N = this.cores;
    const parShare = P / N;
    const denom = S + parShare;
    const speedup = 1 / denom;
    const maxLim = S > 0 ? (1 / S) : Infinity;

    const serBarW = (S / Math.max(0.001, denom)) * 100;
    const parBarW = (parShare / Math.max(0.001, denom)) * 100;

    out.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="font-size:11px; color:var(--text-secondary);">Normalized Execution Time Ratio (<strong style="color:var(--text-primary)">1.00 &rarr; ${denom.toFixed(4)}</strong>):</div>
        <div style="display:flex; height:26px; width:${Math.min(100, denom*100).toFixed(1)}%; min-width:95px; border:1px solid var(--border-light); border-radius:4px; overflow:hidden; font-family:var(--font-mono); font-size:10px; font-weight:700;">
          <div style="width:${serBarW.toFixed(1)}%; background:var(--color-crimson); color:#fff; display:flex; align-items:center; justify-content:center;">S=${S.toFixed(2)}</div>
          ${P > 0 ? `<div style="width:${parBarW.toFixed(1)}%; background:var(--color-cyan); color:var(--on-primary); display:flex; align-items:center; justify-content:center;">(1-S)/N=${parShare.toFixed(3)}</div>` : ''}
        </div>
        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Exam Workings (As Written By Hand)</span><span>Serial=${S.toFixed(2)} | Cores=${N}</span></div>
          <span class="hw-step">Speedup &le; 1 / [ S + (1 &minus; S) / N ]</span>
          <span class="hw-step">       = 1 / [ ${S.toFixed(2)} + (1 &minus; ${S.toFixed(2)}) / ${N} ]</span>
          <span class="hw-step">       = 1 / [ ${S.toFixed(2)} + ${P.toFixed(2)} / ${N} ] = 1 / [ ${S.toFixed(2)} + <span class="hw-sub">${parShare.toFixed(4)}</span> ] = 1 / <span class="hw-sub">${denom.toFixed(4)}</span> = <span class="hw-ans">${speedup.toFixed(2)}&times; Speedup</span></span>
          <span class="hw-step">Asymptotic Ceiling (N &rarr; &infin;): Max Speedup = 1 / S = 1 / ${S.toFixed(2)} = <span class="hw-sub">${Number.isFinite(maxLim) ? maxLim.toFixed(2) + '×' : '∞'}</span></span>
        </div>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W3: CPU Scheduling Simulator (M3)
// ----------------------------------------------------
const W3_CPUScheduler = {
  algorithm: 'FCFS',
  quantum: 4,
  selectedIdx: 0,
  processes: [
    { id: 'P1', at: 0, bt: 24, p: 3 },
    { id: 'P2', at: 0, bt: 3, p: 1 },
    { id: 'P3', at: 0, bt: 3, p: 4 }
  ],

  loadExample(type) {
    this.selectedIdx = 0;
    if (type === 'standard') {
      this.algorithm = this.algorithm || 'FCFS';
      this.processes = [
        { id: 'P1', at: 0, bt: 24, p: 3 },
        { id: 'P2', at: 0, bt: 3, p: 1 },
        { id: 'P3', at: 0, bt: 3, p: 4 }
      ];
    } else if (type === 'srtf') {
      this.algorithm = 'SRTF';
      this.processes = [
        { id: 'P1', at: 0, bt: 8, p: 1 },
        { id: 'P2', at: 1, bt: 4, p: 1 },
        { id: 'P3', at: 2, bt: 9, p: 1 },
        { id: 'P4', at: 3, bt: 5, p: 1 }
      ];
    } else if (type === 'priority') {
      this.algorithm = 'Priority-Pre';
      this.processes = [
        { id: 'P1', at: 0, bt: 10, p: 3 },
        { id: 'P2', at: 0, bt: 1, p: 1 },
        { id: 'P3', at: 0, bt: 2, p: 4 },
        { id: 'P4', at: 0, bt: 1, p: 5 },
        { id: 'P5', at: 0, bt: 5, p: 2 }
      ];
    } else if (type === 'rr') {
      this.algorithm = 'RR';
      this.quantum = 4;
      this.processes = [
        { id: 'P1', at: 0, bt: 24, p: 1 },
        { id: 'P2', at: 0, bt: 3, p: 1 },
        { id: 'P3', at: 0, bt: 3, p: 1 }
      ];
    }
    this.syncUI();
    this.calculate(false);
  },

  addProcess() {
    if (this.processes.length >= 8) return;
    const nums = this.processes.map(p => parseInt(p.id.replace('P', ''), 10) || 0);
    const nextNum = (nums.length ? Math.max(...nums) : 0) + 1;
    this.processes.push({ id: `P${nextNum}`, at: 0, bt: 4, p: 2 });
    this.selectedIdx = this.processes.length - 1;
    this.syncUI();
    this.calculate(false);
    Sound.click(980);
  },

  removeProcess(idx) {
    if (this.processes.length <= 1) return;
    this.processes.splice(idx, 1);
    if (this.selectedIdx >= this.processes.length) this.selectedIdx = this.processes.length - 1;
    this.syncUI();
    this.calculate(false);
    Sound.click(700);
  },

  selectProc(idx) {
    this.selectedIdx = Math.max(0, Math.min(this.processes.length - 1, parseInt(idx, 10) || 0));
    this.syncUI();
  },

  setQuantum(val) {
    this.quantum = Math.max(1, Math.min(30, parseInt(val, 10) || 1));
    this.syncUI();
    this.calculate(true);
  },

  updateProcField(idx, field, rawVal, fromSlider = false) {
    const proc = this.processes[idx];
    if (!proc) return;
    let v = parseInt(rawVal, 10);
    if (isNaN(v)) return;
    if (field === 'bt') v = Math.max(1, Math.min(60, v));
    else if (field === 'at') v = Math.max(0, Math.min(60, v));
    else if (field === 'p') v = Math.max(1, Math.min(20, v));
    proc[field] = v;
    this.selectedIdx = idx;
    if (fromSlider) {
      const cellEl = document.getElementById(`w3-cell-${field}-${idx}`);
      if (cellEl) cellEl.value = v;
    }
    this.syncSliderReadouts();
    this.calculate(true);
  },

  syncSliderReadouts() {
    const proc = this.processes[this.selectedIdx] || this.processes[0];
    if (!proc) return;
    const setVal = (id, v) => { const e = document.getElementById(id); if (e && e.value != v) e.value = v; };
    setVal('w3-sl-at-r', proc.at); setVal('w3-sl-at-n', proc.at);
    setVal('w3-sl-bt-r', proc.bt); setVal('w3-sl-bt-n', proc.bt);
    setVal('w3-sl-p-r', proc.p);   setVal('w3-sl-p-n', proc.p);
  },

  syncUI() {
    const sel = document.getElementById('w3-algo');
    const qIn = document.getElementById('w3-quantum');
    const qWrap = document.getElementById('w3-q-ctrl');
    const qRange = document.getElementById('w3-q-range');
    if (sel) sel.value = this.algorithm;
    if (qIn) qIn.value = this.quantum;
    if (qRange) qRange.value = this.quantum;
    if (qWrap) qWrap.style.display = (this.algorithm === 'RR') ? 'inline-flex' : 'none';
    const pSel = document.getElementById('w3-sl-proc');
    if (pSel) {
      pSel.innerHTML = this.processes.map((p, i) => `<option value="${i}" ${i === this.selectedIdx ? 'selected' : ''}>${p.id}</option>`).join('');
    }
    this.syncSliderReadouts();
  },

  calculate(preserveInputs = false) {
    const algo = this.algorithm;
    const q = Math.max(1, parseInt(this.quantum, 10) || 4);
    const procs = this.processes.map((p, origIdx) => ({ ...p, origIdx }));

    let timeline = [];
    let currentTime = 0;
    let completed = 0;
    const n = procs.length;

    procs.forEach(p => {
      p.rem = p.bt;
      p.ct = 0;
      p.tat = 0;
      p.wt = 0;
      p.rt = -1;
      p.firstStart = -1;
    });

    if (algo === 'FCFS') {
      const order = [...procs].sort((a, b) => a.at - b.at || a.origIdx - b.origIdx);
      order.forEach(p => {
        if (currentTime < p.at) {
          timeline.push({ proc: 'Idle', start: currentTime, end: p.at });
          currentTime = p.at;
        }
        if (p.rt === -1) { p.rt = currentTime - p.at; p.firstStart = currentTime; }
        timeline.push({ proc: p.id, start: currentTime, end: currentTime + p.bt });
        currentTime += p.bt;
        p.ct = currentTime;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.bt;
      });
    } else if (algo === 'SJF') {
      let done = new Set();
      while (completed < n) {
        let available = procs.filter(p => p.at <= currentTime && !done.has(p.id));
        if (available.length === 0) {
          let nextArr = Math.min(...procs.filter(p => !done.has(p.id)).map(p => p.at));
          timeline.push({ proc: 'Idle', start: currentTime, end: nextArr });
          currentTime = nextArr;
          continue;
        }
        available.sort((a, b) => a.bt - b.bt || a.at - b.at || a.origIdx - b.origIdx);
        let cur = available[0];
        if (cur.rt === -1) { cur.rt = currentTime - cur.at; cur.firstStart = currentTime; }
        timeline.push({ proc: cur.id, start: currentTime, end: currentTime + cur.bt });
        currentTime += cur.bt;
        cur.ct = currentTime;
        cur.tat = cur.ct - cur.at;
        cur.wt = cur.tat - cur.bt;
        done.add(cur.id);
        completed++;
      }
    } else if (algo === 'SRTF') {
      let lastProc = null;
      let lastStart = 0;
      while (completed < n) {
        let available = procs.filter(p => p.at <= currentTime && p.rem > 0);
        if (available.length === 0) {
          let nextArr = Math.min(...procs.filter(p => p.rem > 0).map(p => p.at));
          if (lastProc) {
            timeline.push({ proc: lastProc, start: lastStart, end: currentTime });
            lastProc = null;
          }
          timeline.push({ proc: 'Idle', start: currentTime, end: nextArr });
          currentTime = nextArr;
          continue;
        }
        available.sort((a, b) => a.rem - b.rem || a.at - b.at || a.origIdx - b.origIdx);
        let cur = available[0];
        if (cur.rt === -1) { cur.rt = currentTime - cur.at; cur.firstStart = currentTime; }

        if (cur.id !== lastProc) {
          if (lastProc) timeline.push({ proc: lastProc, start: lastStart, end: currentTime });
          lastProc = cur.id;
          lastStart = currentTime;
        }

        cur.rem--;
        currentTime++;

        if (cur.rem === 0) {
          timeline.push({ proc: cur.id, start: lastStart, end: currentTime });
          lastProc = null;
          cur.ct = currentTime;
          cur.tat = cur.ct - cur.at;
          cur.wt = cur.tat - cur.bt;
          completed++;
        }
      }
    } else if (algo === 'Priority-NonPre') {
      let done = new Set();
      while (completed < n) {
        let available = procs.filter(p => p.at <= currentTime && !done.has(p.id));
        if (available.length === 0) {
          let nextArr = Math.min(...procs.filter(p => !done.has(p.id)).map(p => p.at));
          timeline.push({ proc: 'Idle', start: currentTime, end: nextArr });
          currentTime = nextArr;
          continue;
        }
        available.sort((a, b) => a.p - b.p || a.at - b.at || a.origIdx - b.origIdx);
        let cur = available[0];
        if (cur.rt === -1) { cur.rt = currentTime - cur.at; cur.firstStart = currentTime; }
        timeline.push({ proc: cur.id, start: currentTime, end: currentTime + cur.bt });
        currentTime += cur.bt;
        cur.ct = currentTime;
        cur.tat = cur.ct - cur.at;
        cur.wt = cur.tat - cur.bt;
        done.add(cur.id);
        completed++;
      }
    } else if (algo === 'Priority-Pre') {
      let lastProc = null;
      let lastStart = 0;
      while (completed < n) {
        let available = procs.filter(p => p.at <= currentTime && p.rem > 0);
        if (available.length === 0) {
          let nextArr = Math.min(...procs.filter(p => p.rem > 0).map(p => p.at));
          if (lastProc) {
            timeline.push({ proc: lastProc, start: lastStart, end: currentTime });
            lastProc = null;
          }
          timeline.push({ proc: 'Idle', start: currentTime, end: nextArr });
          currentTime = nextArr;
          continue;
        }
        available.sort((a, b) => a.p - b.p || a.at - b.at || a.origIdx - b.origIdx);
        let cur = available[0];
        if (cur.rt === -1) { cur.rt = currentTime - cur.at; cur.firstStart = currentTime; }

        if (cur.id !== lastProc) {
          if (lastProc) timeline.push({ proc: lastProc, start: lastStart, end: currentTime });
          lastProc = cur.id;
          lastStart = currentTime;
        }

        cur.rem--;
        currentTime++;

        if (cur.rem === 0) {
          timeline.push({ proc: cur.id, start: lastStart, end: currentTime });
          lastProc = null;
          cur.ct = currentTime;
          cur.tat = cur.ct - cur.at;
          cur.wt = cur.tat - cur.bt;
          completed++;
        }
      }
    } else if (algo === 'RR') {
      let queue = [];
      let inQueue = new Set();
      let pList = [...procs].sort((a, b) => a.at - b.at || a.origIdx - b.origIdx);

      let addArrivals = (time) => {
        pList.forEach(p => {
          if (p.at <= time && !inQueue.has(p.id) && p.rem > 0) {
            queue.push(p);
            inQueue.add(p.id);
          }
        });
      };

      addArrivals(currentTime);

      while (completed < n) {
        if (queue.length === 0) {
          let nextArr = Math.min(...procs.filter(p => p.rem > 0).map(p => p.at));
          timeline.push({ proc: 'Idle', start: currentTime, end: nextArr });
          currentTime = nextArr;
          addArrivals(currentTime);
          continue;
        }

        let cur = queue.shift();
        inQueue.delete(cur.id);

        if (cur.rt === -1) { cur.rt = currentTime - cur.at; cur.firstStart = currentTime; }
        let runTime = Math.min(q, cur.rem);
        timeline.push({ proc: cur.id, start: currentTime, end: currentTime + runTime });
        currentTime += runTime;
        cur.rem -= runTime;

        addArrivals(currentTime);

        if (cur.rem === 0) {
          cur.ct = currentTime;
          cur.tat = cur.ct - cur.at;
          cur.wt = cur.tat - cur.bt;
          completed++;
        } else {
          queue.push(cur);
          inQueue.add(cur.id);
        }
      }
    }

    this.renderGantt(timeline);
    this.renderTable(procs, timeline, preserveInputs);
  },

  renderGantt(timeline) {
    const container = document.getElementById('w3-gantt');
    if (!container) return;

    if (timeline.length === 0) {
      container.innerHTML = '<p style="color:var(--text-secondary);">No timeline generated.</p>';
      return;
    }

    const totalDuration = timeline[timeline.length - 1].end;
    const width = 760;
    const scale = width / Math.max(1, totalDuration);

    let svg = `<svg viewBox="0 0 ${width + 44} 102" style="width:100%; max-width:820px; display:block;">`;

    const getCol = (name) => {
      if (name === 'Idle') return 'var(--bg-panel-elevated)';
      const idx = parseInt(name.replace('P', ''), 10) || 1;
      const palette = ['#0284c7', '#ea580c', '#059669', '#9333ea', '#e11d48', '#0891b2', '#db2777', '#65a30d'];
      return palette[(idx - 1) % palette.length];
    };

    let lastLabelX = -100;
    let stagger = false;

    timeline.forEach(block => {
      const x = block.start * scale + 22;
      const w = Math.max(1.5, (block.end - block.start) * scale);
      const col = getCol(block.proc);

      svg += `<rect x="${x}" y="14" width="${w}" height="44" fill="${col}" stroke="var(--bg-deep)" stroke-width="1.5" rx="2"><title>${block.proc}: ${block.start} &rarr; ${block.end} (${block.end - block.start} ms)</title></rect>`;
      if (w > 22) {
        svg += `<text x="${x + w/2}" y="41" fill="#ffffff" font-weight="800" font-size="12.5" text-anchor="middle" font-family="var(--font-mono)">${block.proc}</text>`;
      }
      svg += `<line x1="${x}" y1="58" x2="${x}" y2="66" stroke="var(--border-light)" stroke-width="1.5" />`;
      const yLbl = (x - lastLabelX < 24) ? (stagger ? 94 : 80) : 80;
      if (x - lastLabelX < 24) stagger = !stagger; else stagger = false;
      svg += `<text x="${x}" y="${yLbl}" fill="var(--text-primary)" font-size="11.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${block.start}</text>`;
      lastLabelX = x;
    });

    const lastX = totalDuration * scale + 22;
    const endY = (lastX - lastLabelX < 24) ? (stagger ? 94 : 80) : 80;
    svg += `<line x1="${lastX}" y1="58" x2="${lastX}" y2="66" stroke="var(--border-light)" stroke-width="1.5" />`;
    svg += `<text x="${lastX}" y="${endY}" fill="var(--color-amber)" font-size="12" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">${totalDuration}</text>`;

    svg += `</svg>`;
    container.innerHTML = svg;
  },

  renderTable(procs, timeline = [], preserveInputs = false) {
    const container = document.getElementById('w3-table-body');
    const summary = document.getElementById('w3-summary');
    const hand = document.getElementById('w3-handwritten');
    if (!container) return;

    let totalTAT = 0;
    let totalWT = 0;
    let totalRT = 0;

    procs.forEach(p => {
      totalTAT += p.tat;
      totalWT += p.wt;
      totalRT += p.rt;
    });

    if (preserveInputs && container.children.length === procs.length) {
      procs.forEach((p) => {
        const i = p.origIdx;
        const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        setTxt(`w3-ct-${i}`, p.ct);
        setTxt(`w3-tat-${i}`, p.tat);
        setTxt(`w3-wt-${i}`, p.wt);
        setTxt(`w3-rt-${i}`, p.rt);
      });
    } else {
      let rows = procs.map(p => {
        const i = p.origIdx;
        return `
          <tr>
            <td><strong>${p.id}</strong></td>
            <td><input type="number" class="cell-num" id="w3-cell-at-${i}" min="0" max="60" value="${p.at}" oninput="W3_CPUScheduler.updateProcField(${i}, 'at', this.value)" /></td>
            <td><input type="number" class="cell-num" id="w3-cell-bt-${i}" min="1" max="60" value="${p.bt}" oninput="W3_CPUScheduler.updateProcField(${i}, 'bt', this.value)" /></td>
            <td><input type="number" class="cell-num" id="w3-cell-p-${i}" min="1" max="20" value="${p.p}" oninput="W3_CPUScheduler.updateProcField(${i}, 'p', this.value)" /></td>
            <td><strong id="w3-ct-${i}">${p.ct}</strong></td>
            <td id="w3-tat-${i}">${p.tat}</td>
            <td id="w3-wt-${i}">${p.wt}</td>
            <td id="w3-rt-${i}">${p.rt}</td>
            <td>${procs.length > 1 ? `<button type="button" class="btn-mini" title="Remove ${p.id}" onclick="W3_CPUScheduler.removeProcess(${i})">&times;</button>` : ''}</td>
          </tr>
        `;
      }).join('');
      container.innerHTML = rows;
    }

    const n = procs.length;
    const avgTAT = (totalTAT / n).toFixed(2);
    const avgWT = (totalWT / n).toFixed(2);
    const avgRT = (totalRT / n).toFixed(2);

    if (summary) {
      summary.innerHTML = `
        <div style="display:flex; gap:24px; flex-wrap:wrap; font-size:0.95rem;">
          <div>Average Turnaround Time (TAT = CT - AT): <strong style="color:var(--primary); font-size:1.1rem;">${avgTAT} ms</strong></div>
          <div>Average Waiting Time (WT = TAT - BT): <strong style="color:var(--warning); font-size:1.1rem;">${avgWT} ms</strong></div>
          <div>Average Response Time (RT): <strong style="color:var(--success); font-size:1.1rem;">${avgRT} ms</strong></div>
        </div>
      `;
    }

    if (hand) {
      const ganttTrace = timeline.map(b => `${b.start} &rarr; [${b.proc}: ${b.end - b.start}ms] &rarr; ${b.end}`).join(' | ');
      const tatTerms = procs.map(p => p.tat).join(' + ');
      const wtTerms = procs.map(p => p.wt).join(' + ');
      const rtTerms = procs.map(p => p.rt).join(' + ');
      hand.innerHTML = `
        <div class="hw-title"><span>✍️ Exam Paper Workings (As Written By Hand)</span><span>${this.algorithm}${this.algorithm === 'RR' ? ` (q = ${this.quantum})` : ''} | N = ${n}</span></div>
        <span class="hw-step"><strong>1. Trace Gantt Chart:</strong> ${ganttTrace}</span>
        <span class="hw-step"><strong>2. Formulas:</strong> <span class="hw-sub">TAT = CT &minus; AT</span> ,  <span class="hw-sub">WT = TAT &minus; BT</span> ,  <span class="hw-sub">RT = FirstRun &minus; AT</span></span>
        ${procs.map(p => `<span class="hw-step">   ${p.id}: CT = ${p.ct},  TAT = ${p.ct} &minus; ${p.at} = <span class="hw-sub">${p.tat}</span>,  WT = ${p.tat} &minus; ${p.bt} = <span class="hw-sub">${p.wt}</span>,  RT = ${p.firstStart} &minus; ${p.at} = ${p.rt}</span>`).join('')}
        <span class="hw-step"><strong>3. Averages:</strong></span>
        <span class="hw-step">   Avg TAT = (${tatTerms}) / ${n} = ${totalTAT} / ${n} = <span class="hw-ans">${avgTAT} ms</span></span>
        <span class="hw-step">   Avg WT  = (${wtTerms}) / ${n} = ${totalWT} / ${n} = <span class="hw-ans">${avgWT} ms</span></span>
        <span class="hw-step">   Avg RT  = (${rtTerms}) / ${n} = ${totalRT} / ${n} = <span class="hw-sub">${avgRT} ms</span></span>
      `;
    }
  }
};

// ----------------------------------------------------
// W4: Exponential Averaging Burst Predictor (Deck 05)
// ----------------------------------------------------
const W4_ExpAveragingLab = {
  alpha: 0.5,
  tau0: 10,
  bursts: [6, 4, 6, 4, 13, 13],
  init() { this.render(); },
  updateAlpha(val) {
    this.alpha = Math.max(0, Math.min(1, parseFloat(val) || 0));
    const r = document.getElementById('w4-alpha-r'), n = document.getElementById('w4-alpha-n');
    if (r) r.value = this.alpha;
    if (n) n.value = this.alpha;
    this.render();
  },
  updateTau0(val) {
    this.tau0 = Math.max(0, Math.min(100, parseFloat(val) || 0));
    this.render();
  },
  updateBursts(str) {
    const arr = str.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x) && x > 0);
    if (arr.length > 0) this.bursts = arr.slice(0, 10);
    this.render();
  },
  render() {
    const el = document.getElementById('w4-canvas');
    if (!el) return;
    const a = this.alpha;
    const oneMinusA = +(1 - a).toFixed(4);
    let tau = this.tau0;
    const rows = [];
    this.bursts.forEach((tn, idx) => {
      const nextTau = a * tn + (1 - a) * tau;
      rows.push({ idx, tauPrev: tau, tn, nextTau });
      tau = nextTau;
    });

    el.innerHTML = `
      <div class="handwritten-sheet">
        <div class="hw-title"><span>✍️ Exponential Averaging Exam Table (Silberschatz Fig. 5.4)</span><span>&alpha; = ${a.toFixed(2)} | &tau;<sub>0</sub> = ${this.tau0}</span></div>
        <span class="hw-step">Formula: &tau;<sub>n+1</sub> = &alpha;&middot;t<sub>n</sub> + (1 &minus; &alpha;)&middot;&tau;<sub>n</sub> = <span class="hw-sub">${a.toFixed(2)}&middot;t<sub>n</sub> + ${oneMinusA.toFixed(2)}&middot;&tau;<sub>n</sub></span></span>
        ${rows.map(r => `<span class="hw-step">Step ${r.idx + 1} (t<sub>${r.idx}</sub>=${r.tn}): &tau;<sub>${r.idx + 1}</sub> = ${a.toFixed(2)}(${r.tn}) + ${oneMinusA.toFixed(2)}(${r.tauPrev.toFixed(2)}) = ${(a * r.tn).toFixed(2)} + ${((1 - a) * r.tauPrev).toFixed(2)} = <span class="hw-ans">${r.nextTau.toFixed(2)} ms</span></span>`).join('')}
      </div>
    `;
  }
};

// ----------------------------------------------------
// W4B: Priority Aging Escalator (Deck 07)
// ----------------------------------------------------
const W4B_AgingLab = {
  initPrio: 10,
  waitTime: 45,
  agingStep: 15,
  topPrio: 0,
  init() { this.render(); },
  update(initP, waitT, stepT) {
    if (initP !== null) this.initPrio = Math.max(0, Math.min(40, parseInt(initP, 10) || 0));
    if (waitT !== null) this.waitTime = Math.max(0, Math.min(300, parseInt(waitT, 10) || 0));
    if (stepT !== null) this.agingStep = Math.max(1, Math.min(60, parseInt(stepT, 10) || 1));
    const set = (id, v) => { const e = document.getElementById(id); if (e && e.value != v) e.value = v; };
    set('w4b-ip-r', this.initPrio); set('w4b-ip-n', this.initPrio);
    set('w4b-wt-r', this.waitTime); set('w4b-wt-n', this.waitTime);
    set('w4b-st-r', this.agingStep); set('w4b-st-n', this.agingStep);
    this.render();
  },
  render() {
    const el = document.getElementById('w4b-canvas');
    if (!el) return;
    const boost = Math.floor(this.waitTime / this.agingStep);
    const effPrio = Math.max(this.topPrio, this.initPrio - boost);
    el.innerHTML = `
      <div class="handwritten-sheet">
        <div class="hw-title"><span>✍️ Aging Escalation Calculation (Lower Integer = Higher Priority)</span><span>Prevents Starvation</span></div>
        <span class="hw-step">Formula: EffectivePriority(t) = max(TopPriority, Initial &minus; &lfloor;WaitTime / Step&rfloor;)</span>
        <span class="hw-step">Boost Earned = &lfloor;${this.waitTime} / ${this.agingStep}&rfloor; = <span class="hw-sub">${boost} priority levels</span></span>
        <span class="hw-step">New Priority = max(${this.topPrio}, ${this.initPrio} &minus; ${boost}) = <span class="hw-ans">${effPrio}</span> ${effPrio === 0 ? '<span class="hw-sub">(REACHED MAX URGENCY!)</span>' : ''}</span>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W5: Race Condition Interleaver (M4)
// ----------------------------------------------------
const W5_RaceCondition = {
  counter: 5,
  steps: [
    { actor: 'Producer', code: 'reg1 = counter', r1: 5, r2: '-', c: 5, desc: 'Producer loads counter (5) into reg1.' },
    { actor: 'Producer', code: 'reg1 = reg1 + 1', r1: 6, r2: '-', c: 5, desc: 'Producer increments reg1 to 6.' },
    { actor: 'Consumer', code: 'reg2 = counter', r1: 6, r2: 5, c: 5, desc: '⚡ CONTEXT SWITCH: Consumer loads counter (5) into reg2!' },
    { actor: 'Consumer', code: 'reg2 = reg2 - 1', r1: 6, r2: 4, c: 5, desc: 'Consumer decrements reg2 to 4.' },
    { actor: 'Producer', code: 'counter = reg1', r1: 6, r2: 4, c: 6, desc: '⚡ Producer resumes: writes reg1 (6) to counter.' },
    { actor: 'Consumer', code: 'counter = reg2', r1: 6, r2: 4, c: 4, desc: '⚡ Consumer resumes: overwrites counter with reg2 (4)! Value 6 is LOST!' }
  ],
  currentStep: 0,

  init() {
    this.render();
  },

  setStep(val) {
    this.currentStep = Math.max(0, Math.min(this.steps.length, parseInt(val, 10) || 0));
    this.render();
  },

  next() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      this.render();
    }
  },

  reset() {
    this.currentStep = 0;
    this.render();
  },

  render() {
    const tableBody = document.getElementById('w5-table-body');
    const narr = document.getElementById('w5-narr');
    const r = document.getElementById('w5-step-r');
    const n = document.getElementById('w5-step-n');
    if (r) r.value = this.currentStep;
    if (n) n.value = this.currentStep;
    if (!tableBody) return;

    let cur = this.currentStep > 0 ? this.steps[this.currentStep - 1] : { r1: '-', r2: '-', c: 5, desc: 'Initial state: counter = 5. Step through or scrub slider (0..6).' };

    if (narr) {
      narr.innerHTML = `<strong>Step ${this.currentStep} / ${this.steps.length}:</strong> ${cur.desc} <br>
      <span style="font-weight:700; color:${cur.c !== 5 ? 'var(--color-crimson)' : 'var(--text-primary)'}">Current Shared counter = ${cur.c}</span> (Expected without race condition: 5)`;
    }

    tableBody.innerHTML = this.steps.map((st, i) => {
      const isPast = i < this.currentStep;
      const isCurrent = i === this.currentStep - 1;
      return `
        <tr style="${isCurrent ? 'background:var(--primary-glow); font-weight:bold;' : isPast ? 'opacity:0.9;' : 'opacity:0.42;'}">
          <td>${i + 1}</td>
          <td><span class="nav-badge" style="background:${st.actor === 'Producer' ? 'var(--primary-glow)' : 'var(--warning-bg)'}; color:${st.actor === 'Producer' ? 'var(--color-cyan)' : 'var(--color-amber)'}; border-color:${st.actor === 'Producer' ? 'var(--color-cyan)' : 'var(--color-amber)'};">${st.actor}</span></td>
          <td><code>${st.code}</code></td>
          <td>${isPast ? st.r1 : '-'}</td>
          <td>${isPast ? st.r2 : '-'}</td>
          <td><strong style="color:${isPast && st.c !== 5 ? 'var(--color-crimson)' : 'var(--text-primary)'};">${isPast ? st.c : '-'}</strong></td>
        </tr>
      `;
    }).join('');
  }
};

// ----------------------------------------------------
// W6: Bounded Buffer Circular Queue (M4 & M6)
// ----------------------------------------------------
const W6_BoundedBuffer = {
  size: 6,
  buffer: [null, null, null, null, null, null],
  inPtr: 0,
  outPtr: 0,
  itemCounter: 1,

  init() {
    this.render();
  },

  setSize(sz) {
    this.size = Math.max(4, Math.min(10, parseInt(sz, 10) || 6));
    this.reset();
  },

  produce() {
    const nextIn = (this.inPtr + 1) % this.size;
    const narr = document.getElementById('w6-narr');
    if (nextIn === this.outPtr) {
      if (narr) narr.innerHTML = `<span style="color:var(--color-crimson)">⚠️ Buffer FULL! ( (in+1) % ${this.size} == out ). Producer must wait!</span>`;
      return;
    }
    this.buffer[this.inPtr] = `Item ${this.itemCounter++}`;
    if (narr) narr.innerHTML = `Produced <strong>${this.buffer[this.inPtr]}</strong> at slot <strong>${this.inPtr}</strong>. Next in = ${nextIn}.`;
    this.inPtr = nextIn;
    this.render();
  },

  consume() {
    const narr = document.getElementById('w6-narr');
    if (this.inPtr === this.outPtr) {
      if (narr) narr.innerHTML = `<span style="color:var(--color-amber)">⚠️ Buffer EMPTY! ( in == out ). Consumer must wait!</span>`;
      return;
    }
    const item = this.buffer[this.outPtr];
    this.buffer[this.outPtr] = null;
    const nextOut = (this.outPtr + 1) % this.size;
    if (narr) narr.innerHTML = `Consumed <strong>${item}</strong> from slot <strong>${this.outPtr}</strong>. Next out = ${nextOut}.`;
    this.outPtr = nextOut;
    this.render();
  },

  reset() {
    this.buffer = Array(this.size).fill(null);
    this.inPtr = 0;
    this.outPtr = 0;
    this.itemCounter = 1;
    this.render();
  },

  render() {
    const container = document.getElementById('w6-canvas');
    const hand = document.getElementById('w6-hand');
    const r = document.getElementById('w6-sz-r'), n = document.getElementById('w6-sz-n');
    if (r) r.value = this.size;
    if (n) n.value = this.size;
    if (!container) return;

    const count = this.buffer.filter(x => x !== null).length;
    let svg = `<svg viewBox="0 0 460 270" style="width:100%; max-width:460px; display:block;">`;

    const cx = 230;
    const cy = 135;
    const rRing = 92;

    for (let i = 0; i < this.size; i++) {
      const angle = (i * 2 * Math.PI) / this.size - Math.PI / 2;
      const x = cx + rRing * Math.cos(angle);
      const y = cy + rRing * Math.sin(angle);
      const item = this.buffer[i];
      const isIn = (this.inPtr === i);
      const isOut = (this.outPtr === i);

      svg += `<circle cx="${x}" cy="${y}" r="24" fill="${item ? 'var(--color-cyan)' : 'var(--bg-panel-elevated)'}" stroke="${isIn ? 'var(--color-amber)' : isOut ? 'var(--color-emerald)' : 'var(--border-light)'}" stroke-width="${isIn || isOut ? '2.5' : '1.8'}" />`;
      svg += `<text x="${x}" y="${y - 4}" fill="${item ? 'var(--on-primary)' : 'var(--text-secondary)'}" font-size="10.5" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">[${i}]</text>`;
      svg += `<text x="${x}" y="${y + 11}" fill="${item ? 'var(--on-primary)' : 'var(--text-muted)'}" font-size="9.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${item ? item.replace('Item ', '#') : 'empty'}</text>`;

      if (isIn) {
        svg += `<text x="${x}" y="${y + 39}" fill="var(--color-amber)" font-size="10.5" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">&uarr; IN</text>`;
      }
      if (isOut) {
        svg += `<text x="${x}" y="${y - 31}" fill="var(--color-emerald)" font-size="10.5" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">&darr; OUT</text>`;
      }
    }

    svg += `<circle cx="${cx}" cy="${cy}" r="38" fill="var(--bg-panel)" stroke="var(--border-light)" stroke-width="1.5" />`;
    svg += `<text x="${cx}" y="${cy - 5}" fill="var(--text-secondary)" font-size="10" text-anchor="middle">Occupied</text>`;
    svg += `<text x="${cx}" y="${cy + 15}" fill="var(--color-cyan)" font-size="16" font-weight="800" text-anchor="middle" font-family="var(--font-mono)">${count} / ${this.size - 1}</text>`;

    svg += `</svg>`;
    container.innerHTML = svg;

    if (hand) {
      const nextIn = (this.inPtr + 1) % this.size;
      hand.innerHTML = `
        <div class="hw-title"><span>✍️ Circular Buffer Pointer Math</span><span>N = ${this.size} slots (${this.size - 1} usable)</span></div>
        <span class="hw-step">in = ${this.inPtr}, out = ${this.outPtr} &rarr; nextIn = (${this.inPtr} + 1) mod ${this.size} = <span class="hw-sub">${nextIn}</span></span>
        <span class="hw-step">Status: ${this.inPtr === this.outPtr ? '<span class="hw-warn">EMPTY (in == out)</span>' : nextIn === this.outPtr ? '<span class="hw-warn">FULL ((in+1)%N == out)</span>' : `<span class="hw-ans">READY (${count} occupied, ${(this.size - 1) - count} free)</span>`}</span>
      `;
    }
  }
};

// ----------------------------------------------------
// W7: Critical Section Algorithm Tracer (M5)
// ----------------------------------------------------
const W7_CriticalSection = {
  currentAlgo: 'peterson',
  step: 0,
  petersonSteps: [
    { p0Line: 'flag[0] = true;', p1Line: '-', f0: true, f1: false, turn: 0, cs: 'None', desc: 'P0 expresses intent to enter: flag[0] = true.' },
    { p0Line: 'turn = 1;', p1Line: '-', f0: true, f1: false, turn: 1, cs: 'None', desc: 'P0 sets turn = 1 (gives priority to P1).' },
    { p0Line: '-', p1Line: 'flag[1] = true;', f0: true, f1: true, turn: 1, cs: 'None', desc: 'P1 expresses intent to enter: flag[1] = true.' },
    { p0Line: '-', p1Line: 'turn = 0;', f0: true, f1: true, turn: 0, cs: 'None', desc: 'P1 sets turn = 0 (gives priority to P0).' },
    { p0Line: 'while(flag[1] && turn==1);', p1Line: 'while(flag[0] && turn==0);', f0: true, f1: true, turn: 0, cs: 'P0 ENTERS CS', desc: 'P0 check: flag[1]==true but turn!=1 (turn is 0) &rarr; P0 enters CS! P1 spins (turn==0).' },
    { p0Line: 'flag[0] = false;', p1Line: '-', f0: false, f1: true, turn: 0, cs: 'P1 ENTERS CS', desc: 'P0 exits CS and sets flag[0] = false. P1 leaves spin loop and enters CS!' }
  ],

  init() {
    this.render();
  },

  setStep(val) {
    this.step = Math.max(0, Math.min(this.petersonSteps.length, parseInt(val, 10) || 0));
    this.render();
  },

  nextStep() {
    if (this.step < this.petersonSteps.length) {
      this.step++;
      this.render();
    }
  },

  reset() {
    this.step = 0;
    this.render();
  },

  render() {
    const tbody = document.getElementById('w7-table-body');
    const narr = document.getElementById('w7-narr');
    const r = document.getElementById('w7-step-r'), n = document.getElementById('w7-step-n');
    if (r) r.value = this.step;
    if (n) n.value = this.step;
    if (!tbody) return;

    const cur = this.step > 0 ? this.petersonSteps[this.step - 1] : { p0Line: '-', p1Line: '-', f0: false, f1: false, turn: 0, cs: 'None', desc: 'Initial: flag[0]=false, flag[1]=false, turn=0. Step or scrub slider (0..6).' };

    if (narr) {
      narr.innerHTML = `<strong>Step ${this.step} / ${this.petersonSteps.length}:</strong> ${cur.desc} <br>
      Active in Critical Section: <strong style="color:var(--color-cyan); font-size:1.05rem;">${cur.cs}</strong>`;
    }

    tbody.innerHTML = this.petersonSteps.map((st, i) => {
      const isPast = i < this.step;
      const isCurrent = i === this.step - 1;
      return `
        <tr style="${isCurrent ? 'background:var(--primary-glow); font-weight:bold;' : isPast ? 'opacity:0.9;' : 'opacity:0.42;'}">
          <td>${i + 1}</td>
          <td><code>${st.p0Line}</code></td>
          <td><code>${st.p1Line}</code></td>
          <td>${isPast ? (st.f0 ? 'True' : 'False') : '-'}</td>
          <td>${isPast ? (st.f1 ? 'True' : 'False') : '-'}</td>
          <td>${isPast ? st.turn : '-'}</td>
          <td><strong style="color:${st.cs.includes('ENTERS') ? 'var(--color-emerald)' : 'var(--text-secondary)'}">${isPast ? st.cs : '-'}</strong></td>
        </tr>
      `;
    }).join('');
  }
};

// ----------------------------------------------------
// W8: Semaphore Playground (M6)
// ----------------------------------------------------
const W8_Semaphore = {
  initValue: 1,
  value: 1,
  queue: [],
  procCount: 1,

  init() {
    this.render();
  },

  setInitial(val) {
    this.initValue = Math.max(0, Math.min(8, parseInt(val, 10) || 1));
    this.reset();
  },

  wait() {
    const proc = `P${this.procCount++}`;
    this.value--;
    const narr = document.getElementById('w8-narr');
    if (this.value < 0) {
      this.queue.push(proc);
      if (narr) narr.innerHTML = `<code>wait()</code> called by <strong>${proc}</strong>. S = <strong>${this.value}</strong> (&lt; 0) &rarr; <strong>${proc} BLOCKED</strong> (queued |${this.value}| = ${this.queue.length} waiting).`;
    } else {
      if (narr) narr.innerHTML = `<code>wait()</code> called by <strong>${proc}</strong>. S = <strong>${this.value}</strong> (&ge; 0) &rarr; <strong>${proc} ENTERS CS</strong>.`;
    }
    this.render();
  },

  signal() {
    const narr = document.getElementById('w8-narr');
    this.value++;
    if (this.value <= 0 && this.queue.length > 0) {
      const unblocked = this.queue.shift();
      if (narr) narr.innerHTML = `<code>signal()</code> called. S = <strong>${this.value}</strong> (&le; 0) &rarr; <strong>${unblocked} WOKEN UP</strong> to enter CS!`;
    } else {
      if (narr) narr.innerHTML = `<code>signal()</code> called. S = <strong>${this.value}</strong>. Queue empty; resource free.`;
    }
    this.render();
  },

  reset() {
    this.value = this.initValue;
    this.queue = [];
    this.procCount = 1;
    const narr = document.getElementById('w8-narr');
    if (narr) narr.innerHTML = `Semaphore initialized to S = ${this.value}. Click wait() / signal() to trace.`;
    this.render();
  },

  render() {
    const valElem = document.getElementById('w8-val');
    const queueElem = document.getElementById('w8-queue');
    const r = document.getElementById('w8-init-r'), n = document.getElementById('w8-init-n');
    if (r) r.value = this.initValue;
    if (n) n.value = this.initValue;
    if (valElem) {
      valElem.innerText = this.value;
      valElem.style.color = this.value < 0 ? 'var(--color-crimson)' : this.value === 0 ? 'var(--color-amber)' : 'var(--color-emerald)';
    }
    if (queueElem) {
      if (this.queue.length === 0) {
        queueElem.innerHTML = '<span style="color:var(--text-secondary);">[ Empty Queue ]</span>';
      } else {
        queueElem.innerHTML = this.queue.map(p => `
          <span class="nav-badge" style="background:var(--danger-bg); color:var(--color-crimson); border-color:var(--color-crimson); font-size:0.85rem; padding:4px 10px; margin-right:6px;">${p} (Blocked)</span>
        `).join('');
      }
    }
  }
};

// ----------------------------------------------------
// W10: Dining Philosophers Table (M7)
// ----------------------------------------------------
const W10_DiningPhilosophers = {
  states: ['THINKING', 'THINKING', 'THINKING', 'THINKING', 'THINKING'],
  chopsticks: [true, true, true, true, true],

  init() {
    this.render();
  },

  toggle(i) {
    const narr = document.getElementById('w10-narr');
    if (this.states[i] === 'THINKING' || this.states[i] === 'HUNGRY') {
      this.states[i] = 'HUNGRY';
      const left = i;
      const right = (i + 1) % 5;
      if (this.chopsticks[left] && this.chopsticks[right]) {
        this.chopsticks[left] = false;
        this.chopsticks[right] = false;
        this.states[i] = 'EATING';
        if (narr) narr.innerHTML = `Philosopher <strong>P${i}</strong> acquired chopsticks C${left} &amp; C${right} &rarr; Now <strong style="color:var(--color-emerald)">EATING</strong>!`;
      } else {
        if (narr) narr.innerHTML = `Philosopher <strong>P${i}</strong> is <strong style="color:var(--color-amber)">HUNGRY</strong> waiting for busy chopstick C${!this.chopsticks[left] ? left : right}.`;
      }
    } else if (this.states[i] === 'EATING') {
      this.chopsticks[i] = true;
      this.chopsticks[(i + 1) % 5] = true;
      this.states[i] = 'THINKING';
      if (narr) narr.innerHTML = `Philosopher <strong>P${i}</strong> put down chopsticks C${i} &amp; C${(i+1)%5}. Now <strong style="color:var(--color-cyan)">THINKING</strong>.`;
    }
    this.render();
  },

  triggerDeadlock() {
    const narr = document.getElementById('w10-narr');
    this.states = ['HUNGRY', 'HUNGRY', 'HUNGRY', 'HUNGRY', 'HUNGRY'];
    this.chopsticks = [false, false, false, false, false];
    if (narr) {
      narr.innerHTML = `
        <strong style="color:var(--color-crimson)">⚠️ CIRCULAR DEADLOCK OCCURRED!</strong><br>
        Every P<sub>i</sub> holds left chopstick C<sub>i</sub> and blocks forever waiting for right chopstick C<sub>(i+1)%5</sub>.
      `;
    }
    this.render();
  },

  reset() {
    this.states = ['THINKING', 'THINKING', 'THINKING', 'THINKING', 'THINKING'];
    this.chopsticks = [true, true, true, true, true];
    const narr = document.getElementById('w10-narr');
    if (narr) narr.innerHTML = 'Click any Philosopher circle (P0..P4) to toggle THINKING &harr; HUNGRY/EATING.';
    this.render();
  },

  render() {
    const container = document.getElementById('w10-canvas');
    if (!container) return;

    let svg = `<svg viewBox="0 0 420 330" style="width:100%; max-width:420px; display:block;">`;
    const cx = 210, cy = 165, r = 92;

    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--bg-panel-elevated)" stroke="var(--border-light)" stroke-width="2" />`;
    svg += `<text x="${cx}" y="${cy - 4}" fill="var(--text-primary)" font-size="12" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">Dining Table</text>`;
    svg += `<text x="${cx}" y="${cy + 14}" fill="var(--text-secondary)" font-size="10" text-anchor="middle" font-family="var(--font-mono)">(Click P0..P4)</text>`;

    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = cx + (r + 44) * Math.cos(angle);
      const py = cy + (r + 44) * Math.sin(angle);

      const st = this.states[i];
      const col = st === 'EATING' ? 'var(--color-emerald)' : st === 'HUNGRY' ? 'var(--color-amber)' : 'var(--color-cyan)';
      const txtCol = 'var(--on-primary)';

      svg += `<circle cx="${px}" cy="${py}" r="23" fill="${col}" stroke="var(--border-light)" stroke-width="2" style="cursor:pointer;" onclick="W10_DiningPhilosophers.toggle(${i})"/>`;
      svg += `<text x="${px}" y="${py + 1}" fill="${txtCol}" font-weight="800" font-size="11.5" text-anchor="middle" pointer-events="none" font-family="var(--font-mono)">P${i}</text>`;
      svg += `<text x="${px}" y="${py + 12}" fill="${txtCol}" font-weight="700" font-size="7.5" text-anchor="middle" pointer-events="none" font-family="var(--font-mono)">${st.slice(0,5)}</text>`;

      const cAngle = angle + (Math.PI / 5);
      const cxPos = cx + (r - 18) * Math.cos(cAngle);
      const cyPos = cy + (r - 18) * Math.sin(cAngle);
      const isFree = this.chopsticks[i];

      svg += `<rect x="${cxPos - 4}" y="${cyPos - 12}" width="8" height="24" rx="4" fill="${isFree ? 'var(--color-emerald)' : 'var(--color-crimson)'}" stroke="var(--bg-deep)" stroke-width="1" transform="rotate(${(cAngle * 180 / Math.PI) + 90}, ${cxPos}, ${cyPos})"/>`;
      svg += `<text x="${cxPos}" y="${cyPos + 20}" fill="var(--text-secondary)" font-size="8.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">C${i}</text>`;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }
};

// ----------------------------------------------------
// W12: Banker's Algorithm Calculator (M9)
// ----------------------------------------------------
const W12_Bankers = {
  allocation: [
    [0, 1, 0], // P0
    [2, 0, 0], // P1
    [3, 0, 2], // P2
    [2, 1, 1], // P3
    [0, 0, 2]  // P4
  ],
  max: [
    [7, 5, 3], // P0
    [3, 2, 2], // P1
    [9, 0, 2], // P2
    [2, 2, 2], // P3
    [4, 3, 3]  // P4
  ],
  available: [3, 3, 2],
  reqProc: 1,
  reqVec: [1, 0, 2],
  lastMsg: '',

  init() {
    this.lastMsg = '';
    this.runSafety(false);
  },

  updateCell(kind, i, r, val) {
    const v = Math.max(0, Math.min(20, parseInt(val, 10) || 0));
    if (kind === 'alloc') this.allocation[i][r] = v;
    else if (kind === 'max') this.max[i][r] = v;
    else if (kind === 'avail') this.available[r] = v;
    this.lastMsg = '';
    this.runSafety(true);
  },

  setRequestParam(proc, r, val) {
    if (proc !== null) this.reqProc = Math.max(0, Math.min(4, parseInt(proc, 10) || 0));
    if (r !== null) this.reqVec[r] = Math.max(0, Math.min(20, parseInt(val, 10) || 0));
  },

  testRequest() {
    const pIdx = this.reqProc;
    const req = [...this.reqVec];
    const needP = [
      this.max[pIdx][0] - this.allocation[pIdx][0],
      this.max[pIdx][1] - this.allocation[pIdx][1],
      this.max[pIdx][2] - this.allocation[pIdx][2]
    ];
    const cond1 = req[0] <= needP[0] && req[1] <= needP[1] && req[2] <= needP[2];
    const cond2 = req[0] <= this.available[0] && req[1] <= this.available[1] && req[2] <= this.available[2];

    if (!cond1) {
      this.lastMsg = `<strong style="color:var(--color-crimson)">❌ DENIED (Condition 1 Failed):</strong> Request (${req.join(', ')}) exceeds Need[${pIdx}] (${needP.join(', ')}). Illegal claim!`;
      Sound.alarm();
      this.runSafety(false);
      return;
    }
    if (!cond2) {
      this.lastMsg = `<strong style="color:var(--color-amber)">⏳ MUST WAIT (Condition 2 Failed):</strong> Request (${req.join(', ')}) exceeds Available (${this.available.join(', ')}). P${pIdx} blocks.`;
      Sound.alarm();
      this.runSafety(false);
      return;
    }

    const oldAvail = [...this.available];
    const oldAlloc = [...this.allocation[pIdx]];
    for (let r = 0; r < 3; r++) {
      this.available[r] -= req[r];
      this.allocation[pIdx][r] += req[r];
    }

    const res = this.runSafety(false, true);
    if (res.safe) {
      Sound.chime();
      this.lastMsg = `
        <strong style="color:var(--color-emerald)">✅ Request (${req.join(', ')}) by P${pIdx} GRANTED!</strong><br>
        Cond 1: (${req.join(',')}) &le; Need (${needP.join(',')}) ✓ &nbsp;|&nbsp;
        Cond 2: (${req.join(',')}) &le; Avail (${oldAvail.join(',')}) ✓ &rarr; New Avail = (${this.available.join(',')})<br>
        Pretend allocation yields <strong>SAFE SEQUENCE</strong>: &lang; ${res.sequence.join(', ')} &rang;.
      `;
    } else {
      // Roll back unsafe request!
      this.available = oldAvail;
      this.allocation[pIdx] = oldAlloc;
      Sound.alarm();
      this.lastMsg = `
        <strong style="color:var(--color-crimson)">⚠️ UNSAFE &rarr; REQUEST ROLLED BACK (P${pIdx} must wait):</strong><br>
        Cond 1 &amp; Cond 2 held, but granting (${req.join(',')}) drops Available too low to guarantee completion of all processes. System restores Available = (${oldAvail.join(',')}).
      `;
    }
    this.runSafety(false);
  },

  reset() {
    this.allocation = [
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1],
      [0, 0, 2]
    ];
    this.max = [
      [7, 5, 3],
      [3, 2, 2],
      [9, 0, 2],
      [2, 2, 2],
      [4, 3, 3]
    ];
    this.available = [3, 3, 2];
    this.reqProc = 1;
    this.reqVec = [1, 0, 2];
    this.lastMsg = '';
    const rSel = document.getElementById('w12-req-p'); if (rSel) rSel.value = 1;
    [0, 1, 2].forEach(r => { const el = document.getElementById(`w12-req-${r}`); if (el) el.value = this.reqVec[r]; });
    this.runSafety(false);
  },

  runSafety(preserveInputs = false, silent = false) {
    const n = 5;
    let need = [];
    for (let i = 0; i < n; i++) {
      need.push([
        this.max[i][0] - this.allocation[i][0],
        this.max[i][1] - this.allocation[i][1],
        this.max[i][2] - this.allocation[i][2]
      ]);
    }

    let work = [...this.available];
    let finish = [false, false, false, false, false];
    let safeSeq = [];
    let traceSteps = [];

    let count = 0;
    let lastIdx = 0;
    while (count < n) {
      let found = false;
      for (let offset = 0; offset < n; offset++) {
        let i = (lastIdx + offset) % n;
        if (!finish[i]) {
          if (need[i][0] <= work[0] && need[i][1] <= work[1] && need[i][2] <= work[2]) {
            lastIdx = (i + 1) % n;
            const beforeWork = [...work];
            work[0] += this.allocation[i][0];
            work[1] += this.allocation[i][1];
            work[2] += this.allocation[i][2];
            finish[i] = true;
            safeSeq.push(`P${i}`);
            found = true;
            count++;

            traceSteps.push({
              proc: `P${i}`,
              need: need[i],
              workBefore: beforeWork,
              alloc: [...this.allocation[i]],
              workAfter: [...work],
              seq: [...safeSeq]
            });
            break;
          }
        }
      }
      if (!found) break;
    }

    const isSafe = (count === n);
    if (!silent) this.renderTable(need, isSafe, safeSeq, traceSteps, preserveInputs);
    return { safe: isSafe, sequence: safeSeq };
  },

  renderTable(need, isSafe, safeSeq, traceSteps, preserveInputs = false) {
    const tbody = document.getElementById('w12-table-body');
    const narr = document.getElementById('w12-narr');
    const traceContainer = document.getElementById('w12-trace');
    const hand = document.getElementById('w12-handwritten');
    if (!tbody) return;

    if (preserveInputs && tbody.children.length === this.allocation.length) {
      need.forEach((nv, i) => {
        const el = document.getElementById(`w12-need-${i}`);
        if (el) el.textContent = nv.join(' ');
      });
    } else {
      tbody.innerHTML = this.allocation.map((alloc, i) => `
        <tr>
          <td><strong>P${i}</strong></td>
          <td>${[0,1,2].map(r => `<input type="number" class="cell-num" style="width:42px;margin-right:2px;" min="0" max="20" value="${alloc[r]}" oninput="W12_Bankers.updateCell('alloc',${i},${r},this.value)"/>`).join('')}</td>
          <td>${[0,1,2].map(r => `<input type="number" class="cell-num" style="width:42px;margin-right:2px;" min="0" max="20" value="${this.max[i][r]}" oninput="W12_Bankers.updateCell('max',${i},${r},this.value)"/>`).join('')}</td>
          <td><strong id="w12-need-${i}" style="color:var(--color-cyan);">${need[i].join(' ')}</strong></td>
          <td>${i === 0 ? [0,1,2].map(r => `<input type="number" class="cell-num" style="width:42px;margin-right:2px;" min="0" max="20" value="${this.available[r]}" oninput="W12_Bankers.updateCell('avail',0,${r},this.value)"/>`).join('') : ''}</td>
        </tr>
      `).join('');
    }

    if (narr) {
      if (this.lastMsg) {
        narr.innerHTML = this.lastMsg;
      } else if (isSafe) {
        narr.innerHTML = `
          <strong style="color:var(--color-emerald)">SAFE STATE!</strong> Safe Sequence: 
          <span style="font-size:1.08rem; font-weight:bold; color:var(--color-cyan);">&lang; ${safeSeq.join(', ')} &rang;</span>
          <br><span style="color:var(--text-secondary)">Edit any Allocation / Max / Available cell above or test a Resource Request!</span>
        `;
      } else {
        narr.innerHTML = `<strong style="color:var(--color-crimson)">⚠️ UNSAFE STATE!</strong> Only completed &lang; ${safeSeq.join(', ') || 'None'} &rang;; remaining processes exceed Work = (${traceSteps.length ? traceSteps[traceSteps.length-1].workAfter.join(',') : this.available.join(',')}).`;
      }
    }

    if (traceContainer) {
      traceContainer.innerHTML = `
        <h4 style="margin:12px 0 6px; font-size:0.95rem; color:var(--color-cyan);">Step-by-Step Safety Trace:</h4>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Process</th>
                <th>Need &le; Work Check</th>
                <th>+ Alloc</th>
                <th>New Work</th>
                <th>Sequence</th>
              </tr>
            </thead>
            <tbody>
              ${traceSteps.map((st, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${st.proc}</strong></td>
                  <td>[${st.need.join(',')}] &le; [${st.workBefore.join(',')}] &rarr; <span style="color:var(--color-emerald); font-weight:bold;">PASS</span></td>
                  <td>+ [${st.alloc.join(',')}]</td>
                  <td><strong>[${st.workAfter.join(',')}]</strong></td>
                  <td>&lang; ${st.seq.join(', ')} &rang;</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (hand) {
      const needLines = this.allocation.map((alloc, i) => `   P${i}: (${this.max[i].join(',')}) &minus; (${alloc.join(',')}) = <span class="hw-sub">(${need[i].join(',')})</span>`).join('\n');
      const traceLines = traceSteps.map((st, idx) => `   ${idx+1}. Check ${st.proc}: (${st.need.join(',')}) &le; (${st.workBefore.join(',')}) &check; &rArr; Work = (${st.workBefore.join(',')}) + (${st.alloc.join(',')}) = <span class="hw-sub">(${st.workAfter.join(',')})</span>`).join('\n');
      hand.innerHTML = `
        <div class="hw-title"><span>✍️ Exam Paper Workings (As Written By Hand)</span><span>Banker's Need &amp; Safety Proof</span></div>
        <span class="hw-step"><strong>Step 1 — Compute Need = Max &minus; Allocation:</strong>\n${needLines}</span>
        <span class="hw-step"><strong>Step 2 — Safety Trace starting from Work = Available = (${this.available.join(', ')}):</strong>\n${traceLines || '   No process satisfied Need <= Work!'}</span>
        <span class="hw-step"><strong>Result:</strong> <span class="${isSafe ? 'hw-ans' : 'hw-warn'}">${isSafe ? 'SAFE SEQUENCE: < ' + safeSeq.join(', ') + ' >' : 'UNSAFE (Insufficient Available for remaining Need)'}</span></span>
      `;
    }
  }
};

// ----------------------------------------------------
// W13: Memory Allocation Simulator (M11)
// ----------------------------------------------------
const W13_MemoryAlloc = {
  lastStrat: 'first',
  holeSizes: [100, 500, 200, 300, 600],
  procSizes: [212, 417, 112, 426],

  parseList(str) {
    return str.split(',').map(s => parseInt(s.trim(), 10)).filter(v => !isNaN(v) && v > 0);
  },

  updateHoles(str) {
    const arr = this.parseList(str);
    if (arr.length > 0) {
      this.holeSizes = arr.slice(0, 8);
      this.run(this.lastStrat === 'none' ? 'first' : this.lastStrat);
    }
  },

  updateProcs(str) {
    const arr = this.parseList(str);
    if (arr.length > 0) {
      this.procSizes = arr.slice(0, 8);
      this.run(this.lastStrat === 'none' ? 'first' : this.lastStrat);
    }
  },

  run(strategy) {
    this.lastStrat = strategy;
    const parts = this.holeSizes.map(sz => ({ size: sz, free: sz, proc: null, pSize: 0 }));
    const processes = this.procSizes.map((sz, i) => ({ id: `P${i + 1}`, size: sz }));
    let internalFrag = 0;
    let allocated = 0;
    let rejected = [];
    let steps = [];

    processes.forEach(p => {
      let targetIdx = -1;
      if (strategy === 'first') {
        targetIdx = parts.findIndex(part => part.proc === null && part.size >= p.size);
      } else if (strategy === 'best') {
        let bestDiff = Infinity;
        parts.forEach((part, idx) => {
          if (part.proc === null && part.size >= p.size) {
            let diff = part.size - p.size;
            if (diff < bestDiff) { bestDiff = diff; targetIdx = idx; }
          }
        });
      } else if (strategy === 'worst') {
        let maxDiff = -1;
        parts.forEach((part, idx) => {
          if (part.proc === null && part.size >= p.size) {
            let diff = part.size - p.size;
            if (diff > maxDiff) { maxDiff = diff; targetIdx = idx; }
          }
        });
      }

      if (targetIdx !== -1) {
        parts[targetIdx].proc = p.id;
        parts[targetIdx].pSize = p.size;
        parts[targetIdx].free = parts[targetIdx].size - p.size;
        internalFrag += parts[targetIdx].free;
        allocated++;
        steps.push(`${p.id} (${p.size} KB) &rarr; Hole #${targetIdx + 1} (${parts[targetIdx].size} KB) | Leftover = ${parts[targetIdx].size} &minus; ${p.size} = <span class="hw-sub">${parts[targetIdx].free} KB</span>`);
      } else {
        rejected.push(`${p.id} (${p.size} KB)`);
        steps.push(`${p.id} (${p.size} KB) &rarr; <span class="hw-warn">MUST WAIT (No free partition &ge; ${p.size} KB!)</span>`);
      }
    });

    this.render(strategy, parts, internalFrag, rejected, steps);
  },

  reset() {
    this.holeSizes = [100, 500, 200, 300, 600];
    this.procSizes = [212, 417, 112, 426];
    const hIn = document.getElementById('w13-holes'); if (hIn) hIn.value = this.holeSizes.join(', ');
    const pIn = document.getElementById('w13-procs'); if (pIn) pIn.value = this.procSizes.join(', ');
    this.run('first');
  },

  render(strat, parts, internalFrag, rejected, steps = []) {
    const container = document.getElementById('w13-canvas');
    const summary = document.getElementById('w13-summary');
    const hand = document.getElementById('w13-handwritten');
    if (!container) return;

    const extFree = parts.filter(p => p.proc === null).reduce((a, b) => a + b.size, 0);

    if (summary) {
      summary.innerHTML = `
        Strategy: <strong style="color:var(--color-cyan);">${strat.toUpperCase()} FIT</strong> &nbsp;|&nbsp;
        Leftover Fragments Inside Used Holes: <strong style="color:var(--color-amber);">${internalFrag} KB</strong> &nbsp;|&nbsp;
        Total Free Unallocated Holes: <strong style="color:var(--text-primary);">${extFree} KB</strong> &nbsp;|&nbsp;
        Waiting / Unallocated: <strong style="color:${rejected.length > 0 ? 'var(--color-crimson)' : 'var(--color-emerald)'};">${rejected.length > 0 ? rejected.join(', ') : 'None (All allocated)'}</strong>
      `;
    }

    let html = `<div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:640px;">`;
    parts.forEach((part, idx) => {
      const isOccupied = part.proc !== null;
      html += `
        <div style="border:1px solid var(--border-light); border-radius:6px; overflow:hidden; background:var(--bg-panel);">
          <div style="display:flex; justify-content:space-between; padding:4px 10px; font-size:0.8rem; background:var(--bg-panel-elevated); color:var(--text-secondary);">
            <span>Partition #${idx + 1} (${part.size} KB)</span>
            <span>${isOccupied ? `Occupied by <strong style="color:var(--text-primary)">${part.proc} (${part.pSize} KB)</strong> | Unused: ${part.free} KB` : 'FREE HOLE'}</span>
          </div>
          <div style="display:flex; height:32px; width:100%;">
            ${isOccupied ? `
              <div style="width:${(part.pSize / part.size) * 100}%; background:var(--color-cyan); display:flex; align-items:center; justify-content:center; color:var(--on-primary); font-size:0.85rem; font-weight:800;">
                ${part.proc} (${part.pSize}K)
              </div>
              <div style="width:${(part.free / part.size) * 100}%; background:var(--warning-bg); border-left:1px dashed var(--color-amber); display:flex; align-items:center; justify-content:center; color:var(--color-amber); font-size:0.75rem; font-weight:700;">
                ${part.free > 0 ? `${part.free}K free` : ''}
              </div>
            ` : `
              <div style="width:100%; background:var(--bg-panel); display:flex; align-items:center; justify-content:center; color:var(--text-secondary); font-size:0.85rem;">
                Free Hole (${part.size} KB)
              </div>
            `}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;

    if (hand) {
      hand.innerHTML = `
        <div class="hw-title"><span>✍️ Exam Workings (As Written By Hand)</span><span>${strat.toUpperCase()} FIT TRACE</span></div>
        ${steps.map((s, idx) => `<span class="hw-step">${idx + 1}) ${s}</span>`).join('')}
        <span class="hw-step">Total Unused Fragments in Allocated Partitions = <span class="hw-sub">${internalFrag} KB</span> | Unallocated Waiting: <span class="${rejected.length ? 'hw-warn' : 'hw-ans'}">${rejected.length ? rejected.join(', ') : '0 (ALL FIT)'}</span></span>
      `;
    }
  }
};

// ----------------------------------------------------
// W14: Paging Address Translator & TLB EAT (M12)
// ----------------------------------------------------
const W14_PagingTranslator = {
  pageSize: 1024,
  pageTable: { 0: 5, 1: 6, 2: 1, 3: 2, 4: 8, 5: 3, 6: 9, 7: 4 },
  hitRatio: 80,
  tlbNs: 20,
  memNs: 100,

  setLA(val) {
    const la = Math.max(0, Math.min(8191, parseInt(val, 10) || 0));
    const r = document.getElementById('w14-la-r'), n = document.getElementById('w14-la');
    if (r && r.value != la) r.value = la;
    if (n && n.value != la) n.value = la;
    this.translate();
  },

  setFrame(pageIdx, frameVal) {
    this.pageTable[pageIdx] = Math.max(0, Math.min(63, parseInt(frameVal, 10) || 0));
    this.translate();
  },

  setEAT(alpha, tlb, mem) {
    if (alpha !== null) this.hitRatio = Math.max(0, Math.min(100, parseFloat(alpha) || 0));
    if (tlb !== null) this.tlbNs = Math.max(1, Math.min(200, parseFloat(tlb) || 1));
    if (mem !== null) this.memNs = Math.max(10, Math.min(1000, parseFloat(mem) || 10));
    const s = (id, v) => { const e = document.getElementById(id); if (e && e.value != v) e.value = v; };
    s('w14-a-r', this.hitRatio); s('w14-a-n', this.hitRatio);
    s('w14-e-r', this.tlbNs);    s('w14-e-n', this.tlbNs);
    s('w14-m-r', this.memNs);    s('w14-m-n', this.memNs);
    this.renderEAT();
  },

  translate() {
    const inputLA = document.getElementById('w14-la');
    const inputPS = document.getElementById('w14-ps');
    const outP = document.getElementById('w14-p');
    const outD = document.getElementById('w14-d');
    const outFrame = document.getElementById('w14-frame');
    const outPA = document.getElementById('w14-pa');
    const narr = document.getElementById('w14-narr');

    const la = parseInt(inputLA ? inputLA.value : 3085, 10) || 0;
    const ps = parseInt(inputPS ? inputPS.value : 1024, 10) || 1024;
    const offsetBits = Math.round(Math.log2(ps));

    const p = Math.floor(la / ps);
    const d = la % ps;
    const f = this.pageTable[p] !== undefined ? this.pageTable[p] : ((p * 3 + 2) % 16);
    const pa = f * ps + d;

    if (outP) outP.innerText = p;
    if (outD) outD.innerText = d;
    if (outFrame) outFrame.innerText = f;
    if (outPA) outPA.innerText = pa;

    if (narr) {
      narr.innerHTML = `
        <div class="handwritten-sheet">
          <div class="hw-title"><span>✍️ Address Translation (As Written By Hand)</span><span>Page Size = ${ps} B (2<sup>${offsetBits}</sup> &rArr; ${offsetBits}-bit offset d)</span></div>
          <span class="hw-step">1) Page Number p = &lfloor; ${la} / ${ps} &rfloor; = <span class="hw-sub">${p}</span></span>
          <span class="hw-step">2) Page Offset d = ${la} mod ${ps} = ${la} &minus; (${p} &times; ${ps}) = <span class="hw-sub">${d}</span></span>
          <span class="hw-step">3) Page Table Lookup: Page[${p}] &rarr; Frame <span class="hw-sub">f = ${f}</span></span>
          <span class="hw-step">4) Physical Address PA = (f &times; PageSize) + d = (${f} &times; ${ps}) + ${d} = ${f * ps} + ${d} = <span class="hw-ans">${pa}</span></span>
        </div>
      `;
    }
    this.renderEAT();
  },

  renderEAT() {
    const box = document.getElementById('w14-eat-hand');
    if (!box) return;
    const a = this.hitRatio / 100;
    const missA = 1 - a;
    const eps = this.tlbNs;
    const m = this.memNs;
    const hitCost = eps + m;
    const missCost = eps + 2 * m;
    const eat = a * hitCost + missA * missCost;
    const slowdown = ((eat - m) / m) * 100;
    box.innerHTML = `
      <div class="handwritten-sheet">
        <div class="hw-title"><span>✍️ TLB Effective Access Time (As Written By Hand)</span><span>&alpha; = ${this.hitRatio}% | &epsilon; = ${eps}ns | RAM = ${m}ns</span></div>
        <span class="hw-step">Formula: EAT = &alpha;&middot;(&epsilon; + m) + (1 &minus; &alpha;)&middot;(&epsilon; + 2m)</span>
        <span class="hw-step">       = ${a.toFixed(2)}&middot;(${eps} + ${m}) + ${missA.toFixed(2)}&middot;(${eps} + 2&times;${m})</span>
        <span class="hw-step">       = ${a.toFixed(2)}(${hitCost}) + ${missA.toFixed(2)}(${missCost}) = ${(a * hitCost).toFixed(2)} + ${(missA * missCost).toFixed(2)} = <span class="hw-ans">${eat.toFixed(2)} ns</span> (+${slowdown.toFixed(1)}% vs bare RAM)</span>
      </div>
    `;
  }
};

// ----------------------------------------------------
// W15: Page Replacement Simulator (M13)
// ----------------------------------------------------
const W15_PageReplacement = {
  algo: 'FIFO',
  refString: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1],
  nFrames: 3,

  loadPreset(name) {
    if (name === 'belady') {
      this.refString = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
    } else {
      this.refString = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
    }
    const rIn = document.getElementById('w15-refs');
    if (rIn) rIn.value = this.refString.join(',');
    this.run(this.algo);
  },

  setFrames(f) {
    this.nFrames = Math.max(1, Math.min(6, parseInt(f, 10) || 3));
    const r = document.getElementById('w15-f-r'), n = document.getElementById('w15-f-n');
    if (r) r.value = this.nFrames;
    if (n) n.value = this.nFrames;
    this.run(this.algo);
  },

  setRefs(str) {
    const arr = str.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x) && x >= 0);
    if (arr.length > 0) {
      this.refString = arr.slice(0, 26);
      this.run(this.algo);
    }
  },

  run(algo) {
    if (algo) this.algo = algo;
    const refs = this.refString;
    const framesCount = this.nFrames;
    let frames = [];
    let faults = 0;
    let hits = 0;
    let history = [];

    if (this.algo === 'FIFO') {
      let queue = [];
      refs.forEach(val => {
        let isHit = frames.includes(val);
        if (isHit) {
          hits++;
          history.push({ ref: val, frames: [...frames], fault: false, victim: null });
        } else {
          faults++;
          let victim = null;
          if (frames.length < framesCount) {
            frames.push(val);
            queue.push(val);
          } else {
            victim = queue.shift();
            let idx = frames.indexOf(victim);
            frames[idx] = val;
            queue.push(val);
          }
          history.push({ ref: val, frames: [...frames], fault: true, victim });
        }
      });
    } else if (this.algo === 'LRU') {
      let lastUsed = new Map();
      refs.forEach((val, time) => {
        let isHit = frames.includes(val);
        if (isHit) {
          hits++;
          lastUsed.set(val, time);
          history.push({ ref: val, frames: [...frames], fault: false, victim: null });
        } else {
          faults++;
          let victim = null;
          if (frames.length < framesCount) {
            frames.push(val);
          } else {
            victim = frames[0];
            let minTime = lastUsed.get(victim);
            frames.forEach(f => {
              if (lastUsed.get(f) < minTime) { minTime = lastUsed.get(f); victim = f; }
            });
            let idx = frames.indexOf(victim);
            frames[idx] = val;
          }
          lastUsed.set(val, time);
          history.push({ ref: val, frames: [...frames], fault: true, victim });
        }
      });
    } else if (this.algo === 'OPT') {
      refs.forEach((val, idx) => {
        let isHit = frames.includes(val);
        if (isHit) {
          hits++;
          history.push({ ref: val, frames: [...frames], fault: false, victim: null });
        } else {
          faults++;
          let victim = null;
          if (frames.length < framesCount) {
            frames.push(val);
          } else {
            victim = frames[0];
            let furthest = -1;
            frames.forEach(f => {
              let nextUse = refs.slice(idx + 1).indexOf(f);
              if (nextUse === -1) { victim = f; furthest = Infinity; }
              else if (nextUse > furthest && furthest !== Infinity) { furthest = nextUse; victim = f; }
            });
            let vIdx = frames.indexOf(victim);
            frames[vIdx] = val;
          }
          history.push({ ref: val, frames: [...frames], fault: true, victim });
        }
      });
    }

    this.render(this.algo, history, faults, hits, framesCount);
  },

  render(algo, history, faults, hits, framesCount) {
    const container = document.getElementById('w15-grid');
    const summary = document.getElementById('w15-summary');
    const hand = document.getElementById('w15-handwritten');
    if (!container) return;

    const faultPct = ((faults / this.refString.length) * 100).toFixed(1);
    const hitPct = ((hits / this.refString.length) * 100).toFixed(1);

    if (summary) {
      summary.innerHTML = `
        <span style="font-size:1.05rem; font-weight:bold; color:var(--color-cyan);">${algo} (${framesCount} Frames):</span>
        Page Faults = <strong style="color:var(--color-crimson); font-size:1.1rem;">${faults}</strong> &nbsp;|&nbsp;
        Hits = <strong style="color:var(--color-emerald); font-size:1.1rem;">${hits}</strong> &nbsp;|&nbsp;
        Fault Rate = <strong>${faultPct}%</strong>
      `;
    }

    const rowIndices = Array.from({ length: framesCount }, (_, i) => i);
    let html = `<div style="display:flex; gap:5px; overflow-x:auto; padding-bottom:10px;">`;
    history.forEach((h, stepIdx) => {
      html += `
        <div style="display:flex; flex-direction:column; align-items:center; min-width:34px;">
          <div style="font-size:9px; color:var(--text-muted); font-family:var(--font-mono);">t${stepIdx+1}</div>
          <div style="font-weight:800; color:var(--color-cyan); margin-bottom:4px; font-size:0.95rem; font-family:var(--font-mono);">${h.ref}</div>
          <div style="border:1.5px solid ${h.fault ? 'var(--color-crimson)' : 'var(--color-emerald)'}; border-radius:4px; width:100%; display:flex; flex-direction:column; background:var(--bg-panel);">
            ${rowIndices.map(row => `
              <div style="height:26px; display:flex; align-items:center; justify-content:center; border-bottom:${row < framesCount - 1 ? '1px solid var(--border-trace)' : 'none'}; font-family:var(--font-mono); font-size:0.85rem; font-weight:${h.frames[row] === h.ref ? '800' : '500'}; color:${h.frames[row] === h.ref ? 'var(--color-cyan)' : 'var(--text-primary)'}; background:${h.frames[row] === h.ref && h.fault ? 'var(--primary-glow)' : 'transparent'};">
                ${h.frames[row] !== undefined ? h.frames[row] : '-'}
              </div>
            `).join('')}
          </div>
          <div style="margin-top:5px; font-size:0.75rem; font-weight:800; font-family:var(--font-mono); color:${h.fault ? 'var(--color-crimson)' : 'var(--color-emerald)'};">
            ${h.fault ? 'F' : 'H'}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;

    if (hand) {
      const evictions = history.map((h, i) => h.victim !== null ? `t${i+1}(ref ${h.ref}&rarr;evict ${h.victim})` : null).filter(Boolean);
      hand.innerHTML = `
        <div class="hw-title"><span>✍️ Page Replacement Exam Trace (As Written By Hand)</span><span>${algo} | Frames = ${framesCount}</span></div>
        <span class="hw-step">Total References = ${this.refString.length} &rarr; Page Faults = <span class="hw-warn">${faults}</span> , Page Hits = <span class="hw-sub">${hits}</span></span>
        <span class="hw-step">Fault Rate = ${faults} / ${this.refString.length} = <span class="hw-ans">${faultPct}%</span> &nbsp;|&nbsp; Hit Ratio = ${hits} / ${this.refString.length} = <span class="hw-sub">${hitPct}%</span></span>
        <span class="hw-step">Victim Evictions: <span class="hw-dim">${evictions.length ? evictions.join(', ') : 'None (all fit without replacement)'}</span></span>
      `;
    }
  }
};

// ----------------------------------------------------
// W16: Disk Scheduling Visualizer (M14)
// ----------------------------------------------------
const W16_DiskScheduling = {
  algo: 'FCFS',
  queue: [98, 183, 37, 122, 14, 124, 65, 67],
  head: 53,
  cylinders: 200,
  direction: 'down', // 'down' or 'up'

  syncInputs() {
    const s = (id, v) => { const e = document.getElementById(id); if (e && e.value != v) e.value = v; };
    s('w16-head-r', this.head); s('w16-head-n', this.head);
    s('w16-cyl-n', this.cylinders);
    s('w16-dir', this.direction);
    const qEl = document.getElementById('w16-queue');
    if (qEl && document.activeElement !== qEl) qEl.value = this.queue.join(', ');
  },

  loadReviewQueueExample() {
    this.queue = [130, 1750, 1022, 1509, 948, 1774, 913, 1470, 86];
    this.head = 143;
    this.cylinders = 5000;
    this.direction = 'up';
    this.syncInputs();
    this.run('FCFS');
  },

  loadStandardExample() {
    this.queue = [98, 183, 37, 122, 14, 124, 65, 67];
    this.head = 53;
    this.cylinders = 200;
    this.direction = 'down';
    this.syncInputs();
    this.run('FCFS');
  },

  updateParam(kind, val) {
    if (kind === 'head') {
      this.head = Math.max(0, Math.min(this.cylinders - 1, parseInt(val, 10) || 0));
      const r = document.getElementById('w16-head-r'), n = document.getElementById('w16-head-n');
      if (r && r.value != this.head) r.value = this.head;
      if (n && n.value != this.head) n.value = this.head;
    } else if (kind === 'cyl') {
      this.cylinders = Math.max(20, Math.min(10000, parseInt(val, 10) || 200));
      const r = document.getElementById('w16-head-r');
      if (r) r.max = this.cylinders - 1;
      if (this.head >= this.cylinders) this.head = this.cylinders - 1;
    } else if (kind === 'dir') {
      this.direction = val === 'up' ? 'up' : 'down';
    } else if (kind === 'queue') {
      const arr = val.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x) && x >= 0 && x < this.cylinders);
      if (arr.length > 0) this.queue = arr.slice(0, 16);
    }
    this.run(this.algo);
  },

  run(algo) {
    if (algo) this.algo = algo;
    const q = [...this.queue];
    const startHead = this.head;
    const maxCyl = this.cylinders - 1;
    let sequence = [startHead];
    let totalSeek = 0;

    let left = q.filter(x => x < startHead).sort((a, b) => b - a);
    let right = q.filter(x => x >= startHead).sort((a, b) => a - b);

    if (this.algo === 'FCFS') {
      sequence.push(...q);
    } else if (this.algo === 'SSTF') {
      let pending = [...q];
      let cur = startHead;
      while (pending.length > 0) {
        pending.sort((a, b) => Math.abs(a - cur) - Math.abs(b - cur));
        cur = pending.shift();
        sequence.push(cur);
      }
    } else if (this.algo === 'SCAN') {
      if (this.direction === 'down') {
        sequence.push(...left);
        if (left.length > 0 && right.length > 0) sequence.push(0);
        sequence.push(...right);
      } else {
        sequence.push(...right);
        if (right.length > 0 && left.length > 0) sequence.push(maxCyl);
        sequence.push(...left);
      }
    } else if (this.algo === 'C-SCAN') {
      if (this.direction === 'down') {
        sequence.push(...left);
        if (right.length > 0) {
          sequence.push(0);
          sequence.push(maxCyl);
          right.sort((a, b) => b - a);
          sequence.push(...right);
        }
      } else {
        sequence.push(...right);
        if (left.length > 0) {
          sequence.push(maxCyl);
          sequence.push(0);
          left.sort((a, b) => a - b);
          sequence.push(...left);
        }
      }
    } else if (this.algo === 'LOOK') {
      if (this.direction === 'down') {
        sequence.push(...left);
        sequence.push(...right);
      } else {
        sequence.push(...right);
        sequence.push(...left);
      }
    } else if (this.algo === 'C-LOOK') {
      if (this.direction === 'down') {
        sequence.push(...left);
        right.sort((a, b) => b - a);
        sequence.push(...right);
      } else {
        sequence.push(...right);
        left.sort((a, b) => a - b);
        sequence.push(...left);
      }
    }

    const deltas = [];
    for (let i = 1; i < sequence.length; i++) {
      const d = Math.abs(sequence[i] - sequence[i - 1]);
      deltas.push({ a: sequence[i - 1], b: sequence[i], d });
      totalSeek += d;
    }

    this.render(this.algo, sequence, totalSeek, deltas);
  },

  render(algo, seq, totalSeek, deltas = []) {
    const container = document.getElementById('w16-canvas');
    const summary = document.getElementById('w16-summary');
    const hand = document.getElementById('w16-handwritten');
    if (!container) return;

    if (summary) {
      summary.innerHTML = `
        Algorithm: <strong style="color:var(--color-cyan);">${algo}</strong> &nbsp;|&nbsp;
        Direction: <strong style="color:var(--text-primary);">${this.direction.toUpperCase()}</strong> &nbsp;|&nbsp;
        Total Head Movement: <strong style="color:var(--color-amber); font-size:1.15rem;">${totalSeek} cylinders</strong><br>
        <span style="font-size:0.85rem; color:var(--text-secondary);">Order: ${seq.join(' &rarr; ')}</span>
      `;
    }

    const width = 660;
    const height = Math.max(220, 42 + seq.length * 18);
    const scaleX = (width - 70) / Math.max(1, this.cylinders - 1);
    const scaleY = (height - 46) / Math.max(1, seq.length - 1);

    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; max-width:680px; display:block;">`;
    svg += `<line x1="35" y1="22" x2="${width - 35}" y2="22" stroke="var(--border-light)" stroke-width="2" />`;
    svg += `<text x="35" y="15" fill="var(--text-secondary)" font-size="10.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">0</text>`;
    svg += `<text x="${width - 35}" y="15" fill="var(--text-secondary)" font-size="10.5" font-weight="700" text-anchor="middle" font-family="var(--font-mono)">${this.cylinders - 1}</text>`;

    let points = seq.map((cyl, idx) => {
      const x = 35 + cyl * scaleX;
      const y = 32 + idx * scaleY;
      return `${x},${y}`;
    }).join(' ');

    svg += `<polyline points="${points}" fill="none" stroke="var(--color-cyan)" stroke-width="2.2" />`;

    seq.forEach((cyl, idx) => {
      const x = 35 + cyl * scaleX;
      const y = 32 + idx * scaleY;
      const isStart = idx === 0;
      svg += `<circle cx="${x}" cy="${y}" r="${isStart ? 5 : 4}" fill="${isStart ? 'var(--color-amber)' : 'var(--color-cyan)'}" stroke="var(--bg-deep)" stroke-width="1"/>`;
      svg += `<text x="${x + (x > width - 85 ? -10 : 8)}" y="${y + 3}" fill="${isStart ? 'var(--color-amber)' : 'var(--text-primary)'}" font-size="9.5" font-weight="700" text-anchor="${x > width - 85 ? 'end' : 'start'}" font-family="var(--font-mono)">${isStart ? 'Head=' + cyl : cyl}</text>`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;

    if (hand) {
      const absExpr = deltas.map(x => `|${x.a} &minus; ${x.b}|`).join(' + ');
      const numExpr = deltas.map(x => x.d).join(' + ');
      hand.innerHTML = `
        <div class="hw-title"><span>✍️ Seek Distance Calculation (As Written By Hand)</span><span>${algo} | Head=${this.head}</span></div>
        <span class="hw-step">Total Seek = ${absExpr || '0'}</span>
        <span class="hw-step">           = ${numExpr || '0'} = <span class="hw-ans">${totalSeek} cylinders</span></span>
      `;
    }
  }
};


    // Global Simulator Bindings
    window.W0_DualModeSimulator = W0_DualModeSimulator;
    window.W1_StateMachine = W1_StateMachine;
    window.W2_ForkVisualizer = W2_ForkVisualizer;
    window.W2B_AmdahlLab = W2B_AmdahlLab;
    window.W3_CPUScheduler = W3_CPUScheduler;
    window.W4_ExpAveragingLab = W4_ExpAveragingLab;
    window.W4B_AgingLab = W4B_AgingLab;
    window.W5_RaceCondition = W5_RaceCondition;
    window.W6_BoundedBuffer = W6_BoundedBuffer;
    window.W7_CriticalSection = W7_CriticalSection;
    window.W8_Semaphore = W8_Semaphore;
    window.W10_DiningPhilosophers = W10_DiningPhilosophers;
    window.W11_CoffmanRAG = W11_CoffmanRAG;
    window.W12_Bankers = W12_Bankers;
    window.W12_DeadlockRecovery = W12_DeadlockRecovery;
    window.W13_MemoryAlloc = W13_MemoryAlloc;
    window.W14_PagingTranslator = W14_PagingTranslator;
    window.W15_PageReplacement = W15_PageReplacement;
    window.W16_DiskScheduling = W16_DiskScheduling;
    window.W17_InodeFileSystem = W17_InodeFileSystem;
    window.W18_IODMAModel = W18_IODMAModel;
    window.W19_AccessMatrix = W19_AccessMatrix;

    // -------------------------------------------------------------

    function attachFormulaSandboxes(bodyRoot) {
      if (!bodyRoot) return;
      const doc = bodyRoot.ownerDocument || document;
      const boxes = bodyRoot.querySelectorAll('.formula-display');
      boxes.forEach((box, idx) => {
        if (box.querySelector('.formula-sandbox')) return;
        const txt = box.textContent || '';
        const wrap = doc.createElement('div');
        wrap.className = 'formula-sandbox';

        const makePaired = (labelText, min, max, step, val, onUpdate) => {
          const ctrl = doc.createElement('div');
          ctrl.className = 'play-ctrl';
          const lbl = doc.createElement('label');
          lbl.textContent = labelText;
          const rng = doc.createElement('input');
          rng.type = 'range'; rng.className = 'play-range'; rng.min = min; rng.max = max; rng.step = step; rng.value = val;
          const num = doc.createElement('input');
          num.type = 'number'; num.className = 'play-num'; num.min = min; num.max = max; num.step = step; num.value = val;
          rng.addEventListener('input', () => { num.value = rng.value; onUpdate(); });
          num.addEventListener('input', () => { const v = parseFloat(num.value); if (!isNaN(v)) { rng.value = v; onUpdate(); } });
          ctrl.appendChild(lbl); ctrl.appendChild(rng); ctrl.appendChild(num);
          return { ctrl, num };
        };

        // 1. Amdahl's Law (Deck 03)
        if (/Amdahl/i.test(txt)) {
          const bar = doc.createElement('div'); bar.className = 'play-controls-bar';
          const out = doc.createElement('div'); out.className = 'handwritten-sheet';
          const sP = makePaired('Serial S (%):', 1, 100, 1, 25, () => recalc());
          const nP = makePaired('Cores N:', 1, 64, 1, 4, () => recalc());
          bar.appendChild(sP.ctrl); bar.appendChild(nP.ctrl);
          function recalc() {
            const sp = Math.max(1, Math.min(100, parseFloat(sP.num.value) || 25));
            const S = +(sp / 100).toFixed(2);
            const P = +(1 - S).toFixed(2);
            const N = Math.max(1, Math.min(64, parseInt(nP.num.value, 10) || 4));
            const parPart = P / N;
            const denom = S + parPart;
            const spd = 1 / denom;
            const maxS = 1 / S;
            out.innerHTML = `
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Amdahl's Law)</span><span>S=${S.toFixed(2)}, N=${N}</span></div>
              <span class="hw-step">Speedup &le; 1 / [ ${S.toFixed(2)} + (1 &minus; ${S.toFixed(2)}) / ${N} ]</span>
              <span class="hw-step">       = 1 / [ ${S.toFixed(2)} + ${P.toFixed(2)} / ${N} ] = 1 / [ ${S.toFixed(2)} + <span class="hw-sub">${parPart.toFixed(4)}</span> ] = 1 / ${denom.toFixed(4)} = <span class="hw-ans">${spd.toFixed(2)}&times;</span></span>
              <span class="hw-step">Max Cap (N &rarr; &infin;) = 1 / S = 1 / ${S.toFixed(2)} = <span class="hw-sub">${maxS.toFixed(2)}&times;</span></span>
            `;
          }
          wrap.appendChild(bar); wrap.appendChild(out); box.appendChild(wrap); recalc();
        }
        // 2. Exponential Averaging First Formula (Deck 05)
        else if (/n\+1.*t.*n/i.test(txt) && !/t_?n-1/i.test(txt)) {
          const bar = doc.createElement('div'); bar.className = 'play-controls-bar';
          const out = doc.createElement('div'); out.className = 'handwritten-sheet';
          const aP = makePaired('Alpha (α):', 0, 1, 0.05, 0.5, () => recalc());
          const tP = makePaired('Actual t_n (ms):', 1, 50, 1, 6, () => recalc());
          const tauP = makePaired('Prev Pred τ_n (ms):', 1, 50, 1, 10, () => recalc());
          bar.appendChild(aP.ctrl); bar.appendChild(tP.ctrl); bar.appendChild(tauP.ctrl);
          function recalc() {
            const a = Math.max(0, Math.min(1, parseFloat(aP.num.value) || 0));
            const tn = parseFloat(tP.num.value) || 6;
            const taun = parseFloat(tauP.num.value) || 10;
            const oma = +(1 - a).toFixed(2);
            const lhs = a * tn, rhs = oma * taun, res = lhs + rhs;
            out.innerHTML = `
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Exponential Burst Prediction)</span><span>&alpha;=${a.toFixed(2)}</span></div>
              <span class="hw-step">&tau;<sub>n+1</sub> = &alpha;&middot;t<sub>n</sub> + (1 &minus; &alpha;)&middot;&tau;<sub>n</sub></span>
              <span class="hw-step">    = ${a.toFixed(2)}&times;(${tn}) + ${oma.toFixed(2)}&times;(${taun}) = <span class="hw-sub">${lhs.toFixed(2)}</span> + <span class="hw-sub">${rhs.toFixed(2)}</span> = <span class="hw-ans">${res.toFixed(2)} ms</span></span>
            `;
          }
          wrap.appendChild(bar); wrap.appendChild(out); box.appendChild(wrap); recalc();
        }
        // 3. Priority Aging (Deck 07)
        else if (/AgingInterval/i.test(txt)) {
          const bar = doc.createElement('div'); bar.className = 'play-controls-bar';
          const out = doc.createElement('div'); out.className = 'handwritten-sheet';
          const pP = makePaired('Init Prio:', 1, 40, 1, 10, () => recalc());
          const wP = makePaired('Wait (min):', 0, 200, 5, 45, () => recalc());
          const iP = makePaired('Interval (min):', 1, 60, 1, 15, () => recalc());
          bar.appendChild(pP.ctrl); bar.appendChild(wP.ctrl); bar.appendChild(iP.ctrl);
          function recalc() {
            const p0 = parseInt(pP.num.value, 10) || 10;
            const wt = parseInt(wP.num.value, 10) || 0;
            const iv = Math.max(1, parseInt(iP.num.value, 10) || 15);
            const drop = Math.floor(wt / iv);
            const res = Math.max(0, p0 - drop);
            out.innerHTML = `
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Aging)</span><span>0 = Top Priority</span></div>
              <span class="hw-step">Priority(t) = max(0, ${p0} &minus; &lfloor;${wt} / ${iv}&rfloor;) = max(0, ${p0} &minus; <span class="hw-sub">${drop}</span>) = <span class="hw-ans">${res}</span></span>
            `;
          }
          wrap.appendChild(bar); wrap.appendChild(out); box.appendChild(wrap); recalc();
        }
        // 4. m-bit Logical Address Bit Split (Deck 17)
        else if (/m-bit Logical Address Space/i.test(txt)) {
          const bar = doc.createElement('div'); bar.className = 'play-controls-bar';
          const out = doc.createElement('div'); out.className = 'handwritten-sheet';
          const mP = makePaired('Logical Bits m:', 8, 32, 1, 16, () => recalc());
          const nP = makePaired('Offset Bits n:', 4, 16, 1, 10, () => recalc());
          bar.appendChild(mP.ctrl); bar.appendChild(nP.ctrl);
          function recalc() {
            const m = Math.max(4, Math.min(32, parseInt(mP.num.value, 10) || 16));
            const n = Math.max(1, Math.min(m, parseInt(nP.num.value, 10) || 10));
            const pBits = m - n;
            const pSize = Math.pow(2, n);
            const numPages = Math.pow(2, pBits);
            out.innerHTML = `
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Paging Address Split)</span><span>2<sup>${m}</sup> B space</span></div>
              <span class="hw-step">&bull; Page Size = 2<sup>n</sup> = 2<sup>${n}</sup> = <span class="hw-sub">${pSize.toLocaleString()} bytes</span> (${pSize >= 1024 ? (pSize / 1024) + ' KB' : pSize + ' B'})</span>
              <span class="hw-step">&bull; High Page Bits = m &minus; n = ${m} &minus; ${n} = <span class="hw-ans">${pBits} bits</span> (&rArr; ${numPages.toLocaleString()} max pages)</span>
            `;
          }
          wrap.appendChild(bar); wrap.appendChild(out); box.appendChild(wrap); recalc();
        }
        // 5. TLB EAT Formula (Deck 17)
        else if (/EAT\s*=.*TLB\s*\+/i.test(txt)) {
          const bar = doc.createElement('div'); bar.className = 'play-controls-bar';
          const out = doc.createElement('div'); out.className = 'handwritten-sheet';
          const aP = makePaired('TLB Hit α (%):', 0, 100, 1, 80, () => recalc());
          const tP = makePaired('TLB ε (ns):', 0, 100, 1, 20, () => recalc());
          const mP = makePaired('RAM Mem (ns):', 10, 500, 10, 100, () => recalc());
          bar.appendChild(aP.ctrl); bar.appendChild(tP.ctrl); bar.appendChild(mP.ctrl);
          function recalc() {
            const ap = Math.max(0, Math.min(100, parseFloat(aP.num.value) || 80));
            const a = ap / 100, miss = 1 - a;
            const tlb = parseFloat(tP.num.value) || 0, mem = parseFloat(mP.num.value) || 100;
            const hCost = tlb + mem, mCost = tlb + 2 * mem;
            const eat = a * hCost + miss * mCost;
            out.innerHTML = `
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (TLB EAT)</span><span>Hit=${ap}%</span></div>
              <span class="hw-step">EAT = ${a.toFixed(2)}(${tlb} + ${mem}) + ${miss.toFixed(2)}(${tlb} + 2&times;${mem})</span>
              <span class="hw-step">    = ${a.toFixed(2)}(${hCost}) + ${miss.toFixed(2)}(${mCost}) = ${(a*hCost).toFixed(2)} + ${(miss*mCost).toFixed(2)} = <span class="hw-ans">${eat.toFixed(2)} ns</span></span>
            `;
          }
          wrap.appendChild(bar); wrap.appendChild(out); box.appendChild(wrap); recalc();
        }
        // 6. Demand Paging EAT (Deck 18)
        else if (/page_fault_time/i.test(txt)) {
          const bar = doc.createElement('div'); bar.className = 'play-controls-bar';
          const out = doc.createElement('div'); out.className = 'handwritten-sheet';
          const pP = makePaired('Fault Rate 1 in K (K=):', 100, 1000000, 100, 1000, () => recalc());
          const maP = makePaired('Mem Access ma (ns):', 10, 500, 10, 200, () => recalc());
          const pfP = makePaired('Swap Fault Time (ms):', 1, 20, 1, 8, () => recalc());
          bar.appendChild(pP.ctrl); bar.appendChild(maP.ctrl); bar.appendChild(pfP.ctrl);
          function recalc() {
            const k = Math.max(1, parseFloat(pP.num.value) || 1000);
            const p = 1 / k;
            const ma = parseFloat(maP.num.value) || 200;
            const pftMs = parseFloat(pfP.num.value) || 8;
            const pftNs = pftMs * 1000000;
            const eat = (1 - p) * ma + p * pftNs;
            const slow = (eat / ma).toFixed(1);
            out.innerHTML = `
              <div class="hw-title"><span>✍️ Play Formula &amp; Solve By Hand (Demand Paging EAT)</span><span>Convert ${pftMs} ms = ${pftNs.toLocaleString()} ns!</span></div>
              <span class="hw-step">p = 1 / ${k.toLocaleString()} = ${p.toExponential(2)} ,  pft = ${pftMs} &times; 10<sup>6</sup> = ${pftNs.toLocaleString()} ns</span>
              <span class="hw-step">EAT = (1 &minus; ${p.toFixed(4)}) &times; ${ma} + (${p.toFixed(4)}) &times; ${pftNs.toLocaleString()}</span>
              <span class="hw-step">    = ${((1 - p) * ma).toFixed(2)} + ${(p * pftNs).toFixed(1)} = <span class="hw-ans">${eat.toFixed(1)} ns (${slow}&times; slowdown!)</span></span>
            `;
          }
          wrap.appendChild(bar); wrap.appendChild(out); box.appendChild(wrap); recalc();
        }
      });
    }

    /** Inject lecture HTML with optional inline sabotage swap, semantic colors, and user highlights. */

export function mountLegacySimulator(nodeId, stage, formulas) {
  if (!stage) return;
  const formulaTarget = formulas || { innerHTML: '' };
  const formulasRef = formulaTarget;
  // Local alias 'formulas' expected by extracted deck blocks:
  return (function(formulas) {
      // Deck 02: Dual-Mode Hardware & IVT Traps
      if (nodeId === 'deck_02') {
        formulas.innerHTML = `ModeBit = 1 (User Mode) -> Ring 3<br>ModeBit = 0 (Kernel Mode) -> Ring 0<br>Trap Vector = IVT[Interrupt_ID]<br>Privileged Violations: HLT, CLI, Direct I/O`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W0: DUAL-MODE HARDWARE & TRAP VECTOR MACHINE</div>
              <div class="sim-controls">
                <button class="btn-industrial" onclick="W0_DualModeSimulator.executeUser()">1. Safe User Instruction</button>
                <button class="btn-industrial danger" onclick="W0_DualModeSimulator.executeHLT()">2. Privileged HLT (Trap!)</button>
                <button class="btn-industrial danger" onclick="W0_DualModeSimulator.executeCLI()">3. Privileged CLI (Trap!)</button>
                <button class="btn-industrial primary" onclick="W0_DualModeSimulator.executeSyscall()">4. INT 0x80 System Call</button>
                <button class="btn-industrial" onclick="W0_DualModeSimulator.executeTimer()">5. Timer Tick IRQ</button>
              </div>
            </div>
            <div class="sim-body">
              <div id="w0-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `;
        W0_DualModeSimulator.init();
        return;
      }

      // Deck 03: Process State Machine, fork() Tree & Amdahl's Law
      if (nodeId === 'deck_03') {
        formulas.innerHTML = `5 Process States: New, Ready, Running, Waiting, Terminated<br>fork() returns: Child PID in parent, 0 in child<br>Total Procs = 2^n | Amdahl Speedup &le; 1 / [ S + (1&minus;S)/N ]`;
        stage.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W1: 5-STATE PROCESS LIFECYCLE MACHINE</div>
                <button class="btn-industrial" onclick="W1_StateMachine.currentState='New'; W1_StateMachine.init();">↺ Reset to New</button>
              </div>
              <div class="sim-body">
                <div id="w1-canvas" class="sim-canvas"></div>
                <div id="w1-actions" style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;"></div>
                <div id="w1-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-cyan);">Click any action button above to transition the active process state.</div>
              </div>
            </div>
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W2: PROCESS TREE & FORK() EXPONENTIATION</div>
                <div class="sim-controls">
                  <div class="play-ctrl">
                    <label>fork() calls (n):</label>
                    <input type="range" id="w2-range" class="play-range" min="1" max="5" value="${W2_ForkVisualizer.nForks}" oninput="W2_ForkVisualizer.update(this.value)" />
                    <input type="number" id="w2-num" class="play-num" min="1" max="5" value="${W2_ForkVisualizer.nForks}" oninput="W2_ForkVisualizer.update(this.value)" />
                  </div>
                </div>
              </div>
              <div class="sim-body">
                <div id="w2-stats" style="margin-bottom: 8px; font-size: 12px; color: var(--color-amber);"></div>
                <div id="w2-canvas" class="sim-canvas"></div>
                <div id="w2-hand" class="handwritten-sheet"></div>
              </div>
            </div>
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W2B: AMDAHL'S LAW PARALLEL SPEEDUP SANDBOX</div>
                <div class="sim-controls">
                  <button class="btn-industrial" onclick="W2B_AmdahlLab.update(25, 4)">Exam (S=0.25, N=4)</button>
                  <button class="btn-industrial" onclick="W2B_AmdahlLab.update(10, 16)">Scaled (S=0.10, N=16)</button>
                  <button class="btn-industrial" onclick="W2B_AmdahlLab.update(50, 8)">Bottleneck (S=0.50, N=8)</button>
                </div>
              </div>
              <div class="sim-body">
                <div class="play-controls-bar">
                  <div class="play-ctrl">
                    <label>Serial Fraction S (%):</label>
                    <input type="range" id="w2b-s-range" class="play-range" min="1" max="100" value="${W2B_AmdahlLab.sPct}" oninput="W2B_AmdahlLab.update(this.value, null)" />
                    <input type="number" id="w2b-s-num" class="play-num" min="1" max="100" value="${W2B_AmdahlLab.sPct}" oninput="W2B_AmdahlLab.update(this.value, null)" />
                  </div>
                  <div class="play-ctrl">
                    <label>CPU Cores (N):</label>
                    <input type="range" id="w2b-n-range" class="play-range" min="1" max="64" value="${W2B_AmdahlLab.cores}" oninput="W2B_AmdahlLab.update(null, this.value)" />
                    <input type="number" id="w2b-n-num" class="play-num" min="1" max="64" value="${W2B_AmdahlLab.cores}" oninput="W2B_AmdahlLab.update(null, this.value)" />
                  </div>
                </div>
                <div id="w2b-canvas"></div>
              </div>
            </div>
          </div>
        `;
        W1_StateMachine.init();
        W2_ForkVisualizer.init();
        W2B_AmdahlLab.init();
        return;
      }

      // Decks 04, 05, 06, 07, 08: CPU Scheduling
      if (['deck_04', 'deck_05', 'deck_06', 'deck_07', 'deck_08'].includes(nodeId)) {
        let defaultAlgo = 'FCFS';
        let defaultExample = 'standard';
        let subTitle = 'FCFS & Convoy Wind Tunnel';

        if (nodeId === 'deck_05') { defaultAlgo = 'SJF'; defaultExample = 'standard'; subTitle = 'SJF Non-Preemptive Optimizer'; }
        if (nodeId === 'deck_06') { defaultAlgo = 'SRTF'; defaultExample = 'srtf'; subTitle = 'SRTF Preemptive Scheduler'; }
        if (nodeId === 'deck_07') { defaultAlgo = 'Priority-Pre'; defaultExample = 'priority'; subTitle = 'Preemptive Priority & Aging Lab'; }
        if (nodeId === 'deck_08') { defaultAlgo = 'RR'; defaultExample = 'rr'; subTitle = 'Round Robin Quantum Analyzer'; }

        formulas.innerHTML = `TAT = Completion Time - Arrival Time<br>WT = Turnaround Time - Burst Time<br>Avg WT = Sum(WT) / N`;

        const deck05Extra = nodeId === 'deck_05' ? `
          <div class="sim-card" style="margin-top: 16px;">
            <div class="sim-header">
              <div class="sim-title">⚙️ W4: EXPONENTIAL AVERAGING CPU BURST PREDICTOR</div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Alpha (&alpha;):</label>
                  <input type="range" id="w4-alpha-r" class="play-range" min="0" max="1" step="0.05" value="${W4_ExpAveragingLab.alpha}" oninput="W4_ExpAveragingLab.updateAlpha(this.value)" />
                  <input type="number" id="w4-alpha-n" class="play-num" min="0" max="1" step="0.05" value="${W4_ExpAveragingLab.alpha}" oninput="W4_ExpAveragingLab.updateAlpha(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Initial &tau;<sub>0</sub>:</label>
                  <input type="number" class="play-num" min="0" max="100" value="${W4_ExpAveragingLab.tau0}" oninput="W4_ExpAveragingLab.updateTau0(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Actual Bursts t:</label>
                  <input type="text" class="play-text" value="${W4_ExpAveragingLab.bursts.join(', ')}" oninput="W4_ExpAveragingLab.updateBursts(this.value)" />
                </div>
              </div>
              <div id="w4-canvas"></div>
            </div>
          </div>
        ` : '';

        const deck07Extra = nodeId === 'deck_07' ? `
          <div class="sim-card" style="margin-top: 16px;">
            <div class="sim-header">
              <div class="sim-title">⚙️ W4B: STARVATION PREVENTION &amp; AGING ESCALATION</div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Initial Priority:</label>
                  <input type="range" id="w4b-ip-r" class="play-range" min="0" max="30" value="${W4B_AgingLab.initPrio}" oninput="W4B_AgingLab.update(this.value, null, null)" />
                  <input type="number" id="w4b-ip-n" class="play-num" min="0" max="40" value="${W4B_AgingLab.initPrio}" oninput="W4B_AgingLab.update(this.value, null, null)" />
                </div>
                <div class="play-ctrl">
                  <label>Wait Time:</label>
                  <input type="range" id="w4b-wt-r" class="play-range" min="0" max="200" step="5" value="${W4B_AgingLab.waitTime}" oninput="W4B_AgingLab.update(null, this.value, null)" />
                  <input type="number" id="w4b-wt-n" class="play-num" min="0" max="300" value="${W4B_AgingLab.waitTime}" oninput="W4B_AgingLab.update(null, this.value, null)" />
                </div>
                <div class="play-ctrl">
                  <label>Aging Interval:</label>
                  <input type="range" id="w4b-st-r" class="play-range" min="1" max="60" value="${W4B_AgingLab.agingStep}" oninput="W4B_AgingLab.update(null, null, this.value)" />
                  <input type="number" id="w4b-st-n" class="play-num" min="1" max="60" value="${W4B_AgingLab.agingStep}" oninput="W4B_AgingLab.update(null, null, this.value)" />
                </div>
              </div>
              <div id="w4b-canvas"></div>
            </div>
          </div>
        ` : '';

        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ ${subTitle.toUpperCase()}</div>
              <div class="sim-controls">
                <select id="w3-algo" class="btn-industrial" onchange="W3_CPUScheduler.algorithm = this.value; W3_CPUScheduler.syncUI(); W3_CPUScheduler.calculate(false);">
                  <option value="FCFS" ${defaultAlgo === 'FCFS' ? 'selected' : ''}>FCFS</option>
                  <option value="SJF" ${defaultAlgo === 'SJF' ? 'selected' : ''}>SJF (Non-Preemptive)</option>
                  <option value="SRTF" ${defaultAlgo === 'SRTF' ? 'selected' : ''}>SRTF (Preemptive SJF)</option>
                  <option value="Priority-NonPre" ${defaultAlgo === 'Priority-NonPre' ? 'selected' : ''}>Priority (Non-Preemptive)</option>
                  <option value="Priority-Pre" ${defaultAlgo === 'Priority-Pre' ? 'selected' : ''}>Priority (Preemptive)</option>
                  <option value="RR" ${defaultAlgo === 'RR' ? 'selected' : ''}>Round Robin (RR)</option>
                </select>
                <button class="btn-industrial" onclick="W3_CPUScheduler.loadExample('standard')">Slide FCFS</button>
                <button class="btn-industrial" onclick="W3_CPUScheduler.loadExample('srtf')">Slide SRTF</button>
                <button class="btn-industrial" onclick="W3_CPUScheduler.loadExample('priority')">Slide Priority</button>
                <button class="btn-industrial" onclick="W3_CPUScheduler.loadExample('rr')">Slide RR (q=4)</button>
                <button class="btn-industrial primary" onclick="W3_CPUScheduler.addProcess()">+ Add Process</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar" id="w3-play-bar">
                <div class="play-ctrl">
                  <label>Play Process:</label>
                  <select id="w3-sl-proc" class="play-num" style="width:68px;" onchange="W3_CPUScheduler.selectProc(this.value)"></select>
                </div>
                <div class="play-ctrl">
                  <label>AT:</label>
                  <input type="range" id="w3-sl-at-r" class="play-range" style="width:78px;" min="0" max="20" value="0" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'at',this.value,true)" />
                  <input type="number" id="w3-sl-at-n" class="play-num" style="width:52px;" min="0" max="60" value="0" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'at',this.value,true)" />
                </div>
                <div class="play-ctrl">
                  <label>BT:</label>
                  <input type="range" id="w3-sl-bt-r" class="play-range" style="width:78px;" min="1" max="30" value="24" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'bt',this.value,true)" />
                  <input type="number" id="w3-sl-bt-n" class="play-num" style="width:52px;" min="1" max="60" value="24" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'bt',this.value,true)" />
                </div>
                <div class="play-ctrl">
                  <label>Priority:</label>
                  <input type="range" id="w3-sl-p-r" class="play-range" style="width:72px;" min="1" max="10" value="3" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'p',this.value,true)" />
                  <input type="number" id="w3-sl-p-n" class="play-num" style="width:50px;" min="1" max="20" value="3" oninput="W3_CPUScheduler.updateProcField(W3_CPUScheduler.selectedIdx,'p',this.value,true)" />
                </div>
                <div class="play-ctrl" id="w3-q-ctrl" style="display:${defaultAlgo === 'RR' ? 'inline-flex' : 'none'};">
                  <label>Quantum Q:</label>
                  <input type="range" id="w3-q-range" class="play-range" style="width:72px;" min="1" max="20" value="4" oninput="W3_CPUScheduler.setQuantum(this.value)" />
                  <input type="number" id="w3-quantum" class="play-num" style="width:52px;" min="1" max="30" value="4" oninput="W3_CPUScheduler.setQuantum(this.value)" />
                </div>
              </div>

              <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); margin-bottom: 4px;">GANTT CHART TIMELINE:</div>
              <div class="sim-canvas" id="w3-gantt" style="min-height: 98px;"></div>

              <div style="font-size: 11px; font-weight: 700; color: var(--color-cyan); margin: 12px 0 4px;">EDITABLE EXAM EXECUTION TABLE (Change AT / BT / Priority directly or via sliders above):</div>
              <div style="overflow-x: auto;">
                <table class="data-table">
                  <thead>
                    <tr><th>Process</th><th>Arrival (AT)</th><th>Burst (BT)</th><th>Priority</th><th>Completion (CT)</th><th>TAT (CT-AT)</th><th>WT (TAT-BT)</th><th>RT</th><th></th></tr>
                  </thead>
                  <tbody id="w3-table-body"></tbody>
                </table>
              </div>
              <div id="w3-summary" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w3-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
          ${deck05Extra}
          ${deck07Extra}
        `;

        W3_CPUScheduler.loadExample(defaultExample);
        W3_CPUScheduler.algorithm = defaultAlgo;
        W3_CPUScheduler.syncUI();
        W3_CPUScheduler.calculate(false);
        if (nodeId === 'deck_05') W4_ExpAveragingLab.init();
        if (nodeId === 'deck_07') W4B_AgingLab.init();
        return;
      }

      // Deck 09: Race Condition Collider
      if (nodeId === 'deck_09') {
        formulas.innerHTML = `count++ -> LOAD R1, count; ADD R1, #1; STORE count, R1<br>count-- -> LOAD R2, count; SUB R2, #1; STORE count, R2<br>Result: 4 or 6 instead of 5`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W5: RACE CONDITION COLLIDER (REGISTER-LEVEL INTERLEAVING)</div>
              <div class="sim-controls">
                <div class="play-ctrl">
                  <label>Step:</label>
                  <input type="range" id="w5-step-r" class="play-range" style="width:90px;" min="0" max="6" value="0" oninput="W5_RaceCondition.setStep(this.value)" />
                  <input type="number" id="w5-step-n" class="play-num" style="width:48px;" min="0" max="6" value="0" oninput="W5_RaceCondition.setStep(this.value)" />
                </div>
                <button class="btn-industrial primary" onclick="W5_RaceCondition.next()">NEXT STEP</button>
                <button class="btn-industrial" onclick="W5_RaceCondition.reset()">RESET</button>
              </div>
            </div>
            <div class="sim-body">
              <div style="overflow-x: auto;">
                <table class="data-table">
                  <thead><tr><th>Step</th><th>Actor</th><th>Assembly Instruction</th><th>Reg 1</th><th>Reg 2</th><th>Shared Counter</th></tr></thead>
                  <tbody id="w5-table-body"></tbody>
                </table>
              </div>
              <div id="w5-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
            </div>
          </div>
        `;
        W5_RaceCondition.init();
        return;
      }

      // Deck 10: Peterson's Solution
      if (nodeId === 'deck_10') {
        formulas.innerHTML = `flag[i] = true; turn = j;<br>while (flag[j] && turn == j);<br>flag[i] = false;`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W7: PETERSON'S ALGORITHM TRACER (2 PROCESSES)</div>
              <div class="sim-controls">
                <div class="play-ctrl">
                  <label>Step:</label>
                  <input type="range" id="w7-step-r" class="play-range" style="width:90px;" min="0" max="6" value="0" oninput="W7_CriticalSection.setStep(this.value)" />
                  <input type="number" id="w7-step-n" class="play-num" style="width:48px;" min="0" max="6" value="0" oninput="W7_CriticalSection.setStep(this.value)" />
                </div>
                <button class="btn-industrial primary" onclick="W7_CriticalSection.nextStep()">STEP PETERSON</button>
                <button class="btn-industrial" onclick="W7_CriticalSection.reset()">RESET</button>
              </div>
            </div>
            <div class="sim-body">
              <div style="overflow-x: auto;">
                <table class="data-table">
                  <thead><tr><th>Step</th><th>P0 Code</th><th>P1 Code</th><th>flag[0]</th><th>flag[1]</th><th>turn</th><th>Critical Section</th></tr></thead>
                  <tbody id="w7-table-body"></tbody>
                </table>
              </div>
              <div id="w7-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
            </div>
          </div>
        `;
        W7_CriticalSection.init();
        return;
      }

      // Deck 11: Semaphores & Bounded Buffer
      if (nodeId === 'deck_11') {
        formulas.innerHTML = `wait(S): while(S<=0); S--;<br>signal(S): S++;<br>Bounded Buffer: mutex=1, empty=N, full=0`;
        stage.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W6: BOUNDED BUFFER CIRCULAR PRODUCER-CONSUMER</div>
                <div class="sim-controls">
                  <div class="play-ctrl">
                    <label>Slots N:</label>
                    <input type="range" id="w6-sz-r" class="play-range" style="width:72px;" min="4" max="10" value="${W6_BoundedBuffer.size}" oninput="W6_BoundedBuffer.setSize(this.value)" />
                    <input type="number" id="w6-sz-n" class="play-num" style="width:48px;" min="4" max="10" value="${W6_BoundedBuffer.size}" oninput="W6_BoundedBuffer.setSize(this.value)" />
                  </div>
                  <button class="btn-industrial primary" onclick="W6_BoundedBuffer.produce()">PRODUCE ITEM</button>
                  <button class="btn-industrial" onclick="W6_BoundedBuffer.consume()">CONSUME ITEM</button>
                  <button class="btn-industrial" onclick="W6_BoundedBuffer.reset()">RESET</button>
                </div>
              </div>
              <div class="sim-body">
                <div id="w6-canvas" class="sim-canvas"></div>
                <div id="w6-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-cyan);"></div>
                <div id="w6-hand" class="handwritten-sheet"></div>
              </div>
            </div>
            <div class="sim-card">
              <div class="sim-header">
                <div class="sim-title">⚙️ W8: COUNTING SEMAPHORE DISPATCHER</div>
                <div class="sim-controls">
                  <div class="play-ctrl">
                    <label>Initial S:</label>
                    <input type="range" id="w8-init-r" class="play-range" style="width:72px;" min="0" max="8" value="${W8_Semaphore.initValue}" oninput="W8_Semaphore.setInitial(this.value)" />
                    <input type="number" id="w8-init-n" class="play-num" style="width:48px;" min="0" max="8" value="${W8_Semaphore.initValue}" oninput="W8_Semaphore.setInitial(this.value)" />
                  </div>
                  <button class="btn-industrial primary" onclick="W8_Semaphore.wait()">CALL wait() (P)</button>
                  <button class="btn-industrial" onclick="W8_Semaphore.signal()">CALL signal() (V)</button>
                  <button class="btn-industrial" onclick="W8_Semaphore.reset()">RESET</button>
                </div>
              </div>
              <div class="sim-body">
                <div style="font-size: 13px; font-family: var(--font-mono); margin-bottom: 6px;">
                  Semaphore Value: <strong id="w8-val" style="color:var(--color-cyan); font-size: 18px;">1</strong> | 
                  Blocked Queue: <span id="w8-queue" style="color:var(--color-amber);">[]</span>
                </div>
                <div id="w8-narr" style="font-size: 12px; color: var(--text-secondary);"></div>
              </div>
            </div>
          </div>
        `;
        W6_BoundedBuffer.init();
        W8_Semaphore.init();
        return;
      }

      // Deck 12: Dining Philosophers
      if (nodeId === 'deck_12') {
        formulas.innerHTML = `5 Philosophers, 5 Chopsticks<br>Circular Wait: Everyone grabs left -> DEADLOCK!<br>Fix: Max 4, Asymmetric pickup, or Monitor`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W10: DINING PHILOSOPHERS INTERACTIVE TABLE</div>
              <div class="sim-controls">
                <button class="btn-industrial danger" onclick="W10_DiningPhilosophers.triggerDeadlock()">TRIGGER CIRCULAR DEADLOCK</button>
                <button class="btn-industrial" onclick="W10_DiningPhilosophers.reset()">RESET TABLE</button>
              </div>
            </div>
            <div class="sim-body">
              <div id="w10-canvas" class="sim-canvas"></div>
              <div id="w10-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-cyan);">Click any Philosopher circle (P0..P4) to toggle THINKING &harr; HUNGRY/EATING.</div>
            </div>
          </div>
        `;
        W10_DiningPhilosophers.init();
        return;
      }

      // Deck 13: Coffman Conditions & Deadlock Prevention
      if (nodeId === 'deck_13') {
        formulas.innerHTML = `4 Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait<br>Prevention: Invalidate at least one condition to guarantee zero deadlocks`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W11: COFFMAN CONDITIONS & DEADLOCK PREVENTION MATRIX</div>
            </div>
            <div class="sim-body">
              <div id="w11-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `;
        W11_CoffmanRAG.init();
        return;
      }

      // Deck 14: Banker's Algorithm
      if (nodeId === 'deck_14') {
        formulas.innerHTML = `Need = Max - Allocation<br>Safety Test: Work = Available; Finish[i] = false<br>Safe Sequence if all Finish[i] == true`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W12: BANKER'S ALGORITHM SAFETY CALCULATOR</div>
              <div class="sim-controls">
                <button class="btn-industrial primary" onclick="W12_Bankers.lastMsg=''; W12_Bankers.runSafety(false);">RUN SAFETY ALGORITHM</button>
                <button class="btn-industrial" onclick="W12_Bankers.reset()">↺ RESET DEFAULT</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Custom Request Process:</label>
                  <select id="w12-req-p" class="play-num" style="width:68px;" onchange="W12_Bankers.setRequestParam(this.value,null,null)">
                    <option value="0">P0</option><option value="1" selected>P1</option><option value="2">P2</option><option value="3">P3</option><option value="4">P4</option>
                  </select>
                </div>
                <div class="play-ctrl">
                  <label>Req (A B C):</label>
                  <input type="number" id="w12-req-0" class="play-num" style="width:46px;" min="0" max="20" value="1" oninput="W12_Bankers.setRequestParam(null,0,this.value)" />
                  <input type="number" id="w12-req-1" class="play-num" style="width:46px;" min="0" max="20" value="0" oninput="W12_Bankers.setRequestParam(null,1,this.value)" />
                  <input type="number" id="w12-req-2" class="play-num" style="width:46px;" min="0" max="20" value="2" oninput="W12_Bankers.setRequestParam(null,2,this.value)" />
                </div>
                <button class="btn-industrial primary" onclick="W12_Bankers.testRequest()">TEST REQUEST</button>
              </div>
              <div style="overflow-x: auto;">
                <table class="data-table">
                  <thead><tr><th>Process</th><th>Allocation (A B C)</th><th>Max (A B C)</th><th>Need (Max&minus;Alloc)</th><th>Available (A B C)</th></tr></thead>
                  <tbody id="w12-table-body"></tbody>
                </table>
              </div>
              <div id="w12-narr" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w12-trace" style="margin-top: 8px; font-family: var(--font-mono); color: var(--color-emerald); font-size: 12px;"></div>
              <div id="w12-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
        `;
        W12_Bankers.init();
        return;
      }

      // Deck 15: Deadlock Detection & Recovery
      if (nodeId === 'deck_15') {
        formulas.innerHTML = `Wait-For Graph: P_i -> P_j if P_i is waiting for P_j to release a resource<br>Recovery: Abort processes or Preempt resources based on minimum cost`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W12B: WAIT-FOR GRAPH CYCLE DETECTION & RECOVERY</div>
            </div>
            <div class="sim-body">
              <div id="w12-recovery-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `;
        W12_DeadlockRecovery.init();
        return;
      }

      // Deck 16: Contiguous Memory Allocation
      if (nodeId === 'deck_16') {
        formulas.innerHTML = `First-Fit: Allocate first hole big enough<br>Best-Fit: Allocate smallest hole big enough<br>Worst-Fit: Allocate largest hole`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W13: CONTIGUOUS PARTITION ALLOCATOR</div>
              <div class="sim-controls">
                <button class="btn-industrial" onclick="W13_MemoryAlloc.run('first')">FIRST-FIT</button>
                <button class="btn-industrial" onclick="W13_MemoryAlloc.run('best')">BEST-FIT</button>
                <button class="btn-industrial" onclick="W13_MemoryAlloc.run('worst')">WORST-FIT</button>
                <button class="btn-industrial" onclick="W13_MemoryAlloc.reset()">RESET</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Hole Sizes (KB):</label>
                  <input type="text" id="w13-holes" class="play-text" value="${W13_MemoryAlloc.holeSizes.join(', ')}" oninput="W13_MemoryAlloc.updateHoles(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Process Sizes (KB):</label>
                  <input type="text" id="w13-procs" class="play-text" value="${W13_MemoryAlloc.procSizes.join(', ')}" oninput="W13_MemoryAlloc.updateProcs(this.value)" />
                </div>
              </div>
              <div id="w13-canvas" class="sim-canvas"></div>
              <div id="w13-summary" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w13-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
        `;
        W13_MemoryAlloc.run('first');
        return;
      }

      // Deck 17: Paging & Address Translation
      if (nodeId === 'deck_17') {
        formulas.innerHTML = `p = Address / Page_Size; d = Address % Page_Size<br>EAT = alpha*(eps + m) + (1-alpha)*(eps + 2m)`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W14: PAGING ADDRESS TRANSLATOR &amp; TLB EAT LAB</div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Logical Addr:</label>
                  <input type="range" id="w14-la-r" class="play-range" min="0" max="8191" value="3085" oninput="W14_PagingTranslator.setLA(this.value)" />
                  <input type="number" id="w14-la" class="play-num" style="width:74px;" min="0" max="65535" value="3085" oninput="W14_PagingTranslator.setLA(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Page Size:</label>
                  <select id="w14-ps" class="play-num" style="width:118px;" onchange="W14_PagingTranslator.translate()">
                    <option value="256">256 B</option>
                    <option value="512">512 B</option>
                    <option value="1024" selected>1 KB (1024 B)</option>
                    <option value="2048">2 KB (2048 B)</option>
                    <option value="4096">4 KB (4096 B)</option>
                  </select>
                </div>
              </div>
              <div class="panel-chamfer" style="padding: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; font-family: var(--font-mono); margin-bottom: 8px;">
                <div>Page Number (p): <strong id="w14-p" style="color:var(--color-cyan);">-</strong></div>
                <div>Offset (d): <strong id="w14-d" style="color:var(--color-amber);">-</strong></div>
                <div>Frame (f): <strong id="w14-frame" style="color:var(--color-emerald);">-</strong></div>
                <div>Physical Addr (PA): <strong id="w14-pa" style="color:var(--text-primary);">-</strong></div>
              </div>
              <div id="w14-narr" style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;"></div>

              <div class="play-controls-bar" style="margin-top: 14px;">
                <div class="play-ctrl">
                  <label>TLB Hit &alpha; (%):</label>
                  <input type="range" id="w14-a-r" class="play-range" style="width:82px;" min="0" max="100" value="${W14_PagingTranslator.hitRatio}" oninput="W14_PagingTranslator.setEAT(this.value, null, null)" />
                  <input type="number" id="w14-a-n" class="play-num" style="width:54px;" min="0" max="100" value="${W14_PagingTranslator.hitRatio}" oninput="W14_PagingTranslator.setEAT(this.value, null, null)" />
                </div>
                <div class="play-ctrl">
                  <label>TLB &epsilon; (ns):</label>
                  <input type="range" id="w14-e-r" class="play-range" style="width:74px;" min="0" max="100" value="${W14_PagingTranslator.tlbNs}" oninput="W14_PagingTranslator.setEAT(null, this.value, null)" />
                  <input type="number" id="w14-e-n" class="play-num" style="width:54px;" min="0" max="200" value="${W14_PagingTranslator.tlbNs}" oninput="W14_PagingTranslator.setEAT(null, this.value, null)" />
                </div>
                <div class="play-ctrl">
                  <label>RAM m (ns):</label>
                  <input type="range" id="w14-m-r" class="play-range" style="width:74px;" min="10" max="500" step="10" value="${W14_PagingTranslator.memNs}" oninput="W14_PagingTranslator.setEAT(null, null, this.value)" />
                  <input type="number" id="w14-m-n" class="play-num" style="width:58px;" min="10" max="1000" value="${W14_PagingTranslator.memNs}" oninput="W14_PagingTranslator.setEAT(null, null, this.value)" />
                </div>
              </div>
              <div id="w14-eat-hand"></div>
            </div>
          </div>
        `;
        W14_PagingTranslator.translate();
        return;
      }

      // Deck 18: Page Replacement & Belady's Anomaly
      if (nodeId === 'deck_18') {
        formulas.innerHTML = `FIFO: Belady's Anomaly (more frames -> more faults!)<br>LRU: Least Recently Used<br>OPT: Optimal future replacement`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W15: PAGE REPLACEMENT SIMULATOR (PLAY FRAMES &amp; REF STRING)</div>
              <div class="sim-controls">
                <button class="btn-industrial" onclick="W15_PageReplacement.run('FIFO')">FIFO</button>
                <button class="btn-industrial" onclick="W15_PageReplacement.run('LRU')">LRU</button>
                <button class="btn-industrial" onclick="W15_PageReplacement.run('OPT')">OPT</button>
                <button class="btn-industrial" onclick="W15_PageReplacement.loadPreset('slide18')">Slide 18 Classic</button>
                <button class="btn-industrial primary" onclick="W15_PageReplacement.loadPreset('belady')">Belady Paradox (3 vs 4)</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Frames F:</label>
                  <input type="range" id="w15-f-r" class="play-range" style="width:82px;" min="1" max="6" value="${W15_PageReplacement.nFrames}" oninput="W15_PageReplacement.setFrames(this.value)" />
                  <input type="number" id="w15-f-n" class="play-num" style="width:48px;" min="1" max="6" value="${W15_PageReplacement.nFrames}" oninput="W15_PageReplacement.setFrames(this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Ref String:</label>
                  <input type="text" id="w15-refs" class="play-text" style="min-width:250px;" value="${W15_PageReplacement.refString.join(',')}" oninput="W15_PageReplacement.setRefs(this.value)" />
                </div>
              </div>
              <div id="w15-grid" class="sim-canvas"></div>
              <div id="w15-summary" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w15-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
        `;
        W15_PageReplacement.run('FIFO');
        return;
      }

      // Deck 19: Disk Scheduling
      if (nodeId === 'deck_19') {
        formulas.innerHTML = `Seek Time: Cylinder head movement<br>Algorithms: FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W16: DISK HEAD SEEK SCHEDULER</div>
              <div class="sim-controls">
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('FCFS')">FCFS</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('SSTF')">SSTF</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('SCAN')">SCAN</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('C-SCAN')">C-SCAN</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('LOOK')">LOOK</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.run('C-LOOK')">C-LOOK</button>
                <button class="btn-industrial" onclick="W16_DiskScheduling.loadStandardExample()">Slide 19 (53)</button>
                <button class="btn-industrial primary" onclick="W16_DiskScheduling.loadReviewQueueExample()">Practice (143)</button>
              </div>
            </div>
            <div class="sim-body">
              <div class="play-controls-bar">
                <div class="play-ctrl">
                  <label>Start Head:</label>
                  <input type="range" id="w16-head-r" class="play-range" style="width:90px;" min="0" max="${W16_DiskScheduling.cylinders - 1}" value="${W16_DiskScheduling.head}" oninput="W16_DiskScheduling.updateParam('head', this.value)" />
                  <input type="number" id="w16-head-n" class="play-num" style="width:62px;" min="0" max="9999" value="${W16_DiskScheduling.head}" oninput="W16_DiskScheduling.updateParam('head', this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Cylinders:</label>
                  <input type="number" id="w16-cyl-n" class="play-num" style="width:64px;" min="20" max="10000" value="${W16_DiskScheduling.cylinders}" oninput="W16_DiskScheduling.updateParam('cyl', this.value)" />
                </div>
                <div class="play-ctrl">
                  <label>Direction:</label>
                  <select id="w16-dir" class="play-num" style="width:86px;" onchange="W16_DiskScheduling.updateParam('dir', this.value)">
                    <option value="down" ${W16_DiskScheduling.direction==='down'?'selected':''}>Down (&larr; 0)</option>
                    <option value="up" ${W16_DiskScheduling.direction==='up'?'selected':''}>Up (&rarr; max)</option>
                  </select>
                </div>
                <div class="play-ctrl">
                  <label>Queue:</label>
                  <input type="text" id="w16-queue" class="play-text" value="${W16_DiskScheduling.queue.join(', ')}" oninput="W16_DiskScheduling.updateParam('queue', this.value)" />
                </div>
              </div>
              <div id="w16-canvas" class="sim-canvas"></div>
              <div id="w16-summary" style="margin-top: 8px; font-size: 12px; color: var(--color-amber);"></div>
              <div id="w16-handwritten" class="handwritten-sheet"></div>
            </div>
          </div>
        `;
        W16_DiskScheduling.run('FCFS');
        return;
      }

      // Deck 20: File System & Inode Blocks
      if (nodeId === 'deck_20') {
        formulas.innerHTML = `UNIX Inode: 12 Direct Pointers, 1 Single Indirect, 1 Double Indirect, 1 Triple Indirect<br>Block Size: 4 KB`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W17: INODE MULTI-LEVEL BLOCK TRAVERSAL</div>
            </div>
            <div class="sim-body">
              <div id="w17-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `;
        W17_InodeFileSystem.init();
        return;
      }

      // Deck 21: I/O Subsystems & DMA
      if (nodeId === 'deck_21') {
        formulas.innerHTML = `Polling: CPU busy-waits<br>Interrupt-Driven: 1 interrupt per byte<br>DMA: 1 interrupt per block (bypasses CPU)`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W18: I/O MANAGEMENT: POLLING vs INTERRUPTS vs DMA</div>
            </div>
            <div class="sim-body">
              <div id="w18-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `;
        W18_IODMAModel.init();
        return;
      }

      // Deck 22: Security & Protection Access Matrix
      if (nodeId === 'deck_22') {
        formulas.innerHTML = `Access Matrix: Rows = Domains, Columns = Objects<br>Access Control Lists (ACLs) per Object vs Capability Lists per Domain`;
        stage.innerHTML = `
          <div class="sim-card">
            <div class="sim-header">
              <div class="sim-title">⚙️ W19: ACCESS MATRIX SECURITY & DOMAIN FIREWALL</div>
            </div>
            <div class="sim-body">
              <div id="w19-canvas" class="sim-canvas"></div>
            </div>
          </div>
        `;
        W19_AccessMatrix.init();
        return;
      }
  })(formulasRef);
}

export { attachFormulaSandboxes };
