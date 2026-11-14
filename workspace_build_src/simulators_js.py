# build_src/simulators_js.py

SIMULATORS_JS = """
// CPCS-361 Interactive Simulators Suite (W1 - W19)

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
    const valid = this.transitions[this.currentState].find(t => t.action === action);
    const narr = document.getElementById('w1-narr');
    if (valid) {
      this.currentState = valid.to;
      if (narr) narr.innerHTML = `<strong>Action: ${valid.action}</strong> &rarr; Moved to state <strong>${valid.to}</strong>. <br><span style="color:var(--text-muted)">${valid.desc}</span>`;
      this.render();
    } else {
      if (narr) narr.innerHTML = `<span style="color:var(--danger)">⚠️ Invalid transition! Cannot perform '${action}' from '${this.currentState}'.</span>`;
    }
  },

  render() {
    const container = document.getElementById('w1-canvas');
    const actionsBar = document.getElementById('w1-actions');
    if (!container) return;

    const s = this.currentState;
    container.innerHTML = `
      <svg viewBox="0 0 700 240" style="width:100%; max-width:650px;">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
          </marker>
        </defs>

        <!-- New State -->
        <rect x="20" y="90" width="90" height="45" rx="22" fill="${s === 'New' ? 'var(--primary)' : 'var(--bg-card)'}" stroke="var(--primary)" stroke-width="2"/>
        <text x="65" y="118" fill="${s === 'New' ? '#fff' : 'var(--text-main)'}" font-weight="700" text-anchor="middle" font-size="14">New</text>

        <!-- Transition: New -> Ready -->
        <path d="M 110 112 L 180 112" stroke="var(--border-light)" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="145" y="105" fill="var(--text-dim)" font-size="11" text-anchor="middle">Admit</text>

        <!-- Ready State -->
        <rect x="180" y="90" width="100" height="45" rx="22" fill="${s === 'Ready' ? 'var(--primary)' : 'var(--bg-card)'}" stroke="var(--primary)" stroke-width="2"/>
        <text x="230" y="118" fill="${s === 'Ready' ? '#fff' : 'var(--text-main)'}" font-weight="700" text-anchor="middle" font-size="14">Ready</text>

        <!-- Transition: Ready -> Running -->
        <path d="M 280 105 L 360 105" stroke="var(--border-light)" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="320" y="98" fill="var(--text-dim)" font-size="11" text-anchor="middle">Dispatch</text>

        <!-- Running State -->
        <rect x="360" y="90" width="110" height="45" rx="22" fill="${s === 'Running' ? 'var(--primary)' : 'var(--bg-card)'}" stroke="var(--primary)" stroke-width="2"/>
        <text x="415" y="118" fill="${s === 'Running' ? '#fff' : 'var(--text-main)'}" font-weight="700" text-anchor="middle" font-size="14">Running</text>

        <!-- Transition: Running -> Ready (Interrupt) -->
        <path d="M 390 90 C 350 40, 270 40, 240 90" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="315" y="48" fill="var(--text-dim)" font-size="11" text-anchor="middle">Interrupt (Time-out)</text>

        <!-- Waiting State -->
        <rect x="270" y="180" width="100" height="45" rx="22" fill="${s === 'Waiting' ? 'var(--primary)' : 'var(--bg-card)'}" stroke="var(--primary)" stroke-width="2"/>
        <text x="320" y="208" fill="${s === 'Waiting' ? '#fff' : 'var(--text-main)'}" font-weight="700" text-anchor="middle" font-size="14">Waiting</text>

        <!-- Transition: Running -> Waiting -->
        <path d="M 410 135 C 410 165, 390 190, 370 195" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="440" y="170" fill="var(--text-dim)" font-size="11" text-anchor="middle">I/O Wait</text>

        <!-- Transition: Waiting -> Ready -->
        <path d="M 270 195 C 230 190, 210 165, 215 135" fill="none" stroke="var(--border-light)" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="195" y="175" fill="var(--text-dim)" font-size="11" text-anchor="middle">I/O Done</text>

        <!-- Transition: Running -> Terminated -->
        <path d="M 470 112 L 540 112" stroke="var(--border-light)" stroke-width="2" marker-end="url(#arrow)"/>
        <text x="505" y="105" fill="var(--text-dim)" font-size="11" text-anchor="middle">Exit</text>

        <!-- Terminated State -->
        <rect x="540" y="90" width="120" height="45" rx="22" fill="${s === 'Terminated' ? 'var(--primary)' : 'var(--bg-card)'}" stroke="var(--primary)" stroke-width="2"/>
        <text x="600" y="118" fill="${s === 'Terminated' ? '#fff' : 'var(--text-main)'}" font-weight="700" text-anchor="middle" font-size="14">Terminated</text>
      </svg>
    `;

    if (actionsBar) {
      const possible = this.transitions[this.currentState] || [];
      actionsBar.innerHTML = possible.map(p => `
        <button class="btn btn-primary btn-sm" onclick="W1_StateMachine.trigger('${p.action}')">${p.action}</button>
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
    this.nForks = Math.max(1, Math.min(5, parseInt(val) || 1));
    this.render();
  },
  render() {
    const container = document.getElementById('w2-canvas');
    const stats = document.getElementById('w2-stats');
    if (!container) return;

    const totalProcesses = Math.pow(2, this.nForks);
    const childProcesses = totalProcesses - 1;

    if (stats) {
      stats.innerHTML = `
        <span>Total Processes: <strong>${totalProcesses}</strong> (2<sup>${this.nForks}</sup>)</span> | 
        <span>Unique Child Processes created: <strong>${childProcesses}</strong> (2<sup>${this.nForks}</sup> - 1)</span>
      `;
    }

    const width = 600;
    const height = 60 + this.nForks * 45;
    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; max-width:600px;">`;

    let currentLevel = [{ x: width / 2, y: 30, pid: 'Parent (P0)' }];
    svg += `<circle cx="${width/2}" cy="30" r="14" fill="var(--primary)" />`;
    svg += `<text x="${width/2}" y="34" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">P0</text>`;

    let pCounter = 1;
    for (let level = 1; level <= this.nForks; level++) {
      let nextLevel = [];
      const y = 30 + level * 45;
      const count = Math.pow(2, level);
      const span = width / count;

      for (let i = 0; i < currentLevel.length; i++) {
        const parent = currentLevel[i];
        const leftX = parent.x - (width / Math.pow(2, level + 1));
        const rightX = parent.x + (width / Math.pow(2, level + 1));

        svg += `<line x1="${parent.x}" y1="${parent.y}" x2="${leftX}" y2="${y}" stroke="var(--border-light)" stroke-width="2"/>`;
        svg += `<circle cx="${leftX}" cy="${y}" r="12" fill="var(--bg-card)" stroke="var(--primary)" stroke-width="2"/>`;
        svg += `<text x="${leftX}" y="${y+4}" fill="var(--text-main)" font-size="9" text-anchor="middle">Ret</text>`;

        const childPid = `P${pCounter++}`;
        svg += `<line x1="${parent.x}" y1="${parent.y}" x2="${rightX}" y2="${y}" stroke="var(--primary)" stroke-width="2"/>`;
        svg += `<circle cx="${rightX}" cy="${y}" r="12" fill="var(--p2-col)"/>`;
        svg += `<text x="${rightX}" y="${y+4}" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">${childPid}</text>`;

        nextLevel.push({ x: leftX, y: y, pid: parent.pid });
        nextLevel.push({ x: rightX, y: y, pid: childPid });
      }
      currentLevel = nextLevel;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }
};

// ----------------------------------------------------
// W3: CPU Scheduling Simulator (M3)
// ----------------------------------------------------
const W3_CPUScheduler = {
  algorithm: 'FCFS',
  quantum: 4,
  processes: [
    { id: 'P1', at: 0, bt: 24, p: 3 },
    { id: 'P2', at: 0, bt: 3, p: 1 },
    { id: 'P3', at: 0, bt: 3, p: 4 }
  ],

  loadExample(type) {
    if (type === 'standard') {
      this.algorithm = 'FCFS';
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
    this.calculate();
  },

  syncUI() {
    const sel = document.getElementById('w3-algo');
    const qIn = document.getElementById('w3-quantum');
    if (sel) sel.value = this.algorithm;
    if (qIn) {
      qIn.value = this.quantum;
      qIn.style.display = (this.algorithm === 'RR') ? 'inline-block' : 'none';
    }
  },

  calculate() {
    const algo = this.algorithm;
    const q = parseInt(this.quantum) || 4;
    const procs = JSON.parse(JSON.stringify(this.processes));

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
    });

    if (algo === 'FCFS') {
      procs.sort((a, b) => a.at - b.at);
      procs.forEach(p => {
        if (currentTime < p.at) {
          timeline.push({ proc: 'Idle', start: currentTime, end: p.at });
          currentTime = p.at;
        }
        if (p.rt === -1) p.rt = currentTime - p.at;
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
        available.sort((a, b) => a.bt - b.bt || a.at - b.at);
        let cur = available[0];
        if (cur.rt === -1) cur.rt = currentTime - cur.at;
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
        available.sort((a, b) => a.rem - b.rem || a.at - b.at);
        let cur = available[0];
        if (cur.rt === -1) cur.rt = currentTime - cur.at;

        if (cur.id !== lastProc) {
          if (lastProc) {
            timeline.push({ proc: lastProc, start: lastStart, end: currentTime });
          }
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
        available.sort((a, b) => a.p - b.p || a.at - b.at);
        let cur = available[0];
        if (cur.rt === -1) cur.rt = currentTime - cur.at;
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
        available.sort((a, b) => a.p - b.p || a.at - b.at);
        let cur = available[0];
        if (cur.rt === -1) cur.rt = currentTime - cur.at;

        if (cur.id !== lastProc) {
          if (lastProc) {
            timeline.push({ proc: lastProc, start: lastStart, end: currentTime });
          }
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
      let pList = procs.map(p => p);
      pList.sort((a, b) => a.at - b.at);

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

        if (cur.rt === -1) cur.rt = currentTime - cur.at;
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
    this.renderTable(procs);
  },

  renderGantt(timeline) {
    const container = document.getElementById('w3-gantt');
    if (!container) return;

    if (timeline.length === 0) {
      container.innerHTML = '<p>No timeline generated.</p>';
      return;
    }

    const totalDuration = timeline[timeline.length - 1].end;
    const width = 760;
    const height = 90;
    const scale = width / Math.max(1, totalDuration);

    let svg = `<svg viewBox="0 0 ${width + 40} ${height + 30}" style="width:100%; max-width:800px;">`;

    const getCol = (name) => {
      if (name === 'Idle') return 'var(--bg-input)';
      const idx = parseInt(name.replace('P', '')) || 1;
      const palette = ['#38bdf8', '#f97316', '#10b981', '#a855f7', '#ef4444', '#06b6d4', '#ec4899'];
      return palette[(idx - 1) % palette.length];
    };

    timeline.forEach(block => {
      const x = block.start * scale + 20;
      const w = (block.end - block.start) * scale;
      const col = getCol(block.proc);

      svg += `<rect x="${x}" y="20" width="${w}" height="45" fill="${col}" stroke="var(--border)" stroke-width="1.5" />`;
      if (w > 20) {
        svg += `<text x="${x + w/2}" y="48" fill="#fff" font-weight="bold" font-size="13" text-anchor="middle">${block.proc}</text>`;
      }
      svg += `<text x="${x}" y="80" fill="var(--text-dim)" font-size="11" text-anchor="middle">${block.start}</text>`;
      svg += `<line x1="${x}" y1="65" x2="${x}" y2="70" stroke="var(--text-dim)" stroke-width="1" />`;
    });

    const lastX = totalDuration * scale + 20;
    svg += `<text x="${lastX}" y="80" fill="var(--text-dim)" font-size="11" text-anchor="middle">${totalDuration}</text>`;
    svg += `<line x1="${lastX}" y1="65" x2="${lastX}" y2="70" stroke="var(--text-dim)" stroke-width="1" />`;

    svg += `</svg>`;
    container.innerHTML = svg;
  },

  renderTable(procs) {
    const container = document.getElementById('w3-table-body');
    const summary = document.getElementById('w3-summary');
    if (!container) return;

    let totalTAT = 0;
    let totalWT = 0;
    let totalRT = 0;

    let rows = procs.map(p => {
      totalTAT += p.tat;
      totalWT += p.wt;
      totalRT += p.rt;
      return `
        <tr>
          <td><strong>${p.id}</strong></td>
          <td>${p.at}</td>
          <td>${p.bt}</td>
          <td>${p.p}</td>
          <td><strong>${p.ct}</strong></td>
          <td>${p.tat}</td>
          <td>${p.wt}</td>
          <td>${p.rt}</td>
        </tr>
      `;
    }).join('');

    container.innerHTML = rows;

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
    if (!tableBody) return;

    let cur = this.currentStep > 0 ? this.steps[this.currentStep - 1] : { r1: '-', r2: '-', c: 5, desc: 'Initial state: counter = 5. Click "Next Step" to trace execution.' };

    if (narr) {
      narr.innerHTML = `<strong>Step ${this.currentStep} / ${this.steps.length}:</strong> ${cur.desc} <br>
      <span style="font-weight:700; color:${cur.c !== 5 ? 'var(--danger)' : 'var(--text-main)'}">Current Shared counter = ${cur.c}</span> (Expected without race condition: 5)`;
    }

    tableBody.innerHTML = this.steps.map((st, i) => {
      const isPast = i < this.currentStep;
      const isCurrent = i === this.currentStep - 1;
      return `
        <tr style="${isCurrent ? 'background:var(--primary-glow); font-weight:bold;' : isPast ? 'opacity:0.8;' : 'opacity:0.4;'}">
          <td>${i + 1}</td>
          <td><span class="nav-badge" style="background:${st.actor === 'Producer' ? 'var(--primary-glow)' : 'var(--warning-bg)'}; color:${st.actor === 'Producer' ? 'var(--primary)' : 'var(--warning)'};">${st.actor}</span></td>
          <td><code>${st.code}</code></td>
          <td>${isPast ? st.r1 : '-'}</td>
          <td>${isPast ? st.r2 : '-'}</td>
          <td><strong>${isPast ? st.c : '-'}</strong></td>
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

  produce() {
    const nextIn = (this.inPtr + 1) % this.size;
    const narr = document.getElementById('w6-narr');
    if (nextIn === this.outPtr) {
      if (narr) narr.innerHTML = `<span style="color:var(--danger)">⚠️ Buffer FULL! ( (in+1) % ${this.size} == out ). Producer must wait!</span>`;
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
      if (narr) narr.innerHTML = `<span style="color:var(--warning)">⚠️ Buffer EMPTY! ( in == out ). Consumer must wait!</span>`;
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
    this.buffer = [null, null, null, null, null, null];
    this.inPtr = 0;
    this.outPtr = 0;
    this.itemCounter = 1;
    this.render();
  },

  render() {
    const container = document.getElementById('w6-canvas');
    if (!container) return;

    const count = this.buffer.filter(x => x !== null).length;
    let svg = `<svg viewBox="0 0 460 260" style="width:100%; max-width:460px;">`;

    const cx = 230;
    const cy = 130;
    const r = 90;

    for (let i = 0; i < this.size; i++) {
      const angle = (i * 2 * Math.PI) / this.size - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const item = this.buffer[i];
      const isIn = (this.inPtr === i);
      const isOut = (this.outPtr === i);

      svg += `<circle cx="${x}" cy="${y}" r="26" fill="${item ? 'var(--primary)' : 'var(--bg-card)'}" stroke="var(--border)" stroke-width="2" />`;
      svg += `<text x="${x}" y="${y - 4}" fill="${item ? '#fff' : 'var(--text-muted)'}" font-size="11" font-weight="bold" text-anchor="middle">[${i}]</text>`;
      svg += `<text x="${x}" y="${y + 12}" fill="${item ? '#fff' : 'var(--text-dim)'}" font-size="10" text-anchor="middle">${item ? item.replace('Item ', '#') : 'empty'}</text>`;

      if (isIn) {
        svg += `<text x="${x}" y="${y + 42}" fill="var(--warning)" font-size="11" font-weight="bold" text-anchor="middle">&uarr; IN</text>`;
      }
      if (isOut) {
        svg += `<text x="${x}" y="${y - 34}" fill="var(--success)" font-size="11" font-weight="bold" text-anchor="middle">&darr; OUT</text>`;
      }
    }

    svg += `<circle cx="${cx}" cy="${cy}" r="38" fill="var(--bg-sidebar)" stroke="var(--border)" />`;
    svg += `<text x="${cx}" y="${cy - 4}" fill="var(--text-muted)" font-size="10" text-anchor="middle">Occupied</text>`;
    svg += `<text x="${cx}" y="${cy + 16}" fill="var(--primary)" font-size="16" font-weight="bold" text-anchor="middle">${count} / ${this.size - 1}</text>`;

    svg += `</svg>`;
    container.innerHTML = svg;
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
    { p0Line: 'while(flag[1] && turn==1);', p1Line: 'while(flag[0] && turn==0);', f0: true, f1: true, turn: 0, cs: 'P0 ENTERS CS', desc: 'P0 check: flag[1]==true but turn!=1 (turn is 0) &rarr; P0 enters CS! P1 waits in while loop (turn==0).' },
    { p0Line: 'flag[0] = false;', p1Line: '-', f0: false, f1: true, turn: 0, cs: 'P1 ENTERS CS', desc: 'P0 exits CS and sets flag[0] = false. P1 is now released from while loop and enters CS!' }
  ],

  init() {
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
    if (!tbody) return;

    const cur = this.step > 0 ? this.petersonSteps[this.step - 1] : { p0Line: '-', p1Line: '-', f0: false, f1: false, turn: 0, cs: 'None', desc: 'Initial: flag[0]=false, flag[1]=false, turn=0. Click "Next Step" to trace concurrent execution.' };

    if (narr) {
      narr.innerHTML = `<strong>Step ${this.step} / ${this.petersonSteps.length}:</strong> ${cur.desc} <br>
      Active in Critical Section: <strong style="color:var(--primary); font-size:1.05rem;">${cur.cs}</strong>`;
    }

    tbody.innerHTML = this.petersonSteps.map((st, i) => {
      const isPast = i < this.step;
      const isCurrent = i === this.step - 1;
      return `
        <tr style="${isCurrent ? 'background:var(--primary-glow); font-weight:bold;' : isPast ? 'opacity:0.8;' : 'opacity:0.4;'}">
          <td>${i + 1}</td>
          <td><code>${st.p0Line}</code></td>
          <td><code>${st.p1Line}</code></td>
          <td>${isPast ? (st.f0 ? 'True' : 'False') : '-'}</td>
          <td>${isPast ? (st.f1 ? 'True' : 'False') : '-'}</td>
          <td>${isPast ? st.turn : '-'}</td>
          <td><strong style="color:${st.cs.includes('ENTERS') ? 'var(--success)' : 'var(--text-muted)'}">${isPast ? st.cs : '-'}</strong></td>
        </tr>
      `;
    }).join('');
  }
};

// ----------------------------------------------------
// W8: Semaphore Playground (M6)
// ----------------------------------------------------
const W8_Semaphore = {
  value: 1,
  queue: [],
  procCount: 1,

  wait() {
    const proc = `P${this.procCount++}`;
    this.value--;
    const narr = document.getElementById('w8-narr');
    if (this.value < 0) {
      this.queue.push(proc);
      if (narr) narr.innerHTML = `<code>wait()</code> called by <strong>${proc}</strong>. Value becomes <strong>${this.value}</strong> (&lt; 0) &rarr; <strong>${proc} is BLOCKED</strong> and added to waiting queue!`;
    } else {
      if (narr) narr.innerHTML = `<code>wait()</code> called by <strong>${proc}</strong>. Value becomes <strong>${this.value}</strong> (&ge; 0) &rarr; <strong>${proc} ENTERS critical section</strong>.`;
    }
    this.render();
  },

  signal() {
    const narr = document.getElementById('w8-narr');
    this.value++;
    if (this.value <= 0 && this.queue.length > 0) {
      const unblocked = this.queue.shift();
      if (narr) narr.innerHTML = `<code>signal()</code> called. Value becomes <strong>${this.value}</strong> (&le; 0) &rarr; Process <strong>${unblocked} is WOKEN UP</strong> (removed from queue) to enter CS!`;
    } else {
      if (narr) narr.innerHTML = `<code>signal()</code> called. Value becomes <strong>${this.value}</strong>. Queue is empty; resource is now free.`;
    }
    this.render();
  },

  reset() {
    this.value = 1;
    this.queue = [];
    this.procCount = 1;
    this.render();
  },

  render() {
    const valElem = document.getElementById('w8-val');
    const queueElem = document.getElementById('w8-queue');
    if (valElem) {
      valElem.innerText = this.value;
      valElem.style.color = this.value < 0 ? 'var(--danger)' : this.value === 0 ? 'var(--warning)' : 'var(--success)';
    }
    if (queueElem) {
      if (this.queue.length === 0) {
        queueElem.innerHTML = '<span style="color:var(--text-dim);">[ Empty Queue ]</span>';
      } else {
        queueElem.innerHTML = this.queue.map(p => `
          <span class="nav-badge" style="background:var(--danger-bg); color:var(--danger); font-size:0.85rem; padding:4px 10px; margin-right:6px;">${p} (Blocked)</span>
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

  toggle(i) {
    const narr = document.getElementById('w10-narr');
    if (this.states[i] === 'THINKING') {
      this.states[i] = 'HUNGRY';
      const left = i;
      const right = (i + 1) % 5;
      if (this.chopsticks[left] && this.chopsticks[right]) {
        this.chopsticks[left] = false;
        this.chopsticks[right] = false;
        this.states[i] = 'EATING';
        if (narr) narr.innerHTML = `Philosopher <strong>P${i}</strong> acquired chopsticks ${left} and ${right} &rarr; Now <strong style="color:var(--success)">EATING</strong>!`;
      } else {
        if (narr) narr.innerHTML = `Philosopher <strong>P${i}</strong> is <strong style="color:var(--warning)">HUNGRY</strong> but waiting for chopstick ${!this.chopsticks[left] ? left : right}.`;
      }
    } else if (this.states[i] === 'EATING') {
      this.chopsticks[i] = true;
      this.chopsticks[(i + 1) % 5] = true;
      this.states[i] = 'THINKING';
      if (narr) narr.innerHTML = `Philosopher <strong>P${i}</strong> finished eating and released chopsticks. Now <strong style="color:var(--primary)">THINKING</strong>.`;
    }
    this.render();
  },

  triggerDeadlock() {
    const narr = document.getElementById('w10-narr');
    this.states = ['HUNGRY', 'HUNGRY', 'HUNGRY', 'HUNGRY', 'HUNGRY'];
    this.chopsticks = [false, false, false, false, false];
    if (narr) {
      narr.innerHTML = `
        <strong style="color:var(--danger)">⚠️ DEADLOCK OCCURRED!</strong><br>
        All 5 philosophers picked up their left chopstick simultaneously! Each is waiting for their right chopstick held by their neighbor. Circular wait condition is met!
      `;
    }
    this.render();
  },

  reset() {
    this.states = ['THINKING', 'THINKING', 'THINKING', 'THINKING', 'THINKING'];
    this.chopsticks = [true, true, true, true, true];
    this.render();
  },

  render() {
    const container = document.getElementById('w10-canvas');
    if (!container) return;

    let svg = `<svg viewBox="0 0 400 320" style="width:100%; max-width:400px;">`;
    const cx = 200, cy = 160, r = 90;

    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2" />`;
    svg += `<text x="${cx}" y="${cy}" fill="var(--text-dim)" font-size="12" text-anchor="middle">Dining Table</text>`;

    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = cx + (r + 42) * Math.cos(angle);
      const py = cy + (r + 42) * Math.sin(angle);

      const st = this.states[i];
      const col = st === 'EATING' ? 'var(--success)' : st === 'HUNGRY' ? 'var(--warning)' : 'var(--primary)';

      svg += `<circle cx="${px}" cy="${py}" r="22" fill="${col}" stroke="var(--border)" style="cursor:pointer;" onclick="W10_DiningPhilosophers.toggle(${i})"/>`;
      svg += `<text x="${px}" y="${py + 4}" fill="#fff" font-weight="bold" font-size="11" text-anchor="middle" pointer-events="none">P${i}</text>`;

      const cAngle = angle + (Math.PI / 5);
      const cxPos = cx + (r - 18) * Math.cos(cAngle);
      const cyPos = cy + (r - 18) * Math.sin(cAngle);
      const isFree = this.chopsticks[i];

      svg += `<rect x="${cxPos - 4}" y="${cyPos - 12}" width="8" height="24" rx="4" fill="${isFree ? 'var(--text-muted)' : 'var(--danger)'}" transform="rotate(${(cAngle * 180 / Math.PI) + 90}, ${cxPos}, ${cyPos})"/>`;
      svg += `<text x="${cxPos}" y="${cyPos + 18}" fill="var(--text-dim)" font-size="8" text-anchor="middle">C${i}</text>`;
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

  init() {
    this.runSafety();
  },

  testRequest() {
    const req = [1, 0, 2];
    const pIdx = 1;
    const narr = document.getElementById('w12-narr');

    this.available[0] -= req[0];
    this.available[1] -= req[1];
    this.available[2] -= req[2];

    this.allocation[pIdx][0] += req[0];
    this.allocation[pIdx][1] += req[1];
    this.allocation[pIdx][2] += req[2];

    const res = this.runSafety();
    if (res.safe) {
      if (narr) {
        narr.innerHTML = `
          <strong style="color:var(--success)">✅ Request (1, 0, 2) by P1 can be IMMEDIATELY GRANTED!</strong><br>
          Condition 1: Request (1,0,2) &le; Need (1,2,2) &rarr; OK.<br>
          Condition 2: Request (1,0,2) &le; Available (3,3,2) &rarr; OK.<br>
          After provisional allocation, the system remains in a <strong>SAFE STATE</strong> with safe sequence: &lang; ${res.sequence.join(', ')} &rang;.
        `;
      }
    }
  },

  reset() {
    this.allocation = [
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1],
      [0, 0, 2]
    ];
    this.available = [3, 3, 2];
    this.runSafety();
  },

  runSafety() {
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
              alloc: this.allocation[i],
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
    this.renderTable(need, isSafe, safeSeq, traceSteps);
    return { safe: isSafe, sequence: safeSeq };
  },

  renderTable(need, isSafe, safeSeq, traceSteps) {
    const tbody = document.getElementById('w12-table-body');
    const narr = document.getElementById('w12-narr');
    const traceContainer = document.getElementById('w12-trace');
    if (!tbody) return;

    tbody.innerHTML = this.allocation.map((alloc, i) => `
      <tr>
        <td><strong>P${i}</strong></td>
        <td>${alloc.join(' ')}</td>
        <td>${this.max[i].join(' ')}</td>
        <td><strong style="color:var(--primary);">${need[i].join(' ')}</strong></td>
        <td>${i === 0 ? this.available.join(' ') : ''}</td>
      </tr>
    `).join('');

    if (narr && !narr.innerHTML.includes('Request')) {
      if (isSafe) {
        narr.innerHTML = `
          <strong style="color:var(--success)">System is in a SAFE STATE!</strong> Safe Sequence found: 
          <span style="font-size:1.1rem; font-weight:bold; color:var(--primary);">&lang; ${safeSeq.join(', ')} &rang;</span>
          <br><span style="color:var(--text-muted)">Matches Silberschatz Chapter 8 Banker's Algorithm Example trace!</span>
        `;
      } else {
        narr.innerHTML = `<strong style="color:var(--danger)">⚠️ System is in an UNSAFE STATE! Potential deadlock!</strong>`;
      }
    }

    if (traceContainer) {
      traceContainer.innerHTML = `
        <h4 style="margin:12px 0 6px; font-size:0.95rem;">Step-by-Step Execution Trace:</h4>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Process Checked</th>
                <th>Need &le; Work Test</th>
                <th>Allocation Reclaimed</th>
                <th>New Work = Work + Alloc</th>
                <th>Safe Sequence So Far</th>
              </tr>
            </thead>
            <tbody>
              ${traceSteps.map((st, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${st.proc}</strong></td>
                  <td>[${st.need.join(',')}] &le; [${st.workBefore.join(',')}] &rarr; <span style="color:var(--success); font-weight:bold;">PASS</span></td>
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
  }
};

// ----------------------------------------------------
// W13: Memory Allocation Simulator (M11)
// ----------------------------------------------------
const W13_MemoryAlloc = {
  partitions: [
    { size: 100, free: 100, proc: null },
    { size: 500, free: 500, proc: null },
    { size: 200, free: 200, proc: null },
    { size: 300, free: 300, proc: null },
    { size: 600, free: 600, proc: null }
  ],
  processes: [
    { id: 'P1', size: 212 },
    { id: 'P2', size: 417 },
    { id: 'P3', size: 112 },
    { id: 'P4', size: 426 }
  ],

  run(strategy) {
    this.reset();
    let parts = JSON.parse(JSON.stringify(this.partitions));
    let internalFrag = 0;
    let allocated = 0;
    let rejected = [];

    this.processes.forEach(p => {
      let targetIdx = -1;
      if (strategy === 'first') {
        targetIdx = parts.findIndex(part => part.proc === null && part.size >= p.size);
      } else if (strategy === 'best') {
        let bestDiff = Infinity;
        parts.forEach((part, idx) => {
          if (part.proc === null && part.size >= p.size) {
            let diff = part.size - p.size;
            if (diff < bestDiff) {
              bestDiff = diff;
              targetIdx = idx;
            }
          }
        });
      } else if (strategy === 'worst') {
        let maxDiff = -1;
        parts.forEach((part, idx) => {
          if (part.proc === null && part.size >= p.size) {
            let diff = part.size - p.size;
            if (diff > maxDiff) {
              maxDiff = diff;
              targetIdx = idx;
            }
          }
        });
      }

      if (targetIdx !== -1) {
        parts[targetIdx].proc = p.id;
        parts[targetIdx].pSize = p.size;
        parts[targetIdx].free = parts[targetIdx].size - p.size;
        internalFrag += parts[targetIdx].free;
        allocated++;
      } else {
        rejected.push(p.id);
      }
    });

    this.render(strategy, parts, internalFrag, rejected);
  },

  reset() {
    this.render('none', this.partitions, 0, []);
  },

  render(strat, parts, internalFrag, rejected) {
    const container = document.getElementById('w13-canvas');
    const summary = document.getElementById('w13-summary');
    if (!container) return;

    if (summary) {
      summary.innerHTML = `
        Strategy: <strong style="color:var(--primary);">${strat.toUpperCase()} FIT</strong> | 
        Total Internal Fragmentation: <strong style="color:var(--warning);">${internalFrag} KB</strong> | 
        Unallocated Processes: <strong style="color:${rejected.length > 0 ? 'var(--danger)' : 'var(--success)'};">${rejected.length > 0 ? rejected.join(', ') : 'None (All allocated)'}</strong>
      `;
    }

    let html = `<div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:600px;">`;
    parts.forEach((part, idx) => {
      const isOccupied = part.proc !== null;
      html += `
        <div style="border:1px solid var(--border); border-radius:6px; overflow:hidden; background:var(--bg-body);">
          <div style="display:flex; justify-content:space-between; padding:4px 8px; font-size:0.8rem; background:var(--bg-card); color:var(--text-dim);">
            <span>Partition #${idx + 1} (${part.size} KB)</span>
            <span>${isOccupied ? `Occupied by ${part.proc} (${part.pSize} KB) | Waste: ${part.free} KB` : 'FREE HOLE'}</span>
          </div>
          <div style="display:flex; height:32px; width:100%;">
            ${isOccupied ? `
              <div style="width:${(part.pSize / part.size) * 100}%; background:var(--primary); display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.85rem; font-weight:bold;">
                ${part.proc}
              </div>
              <div style="width:${(part.free / part.size) * 100}%; background:var(--warning-bg); border-left:1px dashed var(--warning); display:flex; align-items:center; justify-content:center; color:var(--warning); font-size:0.75rem;">
                ${part.free > 0 ? `Waste: ${part.free}K` : ''}
              </div>
            ` : `
              <div style="width:100%; background:var(--bg-input); display:flex; align-items:center; justify-content:center; color:var(--text-dim); font-size:0.85rem;">
                Free (${part.size} KB)
              </div>
            `}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }
};

// ----------------------------------------------------
// W14: Paging Address Translator (M12)
// ----------------------------------------------------
const W14_PagingTranslator = {
  pageSize: 1024,
  pageTable: { 0: 5, 1: 6, 2: 1, 3: 2, 4: 8, 41: 7, 210: 12 },

  translate() {
    const inputLA = document.getElementById('w14-la');
    const inputPS = document.getElementById('w14-ps');
    const outP = document.getElementById('w14-p');
    const outD = document.getElementById('w14-d');
    const outFrame = document.getElementById('w14-frame');
    const outPA = document.getElementById('w14-pa');
    const narr = document.getElementById('w14-narr');

    const la = parseInt(inputLA ? inputLA.value : 3085) || 0;
    const ps = parseInt(inputPS ? inputPS.value : 1024) || 1024;

    const p = Math.floor(la / ps);
    const d = la % ps;
    const f = this.pageTable[p] !== undefined ? this.pageTable[p] : 2;
    const pa = f * ps + d;

    if (outP) outP.innerText = p;
    if (outD) outD.innerText = d;
    if (outFrame) outFrame.innerText = f;
    if (outPA) outPA.innerText = pa;

    if (narr) {
      narr.innerHTML = `
        <strong>Step 1:</strong> Page Number <code>p = &lfloor;${la} / ${ps}&rfloor; = ${p}</code><br>
        <strong>Step 2:</strong> Offset <code>d = ${la} mod ${ps} = ${d}</code><br>
        <strong>Step 3:</strong> Page Table Lookup: Page <code>${p}</code> is mapped to Frame <code>${f}</code><br>
        <strong>Step 4:</strong> Physical Address <code>PA = (Frame &times; Page Size) + Offset = (${f} &times; ${ps}) + ${d} = ${pa}</code>
      `;
    }
  }
};

// ----------------------------------------------------
// W15: Page Replacement Simulator (M13)
// ----------------------------------------------------
const W15_PageReplacement = {
  refString: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1],
  nFrames: 3,

  run(algo) {
    const refs = this.refString;
    const framesCount = this.nFrames;
    let frames = [];
    let faults = 0;
    let hits = 0;
    let history = [];

    if (algo === 'FIFO') {
      let queue = [];
      refs.forEach(val => {
        let isHit = frames.includes(val);
        if (isHit) {
          hits++;
          history.push({ ref: val, frames: [...frames], fault: false });
        } else {
          faults++;
          if (frames.length < framesCount) {
            frames.push(val);
            queue.push(val);
          } else {
            let victim = queue.shift();
            let idx = frames.indexOf(victim);
            frames[idx] = val;
            queue.push(val);
          }
          history.push({ ref: val, frames: [...frames], fault: true });
        }
      });
    } else if (algo === 'LRU') {
      let lastUsed = new Map();
      refs.forEach((val, time) => {
        let isHit = frames.includes(val);
        if (isHit) {
          hits++;
          lastUsed.set(val, time);
          history.push({ ref: val, frames: [...frames], fault: false });
        } else {
          faults++;
          if (frames.length < framesCount) {
            frames.push(val);
          } else {
            let victim = frames[0];
            let minTime = lastUsed.get(victim);
            frames.forEach(f => {
              if (lastUsed.get(f) < minTime) {
                minTime = lastUsed.get(f);
                victim = f;
              }
            });
            let idx = frames.indexOf(victim);
            frames[idx] = val;
          }
          lastUsed.set(val, time);
          history.push({ ref: val, frames: [...frames], fault: true });
        }
      });
    } else if (algo === 'OPT') {
      refs.forEach((val, idx) => {
        let isHit = frames.includes(val);
        if (isHit) {
          hits++;
          history.push({ ref: val, frames: [...frames], fault: false });
        } else {
          faults++;
          if (frames.length < framesCount) {
            frames.push(val);
          } else {
            let victim = frames[0];
            let furthest = -1;
            frames.forEach(f => {
              let nextUse = refs.slice(idx + 1).indexOf(f);
              if (nextUse === -1) {
                victim = f;
                furthest = Infinity;
              } else if (nextUse > furthest && furthest !== Infinity) {
                furthest = nextUse;
                victim = f;
              }
            });
            let vIdx = frames.indexOf(victim);
            frames[vIdx] = val;
          }
          history.push({ ref: val, frames: [...frames], fault: true });
        }
      });
    }

    this.render(algo, history, faults, hits);
  },

  render(algo, history, faults, hits) {
    const container = document.getElementById('w15-grid');
    const summary = document.getElementById('w15-summary');
    if (!container) return;

    if (summary) {
      summary.innerHTML = `
        <span style="font-size:1.1rem; font-weight:bold; color:var(--primary);">${algo} Algorithm:</span>
        Total Page Faults = <strong style="color:var(--danger); font-size:1.15rem;">${faults}</strong> | 
        Total Hits = <strong style="color:var(--success); font-size:1.15rem;">${hits}</strong> | 
        Fault Rate = <strong>${((faults / this.refString.length) * 100).toFixed(1)}%</strong>
        <span style="color:var(--text-muted); font-size:0.85rem; margin-left:10px;">(Slide 18: FIFO=15, OPT=9, LRU=12)</span>
      `;
    }

    let html = `<div style="display:flex; gap:4px; overflow-x:auto; padding-bottom:12px;">`;
    history.forEach(h => {
      html += `
        <div style="display:flex; flex-direction:column; align-items:center; min-width:32px;">
          <div style="font-weight:bold; color:var(--primary); margin-bottom:4px; font-size:0.9rem;">${h.ref}</div>
          <div style="border:1px solid var(--border); border-radius:4px; width:100%; display:flex; flex-direction:column; background:var(--bg-card);">
            ${[0, 1, 2].map(row => `
              <div style="height:28px; display:flex; align-items:center; justify-content:center; border-bottom:${row < 2 ? '1px solid var(--border)' : 'none'}; font-size:0.85rem; font-weight:${h.frames[row] === h.ref ? 'bold' : 'normal'}; color:${h.frames[row] === h.ref ? 'var(--primary)' : 'var(--text-main)'};">
                ${h.frames[row] !== undefined ? h.frames[row] : '-'}
              </div>
            `).join('')}
          </div>
          <div style="margin-top:6px; font-size:0.75rem; font-weight:bold; color:${h.fault ? 'var(--danger)' : 'var(--success)'};">
            ${h.fault ? 'F' : 'H'}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;
  }
};

// ----------------------------------------------------
// W16: Disk Scheduling Visualizer (M14)
// ----------------------------------------------------
const W16_DiskScheduling = {
  queue: [98, 183, 37, 122, 14, 124, 65, 67],
  head: 53,
  cylinders: 200,
  direction: 'down', // 'down' or 'up'

  loadReviewQueueExample() {
    this.queue = [130, 1750, 1022, 1509, 948, 1774, 913, 1470, 86];
    this.head = 143;
    this.cylinders = 5000;
    this.direction = 'up';
    this.run('FCFS');
  },

  loadStandardExample() {
    this.queue = [98, 183, 37, 122, 14, 124, 65, 67];
    this.head = 53;
    this.cylinders = 200;
    this.direction = 'down';
    this.run('FCFS');
  },

  run(algo) {
    const q = [...this.queue];
    const startHead = this.head;
    const maxCyl = this.cylinders - 1;
    let sequence = [startHead];
    let totalSeek = 0;

    let left = q.filter(x => x < startHead).sort((a, b) => b - a); // descending
    let right = q.filter(x => x >= startHead).sort((a, b) => a - b); // ascending

    if (algo === 'FCFS') {
      sequence.push(...q);
    } else if (algo === 'SSTF') {
      let pending = [...q];
      let cur = startHead;
      while (pending.length > 0) {
        pending.sort((a, b) => Math.abs(a - cur) - Math.abs(b - cur));
        cur = pending.shift();
        sequence.push(cur);
      }
    } else if (algo === 'SCAN') {
      if (this.direction === 'down') {
        sequence.push(...left);
        if (left.length > 0 && right.length > 0) sequence.push(0);
        sequence.push(...right);
      } else {
        sequence.push(...right);
        if (right.length > 0 && left.length > 0) sequence.push(maxCyl);
        sequence.push(...left);
      }
    } else if (algo === 'C-SCAN') {
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
          sequence.push(...left);
        }
      }
    } else if (algo === 'LOOK') {
      if (this.direction === 'down') {
        sequence.push(...left);
        sequence.push(...right);
      } else {
        sequence.push(...right);
        sequence.push(...left);
      }
    } else if (algo === 'C-LOOK') {
      if (this.direction === 'down') {
        sequence.push(...left);
        right.sort((a, b) => b - a);
        sequence.push(...right);
      } else {
        sequence.push(...right);
        sequence.push(...left);
      }
    }

    for (let i = 1; i < sequence.length; i++) {
      totalSeek += Math.abs(sequence[i] - sequence[i - 1]);
    }

    this.render(algo, sequence, totalSeek);
  },

  render(algo, seq, totalSeek) {
    const container = document.getElementById('w16-canvas');
    const summary = document.getElementById('w16-summary');
    if (!container) return;

    if (summary) {
      summary.innerHTML = `
        Algorithm: <strong style="color:var(--primary);">${algo}</strong> | 
        Initial Direction: <strong style="color:var(--text-main);">${this.direction.toUpperCase()}</strong> | 
        Total Head Movement (Seek Time): <strong style="color:var(--warning); font-size:1.2rem;">${totalSeek} cylinders</strong><br>
        <span style="font-size:0.85rem; color:var(--text-muted);">Servicing Order: ${seq.join(' &rarr; ')}</span>
      `;
    }

    const width = 640;
    const height = 240;
    const scaleX = (width - 60) / this.cylinders;
    const scaleY = (height - 40) / seq.length;

    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; max-width:640px;">`;
    svg += `<line x1="30" y1="20" x2="${width - 30}" y2="20" stroke="var(--border)" stroke-width="2" />`;
    svg += `<text x="30" y="14" fill="var(--text-dim)" font-size="10" text-anchor="middle">0</text>`;
    svg += `<text x="${width - 30}" y="14" fill="var(--text-dim)" font-size="10" text-anchor="middle">${this.cylinders - 1}</text>`;

    let points = seq.map((cyl, idx) => {
      const x = 30 + cyl * scaleX;
      const y = 30 + idx * scaleY;
      return `${x},${y}`;
    }).join(' ');

    svg += `<polyline points="${points}" fill="none" stroke="var(--primary)" stroke-width="2" />`;

    seq.forEach((cyl, idx) => {
      const x = 30 + cyl * scaleX;
      const y = 30 + idx * scaleY;
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="${idx === 0 ? 'var(--warning)' : 'var(--primary)'}" />`;
      if (idx === 0) {
        svg += `<text x="${x + 8}" y="${y + 4}" fill="var(--warning)" font-size="10" font-weight="bold">Start (${cyl})</text>`;
      }
    });

    svg += `</svg>`;
    container.innerHTML = svg;
  }
};
"""
