# -*- coding: utf-8 -*-
"""
Part 1 Knowledge Trove: Decks 02 through 08
Silberschatz 10th Ed. Chapters 1, 2, 3, 4, 5
Clean offline HTML/Unicode math (zero raw LaTeX tokens, zero unescaped tabs).
"""

DECKS_02_08 = {
    "deck_02": {
        "title": "DUAL-MODE & HARDWARE TRAP ARCHITECTURE",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapters 1 & 2 (§1.1–§1.10, §2.1–§2.10)",
        "formulas": "ModeBit = 1 (User Mode) &rarr; Ring 3<br>ModeBit = 0 (Kernel Mode) &rarr; Ring 0<br>Trap Vector = IVT[Interrupt_ID]<br>DMA: 1 interrupt per block (vs 1 per byte)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 02 · CORE FOUNDATIONS · SILBERSCHATZ CH. 1 &amp; 2</div>
    <h2 class="theory-heading">Introduction to Operating Systems, Dual-Mode Hardware &amp; OS Structures</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §1.1–§1.10 &amp; §2.1–§2.10 (OS Structures §2.8 beyond Deck 02) · Core Topic Scope (Practice Q1.A, Q2.A)</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Contrast the <strong>User View</strong> (convenience / utilization / battery) with the <strong>System View</strong> (Resource Allocator &amp; Control Program).</li>
      <li>Trace Computer-System Organization: System Bus, <strong>Bootstrap Program</strong>, <strong>Interrupt Vector Table (IVT)</strong>, Storage Hierarchy, and <strong>Direct Memory Access (DMA)</strong>.</li>
      <li>Compare Symmetric (SMP) vs. Asymmetric (AMP) Multiprocessing, Multi-core, NUMA, and <strong>Client-Server vs. Peer-to-Peer (P2P) Computing</strong> (§1.3, §1.10.3–§1.10.4).</li>
      <li>Distinguish cleanly between <strong>Multiprogramming</strong> and <strong>Multitasking (Time-Sharing)</strong> (§1.4, Mock Midterm Q1.A).</li>
      <li>Trace all 6 steps of <strong>Dual-Mode Operation</strong> (§1.4.2, Mode Bit <code>1 &harr; 0</code>) during a system call trap and explain how hardware <strong>Timers</strong> (§1.4.3) stop infinite loops (Mock Midterm Q2.A).</li>
      <li>Identify all 6 System Call categories (§2.3.3), 3 Parameter Passing methods, System Generation/Boot/Debugging (§2.9–§2.10), and OS Structure architectures (§2.8).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition-First Mental Model (Before the Formulas)</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Letting user apps talk straight to disks or run CPU instructions unchecked sounds fast—until one buggy <code>while(1);</code> freezes every user forever or one accidental pointer overwrite formats the OS kernel! Conversely, halting the CPU on every single byte of disk I/O via interrupts saturates CPU cycles on DMA bookkeeping.</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Picture a <strong>bank vault with a armored teller window</strong>. User programs wait in the lobby (<strong>User Mode, Bit = 1</strong>) and slide a formal slip through the slot (<strong>Trap / Syscall</strong>); hardware flips the security deadbolt to <strong>Kernel Mode (Bit = 0)</strong>, validates the ID via the <strong>IVT</strong>, accesses the vault, and resets Bit &rarr; <code>1</code> on exit. <em>Where the analogy breaks:</em> No human guard watches a runnable process inside an infinite loop—if the app never visits the teller window, control returns ONLY when a <strong>hardware countdown Timer (§1.4.3)</strong> physically hits zero and triggers a preemption interrupt!</li>
      <li><strong>Why Each Rule Exists:</strong> <code>DMA = 1 interrupt per block</code> amortizes trap overhead across thousands of bytes; Dual-Mode hardware ensures unprivileged user code can never touch page tables, interrupt lines, or the mode bit itself without trapping cleanly through kernel-verified entry points.</li>
    </ul>
  </div>

  <h3>1. What is an Operating System? (Silberschatz §1.1)</h3>
  <p>A computer system divides cleanly into four components: <strong>Hardware</strong> (CPU, memory, I/O devices), the <strong>Operating System</strong>, <strong>Application Programs</strong> (compilers, browsers, databases), and <strong>Users</strong> (people, machines, other computers).</p>

  <div class="callout callout-definition">
    <div class="callout-title">📜 Textbook Definition (Silberschatz §1.1)</div>
    "An operating system is a program that manages a computer's hardware. It also provides a basis for application programs and acts as an intermediary between the computer user and the computer hardware." — And structurally, the OS is defined operationally as <strong>the one program running at all times on the computer — the kernel</strong> (plus system programs and middleware).
  </div>

  <div class="compare-grid">
    <div class="compare-card">
      <h4>User View</h4>
      <p><strong>Single-user PC:</strong> Designed for ease of use and good performance; hardware utilization is secondary.<br><strong>Mainframe/Shared Server:</strong> Maximizes hardware and CPU utilization so every user gets fair share.<br><strong>Mobile/Handheld:</strong> Balances usability with strict battery life.<br><strong>Embedded Systems:</strong> Runs with minimal or zero user interface.</p>
    </div>
    <div class="compare-card">
      <h4>System View</h4>
      <p><strong>1. Resource Allocator:</strong> Decides between conflicting requests for CPU time, memory space, file storage, and I/O devices cleanly and fairly.<br><strong>2. Control Program:</strong> Supervises execution of user programs to prevent errors and improper or unauthorized hardware use.</p>
    </div>
  </div>

  <h3>2. Computer-System Organization, Interrupts &amp; Storage (§1.2)</h3>
  <p>A modern general-purpose computer consists of one or more CPUs and multiple <strong>device controllers</strong> connected through a common <strong>system bus</strong> that provides shared access to main memory. Each device controller manages a specific device type (disk, USB, display) and maintains a local buffer + status/control registers.</p>
  <ul>
    <li><strong>Bootstrap Program:</strong> The first code executed on power-up or reboot, stored in firmware (ROM / EEPROM). It initializes CPU registers, device controllers, and memory, then locates and loads the OS kernel into RAM.</li>
    <li><strong>Interrupt-Driven Execution:</strong> When a device controller finishes I/O, it asserts a signal on the <strong>interrupt-request line</strong>. The CPU immediately saves its current state (PC + registers), uses an index to look up the handler address in the <strong>Interrupt Vector Table (IVT)</strong> in low memory, jumps to the Interrupt Service Routine (ISR), and restores state upon completion.</li>
    <li><strong>Interrupt vs. Trap (Exception):</strong> Hardware triggers asynchronous <em>interrupts</em> (e.g., disk done, timer tick). Software triggers synchronous <em>traps/exceptions</em> either accidentally (division by zero, illegal memory access) or intentionally (executing a system call instruction like <code>SVC</code> / <code>SYSCALL</code> / <code>INT 0x80</code>).</li>
    <li><strong>Direct Memory Access (DMA):</strong> Interrupt-driven byte-by-byte I/O works well for slow devices (keyboards) but cripples CPU throughput on high-speed disks. With DMA, the CPU programs the DMA controller with source/destination addresses and byte count; the DMA controller transfers an <strong>entire block directly between device buffer and main memory</strong> via bus cycle stealing and raises <strong>only 1 interrupt per block</strong>.</li>
  </ul>

  <div class="ascii-diagram">STORAGE HIERARCHY (Silberschatz Fig. 1.4 — Top = Fastest, Costliest, Volatile; Bottom = Slowest, Cheapest, Nonvolatile)
┌───────────────────────────┐  Registers       (&lt; 1 ns, CPU internal, Volatile)
├───────────────────────────┤  L1 / L2 / L3    (1–15 ns, SRAM Cache, Volatile)
├───────────────────────────┤  Main Memory     (50–100 ns, DRAM, Volatile — directly byte-addressable by CPU)
├───────────────────────────┤  NVM / NVMe SSD  (10–100 µs, Flash/3D XPoint, Nonvolatile)
├───────────────────────────┤  Hard Disk (HDD) (4–12 ms, Magnetic platters, Nonvolatile)
├───────────────────────────┤  Optical / Tape  (sec–min, Archival tertiary storage)
└───────────────────────────┘
  * Caching Rule: Information copied into faster storage temporarily; OS/HW must maintain Cache Coherency on multicore CPUs.</div>

  <h3>3. Computer-System Architecture &amp; Multiprocessing (§1.3)</h3>
  <ul>
    <li><strong>Asymmetric Multiprocessing (AMP):</strong> Boss-worker model; one master CPU schedules and assigns tasks to worker CPUs. Simpler kernel locking, poorer scaling.</li>
    <li><strong>Symmetric Multiprocessing (SMP):</strong> Each processor runs an identical copy of the kernel (peer relationship) and shares main memory + ready queues. Scales gracefully, requires careful synchronization.</li>
    <li><strong>Multi-core &amp; NUMA:</strong> Putting multiple execution cores on a single silicon die speeds inter-core communication and lowers power compared to separate sockets. In large server topologies, <strong>NUMA (Non-Uniform Memory Access)</strong> connects CPU groups via high-speed interconnect where local memory access is faster than remote socket access.</li>
    <li><strong>Clustered Systems:</strong> Multiple independent computers joined via SAN/LAN for High Availability (graceful degradation, asymmetric active-standby or symmetric active-active) and High-Performance Computing (parallel MPI workloads).</li>
  </ul>

  <h3>4. Multiprogramming vs. Multitasking (Mock Midterm Q1.A)</h3>
  <p>Wait until the CPU idles vs. preempt on a hardware clock tick—this distinction appears frequently on OS exams:</p>
  <table class="data-table">
    <thead>
      <tr><th>Dimension</th><th>Multiprogramming (§1.4)</th><th>Multitasking / Time-Sharing (§1.4)</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Primary Objective</strong></td><td><strong>Maximize CPU utilization</strong> by keeping the CPU constantly busy with another job whenever the active job blocks.</td><td><strong>Minimize response time</strong> so interactive users can communicate with running programs concurrently.</td></tr>
      <tr><td><strong>CPU Switch Trigger</strong></td><td>Passive / Voluntary: switches <strong>only when the running process waits</strong> (e.g., performs an I/O request or terminates).</td><td>Active / Preemptive: switches <strong>frequently via a hardware Timer Interrupt</strong> every few milliseconds (time quantum), even if the job is still computing.</td></tr>
      <tr><td><strong>User Interaction</strong></td><td>Low / Batch-oriented (no direct real-time user control during run).</td><td>High / Interactive (requires virtual memory &amp; process scheduling).</td></tr>
    </tbody>
  </table>

  <h3>5. Dual-Mode Operation, Hardware Timers &amp; Traps (§1.4.2–§1.4.3, Mock Midterm Q2.A)</h3>
  <p>Because the OS and user applications share the same hardware, a buggy or malicious user program could overwrite kernel code, loop forever, or issue rogue disk writes. Hardware solves this using a dedicated <strong>Mode Bit</strong> inside the CPU status register:</p>
  <ul>
    <li><strong>User Mode (Mode Bit = 1, Ring 3):</strong> Executes application code. Privileged instructions (<code>HLT</code>, <code>CLI</code>/enable-disable interrupts, changing Base/Limit or Page Table Base Register, switching Mode Bit, direct I/O port writes) are <strong>blocked by hardware and immediately trap to the OS</strong>.</li>
    <li><strong>Kernel Mode (Mode Bit = 0, Ring 0 — Supervisor / System / Privileged Mode):</strong> Full unrestricted hardware access inside the OS kernel.</li>
    <li><strong>Multimode Extension (§1.4.2):</strong> Modern CPUs add extra modes for <strong>Virtual Machine Monitors (VMM / hypervisors)</strong> so guest OSes believe they run in supervisor mode while still trapped by the host hypervisor.</li>
    <li><strong>Timer Protection (§1.4.3):</strong> Before dispatching a user process, the OS loads a programmable <strong>Hardware Timer</strong> (fixed or variable countdown). Every clock tick decrements the counter; hitting <code>0</code> raises a timer interrupt that flips Mode Bit &rarr; <code>0</code> and returns control to the OS scheduler—making it impossible for a user program's <code>while(1);</code> to freeze the CPU permanently.</li>
  </ul>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Mock Midterm Q2.A — Exact 6 Diagram Labels (Silberschatz Fig. 1.13)</div>
    <p>Mock Midterm Q2.A reproduces <strong>Silberschatz 10th Ed. Fig. 1.13 (Transition from user to kernel mode)</strong> and blanks out the exact 6 step labels around <em>user process executing</em> (Mode Bit = 1) &harr; <em>kernel</em>:</p>
    <ol>
      <li><strong>Blank 1 (User exit):</strong> <code>calls system call</code> — User process requests an OS service via trap opcode.</li>
      <li><strong>Blank 2 (Transition down to Kernel):</strong> <code>trap / mode bit = 0</code> — CPU hardware atomically clears Mode Bit <code>1 &rarr; 0</code> and indexes the IVT.</li>
      <li><strong>Blank 3 (Bottom-right Kernel box):</strong> <code>kernel mode (mode bit = 0)</code> — Kernel now holds full Ring 0 privileges.</li>
      <li><strong>Blank 4 (Inside Kernel):</strong> <code>execute system call</code> — Kernel validates arguments and runs the requested service routine.</li>
      <li><strong>Blank 5 (Transition up to User):</strong> <code>return / mode bit = 1</code> — Privileged return instruction resets Mode Bit <code>0 &rarr; 1</code>.</li>
      <li><strong>Blank 6 (User resume):</strong> <code>return from system call</code> — User process resumes at the instruction right after the syscall.</li>
    </ol>
  </div>

  <h3>6. Computing Environments: Client-Server vs. Peer-to-Peer (§1.10.3–§1.10.4, Midterm Quick Guide HIGH)</h3>
  <table class="data-table">
    <thead>
      <tr><th>Dimension</th><th>Client–Server Computing (§1.10.3)</th><th>Peer-to-Peer (P2P) Computing (§1.10.4)</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Node Roles</strong></td><td>Strict separation: specialized <strong>Servers</strong> respond to requests from passive/smart <strong>Clients</strong>.</td><td><strong>Symmetric Peers</strong>: no fixed client/server distinction; any node acts as client, server, or both.</td></tr>
      <tr><td><strong>Variants / Service Discovery</strong></td><td><strong>Compute-server</strong> (clients request computation/DB queries) &amp; <strong>File-server</strong> (clients store/retrieve files).</td><td>Joins P2P network via either (1) <strong>Central Lookup Service</strong> (e.g., Napster) or (2) <strong>Broadcast Discovery Protocol</strong> (e.g., Gnutella).</td></tr>
      <tr><td><strong>Bottleneck / Resilience</strong></td><td>Central server can become a single point of failure or traffic bottleneck.</td><td>Decentralized scalability; resilient to single-node failure (e.g., Gnutella, BitTorrent, Skype VoIP).</td></tr>
    </tbody>
  </table>

  <h3>7. System Calls, SYSGEN, System Boot &amp; OS Structures (Silberschatz Ch. 2)</h3>
  <p><strong>System Calls (§2.3–§2.3.3)</strong> provide the programmatic interface to OS kernel services (typically invoked via standard APIs like POSIX <code>libc</code>, Win32, or Java JVM rather than raw assembly traps for portability). Parameter passing uses: (1) <strong>CPU Registers</strong> (fastest, limited count), (2) <strong>Memory Block / Table</strong> (start address in a register, unlimited size), or (3) <strong>Stack</strong> (pushed by user, popped by OS).</p>

  <table class="data-table">
    <thead>
      <tr><th>System Call Category (§2.3.3)</th><th>Representative POSIX / Windows Calls</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Process Control</strong></td><td><code>fork()</code>, <code>exec()</code>, <code>exit()</code>, <code>wait()</code>, <code>CreateProcess()</code>, <code>ExitProcess()</code></td></tr>
      <tr><td><strong>2. File Management</strong></td><td><code>open()</code>, <code>read()</code>, <code>write()</code>, <code>close()</code>, <code>unlink()</code>, <code>CreateFile()</code></td></tr>
      <tr><td><strong>3. Device Management</strong></td><td><code>ioctl()</code>, <code>read()</code>, <code>write()</code>, request/release device, attach/detach</td></tr>
      <tr><td><strong>4. Information Maintenance</strong></td><td><code>getpid()</code>, <code>alarm()</code>, <code>time()</code>, <code>sleep()</code>, <code>SetTimer()</code></td></tr>
      <tr><td><strong>5. Communications (IPC)</strong></td><td><code>pipe()</code>, <code>shm_open()</code>, <code>mmap()</code>, <code>socket()</code>, <code>send()</code>, <code>recv()</code></td></tr>
      <tr><td><strong>6. Protection</strong></td><td><code>chmod()</code>, <code>umask()</code>, <code>chown()</code>, <code>SetFileSecurity()</code></td></tr>
    </tbody>
  </table>

  <ul>
    <li><strong>OS Generation — SYSGEN (§2.9.1 / Slide 02 P117):</strong> Configures an OS distribution for specific hardware before building/installing (querying CPU model/options, installed RAM size, attached devices/addresses, and desired OS options).</li>
    <li><strong>System Boot (§2.9.2 / Slide 02 P118):</strong> Starts a computer by loading the kernel using a tiny firmware <strong>bootstrap program</strong> (stored in ROM/EEPROM/UEFI, often two-step via boot loader) that initializes hardware and transfers control to the kernel in Ring 0.</li>
    <li><strong>OS Debugging &amp; Tuning (§2.10 / Slide 02 P97):</strong> User-process crash writes a <strong>core dump</strong> (memory image); OS crash writes a <strong>crash dump</strong> (kernel memory image), alongside performance counters and kernel tracing (DTrace / BCC).</li>
  </ul>

  <p><strong>Operating System Structures (§2.8 — <em>[Textbook Beyond Slide 02]</em>):</strong></p>
  <ul>
    <li><strong>Monolithic Kernel (Traditional UNIX, Linux):</strong> Almost all OS functionality (scheduling, VFS, drivers, networking) runs inside a single kernel address space. <em>Pro:</em> Ultra-fast direct function calls with minimal context-switch overhead. <em>Con:</em> Hard to maintain; a single driver bug can panic the entire system.</li>
    <li><strong>Layered Approach:</strong> Hardware at Layer 0 up to User Interface at Layer N; each layer uses services only from lower layers. <em>Pro:</em> Clean debugging/modularity. <em>Con:</em> Defining strict acyclic layers is hard, and crossing multiple layers degrades I/O speed.</li>
    <li><strong>Microkernel (Mach, QNX):</strong> Removes all non-essential services out of Ring 0 into User-Space servers, leaving only minimal IPC, basic scheduling, and memory management in the kernel. <em>Pro:</em> Extensible, portable, fault-isolated, high security. <em>Con:</em> Frequent IPC user&harr;kernel context switches reduce throughput.</li>
    <li><strong>Loadable Kernel Modules (LKMs — Modern Linux, Solaris, macOS):</strong> Object-oriented core kernel dynamically loads drivers/filesystems at runtime via module interfaces—combines <strong>monolithic call speed</strong> with <strong>microkernel modularity</strong> without IPC overhead.</li>
    <li><strong>Hybrid Systems (macOS Darwin, Windows, Android):</strong> Combines Mach microkernel + BSD monolithic layer + I/O Kit modules (macOS), or modified Linux kernel + ART VM + binder IPC framework (Android).</li>
  </ul>
</div>
""",
    },
    "deck_03": {
        "title": "PROCESSES, THREADS & INTERPROCESS COMMUNICATION",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapters 3 & 4 (§3.1–§3.6, §4.1–§4.3)",
        "formulas": "fork() Return: Child PID in Parent, 0 in Child, -1 on Error<br>Process Tree Count (n consecutive forks) = 2<sup>n</sup> total processes<br>Amdahl's Law: Speedup &le; 1 / [ S + (1 &minus; S) / N ]",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 03 · EXECUTION UNITS · SILBERSCHATZ CH. 3 &amp; 4</div>
    <h2 class="theory-heading">Processes, PCB, Context Switching, fork() Trees, IPC &amp; Multithreading</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §3.1–§3.6 &amp; §4.1–§4.3 (Zombies/Orphans/2<sup>n</sup>/Amdahl beyond Deck 03) · Core Topic Scope (Practice Q1.B, Q2.B, Q2.C)</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Distinguish a passive <strong>Program</strong> (executable on disk) from an active <strong>Process</strong> and sketch its 4 runtime memory sections.</li>
      <li>Enumerate all fields of the <strong>Process Control Block (PCB)</strong> (§3.1.3) and trace why Context Switching is pure overhead (§3.2.3). <em>(Note: the 5-state diagram &amp; schedulers appear in Slide 04 / §3.1.2.)</em></li>
      <li>Trace <code>fork()</code>, <code>exec()</code>, <code>wait()</code>, <strong>Cascading Termination</strong> (§3.3.2), plus extended textbook rules (<code>2<sup>n</sup></code> trees, <strong>Zombie</strong>, <strong>Orphan</strong>).</li>
      <li>Compare <strong>Shared Memory (§3.5)</strong> vs. <strong>Message Passing (§3.6)</strong> IPC (Mock Midterm Q1.B) and bounded vs. unbounded buffers (§3.5.1).</li>
      <li>Diagram <strong>Single-Threaded vs. Multithreaded Processes</strong> (§4.1), distinguish Concurrency vs. Parallelism and <strong>Data vs. Task Parallelism</strong> (Mock Q2.B/C), Amdahl's Law, and the 3 Multithreading models (§4.3).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition-First Mental Model (Before the Formulas)</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Spawning a heavy cloned process for every single web request duplicates entire page tables, heap state, and kernel PCBs—and passing megabytes via kernel syscalls forces double-copy trips into and back out of Ring 0 on every read/write!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> <strong>Shared Memory (§3.5)</strong> is a <strong>shared office whiteboard</strong> in the hallway: an admin unlocks the door once, and teams scribble directly at full speed (until two scribble on the same line without a mutex!). <strong>Message Passing (§3.6)</strong> is an <strong>inter-office courier</strong>: every envelope passes through the mailroom (kernel), slower per letter yet works cleanly across separate buildings (distributed machines!). Meanwhile, <strong>Threads (§4.1)</strong> are <strong>cooks sharing one kitchen</strong> (Code, Data, Files) with their own apron and spoon (PC, Registers, Stack). <em>Where the analogy breaks:</em> Shared memory relies on virtual page-table pointers mapping two processes' virtual pages to the exact same RAM frames, not contiguous hardware memory! And throwing 64 CPU cores at code with a 20% serial bottleneck hits Amdahl's <code>1/S = 5&times;</code> brick wall like 64 cashiers sharing 1 receipt printer.</li>
      <li><strong>Why Each Formula Exists:</strong> Unconditional <code>fork()</code> doubles active callers each call giving <code>2<sup>n</sup></code>; Amdahl's Law <code>1 / [S + (1 &minus; S)/N]</code> models total elapsed runtime directly as fixed serial time <code>S</code> plus shrunk parallel time <code>(1 &minus; S)/N</code>.</li>
    </ul>
  </div>

  <h3>1. Process Concept &amp; Memory Layout (§3.1)</h3>
  <p>A <strong>program</strong> is a passive entity stored on disk (executable binary). Once loaded into RAM, it becomes an active <strong>process</strong> owning a Program Counter (PC), registers, open files, and a virtual address space divided into 4–5 distinct sections:</p>
  <div class="ascii-diagram">HIGH ADDRESS ┌────────────────────────────────────────┐
             │  STACK (grows DOWN &darr;)                  │ &larr; Local vars, function params, return addresses
             │    &darr;  [Free Virtual Address Space]  &uarr;  │   (Overflow if Stack meets Heap)
             │  HEAP  (grows UP &uarr;)                    │ &larr; Dynamic memory: malloc(), calloc(), new
             ├────────────────────────────────────────┤
             │  UNINITIALIZED DATA (BSS)              │ &larr; Uninitialized global/static vars (zero-filled)
             │  INITIALIZED DATA                      │ &larr; Initialized global and static variables
             ├────────────────────────────────────────┤
LOW ADDRESS  │  TEXT (Code Segment)                   │ &larr; Compiled machine instructions (read-only)
             └────────────────────────────────────────┘</div>

  <h3>2. The 5-State Process Lifecycle (§3.1.2)</h3>
  <table class="data-table">
    <thead>
      <tr><th>Process State</th><th>Meaning &amp; Hardware Status</th><th>Outgoing Transitions</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>New</strong></td><td>Process is being created (allocated PID &amp; PCB).</td><td><em>Admitted</em> &rarr; Ready (by Long-Term Scheduler)</td></tr>
      <tr><td><strong>Ready</strong></td><td>Loaded in RAM, awaiting CPU allocation on Ready Queue.</td><td><em>Scheduler Dispatch</em> &rarr; Running (Short-Term Scheduler)</td></tr>
      <tr><td><strong>Running</strong></td><td>Instructions currently executing on a CPU core.</td><td><em>Exit</em> &rarr; Terminated | <em>Interrupt</em> &rarr; Ready | <em>I/O or Event Wait</em> &rarr; Waiting</td></tr>
      <tr><td><strong>Waiting (Blocked)</strong></td><td>Cannot execute until an external event completes (disk read, mutex, timer sleep).</td><td><em>I/O or Event Completion</em> &rarr; Ready</td></tr>
      <tr><td><strong>Terminated</strong></td><td>Execution finished (<code>exit()</code>); OS reclaims resources once parent calls <code>wait()</code>.</td><td>Reaped from process table.</td></tr>
    </tbody>
  </table>
  <p><em>Exam Trap:</em> Only <strong>one process per CPU core</strong> can be in the <em>Running</em> state at any instant, whereas many processes may sit simultaneously in <em>Ready</em> and <em>Waiting</em> queues. Also, a process <strong>cannot</strong> jump directly from <em>Waiting &rarr; Running</em>; it must pass through <em>Ready</em> first!</p>

  <h3>3. Process Control Block (PCB) &amp; Context Switch (§3.1.3 &amp; §3.2)</h3>
  <p>Inside the OS kernel, every process is represented by its <strong>PCB</strong> (called <code>task_struct</code> in Linux), containing: (1) <strong>Process State</strong>, (2) <strong>Program Counter</strong>, (3) <strong>CPU Registers</strong>, (4) <strong>CPU Scheduling Info</strong> (priority, queue pointers), (5) <strong>Memory-Management Info</strong> (base/limit registers, page tables), (6) <strong>Accounting Info</strong> (CPU time used, time limits, PID/PPID), and (7) <strong>I/O Status Info</strong> (allocated devices, open file table).</p>
  <p>During a <strong>Context Switch</strong> from P<sub>0</sub> to P<sub>1</sub>: (1) interrupt/trap occurs, (2) OS saves P<sub>0</sub>'s registers &amp; PC into <code>PCB<sub>0</sub></code>, (3) OS restores P<sub>1</sub>'s state from <code>PCB<sub>1</sub></code>, (4) CPU resumes P<sub>1</sub>. <strong>Pure Overhead:</strong> The CPU executes <em>zero useful application work</em> during a context switch (speed ranges from microseconds to sub-millisecond depending on register set size &amp; TLB flushes).</p>

  <h3>4. Process Creation (fork/exec), Termination &amp; Extended Process States (§3.3)</h3>
  <pre class="code-block">pid_t pid = fork();
if (pid &lt; 0) {
    fprintf(stderr, "Fork Failed");
} else if (pid == 0) {   /* Child Process */
    execlp("/bin/ls", "ls", NULL);  // Replaces child's memory image! Never returns on success
} else {                 /* Parent Process */
    wait(NULL);          // Parent blocks until child finishes &amp; reaps exit status
    printf("Child Complete\n");
}</pre>
  <ul>
    <li><strong>Parent-Initiated Termination &amp; Cascading Termination (§3.3.2 / Slide 03 P47):</strong> A parent can abort a child (<code>abort()</code> / <code>TerminateProcess()</code>) if the child exceeded allocated resources, its assigned task is no longer needed, or the parent itself is exiting and the OS does not permit orphaned children. When terminating a parent forces the OS to automatically terminate all its children (and grandchildren), this is called <strong>Cascading Termination</strong>.</li>
    <li><strong>Sequential <code>fork()</code> Formula <em>[Textbook Beyond Slide 03]</em>:</strong> If a program executes <code>n</code> unconditional <code>fork()</code> calls in sequence (e.g., <code>fork(); fork(); fork();</code>), it creates <code>2<sup>n</sup></code> total processes (1 original + <code>2<sup>n</sup> &minus; 1</code> newly created descendants). Watch for conditional branches (<code>if (fork() == 0)</code>) which produce fewer!</li>
    <li><strong>Zombie Process <em>[Textbook §3.3.2 Beyond Slide 03]</em>:</strong> A child has called <code>exit()</code> and freed its RAM, yet its entry (PID + exit code) lingers in the kernel process table because the parent is still alive and <strong>has not called <code>wait()</code></strong>. Reaping prevents PID exhaustion.</li>
    <li><strong>Orphan Process <em>[Textbook §3.3.2 Beyond Slide 03]</em>:</strong> The <strong>parent terminates</strong> before the child without calling <code>wait()</code>. UNIX/Linux immediately reparents the orphan child to PID 1 (<code>init</code> / <code>systemd</code>), which periodically calls <code>wait()</code> to reap it when it finishes.</li>
  </ul>

  <h3>5. IPC: Shared Memory vs. Message Passing (Mock Midterm Q1.B, §3.5–§3.6)</h3>
  <p>Independent processes never share state; <strong>Cooperating processes</strong> exchange data for information sharing, computation speedup, modularity, and convenience via two core IPC models (plus the Producer–Consumer paradigm: <strong>Unbounded-Buffer</strong> puts no practical limit on buffer size so consumer only waits when empty; <strong>Bounded-Buffer</strong> fixes capacity so producer also waits when full):</p>
  <table class="data-table">
    <thead>
      <tr><th>Criterion</th><th>Shared Memory (§3.5)</th><th>Message Passing (§3.6)</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Kernel Involvement</strong></td><td>Kernel required <strong>only at setup</strong> (<code>shm_open</code> + <code>mmap</code>) to attach a shared region; afterwards reads/writes happen directly at full RAM speed.</td><td>Kernel invoked on <strong>every transfer</strong> via <code>send()</code> / <code>recv()</code> system calls (higher syscall/copy overhead).</td></tr>
      <tr><td><strong>Synchronization</strong></td><td>Developer's responsibility (mutexes/semaphores required to prevent race conditions).</td><td>Handled implicitly by OS kernel queues/mailboxes.</td></tr>
      <tr><td><strong>Best Use Case</strong></td><td>Large data volumes between local processes on the same machine.</td><td>Small control messages and <strong>distributed systems across networks</strong>.</td></tr>
    </tbody>
  </table>
  <p><strong>Message Passing Design Choices (§3.6):</strong> (1) <em>Naming (§3.6.1):</em> Direct (<code>send(P, msg)</code> / symmetric vs asymmetric) vs. Indirect via Mailboxes/Ports (<code>send(A, msg)</code>); (2) <em>Synchronization (§3.6.2):</em> Blocking <code>send</code> + Blocking <code>recv</code> = <strong>Rendezvous</strong> (zero-capacity buffer), vs. Nonblocking async variants; (3) <em>Buffering (§3.6.3):</em> Zero capacity (queue=0, sender blocks), Bounded capacity (N, blocks if full), Unbounded capacity (sender never blocks).</p>

  <h3>6. Threads, Diagrams, Parallelism &amp; Amdahl's Law (Ch. 4, Mock Midterm Q2.B/C)</h3>
  <p>A <strong>Thread</strong> is the basic unit of CPU utilization. <strong>Single- vs. Multithreaded Process Figure (§4.1 / Quick Guide HIGH):</strong> All threads inside one process <strong>share</strong> Code, Data, and Open Files (plus Heap), whereas <em>each thread owns its own private</em> <strong>Registers</strong>, <strong>Program Counter (PC)</strong>, and <strong>Stack</strong> (making thread creation &amp; switching ~10–100&times; cheaper than full processes).</p>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>Concurrency vs. Parallelism</h4>
      <p><strong>Concurrency:</strong> Supports multiple tasks making interleaved progress (possible even on a 1-core CPU via time-slicing).<br><strong>Parallelism:</strong> Executes multiple tasks <em>simultaneously at the exact same physical instant</em> across multiple hardware cores.</p>
    </div>
    <div class="compare-card">
      <h4>Data vs. Task Parallelism (Mock Q2.B/C)</h4>
      <p><strong>Data Parallelism:</strong> Distributes subsets of the <em>same data</em> across cores applying the <em>same operation</em> (Mock Q2.C: adding 5 to each element of a 1,000-number array split across 4 cores = 250 each).<br><strong>Task Parallelism:</strong> Distributes <em>threads/tasks</em> across cores performing different operations on the same or different data.</p>
    </div>
  </div>
  <div class="formula-display">
    Amdahl's Law (§4.2.1 — [Textbook Beyond Slide 03]): Speedup &le; 1 / [ S + (1 &minus; S) / N ]
    <span class="formula-note">S = serial fraction of program (0 &le; S &le; 1); N = number of processing cores. Even as N &rarr; &infin;, maximum Speedup is capped at 1 / S!</span>
  </div>
  <ul>
    <li><strong>Many-to-One:</strong> Many user threads &rarr; 1 kernel thread. Fast user switching, but <strong>1 blocking syscall blocks entire process</strong> and zero multi-core parallelism.</li>
    <li><strong>One-to-One (Linux, Windows):</strong> Each user thread &rarr; 1 kernel thread. True multi-core parallelism + non-blocking on syscall, slight creation overhead.</li>
    <li><strong>Many-to-Many / Two-Level:</strong> Multiplexes M user threads onto N &le; M kernel threads, allowing flexible concurrency without excessive kernel thread overhead.</li>
  </ul>
</div>
""",
    },
    "deck_04": {
        "title": "CPU SCHEDULING CRITERIA & FCFS CONVOY EFFECT",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapters 3 & 5 (§3.2, §5.1–§5.3.1, §5.8.2)",
        "formulas": "TAT = Completion Time (CT) &minus; Arrival Time (AT)<br>WT = Turnaround Time (TAT) &minus; Burst Time (BT)<br>RT = First Start Time &minus; Arrival Time (AT)<br>Throughput = N / (CT<sub>max</sub> &minus; AT<sub>min</sub>)<br>Little's Formula: n = &lambda; &times; W",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 04 · SCHEDULING DISPATCH · SILBERSCHATZ CH. 3 &amp; 5</div>
    <h2 class="theory-heading">Process Schedulers, CPU Criteria, Dispatcher Latency &amp; FCFS</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §3.2 &amp; §5.1–§5.3.1, §5.8.2 · Deck 04 &amp; Practice Q6.A</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Compare Slide 04's <strong>2-State, 3-State, and 5-State Process Models</strong>, <strong>Scheduling Queues</strong> (Job, Ready, Device), and <strong>Long / Medium / Short-Term Schedulers</strong> (Midterm Quick Guide HIGH).</li>
      <li>Understand the alternating <strong>CPU–I/O Burst Cycle</strong> and the empirical hyperexponential burst histogram (§5.1.1).</li>
      <li>Classify all <strong>4 Scheduling Circumstances</strong> as strictly non-preemptive vs. preemptive (§5.1.3).</li>
      <li>Measure <strong>Dispatch Latency</strong> inside the short-term dispatcher (§5.1.4).</li>
      <li>Master all <strong>5 Scheduling Criteria</strong> + formulas (Utilization, <strong>Throughput = N / TotalSpan</strong>, TAT, WT, RT) and <strong>Little's Formula</strong> (§5.2, §5.8.2).</li>
      <li>Draw the <strong>Ready Queue (0.5 marks on Mock Q6.A)</strong> + FCFS Gantt charts (including CPU idle gaps!), apply AT=0 / PID tie rules, and diagnose the <strong>Convoy Effect</strong> (§5.3.1).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition-First Mental Model (Before the Formulas)</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Letting every runnable program flood RAM without an admission filter (<strong>no Long-Term Scheduler</strong>) causes thrashing, while pure <strong>FCFS</strong> lets one 24 ms batch truck block two 3 ms motorcycles in a single tunnel—blowing average wait time up by nearly 6&times;!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Picture a <strong>DMV + single coffee counter</strong>. The <strong>Long-Term Scheduler (minutes)</strong> decides how many customers enter the lobby (<em>degree of multiprogramming</em>); the <strong>Medium-Term Scheduler</strong> temporarily escorts idle visitors outside (<em>swapping</em>) if the lobby overfills; the <strong>Short-Term Scheduler (milliseconds)</strong> calls the next seated customer to the teller counter! Under <strong>FCFS</strong>, anyone holding a 50-item grocery cart forces express shoppers to wait behind them. <em>Where the analogy breaks:</em> Real processes leave the counter every few milliseconds to wait on disk I/O (<em>CPU–I/O burst cycle</em>) and must also follow explicit exam tie-breakers (earliest AT, then smaller PID unless inverted!).</li>
      <li><strong>Why Each Formula Exists:</strong> <code>TAT = CT &minus; AT</code> measures total wall-clock endurance; <code>WT = TAT &minus; BT</code> isolates pure wasted ready-queue delay; <code>Throughput = N / (CT<sub>max</sub> &minus; AT<sub>min</sub>)</code> measures completions over the active window (critical when all arrivals start at <code>AT &gt; 0</code>!).</li>
    </ul>
  </div>

  <h3>1. Slide 04 Foundations: Process Models, Queues &amp; 3 Schedulers (§3.2 / Slide 04 P4–P15)</h3>
  <ul>
    <li><strong>Evolution of Process State Models:</strong> <em>2-State</em> (Running / Not Running) &rarr; <em>3-State</em> (Running / Ready / Waiting) &rarr; <em>5-State</em> (New &rarr; Ready &harr; Running &harr; Waiting &rarr; Terminated).</li>
    <li><strong>Scheduling Queues (§3.2.1):</strong> <strong>Job Queue</strong> (all processes in the system), <strong>Ready Queue</strong> (processes in RAM awaiting CPU), and <strong>Device Queues</strong> (per-I/O-device queues waiting on disk/printer).</li>
    <li><strong>Long-Term (Job) Scheduler:</strong> Invoked infrequently (seconds/minutes, may be slow); admits jobs from disk into Ready Queue and controls the <strong>degree of multiprogramming</strong> (balancing I/O-bound + CPU-bound mix).</li>
    <li><strong>Short-Term (CPU) Scheduler:</strong> Invoked frequently (milliseconds, MUST be fast); selects which Ready process executes next and assigns the CPU (sometimes the <em>only</em> scheduler in UNIX/Windows).</li>
    <li><strong>Medium-Term Scheduler (Swapping):</strong> Added when degree of multiprogramming must decrease; swaps processes out to disk and later back into RAM to free memory contention.</li>
  </ul>

  <h3>2. CPU–I/O Burst Cycle &amp; Dispatcher (§5.1.1, §5.1.4)</h3>
  <p>Process execution alternates continuously between <strong>CPU execution bursts</strong> and <strong>I/O wait bursts</strong>, always starting and ending with a CPU burst (ending in an <code>exit()</code> system call). An <em>I/O-bound</em> program produces many very short CPU bursts; a <em>CPU-bound</em> program produces fewer, very long CPU bursts.</p>
  <p>Whenever the CPU becomes idle, the <strong>Short-Term Scheduler (CPU Scheduler)</strong> picks a Ready process (FIFO queue, priority queue, tree, or unordered list), and the <strong>Dispatcher (§5.1.4)</strong> gives it physical control of the core by: (1) switching context, (2) switching to User Mode, and (3) jumping to the saved PC location. The time taken to stop one process and start another is <strong>Dispatch Latency</strong> (kept in microseconds).</p>

  <h3>3. Preemptive vs. Non-Preemptive Scheduling: The 4 Circumstances (§5.1.3)</h3>
  <table class="data-table">
    <thead>
      <tr><th>#</th><th>Transition Circumstance</th><th>Type</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1</strong></td><td>Running &rarr; Waiting (e.g., I/O request or <code>wait()</code> call)</td><td>Non-preemptive (process cannot continue anyway)</td></tr>
      <tr><td><strong>2</strong></td><td>Running &rarr; Ready (e.g., timer interrupt expires)</td><td><strong>Preemptive choice</strong></td></tr>
      <tr><td><strong>3</strong></td><td>Waiting &rarr; Ready (e.g., I/O finishes &amp; preempts lower-prio process)</td><td><strong>Preemptive choice</strong></td></tr>
      <tr><td><strong>4</strong></td><td>Running &rarr; Terminated (process calls <code>exit()</code>)</td><td>Non-preemptive (process finished)</td></tr>
    </tbody>
  </table>
  <p><strong>Non-preemptive (Cooperative):</strong> Scheduling only under 1 &amp; 4; once a process gets the CPU, it keeps it until blocking or terminating. <strong>Preemptive:</strong> Scheduling also under 2 &amp; 3; essential for responsive OSes, but introduces race conditions on shared kernel data and requires synchronization (mutexes/interrupt disabling) inside kernel mode.</p>

  <h3>4. The 5 Core Scheduling Criteria &amp; Little's Law (§5.2, §5.8.2)</h3>
  <div class="formula-display">
    TAT = Completion Time (CT) &minus; Arrival Time (AT) &nbsp;|&nbsp; Throughput = N / (CT<sub>max</sub> &minus; AT<sub>min</sub>)<br>
    WT = Turnaround Time (TAT) &minus; Burst Time (BT) &nbsp;|&nbsp; RT = First CPU Start &minus; AT
    <span class="formula-note">For non-preemptive schedules (1 continuous block per job), Waiting Time equals Response Time (WT = RT). Once preemption splits execution, WT &ge; RT!</span>
  </div>
  <ul>
    <li><strong>CPU Utilization (MAXIMIZE):</strong> Percentage of time the CPU stays busy doing useful work (typically 40% lightly loaded to 90% heavily loaded).</li>
    <li><strong>Throughput (MAXIMIZE):</strong> Number of processes completed per unit time: <code>N / (CT<sub>max</sub> &minus; AT<sub>min</sub>)</code> (Slide 04 P26–P98; note truncation to 2 decimals like <code>3 / 31 = 0.09</code> in slides!).</li>
    <li><strong>Turnaround Time (TAT — MINIMIZE):</strong> Total interval from submission (Arrival) to completion, summing ready-queue wait, CPU bursts, and I/O waits.</li>
    <li><strong>Waiting Time (WT — MINIMIZE):</strong> Total time spent waiting purely inside the Ready Queue (CPU scheduling only controls WT directly!).</li>
    <li><strong>Response Time (RT — MINIMIZE):</strong> Time from submission until the <em>first</em> response starts being produced—critical for interactive UIs.</li>
    <li><strong>Little's Formula (§5.8.2 Queueing Models):</strong> In any steady-state queue, average queue length <code>n</code> = average arrival rate <code>&lambda;</code> &times; average wait time <code>W</code> (<code>n = &lambda; &middot; W</code>). E.g., if 7 processes arrive per second and there are always 14 processes waiting in queue, average wait <code>W = 14 / 7 = 2 seconds</code>.</li>
  </ul>

  <h3>5. First-Come, First-Served (FCFS) &amp; Slide 04 Worked Examples (§5.3.1)</h3>
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Exam Checklist (Mock Q6.A &amp; Midterm Quick Guide)</div>
    <ol>
      <li><strong>Draw the Ready Queue!</strong> Mock Midterm Q6 explicitly awards <strong>0.5 marks per algorithm</strong> solely for drawing the Ready Queue order alongside Gantt (1.5), Table (1), Avg WT (0.5), and Avg TAT (0.5).</li>
      <li><strong>Exam Conventions:</strong> If <code>AT</code> is omitted, assume <code>AT = 0</code>; equal arrival + equal priority ties break by <strong>smallest PID first</strong> unless the prompt overrides; <strong>read every priority direction twice!</strong></li>
    </ol>
  </div>
  <p>FCFS allocates the CPU strictly in the order processes request it using a simple <strong>FIFO queue</strong>. It is easy to code and starvation-free, <strong>non-preemptive</strong>, and produces terrible average waiting time when burst sizes vary.</p>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Slide 04 Examples 01–04: Convoy Effect, CPU Idle Gap &amp; Staggered Arrivals</div>
    <p><strong>Ex 01 &amp; Ex 02 (AT = 0, P1=24, P2=3, P3=3):</strong></p>
    <table class="data-table">
      <thead>
        <tr><th>Order</th><th>Gantt Chart</th><th>WT (P1, P2, P3)</th><th>Average WT / Throughput</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>Ex 01: P1, P2, P3</strong></td><td><code>| P1 (0–24) | P2 (24–27) | P3 (27–30) |</code></td><td>0, 24, 27 ms</td><td>Avg WT = <strong>17.0 ms</strong> (Avg TAT = 27.0, TP = 3/30 = <strong>0.10</strong>)</td></tr>
        <tr><td><strong>Ex 02: P2, P3, P1</strong></td><td><code>| P2 (0–3) | P3 (3–6) | P1 (6–30) |</code></td><td>6, 0, 3 ms</td><td>Avg WT = <strong>3.0 ms</strong> (Avg TAT = 13.0, TP = <strong>0.10</strong>)</td></tr>
      </tbody>
    </table>
    <p><strong>Ex 03 (CPU Idle Gap Trap — P1(AT=5,BT=24), P2(1,3), P3(8,3)):</strong> Ready Queue = <code>[P2, P1, P3]</code>. Gantt: <code>Idle(0–1) | P2(1–4) | Idle(4–5) | P1(5–29) | P3(29–32)</code>! CTs: <code>29, 4, 32</code> &rArr; TATs: <code>24, 3, 24</code> (<strong>Avg TAT = 17.0</strong>); WTs: <code>0, 0, 21</code> (<strong>Avg WT = 7.0</strong>); <strong>Throughput = 3 / (32 &minus; 1) = 0.09</strong>!</p>
    <p><strong>Ex 04 (Staggered Multi-Job Practice — P0(2,2), P1(0,4), P2(8,14), P3(4,2), P4(11,5)):</strong> Arrival order <code>P1 &rarr; P0 &rarr; P3 &rarr; P2 &rarr; P4</code> gives Gantt <code>P1(0–4) | P0(4–6) | P3(6–8) | P2(8–22) | P4(22–27)</code> &rArr; <strong>Avg TAT = 11.0, Avg WT = 8.2, Throughput = 5 / 27 = 0.19</strong>.</p>
  </div>

  <h3>6. The Convoy Effect (§5.3.1)</h3>
  <div class="callout callout-definition">
    <div class="callout-title">📜 Textbook Definition: Convoy Effect</div>
    "All the other processes wait for the one big CPU-bound process to get off the CPU. This effect results in lower CPU and device utilization than might be possible if the shorter processes were allowed to run first."
  </div>
  <p>Think of multiple short interactive/I/O-bound processes idling while one CPU hog holds the single processor, leaving disk controllers idle while the I/O processes queue up behind it; then when the CPU hog finally enters I/O, all tiny processes sprint through the CPU in microseconds and stampede onto the I/O queue together, starving the CPU!</p>
</div>
""",
    },
    "deck_05": {
        "title": "SJF & EXPONENTIAL BURST PREDICTION",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 5 (§5.3.2)",
        "formulas": "Exponential Averaging: &tau;<sub>n+1</sub> = &alpha; &middot; t<sub>n</sub> + (1 &minus; &alpha;) &middot; &tau;<sub>n</sub><br>Weight Parameter: 0 &le; &alpha; &le; 1 (Typical &alpha; = 0.5)<br>Throughput = N / (CT<sub>max</sub> &minus; AT<sub>min</sub>)<br>WT(P<sub>k</sub>) = TAT(P<sub>k</sub>) &minus; BT(P<sub>k</sub>)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 05 · OPTIMAL NON-PREEMPTIVE SCHEDULING · SILBERSCHATZ §5.3.2</div>
    <h2 class="theory-heading">Shortest-Job-First (SJF) &amp; Exponential Averaging Burst Prediction</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §5.3.2 (Exponential Averaging beyond Deck 05) · Deck 05 Practice Scope</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Explain why non-preemptive <strong>SJF (Shortest-Next-CPU-Burst)</strong> is provably optimal for minimum average waiting time.</li>
      <li>Apply the tie-breaking rule (FCFS arrival order, then smaller PID in Slide 05) when ready processes share identical CPU burst lengths.</li>
      <li>Solve Deck 05 SJF practice examples (Ex 01–04) including CPU idle intervals and <strong>Throughput</strong>.</li>
      <li>Compute next CPU burst predictions via <strong>Exponential Averaging</strong> and interpret <code>&alpha; = 0</code>, <code>&alpha; = 1</code>, and <code>&alpha; = 0.5</code> <em>[Textbook §5.3.2 Beyond Slide 05]</em>.</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition-First Mental Model (Before the Formulas)</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Letting one 24 ms CPU hog finish before two 3 ms jobs forces BOTH short jobs to suffer 24+ ms of wait! Putting <em>any</em> shorter burst before a longer ready burst eliminates a strictly larger delay than it creates—and guessing next burst from only the last burst (<code>&alpha; = 1</code>) overreacts to one random spike, whereas freezing at <code>&tau;<sub>0</sub></code> (<code>&alpha; = 0</code>) ignores real workload shifts!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Think of an <strong>express checkout lane sorted strictly by basket size</strong> once the cashier finishes scanning the current shopper cleanly (<strong>non-preemptive</strong>). Wait-time variance drops dramatically, while Exponential Averaging with <code>&alpha; = 0.5</code> acts like a <strong>50/50 thermostat predictor</strong> blending yesterday's reading with long-term climate. <em>Where the analogy breaks:</em> Non-preemptive SJF <strong>still waits</strong> if the 24 ms shopper stepped up at <code>t = 0</code> before the 3 ms shopper arrived at <code>t = 5</code>—and an endless stream of 3-item baskets will <strong>starve</strong> a 100-item cart indefinitely!</li>
      <li><strong>Why Each Formula Exists:</strong> Swapping adjacent jobs <code>L</code> before <code>S</code> adds wait <code>S</code> to one job while saving wait <code>L</code> on the other, yielding net gain <code>S &minus; L &lt; 0</code>; the geometric decay <code>(1 &minus; &alpha;)<sup>k</sup></code> ensures recent bursts dominate while weights sum cleanly to <code>1</code>.</li>
    </ul>
  </div>

  <h3>1. SJF Principle &amp; Proof of Optimality (§5.3.2)</h3>
  <p>More accurately called <strong>Shortest-Next-CPU-Burst Scheduling</strong>, SJF associates with each ready process the length of its <em>next</em> CPU burst (not its total lifetime). When the CPU becomes available, it picks the ready process with the smallest next burst. Ties are broken using <strong>FCFS order</strong>.</p>

  <div class="callout callout-definition">
    <div class="callout-title">📜 Provable Optimality (Exchange Argument)</div>
    Suppose two processes sit ready: <code>P<sub>short</sub></code> (burst <code>S</code>) and <code>P<sub>long</sub></code> (burst <code>L &gt; S</code>). Placing <code>P<sub>short</sub></code> before <code>P<sub>long</sub></code> causes <code>P<sub>long</sub></code> to wait <code>S</code>; placing <code>P<sub>long</sub></code> first causes <code>P<sub>short</sub></code> to wait <code>L</code>. Moving a shorter process before a longer one decreases the waiting time of the short process <em>more than</em> it increases the waiting time of the long process (net change = <code>S &minus; L &lt; 0</code>). By repeating this swap, average waiting time reaches its global minimum among non-preemptive schedules!
  </div>
  <p><strong>Limitation:</strong> A general-purpose OS <em>cannot know the future length</em> of the next CPU burst! (And long CPU-bound processes can suffer <strong>starvation</strong> if short processes keep arriving). Instead, the kernel predicts the next burst using historical bursts.</p>

  <h3>2. Predicting Next CPU Burst: Exponential Averaging (§5.3.2 — <em>[Textbook Beyond Slide 05]</em>)</h3>
  <div class="formula-display">
    &tau;<sub>n+1</sub> = &alpha; &middot; t<sub>n</sub> + (1 &minus; &alpha;) &middot; &tau;<sub>n</sub>
    <span class="formula-note">where <strong>t<sub>n</sub></strong> = actual measured length of the n-th CPU burst, <strong>&tau;<sub>n</sub></strong> = previous predicted value, <strong>&tau;<sub>n+1</sub></strong> = predicted (n+1)-th burst, and <strong>0 &le; &alpha; &le; 1</strong>.</span>
  </div>
  <p>Expanding the recurrence shows why recent observations weigh exponentially more than older ones:</p>
  <div class="formula-display">
    &tau;<sub>n+1</sub> = &alpha;t<sub>n</sub> + (1&minus;&alpha;)&alpha;t<sub>n&minus;1</sub> + (1&minus;&alpha;)<sup>2</sup>&alpha;t<sub>n&minus;2</sub> + &hellip; + (1&minus;&alpha;)<sup>j</sup>&alpha;t<sub>n&minus;j</sub> + &hellip; + (1&minus;&alpha;)<sup>n+1</sup>&tau;<sub>0</sub>
  </div>
  <ul>
    <li><strong>If &alpha; = 0:</strong> &tau;<sub>n+1</sub> = &tau;<sub>n</sub>. Recent actual history is <strong>completely ignored</strong>; initial estimate &tau;<sub>0</sub> rules forever (assumes unchanging process behavior).</li>
    <li><strong>If &alpha; = 1:</strong> &tau;<sub>n+1</sub> = t<sub>n</sub>. Past smoothed history is discarded; <strong>only the most recent actual burst t<sub>n</sub> counts</strong>.</li>
    <li><strong>If &alpha; = 0.5:</strong> Equal balance (50/50) between the most recent observation and all accumulated prior history—commonly chosen in textbook exams.</li>
  </ul>

  <h3>3. Step-by-Step Numerical Trace (Exponential Averaging)</h3>
  <p>Assume initial guess <strong>&tau;<sub>0</sub> = 10 ms</strong>, <strong>&alpha; = 0.5</strong>, and observed CPU bursts <code>t<sub>0</sub> = 6, t<sub>1</sub> = 4, t<sub>2</sub> = 6, t<sub>3</sub> = 12</code> ms:</p>
  <table class="data-table">
    <thead>
      <tr><th>Step n</th><th>Actual t<sub>n</sub></th><th>Formula: &tau;<sub>n+1</sub> = 0.5(t<sub>n</sub>) + 0.5(&tau;<sub>n</sub>)</th><th>Predicted &tau;<sub>n+1</sub></th></tr>
    </thead>
    <tbody>
      <tr><td>n = 0</td><td>t<sub>0</sub> = 6</td><td>0.5(6) + 0.5(10) = 3 + 5</td><td><strong>&tau;<sub>1</sub> = 8 ms</strong></td></tr>
      <tr><td>n = 1</td><td>t<sub>1</sub> = 4</td><td>0.5(4) + 0.5(8) = 2 + 4</td><td><strong>&tau;<sub>2</sub> = 6 ms</strong></td></tr>
      <tr><td>n = 2</td><td>t<sub>2</sub> = 6</td><td>0.5(6) + 0.5(6) = 3 + 3</td><td><strong>&tau;<sub>3</sub> = 6 ms</strong></td></tr>
      <tr><td>n = 3</td><td>t<sub>3</sub> = 12</td><td>0.5(12) + 0.5(6) = 6 + 3</td><td><strong>&tau;<sub>4</sub> = 9 ms</strong></td></tr>
    </tbody>
  </table>

  <h3>4. Slide 05 Worked Examples (Ex 02, Ex 03) &amp; Classic Textbook Trace</h3>
  <div class="callout callout-example">
    <div class="callout-title">🧮 Deck 05 — Non-Preemptive SJF Practice Examples (Ex 01–04)</div>
    <ul>
      <li><strong>Slide 05 Ex 02 (Why Non-Preemptive Can't Interrupt P1):</strong> <code>P1(AT=0, BT=24)</code>, <code>P2(AT=5, BT=3)</code>, <code>P3(AT=8, BT=3)</code>. At <code>t=0</code> only P1 is present, so P1 executes <code>0–24</code> undisturbed! Ready Queue at <code>t=24</code> holds P2(3) then P3(3) &rArr; Gantt: <code>| P1(0–24) | P2(24–27) | P3(27–30) |</code>. TATs = <code>24, 22, 22</code> (<strong>Avg TAT = 22.7 ms</strong>); WTs = <code>0, 19, 19</code> (<strong>Avg WT = 12.7 ms</strong>); <strong>Throughput = 3 / 30 = 0.10</strong>!</li>
      <li><strong>Slide 05 Ex 03 (Idle Gap + Staggered Arrivals):</strong> <code>P1(AT=5, BT=24)</code>, <code>P2(AT=1, BT=3)</code>, <code>P3(AT=8, BT=3)</code>. Gantt: <code>Idle(0–1) | P2(1–4) | Idle(4–5) | P1(5–29) | P3(29–32)</code>. CTs = <code>29, 4, 32</code> &rArr; <strong>Avg TAT = 17.0 ms, Avg WT = 7.0 ms, Throughput = 3 / (32 &minus; 1) = 0.09</strong>.</li>
      <li><strong>Slide 05 Ex 01 / Ex 04 (Simultaneous AT=0):</strong> For <code>P1..P4</code> with <code>BT = 6, 8, 7, 3</code> at <code>AT=0</code>, shortest-first order <code>P4(3) &rarr; P1(6) &rarr; P3(7) &rarr; P2(8)</code> yields <code>| P4(0–3) | P1(3–9) | P3(9–16) | P2(16–24) |</code> &rArr; <strong>Avg TAT = 13.0 ms, Avg WT = 7.0 ms, Throughput = 4 / 24 = 0.16</strong> (truncated).</li>
    </ul>
  </div>

  <p><strong>Classic Textbook Example (Earlier Silberschatz Editions — NOT Slide 05):</strong> Dynamic Non-Preemptive SJF with Staggered Arrivals:</p>
  <table class="data-table">
    <thead>
      <tr><th>Process</th><th>AT</th><th>BT</th><th>Start</th><th>CT</th><th>TAT = CT &minus; AT</th><th>WT = TAT &minus; BT</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>P1</strong></td><td>0 ms</td><td>7 ms</td><td>0</td><td>7</td><td>7 &minus; 0 = 7 ms</td><td>7 &minus; 7 = <strong>0 ms</strong></td></tr>
      <tr><td><strong>P2</strong></td><td>2 ms</td><td>4 ms</td><td>8</td><td>12</td><td>12 &minus; 2 = 10 ms</td><td>10 &minus; 4 = <strong>6 ms</strong></td></tr>
      <tr><td><strong>P3</strong></td><td>4 ms</td><td>1 ms</td><td>7</td><td>8</td><td>8 &minus; 4 = 4 ms</td><td>4 &minus; 1 = <strong>3 ms</strong></td></tr>
      <tr><td><strong>P4</strong></td><td>5 ms</td><td>4 ms</td><td>12</td><td>16</td><td>16 &minus; 5 = 11 ms</td><td>11 &minus; 4 = <strong>7 ms</strong></td></tr>
    </tbody>
  </table>
  <div class="callout callout-example">
    <div class="callout-title">🧮 Trace &amp; Averages</div>
    <strong>Gantt Chart:</strong> <code>| P1 (0–7) | P3 (7–8) | P2 (8–12) | P4 (12–16) |</code><br>
    At <code>t = 0</code>, only P1 exists, so P1 runs uninterrupted to <code>t = 7</code> (even though P2 and P3 arrive while P1 runs—<strong>non-preemptive</strong>!). At <code>t = 7</code>, ready processes are P2(4), P3(1), P4(4). P3(1) runs first (<code>7–8</code>). At <code>t = 8</code>, P2 and P4 tie at <code>4 ms</code>; FCFS tie-breaker runs P2 (arrived at 2) before P4 (arrived at 5).<br>
    <strong>Average WT:</strong> (0 + 6 + 3 + 7) / 4 = 16 / 4 = <strong>4.0 ms</strong> (vs FCFS 5.5 ms). <strong>Average TAT:</strong> (7 + 10 + 4 + 11) / 4 = <strong>8.0 ms</strong>.
  </div>
</div>
""",
    },
    "deck_06": {
        "title": "SHORTEST REMAINING TIME FIRST (SRTF)",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 5 (§5.3.2)",
        "formulas": "Preemption Rule at Arrival t:<br>If Burst(P<sub>new</sub>) &lt; Remaining(P<sub>running</sub>) &rArr; PREEMPT!<br>Throughput = N / (CT<sub>max</sub> &minus; AT<sub>min</sub>)<br>Average WT &amp; TAT of SRTF &le; ALL other algorithms",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 06 · PREEMPTIVE OPTIMAL SCHEDULING · SILBERSCHATZ §5.3.2</div>
    <h2 class="theory-heading">Shortest Remaining Time First (SRTF — Preemptive SJF)</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §5.3.2 · Deck 06 Practice Scope</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Apply the exact <strong>SRTF preemption comparison rule</strong> whenever a new process arrives.</li>
      <li>Track remaining CPU bursts across preemption splits (including <strong>Slide 06 Ex 02 &amp; Ex 03</strong>) to construct accurate Gantt charts.</li>
      <li>Compute CT, TAT, WT, <strong>Throughput</strong>, and <strong>Response Time (RT)</strong> for split processes (remember: <code>WT &ne; RT</code> under preemption!).</li>
      <li>Diagnose why Slide 06 highlights Starvation of long jobs &amp; preemption of high-priority long jobs (motivating Priority Scheduling!).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition-First Mental Model (Before the Formulas)</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Under non-preemptive SJF, arriving 1 ms too late forces a tiny 3 ms task to wait 23 ms behind an ongoing 24 ms task. Under SRTF, even Slide 06 Ex 03 drops Avg WT from <strong>7.0 ms &rarr; 1.0 ms</strong> simply by pausing P1 to finish P3 in 3 ms! Yet if priority importance ignores burst length, a mission-critical 20 ms medical task gets preempted by tiny low-priority background tasks—the exact flaw that motivates Deck 07 Priority Scheduling!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Picture an <strong>emergency-room triage nurse</strong>: changing a long routine cast (24 min remaining) is paused immediately if a patient arrives needing a 3-minute EpiPen shot. However, if two patients have identical <code>4 min</code> remaining treatment times (<code>Burst == Remaining</code>), you NEVER disrupt the active patient! <em>Where the analogy breaks:</em> Every preemption costs hardware <strong>Context Switch</strong> time—if micro-bursts preempt repeatedly by 0.5 ms margins, real wall-clock throughput drops below non-preemptive SJF.</li>
      <li><strong>Why Each Formula Exists:</strong> Comparing remaining time against arriving burst extends the optimality exchange argument across time instants; using strict <code>&lt;</code> (not <code>&le;</code>) avoids zero-gain context switches on ties.</li>
    </ul>
  </div>

  <h3>1. The Preemptive Decision Rule (§5.3.2)</h3>
  <p><strong>Shortest-Remaining-Time-First (SRTF)</strong> is the preemptive counterpart to SJF. While a process runs on the CPU, a new process may arrive with a next CPU burst shorter than what the currently executing process still has left to finish.</p>
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ The Exact SRTF Preemption Test</div>
    <div class="formula-display">
      If Burst(P<sub>new</sub>) &lt; Remaining Burst(P<sub>running</sub>) &nbsp;&rArr;&nbsp; PREEMPT P<sub>running</sub>!
      <span class="formula-note">Strict less-than (&lt;)! If Burst(P<sub>new</sub>) == Remaining(P<sub>running</sub>), DO NOT preempt—the running process retains the CPU (avoids pointless context switch overhead).</span>
    </div>
    When preempted, the running process updates its remaining burst in its PCB, returns to the Ready Queue, and the newly arrived shorter process immediately starts.
  </div>

  <h3>2. Textbook Worked Example (Silberschatz 10th Ed. §5.3.2): SRTF Gantt Trace</h3>
  <table class="data-table">
    <thead>
      <tr><th>Process</th><th>AT</th><th>BT</th><th>First Start</th><th>CT</th><th>TAT = CT &minus; AT</th><th>WT = TAT &minus; BT</th><th>RT = First Start &minus; AT</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>P1</strong></td><td>0 ms</td><td>8 ms</td><td>0</td><td>17</td><td>17 &minus; 0 = 17 ms</td><td>17 &minus; 8 = <strong>9 ms</strong></td><td>0 &minus; 0 = 0 ms</td></tr>
      <tr><td><strong>P2</strong></td><td>1 ms</td><td>4 ms</td><td>1</td><td>5</td><td>5 &minus; 1 = 4 ms</td><td>4 &minus; 4 = <strong>0 ms</strong></td><td>1 &minus; 1 = 0 ms</td></tr>
      <tr><td><strong>P3</strong></td><td>2 ms</td><td>9 ms</td><td>17</td><td>26</td><td>26 &minus; 2 = 24 ms</td><td>24 &minus; 9 = <strong>15 ms</strong></td><td>17 &minus; 2 = 15 ms</td></tr>
      <tr><td><strong>P4</strong></td><td>3 ms</td><td>5 ms</td><td>5</td><td>10</td><td>10 &minus; 3 = 7 ms</td><td>7 &minus; 5 = <strong>2 ms</strong></td><td>5 &minus; 3 = 2 ms</td></tr>
    </tbody>
  </table>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Tick-by-Tick Execution Trace</div>
    <ol>
      <li><strong>t = 0:</strong> Only P1 (BT = 8) is ready. P1 begins executing.</li>
      <li><strong>t = 1:</strong> P2 arrives (BT = 4). P1 has run 1 ms &rarr; Remaining(P1) = 8 &minus; 1 = <strong>7 ms</strong>. Since <code>4 &lt; 7</code>, <strong>P1 is preempted!</strong> P2 starts.</li>
      <li><strong>t = 2:</strong> P3 arrives (BT = 9). Remaining(P2) = 4 &minus; 1 = 3 ms. Since <code>9 &gt; 3</code>, P2 continues.</li>
      <li><strong>t = 3:</strong> P4 arrives (BT = 5). Remaining(P2) = 3 &minus; 1 = 2 ms. Since <code>5 &gt; 2</code>, P2 continues.</li>
      <li><strong>t = 5:</strong> P2 completes (<strong>CT = 5</strong>). Ready Queue: P1(rem=7), P3(9), P4(5). Shortest is <strong>P4(5)</strong> &rarr; P4 runs <code>5–10</code>.</li>
      <li><strong>t = 10:</strong> P4 completes (<strong>CT = 10</strong>). Ready Queue: P1(rem=7), P3(9). Shortest is <strong>P1(7)</strong> &rarr; P1 runs <code>10–17</code>.</li>
      <li><strong>t = 17:</strong> P1 completes (<strong>CT = 17</strong>). Remaining job <strong>P3(9)</strong> runs <code>17–26</code> (<strong>CT = 26</strong>).</li>
    </ol>
    <strong>Final Gantt Chart:</strong> <code>| P1 (0–1) | P2 (1–5) | P4 (5–10) | P1 (10–17) | P3 (17–26) |</code><br>
    <strong>Average TAT:</strong> (17 + 4 + 24 + 7) / 4 = 52 / 4 = <strong>13.0 ms</strong> &nbsp;|&nbsp;
    <strong>Average WT:</strong> (9 + 0 + 15 + 2) / 4 = 26 / 4 = <strong>6.5 ms</strong>.
  </div>

  <h3>3. Deck 06 Worked Example 03 &amp; SJF vs. SRTF Trade-Offs</h3>
  <div class="callout callout-example">
    <div class="callout-title">🧮 Slide 06 Ex 03 (P1=5,24; P2=1,3; P3=8,3) — Preemption &amp; Idle Gaps</div>
    <ul>
      <li><strong>t = 0–1:</strong> CPU Idle (no arrivals yet). <strong>t = 1–4:</strong> P2 arrives &amp; finishes uninterrupted (<code>CT = 4</code>). <strong>t = 4–5:</strong> CPU Idle until P1 arrives at <code>t = 5</code>.</li>
      <li><strong>t = 5–8:</strong> P1 runs 3 ms (<code>Remaining(P1) = 21 ms</code>). At <code>t = 8</code>, P3 arrives with <code>BT = 3 &lt; 21</code> &rArr; <strong>P1 is preempted!</strong></li>
      <li><strong>t = 8–11:</strong> P3 finishes (<code>CT = 11</code>). <strong>t = 11–32:</strong> P1 resumes and finishes remaining 21 ms (<code>CT = 32</code>).</li>
      <li><strong>Results:</strong> Ready Queue trace = <code>[P1, P2, P1, P3]</code> (execution chunks); TATs = <code>27, 3, 3</code> &rArr; <strong>Avg TAT = 11.0 ms</strong>; WTs = <code>3, 0, 0</code> &rArr; <strong>Avg WT = 1.0 ms</strong>; <strong>Throughput = 3 / (32 &minus; 1) = 0.09</strong> (Slide 06 truncates <code>3/31</code> to 2 decimals; contrast with non-preemptive SJF Ex 03 Avg WT = 7.0 ms!). Note: when all jobs arrive at <code>t = 0</code> (Slide 06 Ex 04: <code>6, 8, 7, 3</code>), SRTF produces the exact same schedule as SJF (<strong>Avg WT = 7.0, TP = 0.16</strong>).</li>
    </ul>
  </div>
  <p>On the Silberschatz §5.3.2 4-process dataset above, non-preemptive SJF yields <code>| P1 (0–8) | P2 (8–12) | P4 (12–17) | P3 (17–26) |</code> with Waiting Times <code>P1=0, P2=7, P4=9, P3=15</code> &rarr; <strong>Average WT = 31 / 4 = 7.75 ms</strong> (vs. <strong>6.5 ms</strong> in SRTF!).</p>
  <ul>
    <li><strong>Optimality:</strong> SRTF gives the <strong>lowest mathematically possible average waiting time</strong> across all scheduling policies for any given arrival pattern.</li>
    <li><strong>Slide 06 Weaknesses &amp; Transition:</strong> (1) Higher context-switch overhead than SJF; (2) Still requires burst-time prediction; (3) Jobs with huge bursts suffer <strong>starvation</strong>; (4) A <strong>higher-priority critical job with a big burst loses the CPU</strong> to tiny unimportant jobs—motivating Priority Scheduling (Deck 07).</li>
  </ul>
</div>
""",
    },
    "deck_07": {
        "title": "PRIORITY SCHEDULING, STARVATION & AGING",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 5 (§5.3.4, §5.6.3–§5.6.4)",
        "formulas": "Convention: Low Integer = HIGH Priority (Prio 1 &gt; Prio 2 unless inverted)<br>Aging Formula: NewPrio = max(Top, OldPrio &minus; &lfloor;Wait / Interval&rfloor;)<br>Throughput = N / (CT<sub>max</sub> &minus; AT<sub>min</sub>)<br>Avg WT = &Sigma; WT / N &nbsp;|&nbsp; Avg TAT = &Sigma; TAT / N",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 07 · PRIORITY DISPATCH · SILBERSCHATZ §5.3.4</div>
    <h2 class="theory-heading">Priority Scheduling, Indefinite Starvation &amp; The Aging Mechanism</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §5.3.4 &amp; §5.6.3–§5.6.4 (Internal/External &amp; RMS/EDF beyond Deck 07) · Core Topic Scope (Practice Q6)</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Apply Silberschatz / Slide 07 priority rules (<strong>lower integer = higher priority</strong> unless inverted), tie-breakers (<strong>PID in Slide 07</strong> vs. <strong>FCFS in Mock Q6</strong>), and the Quick Guide rule: <em>"Read the priority rule twice!"</em></li>
      <li>Execute both <strong>Non-Preemptive</strong> and <strong>Preemptive Priority</strong> Gantt charts + Ready Queues (Slide 07 Ex 03 &amp; Mock Midterm Q6) and spot the Ex 03 erratum.</li>
      <li>Diagnose <strong>Indefinite Blocking (Starvation)</strong> and prevent it using <strong>Aging</strong> (§5.3.4).</li>
      <li>Compare Internal vs. External priorities (§5.3.4), Priority + Round Robin (§5.3.4), and Real-Time Scheduling (RMS §5.6.3 &amp; EDF §5.6.4) <em>[Textbook Beyond Slide 07]</em>.</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition-First Mental Model (Before the Formulas)</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Letting strictly static priorities rule without escalation means a continuous stream of Priority-1 jobs leaves a Priority-127 maintenance job stranded for years (the real MIT IBM 7094 shutdown story: a 1967 job still sitting unrun in 1973!).</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Imagine a <strong>hospital triage board with an auto-escalator clock</strong>: critical cases jump straight to the front, while anyone waiting patiently has their urgency ticket bumped closer to Priority 0 every tick (<strong>Aging</strong>) so nobody dies waiting in the hallway. <em>Where the analogy breaks:</em> Unlike human queues, OS scheduling exams flip conventions on purpose—some problems state <em>"larger number = higher priority"</em> and tie-break rules flip between <em>PID</em> (Slide 07) and <em>FCFS</em> (Mock Midterm Q6)!</li>
      <li><strong>Why Each Formula Exists:</strong> Decreasing integer rank linearly with <code>&lfloor;Wait / Interval&rfloor;</code> bounds worst-case starvation latency mathematically (from <code>127</code> to <code>0</code> in <code>~127 s &approx; 2 min</code> at 1 boost/sec); Real-Time EDF sorts dynamically by deadline because static RMS leaves ~31% headroom stranded at high utilization.</li>
    </ul>
  </div>

  <h3>1. Priority Scheduling Principles &amp; Exam Rules (§5.3.4)</h3>
  <p>A priority integer is attached to every process PCB, and the CPU goes to the ready process holding the highest priority. Notice that <strong>SJF is simply a special case of Priority Scheduling</strong> where priority is inversely proportional to predicted next CPU burst (<code>priority &prop; 1 / &tau;<sub>n+1</sub></code>). <em>[Textbook Beyond Slide 07]:</em> Priorities can be <strong>Internal</strong> (time limits, memory, open files, avg I/O burst / avg CPU burst ratio) or <strong>External</strong> (user importance, funds paid, politics).</p>
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Exam Conventions: "Read the Priority Rule Twice!"</div>
    <ul>
      <li><strong>Direction Trap:</strong> In Silberschatz 10th Ed. and CPCS-361 Slide 07, <strong>smaller number = higher priority (1 &gt; 2 &gt; 3)</strong>—UNLESS the question explicitly inverts it (e.g., <em>"higher number = higher priority"</em>!). Always verify before tracing!</li>
      <li><strong>Tie-Breaker Difference:</strong> Slide 07 (P6) specifies that when Arrival Time and Priority are both equal, break ties by <strong>smaller Process Identifier (PID)</strong>; however, the <strong>Practice Exam Q6 convention explicitly uses FCFS (earlier arrival)</strong>—and remember to <strong>draw the Ready Queue (0.5 marks)</strong>!</li>
    </ul>
  </div>
  <ul>
    <li><strong>Non-Preemptive Priority:</strong> Simply places the arriving higher-priority process at the head of the ready queue; waits until the current process yields or finishes.</li>
    <li><strong>Preemptive Priority:</strong> Immediately preempts the running process if a newly arriving process has strictly higher priority (smaller priority integer). Equal priorities do <em>not</em> preempt.</li>
    <li><strong>Priority with Round Robin (§5.3.4):</strong> Runs highest-priority processes until higher priorities finish, and schedules <strong>multiple processes at the exact same priority level using Round Robin</strong> (time-sliced with quantum <code>q</code>) so peers share the CPU fairly.</li>
  </ul>

  <h3>2. Indefinite Blocking (Starvation) &amp; Aging (§5.3.4)</h3>
  <p><strong>Starvation (Indefinite Blocking):</strong> A ready low-priority process can sit waiting forever if a continuous stream of higher-priority processes keeps arriving. Famous textbook anecdote: when MIT's IBM 7094 shut down in 1973, engineers found a low-priority process submitted in <strong>1967</strong> that had still not executed after 6 years!</p>
  <div class="callout callout-definition">
    <div class="callout-title">📜 Textbook Solution: Aging (Silberschatz 10th Ed. §5.3.4)</div>
    "Aging involves gradually increasing the priority of processes that wait in the system for a long time."
    <div class="formula-display">
      Priority(t) = max(TopPriority, &nbsp;InitialPriority &minus; &lfloor;WaitingTime / AgingInterval&rfloor;)
      <span class="formula-note">Silberschatz 10th Ed. Example: Priorities 127 (lowest) to 0 (highest). Periodically (say, every second) increasing waiting priority by 1 takes a little over 2 minutes (~127 s) for a priority-127 job to age to priority 0, guaranteeing execution!</span>
    </div>
  </div>

  <h3>3. Mock Midterm 1 Q6 &amp; Slide 07 Worked Problems</h3>
  <p>Dataset from Practice Midterm Q6.B (Preemptive Priority Scheduling, where <strong>1 = highest priority</strong>, tie-break = <strong>FCFS</strong>):</p>
  <table class="data-table">
    <thead>
      <tr><th>Process</th><th>AT</th><th>BT</th><th>Priority</th><th>First Start</th><th>CT</th><th>TAT = CT &minus; AT</th><th>WT = TAT &minus; BT</th><th>RT</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>P1</strong></td><td>0 ms</td><td>6 ms</td><td>3</td><td>0</td><td>15</td><td>15 &minus; 0 = 15 ms</td><td>15 &minus; 6 = <strong>9 ms</strong></td><td>0 ms</td></tr>
      <tr><td><strong>P2</strong></td><td>1 ms</td><td>4 ms</td><td>2</td><td>1</td><td>7</td><td>7 &minus; 1 = 6 ms</td><td>6 &minus; 4 = <strong>2 ms</strong></td><td>0 ms</td></tr>
      <tr><td><strong>P3</strong></td><td>3 ms</td><td>2 ms</td><td>1</td><td>3</td><td>5</td><td>5 &minus; 3 = 2 ms</td><td>2 &minus; 2 = <strong>0 ms</strong></td><td>0 ms</td></tr>
      <tr><td><strong>P4</strong></td><td>4 ms</td><td>4 ms</td><td>4</td><td>15</td><td>19</td><td>19 &minus; 4 = 15 ms</td><td>15 &minus; 4 = <strong>11 ms</strong></td><td>11 ms</td></tr>
      <tr><td><strong>P5</strong></td><td>6 ms</td><td>3 ms</td><td>2</td><td>7</td><td>10</td><td>10 &minus; 6 = 4 ms</td><td>4 &minus; 3 = <strong>1 ms</strong></td><td>1 ms</td></tr>
    </tbody>
  </table>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Step-by-Step Preemptive Priority Execution Trace</div>
    <ul>
      <li><strong>t = 0:</strong> Only P1 (Prio=3) present &rarr; P1 starts.</li>
      <li><strong>t = 1:</strong> P2 arrives (Prio=2 &lt; 3). <strong>P2 preempts P1!</strong> P1 has 5 ms remaining. P2 starts.</li>
      <li><strong>t = 3:</strong> P3 arrives (Prio=1 &lt; 2). <strong>P3 preempts P2!</strong> P2 has 2 ms remaining. P3 starts.</li>
      <li><strong>t = 4:</strong> P4 arrives (Prio=4). P3 has Prio=1, so P3 continues undisturbed.</li>
      <li><strong>t = 5:</strong> P3 finishes (<strong>CT = 5</strong>). Ready Queue: P2 (Prio=2, rem=2), P1 (Prio=3, rem=5), P4 (Prio=4, rem=4). Highest priority is <strong>P2</strong> &rarr; P2 resumes at <code>t = 5</code>.</li>
      <li><strong>t = 6:</strong> P5 arrives (Prio=2). Tie with running P2 (Prio=2); running P2 is NOT preempted.</li>
      <li><strong>t = 7:</strong> P2 completes (<strong>CT = 7</strong>). Ready Queue: P5 (Prio=2, BT=3), P1 (Prio=3, rem=5), P4 (Prio=4, BT=4). <strong>P5</strong> runs <code>7–10</code> (<strong>CT = 10</strong>).</li>
      <li><strong>t = 10:</strong> P5 finishes. <strong>P1</strong> (Prio=3, rem=5) runs <code>10–15</code> (<strong>CT = 15</strong>).</li>
      <li><strong>t = 15:</strong> P1 finishes. <strong>P4</strong> (Prio=4, BT=4) runs <code>15–19</code> (<strong>CT = 19</strong>).</li>
    </ul>
    <strong>Gantt Chart:</strong> <code>| P1 (0–1) | P2 (1–3) | P3 (3–5) | P2 (5–7) | P5 (7–10) | P1 (10–15) | P4 (15–19) |</code><br>
    <strong>Average Waiting Time:</strong> (9 + 2 + 0 + 11 + 1) / 5 = 23 / 5 = <strong>4.60 ms</strong><br>
    <strong>Average Turnaround Time:</strong> (15 + 6 + 2 + 15 + 4) / 5 = 42 / 5 = <strong>8.40 ms</strong> &nbsp;|&nbsp; <strong>Throughput:</strong> 5 / 19 = <strong>0.26</strong>
  </div>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Slide 07 Preemptive Ex 03 (Note Slide AT=1 vs AT=0 Erratum!)</div>
    <p>Problem states <code>AT = 1</code> for all five jobs: <code>P1(AT=1, P=3, BT=10)</code>, <code>P2(1,1,1)</code>, <code>P3(1,4,2)</code>, <code>P4(1,5,1)</code>, <code>P5(1,2,5)</code>. Idle <code>0–1</code>, then execution order <code>P2(1–2) | P5(2–7) | P1(7–17) | P3(17–19) | P4(19–20)</code>, giving <strong>Throughput = 5 / (20 &minus; 1) = 0.26</strong>!<br>
    <em>Watch the Slide Erratum:</em> Slide 07 P156 accidentally copied <code>AT = 0</code> into its table calculation (writing <code>TAT = CT = 17, 2, 19, 20, 7</code> &rArr; Avg TAT = <strong>13.0</strong>, Avg WT = <strong>9.2</strong>), whereas subtracting the problem's stated <code>AT = 1</code> yields true <code>TAT = 16, 1, 18, 19, 6</code> (<strong>Avg TAT = 12.0 ms</strong>) and <code>WT = 6, 0, 16, 18, 1</code> (<strong>Avg WT = 8.2 ms</strong>)!</p>
  </div>

  <h3>4. Extension: Real-Time Priority Scheduling (§5.6.3–§5.6.4 — <em>[Textbook Beyond Slide 07]</em>)</h3>
  <ul>
    <li><strong>Rate-Monotonic Scheduling (RMS — §5.6.3):</strong> Assigns <em>static</em> priorities inversely proportional to task period <code>p</code> (shorter period = higher priority). Optimal among fixed-priority policies, bounded CPU utilization ~69% for large <code>N</code>.</li>
    <li><strong>Earliest-Deadline-First (EDF — §5.6.4):</strong> Assigns <em>dynamic</em> priorities according to closest upcoming deadline. Theoretically optimal—can achieve up to <strong>100% CPU utilization</strong> while still meeting every hard deadline!</li>
  </ul>
</div>
""",
    },
    "deck_08": {
        "title": "ROUND ROBIN (RR), MLQ, MLFQ & MULTIPROCESSOR SCHEDULING",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 5 (§5.3.3, §5.3.5–§5.3.6, §5.5)",
        "formulas": "Quantum q &rarr; &infin;: degenerates to FCFS<br>Quantum q &rarr; 0: Processor Sharing (1/N speed + high CS overhead)<br>Max Wait per turn = (n &minus; 1) &times; q<br>Throughput = N / (CT<sub>max</sub> &minus; AT<sub>min</sub>)<br>Rule of Thumb: 80% of CPU bursts &lt; q (typical q = 10–100 ms)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 08 · TIME-SHARING &amp; MULTILEVEL DISPATCH · SILBERSCHATZ §5.3.3–§5.5</div>
    <h2 class="theory-heading">Round Robin (RR), Time Quantum Sizing, MLQ, MLFQ &amp; Multiprocessor Scheduling</h2>
    <div class="theory-meta">Silberschatz 10th Ed. §5.3.3, §5.3.5, §5.3.6 &amp; §5.5 (Multiprocessor §5.5 beyond Deck 08) · Deck 08 Practice Scope</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Trace circular FIFO ready-queue preemption under <strong>Round Robin (RR)</strong> scheduling, including Slide 08 Ex 02's subtle <strong>arrival-before-requeue</strong> race (§5.3.3).</li>
      <li>Evaluate how <strong>Time Quantum (<code>q</code>)</strong> size impacts context-switch overhead, responsiveness, and Turnaround Time (Silberschatz <strong>Fig. 5.6</strong>).</li>
      <li>Compare fixed-partition <strong>Multilevel Queue (MLQ)</strong> against adaptive <strong>Multilevel Feedback Queue (MLFQ)</strong> (§5.3.5–§5.3.6).</li>
      <li>List all <strong>MLFQ defining parameters</strong> (Slide 08's 4 parameters + last queue always FCFS, vs. Silberschatz §5.3.6's 5 parameters).</li>
      <li>Explain <strong>Processor Affinity</strong> (Soft vs. Hard, NUMA) and <strong>Load Balancing</strong> (Push vs. Pull Migration) on multicore CPUs <em>[Textbook §5.5 Beyond Slide 08]</em>.</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition-First Mental Model (Before the Formulas)</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Letting quantum <code>q = 1,000 ms</code> collapses right back into FCFS's Convoy Effect; shrinking <code>q = 1 ms</code> when a context switch itself costs <code>1 ms</code> burns <strong>50% of all CPU electricity</strong> just shuffling registers! Even worse, assuming a larger <code>q</code> always reduces Avg TAT fails empirically (Fig. 5.6) whenever splitting pushes multiple nearly-done jobs just past a cycle!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Think of <strong>speed chess with a shared timer + a multi-tier DMV</strong>. In <strong>Round Robin</strong>, everyone gets an equal <code>q = 4 ms</code> turn before cycling to the back of the line (max wait per round = <code>(n &minus; 1)&thinsp;q</code>); in <strong>MLFQ</strong>, newcomers start at express Desk Q<sub>0</sub> (8 ms), spill-overs drop to Q<sub>1</sub> (16 ms), and heavy batch jobs land at slow Q<sub>2</sub> (FCFS). <em>Where the analogy breaks:</em> On multicore hardware, keeping a process on its original desk keeps its L1/L2 CPU cache warm (<strong>Processor Affinity</strong>), so over-aggressive <strong>Load Balancing</strong> that moves threads between cores actually slows memory access down—especially across remote <strong>NUMA</strong> sockets!</li>
      <li><strong>Why Each Formula Exists:</strong> Setting <code>q</code> so ~80% of bursts finish inside 1 slice gives sub-quantum responsiveness while avoiding repeated context switches; Push/Pull migration balances per-core queues when affinity isn't hard-pinned.</li>
    </ul>
  </div>

  <h3>1. Round Robin (RR) Algorithm (§5.3.3)</h3>
  <p>Designed specifically for <strong>time-sharing interactive systems</strong>, Round Robin behaves like FCFS plus hardware-timer preemption using a small fixed unit of time called a <strong>Time Quantum (<code>q</code>)</strong> (typically 10–100 ms):</p>
  <ol>
    <li>The Ready Queue operates as a circular FIFO queue; newly arriving processes join its tail.</li>
    <li>Scheduler pops the head process, sets the timer interrupt for <code>1 quantum = q</code>, and dispatches the process.</li>
    <li>Two outcomes occur:
      <br>&bull; <strong>Burst &le; q:</strong> The process voluntarily releases the CPU (finishes or blocks on I/O) before timer expiry; scheduler immediately dispatches the next ready process.
      <br>&bull; <strong>Burst &gt; q:</strong> Timer fires at <code>q</code>, interrupts the process, context switches, and places the preempted process at the <strong>tail of the Ready Queue</strong>.
    </li>
  </ol>

  <h3>2. Critical Impact of Time Quantum <code>q</code> Size</h3>
  <table class="data-table">
    <thead>
      <tr><th>Quantum Setting</th><th>System Behavior</th><th>Exam Takeaway</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>q &rarr; &infin; (Extremely Large)</strong></td><td>No timer interrupts ever fire before processes finish or block.</td><td>Degenerates strictly into <strong>FCFS</strong> (reintroducing the Convoy Effect!).</td></tr>
      <tr><td><strong>q &rarr; 0 (Extremely Small)</strong></td><td>Creates illusion of <strong>Processor Sharing</strong> where each of <code>N</code> processes thinks it owns a private CPU at <code>1/N</code> speed—but <strong>Context Switch Overhead dominates</strong>!</td><td>If <code>q = 1 ms</code> and context switch = <code>1 ms</code>, <strong>50% of CPU power is wasted switching!</strong></td></tr>
      <tr><td><strong>Optimal Tuning</strong></td><td><code>q</code> must be much larger than context-switch time (CS &lt; 10 &mu;s vs q = 10–100 ms).</td><td><strong>80% Rule of Thumb:</strong> About <strong>80% of CPU bursts should be shorter than <code>q</code></strong> so short jobs finish within 1 turn.</td></tr>
    </tbody>
  </table>
  <p><strong>Subtle Exam Trap (Silberschatz Fig. 5.6 — How Turnaround Time Varies with <code>q</code>):</strong> Average Turnaround Time under RR does <em>not</em> necessarily improve monotonically as <code>q</code> increases! Decreasing <code>q</code> lowers TAT for some sets and raises it for others whenever extra splits prolong completion beyond <code>q</code> (a famous rule of thumb puts <strong>80% of CPU bursts shorter than <code>q</code></strong>).</p>

  <h3>3. Slide 08 Worked Examples: Round Robin (<code>q = 4 ms</code>)</h3>
  <div class="callout callout-example">
    <div class="callout-title">🧮 Slide 08 Ex 01 (AT=0) &amp; Ex 02 (Staggered Enqueue Race Trap!)</div>
    <p><strong>Ex 01 (P1=24, P2=3, P3=3; AT=0, q=4):</strong></p>
    <p><strong>Gantt Chart (Draw separate 4 ms slices on exams!):</strong> <code>| P1 (0–4) | P2 (4–7) | P3 (7–10) | P1 (10–14) | P1 (14–18) | P1 (18–22) | P1 (22–26) | P1 (26–30) |</code></p>
    <table class="data-table">
      <thead>
        <tr><th>Process</th><th>BT</th><th>CT</th><th>TAT (CT &minus; AT)</th><th>WT (TAT &minus; BT)</th><th>RT (First Start &minus; AT)</th></tr>
      </thead>
      <tbody>
        <tr><td><strong>P1</strong></td><td>24 ms</td><td>30 ms</td><td>30 &minus; 0 = 30 ms</td><td>30 &minus; 24 = <strong>6 ms</strong></td><td>0 ms</td></tr>
        <tr><td><strong>P2</strong></td><td>3 ms</td><td>7 ms</td><td>7 &minus; 0 = 7 ms</td><td>7 &minus; 3 = <strong>4 ms</strong></td><td>4 ms</td></tr>
        <tr><td><strong>P3</strong></td><td>3 ms</td><td>10 ms</td><td>10 &minus; 0 = 10 ms</td><td>10 &minus; 3 = <strong>7 ms</strong></td><td>7 ms</td></tr>
      </tbody>
    </table>
    <p><strong>Ex 01 Averages:</strong> Avg TAT = 47 / 3 = <strong>15.67 ms</strong> (Slide truncates to <strong>15.6</strong>), Avg WT = 17 / 3 = <strong>5.67 ms</strong> (Slide truncates to <strong>5.6</strong>), <strong>Throughput = 0.10</strong>. Notice this worked trace explicitly draws each <code>q=4</code> turn of P1 individually (<code>10–14, 14–18, 18–22, 22–26, 26–30</code>) and puts every occurrence in the Ready Queue!</p>
    <p><strong>Ex 02 (Crucial Enqueue Ordering Trap — P1(AT=2, BT=24), P2(15, 6), P3(5, 3); q=4):</strong></p>
    <ul>
      <li><code>0–2</code>: CPU Idle. <code>2–6</code>: P1 runs first slice (20 left). Meanwhile at <strong><code>t = 5</code></strong>, <strong>P3 arrives first</strong> &rarr; P3 joins Ready Queue <em>ahead</em> of preempted P1 arriving back at <code>t = 6</code> (Queue: <code>P3, P1</code>)!</li>
      <li><code>6–9</code>: P3 runs 3 ms and finishes early (<code>CT = 9, TAT = 4, WT = 1</code>).</li>
      <li><code>9–17</code>: P1 runs two slices (<code>9–13</code> and <code>13–17</code>; 12 ms left). While P1 runs <code>13–17</code>, <strong>P2 arrives at <code>t = 15</code></strong>, entering the Ready Queue <em>before</em> P1 expires at <code>t = 17</code>!</li>
      <li><code>17–21</code>: P2 runs its first 4 ms slice (2 ms left) &rarr; re-queues behind P1 at <code>t = 21</code>. Remaining trace: <code>P1(21–25) | P2(25–27, CT=27) | P1(27–31) | P1(31–35, CT=35)</code>!</li>
      <li><strong>Ex 02 Results:</strong> Slide Ready Queue trace = <code>[P1, P3, P1, P2, P1, P2, P1...]</code> (dispatch sequence), <strong>CTs = (35, 27, 9)</strong>, <strong>Avg TAT = (33+12+4)/3 = 16.3</strong>, <strong>Avg WT = (9+6+1)/3 = 5.3</strong>, <strong>Throughput = 3 / (35 &minus; 2) = 0.09</strong>!</li>
    </ul>
  </div>

  <h3>4. Multilevel Queue (MLQ) vs. Multilevel Feedback Queue (MLFQ)</h3>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>Multilevel Queue (MLQ — §5.3.5)</h4>
      <p>Ready queue is <strong>statically partitioned</strong> into distinct priority queues (e.g., Real-time &gt; System &gt; Interactive &gt; Batch). Each queue runs its own algorithm (e.g., RR for Interactive, FCFS for Batch). Between queues: fixed-priority preemptive scheduling or time slicing (e.g., 80% foreground / 20% background).<br><em>Flaw:</em> Processes are <strong>locked permanently</strong> in their assigned queue &rarr; low-priority queues can starve.</p>
    </div>
    <div class="compare-card">
      <h4>Multilevel Feedback Queue (MLFQ — §5.3.6)</h4>
      <p>Processes <strong>dynamically migrate between queues</strong> based on runtime behavior!<br>&bull; Uses too much CPU time (hits full quantum) &rarr; <strong>Demoted</strong> to a lower-priority queue.<br>&bull; Waits too long in a low queue &rarr; <strong>Promoted (Aging)</strong> upward to prevent starvation.<br><em>Genius Effect:</em> Interactive &amp; I/O-bound tasks stay near the top with tiny latency while long CPU hogs sink naturally.</p>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Memorize All MLFQ Parameters (Silberschatz §5.3.6 vs. Slide 08)</div>
    <ol>
      <li>The <strong>number of queues</strong> (e.g., Q<sub>0</sub>, Q<sub>1</sub>, Q<sub>2</sub>).</li>
      <li>The <strong>scheduling algorithm for each queue</strong> (e.g., Q<sub>0</sub>: RR q=8; Q<sub>1</sub>: RR q=16; Q<sub>2</sub>: FCFS).</li>
      <li>The rule determining when to <strong>upgrade (promote)</strong> a process to a higher-priority queue.</li>
      <li>The rule determining when to <strong>demote</strong> a process to a lower-priority queue <em>(explicitly listed as #4 in Silberschatz §5.3.6; baked into per-queue quantum expiry on Slide 08)</em>.</li>
      <li>The rule determining <strong>which queue a process enters</strong> initially when it needs service.</li>
    </ol>
    <p><em>Slide 08 Crucial Exam Rule (P106):</em> Except the last queue, every queue has its own time quantum; <strong>the last (lowest-priority) queue ALWAYS uses FCFS!</strong></p>
  </div>

  <h3>5. Multi-Processor Scheduling, Affinity &amp; Load Balancing (§5.5 — <em>[Textbook Beyond Slide 08]</em>)</h3>
  <ul>
    <li><strong>Processor Affinity:</strong> Running a thread on the same core keeps its cache ("warm cache") valid. <strong>Soft affinity:</strong> OS attempts to keep the process on the same core, no guarantee. <strong>Hard affinity:</strong> OS allows explicit syscall pinning (<code>sched_setaffinity()</code> on Linux) to specific core IDs. Coupled with <strong>NUMA</strong>, scheduler tries to allocate memory on the local socket.</li>
    <li><strong>Load Balancing:</strong> Keeps workload distributed across SMP cores (only needed when each core keeps a private ready queue): <strong>Push migration</strong> uses a periodic kernel task to move excess processes from busy to idle cores; <strong>Pull migration</strong> lets an idle core steal a waiting task from an overloaded neighbor. Note: load balancing directly opposes cache affinity!</li>
  </ul>
</div>
""",
    },
}
