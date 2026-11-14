# -*- coding: utf-8 -*-
"""
Part 2 Knowledge Trove: Decks 09 through 15
Silberschatz 10th Ed. Chapters 6, 7, 8
Clean offline HTML/Unicode math (zero raw LaTeX tokens, zero unescaped tabs).
"""

DECKS_09_15 = {
    "deck_09": {
        "title": "RACE CONDITIONS, DISASSEMBLY & BOUNDED BUFFER",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), §3.5 & Chapter 6 (§6.1–§6.2)",
        "formulas": "count++ &rarr; LOAD R1, count; ADD R1, #1; STORE count, R1<br>count-- &rarr; LOAD R2, count; SUB R2, #1; STORE count, R2<br>Circular Buffer Full: ((in + 1) % N) == out<br>Circular Buffer Empty: in == out (max usable slots = N &minus; 1)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 09 · CONCURRENCY HAZARDS · SILBERSCHATZ §3.5 &amp; CH. 6</div>
    <h2 class="theory-heading">Process Synchronization: Race Conditions, Machine Disassembly &amp; Bounded Buffer</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §3.5, §6.1–§6.2 · Core Topic Scope (Practice Q3)</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Understand cooperating processes sharing memory or kernel structures and define a <strong>Race Condition</strong> formally (§6.1).</li>
      <li>Disassemble C statements <code>count++</code> and <code>count--</code> into 3 machine instructions and trace corrupted interleavings.</li>
      <li>Identify real OS kernel race conditions (e.g., <code>fork()</code> assigning duplicate PIDs on <code>next_available_pid</code>, §6.2 Fig. 6.2).</li>
      <li>Distinguish <strong>Non-Preemptive Kernels</strong> vs. <strong>Preemptive Kernels</strong> in handling kernel-mode races (§6.2).</li>
      <li>Trace and write every line of the <strong>Bounded-Buffer Producer/Consumer</strong> code (§3.5 &amp; Mock Midterm Q3), plus the <code>counter</code> trade-off (§6.1 / Slide 09).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Why One C Line Splits Into a Concurrency Trap</div>
    <ul>
      <li><strong>Naive Attempt &rarr; Visible Failure:</strong> A lock-free ring buffer wastes 1 slot (<code>BUFFER_SIZE &minus; 1</code>) because otherwise <code>in == out</code> could mean either Empty or Full. Trying to reclaim that lost slot by adding a shared integer <code>counter</code> (<code>counter++</code> / <code>counter--</code>) fails under preemption: if CPU timer interrupts hit mid-update, both <code>counter = 4</code> and <code>counter = 6</code> can overwrite the true <code>5</code>!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Picture two accountants updating one shared chalkboard balance (<code>count = 5</code>) using private scratchpads (<code>register1</code>, <code>register2</code>): Clerk A writes <code>5 + 1 = 6</code> on his pad, steps out, Clerk B reads <code>5</code>, writes <code>4</code> to the board, and Clerk A returns to overwrite <code>4</code> with <code>6</code>. <em>Where the analogy breaks:</em> Unlike human clerks, CPU cores save and restore each thread's private scratchpad inside its PCB across interrupts (§6.1), so neither process has any clue the chalkboard changed while it was swapped out!</li>
      <li><strong>Why Each Rule Exists:</strong> Leaving one sentinel empty cell in <code>((in + 1) % N) == out</code> avoids touching any shared counter at all; <strong>Preemptive kernels</strong> still need locks on <code>next_available_pid</code> because kernel preemption and SMP multi-core execution interleave kernel assembly instructions just like user threads.</li>
    </ul>
  </div>

  <h3>1. Background &amp; Formal Definition of a Race Condition (§6.1)</h3>
  <p>A cooperating process can affect or be affected by other processes executing concurrently (via shared logical address space, threads, or shared files). When multiple execution flows access shared mutable data without coordination, memory consistency breaks down unpredictably depending on the exact nanosecond timing of timer interrupts or multicore bus arbitration.</p>
  <div class="callout callout-definition">
    <div class="callout-title">📜 Textbook Definition: Race Condition (Silberschatz §6.1)</div>
    "A situation where several processes access and manipulate the same data concurrently and the outcome of the execution depends on the particular order in which the access takes place, is called a <strong>race condition</strong>."
  </div>
  <p><strong>Real Kernel Race Condition (§6.2, Fig. 6.2):</strong> Inside an OS kernel, two processes simultaneously calling <code>fork()</code> might both read the same integer <code>next_available_pid = 2615</code> before either increments it—causing the kernel to assign <strong>two completely distinct child processes the exact same PID</strong>! Other kernel targets include open-file tables, memory allocation bitmaps, and ready queues.</p>

  <h3>2. Dissecting <code>count++</code> and <code>count--</code> at Assembly Level</h3>
  <p>Wait—isn't <code>count++</code> a single statement in C? <strong>Not to the CPU!</strong> A load-store architecture compiles <code>count++</code> and <code>count--</code> into 3 separate machine instructions each:</p>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>Producer: count++</h4>
      <pre class="code-block">P1: LOAD  register1, count
P2: ADD   register1, #1
P3: STORE count, register1</pre>
    </div>
    <div class="compare-card">
      <h4>Consumer: count--</h4>
      <pre class="code-block">C1: LOAD  register2, count
C2: SUB   register2, #1
C3: STORE count, register2</pre>
    </div>
  </div>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Interleaving Trace: Initially count = 5 (Why Outcome Becomes 4, 5, or 6!)</div>
    <p>Logically, running 1 increment and 1 decrement should leave <code>count == 5</code>. Yet look at this interleaved trace across context switches:</p>
    <table class="data-table">
      <thead>
        <tr><th>Step</th><th>Actor</th><th>Machine Instruction Executed</th><th>register1</th><th>register2</th><th>Memory <code>count</code></th></tr>
      </thead>
      <tbody>
        <tr><td>T<sub>0</sub></td><td>Producer</td><td><code>register1 = count</code></td><td>5</td><td>—</td><td>5</td></tr>
        <tr><td>T<sub>1</sub></td><td>Producer</td><td><code>register1 = register1 + 1</code></td><td>6</td><td>—</td><td>5</td></tr>
        <tr><td>T<sub>2</sub></td><td>Consumer</td><td><code>register2 = count</code> <em>(context switch!)</em></td><td>6</td><td>5</td><td>5</td></tr>
        <tr><td>T<sub>3</sub></td><td>Consumer</td><td><code>register2 = register2 &minus; 1</code></td><td>6</td><td>4</td><td>5</td></tr>
        <tr><td>T<sub>4</sub></td><td>Producer</td><td><code>count = register1</code></td><td>6</td><td>4</td><td><strong>6</strong></td></tr>
        <tr><td>T<sub>5</sub></td><td>Consumer</td><td><code>count = register2</code> <em>(OVERWRITES 6!)</em></td><td>6</td><td>4</td><td><strong>4</strong></td></tr>
      </tbody>
    </table>
    <p>If T<sub>4</sub> and T<sub>5</sub> execute in reverse order, final <code>count = 6</code>. Only non-overlapping execution leaves <code>count = 5</code>. Every outcome (<strong>4, 5, or 6</strong>) is possible depending solely on instruction timing!</p>
  </div>

  <h3>3. Non-Preemptive vs. Preemptive Kernels (§6.2)</h3>
  <ul>
    <li><strong>Non-Preemptive Kernel:</strong> A kernel-mode process runs until it exits kernel mode, blocks, or voluntarily yields. Essentially free from kernel data-structure race conditions on a single CPU, since at most one process executes inside kernel code at once.</li>
    <li><strong>Preemptive Kernel (Linux, Windows, Solaris):</strong> Allows a process running in kernel mode to be preempted. Requires careful mutex/spinlock synchronization inside kernel paths, but provides far better responsiveness (real-time processes don't stall behind long syscalls) and works naturally on SMP multicore CPUs where two cores execute kernel code simultaneously anyway.</li>
  </ul>

  <h3>4. The Bounded-Buffer Shared-Memory Trace (§3.5 &amp; Mock Midterm Q3)</h3>
  <p>Consider the circular shared buffer of size <code>BUFFER_SIZE</code> from Silberschatz §3.5 (note: Lecture Slide 09 traces <code>BUFFER_SIZE = 6</code> with indices <code>0..5</code>, showing Producer stalled at <code>in=5, out=0</code> because <code>(5+1)%6 == 0</code>, and then motivates adding an integer <code>counter</code> initialized at <code>3</code> that races to <code>2</code> or <code>4</code>!). Why does this lock-free design leave <strong>1 slot unused (maximum <code>BUFFER_SIZE &minus; 1</code> items)</strong>? If it allowed filling all <code>N</code> slots, <code>in == out</code> would ambiguously mean both <em>Empty</em> and <em>Full</em>—whereas using <code>counter == BUFFER_SIZE</code> uses all <code>N</code> slots at the price of a shared-counter race condition unless synchronized!</p>
  <pre class="code-block">#define BUFFER_SIZE 10
typedef struct { ... } item;
item buffer[BUFFER_SIZE];
int in = 0;   // next free slot to write
int out = 0;  // first full slot to read</pre>

  <div class="compare-grid">
    <div class="compare-card">
      <h4>Producer Process (Mock Midterm Q3.B)</h4>
      <pre class="code-block">while (true) {
    /* produce item in next_produced */
    while (((in + 1) % BUFFER_SIZE) == out)
        ; /* do nothing -- buffer full */
    buffer[in] = next_produced;
    in = (in + 1) % BUFFER_SIZE;
}</pre>
    </div>
    <div class="compare-card">
      <h4>Consumer Process (Mock Midterm Q3.A)</h4>
      <pre class="code-block">while (true) {
    while (in == out)
        ; /* do nothing -- buffer empty */
    next_consumed = buffer[out];
    out = (out + 1) % BUFFER_SIZE;
    /* consume item in next_consumed */
}</pre>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Mock Midterm Question 3 Full-Marks Checklist</div>
    <ul>
      <li><strong>Purpose of <code>while (in == out);</code>:</strong> Busy-waits (blocks) the consumer whenever the shared buffer is empty, preventing it from reading stale or uninitialized memory.</li>
      <li><strong>Purpose of <code>% BUFFER_SIZE</code>:</strong> Implements a circular ring buffer; when <code>in</code> or <code>out</code> increments past index <code>BUFFER_SIZE &minus; 1</code> (9), modulo arithmetic wraps it cleanly back to <code>0</code> to reuse consumed slots without copying/shifting array elements.</li>
      <li><strong>Modifying for an Unbounded Buffer (Q3.C):</strong> (1) Delete the producer's buffer-full busy-wait loop <code>while (((in + 1) % BUFFER_SIZE) == out);</code> since infinite capacity never fills; (2) Remove <code>% BUFFER_SIZE</code>, turning updates into <code>in = in + 1;</code> and <code>out = out + 1;</code> (or arbitrary unbounded queue pointers). Note: consumer still keeps empty-check loop!</li>
    </ul>
  </div>
</div>
""",
    },
    "deck_10": {
        "title": "CRITICAL-SECTION PROBLEM, PETERSON & ATOMIC HARDWARE",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 6 (§6.2–§6.5)",
        "formulas": "3 Criteria: Mutual Exclusion, Progress, Bounded Waiting<br>Peterson Entry: flag[i] = true; turn = j; while (flag[j] &amp;&amp; turn == j);<br>Hardware Atomics: TestAndSet(&amp;lock) &amp; CompareAndSwap(&amp;v, exp, new)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 10 · SYNCHRONIZATION ALGORITHMS · SILBERSCHATZ §6.2–§6.5</div>
    <h2 class="theory-heading">The Critical-Section Problem, Peterson's Solution, Memory Barriers &amp; Hardware Atomics</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 6 (§6.2–§6.5) · Core Topic Scope (Practice Q4)</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Identify all <strong>4 Code Sections</strong> of a concurrent process: Entry, Critical, Exit, and Remainder (§6.2).</li>
      <li>State and evaluate the <strong>3 Cardinal Requirements</strong>: Mutual Exclusion, Progress, and Bounded Waiting.</li>
      <li>Diagnose why Software Attempt 1 (<code>turn</code> variable) fails Progress (Mock Midterm Q4.A).</li>
      <li>Trace <strong>Peterson's Solution</strong> step-by-step, prove all 3 requirements, and explain its modern Memory Barrier limitation (Mock Midterm Q4.B, §6.3–§6.4).</li>
      <li>Write mutex algorithms using hardware atomics: <code>test_and_set()</code> / <code>Swap()</code> / <code>compare_and_swap()</code> (including <code>waiting[n]</code> Bounded Waiting) and understand atomic-integer caveats (§6.4).</li>
      <li>Distinguish blocking Mutexes vs. <strong>Spinlocks</strong> and the <code>2 context switches</code> rule (§6.5).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Two Polite Engineers &amp; Why Hardware Reordering Cheats</div>
    <ul>
      <li><strong>Naive Attempts &rarr; Visible Failure:</strong> Attempt 1 (<code>turn = j</code>) guarantees Mutual Exclusion yet violates <strong>Progress</strong>—if your partner goes to sleep outside the room, the lock stays permanently jammed on their turn. Pure flag-checking without <code>turn</code> deadlocks when both raise flags simultaneously. Even naive <code>while (TestAndSet(&amp;lock));</code> satisfies Mutual Exclusion + Progress yet lacks <strong>Bounded Waiting</strong> if one fast core repeatedly grabs the lock before slower cores win arbitration!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Peterson's algorithm is two polite engineers sharing a 1-person server closet: each first posts an <code>"I want in"</code> sticky note on their own door (<code>flag[i] = true</code>), then writes <code>"After you"</code> on the hallway whiteboard (<code>turn = j</code>). Since only the second writer's name stays on the whiteboard, the earlier writer walks straight in while the later writer waits. <em>Where the analogy breaks:</em> On modern multi-core CPUs, private store buffers let your <code>turn = j</code> whiteboard write become visible to the other core <em>before</em> your <code>flag[i] = true</code> sticky note flushes from cache—letting both walk inside together unless a <strong>Memory Barrier</strong> flushes writes (§6.4.1)!</li>
      <li><strong>Why Each Rule Exists:</strong> Why <code>turn = j</code> MUST follow <code>flag[i] = true</code> (prevents P<sub>1</sub> from observing <code>flag[0] == false</code> after P<sub>0</sub> already yielded); why Spinlocks follow the <code>&lt; 2 context switches</code> rule (blocking costs both a save-to-wait switch and a wakeup-to-ready switch; only busy-wait when the holder will release sooner on another core).</li>
    </ul>
  </div>

  <h3>1. Structure &amp; Three Cardinal Requirements (§6.2)</h3>
  <p>Consider <code>n</code> concurrent processes {P<sub>0</sub>, P<sub>1</sub>, &hellip;, P<sub>n&minus;1</sub>}. Each process contains a <strong>Critical Section (CS)</strong> accessing shared variables. Permission to enter must be requested in the <strong>Entry Section</strong>, released in the <strong>Exit Section</strong>, and independent work runs in the <strong>Remainder Section</strong>.</p>
  <table class="data-table">
    <thead>
      <tr><th>Requirement</th><th>Exact Textbook Meaning (§6.2)</th><th>What Breaks When Violated?</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Mutual Exclusion</strong></td><td>If process P<sub>i</sub> is executing inside its critical section, <strong>no other processes</strong> can execute inside their critical sections simultaneously.</td><td>Data corruption / race conditions on shared state.</td></tr>
      <tr><td><strong>2. Progress</strong></td><td>If no process is in its CS and some wish to enter, <strong>only processes not in their Remainder Section</strong> can participate in deciding who enters next, and this selection <strong>cannot be postponed indefinitely</strong>.</td><td>Deadlock or artificial blocking by an idle outside process (strict alternation trap!).</td></tr>
      <tr><td><strong>3. Bounded Waiting</strong></td><td>There exists a <strong>limit (bound)</strong> on the number of times other processes are allowed to enter their CS after P<sub>i</sub> has made a request and before that request is granted.</td><td>Starvation (indefinite postponement) of P<sub>i</sub>.</td></tr>
    </tbody>
  </table>

  <h3>2. Software Attempt 1: Single <code>turn</code> Variable (Mock Midterm Q4.A)</h3>
  <pre class="code-block">// Process Pi (with peer Pj, j = 1 - i)
do {
    while (turn != i) ;  // Entry Section (Mock Q4.A writes: while (turn == j); )
        /* critical section */
    turn = j;            // Exit Section
        /* remainder section */
} while (true);</pre>
  <p><strong>Exam Analysis:</strong> Does it satisfy Mutual Exclusion? <strong>YES</strong> (<code>turn</code> holds either <code>0</code> or <code>1</code>, never both). Does it satisfy Progress? <strong>NO!</strong> Suppose <code>turn = 0</code> and P<sub>0</sub> is sleeping forever in its Remainder Section (doesn't need CS), while P<sub>1</sub> desperately wants to enter. P<sub>1</sub> spins forever waiting for P<sub>0</sub> to finish and set <code>turn = 1</code>! Because a process in its Remainder Section blocks P<sub>1</sub>, strict alternation <strong>violates Progress</strong>. (<em>Notation note:</em> Mock Midterm Q4.A writes <code>while (turn == j);</code> starting at <code>turn = 1</code> with P<sub>0</sub> requesting first—exact same logic, P<sub>0</sub> stalls!)</p>

  <h3>3. Peterson's 2-Process Solution (Mock Midterm Q4.B, §6.3)</h3>
  <p>Peterson combines two shared variables: <code>boolean flag[2] = {false, false};</code> (intent to enter) and <code>int turn;</code> (courteous tie-breaker).</p>
  <pre class="code-block">// Process Pi (peer Pj = 1 - i)
do {
    flag[i] = true;                // 1. Declare MY intent to enter
    turn = j;                      // 2. Politely give turn to the OTHER process
    while (flag[j] &amp;&amp; turn == j) ; // 3. Wait ONLY if other wants in AND it's their turn
        /* critical section */
    flag[i] = false;               // 4. Clear intent on exit
        /* remainder section */
} while (true);</pre>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Trace Exam Question: P<sub>0</sub> writes flag[0]=true, then P<sub>1</sub> sets flag[1]=true, P<sub>0</sub> sets turn=1, then P<sub>1</sub> sets turn=0</div>
    <table class="data-table">
      <thead><tr><th>Step / State</th><th><code>flag[0]</code></th><th><code>flag[1]</code></th><th><code>turn</code></th><th>Spin Condition Evaluation</th></tr></thead>
      <tbody>
        <tr><td>Initial</td><td>false</td><td>false</td><td>—</td><td>Neither process requesting</td></tr>
        <tr><td>P<sub>0</sub>: <code>flag[0]=true</code>; P<sub>1</sub>: <code>flag[1]=true</code></td><td>true</td><td>true</td><td>—</td><td>Both declare intent</td></tr>
        <tr><td>P<sub>0</sub>: <code>turn = 1</code></td><td>true</td><td>true</td><td>1</td><td>P<sub>0</sub> yields to P<sub>1</sub></td></tr>
        <tr><td>P<sub>1</sub>: <code>turn = 0</code> <em>(overwrites!)</em></td><td>true</td><td>true</td><td><strong>0</strong></td><td>Final value of <code>turn</code> is <strong>0</strong>!</td></tr>
        <tr><td>Loop Evaluation</td><td>true</td><td>true</td><td>0</td><td>&bull; <strong>P<sub>0</sub> checks:</strong> <code>flag[1] &amp;&amp; turn==1</code> &rarr; <code>true &amp;&amp; false</code> &rarr; <strong>FALSE &rArr; P<sub>0</sub> ENTERS CS!</strong><br>&bull; <strong>P<sub>1</sub> checks:</strong> <code>flag[0] &amp;&amp; turn==0</code> &rarr; <code>true &amp;&amp; true</code> &rarr; <strong>TRUE &rArr; P<sub>1</sub> WAITS!</strong></td></tr>
      </tbody>
    </table>
    <p><strong>Proof Sketch for All 3 Criteria:</strong> (1) <em>Mutual Exclusion:</em> Both enter CS only if <code>flag[0]==flag[1]==true</code> AND simultaneously <code>turn==0</code> and <code>turn==1</code>—impossible! (2) <em>Progress &amp; Bounded Waiting:</em> If P<sub>1</sub> exits CS, it sets <code>flag[1]=false</code> allowing P<sub>0</sub> in; even if P<sub>1</sub> immediately loops back and tries again, P<sub>1</sub> sets <code>turn=0</code>, forcing itself to wait and guaranteeing P<sub>0</sub> waits at most <strong>1 entry</strong>!</p>
  </div>

  <p><strong>Silberschatz 10th Ed. Caveat (§6.3–§6.4.1):</strong> In a <strong>Strongly Ordered</strong> memory model, memory modifications on one processor are immediately visible to all other processors; in a <strong>Weakly Ordered</strong> model (modern x86/ARM out-of-order CPUs and optimizing compilers), independent writes like <code>flag[i] = true; turn = j;</code> may be reordered unless protected by explicit <strong>Memory Barriers (<code>memory_barrier()</code>)</strong> that flush write buffers. <em>Exam Note:</em> Slide 10 (slide 102) remarks informally that Peterson can starve, whereas Silberschatz §6.3 formally proves Bounded Waiting (max 1 turn wait on sequentially consistent hardware); its real limits are 2-process scope, busy-waiting, and weak memory ordering.</p>

  <h3>4. Hardware Synchronization &amp; Atomics (§6.4)</h3>
  <p>Disabling interrupts (<code>CLI</code>/<code>STI</code>) prevents context switches on a uniprocessor, but fails to scale on multi-core CPUs (sending IPIs across 64 cores kills throughput and skews system clocks). Instead, modern hardware provides <strong>uninterruptible (atomic) instructions</strong> (Silberschatz 10th Ed. names these lowercase <code>test_and_set</code> / <code>compare_and_swap</code>; Slide 10 also covers 2-process <code>Swap(&amp;a, &amp;b)</code> and <em>n</em>-process <code>TestAndSet</code> with <code>waiting[n]</code>):</p>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>TestAndSet (&amp;target)</h4>
      <pre class="code-block">boolean TestAndSet(boolean *target) {
    boolean rv = *target;
    *target = true;
    return rv;
}
// Mutex usage:
while (TestAndSet(&amp;lock)) ; // spin
    /* critical section */
lock = false;</pre>
      <p><em>Flaw:</em> Naive loop guarantees Mutual Exclusion &amp; Progress, <strong>NOT Bounded Waiting</strong> (one lucky core can keep grabbing <code>lock</code>!). Adding a circular <code>waiting[n]</code> scan grants Bounded Waiting.</p>
      <p><em>Edition Note:</em> Silberschatz 10th Ed. Fig. 6.9 implements circular <code>waiting[n]</code> Bounded Waiting using <code>compare_and_swap(&amp;lock, 0, 1)</code> (9th Ed. and Slide 10 showed the same <code>waiting[n]</code> scan with <code>TestAndSet</code>).</p>
    </div>
    <div class="compare-card">
      <h4>CompareAndSwap (&amp;val, exp, new)</h4>
      <pre class="code-block">int CompareAndSwap(int *v, int exp, int nw) {
    int temp = *v;
    if (*v == exp)
        *v = nw;
    return temp;
}
// Mutex usage (0=unlocked, 1=locked):
while (CompareAndSwap(&amp;lock, 0, 1) != 0) ;
    /* critical section */
lock = 0;</pre>
      <p>Also powers lock-free <strong>Atomic Variables</strong> (e.g., <code>increment(&amp;v)</code> via CAS retry loop, §6.4.3). <em>Crucial Caveat:</em> Atomic integers protect single-variable increments, NOT multi-step invariants like two consumers both checking <code>count &gt; 0</code> simultaneously when <code>count == 1</code>!</p>
    </div>
  </div>

  <h3>5. Mutex Locks &amp; Spinlocks (§6.5)</h3>
  <p>An OS <strong>Mutex Lock</strong> exposes <code>acquire()</code> and <code>release()</code> around critical sections using an atomic <code>available</code> boolean. Notice <em>lock contention</em> occurs whenever a thread blocks/spins waiting on a held mutex. When implemented via busy waiting (spinning in a loop), it is called a <strong>Spinlock</strong>.</p>
  <ul>
    <li><strong>When Spinlocks Win (Multi-Core + "Short Duration" Hold):</strong> Zero context-switch overhead! Silberschatz §6.5 formally defines a <em>short</em> lock duration as <strong>less than two context switches</strong> (~1–5 &mu;s): spinning on Core B while Core A finishes beats sleeping and waking up.</li>
    <li><strong>When Spinlocks Fail (Single-Core!):</strong> On a 1-core CPU, the spinning process burns its entire remaining time quantum stopping the lock holder from even running to call <code>release()</code>!</li>
  </ul>
</div>
""",
    },
    "deck_11": {
        "title": "SEMAPHORES, MONITORS & PRODUCER-CONSUMER",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 6 (§6.6–§6.9) & Chapter 7 (§7.1.1)",
        "formulas": "wait(S): S.val--; if (S.val &lt; 0) block(S.list)  [sleep() in 10th Ed.]<br>signal(S): S.val++; if (S.val &le; 0) wakeup(S.list)<br>Invariant: If S.val &lt; 0, then |S.val| == count of blocked processes<br>Bounded Buffer Semaphores: mutex = 1, empty = N, full = 0",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 11 · OS SYNCHRONIZATION PRIMITIVES · SILBERSCHATZ §6.6–§6.9 &amp; §7.1.1</div>
    <h2 class="theory-heading">Semaphores, Block/Wakeup Queues, Monitors &amp; Producer-Consumer</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §6.6–§6.9 &amp; §7.1.1 · Core Topic Scope (Practice Q5)</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Define Counting and Binary Semaphores along with atomic <code>wait()</code> (P) and <code>signal()</code> (V) operations (§6.6).</li>
      <li>Trace <strong>Non-Busy-Waiting Semaphores</strong> and interpret negative <code>S.value</code> magnitudes cleanly (§6.6.2).</li>
      <li>Solve crossed-semaphore deadlocks (Mock Midterm Q5, §6.8.1) and explain <strong>Priority Inversion &amp; Inheritance</strong> (§6.8.2–§6.9).</li>
      <li>Trace the 3-semaphore Bounded-Buffer solution (incl. Slide 11's <code>N = 6</code> trace) and explain why <code>wait(empty)</code> MUST precede <code>wait(mutex)</code> (§7.1.1).</li>
      <li>Master <strong>Monitors &amp; Condition Variables</strong> (<code>x.wait()</code>, <code>x.signal()</code>) and <em>Signal-and-Wait</em> vs. <em>Signal-and-Continue</em> semantics (§6.7, textbook extension beyond Slide 11).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Parking Garage Gates, Shop Bells &amp; The Ambulance Tunnel</div>
    <ul>
      <li><strong>Naive Attempts &rarr; Visible Failure:</strong> Busy-waiting <code>while (S &le; 0);</code> stalls a 1-core CPU until its quantum expires (§6.6.2). Switching to <code>sleep()</code>/<code>block()</code> stops CPU waste, yet writing <code>wait(mutex); wait(empty);</code> in Producer-Consumer deadlocks the moment the buffer fills (<code>empty == 0</code>): Producer sleeps holding <code>mutex</code>, so Consumer can never enter to drain an item and call <code>signal(empty)</code>!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Counting Semaphores are <strong>parking garage entry/exit gates</strong> tracking two live tallies (<code>empty</code> open bays, <code>full</code> parked cars) plus a 1-key booth mutex; negative <code>S-&gt;value = &minus;3</code> means 3 cars queued in the waiting lane. <em>Where the analogy breaks (Semaphore vs. Monitor Condition Variable):</em> A Semaphore remembers every past <code>signal()</code> inside its integer counter (<code>S-&gt;value++</code>), whereas a Monitor's <code>x.signal()</code> (§6.7.1) is a shop counter bell—if nobody is standing at the bell, the ring vanishes completely! And Priority Inversion (§6.8.2) is an express ambulance (<strong>H</strong>) trapped behind a slow truck (<strong>L</strong>) in a 1-lane tunnel while endless commuter cars (<strong>M</strong>) cut off <strong>L</strong>'s CPU time—until Priority Inheritance puts an ambulance siren on <strong>L</strong>.</li>
      <li><strong>Why Each Rule Exists:</strong> Why <code>S-&gt;value--</code> runs <em>before</em> testing <code>S-&gt;value &lt; 0</code> (§6.6.2: keeps <code>|S-&gt;value|</code> equal to exact sleeping queue size); why availability waits (<code>empty</code>/<code>full</code>) MUST wrap <em>outside</em> <code>mutex</code>.</li>
    </ul>
  </div>

  <h3>1. Semaphores &amp; Non-Busy-Waiting Queues (§6.6)</h3>
  <p>A <strong>Semaphore</strong> <code>S</code> (introduced by Edsger Dijkstra: <em>P</em> = <em>proberen</em> "test" / <code>wait</code>, <em>V</em> = <em>verhogen</em> "increment" / <code>signal</code>) is an integer variable accessed strictly through initialization and two atomic operations:</p>
  <ul>
    <li><strong>Binary Semaphore:</strong> Value ranges only over <code>{0, 1}</code>—equivalent in function to a mutex lock.</li>
    <li><strong>Counting Semaphore:</strong> Value ranges over an unrestricted integer domain—controls access to a resource pool with <code>K</code> identical instances (initialized to <code>K</code>) or enforces ordering constraints (<code>S = 0</code> so T<sub>2</sub> waits for <code>signal(S)</code> from T<sub>1</sub>).</li>
  </ul>

  <pre class="code-block">typedef struct {
    int value;
    struct process *list; // Waiting PCB queue
} semaphore;

void wait(semaphore *S) {
    S-&gt;value--;
    if (S-&gt;value &lt; 0) {
        add this process to S-&gt;list;
        block();   // Moves caller to Waiting state (Silberschatz 10th Ed. names this sleep())
    }
}

void signal(semaphore *S) {
    S-&gt;value++;
    if (S-&gt;value &lt;= 0) {
        remove a process P from S-&gt;list;
        wakeup(P); // Moves P from Waiting &rarr; Ready queue
    }
}</pre>
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Crucial Exam Property: Negative Semaphore Magnitude</div>
    In the block/wakeup implementation above (Slide 11 calls it <code>block()</code>; Silberschatz §6.6.2 calls it <code>sleep()</code>), <code>S-&gt;value</code> <strong>CAN become negative!</strong> When <code>S-&gt;value &lt; 0</code>, its absolute value <code>|S-&gt;value|</code> equals the exact number of processes currently asleep on <code>S-&gt;list</code>. For instance, if <code>S</code> starts at <code>2</code> and 5 threads execute <code>wait(S)</code>, final <code>S-&gt;value = -3</code>, meaning <strong>3 threads are blocked</strong> waiting on <code>S</code>. (Note: Slide 11 also demonstrates <code>pthread_mutex_t</code> in C with two threads incrementing a counter 100,000 times and traces a 6-slot bounded buffer starting mid-run at <code>mutex=1, empty=3, full=3</code>.)
  </div>

  <h3>2. Deadlock &amp; Priority Inversion Pitfalls (§6.8.1–§6.8.2, §6.9 &amp; Mock Midterm Q5)</h3>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>Crossed Wait Deadlock (§6.8.1 &amp; Mock Q5)</h4>
      <pre class="code-block">// Initial: S = 1, Q = 1
Thread T1:        Thread T2:
wait(S);          wait(Q);
wait(Q);          wait(S); // DEADLOCK!</pre>
      <p><strong>Trace:</strong> T<sub>1</sub> grabs <code>S</code> (S=0), context switch &rarr; T<sub>2</sub> grabs <code>Q</code> (Q=0). Now T<sub>1</sub> blocks on <code>wait(Q)</code> while holding <code>S</code>, and T<sub>2</sub> blocks on <code>wait(S)</code> while holding <code>Q</code>! <strong>Mock Q5.A Print Test:</strong> <code>"12"</code>, <code>"21"</code>, or nothing (deadlock) are possible; <em>only <code>"1"</code></em> is IMPOSSIBLE because once T<sub>1</sub> finishes printing it immediately signals both locks so T<sub>2</sub> finishes! <strong>Fix:</strong> Enforce canonical resource ordering—make both T<sub>1</sub> and T<sub>2</sub> execute <code>wait(S)</code> before <code>wait(Q)</code>.</p>
    </div>
    <div class="compare-card">
      <h4>Priority Inversion &amp; Inheritance (§6.8.2 &amp; §6.9)</h4>
      <p>Low-priority process <strong>L</strong> holds lock <code>R</code> needed by high-priority process <strong>H</strong>. Medium-priority process <strong>M</strong> (needing no lock) preempts <strong>L</strong>, delaying <strong>L</strong> indefinitely and indirectly starving <strong>H</strong>! (Famously reset NASA's Mars Pathfinder, §6.9 box!).<br><strong>Fix — Priority Inheritance Protocol (§6.8.2):</strong> Temporarily elevate <strong>L</strong>'s priority to <strong>H</strong>'s priority until <strong>L</strong> releases lock <code>R</code>.</p>
    </div>
  </div>

  <h3>3. Bounded-Buffer Solution Using Semaphores (§7.1.1)</h3>
  <p>We initialize three semaphores: <code>mutex = 1</code> (mutual exclusion on buffer array), <code>empty = N</code> (counts free buffer slots), <code>full = 0</code> (counts filled buffer slots).</p>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>Producer Process</h4>
      <pre class="code-block">while (true) {
    /* produce item in next_produced */
    wait(empty);   // 1. Reserve an empty slot
    wait(mutex);   // 2. Enter critical section

    /* add next_produced to buffer */

    signal(mutex); // 3. Leave critical section
    signal(full);  // 4. Announce +1 full item
}</pre>
    </div>
    <div class="compare-card">
      <h4>Consumer Process</h4>
      <pre class="code-block">while (true) {
    wait(full);    // 1. Wait for a full item
    wait(mutex);   // 2. Enter critical section

    /* remove item from buffer */

    signal(mutex); // 3. Leave critical section
    signal(empty); // 4. Announce +1 free slot
    /* consume item in next_consumed */
}</pre>
    </div>
  </div>
  <p><strong>Order Trap:</strong> If Producer swapped the first two lines to <code>wait(mutex); wait(empty);</code> while buffer is full (<code>empty == 0</code>), Producer acquires <code>mutex</code> and goes to sleep on <code>empty</code>; Consumer then tries <code>wait(mutex)</code> to drain the buffer and blocks forever &rarr; <strong>Instant Deadlock!</strong> Always acquire resource-counting semaphores <em>before</em> mutual-exclusion locks.</p>

  <h3>4. Monitors &amp; Condition Variables (Silberschatz §6.7 — Textbook Beyond Slides)</h3>
  <p>Because forgetting a single <code>signal()</code> or swapping two <code>wait()</code> calls corrupts semaphores silently, compilers provide a high-level construct called a <strong>Monitor</strong>: an abstract data type encapsulating private shared data plus public procedures such that <strong>only one process can be active inside the monitor at any time</strong>. (<em>Scope note:</em> Slide 11 focuses on Semaphores; Monitors are full Silberschatz §6.7 textbook coverage.)</p>
  <ul>
    <li><strong>Condition Variables (<code>condition x, y;</code>):</strong> Support two operations inside a monitor:
      <br>&bull; <code>x.wait()</code>: Suspends the calling process on queue <code>x</code> and <strong>automatically releases the monitor lock</strong> until another process invokes <code>x.signal()</code>.
      <br>&bull; <code>x.signal()</code>: Resumes <em>exactly one</em> suspended process on <code>x</code>. <strong>Crucial Contrast vs. Semaphores:</strong> If no process is waiting on <code>x</code>, <code>x.signal()</code> does <strong>nothing (signal is lost!)</strong>, whereas semaphore <code>signal(S)</code> always increments <code>S.value</code> for future arrivals!
    </li>
    <li><strong>Signal-and-Wait vs. Signal-and-Continue (§6.7.1) when <code>P</code> executes <code>x.signal()</code> waking <code>Q</code>:</strong>
      <br>&bull; <em>Signal and Wait (Hoare, §6.7.2):</em> Signaling process <code>P</code> waits until <code>Q</code> leaves the monitor or waits for another condition (condition still holds when <code>Q</code> resumes).
      <br>&bull; <em>Signal and Continue (commonly called Mesa semantics in POSIX/Java):</em> <code>Q</code> waits until <code>P</code> leaves the monitor—so the guarded condition may no longer hold when <code>Q</code> runs, making a <code>while (!cond) x.wait();</code> re-check essential!
    </li>
  </ul>
</div>
""",
    },
    "deck_12": {
        "title": "READERS-WRITERS & DINING PHILOSOPHERS",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 7 (§7.1.2–§7.1.3)",
        "formulas": "First Readers-Writers: rw_mutex = 1, mutex = 1, read_count = 0<br>First Reader locks rw_mutex (read_count == 1)<br>Last Reader unlocks rw_mutex (read_count == 0)<br>Dining Philosophers Asymmetric Rule: Odd grabs Left first; Even grabs Right first",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 12 · CLASSIC SYNCHRONIZATION PROBLEMS · SILBERSCHATZ §7.1.2–§7.1.3</div>
    <h2 class="theory-heading">The Readers-Writers &amp; Dining Philosophers Problems (Full Textbook Analysis)</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 7 (§7.1.2–§7.1.3) · Midterm &amp; Final Exam Scope</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Formulate the synchronization constraints of shared database access in the <strong>Readers-Writers Problem</strong> (§7.1.2).</li>
      <li>Trace the <strong>First Readers-Writers Algorithm</strong> line by line and prove why only the 1st and last reader touch <code>rw_mutex</code>.</li>
      <li>Compare First (Reader-priority &rarr; Writer starvation) vs. Second (Writer-priority &rarr; Reader starvation) vs. Starvation-Free Reader-Writer Locks.</li>
      <li>Prove how naive <strong>Dining Philosophers</strong> deadlocks via simultaneous left-chopstick acquisition (§7.1.3).</li>
      <li>Master <strong>all 3 Semaphore deadlock remedies</strong> (§7.1.3.1, covered in Slide 12) plus Silberschatz's <strong>Monitor Solution</strong> (§7.1.3.2 — deadlock-free, though starvation remains possible!).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: The Museum Guest Clipboard &amp; Why Deadlock-Free &ne; Starvation-Free</div>
    <ul>
      <li><strong>Naive Attempts &rarr; Visible Failure:</strong> Locking <code>rw_mutex</code> on every single reader destroys concurrent reading throughput; letting subsequent readers skip waiting once <code>read_count &gt; 0</code> lets a steady relay of incoming readers starve waiting writers (First R-W). In Dining Philosophers, initializing <code>chopstick[5] = {1..1}</code> with naive <em>"left then right"</em> freezes all 5 in circular wait!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> <strong>Readers-Writers</strong> is a <strong>museum gallery with a guest sign-in clipboard</strong> (<code>mutex</code> guards <code>read_count</code>): the <em>very first</em> visitor flips the front sign to <code>"Closed for Maintenance"</code> (<code>wait(rw_mutex)</code>), all arriving guests enter together, and only the <em>very last</em> guest leaving flips the sign back (<code>signal(rw_mutex)</code>). <strong>Dining Philosophers Monitor (§7.1.3.2)</strong> puts a smart waiter in charge of chopsticks—<em>where the intuition breaks:</em> eliminating deadlock does <strong>NOT</strong> eliminate starvation! Even in the Monitor solution, two neighbors P<sub>0</sub> and P<sub>2</sub> can alternate eating shifts forever while P<sub>1</sub> sits permanently <code>HUNGRY</code> (§7.1.3.2!).</li>
      <li><strong>Why Each Formula Exists:</strong> Asymmetric Odd/Even pickup ensures every adjacent odd/even pair competes for the <em>same</em> first chopstick instead of chasing tails (<em>Convention note:</em> Silberschatz treats <code>chopstick[i]</code> as left, whereas Slide 12's asymmetric diagram numbers <code>chopstick[i]</code> as right—both break the circle!); <code>(i + 4) % 5</code> replaces <code>(i - 1) % 5</code> so C's negative modulo doesn't index <code>state[-1]</code>!</li>
    </ul>
  </div>

  <h3>1. The Readers-Writers Problem (Silberschatz §7.1.2)</h3>
  <p>A shared database or file is accessed concurrently by <strong>Readers</strong> (who only inspect data) and <strong>Writers</strong> (who both read and modify data):</p>
  <ul>
    <li>Multiple Readers may read <strong>simultaneously</strong> without harming consistency.</li>
    <li>A Writer requires <strong>strict exclusive access</strong>: no other Reader and no other Writer may be active while a Writer updates.</li>
  </ul>

  <div class="compare-grid">
    <div class="compare-card">
      <h4>First Readers-Writers (Reader Priority)</h4>
      <p>No Reader is kept waiting unless a Writer already holds the database.</p>
      <pre class="code-block">semaphore rw_mutex = 1; // locks DB for writers
semaphore mutex = 1;    // guards read_count
int read_count = 0;

// WRITER PROCESS:
while (true) {
    wait(rw_mutex);
    /* writing is performed */
    signal(rw_mutex);
}</pre>
    </div>
    <div class="compare-card">
      <h4>Reader Process (First R-W Solution)</h4>
      <pre class="code-block">while (true) {
    wait(mutex);
    read_count++;
    if (read_count == 1)
        wait(rw_mutex); // 1st reader locks out writers
    signal(mutex);

    /* reading is performed (N concurrent readers!) */

    wait(mutex);
    read_count--;
    if (read_count == 0)
        signal(rw_mutex); // last reader unlocks writers
    signal(mutex);
}</pre>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Starvation Analysis: First vs. Second Readers-Writers &amp; Kernel RW-Locks</div>
    <ul>
      <li><strong>First Readers-Writers Weakness:</strong> While Reader 1 is still reading, Readers 2, 3, 4&hellip; keep entering so <code>read_count</code> never drops back to <code>0</code>! Waiting <strong>Writers may starve indefinitely</strong>!</li>
      <li><strong>Second Readers-Writers Variant:</strong> Once a Writer is ready, no <em>new</em> Readers may start reading; waiting Writers jump ahead. <em>Trade-off:</em> Now <strong>Readers may starve</strong> behind a steady stream of Writers!</li>
      <li><strong>Modern OS Solution (Reader-Writer Locks):</strong> Systems like Linux/POSIX (<code>pthread_rwlock_t</code>) provide dedicated reader-writer locks useful whenever reading dominates writing (&gt;80% reads) and typically enforce FIFO queueing to avoid starving either side.</li>
    </ul>
  </div>

  <h3>2. The Dining Philosophers Problem (Silberschatz §7.1.3)</h3>
  <p>Five philosophers sit around a circular table with 5 single chopsticks (<code>semaphore chopstick[5] = {1,1,1,1,1};</code>) placed between each pair. To eat, philosopher <code>i</code> needs <strong>both</strong> left chopstick <code>i</code> and right chopstick <code>(i + 1) % 5</code>.</p>
  <pre class="code-block">// NAIVE BROKEN SOLUTION FOR PHILOSOPHER i:
while (true) {
    wait(chopstick[i]);            // grab left chopstick
    wait(chopstick[(i + 1) % 5]);  // grab right chopstick
    /* eat for awhile */
    signal(chopstick[i]);          // put down left
    signal(chopstick[(i + 1) % 5]);// put down right
    /* think for awhile */
}</pre>
  <p><strong>Why It Deadlocks:</strong> If all 5 philosophers grow hungry simultaneously and execute <code>wait(chopstick[i])</code> before any reaches the second <code>wait</code>, all 5 elements of <code>chopstick[]</code> become <code>0</code>. Now all 5 philosophers block forever on <code>chopstick[(i+1)%5]</code> holding 1 chopstick each—forming a textbook <strong>Circular Wait Deadlock!</strong></p>

  <h3>3. All Four Deadlock Remedies (§7.1.3.1 Semaphore Remedies &amp; §7.1.3.2 Monitor)</h3>
  <table class="data-table">
    <thead>
      <tr><th>Remedy (§7.1.3)</th><th>Mechanism</th><th>Deadlock-Free?</th><th>Starvation-Free?</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Seat Cap (&le; 4)</strong></td><td>Allow at most 4 philosophers at a 5-chopstick table via counting semaphore <code>room = 4</code>. (Pigeonhole principle: at least 1 gets both!)</td><td>YES</td><td>Not guaranteed</td></tr>
      <tr><td><strong>2. All-or-Nothing Critical Section</strong></td><td>Philosopher picks up chopsticks <em>only if both are free</em> inside a mutex lock.</td><td>YES</td><td>NO (conspiracy / starvation possible)</td></tr>
      <tr><td><strong>3. Asymmetric Pickup Order</strong></td><td><strong>Odd-numbered</strong> philosophers pick up Left first then Right; <strong>Even-numbered</strong> pick up Right first then Left! (Breaks circular symmetry!)</td><td><strong>YES</strong></td><td>Not guaranteed</td></tr>
      <tr><td><strong>4. Monitor State Solution (§7.1.3.2, textbook)</strong></td><td>Philosophers enter a Monitor only picking up chopsticks if <strong>neither neighbor is EATING</strong>.</td><td><strong>YES</strong></td><td><strong>NO</strong> (Silberschatz §7.1.3.2: alternating neighbors can still starve a philosopher!)</td></tr>
    </tbody>
  </table>

  <pre class="code-block">monitor DiningPhilosophers {
    enum { THINKING, HUNGRY, EATING } state[5];
    condition self[5];

    void test(int i) {
        if ((state[(i + 4) % 5] != EATING) &amp;&amp;
            (state[i] == HUNGRY) &amp;&amp;
            (state[(i + 1) % 5] != EATING)) {
            state[i] = EATING;
            self[i].signal(); // wakes Pi if hungry, no effect during putdown if neighbor already awake
        }
    }
    void pickup(int i) {
        state[i] = HUNGRY;
        test(i);
        if (state[i] != EATING) self[i].wait();
    }
    void putdown(int i) {
        state[i] = THINKING;
        test((i + 4) % 5); // test LEFT neighbor
        test((i + 1) % 5); // test RIGHT neighbor
    }
    initialization_code() { for (int i = 0; i &lt; 5; i++) state[i] = THINKING; }
}</pre>
  <p><em>Exam Proof Insight (§7.1.3.2):</em> No two adjacent neighbors can ever eat simultaneously because <code>test(i)</code> enforces <code>state[(i+4)%5] != EATING</code> and <code>state[(i+1)%5] != EATING</code>! Even better, <code>putdown(i)</code> directly tests both neighbors—guaranteeing <strong>deadlock freedom</strong> cleanly. However, Silberschatz §7.1.3.2 explicitly cautions that <strong>starvation is still possible</strong> here (e.g., if P<sub>0</sub> and P<sub>2</sub> alternate holding EATING state while P<sub>1</sub> stays HUNGRY); note also Slide 12 stops after the 3 Semaphore remedies (§7.1.3.1).</p>
</div>
""",
    },
    "deck_13": {
        "title": "DEADLOCK CHARACTERIZATION, COFFMAN & PREVENTION",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 8 (§8.1–§8.5)",
        "formulas": "4 Necessary Coffman Conditions: Mutual Exclusion, Hold &amp; Wait, No Preemption, Circular Wait<br>RAG No Cycle &rArr; NO Deadlock<br>RAG Cycle + Single Instance/Resource &rArr; DEFINITE Deadlock<br>RAG Cycle + Multi-Instance &rArr; POSSIBLE Deadlock (check Safe/Sink!)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 13 · DEADLOCK FOUNDATIONS · SILBERSCHATZ CH. 8 (§8.1–§8.5)</div>
    <h2 class="theory-heading">Deadlock Characterization, Resource-Allocation Graphs (RAG) &amp; Prevention</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 8 (§8.1–§8.5) · CPCS-361 Final Exam Core</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Define Deadlock rigorously and distinguish <strong>Deadlock</strong> (blocked Waiting state) from <strong>Livelock</strong> (running, repeatedly retrying and failing) (§8.1–§8.2.1).</li>
      <li>State all <strong>4 Coffman Necessary Conditions</strong> that must hold simultaneously for deadlock (§8.3.1).</li>
      <li>Construct and analyze <strong>Resource-Allocation Graphs (RAG)</strong> with Request Edges and Assignment Edges (§8.3.2).</li>
      <li>Distinguish between <strong>Single-Instance RAG</strong> (cycle = deadlock) vs. <strong>Multi-Instance RAG</strong> (cycle &ne; always deadlock!).</li>
      <li>Compare OS handling strategies (§8.4) and design <strong>Deadlock Prevention</strong> protocols breaking each of the 4 Coffman conditions, especially Total Resource Ordering (§8.5.4).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Kansas Trains, Hallway Dance &amp; Two-Lane Roundabouts</div>
    <ul>
      <li><strong>Naive Fixes &rarr; Visible Failure:</strong> Replacing blocking locks with non-blocking <code>pthread_mutex_trylock()</code> + release-and-retry (§8.2.1 Fig. 8.2) cures deadlock yet falls into <strong>Livelock</strong> whenever threads retry in lockstep! Trying to break Mutual Exclusion or Hold-and-Wait naively either corrupts non-shareable writes or starves resource utilization. Even static parameter ordering <code>transfer(from, to)</code> still deadlocks on concurrent opposing calls unless ordered by immutable unique object ID (§8.5.4 Fig. 8.7)!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> <strong>Deadlock</strong> is the old Kansas railway joke: two trains halted forever at a crossing because neither may move until the other has passed; <strong>Livelock</strong> is two overly polite people stepping left-right identically in a hallway without moving forward; a <strong>Multi-Instance RAG cycle without deadlock (Fig. 8.6)</strong> is a <em>2-lane traffic circle</em>—even if two inner-lane cars wait on each other, an outer-lane car (T<sub>2</sub> or T<sub>4</sub>) exits freely and opens a lane! <em>Where street-sign analogies break:</em> Static lock numbering fails when arguments swap roles dynamically (<code>Acct_A &rarr; Acct_B</code> vs <code>Acct_B &rarr; Acct_A</code>)—order must compare immutable IDs (<code>min(id) &rarr; max(id)</code>).</li>
      <li><strong>Why Each Rule Exists:</strong> Total Ordering <code>F: R &rarr; N</code> makes a closed loop impossible because ascending order along a cycle forces <code>F(R<sub>0</sub>) &lt; F(R<sub>1</sub>) &lt; &hellip; &lt; F(R<sub>0</sub>)</code> (contradiction!). Cycle = guaranteed deadlock only with 1 instance per box because zero spare outer lanes exist!</li>
    </ul>
  </div>

  <h3>1. System Model &amp; Deadlock vs. Livelock (§8.1–§8.2.1)</h3>
  <p>A system contains resource types <code>R<sub>1</sub>, R<sub>2</sub>, &hellip;, R<sub>m</sub></code> (CPU cycles, memory space, files, mutex locks), each having <code>W<sub>i</sub></code> indistinguishable instances (Slide 13 notes <strong>shareable</strong> resources like read-only files never cause deadlocks, while <strong>non-shareable</strong> ones like printers or mutexes do). Every thread utilizes a resource in 3 strict phases: <strong>Request &rarr; Use &rarr; Release</strong>.</p>
  <p><strong>Deadlock</strong> occurs when every thread in a set is permanently blocked (Waiting state) waiting for an event that only another thread inside the exact same blocked set can cause (§8.2 discusses multithreaded mutex deadlocks). Contrast with <strong>Livelock (§8.2.1)</strong> (two people politely stepping left-right in sync in a hallway forever): threads are <em>actively executing</em> and repeatedly failing/retrying rather than sleeping, solvable via randomized exponential backoff.</p>

  <h3>2. The Four Necessary Coffman Conditions (§8.3.1)</h3>
  <div class="callout callout-definition">
    <div class="callout-title">📜 Textbook Theorem: Necessary Conditions for Deadlock</div>
    All four conditions must hold <strong>simultaneously</strong> in a system for a deadlock to arise. Breaking <em>any single one</em> guarantees deadlock cannot occur:
    <ol>
      <li><strong>Mutual Exclusion:</strong> At least one resource must be held in a non-sharable mode (only one thread can use an instance at any instant; e.g., mutex lock or printer).</li>
      <li><strong>Hold and Wait:</strong> A thread must currently be holding at least one resource while waiting to acquire additional resources currently held by other threads.</li>
      <li><strong>No Preemption:</strong> Resources cannot be forcibly taken away; a resource can only be released voluntarily by the thread holding it after completing its task.</li>
      <li><strong>Circular Wait:</strong> A closed chain of waiting threads {T<sub>0</sub>, T<sub>1</sub>, &hellip;, T<sub>n</sub>} exists such that T<sub>0</sub> waits for a resource held by T<sub>1</sub>, T<sub>1</sub> waits for T<sub>2</sub>, &hellip;, and T<sub>n</sub> waits for a resource held by T<sub>0</sub>. (Note: Circular Wait <em>implies</em> Hold and Wait!)</li>
    </ol>
  </div>

  <h3>3. Resource-Allocation Graphs (RAG — §8.3.2)</h3>
  <p>A directed bipartite graph <code>G = (V, E)</code> where vertices partition into Threads/Processes <code>T = {T<sub>1</sub>, &hellip;, T<sub>n</sub>}</code> (circles; Slide 13 writes <code>P<sub>1</sub>..P<sub>n</sub></code>) and Resource Types <code>R = {R<sub>1</sub>, &hellip;, R<sub>m</sub>}</code> (rectangles containing dots for instances):</p>
  <ul>
    <li><strong>Request Edge (<code>T<sub>i</sub> &rarr; R<sub>j</sub></code>):</strong> Directed from thread to resource box edge; thread T<sub>i</sub> has requested an instance of R<sub>j</sub> and is waiting.</li>
    <li><strong>Assignment Edge (<code>R<sub>j</sub> &rarr; T<sub>i</sub></code>):</strong> Directed from a specific instance dot inside R<sub>j</sub> to thread T<sub>i</sub>; an instance of R<sub>j</sub> has been allocated to T<sub>i</sub>.</li>
  </ul>
  <div class="ascii-diagram">EXAMPLE A — MULTI-INSTANCE WITH DEADLOCK (Fig. 8.4–8.5):   EXAMPLE B — MULTI-INSTANCE CYCLE, NO DEADLOCK (Fig. 8.6):
  R1 (1 dot &rarr; T2),   R3 (1 dot &rarr; T3)                         T1 ──req──&gt; R1 (2 dots: Dot1 &rarr; T2, Dot2 &rarr; T3)
  R2 (2 dots: Dot1 &rarr; T1, Dot2 &rarr; T2), R4 (3 free dots)        T3 ──req──&gt; R2 (2 dots: Dot1 &rarr; T1, Dot2 &rarr; T4)
  Requests: T1 &rarr; R1,  T2 &rarr; R3,  T3 &rarr; R2 (triggers jam!)     [Cycle: T1 &rarr; R1 &rarr; T3 &rarr; R2 &rarr; T1 exists!]
  Cycles: T1&rarr;R1&rarr;T2&rarr;R3&rarr;T3&rarr;R2&rarr;T1  AND  T2&rarr;R3&rarr;T3&rarr;R2&rarr;T2      &rArr; NOT DEADLOCKED! Why? T2 &amp; T4 hold NO requests!
  &rArr; T1, T2, T3 form locked cycles (NO free escape!).         T4 finishes &amp; frees R2 &rarr; T3 runs &rarr; frees R1 &rarr; T1 runs!</div>

  <table class="data-table">
    <thead>
      <tr><th>Graph Observation</th><th>Single-Instance Resources</th><th>Multi-Instance Resources</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>No Cycle in RAG</strong></td><td><strong>NO DEADLOCK</strong></td><td><strong>NO DEADLOCK</strong></td></tr>
      <tr><td><strong>Cycle Exists in RAG</strong></td><td><strong>DEFINITE DEADLOCK</strong> (Cycle is <em>necessary &amp; sufficient</em>!)</td><td><strong>MAY OR MAY NOT BE DEADLOCKED</strong> (Cycle is <em>necessary, NOT sufficient</em>!)</td></tr>
    </tbody>
  </table>

  <h3>4. Approaches &amp; Deadlock Prevention (§8.4–§8.5)</h3>
  <p>OS designers handle deadlocks via (§8.4): (1) <strong>Prevention / Avoidance</strong> (ensure system never enters deadlock), (2) <strong>Detection &amp; Recovery</strong> (detect and break deadlocks), or (3) <strong>Ignore</strong> ("Ostrich Algorithm"—Linux, Windows, UNIX treat rare programmer deadlocks as application bugs).</p>
  <p><strong>Deadlock Prevention (§8.5)</strong> constrains how requests are made so at least one Coffman condition cannot possibly hold:</p>
  <table class="data-table">
    <thead>
      <tr><th>Coffman Condition Targeted</th><th>Prevention Mechanism (§8.5.1–§8.5.4)</th><th>Practical Feasibility / Drawback</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Break Mutual Exclusion</strong></td><td>Make resources inherently sharable (e.g., read-only files).</td><td><strong>Often Impossible!</strong> Mutexes and write-locks are intrinsically non-sharable.</td></tr>
      <tr><td><strong>2. Break Hold &amp; Wait</strong></td><td>Protocol A: Request &amp; acquire <em>all</em> resources before starting.<br>Protocol B: Allow requesting new resources <em>only when holding none</em> (release all held first).</td><td><strong>Low resource utilization</strong> (locks idle for hours) + risk of <strong>Starvation</strong> if popular resource sets are contested.</td></tr>
      <tr><td><strong>3. Break No Preemption</strong></td><td>If T<sub>i</sub> holds R<sub>1</sub> and requests busy R<sub>2</sub> that cannot be granted immediately, implicitly <strong>release all resources T<sub>i</sub> currently holds</strong> (or preempt R<sub>2</sub> from another waiting thread).</td><td>Only works cleanly when state is easy to save/restore (CPU registers, memory pages); breaks down for mutexes/printers.</td></tr>
      <tr><td><strong>4. Break Circular Wait</strong></td><td><strong>Total Ordering <code>F: R &rarr; N</code>:</strong> Assign every resource type a unique integer ID (e.g., <code>F(mutex1)=1, F(mutex2)=5</code>) and require threads to acquire resources strictly in <strong>increasing numerical order</strong>!</td><td><strong>MOST PRACTICAL IN REAL KERNELS!</strong> Proof: Suppose a cycle existed: <code>F(R<sub>0</sub>) &lt; F(R<sub>1</sub>) &lt; &hellip; &lt; F(R<sub>n</sub>) &lt; F(R<sub>0</sub>)</code> &rArr; <code>F(R<sub>0</sub>) &lt; F(R<sub>0</sub>)</code>, impossible contradiction! (<em>Gotcha:</em> Hierarchical locks like <code>lock(A); lock(B)</code> don't cover dynamic parameters like <code>transfer(from, to)</code> unless ordered by <code>min(id) &rarr; max(id)</code>).</td></tr>
    </tbody>
  </table>
</div>
""",
    },
    "deck_14": {
        "title": "DEADLOCK AVOIDANCE & BANKER'S ALGORITHM",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 8 (§8.6)",
        "formulas": "Need[i][j] = Max[i][j] &minus; Allocation[i][j]<br>Safety Test: Finish[i] == false AND Need<sub>i</sub> &le; Work<br>On Success: Work = Work + Allocation<sub>i</sub>; Finish[i] = true<br>Complexity: O(m &times; n<sup>2</sup>)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 14 · DYNAMIC RESOURCE SAFETY · SILBERSCHATZ §8.6</div>
    <h2 class="theory-heading">Deadlock Avoidance, Safe States &amp; The Banker's Algorithm (Full Matrix Trace)</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 8 (§8.6) · CPCS-361 Final Exam Core Numerical Problem</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Compare Deadlock Prevention (static rules) vs. <strong>Deadlock Avoidance</strong> (dynamic <em>a priori</em> max-claim examination) (§8.6).</li>
      <li>Define <strong>Safe State</strong>, <strong>Unsafe State</strong>, and <strong>Deadlock State</strong> rigorously (and know why Unsafe &ne; Deadlock!) (§8.6.1, Fig. 8.8).</li>
      <li>Use <strong>Claim Edges</strong> in single-instance Resource-Allocation Graphs (Fig. 8.9–8.10, §8.6.2).</li>
      <li>Compute the <code>Need</code> Matrix and execute both phases of Dijkstra's <strong>Banker's Algorithm</strong> (Safety + Resource-Request) (§8.6.3).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: The Small-Town Banker &amp; The 12-Tape Cliff</div>
    <ul>
      <li><strong>Naive Greedy Allocation &rarr; Visible Failure (§8.6.1):</strong> Suppose 12 resources exist, T<sub>0</sub>/T<sub>1</sub>/T<sub>2</sub> declare Max (10, 4, 9) and hold (5, 2, 2), leaving <code>Available = 3</code> (&lt;T<sub>1</sub>, T<sub>0</sub>, T<sub>2</sub>&gt; is Safe). Now T<sub>2</sub> requests <code>1</code> unit—plenty sit free (<code>3 &ge; 1</code>)! Yet granting greedily leaves <code>Available = 2</code>: after T<sub>1</sub> finishes, free supply is only <code>4</code>, which satisfies neither T<sub>0</sub> (needs up to <code>5</code> more) nor T<sub>2</sub> (needs up to <code>6</code> more) &rarr; potential deadlock!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Dijkstra modeled a cautious <strong>small-town banker (§8.6.3)</strong>: each customer pre-registers a maximum credit limit (<code>Max</code>), already borrowed <code>Allocation</code>, and can still draw <code>Need = Max &minus; Allocation</code>. Even if cash sits in the vault today, the banker simulates granting the loan to check whether at least ONE sequential repayment ladder exists where every customer finishes and repays in full! <em>Where the analogy breaks:</em> Unlike contracted bank credit lines, real OS processes rarely know their exact lifetime <code>Max</code> upfront, AND an <strong>Unsafe State is not yet bankrupt (Fig. 8.8)</strong>—processes might release early without drawing their full <code>Max</code>!</li>
      <li><strong>Why Each Rule Exists:</strong> <code>Work = Work + Allocation[i]</code> simulates T<sub>i</sub> completing its worst-case <code>Need[i]</code> and returning every unit it holds to the vault; rolling back an UNSAFE pretend grant proves why <em>"available right now &ne; safe tomorrow."</em></li>
    </ul>
  </div>

  <h3>1. Safe State vs. Unsafe State vs. Deadlock (§8.6.1)</h3>
  <p>Instead of rigid global restrictions, Deadlock Avoidance asks every process to declare <em>a priori</em> the <strong>maximum number of instances of each resource type it may ever need</strong>. Before granting any request, the OS checks whether granting keeps the system in a <strong>Safe State</strong>.</p>
  <div class="callout callout-definition">
    <div class="callout-title">📜 Textbook Definition: Safe State &amp; Safe Sequence</div>
    A state is <strong>safe</strong> if the system can allocate resources to each thread (up to its declared maximum) in some order and still avoid deadlock—specifically, there exists a <strong>Safe Sequence</strong> <code>&lt;T<sub>0</sub>, T<sub>1</sub>, &hellip;, T<sub>n&minus;1</sub>&gt;</code> where for every <code>T<sub>i</sub></code>, the resources <code>T<sub>i</sub></code> can still request can be satisfied by currently available resources <em>plus</em> all resources held by earlier threads <code>T<sub>j</sub></code> (<code>j &lt; i</code>).
  </div>
  <div class="ascii-diagram">STATE SPACE DIAGRAM (Silberschatz Fig. 8.8):
┌──────────────────────────────────────────────────────────┐
│                      UNSAFE STATES                       │
│   ┌──────────────┐                                       │
│   │   DEADLOCK   │  &larr; Unsafe means "can reach deadlock   │
│   └──────────────┘    IF processes request their Max!"   │
├──────────────────────────────────────────────────────────┤
│                       SAFE STATES                        │
│              (GUARANTEED zero deadlocks!)                │
└──────────────────────────────────────────────────────────┘</div>
  <p><strong>Exam Traps:</strong> (1) A Safe state is <strong>never deadlocked</strong>. (2) An <strong>Unsafe state is NOT automatically a deadlock</strong>! Processes might exit early without requesting their remaining Max; however, the OS cannot prevent deadlock if processes suddenly demand their full declared Max. (3) Multiple safe sequences can exist for the same system snapshot.</p>

  <h3>2. Single-Instance Avoidance: Claim Edges (§8.6.2, Fig. 8.9–8.10)</h3>
  <p>For single-instance resources, add dashed <strong>Claim Edges (<code>T<sub>i</sub> &rarr; R<sub>j</sub></code>)</strong> showing that T<sub>i</sub> <em>may</em> request R<sub>j</sub> in the future. When T<sub>i</sub> requests R<sub>j</sub>, the dashed Claim Edge converts to a solid Request Edge; when R<sub>j</sub> is granted, it converts to an Assignment Edge. <strong>Avoidance Rule:</strong> Grant the request <strong>only if</strong> converting the Request Edge to an Assignment Edge creates <strong>no cycle</strong> in the RAG (cycle detection runs in <code>O(n<sup>2</sup>)</code>). <em>Textbook Worked Trace (Fig. 8.9–8.10 / Slide 14):</em> Suppose T<sub>1</sub> holds R<sub>1</sub> and claims R<sub>2</sub>, while T<sub>2</sub> requests R<sub>1</sub> and claims R<sub>2</sub>. If R<sub>2</sub> is still free and <strong>T<sub>2</sub></strong> asks for R<sub>2</sub>, converting it yields cycle <code>R<sub>1</sub> &rarr; T<sub>1</sub> &rarr; R<sub>2</sub> &rarr; T<sub>2</sub> &rarr; R<sub>1</sub></code> &rarr; <strong>UNSAFE &amp; DENIED</strong>; if <strong>T<sub>1</sub></strong> asks for R<sub>2</sub> first, zero cycle forms &rarr; <strong>SAFE &amp; GRANTED</strong>!</p>

  <h3>3. The Banker's Algorithm Data Structures (§8.6.3)</h3>
  <p>For multiple-instance resource systems (<code>n</code> threads, <code>m</code> resource types), Dijkstra named this after a cautious small-town banker who never allocates cash so he can no longer satisfy all customers' credit lines:</p>
  <ul>
    <li><code>Available[m]</code>: Vector of currently free instances of each resource type.</li>
    <li><code>Max[n][m]</code>: Maximum demand declared upfront by each thread.</li>
    <li><code>Allocation[n][m]</code>: Instances currently held by each thread.</li>
    <li><code>Need[n][m]</code>: Remaining potential future need of each thread:</li>
  </ul>
  <div class="formula-display">
    Need[i][j] = Max[i][j] &minus; Allocation[i][j]
  </div>

  <div class="compare-grid">
    <div class="compare-card">
      <h4>Algorithm 1: Safety Algorithm — O(m &times; n<sup>2</sup>)</h4>
      <pre class="code-block">1. Work[0..m-1] = Available;
   Finish[0..n-1] = false;
2. Find index i such that:
   Finish[i] == false  AND  Need[i] &lt;= Work
   (if no such i exists, go to Step 4)
3. Work = Work + Allocation[i];
   Finish[i] = true;
   Append Ti to SafeSequence; go to Step 2
4. If Finish[i] == true for ALL i &rArr; SAFE STATE!
   Otherwise &rArr; UNSAFE STATE!</pre>
    </div>
    <div class="compare-card">
      <h4>Algorithm 2: Resource-Request for T<sub>i</sub></h4>
      <pre class="code-block">1. If Request[i] &gt; Need[i]:
     raise ERROR (exceeded max claim!)
2. If Request[i] &gt; Available:
     T_i must WAIT (not enough free now)
3. Pretend to allocate (tentative snapshot):
     Available   = Available   - Request[i]
     Allocation[i] = Allocation[i] + Request[i]
     Need[i]     = Need[i]     - Request[i]
4. Run Safety Algorithm on tentative state:
     &bull; If SAFE   &rArr; COMMIT &amp; GRANT request!
     &bull; If UNSAFE &rArr; ROLL BACK &amp; block T_i!</pre>
    </div>
  </div>

  <h3>4. Complete Textbook Worked Example (Silberschatz §8.6.3.3 &amp; Slide 14)</h3>
  <p>System has 5 threads/processes (Silberschatz 10th Ed. names them <code>T<sub>0</sub>..T<sub>4</sub></code>; Slide 14 names them <code>P<sub>0</sub>..P<sub>4</sub></code>) and 3 resource types: <strong>A = 10, B = 5, C = 7</strong> instances. Initial Snapshot at T<sub>0</sub>:</p>
  <table class="data-table">
    <thead>
      <tr><th>Thread</th><th>Allocation (A B C)</th><th>Max (A B C)</th><th>Available (A B C)</th><th>Computed <code>Need = Max &minus; Alloc</code></th></tr>
    </thead>
    <tbody>
      <tr><td><strong>P<sub>0</sub></strong></td><td>0 &nbsp;1 &nbsp;0</td><td>7 &nbsp;5 &nbsp;3</td><td rowspan="5"><strong>3 &nbsp;3 &nbsp;2</strong><br><em>(Total &minus; &Sigma;Alloc:<br>10&minus;7=3, 5&minus;2=3, 7&minus;5=2)</em></td><td><strong>7 &nbsp;4 &nbsp;3</strong></td></tr>
      <tr><td><strong>P<sub>1</sub></strong></td><td>2 &nbsp;0 &nbsp;0</td><td>3 &nbsp;2 &nbsp;2</td><td><strong>1 &nbsp;2 &nbsp;2</strong></td></tr>
      <tr><td><strong>P<sub>2</sub></strong></td><td>3 &nbsp;0 &nbsp;2</td><td>9 &nbsp;0 &nbsp;2</td><td><strong>6 &nbsp;0 &nbsp;0</strong></td></tr>
      <tr><td><strong>P<sub>3</sub></strong></td><td>2 &nbsp;1 &nbsp;1</td><td>2 &nbsp;2 &nbsp;2</td><td><strong>0 &nbsp;1 &nbsp;1</strong></td></tr>
      <tr><td><strong>P<sub>4</sub></strong></td><td>0 &nbsp;0 &nbsp;2</td><td>4 &nbsp;3 &nbsp;3</td><td><strong>4 &nbsp;3 &nbsp;1</strong></td></tr>
    </tbody>
  </table>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Part A: Proving Initial Snapshot is SAFE (Safety Trace)</div>
    <p>Start with <code>Work = (3, 3, 2)</code>, <code>Finish = [F, F, F, F, F]</code>:</p>
    <ol>
      <li><code>Need[P<sub>0</sub>] = (7,4,3) &le; (3,3,2)?</code> No. Check <strong>P<sub>1</sub></strong>: <code>Need[P<sub>1</sub>] = (1,2,2) &le; (3,3,2)</code> &rArr; <strong>YES!</strong> Run P<sub>1</sub>; reclaim Allocation(2,0,0): <code>Work = (3,3,2) + (2,0,0) = <strong>(5, 3, 2)</strong></code>.</li>
      <li>Check <strong>P<sub>3</sub></strong>: <code>Need[P<sub>3</sub>] = (0,1,1) &le; (5,3,2)</code> &rArr; <strong>YES!</strong> Reclaim (2,1,1): <code>Work = (5,3,2) + (2,1,1) = <strong>(7, 4, 3)</strong></code>.</li>
      <li>Check <strong>P<sub>4</sub></strong>: <code>Need[P<sub>4</sub>] = (4,3,1) &le; (7,4,3)</code> &rArr; <strong>YES!</strong> Reclaim (0,0,2): <code>Work = (7,4,3) + (0,0,2) = <strong>(7, 4, 5)</strong></code>.</li>
      <li>Check <strong>P<sub>2</sub></strong>: <code>Need[P<sub>2</sub>] = (6,0,0) &le; (7,4,5)</code> &rArr; <strong>YES!</strong> Reclaim (3,0,2): <code>Work = (7,4,5) + (3,0,2) = <strong>(10, 4, 7)</strong></code>.</li>
      <li>Check <strong>P<sub>0</sub></strong>: <code>Need[P<sub>0</sub>] = (7,4,3) &le; (10,4,7)</code> &rArr; <strong>YES!</strong> Reclaim (0,1,0): <code>Work = <strong>(10, 5, 7)</strong></code> (= Total Resources!).</li>
    </ol>
    <strong>Conclusion:</strong> All <code>Finish[i] == true</code>! Valid Safe Sequence: <strong>&lt;P<sub>1</sub>, P<sub>3</sub>, P<sub>4</sub>, P<sub>2</sub>, P<sub>0</sub>&gt;</strong> &rArr; System is <strong>SAFE!</strong> (<em>Exam Note:</em> Silberschatz §8.6.3.3 writes <code>&lt;T<sub>1</sub>, T<sub>3</sub>, T<sub>4</sub>, T<sub>2</sub>, T<sub>0</sub>&gt;</code> and Slide 14 chooses <code>&lt;P<sub>1</sub>, P<sub>3</sub>, P<sub>4</sub>, P<sub>0</sub>, P<sub>2</sub>&gt;</code>—any valid full permutation proves the state Safe!)
  </div>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Part B: Evaluating New Requests from T<sub>0</sub></div>
    <ul>
      <li><strong>Case 1 — P<sub>1</sub> requests (1, 0, 2):</strong>
        <br>Check <code>(1,0,2) &le; Need[P<sub>1</sub>]=(1,2,2)</code> (OK) &amp; <code>(1,0,2) &le; Available=(3,3,2)</code> (OK).
        <br>Pretend state: <code>Available = (2, 3, 0)</code>, <code>Alloc[P<sub>1</sub>] = (3, 0, 2)</code>, <code>Need[P<sub>1</sub>] = (0, 2, 0)</code>.
        <br>Run Safety: P<sub>1</sub> (Need 0,2,0 &le; 2,3,0 &rarr; Work 5,3,2) &rarr; P<sub>3</sub> (Work 7,4,3) &rarr; P<sub>4</sub> (Work 7,4,5) &rarr; P<sub>0</sub> (Work 7,5,5) &rarr; P<sub>2</sub> (Work 10,5,7). Sequence <strong>&lt;P<sub>1</sub>, P<sub>3</sub>, P<sub>4</sub>, P<sub>0</sub>, P<sub>2</sub>&gt;</strong> exists &rArr; <strong>REQUEST GRANTED!</strong></li>
      <li><strong>Case 2 — Starting from Case 1 state, P<sub>4</sub> requests (3, 3, 0):</strong>
        <br>Check <code>(3,3,0) &le; Available=(2,3,0)</code>? <strong>FALSE (3 &gt; 2 for Resource A)!</strong> Rejected immediately (P<sub>4</sub> must wait—not enough free A).</li>
      <li><strong>Case 3 — Starting from Case 1 state, P<sub>0</sub> requests (0, 2, 0):</strong>
        <br>Check <code>(0,2,0) &le; Available=(2,3,0)</code> (OK). Pretend <code>Available = (2, 1, 0)</code>. Run Safety: every process's Need exceeds <code>(2,1,0)</code> (e.g., <code>Need[P<sub>1</sub>]=(0,2,0)</code> needs B=2, only B=1 left; <code>Need[P<sub>3</sub>]=(0,1,1)</code> needs C=1, only C=0 left!). Zero threads can finish &rArr; <strong>UNSAFE STATE &rArr; DENIED &amp; ROLLED BACK!</strong></li>
    </ul>
  </div>
</div>
""",
    },
    "deck_15": {
        "title": "DEADLOCK DETECTION & RECOVERY STRATEGIES",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 8 (§8.7–§8.8)",
        "formulas": "Wait-For Graph: Edge T<sub>i</sub> &rarr; T<sub>j</sub> iff T<sub>i</sub> waits for R held by T<sub>j</sub><br>Multi-Instance Detection: Uses Request[n][m] (NOT Max/Need)<br>Finish[i] = (Allocation[i] == 0 ? true : false)<br>Complexity: O(m &times; n<sup>2</sup>)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 15 · DETECTION &amp; RECOVERY · SILBERSCHATZ §8.7–§8.8</div>
    <h2 class="theory-heading">Deadlock Detection Algorithms &amp; System Recovery Strategies</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 8 (§8.7–§8.8) · CPCS-361 Final Exam Core</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Contrast Deadlock Avoidance (needs future <code>Max</code>) with <strong>Deadlock Detection</strong> (evaluates current <code>Request</code> only) (§8.7).</li>
      <li>Construct a <strong>Wait-For Graph (WFG)</strong> from a single-instance RAG and detect cycles in <code>O(n<sup>2</sup>)</code> (§8.7.1, Fig. 8.11).</li>
      <li>Execute the <strong>Multi-Instance Detection Algorithm</strong> using <code>Available</code>, <code>Allocation</code>, and <code>Request</code> matrices and identify exact deadlocked processes (§8.7.2).</li>
      <li>Select detection frequency wisely based on deadlock frequency and rollback cost (§8.7.3).</li>
      <li>Compare <strong>Process Termination</strong> vs. <strong>Resource Preemption</strong> recovery (Rollback + Starvation prevention) (§8.8).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Traffic Audits Without Destination Maps &amp; Why Cost Must Escalate</div>
    <ul>
      <li><strong>Naive Fixes &rarr; Visible Failure:</strong> Collapsing resources into a Wait-For Graph (T<sub>i</sub> &rarr; T<sub>j</sub>) works for 1-instance resources yet fails on multi-instance pools because it hides spare free instances! Conversely, Banker's Safety fails because processes never declared <code>Max</code>! And after detecting a jam, always preempting the statically "cheapest" victim creates <strong>Recovery Starvation (§8.8.2)</strong> because the same tiny process keeps getting aborted forever!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> <strong>Multi-Instance Detection</strong> is an intersection traffic audit <em>without trip manifests</em>: inspectors only look at which single lane each car is asking for right now (<code>Request</code>). Any car parked empty-handed (<code>Allocation == 0</code>) or whose next meter has room (<code>Request &le; Work</code>) is optimistically assumed to drive away and free its spots; everyone still stranded when scanning stops forms the deadlocked pileup. <em>Where the analogy breaks:</em> Unlike Banker's Avoidance (which stays safe all the way to exit), Detection's pass verdict is purely <strong>optimistic (§8.7.2)</strong>—a car with <code>Request == 0</code> right now might request a locked resource milliseconds later!</li>
      <li><strong>Why Each Formula Exists:</strong> <code>Finish[i] = (Allocation[i] == 0)</code> starts idle-handed threads finished because they hold zero instances anyone else could wait on; adding <code>rollback_count</code> into victim cost guarantees every rollback raises that thread's preemption price until it stops being targeted (§8.8.2).</li>
    </ul>
  </div>

  <h3>1. Single-Instance Detection: The Wait-For Graph (§8.7.1, Fig. 8.11)</h3>
  <p>If an OS applies neither prevention nor avoidance, it must periodically detect deadlocks and recover. When every resource type has <strong>only one instance</strong>, simplify the RAG by collapsing all resource vertices: draw directed edge <strong>T<sub>i</sub> &rarr; T<sub>j</sub></strong> if and only if thread T<sub>i</sub> is waiting for a resource currently assigned to thread T<sub>j</sub>.</p>
  <div class="ascii-diagram">SIMPLE CHAIN:          T1 &rarr; R1 &rarr; T2 &rarr; R2 &rarr; T3 &rarr; R3 &rarr; T1   &rArr;   WFG: T1 &rarr; T2 &rarr; T3 &rarr; T1 (Cycle = DEADLOCK!)
SILBERSCHATZ FIG. 8.11 / SLIDE 15 (5-Process WFG):
  P1 &rarr; P2,  P2 &rarr; {P3, P4, P5},  P3 &rarr; P4,  P4 &rarr; P1   &rArr;   Cycles: P1&rarr;P2&rarr;P4&rarr;P1 and P1&rarr;P2&rarr;P3&rarr;P4&rarr;P1!</div>
  <p>A deadlock exists in the single-instance system <strong>if and only if the Wait-For Graph contains a cycle</strong>. Cycle detection takes <code>O(n<sup>2</sup>)</code> operations (where <code>n</code> is the number of threads).</p>

  <h3>2. Multi-Instance Detection Algorithm (§8.7.2)</h3>
  <p>When resources have multiple instances, Wait-For Graphs are insufficient. Instead, we use a matrix test similar to Banker's Safety Algorithm—<strong>with two crucial differences:</strong></p>
  <ol>
    <li>We use <strong><code>Request[i][j]</code></strong> (current outstanding request, <em>not</em> future <code>Need</code>/<code>Max</code>, since avoidance isn't used!).</li>
    <li><strong>Optimistic Initialization:</strong> Threads currently holding zero resources (<code>Allocation<sub>i</sub> == 0</code>) cannot be holding anything anyone waits on, so <code>Finish[i] = true</code> initially; otherwise <code>Finish[i] = false</code>!</li>
  </ol>
  <pre class="code-block">1. Work = Available;
   for i = 0..n-1: Finish[i] = (Allocation[i] == 0) ? true : false;
2. Find index i such that:
     Finish[i] == false  AND  Request[i] &lt;= Work
   (if no such i exists, go to Step 4)
3. Optimistic assumption: T_i finishes without further waits!
     Work = Work + Allocation[i];
     Finish[i] = true;  go to Step 2
4. If Finish[i] == false for ANY i:
     System IS DEADLOCKED, and EVERY thread with Finish[i] == false IS IN THE DEADLOCK!</pre>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Complete Worked Multi-Instance Detection Example (Silberschatz §8.7.2)</div>
    <p>Given 5 threads <code>P<sub>0</sub>..P<sub>4</sub></code>, 3 resource types (A=7, B=2, C=6), and <code>Available = (0, 0, 0)</code>:</p>
    <table class="data-table">
      <thead><tr><th>Thread</th><th>Allocation (A B C)</th><th>Request (A B C)</th><th>Trace Step</th></tr></thead>
      <tbody>
        <tr><td><strong>P<sub>0</sub></strong></td><td>0 1 0</td><td>0 0 0</td><td><code>Request[P<sub>0</sub>]=(0,0,0) &le; Work(0,0,0)</code> &rarr; Runs! New <code>Work = (0,1,0)</code></td></tr>
        <tr><td><strong>P<sub>1</sub></strong></td><td>2 0 0</td><td>2 0 2</td><td><code>Request[P<sub>1</sub>]=(2,0,2) &gt; Work(0,0,0)</code> &rarr; Waits on pass 1 (runs last once <code>Work=(5,2,6)</code>!)</td></tr>
        <tr><td><strong>P<sub>2</sub></strong></td><td>3 0 3</td><td>0 0 0</td><td><code>Request[P<sub>2</sub>]=(0,0,0) &le; Work(0,1,0)</code> &rarr; Runs! New <code>Work = (3,1,3)</code></td></tr>
        <tr><td><strong>P<sub>3</sub></strong></td><td>2 1 1</td><td>1 0 0</td><td><code>Request[P<sub>3</sub>]=(1,0,0) &le; Work(3,1,3)</code> &rarr; Runs! New <code>Work = (5,2,4)</code></td></tr>
        <tr><td><strong>P<sub>4</sub></strong></td><td>0 0 2</td><td>0 0 2</td><td><code>Request[P<sub>4</sub>]=(0,0,2) &le; Work(5,2,4)</code> &rarr; Runs! New <code>Work = (5,2,6)</code></td></tr>
      </tbody>
    </table>
    <p>Now only <code>P<sub>1</sub></code> remains (<code>Request=(2,0,2) &le; Work(5,2,6)</code>) &rarr; Runs too! <strong>No deadlock! Completion order &lt;P<sub>0</sub>, P<sub>2</sub>, P<sub>3</sub>, P<sub>4</sub>, P<sub>1</sub>&gt;</strong> (Silberschatz §8.7.2 traces <code>&lt;T<sub>0</sub>, T<sub>2</sub>, T<sub>3</sub>, T<sub>1</sub>, T<sub>4</sub>&gt;</code>; note Slide 15 loosely calls this a "Safe Sequence" though Detection has no <code>Max</code> claims!).<br>
    <em>Now suppose P<sub>2</sub> makes ONE extra request for C: <code>Request[P<sub>2</sub>] = (0, 0, 1)</code>:</em> Starting with <code>Work=(0,0,0)</code>, only P<sub>0</sub> can run (<code>Work=(0,1,0)</code>). Now NO remaining thread's Request fits <code>(0,1,0)</code>! Detection stops with <code>Finish = [T, F, F, F, F]</code> &rArr; <strong>DEADLOCK involving {P<sub>1</sub>, P<sub>2</sub>, P<sub>3</sub>, P<sub>4</sub>}!</strong></p>
  </div>

  <h3>3. When to Invoke Detection? (§8.7.3)</h3>
  <p>Running an <code>O(m &times; n<sup>2</sup>)</code> check on every failed request causes overhead (only at the extreme "every request that cannot be granted immediately" can you spot both the deadlocked set <em>and</em> the single culprit!). Two practical alternatives (§8.7.3): (1) Run periodically (e.g., once per hour), or (2) Trigger only when <strong>CPU utilization drops below a threshold</strong> (say 40%). Note: running detection only periodically means a cycle may pull in <em>innocent later threads</em> before being caught, making it harder to identify which thread originally caused the jam.</p>

  <h3>4. Deadlock Recovery Strategies (§8.8)</h3>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>Option A: Process Termination (§8.8.1)</h4>
      <p><strong>1. Abort ALL deadlocked processes:</strong> Fast &amp; guaranteed to break cycle, but extremely expensive (discards partial hours of work).<br><strong>2. Abort ONE process at a time</strong> and re-run detection until cycle breaks: lower wasted work, higher detection overhead. Choose victim with lowest cost based on (5 textbook factors + Slide 15 #6):</p>
      <ul>
        <li>Priority of the process</li>
        <li>How long it has run &amp; how much longer to finish</li>
        <li>Types &amp; count of resources held (and whether preemptible)</li>
        <li>How many more resources it still needs to finish</li>
        <li>How many processes would need to be terminated</li>
        <li><em>Slide 15 (#6):</em> Interactive vs. batch process</li>
      </ul>
    </div>
    <div class="compare-card">
      <h4>Option B: Resource Preemption (§8.8.2)</h4>
      <p>Successively confiscate resources from victim processes and give them to others until deadlock breaks. Requires addressing 3 critical issues:</p>
      <ol>
        <li><strong>Selecting a Victim:</strong> Minimize cost (held resource count, execution time consumed so far).</li>
        <li><strong>Rollback:</strong> Process cannot continue cleanly missing a stolen lock/file! Must perform either <em>Total Rollback</em> (abort &amp; restart from scratch) or <em>Partial Rollback</em> (restore to last saved checkpoint—requires kernel/DB checkpointing!).</li>
        <li><strong>Preventing Starvation:</strong> If the same process keeps getting picked as cheapest victim, it never finishes! <strong>Fix: Include the count of rollbacks in the cost metric</strong> so repeated victims grow prohibitively expensive to kill!</li>
      </ol>
    </div>
  </div>
</div>
""",
    },
}
