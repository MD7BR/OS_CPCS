# build_src/modules_m1_m5.py

M1_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M1</span>
  <h1 class="module-title">Introduction to Operating Systems & OS Structures</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 02-Introduction To OS (118 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapters 1 & 2 (§1.1–§1.5, §1.10, §2.1–§2.8)</div>
    <div class="meta-chip">🎯 Exam Priority: HIGH (Mock Midterm Q1, Q2)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Understand the dual views of an operating system: User View vs. System View (Resource Allocator & Control Program).</li>
    <li>Master the Computer-System Organization: Interrupts, Interrupt Vector, and Direct Memory Access (DMA).</li>
    <li>Distinguish clearly between <strong>Multiprogramming</strong> and <strong>Multitasking (Time-Sharing)</strong>.</li>
    <li>Explain <strong>Dual-Mode Operation</strong> (User Mode vs. Kernel Mode) and trace the mode bit transition during a system call.</li>
    <li>Identify OS services, system call categories, and system structure architectures (Monolithic, Layered, Microkernel).</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. What is an Operating System? (User View vs. System View)</h2>
  <p>An operating system is a software program that acts as an intermediary between the user of a computer and the computer hardware. The goals of an OS are to: (1) execute user programs and solve problems easily, (2) make the computer convenient to use, and (3) utilize the computer hardware efficiently.</p>
  
  <div class="callout callout-definition">
    <div class="callout-title">📜 Book Definition (Silberschatz §1.1)</div>
    "An operating system is a program that manages a computer's hardware. It also provides a basis for application programs and acts as an intermediary between the computer user and the computer hardware."
  </div>

  <div class="figure-container">
    <svg viewBox="0 0 600 220" style="width:100%; max-width:550px;">
      <rect x="50" y="20" width="500" height="35" rx="6" fill="var(--p1-col)" />
      <text x="300" y="42" fill="#fff" font-weight="bold" font-size="14" text-anchor="middle">Users (Users, Machines, Other Computers)</text>
      
      <rect x="50" y="70" width="500" height="35" rx="6" fill="var(--p2-col)" />
      <text x="300" y="92" fill="#fff" font-weight="bold" font-size="14" text-anchor="middle">Application Programs (Compilers, Web Browsers, Databases)</text>
      
      <rect x="50" y="120" width="500" height="35" rx="6" fill="var(--primary)" />
      <text x="300" y="142" fill="#fff" font-weight="bold" font-size="14" text-anchor="middle">Operating System (Kernel & System Programs)</text>
      
      <rect x="50" y="170" width="500" height="35" rx="6" fill="var(--p4-col)" />
      <text x="300" y="192" fill="#fff" font-weight="bold" font-size="14" text-anchor="middle">Computer Hardware (CPU, Main Memory, I/O Devices)</text>
    </svg>
    <div class="figure-caption">Figure M1.1 — Abstract View of the Components of a Computer System (Silberschatz Fig. 1.1)</div>
  </div>

  <p><strong>Two Core Perspectives:</strong></p>
  <ul style="padding-left:20px; margin-bottom:14px;">
    <li><strong>User View:</strong> Focuses on convenience, ease of use, and good performance for single-user systems (PCs), resource utilization for mainframes/servers, or battery life for mobile devices.</li>
    <li><strong>System View:</strong> The OS acts as a <em>Resource Allocator</em> (managing CPU time, memory space, file storage, and I/O devices fairly and efficiently) and a <em>Control Program</em> (controlling the execution of programs to prevent errors and improper use).</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">2. Multiprogramming vs. Multitasking (Time-Sharing)</h2>
  
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ High-Yield Exam Question (Mock Midterm Q1.A & Midterm Quick Guide)</div>
    A common OS exam question asks: <em>"Give two differences between Multiprogramming and Multitasking."</em>
  </div>

  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Multiprogramming (Batch)</th>
          <th>Multitasking / Time-Sharing (Interactive)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Primary Goal</strong></td>
          <td>Maximize <strong>CPU utilization</strong> (keep the CPU busy at all times).</td>
          <td>Minimize <strong>response time</strong> (&lt; 1 sec) for interactive human users.</td>
        </tr>
        <tr>
          <td><strong>Switching Trigger</strong></td>
          <td>CPU switches to another job <strong>only when the current job must wait</strong> (e.g. for an I/O operation).</td>
          <td>CPU switches <strong>very rapidly based on a fixed timer quantum</strong> (time slice), even if no I/O is requested.</td>
        </tr>
        <tr>
          <td><strong>User Interaction</strong></td>
          <td>Non-interactive; batch processing where jobs run to completion or wait.</td>
          <td>Highly interactive; user can provide input and receive instant feedback while program executes.</td>
        </tr>
        <tr>
          <td><strong>Required Mechanism</strong></td>
          <td>Job scheduling, memory management for multiple resident jobs.</td>
          <td>CPU scheduling (preemptive), memory swapping, and virtual memory.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">3. Dual-Mode Operation & System Call Transition</h2>
  <p>To prevent user programs from interfering with the proper operation of the system, hardware provides at least two separate modes of execution: <strong>User Mode</strong> and <strong>Kernel Mode</strong> (also called Supervisor Mode, System Mode, or Privileged Mode). A hardware <strong>mode bit</strong> (0 = Kernel, 1 = User) is maintained by the CPU status register.</p>

  <div class="figure-container">
    <svg viewBox="0 0 650 240" style="width:100%; max-width:650px;">
      <defs>
        <marker id="arr2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
        </marker>
      </defs>

      <!-- User Space -->
      <rect x="30" y="20" width="590" height="90" rx="8" fill="var(--bg-card)" stroke="var(--border)" stroke-dasharray="4 4"/>
      <text x="50" y="45" fill="var(--primary)" font-weight="bold" font-size="13">User Process (User Mode: Mode Bit = 1)</text>
      
      <rect x="80" y="55" width="160" height="35" rx="4" fill="var(--bg-input)" stroke="var(--border)"/>
      <text x="160" y="77" fill="var(--text-main)" font-size="11" text-anchor="middle">User process executing</text>

      <rect x="400" y="55" width="180" height="35" rx="4" fill="var(--bg-input)" stroke="var(--border)"/>
      <text x="490" y="77" fill="var(--text-main)" font-size="11" text-anchor="middle">Resumes user code</text>

      <!-- Kernel Space -->
      <rect x="30" y="135" width="590" height="85" rx="8" fill="var(--bg-sidebar)" stroke="var(--primary)"/>
      <text x="50" y="155" fill="var(--success)" font-weight="bold" font-size="13">Kernel (Kernel Mode: Mode Bit = 0)</text>

      <rect x="220" y="165" width="220" height="40" rx="4" fill="var(--primary)" />
      <text x="330" y="189" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Execute System Call Service</text>

      <!-- Arrows -->
      <path d="M 240 72 L 310 72 C 320 72, 330 110, 330 160" fill="none" stroke="var(--warning)" stroke-width="2" marker-end="url(#arr2)"/>
      <text x="345" y="115" fill="var(--warning)" font-size="11" font-weight="bold">trap (call sys_call)</text>
      <text x="345" y="130" fill="var(--text-dim)" font-size="10">Set mode bit = 0</text>

      <path d="M 370 165 C 370 120, 380 72, 400 72" fill="none" stroke="var(--success)" stroke-width="2" marker-end="url(#arr2)"/>
      <text x="420" y="115" fill="var(--success)" font-size="11" font-weight="bold">return from call</text>
      <text x="420" y="130" fill="var(--text-dim)" font-size="10">Reset mode bit = 1</text>
    </svg>
    <div class="figure-caption">Figure M1.2 — Transition from User to Kernel Mode (Silberschatz Fig. 1.10 / Mock Midterm Q2.A)</div>
  </div>

  <div class="callout callout-definition">
    <div class="callout-title">Privileged Instructions</div>
    Instructions that can only be executed when the hardware is in <strong>Kernel Mode</strong>. Examples: modifying the base/limit memory registers, turning off interrupts, modifying the timer register, and performing direct I/O access. If a user process attempts to execute a privileged instruction in User Mode, the CPU treats it as illegal and traps to the OS.
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">4. Direct Memory Access (DMA) & Storage Hierarchy</h2>
  <p>For high-speed I/O devices (e.g. disk drives, gigabit Ethernet), having the CPU transfer every single byte generates massive interrupt overhead. <strong>Direct Memory Access (DMA)</strong> solves this: the device controller transfers an entire block of data directly to/from main memory without CPU intervention. The CPU is interrupted <em>only once per block</em> rather than once per byte.</p>
</div>

<!-- Flashcards M1 -->
<div class="section-block">
  <h2 class="section-title">🃏 Flashcards — Module M1</h2>
  <div class="flashcards-container">
    <div class="flashcard" id="fc-card-m1" onclick="Flashcards.flip(this)">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="flashcard-badge">Module 1 &bull; Flashcard</div>
          <div class="flashcard-text fc-q">What is the difference between Multiprogramming and Multitasking?</div>
          <div style="margin-top:14px; font-size:0.8rem; color:var(--text-dim);">(Click to flip)</div>
        </div>
        <div class="flashcard-back">
          <div class="flashcard-badge">Answer</div>
          <div class="flashcard-text fc-a" style="font-size:0.95rem;">
            Multiprogramming maximizes CPU utilization by switching jobs only when I/O waits.<br>
            Multitasking switches CPU rapidly based on a timer quantum to minimize user response time (&lt; 1s).
          </div>
        </div>
      </div>
    </div>
    <div class="flashcard-nav">
      <button class="btn btn-sm" onclick="Flashcards.prev('m1', M1_CARDS)">&larr; Previous</button>
      <span id="fc-count-m1" style="font-size:0.85rem; color:var(--text-muted);">Card 1 of 4</span>
      <button class="btn btn-sm" onclick="Flashcards.next('m1', M1_CARDS)">Next &rarr;</button>
    </div>
  </div>
</div>

<!-- Self Quiz M1 -->
<div class="section-block">
  <h2 class="section-title">📝 Self-Quiz — Module M1</h2>
  <div class="quiz-container">
    <div class="quiz-card">
      <div class="quiz-question">1. When a user program makes a system call to read a file, what happens to the CPU mode bit?</div>
      <div class="quiz-options">
        <button class="quiz-opt" data-correct="false" onclick="Quiz.selectOption(this, false, 'The mode bit starts at 1 in user mode.')">The mode bit changes from 0 to 1.</button>
        <button class="quiz-opt" data-correct="true" onclick="Quiz.selectOption(this, true, 'Correct! User mode is 1, and kernel mode is 0. A system call generates a trap which switches the mode bit to 0.')">The mode bit changes from 1 to 0 (Kernel Mode).</button>
        <button class="quiz-opt" data-correct="false" onclick="Quiz.selectOption(this, false, 'The mode bit must change to allow the kernel to execute privileged instructions.')">The mode bit remains unchanged at 1.</button>
      </div>
      <div class="quiz-feedback"></div>
    </div>
  </div>
</div>

<!-- Checklist M1 -->
<div class="section-block">
  <h2 class="section-title">✅ Module M1 Checklist</h2>
  <label class="checklist-item">
    <input type="checkbox" class="checklist-checkbox" data-check-id="m1_1" onchange="App.toggleChecklist('m1_1')">
    <span>I can explain the difference between Multiprogramming and Multitasking without notes.</span>
  </label>
  <label class="checklist-item">
    <input type="checkbox" class="checklist-checkbox" data-check-id="m1_2" onchange="App.toggleChecklist('m1_2')">
    <span>I can draw and label the 6 parts of the User &rarr; Kernel Mode transition diagram (Mock Midterm Q2.A).</span>
  </label>
  <label class="checklist-item">
    <input type="checkbox" class="checklist-checkbox" data-check-id="m1_3" onchange="App.toggleChecklist('m1_3')">
    <span>I understand how DMA reduces CPU interrupt frequency from per-byte to per-block.</span>
  </label>
</div>
"""

M2_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M2</span>
  <h1 class="module-title">Processes & Threads</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 03-ProcessThreads (116 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapters 3 & 4 (§3.1–§3.6, §4.1–§4.3)</div>
    <div class="meta-chip">🎯 Exam Priority: HIGH (Mock Midterm Q1.B, Q2.B, Q2.C)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Distinguish between a passive <strong>Program</strong> and an active <strong>Process</strong>.</li>
    <li>Master the <strong>5-State Process Model</strong> and trace state transitions interactively.</li>
    <li>Inspect the structure of the <strong>Process Control Block (PCB)</strong>.</li>
    <li>Understand process creation via <code>fork()</code> and trace binary tree process expansion.</li>
    <li>Compare <strong>Shared Memory</strong> vs. <strong>Message Passing</strong> IPC models.</li>
    <li>Differentiate between <strong>Concurrency vs. Parallelism</strong> and <strong>Data vs. Task Parallelism</strong>.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. The Process Concept & Process in Memory</h2>
  <p>A <strong>program</strong> is a passive entity (such as an executable file stored on disk, e.g. <code>a.out</code>). A <strong>process</strong> is an active entity—a program in execution with a program counter specifying the next instruction to execute and a set of associated resources.</p>
  
  <div class="figure-container">
    <svg viewBox="0 0 320 280" style="width:100%; max-width:300px;">
      <rect x="60" y="20" width="200" height="240" fill="var(--bg-card)" stroke="var(--border)" rx="6"/>
      <!-- Stack -->
      <rect x="70" y="30" width="180" height="40" fill="var(--p1-col)" rx="4"/>
      <text x="160" y="55" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Stack (local vars, returns)</text>
      <!-- Arrow down -->
      <text x="160" y="85" fill="var(--text-dim)" font-size="10" text-anchor="middle">&darr; grows downward</text>
      <!-- Arrow up -->
      <text x="160" y="125" fill="var(--text-dim)" font-size="10" text-anchor="middle">&uarr; grows upward</text>
      <!-- Heap -->
      <rect x="70" y="135" width="180" height="35" fill="var(--p2-col)" rx="4"/>
      <text x="160" y="157" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Heap (dynamically allocated)</text>
      <!-- Data -->
      <rect x="70" y="175" width="180" height="35" fill="var(--p3-col)" rx="4"/>
      <text x="160" y="197" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Data (global & static vars)</text>
      <!-- Text -->
      <rect x="70" y="215" width="180" height="35" fill="var(--primary)" rx="4"/>
      <text x="160" y="237" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">Text (program code)</text>
    </svg>
    <div class="figure-caption">Figure M2.1 — Layout of a Process in Memory (Silberschatz Fig. 3.1)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Interactive Process State Machine (Widget W1)</h2>
  <p>As a process executes, it changes state according to the classic 5-state lifecycle:</p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W1: Interactive Process State Machine</div>
      <div class="sim-controls" id="w1-actions"></div>
    </div>
    <div class="sim-body">
      <div class="sim-canvas" id="w1-canvas"></div>
      <div class="sim-narration" id="w1-narr">Current state: <strong>New</strong>. Click an available action button above to transition the process.</div>
    </div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">3. Process Creation: fork() Visualizer (Widget W2)</h2>
  <p>In UNIX systems, a new process is created by the <code>fork()</code> system call. The new child process is an exact copy of the address space of the parent process. It returns <strong>0</strong> to the child process and the <strong>PID of the child</strong> to the parent process.</p>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Standard Exam Formula</div>
    If a program executes <code>n</code> consecutive <code>fork()</code> calls:
    <ul>
      <li>Total processes created = <strong>2<sup>n</sup></strong></li>
      <li>Unique child processes created = <strong>2<sup>n</sup> - 1</strong></li>
    </ul>
  </div>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W2: fork() Tree Visualizer</div>
      <div class="sim-controls">
        <label style="font-size:0.85rem;">Number of fork() calls (n): </label>
        <input type="number" id="w2-n" value="3" min="1" max="4" style="width:50px; padding:4px;" onchange="W2_ForkVisualizer.update(this.value)">
      </div>
    </div>
    <div class="sim-body">
      <div id="w2-stats" style="margin-bottom:12px; font-size:0.9rem; color:var(--primary);"></div>
      <div class="sim-canvas" id="w2-canvas"></div>
    </div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">4. Interprocess Communication (IPC): Shared Memory vs. Message Passing</h2>
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Mock Midterm Q1.B Question</div>
    <em>"Give two differences between Shared Memory and Message Passing."</em>
  </div>

  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Criterion</th>
          <th>Shared Memory</th>
          <th>Message Passing</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Communication Mechanism</strong></td>
          <td>A region of shared memory is established; processes exchange data by reading/writing directly to this shared address space.</td>
          <td>Messages are exchanged using system calls: <code>send(message)</code> and <code>receive(message)</code>.</td>
        </tr>
        <tr>
          <td><strong>Speed / Performance</strong></td>
          <td><strong>Faster</strong> (runs at memory speed; once established, no kernel intervention or system calls needed).</td>
          <td><strong>Slower</strong> (requires kernel intervention via system calls and message copying overhead).</td>
        </tr>
        <tr>
          <td><strong>Hardware Environment</strong></td>
          <td>Best suited for shared-memory multi-core local machines; difficult on distributed clusters.</td>
          <td>Easily extends across networks and distributed systems (cluster architectures).</td>
        </tr>
        <tr>
          <td><strong>Synchronization</strong></td>
          <td>Must be explicitly handled by the application programmer (semaphores, mutexes) to avoid race conditions.</td>
          <td>Synchronization is handled naturally by the communication primitives (blocking/non-blocking send/receive).</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">5. Data Parallelism vs. Task Parallelism</h2>
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Mock Midterm Q2.B & Q2.C</div>
    <em>"A program adds 5 to every element of an array of 1,000 numbers split across 4 cores. Which type of parallelism is this?"</em><br>
    <strong>Answer: Data Parallelism</strong>, because the <em>same operation</em> (adding 5) is performed across <em>different subsets</em> of identical data.
  </div>
  <p><strong>Two Types of Parallelism:</strong></p>
  <ul style="padding-left:20px;">
    <li><strong>Data Parallelism:</strong> Distributes subsets of the same data across multiple cores, performing the identical operation on each core.</li>
    <li><strong>Task Parallelism:</strong> Distributes unique tasks (distinct functions/threads) across cores, each operating on same or different data.</li>
  </ul>
</div>
"""

M3_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M3</span>
  <h1 class="module-title">CPU Scheduling Algorithms</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 04-FCFS, 05-SJF, 06-SRTF, 07-Priority, 08-RR-MLQs (621 slides total)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 5 (§5.1–§5.3)</div>
    <div class="meta-chip">🎯 Exam Priority: TOP (Mock Midterm Q6, 8 points!)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Master the formulas: <code>TAT = CT - AT</code> and <code>WT = TAT - BT</code>.</li>
    <li>Draw accurate Gantt charts for <strong>FCFS, SJF, SRTF, Priority (Preemptive & Non-Preemptive), and Round Robin</strong>.</li>
    <li>Solve complete scheduling tables matching standard CPCS-361 practice exam layouts.</li>
    <li>Understand the <strong>Convoy Effect</strong> in FCFS and <strong>Starvation/Aging</strong> in Priority scheduling.</li>
    <li>Explore how time quantum <code>q</code> affects context switching and turnaround times in Round Robin.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Scheduling Criteria & Essential Formulas</h2>
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Formulas You MUST Write in Scheduling Exams (Practice Midterm Q6)</div>
    <ul>
      <li><strong>Turnaround Time (TAT)</strong>: <code>TAT = Completion Time (CT) - Arrival Time (AT)</code></li>
      <li><strong>Waiting Time (WT)</strong>: <code>WT = Turnaround Time (TAT) - Burst Time (BT)</code></li>
      <li><strong>Response Time (RT)</strong>: Time from process arrival until its first CPU allocation.</li>
    </ul>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Master CPU Scheduling Simulator (Widget W3)</h2>
  <p>Test and simulate any scheduling algorithm with automatic Ready Queue tracking, Gantt Chart generation, and complete metric calculation:</p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W3: CPU Scheduling Simulator</div>
      <div class="sim-controls">
        <select id="w3-algo" class="btn btn-sm" onchange="W3_CPUScheduler.algorithm = this.value; W3_CPUScheduler.syncUI(); W3_CPUScheduler.calculate();">
          <option value="FCFS">FCFS (First-Come First-Served)</option>
          <option value="SJF">SJF (Shortest Job First - Non-Preemptive)</option>
          <option value="SRTF">SRTF (Shortest Remaining Time First - Preemptive)</option>
          <option value="Priority-NonPre">Priority (Non-Preemptive)</option>
          <option value="Priority-Pre">Priority (Preemptive)</option>
          <option value="RR">Round Robin (RR)</option>
        </select>
        <input type="number" id="w3-quantum" value="4" min="1" max="20" style="width:60px; padding:4px; display:none;" title="Time Quantum" onchange="W3_CPUScheduler.quantum = this.value; W3_CPUScheduler.calculate();">
        <button class="btn btn-sm" onclick="W3_CPUScheduler.loadExample('standard')">Load Slide FCFS</button>
        <button class="btn btn-sm" onclick="W3_CPUScheduler.loadExample('srtf')">Load Slide SRTF</button>
        <button class="btn btn-sm" onclick="W3_CPUScheduler.loadExample('priority')">Load Slide Priority</button>
        <button class="btn btn-sm" onclick="W3_CPUScheduler.loadExample('rr')">Load Slide RR (q=4)</button>
      </div>
    </div>
    <div class="sim-body">
      <h4 style="margin-bottom:8px; font-size:0.95rem;">Gantt Chart Timeline:</h4>
      <div class="sim-canvas" id="w3-gantt" style="min-height:100px;"></div>

      <h4 style="margin:16px 0 8px; font-size:0.95rem;">Execution Results Table:</h4>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival Time (AT)</th>
              <th>Burst Time (BT)</th>
              <th>Priority (P)</th>
              <th>Completion Time (CT)</th>
              <th>Turnaround Time (TAT)</th>
              <th>Waiting Time (WT)</th>
              <th>Response Time (RT)</th>
            </tr>
          </thead>
          <tbody id="w3-table-body"></tbody>
        </table>
      </div>

      <div id="w3-summary" style="margin-top:12px; padding:12px; background:var(--bg-body); border-radius:6px; border:1px solid var(--border);"></div>
    </div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">3. Slide Worked Example: Round Robin (Time Quantum = 4)</h2>
  <p>Consider the classic slide example with 3 processes arriving at time 0:</p>
  <ul style="padding-left:20px; margin-bottom:12px;">
    <li><strong>P1:</strong> AT = 0, BT = 24</li>
    <li><strong>P2:</strong> AT = 0, BT = 3</li>
    <li><strong>P3:</strong> AT = 0, BT = 3</li>
  </ul>
  <p><strong>Gantt Chart Trace:</strong></p>
  <div style="font-family:var(--font-mono); background:var(--bg-code); padding:12px; border-radius:6px; margin-bottom:14px;">
    [ P1: 0-4 ] &rarr; [ P2: 4-7 (Done) ] &rarr; [ P3: 7-10 (Done) ] &rarr; [ P1: 10-14 ] &rarr; [ P1: 14-18 ] &rarr; [ P1: 18-22 ] &rarr; [ P1: 22-30 (Done) ]
  </div>
  <p>Calculations:</p>
  <ul style="padding-left:20px;">
    <li><strong>P1:</strong> CT = 30, TAT = 30 - 0 = 30, WT = 30 - 24 = <strong>6 ms</strong></li>
    <li><strong>P2:</strong> CT = 7, TAT = 7 - 0 = 7, WT = 7 - 3 = <strong>4 ms</strong></li>
    <li><strong>P3:</strong> CT = 10, TAT = 10 - 0 = 10, WT = 10 - 3 = <strong>7 ms</strong></li>
    <li><strong>Average Waiting Time:</strong> (6 + 4 + 7) / 3 = <strong>5.66 ms</strong> (Compare to FCFS which is 17 ms!)</li>
  </ul>
</div>
"""

M4_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M4</span>
  <h1 class="module-title">Process Synchronization: Race Conditions</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 09-ProcessSynchronization - Introduction (187 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 6 (§6.1)</div>
    <div class="meta-chip">🎯 Exam Priority: TOP (Mock Midterm Q3)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Explain why cooperating processes require synchronization.</li>
    <li>Trace the <strong>Bounded-Buffer Producer-Consumer</strong> circular array algorithm.</li>
    <li>Understand the register-level assembly breakdown of <code>counter++</code> and <code>counter--</code>.</li>
    <li>Demonstrate how a <strong>Race Condition</strong> produces incorrect values (e.g. 4 or 6 instead of 5).</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. The Bounded-Buffer Producer-Consumer Problem</h2>
  <p>Cooperating processes share data. A common model is the <strong>Producer-Consumer Problem</strong>: a producer process produces information consumed by a consumer process. In a bounded buffer of size <code>BUFFER_SIZE</code>:</p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W6: Bounded Buffer Circular Queue Visualizer</div>
      <div class="sim-controls">
        <button class="btn btn-sm btn-primary" onclick="W6_BoundedBuffer.produce()">Produce Item</button>
        <button class="btn btn-sm" onclick="W6_BoundedBuffer.consume()">Consume Item</button>
        <button class="btn btn-sm" onclick="W6_BoundedBuffer.reset()">Reset</button>
      </div>
    </div>
    <div class="sim-body">
      <div class="sim-canvas" id="w6-canvas"></div>
      <div class="sim-narration" id="w6-narr">Circular buffer capacity: 6 slots. Maximum usable items = 5 (one slot kept empty to distinguish full from empty).</div>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Mock Midterm Q3 Explanation Questions</div>
    <ul>
      <li><code>while (in == out);</code> &rarr; Checks if the buffer is empty. If true, the consumer busy-waits.</li>
      <li><code>(out + 1) % BUFFER_SIZE</code> &rarr; Implements circular array wrap-around, ensuring that when the end of the array is reached, the index returns to 0.</li>
      <li><strong>Unbounded Buffer Difference:</strong> Remove the producer's full buffer check <code>while (((in + 1) % BUFFER_SIZE) == out);</code> and eliminate the modulo operator <code>% BUFFER_SIZE</code> because capacity is unlimited.</li>
    </ul>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Race Condition Traced at Register Level (Widget W5)</h2>
  <p>Suppose both Producer and Consumer share an integer variable <code>counter = 5</code>. At the machine level, <code>counter++</code> and <code>counter--</code> are NOT atomic:</p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W5: Race Condition Interleaver Tracer</div>
      <div class="sim-controls">
        <button class="btn btn-sm btn-primary" onclick="W5_RaceCondition.next()">Next Step &rarr;</button>
        <button class="btn btn-sm" onclick="W5_RaceCondition.reset()">Reset</button>
      </div>
    </div>
    <div class="sim-body">
      <div class="sim-narration" id="w5-narr"></div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Process</th>
              <th>Assembly Instruction Executed</th>
              <th>reg1</th>
              <th>reg2</th>
              <th>Shared counter</th>
            </tr>
          </thead>
          <tbody id="w5-table-body"></tbody>
        </table>
      </div>
    </div>
  </div>
</div>
"""

M5_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M5</span>
  <h1 class="module-title">Critical-Section Problem: Software & Hardware Solutions</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 10-CriticalSectionProblem - SW-HW Solution (234 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 6 (§6.2–§6.5)</div>
    <div class="meta-chip">🎯 Exam Priority: TOP (Mock Midterm Q4)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Identify the 4 sections of code: Entry Section, Critical Section, Exit Section, and Remainder Section.</li>
    <li>State the 3 requirements for any valid critical section solution: <strong>Mutual Exclusion, Progress, Bounded Waiting</strong>.</li>
    <li>Analyze Algorithm 1 (<code>turn</code>) and explain why it fails Progress.</li>
    <li>Analyze Algorithm 2 (<code>flag[]</code>) and explain why it fails Mutual Exclusion / deadlocks.</li>
    <li>Trace <strong>Peterson's Solution</strong> concurrently and verify all 3 requirements.</li>
    <li>Understand hardware instructions: <code>test_and_set()</code> and <code>compare_and_swap()</code>.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. The Three Requirements for a Valid Solution</h2>
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Requirement</th>
          <th>Definition</th>
          <th>Consequence if Violated</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. Mutual Exclusion</strong></td>
          <td>If process Pi is executing in its critical section, no other processes can be executing in their critical sections.</td>
          <td>Data corruption, race conditions.</td>
        </tr>
        <tr>
          <td><strong>2. Progress</strong></td>
          <td>If no process is executing in its critical section and some processes wish to enter, only those processes not in their remainder sections can participate in deciding who enters next, and this selection cannot be postponed indefinitely.</td>
          <td>Deadlock, unnecessary stalling or lockouts.</td>
        </tr>
        <tr>
          <td><strong>3. Bounded Waiting</strong></td>
          <td>There must exist a bound on the number of times other processes are allowed to enter their critical sections after a process has made a request to enter and before that request is granted.</td>
          <td>Starvation (indefinite waiting).</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Peterson's Solution Tracer (Widget W7)</h2>
  <p>Peterson's solution is a classic software solution for 2 processes sharing <code>boolean flag[2]</code> and <code>int turn</code>:</p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W7: Peterson's Algorithm Concurrent Execution Tracer</div>
      <div class="sim-controls">
        <button class="btn btn-sm btn-primary" onclick="W7_CriticalSection.nextStep()">Next Step &rarr;</button>
        <button class="btn btn-sm" onclick="W7_CriticalSection.reset()">Reset</button>
      </div>
    </div>
    <div class="sim-body">
      <div class="sim-narration" id="w7-narr"></div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>P0 Execution</th>
              <th>P1 Execution</th>
              <th>flag[0]</th>
              <th>flag[1]</th>
              <th>turn</th>
              <th>Critical Section Status</th>
            </tr>
          </thead>
          <tbody id="w7-table-body"></tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Mock Midterm Q4.B Proof</div>
    Notice at Step 5 that both processes set <code>turn</code>, but P1 executed <code>turn = 0</code> last! Therefore:
    <ul>
      <li>P0 checks: <code>while (flag[1] && turn == 1);</code> &rarr; <code>turn</code> is 0, so condition is FALSE &rarr; <strong>P0 enters CS!</strong></li>
      <li>P1 checks: <code>while (flag[0] && turn == 0);</code> &rarr; condition is TRUE &rarr; P1 loops waiting until P0 exits and sets <code>flag[0] = false</code>.</li>
      <li><strong>Mutual exclusion is fully satisfied!</strong></li>
    </ul>
  </div>
</div>
"""

M1_CARDS = [
  {"q": "What is the difference between Multiprogramming and Multitasking?", "a": "Multiprogramming maximizes CPU utilization by switching only on I/O waits.<br>Multitasking switches rapidly on timer quantums to minimize user response time (&lt;1s)."},
  {"q": "What are the mode bit values for User Mode and Kernel Mode?", "a": "User Mode = 1<br>Kernel Mode = 0"},
  {"q": "What is Direct Memory Access (DMA)?", "a": "High-speed device controller transfers full blocks of data directly to/from RAM without CPU, interrupting only once per block."},
  {"q": "What is a privileged instruction?", "a": "An instruction that can only be executed in Kernel Mode (mode bit 0), such as disabling interrupts or changing timer/memory registers."}
]
