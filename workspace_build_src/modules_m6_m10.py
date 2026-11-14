# build_src/modules_m6_m10.py

M6_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M6</span>
  <h1 class="module-title">Semaphores & Producer–Consumer Synchronization</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 11-CriticalSectionProblem - Semaphore - P-C Problem (77 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 6 (§6.6), Chapter 7 (§7.1.1)</div>
    <div class="meta-chip">🎯 Exam Priority: TOP (Mock Midterm Q5)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Define a <strong>Semaphore</strong> and the atomic operations <code>wait()</code> (P) and <code>signal()</code> (V).</li>
    <li>Distinguish between <strong>Counting Semaphores</strong> and <strong>Binary Semaphores (Mutexes)</strong>.</li>
    <li>Understand semaphore implementation with a <strong>Waiting Queue</strong> where negative values represent the number of blocked processes.</li>
    <li>Trace the classic Bounded-Buffer Producer-Consumer solution using 3 semaphores: <code>mutex = 1</code>, <code>empty = n</code>, and <code>full = 0</code>.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Definition & Atomic Operations</h2>
  <p>A <strong>semaphore</strong> is an integer variable that, apart from initialization, is accessed only through two standard atomic operations: <code>wait()</code> and <code>signal()</code>.</p>
  
  <div class="figure-container">
    <div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:16px; text-align:left;">
      <div style="flex:1; min-width:250px;">
        <h4 style="color:var(--primary); margin-bottom:6px;">wait(S) [also called P(S) or acquire]</h4>
        <pre class="code-block"><code>wait(S) {
    S.value--;
    if (S.value < 0) {
        add this process to S.list;
        block(); // suspend execution
    }
}</code></pre>
      </div>
      <div style="flex:1; min-width:250px;">
        <h4 style="color:var(--success); margin-bottom:6px;">signal(S) [also called V(S) or release]</h4>
        <pre class="code-block"><code>signal(S) {
    S.value++;
    if (S.value <= 0) {
        remove a process P from S.list;
        wakeup(P); // move to ready queue
    }
}</code></pre>
      </div>
    </div>
    <div class="figure-caption">Figure M6.1 — Standard Implementation of Semaphore with Waiting Queue (Silberschatz §6.6.2)</div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Meaning of Negative Semaphore Value (Silberschatz §6.6.2 & Slide 11)</div>
    When semaphores are implemented with a waiting queue (blocking without busy waiting):
    <ul>
      <li>If <code>S.value &ge; 0</code>: The number of resource units currently available.</li>
      <li>If <code>S.value &lt; 0</code>: The magnitude <code>|S.value|</code> is the <strong>exact count of processes waiting</strong> suspended on that semaphore!</li>
    </ul>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Interactive Semaphore Playground (Widget W8)</h2>
  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W8: Semaphore State & Blocked Queue Tracer</div>
      <div class="sim-controls">
        <button class="btn btn-sm btn-primary" onclick="W8_Semaphore.wait()">Call wait(S)</button>
        <button class="btn btn-sm" onclick="W8_Semaphore.signal()">Call signal(S)</button>
        <button class="btn btn-sm" onclick="W8_Semaphore.reset()">Reset</button>
      </div>
    </div>
    <div class="sim-body">
      <div style="display:flex; justify-content:space-around; align-items:center; flex-wrap:wrap; margin-bottom:16px;">
        <div>Current Semaphore Value: <strong id="w8-val" style="font-size:2rem; font-family:var(--font-mono);">1</strong></div>
        <div>Blocked Waiting Queue: <span id="w8-queue"></span></div>
      </div>
      <div class="sim-narration" id="w8-narr">Initial semaphore value: 1. Click 'Call wait(S)' to allocate or block processes.</div>
    </div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">3. Bounded-Buffer Solution with Semaphores</h2>
  <p>To synchronize producer and consumer processes on a buffer of size <code>N</code>, three semaphores are used:</p>
  <ul style="padding-left:20px; margin-bottom:14px;">
    <li><code>semaphore mutex = 1;</code> &rarr; Guarantees mutual exclusion for accessing the buffer.</li>
    <li><code>semaphore empty = N;</code> &rarr; Counts empty buffer slots (initially <code>N</code>).</li>
    <li><code>semaphore full = 0;</code> &rarr; Counts filled buffer slots (initially <code>0</code>).</li>
  </ul>

  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Producer Process</th>
          <th>Consumer Process</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <pre class="code-block"><code>do {
    // produce an item in next_produced
    wait(empty);
    wait(mutex);
    // add next_produced to buffer
    signal(mutex);
    signal(full);
} while (true);</code></pre>
          </td>
          <td>
            <pre class="code-block"><code>do {
    wait(full);
    wait(mutex);
    // remove an item from buffer to next_consumed
    signal(mutex);
    signal(empty);
    // consume the item in next_consumed
} while (true);</code></pre>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Order of wait() Calls Matters! (Mock Midterm Q5 Trap)</div>
    In the producer, swapping the wait statements to:
    <code>wait(mutex); wait(empty);</code>
    causes <strong>DEADLOCK</strong> if the buffer is full! The producer grabs the mutex, then blocks on empty. The consumer can never enter to consume an item because the producer holds the mutex!
  </div>
</div>
"""

M7_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M7</span>
  <h1 class="module-title">Classic Problems: Readers–Writers & Dining Philosophers</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 12-Semaphore - R-W and DP Problem (181 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 7 (§7.1.2–§7.1.3)</div>
    <div class="meta-chip">🎯 Exam Priority: MEDIUM / HIGH</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Understand the <strong>Readers-Writers Problem</strong> and how readers share access while writers require mutual exclusion.</li>
    <li>Analyze the role of <code>read_count</code>, <code>mutex</code>, and <code>rw_mutex</code>.</li>
    <li>Explore the <strong>Dining Philosophers Problem</strong> and identify the deadlock condition.</li>
    <li>Examine the 3 standard remedies for Dining Philosophers: asymmetric chopstick pickup, maximum 4 seated, and monitor/atomic dual pickup.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. The First Readers-Writers Problem</h2>
  <p>A database is shared among multiple concurrent processes. Readers only read the database; writers read and write. Mutual exclusion is required between writers and everyone else, but multiple readers can read concurrently.</p>
  <p><strong>Shared Variables:</strong></p>
  <ul style="padding-left:20px; margin-bottom:14px;">
    <li><code>semaphore rw_mutex = 1;</code> &rarr; Common to both reader and writer processes.</li>
    <li><code>semaphore mutex = 1;</code> &rarr; Protects updates to <code>read_count</code>.</li>
    <li><code>int read_count = 0;</code> &rarr; Tracks how many reader processes are currently reading.</li>
  </ul>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Key Exam Tracing Rules (Slide 12)</div>
    <ul>
      <li><strong>First Reader to arrive</strong> executes <code>wait(rw_mutex)</code> to lock out writers.</li>
      <li><strong>Subsequent Readers</strong> increment <code>read_count</code> and read immediately without touching <code>rw_mutex</code>.</li>
      <li><strong>Last Reader to leave</strong> executes <code>signal(rw_mutex)</code>, freeing writers.</li>
      <li><em>Consequence:</em> Writers can experience <strong>starvation</strong> if a continuous stream of readers keeps arriving.</li>
    </ul>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Interactive Dining Philosophers (Widget W10)</h2>
  <p>Five philosophers spend their lives thinking and eating. A circular table has 5 single chopsticks. A philosopher needs both adjacent chopsticks (left and right) to eat:</p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W10: Dining Philosophers Table Simulator</div>
      <div class="sim-controls">
        <button class="btn btn-sm btn-primary" onclick="W10_DiningPhilosophers.triggerDeadlock()">Simulate Naive Deadlock</button>
        <button class="btn btn-sm" onclick="W10_DiningPhilosophers.reset()">Reset Table</button>
      </div>
    </div>
    <div class="sim-body">
      <div class="sim-canvas" id="w10-canvas"></div>
      <div class="sim-narration" id="w10-narr">Click any philosopher circle (P0..P4) to toggle their state between THINKING, HUNGRY, and EATING. Or click "Simulate Naive Deadlock" to see circular wait.</div>
    </div>
  </div>

  <p><strong>Three Remedies for Deadlock:</strong></p>
  <ol style="padding-left:20px; line-height:1.8;">
    <li><strong>Limit number of philosophers:</strong> Allow at most 4 philosophers to sit at the table simultaneously.</li>
    <li><strong>Asymmetric Pickup:</strong> An odd philosopher picks up their left chopstick first then right; an even philosopher picks up their right chopstick first then left.</li>
    <li><strong>Both-or-None:</strong> A philosopher picks up chopsticks only if both are available (guaranteed by critical section or monitor).</li>
  </ol>
</div>
"""

M8_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M8</span>
  <h1 class="module-title">Process Deadlocks: Characterization & Prevention</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 13-ProcessDeadlocks - Intro - Prevention (105 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 8 (§8.1–§8.5)</div>
    <div class="meta-chip">🎯 Exam Priority: HIGH</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>State and define the <strong>4 Necessary Coffman Conditions</strong> for deadlock.</li>
    <li>Construct and interpret a <strong>Resource Allocation Graph (RAG)</strong>.</li>
    <li>Understand the single-instance vs. multi-instance cycle theorem:
      <br>&bull; Single instance: <code>Cycle &hArr; Deadlock</code>
      <br>&bull; Multiple instances: <code>Cycle &rArr; Possible Deadlock (not guaranteed)</code>
    </li>
    <li>Explain how <strong>Deadlock Prevention</strong> eliminates deadlocks by invalidating at least one of the 4 conditions.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. The Four Necessary Conditions for Deadlock</h2>
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Condition</th>
          <th>Definition</th>
          <th>How Prevention Invalidates It</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. Mutual Exclusion</strong></td>
          <td>At least one resource must be held in a non-shareable mode (only one process at a time).</td>
          <td>Make resources shareable (e.g. read-only files). However, some resources (like printers or write locks) cannot be shared.</td>
        </tr>
        <tr>
          <td><strong>2. Hold and Wait</strong></td>
          <td>A process must be holding at least one resource and waiting to acquire additional resources held by others.</td>
          <td>Protocol 1: Require process to request and be allocated all its resources before beginning execution.<br>Protocol 2: Allow process to request resources only when it holds zero resources.</td>
        </tr>
        <tr>
          <td><strong>3. No Preemption</strong></td>
          <td>Resources cannot be preempted; a resource can be released only voluntarily by the process holding it after completion.</td>
          <td>If a process holding resources requests another that cannot be allocated immediately, all currently held resources are preempted.</td>
        </tr>
        <tr>
          <td><strong>4. Circular Wait</strong></td>
          <td>A closed chain of processes <code>{P0, P1, ..., Pn}</code> exists such that P0 waits for a resource held by P1, P1 waits for P2, ..., and Pn waits for P0.</td>
          <td>Impose a <strong>total ordering of all resource types</strong>: <code>F: R &rarr; N</code>. Require that each process requests resources only in strictly increasing order of enumeration.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Resource Allocation Graph (RAG) Rules & Slide Examples</h2>
  <p>A Resource-Allocation Graph <code>G = (V, E)</code> consists of vertices (Processes <code>P</code> and Resources <code>R</code>) and directed edges:</p>
  <ul style="padding-left:20px; margin-bottom:14px;">
    <li><strong>Request Edge:</strong> <code>Pi &rarr; Rj</code> (Process Pi has requested an instance of Rj and is waiting).</li>
    <li><strong>Assignment Edge:</strong> <code>Rj &rarr; Pi</code> (An instance of resource Rj has been allocated to process Pi).</li>
  </ul>

  <div class="figure-container">
    <svg viewBox="0 0 600 220" style="width:100%; max-width:600px;">
      <!-- R1 -->
      <rect x="50" y="30" width="70" height="70" rx="8" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
      <circle cx="85" cy="65" r="5" fill="var(--warning)"/>
      <text x="85" y="24" fill="var(--text-main)" font-size="12" font-weight="bold" text-anchor="middle">R1 (1)</text>

      <!-- P1 -->
      <circle cx="210" cy="65" r="26" fill="var(--primary)"/>
      <text x="210" y="70" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">P1</text>

      <!-- R2 -->
      <rect x="330" y="30" width="70" height="70" rx="8" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
      <circle cx="355" cy="65" r="5" fill="var(--warning)"/>
      <circle cx="375" cy="65" r="5" fill="var(--warning)"/>
      <text x="365" y="24" fill="var(--text-main)" font-size="12" font-weight="bold" text-anchor="middle">R2 (2)</text>

      <!-- P2 -->
      <circle cx="490" cy="65" r="26" fill="var(--p2-col)"/>
      <text x="490" y="70" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">P2</text>

      <!-- Edges -->
      <path d="M 90 65 L 180 65" stroke="var(--primary)" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M 235 65 L 325 65" stroke="var(--primary)" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M 375 65 L 460 65" stroke="var(--primary)" stroke-width="2" marker-end="url(#arrow)"/>
    </svg>
    <div class="figure-caption">Figure M8.1 — Resource Allocation Graph notation: Circles = Processes, Squares = Resources, Dots = Instances.</div>
  </div>
</div>
"""

M9_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M9</span>
  <h1 class="module-title">Deadlock Avoidance & Banker's Algorithm</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 14-ProcessDeadlocks - Avoidance (127 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 8 (§8.6)</div>
    <div class="meta-chip">🎯 Exam Priority: TOP (Final & Mock Exam Classic)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Distinguish between <strong>Safe State</strong>, <strong>Unsafe State</strong>, and <strong>Deadlock</strong>.</li>
    <li>Understand <strong>Claim Edges</strong> (dashed line <code>Pi &rarr; Rj</code>) in the RAG Avoidance algorithm.</li>
    <li>Master the 4 data structures of Banker's Algorithm: <code>Available</code>, <code>Max</code>, <code>Allocation</code>, and <code>Need</code>.</li>
    <li>Calculate the <strong>Need Matrix</strong>: <code>Need[i][j] = Max[i][j] - Allocation[i][j]</code>.</li>
    <li>Trace the <strong>Safety Algorithm</strong> step by step and discover safe sequences.</li>
    <li>Execute the <strong>Resource-Request Algorithm</strong> for new process requests (e.g. P1 requests (1, 0, 2)).</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Safe, Unsafe, and Deadlock States</h2>
  <div class="figure-container">
    <svg viewBox="0 0 460 220" style="width:100%; max-width:440px;">
      <!-- Outer: All states -->
      <ellipse cx="230" cy="110" rx="200" ry="90" fill="var(--bg-card)" stroke="var(--border)" stroke-width="2"/>
      <text x="230" y="45" fill="var(--text-muted)" font-size="12" text-anchor="middle">All System States</text>
      <!-- Middle: Unsafe states -->
      <ellipse cx="250" cy="120" rx="140" ry="65" fill="var(--warning-bg)" stroke="var(--warning)" stroke-width="2"/>
      <text x="250" y="80" fill="var(--warning)" font-weight="bold" font-size="12" text-anchor="middle">Unsafe State</text>
      <!-- Inner: Deadlock -->
      <ellipse cx="290" cy="135" rx="70" ry="38" fill="var(--danger-bg)" stroke="var(--danger)" stroke-width="2"/>
      <text x="290" y="140" fill="var(--danger)" font-weight="bold" font-size="12" text-anchor="middle">Deadlock</text>
      <!-- Left: Safe states -->
      <text x="130" y="125" fill="var(--success)" font-weight="bold" font-size="14" text-anchor="middle">Safe State</text>
    </svg>
    <div class="figure-caption">Figure M9.1 — State Spaces: A Safe State is NOT Deadlock. An Unsafe State MAY lead to Deadlock. (Silberschatz Fig. 8.6)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Master Banker's Algorithm Calculator (Widget W12)</h2>
  <p>Preloaded with <strong>Silberschatz Banker's Algorithm Example 01</strong>: 5 processes (P0..P4) and 3 resource types (A=10, B=5, C=7):</p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W12: Banker's Algorithm Calculator & Request Tester</div>
      <div class="sim-controls">
        <button class="btn btn-sm btn-primary" onclick="W12_Bankers.testRequest()">Test: P1 Requests (1, 0, 2)</button>
        <button class="btn btn-sm" onclick="W12_Bankers.reset()">Reset to Slide Example</button>
      </div>
    </div>
    <div class="sim-body">
      <div class="sim-narration" id="w12-narr"></div>

      <h4 style="margin:14px 0 6px; font-size:0.95rem;">System State Matrices:</h4>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Allocation (A B C)</th>
              <th>Max (A B C)</th>
              <th>Need = Max - Alloc</th>
              <th>Available (A B C)</th>
            </tr>
          </thead>
          <tbody id="w12-table-body"></tbody>
        </table>
      </div>

      <div id="w12-trace"></div>
    </div>
  </div>
</div>
"""

M10_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M10</span>
  <h1 class="module-title">Deadlock Detection & Recovery</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 15-ProcessDeadlocks - DetectionRecovery (51 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 8 (§8.7–§8.8)</div>
    <div class="meta-chip">🎯 Exam Priority: MEDIUM</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Construct a <strong>Wait-For Graph</strong> by collapsing resource nodes in single-instance systems.</li>
    <li>Understand the multiple-instance detection algorithm using the <code>Request</code> matrix.</li>
    <li>Compare deadlock recovery via <strong>Process Termination</strong> (abort all vs. abort one at a time).</li>
    <li>Analyze deadlock recovery via <strong>Resource Preemption</strong>: victim selection, rollback, and starvation prevention.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Wait-For Graph (Single-Instance Detection)</h2>
  <p>If all resources have only a single instance, we can define a deadlock detection variant of the resource-allocation graph called a <strong>Wait-For Graph</strong>. We obtain this graph by removing resource nodes and collapsing edges:</p>
  <ul style="padding-left:20px; margin-bottom:14px;">
    <li>An edge from <code>Pi &rarr; Pj</code> in a wait-for graph exists if and only if <code>Pi</code> is waiting for a resource currently held by <code>Pj</code>.</li>
    <li><strong>Theorem:</strong> A deadlock exists in the system if and only if the wait-for graph contains a cycle! Cycle detection takes <code>O(n<sup>2</sup>)</code> operations.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">2. Deadlock Recovery Strategies</h2>
  <p>When a detection algorithm determines that a deadlock exists, two main options are available:</p>
  
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Recovery Method</th>
          <th>Approach</th>
          <th>Key Trade-Offs & Exam Points</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Process Termination: Abort All</strong></td>
          <td>Abort all deadlocked processes simultaneously.</td>
          <td>Guaranteed to break the deadlock cycle immediately, but extremely costly because partially computed results of all processes are discarded.</td>
        </tr>
        <tr>
          <td><strong>Process Termination: Abort One at a Time</strong></td>
          <td>Abort one deadlocked process at a time and re-run detection algorithm until the deadlock cycle is broken.</td>
          <td>Much lower computation loss, but adds significant overhead because the detection algorithm must be invoked after every termination.</td>
        </tr>
        <tr>
          <td><strong>Resource Preemption</strong></td>
          <td>Preempt some resources from processes and allocate them to other processes until deadlock is broken.</td>
          <td>Three major design decisions:
            <br>1. <strong>Selecting a victim:</strong> Pick the process with minimum cost.
            <br>2. <strong>Rollback:</strong> Must roll back victim to a safe checkpoint state.
            <br>3. <strong>Starvation:</strong> Must ensure the same process is not always picked as victim (use an aging counter included in cost factor).
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
"""
