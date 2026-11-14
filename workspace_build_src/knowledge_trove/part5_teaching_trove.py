# -*- coding: utf-8 -*-
"""
Part 5 Knowledge Trove:
- KEYWORDS_LEXICON: 4-color semantic keyword highlights (hw, hazard, sync, struct)
- TEACHING_TROVE_DATA: Across all 21 decks (deck_02..deck_22):
    * 2 interactive Spot-the-Mistake challenges per deck (42 total)
    * 1 Toggleable Inline Sabotage sentence per deck (21 total)
    * 2 Socratic Pause & Predict intuition prompts per deck (42 total)
"""

KEYWORDS_LEXICON = [
    # Hardware, Traps & Memory Bus (.kw-hw - Cyan)
    ("Translation Lookaside Buffer", "kw-hw"),
    ("Memory Management Unit", "kw-hw"),
    ("Interrupt Vector Table", "kw-hw"),
    ("Direct Memory Access", "kw-hw"),
    ("Relocation Register", "kw-hw"),
    ("Memory-Mapped I/O", "kw-hw"),
    ("Interrupt Vector", "kw-hw"),
    ("Bootstrap Program", "kw-hw"),
    ("Timer Interrupt", "kw-hw"),
    ("Page-Fault Trap", "kw-hw"),
    ("Limit Register", "kw-hw"),
    ("Base Register", "kw-hw"),
    ("Cycle Stealing", "kw-hw"),
    ("Cycle-Stealing", "kw-hw"),
    ("Kernel Mode", "kw-hw"),
    ("User Mode", "kw-hw"),
    ("Mode Bit", "kw-hw"),
    ("Polling", "kw-hw"),
    ("MMU", "kw-hw"),
    ("TLB", "kw-hw"),
    ("DMA", "kw-hw"),
    ("IVT", "kw-hw"),
    ("ASID", "kw-hw"),
    ("Ring 0", "kw-hw"),
    ("Ring 3", "kw-hw"),

    # Hazards, Failures & Anomalies (.kw-hazard - Crimson)
    ("External Fragmentation", "kw-hazard"),
    ("Internal Fragmentation", "kw-hazard"),
    ("Indefinite Blocking", "kw-hazard"),
    ("Belady's Anomaly", "kw-hazard"),
    ("Priority Inversion", "kw-hazard"),
    ("Write Amplification", "kw-hazard"),
    ("Dangling Pointer", "kw-hazard"),
    ("Race Condition", "kw-hazard"),
    ("Convoy Effect", "kw-hazard"),
    ("Circular Wait", "kw-hazard"),
    ("Hold and Wait", "kw-hazard"),
    ("No Preemption", "kw-hazard"),
    ("Buffer Overflow", "kw-hazard"),
    ("Stack Overflow", "kw-hazard"),
    ("Zombie Process", "kw-hazard"),
    ("Orphan Process", "kw-hazard"),
    ("Unsafe State", "kw-hazard"),
    ("Page Fault", "kw-hazard"),
    ("Starvation", "kw-hazard"),
    ("Thrashing", "kw-hazard"),
    ("Deadlock", "kw-hazard"),
    ("Livelock", "kw-hazard"),

    # Synchronization, Protection & Algorithms (.kw-sync - Emerald)
    ("Shortest-Remaining-Time-First", "kw-sync"),
    ("Priority Inheritance Protocol", "kw-sync"),
    ("Priority Inheritance", "kw-sync"),
    ("Earliest-Deadline-First", "kw-sync"),
    ("Shortest-Job-First", "kw-sync"),
    ("Execution-Time Binding", "kw-sync"),
    ("Counting Semaphore", "kw-sync"),
    ("Peterson's Solution", "kw-sync"),
    ("Condition Variable", "kw-sync"),
    ("Banker's Algorithm", "kw-sync"),
    ("Binary Semaphore", "kw-sync"),
    ("Mutual Exclusion", "kw-sync"),
    ("Rate-Monotonic", "kw-sync"),
    ("Bounded Waiting", "kw-sync"),
    ("Memory Barriers", "kw-sync"),
    ("Memory Barrier", "kw-sync"),
    ("Copy-on-Write", "kw-sync"),
    ("Second-Chance", "kw-sync"),
    ("Least Privilege", "kw-sync"),
    ("Safe Sequence", "kw-sync"),
    ("CompareAndSwap", "kw-sync"),
    ("Wear Leveling", "kw-sync"),
    ("Round Robin", "kw-sync"),
    ("Mutex Lock", "kw-sync"),
    ("Safe State", "kw-sync"),
    ("TestAndSet", "kw-sync"),
    ("Journaling", "kw-sync"),
    ("Semaphore", "kw-sync"),
    ("Spinlock", "kw-sync"),
    ("Progress", "kw-sync"),
    ("Monitor", "kw-sync"),
    ("Mutex", "kw-sync"),
    ("Aging", "kw-sync"),
    ("SRTF", "kw-sync"),
    ("SJF", "kw-sync"),
    ("EDF", "kw-sync"),
    ("LRU", "kw-sync"),

    # Kernel Abstractions, Scheduling & Structures (.kw-struct - Amber)
    ("Flash Translation Layer", "kw-struct"),
    ("Resource-Allocation Graph", "kw-struct"),
    ("Process Control Block", "kw-struct"),
    ("Access Control List", "kw-struct"),
    ("File Allocation Table", "kw-struct"),
    ("Loadable Kernel Modules", "kw-struct"),
    ("Inverted Page Table", "kw-struct"),
    ("Exponential Averaging", "kw-struct"),
    ("Virtual File System", "kw-struct"),
    ("Hashed Page Table", "kw-struct"),
    ("Processor Affinity", "kw-struct"),
    ("File Control Block", "kw-struct"),
    ("Open-File Table", "kw-struct"),
    ("Multiprogramming", "kw-struct"),
    ("Monolithic Kernel", "kw-struct"),
    ("Message Passing", "kw-struct"),
    ("Capability Lists", "kw-struct"),
    ("Double Buffering", "kw-struct"),
    ("Capability List", "kw-struct"),
    ("Context Switch", "kw-struct"),
    ("Wait-For Graph", "kw-struct"),
    ("Access Matrix", "kw-struct"),
    ("Shared Memory", "kw-struct"),
    ("Multitasking", "kw-struct"),
    ("Time-Sharing", "kw-struct"),
    ("Time Quantum", "kw-struct"),
    ("Working-Set", "kw-struct"),
    ("Working Set", "kw-struct"),
    ("Ready Queue", "kw-struct"),
    ("Page Table", "kw-struct"),
    ("Microkernel", "kw-struct"),
    ("Dispatcher", "kw-struct"),
    ("Bit Vector", "kw-struct"),
    ("Spooling", "kw-struct"),
    ("Inode", "kw-struct"),
    ("MLFQ", "kw-struct"),
    ("MLQ", "kw-struct"),
    ("PCB", "kw-struct"),
    ("VFS", "kw-struct"),
    ("FAT", "kw-struct"),
    ("ACL", "kw-struct"),
    ("RAID", "kw-struct"),
    ("FTL", "kw-struct"),
    ("FCB", "kw-struct"),
]

TEACHING_TROVE_DATA = {
    "deck_02": {
        "inlineSabotage": {
            "find": "<strong>Asymmetric Multiprocessing (AMP):</strong> Boss-worker model; one master CPU schedules and assigns tasks to worker CPUs. Simpler kernel locking, poorer scaling.",
            "corrupt": "<strong>Asymmetric Multiprocessing (AMP):</strong> Peer-to-peer architecture where every processor runs an identical copy of the OS kernel and competes symmetrically on the shared ready queue without a master coordinator.",
            "why": "Wait—you described SMP (Symmetric Multiprocessing)! In AMP (Asymmetric), ONE master boss CPU controls/schedules all worker CPUs (§1.3)."
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Spot the Flawed Claim)",
                "prompt": "One of these four OS fundamentals statements was secretly altered with a textbook bug. Click the flawed statement:",
                "items": [
                    "1. Hardware invokes the Interrupt Service Routine (ISR) by indexing into the Interrupt Vector Table (IVT) stored in low memory.",
                    "2. Multiprogramming focuses on maximizing CPU utilization by switching whenever the active job waits for I/O.",
                    "3. During a system call trap, CPU hardware switches the Mode Bit from 0 (User Mode) to 1 (Kernel Mode) so the OS can read user buffers safely.",
                    "4. DMA transfers an entire block directly between a device controller buffer and RAM, firing only 1 interrupt per block."
                ],
                "bugIdx": 2,
                "fix": "Flipped Mode Bit values! User Mode = Mode Bit 1 (Ring 3) and Kernel Mode = Mode Bit 0 (Ring 0). A trap transitions Mode Bit 1 -> 0, NOT 0 -> 1!"
            },
            {
                "type": "Trace Bug (6-Step System Call Sequence)",
                "prompt": "Find the broken step in this student's Dual-Mode read() syscall trace:",
                "items": [
                    "Step A: User process runs normal instructions in User Mode (Mode Bit = 1).",
                    "Step B: Program triggers trap opcode (SYSCALL) to execute read().",
                    "Step C: User program manually sets Mode Bit = 0 in C before indexing the IVT so it runs fast.",
                    "Step D: Kernel executes service routine in Ring 0, places result, and executes return-from-trap (Mode Bit 0 -> 1)."
                ],
                "bugIdx": 2,
                "fix": "Privileged Mode-Bit switching CANNOT be done by user code! Hardware sets Mode Bit -> 0 automatically only as part of the trap instruction itself (§1.4.2)."
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why can't we use Interrupts alone to kill an accidental user-space `while(1);` infinite loop without a Hardware Timer?", "a": "If the user program computes endlessly without requesting I/O or syscalls, no disk/trap interrupt ever arrives from it! Only a programmable hardware Timer counting down clock ticks guarantees periodic Kernel reentry (§1.4.3)."},
            {"q": "Compare Microkernel vs. Loadable Kernel Modules (LKMs): Why does Linux load drivers via LKMs instead of pure user-space microkernel servers?", "a": "Pure microkernels pay repeated user <-> kernel IPC message-passing context switches on every syscall/driver call. LKMs preserve modular dynamic loading while calling directly across Ring 0 pointers at monolithic speed (§2.8.4)."}
        ]
    },
    "deck_03": {
        "inlineSabotage": {
            "find": "<strong>One-to-One (Linux, Windows):</strong> Each user thread &rarr; 1 kernel thread. True multi-core parallelism + non-blocking on syscall, slight creation overhead.",
            "corrupt": "<strong>One-to-One (Linux, Windows):</strong> Multiplexes all user threads onto 1 kernel thread, so a single blocking system call blocks the entire process with zero multi-core parallelism.",
            "why": "That is the flaw of the Many-to-One model! One-to-One maps each user thread to its own kernel thread, giving true multi-core parallelism and non-blocking syscalls (§4.3)."
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Process Lifecycle)",
                "prompt": "Click the subtly false statement about Processes, fork(), and IPC:",
                "items": [
                    "1. Only one process per CPU core can be in the Running state at any given instant.",
                    "2. A waiting process transitions directly from the Waiting state back to the Running state as soon as I/O finishes.",
                    "3. Shared Memory requires kernel assistance primarily to establish the shared mapping; reads and writes run at RAM speed.",
                    "4. An Orphan process whose parent exits early is adopted and reaped by PID 1 (init/systemd)."
                ],
                "bugIdx": 1,
                "fix": "A process NEVER jumps from Waiting -> Running directly! Upon I/O completion it enters the Ready state and waits for the CPU scheduler (§3.1.2)."
            },
            {
                "type": "Code Trace Bug (C fork() & Zombie Check)",
                "prompt": "Spot the buggy expectation in this C fork()/wait() snippet:",
                "items": [
                    "Line 1: pid_t pid = fork();",
                    "Line 2: if (pid == 0) { /* Child spawns here; fork() returned positive PID to parent */ }",
                    "Line 3: if (pid > 0) { /* Parent spawns here; if parent skips wait() forever after child calls exit(), child becomes an Orphan! */ }",
                    "Line 4: else if (pid < 0) { fprintf(stderr, \"Fork failed\"); }"
                ],
                "bugIdx": 2,
                "fix": "If the parent is ALIVE and fails to call wait(), the terminated child is a ZOMBIE (not an Orphan!). An Orphan occurs when the parent dies first while the child keeps running (§3.3.2)."
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Executing 3 unconditional `fork(); fork(); fork();` calls produces 8 total processes. What if we run `for (int i = 0; i < 3; i++) if (fork() == 0) break;`?", "a": "Only the ORIGINAL parent continues looping! Each of the 3 iterations spawns 1 leaf child that immediately hits `break;` -> total = 1 parent + 3 children = 4 processes (not 8!)."},
            {"q": "Why does Amdahl's Law punish adding 64 cores when 20% of a workload is strictly sequential?", "a": "At S = 0.20, Speedup <= 1 / (0.20 + 0.80/64) = 4.7x (and never > 5x even with infinity cores!). Optimizing serial bottlenecks beats throwing cores at code."}
        ]
    },
    "deck_04": {
        "inlineSabotage": {
            "find": "<strong>Turnaround Time (TAT — MINIMIZE):</strong> Total interval from submission (Arrival) to completion, summing ready-queue wait, CPU bursts, and I/O waits.",
            "corrupt": "<strong>Turnaround Time (TAT — MINIMIZE):</strong> Only the cumulative time spent actively executing instructions on the CPU core minus waiting intervals (TAT = CT &minus; WT).",
            "why": "Turnaround Time measures EVERYTHING from arrival to completion (TAT = CT - AT), INCLUDING ready-queue wait time and I/O wait time! (§5.2)."
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Scheduling Fundamentals)",
                "prompt": "Identify the subtly wrong claim about CPU scheduling criteria and circumstances:",
                "items": [
                    "1. Scheduling transitions (1) Running -> Waiting and (4) Running -> Terminated must be handled non-preemptively.",
                    "2. Dispatch Latency is the time taken by the dispatcher to stop one process and start another running.",
                    "3. Waiting Time and Response Time are guaranteed to remain strictly equal for every preemptive Round-Robin schedule.",
                    "4. In FCFS, putting a 24ms CPU-bound job before short 3ms jobs causes the Convoy Effect."
                ],
                "bugIdx": 2,
                "fix": "WT == RT ONLY when a job gets one uninterrupted CPU burst (non-preemptive). Under preemption (RR, SRTF, Preemptive Priority), a job resumes waiting later, making WT >= RT!"
            },
            {
                "type": "Numerical Trace Bug (FCFS Table)",
                "prompt": "Given P1(AT=0, BT=8), P2(AT=1, BT=4), P3(AT=2, BT=2) under non-preemptive FCFS, spot the miscalculated line:",
                "items": [
                    "Line 1: Gantt executes sequentially P1 (0-8), P2 (8-12), P3 (12-14).",
                    "Line 2: P1 TAT = 8 - 0 = 8 ms, WT = 8 - 8 = 0 ms.",
                    "Line 3: P2 CT = 12 ms, TAT = 12 - 1 = 11 ms, WT = 11 - 4 = 7 ms.",
                    "Line 4: P3 CT = 14 ms, TAT = 14 - 0 = 14 ms, WT = 14 - 2 = 12 ms."
                ],
                "bugIdx": 3,
                "fix": "P3 arrived at AT = 2 (NOT 0)! Always subtract Arrival Time: TAT(P3) = 14 - 2 = 12 ms, WT(P3) = 12 - 2 = 10 ms!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why does the Convoy Effect hurt DISK / I/O device utilization even though the CPU stays 100% busy?", "a": "While the 1 big CPU hog dominates the core, all I/O-bound jobs queue behind it leaving the disk idle; then when it finally blocks on I/O, short jobs rush through CPU in microseconds and all wait together on disk, leaving CPU idle! (§5.3.1)"},
            {"q": "Under Little's Formula (n = lambda * W), what happens to Ready Queue length if you double arrival rate lambda without speeding up service?", "a": "Wait time W explodes non-linearly once utilization reaches saturation, causing queue length n = lambda * W to grow dramatically!"}
        ]
    },
    "deck_05": {
        "inlineSabotage": {
            "find": "<strong>If &alpha; = 0:</strong> &tau;<sub>n+1</sub> = &tau;<sub>n</sub>. Recent actual history is <strong>completely ignored</strong>; initial estimate &tau;<sub>0</sub> rules forever (assumes unchanging process behavior).",
            "corrupt": "<strong>If &alpha; = 0:</strong> &tau;<sub>n+1</sub> = t<sub>n</sub>. Past history is <strong>completely ignored</strong>; only the latest actual measured burst t<sub>n</sub> predicts the next turn.",
            "why": "You swapped alpha=0 and alpha=1! Setting alpha=0 zeros out t_n so prediction stays frozen at initial tau_0; alpha=1 gives tau_{n+1} = t_n (§5.3.2)."
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (SJF & Prediction)",
                "prompt": "Click the single false claim about SJF scheduling:",
                "items": [
                    "1. SJF is provably optimal in minimizing Average Waiting Time among non-preemptive scheduling algorithms.",
                    "2. When two ready processes tie on exact next CPU burst length, SJF breaks the tie using Priority Aging.",
                    "3. In exponential averaging with alpha = 0.5, weight falls geometrically as (1 - alpha)^k on older bursts.",
                    "4. Long CPU-bound processes can suffer Starvation if short jobs arrive continuously."
                ],
                "bugIdx": 1,
                "fix": "Standard SJF tie-breaking ALWAYS uses FCFS (earlier Arrival Time goes first), not Aging! (§5.3.2)"
            },
            {
                "type": "Numerical Calculation Bug (tau_0=10, alpha=0.5, bursts 6, 4)",
                "prompt": "Find the arithmetic mistake in this Exponential Averaging trace (alpha=0.5, tau_0=10 ms, actual bursts t_0=6, t_1=4):",
                "items": [
                    "Step 1: Formula is tau_{n+1} = alpha * t_n + (1 - alpha) * tau_n.",
                    "Step 2: Using tau_0 = 10 and t_0 = 6 -> tau_1 = 0.5(6) + 0.5(10) = 3 + 5 = 8 ms.",
                    "Step 3: Next step with t_1 = 4 -> tau_2 = 0.5(4) + 0.5(10) = 2 + 5 = 7 ms.",
                    "Step 4: Weight sum alpha + (1 - alpha) always equals 1.0."
                ],
                "bugIdx": 2,
                "fix": "Step 3 reused tau_0 (10 ms) instead of tau_1 (8 ms)! Correct math: tau_2 = 0.5(4) + 0.5(8) = 2 + 4 = 6 ms!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: If a batch job alternates strictly between 10ms and 10ms CPU bursts forever, what happens to tau_n over time when alpha = 0.5 and tau_0 = 100ms?", "a": "Difference shrinks by half each burst (100 -> 55 -> 32.5 -> 21.25 -> ...), converging exponentially toward the true mean 10ms!"},
            {"q": "Why doesn't the Exchange Argument prove FCFS optimal?", "a": "Because FCFS forbids moving a shorter job ahead of a longer earlier arrival—only SJF minimizes sum of waits across any permutation of ready jobs."}
        ]
    },
    "deck_06": {
        "inlineSabotage": {
            "find": "<strong>t = 1:</strong> P2 arrives (BT = 4). P1 has run 1 ms &rarr; Remaining(P1) = 8 &minus; 1 = <strong>7 ms</strong>. Since <code>4 &lt; 7</code>, <strong>P1 is preempted!</strong> P2 starts.",
            "corrupt": "<strong>t = 1:</strong> P2 arrives (BT = 4). P1 has run 1 ms &rarr; Remaining(P1) = 7 ms. Since P1 already holds the CPU core, <strong>P1 continues to completion</strong> because SRTF checks remaining time only on completion.",
            "why": "Check the core SRTF rule! Preemptive SJF checks IMMEDIATELY upon each new process arrival—if Burst(P2)=4 < Remaining(P1)=7, P1 IS preempted at t = 1 (§5.3.2)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (SRTF Rules)",
                "prompt": "Spot the sneaky flaw in these SRTF scheduling statements:",
                "items": [
                    "1. SRTF checks for preemption whenever a new process enters the ready queue.",
                    "2. If a newly arrived job has Burst == Remaining Burst of the running job, SRTF immediately preempts the running job to improve Response Time.",
                    "3. SRTF delivers lower or equal Average Waiting Time compared to Non-Preemptive SJF on dynamic arrivals.",
                    "4. For a preempted process, Waiting Time usually exceeds Response Time."
                ],
                "bugIdx": 1,
                "fix": "Preemption triggers ONLY on STRICT less-than (`Burst < Remaining`)! On exact equality (`==`), keeping the running job avoids an unnecessary context switch (§5.3.2)."
            },
            {
                "type": "Gantt Trace Bug (P1=0,8; P2=1,4; P3=2,9; P4=3,5)",
                "prompt": "Find the broken decision point in this SRTF Gantt chart reconstruction:",
                "items": [
                    "t = 0-1: P1 runs (remaining drops 8 -> 7). At t=1, P2(4) < 7 -> P1 preempted!",
                    "t = 1-5: P2 runs to completion (P3=9 > P2rem=3 at t=2; P4=5 > P2rem=2 at t=3).",
                    "t = 5-12: At t=5 ready queue holds P1(rem=7), P3(9), P4(5). Scheduler resumes P1(7) because P1 arrived first at t = 0!",
                    "t = 17-26: Last remaining job P3 runs cleanly to completion CT = 26."
                ],
                "bugIdx": 2,
                "fix": "At t = 5, SRTF ALWAYS picks the shortest remaining time: P4 (5 ms) beats P1 (7 ms)! Arrival time breaks ties ONLY on identical bursts. So P4 runs t = 5-10 first!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Can Non-Preemptive SJF EVER achieve strictly LOWER Average Waiting Time than SRTF on any process arrival dataset?", "a": "NO! Preemptive SRTF can replicate every non-preemptive schedule when keeping a job is best, AND strictly improve on it whenever interrupting a long job lets short arrivals sprint ahead."},
            {"q": "How would real-world context-switch overhead (say CS = 1 ms per switch) impact whether SRTF beats SJF?", "a": "If tiny new arrivals constantly preempt processes just 0.5ms shorter, context-switch overhead eats CPU cycles and could make non-preemptive SJF faster in total wall-clock time!"}
        ]
    },
    "deck_07": {
        "inlineSabotage": {
            "find": "<strong>Preemptive Priority:</strong> Immediately preempts the running process if a newly arriving process has strictly higher priority (smaller priority integer). Equal priorities do <em>not</em> preempt.",
            "corrupt": "<strong>Preemptive Priority:</strong> Immediately preempts the running process if a newly arriving process has a larger priority integer, AND breaks equal priorities by preempting via LIFO stack.",
            "why": "Double bug! Under standard Silberschatz priority rules, SMALLER integer = HIGHER priority, and equal priorities do NOT preempt an actively running process (§5.3.4)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Priority & Aging)",
                "prompt": "Identify the erroneous textbook claim about Priority Scheduling & Aging:",
                "items": [
                    "1. SJF is a special case of Priority Scheduling where priority equals the inverse of predicted next CPU burst.",
                    "2. Starvation means a ready process waits indefinitely behind a continuous stream of higher-priority jobs.",
                    "3. Aging lowers a waiting process's priority linearly over time so it eventually yields to younger arriving jobs.",
                    "4. Combined Priority + Round Robin lets multiple processes at the identical top priority share the CPU fairly."
                ],
                "bugIdx": 2,
                "fix": "Aging RAISES (increases) a waiting process's priority (by decreasing its integer priority value toward 0) so old starved jobs eventually execute! (§5.3.4)"
            },
            {
                "type": "Mock Midterm Q6 Table Bug",
                "prompt": "Check this student's table for Mock Midterm Q6 [Gantt: P1(0-1)|P2(1-3)|P3(3-5)|P2(5-7)|P5(7-10)|P1(10-15)|P4(15-19)]. Spot the wrong row:",
                "items": [
                    "P1 (AT=0, BT=6): CT = 15, TAT = 15 ms, WT = 9 ms.",
                    "P2 (AT=1, BT=4): CT = 5, TAT = 4 ms, WT = 0 ms.",
                    "P3 (AT=3, BT=2): CT = 5, TAT = 2 ms, WT = 0 ms.",
                    "P5 (AT=6, BT=3): CT = 10, TAT = 4 ms, WT = 1 ms."
                ],
                "bugIdx": 1,
                "fix": "P2 was preempted at t=3 by P3 and resumed 5-7, so P2's Completion Time is CT = 7 (NOT 5)! Thus TAT(P2) = 7 - 1 = 6 ms and WT(P2) = 6 - 4 = 2 ms!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: If we run Rate-Monotonic (RMS) vs. EDF on two periodic tasks needing 90% total CPU utilization, which scheduler might miss deadlines?", "a": "RMS hits its theoretical utilization bound (~69-83% for 2 tasks) and can fail at 90% utilization, whereas dynamic EDF achieves up to 100% schedulable utilization cleanly! (§5.6)"},
            {"q": "What is an example of an INTERNAL vs. EXTERNAL priority metric in an OS?", "a": "Internal metrics use measurable OS quantities (time limits, memory, open files, ratio of avg I/O burst to avg CPU burst). External criteria come from outside the OS (user importance, funds paid, department politics)."}
        ]
    },
    "deck_08": {
        "inlineSabotage": {
            "find": "The Ready Queue operates as a circular FIFO queue; newly arriving processes join its tail.",
            "corrupt": "The Ready Queue operates as a LIFO priority stack; newly arriving processes jump directly to the front head ahead of interrupted jobs.",
            "why": "Round Robin treats the Ready Queue strictly as a circular FIFO queue—new arrivals and quantum-expired processes enter at the TAIL (§5.3.3)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Round Robin & MLFQ)",
                "prompt": "Find the misleading statement about time-sharing and multi-level queues:",
                "items": [
                    "1. As time quantum q -> infinity, Round Robin degenerates into pure FCFS scheduling.",
                    "2. Increasing Round Robin quantum q is mathematically guaranteed to always decrease Average Turnaround Time.",
                    "3. Multilevel Queue (MLQ) partitions queues permanently so processes cannot move across priority bands.",
                    "4. In SMP systems, Load Balancing can weaken cache benefits gained from Processor Affinity."
                ],
                "bugIdx": 1,
                "fix": "Famous Silberschatz Fig. 5.6 exam trap! Increasing q does NOT monotonically lower Average Turnaround Time—it varies erratically depending on where bursts cross multiples of q (§5.3.3)."
            },
            {
                "type": "Trace Bug (RR q=4 on P1=24, P2=3, P3=3, AT=0)",
                "prompt": "Catch the faulty step in this Round Robin (q = 4 ms) trace:",
                "items": [
                    "t = 0-4: P1 uses 1 quantum (20ms left), gets preempted to queue tail behind P2 and P3.",
                    "t = 4-7: P2 runs only 3ms and finishes (CT=7, WT=4ms); scheduler dispatches P3 immediately.",
                    "t = 7-8: Scheduler idles 1ms waiting for P2's leftover 1ms quantum to finish before starting P3.",
                    "t = 7-10: P3 finishes at CT=10 (WT=7ms), then P1 runs 10-30 (WT=6ms), Avg WT = 5.67ms."
                ],
                "bugIdx": 2,
                "fix": "Never burn unused quantum time! When P2 blocks or finishes early (< q), it releases the CPU voluntarily and the scheduler IMMEDIATELY dispatches P3 at t = 7!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why does MLFQ place a brand-new arriving interactive editor at TOP priority Queue 0 (shortest quantum, say q=8ms) instead of Queue 2?", "a": "Most interactive jobs have short CPU bursts (<8ms) before waiting on typing/I/O, so they finish fast and yield without being demoted; only heavy CPU hogs exceed q=8ms and sink automatically to Queue 1/2! (§5.3.6)"},
            {"q": "When is Pull Migration load balancing better/different from Push Migration?", "a": "Push periodically rebalances proactively from busy -> idle cores; Pull reacts immediately the instant a core goes idle by stealing from a busy neighbor—Linux runs both! (§5.5.3)"}
        ]
    },
    "deck_09": {
        "inlineSabotage": {
            "find": "Wait—isn't <code>count++</code> a single statement in C? <strong>Not to the CPU!</strong> A load-store architecture compiles <code>count++</code> and <code>count--</code> into 3 separate machine instructions each:",
            "corrupt": "Because <code>count++</code> and <code>count--</code> are single-line C statements, standard load-store CPUs execute each in <strong>1 indivisible atomic instruction</strong>, guaranteeing <code>count == 5</code> unless DMA interferes:",
            "why": "Wait—load-store CPUs compile `count++` into THREE separate steps (LOAD, ADD, STORE)! Context switching mid-sequence produces the classic race condition yielding 4, 5, or 6 (§6.1)."
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Bounded Buffer & Races)",
                "prompt": "Spot the subtly broken rule in this synchronization background check:",
                "items": [
                    "1. Simultaneous fork() calls in an unsynchronized kernel can accidentally assign duplicate PIDs via next_available_pid races.",
                    "2. Interleaving register-based count++ and count-- starting from 5 can yield final memory count = 4, 5, or 6.",
                    "3. A circular Bounded Buffer of array size 10 (with empty check in==out) can store all 10 items simultaneously.",
                    "4. For an Unbounded Buffer, delete the producer's buffer-full wait loop and drop `% BUFFER_SIZE`."
                ],
                "bugIdx": 2,
                "fix": "The classic circular buffer without an extra `count` variable leaves 1 slot empty (max BUFFER_SIZE - 1 = 9 items)! Otherwise `in == out` cannot distinguish Full from Empty (§3.5.1 / §6.1)."
            },
            {
                "type": "Code Sabotage (Bounded Buffer Consumer)",
                "prompt": "Find the buggy line in this Circular Consumer implementation:",
                "items": [
                    "Line 1: while (in == out) ; /* wait if empty */",
                    "Line 2: next_consumed = buffer[out];",
                    "Line 3: out = (in + 1) % BUFFER_SIZE;",
                    "Line 4: /* consume item in next_consumed */"
                ],
                "bugIdx": 2,
                "fix": "Line 3 updated `out` using `in + 1` instead of `out = (out + 1) % BUFFER_SIZE;`! That corrupts the consumer pointer completely!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why can a single-core NON-preemptive kernel usually skip mutexes around `next_available_pid` while a Preemptive kernel CANNOT?", "a": "In a non-preemptive kernel on 1 core, once thread A enters kernel mode for fork(), no timer preemption can switch to thread B until A exits kernel mode or blocks. A preemptive kernel (or ANY SMP multicore) can interrupt/run A & B inside kernel mode concurrently! (§6.2)"},
            {"q": "If Producer runs count++ 3 times and Consumer runs count-- 2 times starting at 5 without locks, can count ever drop to 2?", "a": "NO! Even under worst-case overwrite interleaving, Consumer's slowest register value started >= (final stores by Consumer) — minimal outcome occurs if Producer loads 5 early and overwrites late (or Consumer subtracts from initial 5: at lowest, Consumer stores 3 after decrements). Wait: actually tracing step-by-step matters—Producer could overwrite Consumer OR Consumer overwrites Producer's increases down to 5 - 2 = 3! (Lower than 3 is impossible because only 2 decrements exist starting from min 5!)."}
        ]
    },
    "deck_10": {
        "inlineSabotage": {
            "find": "<em>Flaw:</em> Naive loop guarantees Mutual Exclusion &amp; Progress, <strong>NOT Bounded Waiting</strong> (one lucky core can keep grabbing <code>lock</code>!). Adding a circular <code>waiting[n]</code> scan grants Bounded Waiting.",
            "corrupt": "<em>Advantage:</em> The 3-line <code>while (TestAndSet(&amp;lock));</code> loop automatically satisfies Mutual Exclusion, Progress, AND Bounded Waiting with zero extra boolean arrays.",
            "why": "Careful! Simple `while (TestAndSet(&lock));` guarantees Mutual Exclusion and Progress, NOT Bounded Waiting—one thread could starve indefinitely unless an explicit `waiting[n]` handoff array is added (§6.4.2)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Critical Section Solutions)",
                "prompt": "Spot the single false claim among these Critical-Section rules:",
                "items": [
                    "1. Mutual Exclusion guarantees no two processes execute inside their critical sections simultaneously.",
                    "2. The Progress criterion forbids processes sitting inside their Remainder Section from blocking others wanting to enter.",
                    "3. Peterson's Solution needs no Memory Barriers on modern multicore CPUs because flag[] and turn access different bytes.",
                    "4. Spinlocks outperform blocking mutexes on multi-core CPUs when lock-hold duration is shorter than two context switches."
                ],
                "bugIdx": 2,
                "fix": "Modern CPUs CAN reorder independent instructions (`turn = j` before `flag[i] = true`), breaking Peterson's solution unless explicit Memory Barriers (fences) enforce store order! (§6.3–§6.4)"
            },
            {
                "type": "Code Trace Bug (Swapped Peterson Entry Section)",
                "prompt": "Find the catastrophic bug in this modified Peterson's Entry Section for Process Pi:",
                "items": [
                    "Line 1: turn = j;                  // Give turn to peer first",
                    "Line 2: flag[i] = true;            // Declare intent second",
                    "Line 3: while (flag[j] && turn == j) ;",
                    "Line 4: /* critical section */  ...  flag[i] = false;"
                ],
                "bugIdx": 0,
                "fix": "SWAPPED LINES 1 & 2 breaks Mutual Exclusion completely! Trace: P0 sets turn=1 -> switch -> P1 sets turn=0, flag[1]=true -> sees flag[0]==false -> ENTERS CS! Then P0 wakes, sets flag[0]=true -> sees turn==0 -> ALSO ENTERS CS! Must ALWAYS set `flag[i] = true` BEFORE `turn = j`!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why is running a Spinlock on a SINGLE-CORE CPU disastrous during a critical section lock contention?", "a": "If Thread A holds the lock and gets preempted, Thread B spins in `while (TestAndSet(&lock))` burning 100% of its entire time quantum doing nothing, directly preventing Thread A from running to call `release()`! (§6.5)"},
            {"q": "In Peterson's proof of Bounded Waiting, what is the MAXIMUM number of times P1 can enter its CS after P0 sets `flag[0] = true`?", "a": "At most ONCE! As soon as P1 exits and tries to re-enter immediately, P1 sets `turn = 0` after P0 already set `turn = 1`, forcing P1 to spin until P0 enters and exits! (§6.3)"}
        ]
    },
    "deck_11": {
        "inlineSabotage": {
            "find": "<strong>Binary Semaphore:</strong> Value ranges only over <code>{0, 1}</code>—equivalent in function to a mutex lock.",
            "corrupt": "<strong>Binary Semaphore:</strong> Value drops into negative numbers (down to <code>&minus;N</code>) whenever multiple processes enter simultaneously inside the same lock.",
            "why": "Wait! A Binary Semaphore strictly stays in `{0, 1}`! Only the non-busy-waiting Counting Semaphore implementation allows signed `S->value < 0` to count blocked sleeping threads (§6.6)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Semaphores & Monitors)",
                "prompt": "Spot the subtly broken textbook claim about Semaphores and Monitors:",
                "items": [
                    "1. In a non-busy-waiting semaphore with S->value = -4, there are 4 threads currently sleeping in S->list.",
                    "2. Inside a Monitor, only one process can be active at any instant.",
                    "3. A Monitor condition variable `x.signal()` increments an internal integer counter if no thread is currently waiting on x.",
                    "4. Under Signal-and-Continue semantics (sometimes called Mesa-style monitors), callers should wrap `x.wait()` inside a `while (!cond)` loop."
                ],
                "bugIdx": 2,
                "fix": "Unlike Semaphores, Monitor Condition Variables have NO memory! If no thread is sleeping on `x`, `x.signal()` is a complete no-op and the signal vanishes! (§6.7.1 / §6.7.3)"
            },
            {
                "type": "Code Trace Bug (Producer Deadlock Trap)",
                "prompt": "Spot the exact line causing guaranteed Deadlock in this Bounded-Buffer Producer (empty=N, full=0, mutex=1):",
                "items": [
                    "Line 1: /* produce item next_produced */",
                    "Line 2: wait(mutex);   // Acquire buffer lock first",
                    "Line 3: wait(empty);   // Wait for empty slot second",
                    "Line 4: buffer[in] = next_produced; in = (in+1)%N; signal(mutex); signal(full);"
                ],
                "bugIdx": 1,
                "fix": "Calling `wait(mutex)` BEFORE `wait(empty)` deadlocks when the buffer fills (`empty == 0`)! Producer sleeps inside `wait(empty)` while STILL holding `mutex`, blocking Consumer forever from calling `wait(mutex)` to free a slot! (§7.1.1)"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: In `wait(S) { S->value--; if (S->value < 0) block(); }`, why doesn't checking `S->value < 0` itself cause a race condition?", "a": "wait() and signal() themselves MUST execute atomically inside the OS kernel (protected briefly by interrupt disabling on uniprocessors or internal spinlocks/CAS on SMP cores)! Busy wait moves from long critical sections to ultra-short 5-instruction increments (§6.6.2)."},
            {"q": "Why did NASA's Mars Pathfinder keep resetting on Mars due to a Priority Inversion bug?", "a": "A low-priority meteorological thread held a semaphore needed by the high-priority bus management thread while medium-priority communication tasks kept preempting the low-priority thread—resolved by enabling Priority Inheritance! (§6.8.2)"}
        ]
    },
    "deck_12": {
        "inlineSabotage": {
            "find": "A Writer requires <strong>strict exclusive access</strong>: no other Reader and no other Writer may be active while a Writer updates.",
            "corrupt": "A Writer locks out other Writers using <code>rw_mutex</code>, while concurrent Readers may keep inspecting the database safely alongside 1 active Writer.",
            "why": "NEVER! A Writer modifies shared data structures in place—no Readers AND no other Writers may enter concurrently while a Writer holds `rw_mutex` (§7.1.2)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Classic Sync Problems)",
                "prompt": "Find the faulty statement regarding Readers-Writers & Dining Philosophers:",
                "items": [
                    "1. In First Readers-Writers, only the 1st reader locks `rw_mutex` (`read_count == 1`) and only the last reader unlocks it (`read_count == 0`).",
                    "2. First Readers-Writers gives readers priority and can indefinitely starve waiting Writers.",
                    "3. Having odd philosophers grab Left chopstick first and even philosophers grab Right first breaks Circular Wait.",
                    "4. Initializing `chopstick[5] = {2, 2, 2, 2, 2}` solves Dining Philosophers deadlock cleanly without breaking safety."
                ],
                "bugIdx": 3,
                "fix": "Setting a binary chopstick semaphore to `2` allows TWO neighboring philosophers to eat using the EXACT SAME physical chopstick simultaneously—violating Mutual Exclusion! (§7.1.3)"
            },
            {
                "type": "Code Trace Bug (First Readers-Writers Reader Code)",
                "prompt": "Spot the subtle race condition injected into this Reader process:",
                "items": [
                    "Line 1: read_count++; if (read_count == 1) wait(rw_mutex);",
                    "Line 2: /* Perform parallel read on shared database */",
                    "Line 3: wait(mutex); read_count--;",
                    "Line 4: if (read_count == 0) signal(rw_mutex); signal(mutex);"
                ],
                "bugIdx": 0,
                "fix": "Line 1 forgot `wait(mutex)` before modifying shared `read_count++` (and `signal(mutex)` afterward)! Two concurrent readers arriving simultaneously can race on `read_count`, miss `read_count == 1`, or miscount back to 0! (§7.1.2)"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: In the Dining Philosophers Monitor (`test(i)` + `putdown(i)`), can deadlock-freedom fail if `putdown(i)` forgets to call `test((i+4)%5)` and `test((i+1)%5)`?", "a": "YES! Hungry neighbors paused on `self[k].wait()` will NEVER get woken up when you finish eating unless your `putdown(i)` explicitly tests both left and right neighbors and signals `self`! (§7.1.3)"},
            {"q": "Why does allowing at most 4 philosophers at a 5-chopstick table mathematically prevent deadlock?", "a": "By the Pigeonhole Principle: distributing 5 chopsticks across 4 hungry philosophers guarantees AT LEAST ONE philosopher gets 2 chopsticks, eats, and releases them!"}
        ]
    },
    "deck_13": {
        "inlineSabotage": {
            "find": "<strong>No Preemption:</strong> Resources cannot be forcibly taken away; a resource can only be released voluntarily by the thread holding it after completing its task.",
            "corrupt": "<strong>No Preemption:</strong> Hardware timer interrupts automatically strip mutex locks away from blocked threads every quantum and hand them to waiting peers.",
            "why": "Wrong! Timer preemption applies to CPU cycles, NOT non-preemptible mutex locks/files—deadlock requires NO Preemption (held resources release only voluntarily) (§8.3.1)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (RAG & Coffman Rules)",
                "prompt": "Spot the single invalid deduction about Resource-Allocation Graphs:",
                "items": [
                    "1. All four Coffman conditions must hold simultaneously for deadlock to happen.",
                    "2. Circular Wait strictly implies Hold and Wait is also satisfied.",
                    "3. Any cycle inside a Multi-Instance Resource-Allocation Graph proves the system is 100% deadlocked.",
                    "4. Imposing total ordering F(R) on locks prevents Circular Wait cleanly."
                ],
                "bugIdx": 2,
                "fix": "Classic exam trap! A cycle is Necessary & Sufficient ONLY when every resource has 1 instance. In Multi-Instance RAGs, a cycle means deadlock is ONLY POSSIBLE (an unblocked holder may finish & free an instance!) (§8.3.2)."
            },
            {
                "type": "Prevention Bug (Total Lock Ordering Failure)",
                "prompt": "Suppose bank transfer calls `void transfer(Account *from, Account *to)`. Spot why this Total Ordering code STILL deadlocks:",
                "items": [
                    "Step 1: Thread 1 calls transfer(Acct_A, Acct_B) -> locks `from` (Acct_A), then `to` (Acct_B).",
                    "Step 2: Thread 2 simultaneously calls transfer(Acct_B, Acct_A) -> locks `from` (Acct_B), then `to` (Acct_A).",
                    "Step 3: Both parameters come in fixed order (`from` then `to`), so total ordering F(R) guarantees deadlock safety!",
                    "Step 4: Fix requires sorting lock IDs dynamically: lock(min(from->id, to->id)) BEFORE lock(max(...))."
                ],
                "bugIdx": 2,
                "fix": "Parameter-name ordering (`from` then `to`) reverses global order when arguments swap! You MUST sort locks dynamically by canonical numeric ID (`min` -> `max`) (§8.5.4)."
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: If an OS enforces Total Ordering `F(R1) = 1 < F(R2) = 5` and a thread needs ONLY `R2` first, then later needs `R1`, what must it do?", "a": "To avoid breaking increasing order (`5 -> 1`), it must release `R2`, acquire `R1` first, then re-acquire `R2` in ascending ID order `1 -> 5`! (§8.5.4)"},
            {"q": "Why doesn't modern Linux/Windows run full global Deadlock Prevention on all syscalls?", "a": "Because deadlock prevention severely hurts device utilization and throughput (Ostrich Algorithm: programmers must order their own locks!)."}
        ]
    },
    "deck_14": {
        "inlineSabotage": {
            "find": "Instead of rigid global restrictions, Deadlock Avoidance asks every process to declare <em>a priori</em> the <strong>maximum number of instances of each resource type it may ever need</strong>. Before granting any request, the OS checks whether granting keeps the system in a <strong>Safe State</strong>.",
            "corrupt": "Deadlock Avoidance operates dynamically without any prior claims from processes—waiting until threads stall before detecting cycles via Current Request matrices.",
            "why": "Wait—that describes Deadlock Detection (§8.7)! Deadlock Avoidance (§8.6) REQUIRES every process to declare its future `Max` claim *a priori* so Banker's Algorithm can check Safe States!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Banker's & Safety)",
                "prompt": "Spot the subtly broken textbook claim about Deadlock Avoidance:",
                "items": [
                    "1. A Safe State is guaranteed to never experience a deadlock.",
                    "2. An Unsafe State guarantees an immediate deadlock will occur regardless of process behavior.",
                    "3. Banker's Need[i][j] equals Max[i][j] - Allocation[i][j].",
                    "4. In single-instance Avoidance, converting a Claim Edge -> Request Edge -> Assignment Edge must not form a cycle."
                ],
                "bugIdx": 1,
                "fix": "Huge Silberschatz Fig. 8.8 concept! Unsafe != Deadlock! An unsafe state only means the OS cannot PREVENT deadlock if threads happen to request their remaining Max claims; processes might release early and avoid it (§8.6.1)."
            },
            {
                "type": "Trace Bug (Banker's Resource-Request Test)",
                "prompt": "In Silberschatz's Banker trace (Available=(3,3,2), P1 Allocation=(2,0,0), Need=(1,2,2)), P0 asks for (0,2,0) AFTER P1 took (1,0,2) leaving Available=(2,3,0). Find the broken step:",
                "items": [
                    "Step 1: Verify Request(0,2,0) <= Need[P0](7,4,3) -> PASS.",
                    "Step 2: Verify Request(0,2,0) <= Available(2,3,0) -> PASS.",
                    "Step 3: Pretend grant: Available becomes (2,1,0). Notice Need[P1]=(0,2,0) cannot run; Need[P3]=(0,1,1) cannot run.",
                    "Step 4: Since Request <= Available passed in Step 2, grant P0's request immediately anyway!"
                ],
                "bugIdx": 3,
                "fix": "Step 3 proves Available=(2,1,0) puts the system into an UNSAFE STATE (zero processes can finish!). The Banker MUST reject and roll back Step 3 (`T_i` must wait!) (§8.6.3.3)."
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Can a valid snapshot in Banker's Algorithm possess MORE THAN ONE valid Safe Sequence (or only one unique sequence)?", "a": "Frequently MULTIPLE safe sequences! For Silberschatz's T0 snapshot, BOTH `<P1, P3, P4, P2, P0>` AND `<P1, P3, P4, P0, P2>` work cleanly—finding ANY valid full sequence proves the state Safe."},
            {"q": "Why is Banker's Algorithm rarely used inside desktop OS kernels like Linux or macOS?", "a": "Processes rarely know their lifetime Max demands upfront, thread counts dynamically change, and O(m * n^2) checks on every allocation create unnecessary latency (§8.6)."}
        ]
    },
    "deck_15": {
        "inlineSabotage": {
            "find": "We use <strong><code>Request[i][j]</code></strong> (current outstanding request, <em>not</em> future <code>Need</code>/<code>Max</code>, since avoidance isn't used!).",
            "corrupt": "We use <strong><code>Need[i][j] = Max[i][j] &minus; Allocation[i][j]</code></strong> because detection algorithms always require processes to declare lifetime maxima beforehand.",
            "why": "Detection does NOT know future `Max` claims! It strictly uses currently blocked `Request[i][j]` vectors alongside `Allocation` and `Available` (§8.7.2)."
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Detection & Recovery)",
                "prompt": "Find the erroneous statement regarding Deadlock Detection and Recovery:",
                "items": [
                    "1. A Wait-For Graph applies cleanly only when every resource type has exactly 1 instance.",
                    "2. In Multi-Instance Detection, threads holding zero resources (Allocation == 0) start with Finish[i] = true.",
                    "3. In Resource Preemption recovery, counting prior rollbacks in the victim's cost prevents Starvation.",
                    "4. Running O(m * n^2) detection only once per hour guarantees identifying the single exact thread that first triggered deadlock."
                ],
                "bugIdx": 3,
                "fix": "Silberschatz §8.7.3! When detection runs infrequently, many subsequent innocent processes may join the queue and mask which single process originally caused the jam!"
            },
            {
                "type": "Detection Trace Bug (Available = 0,0,0)",
                "prompt": "Given Available=(0,0,0), P0(Alloc=0,1,0; Req=0,0,0), P1(Alloc=2,0,0; Req=2,0,2), P2(Alloc=3,0,3; Req=0,0,1): spot the wrong step:",
                "items": [
                    "Step 1: Initialize Work = (0,0,0). Since all 3 have Alloc != 0, Finish = [F, F, F].",
                    "Step 2: P0 Request=(0,0,0) <= Work(0,0,0) -> P0 runs! Reclaim P0 Alloc -> Work = (0,1,0), Finish[0] = true.",
                    "Step 3: Check P2: Request=(0,0,1) <= Work(0,1,0)? Let's assume P2 finishes optimistically too and reclaim (3,0,3) -> Work = (3,1,3)!",
                    "Step 4: Correct trace halts with Finish = [T, F, F], flagging BOTH P1 and P2 deadlocked!"
                ],
                "bugIdx": 2,
                "fix": "Step 3 is illegal! P2's Request requires C=1 (`(0,0,1)`), while `Work=(0,1,0)` has C=0! You CANNOT skip `Request[i] <= Work`. Hence P1 and P2 genuinely deadlock (§8.7.2)!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why can a process with `Allocation = (2, 1, 1)` and `Request = (0, 0, 0)` safely donate `(2, 1, 1)` to `Work` in Detection?", "a": "Because Detection makes the optimistic assumption that any thread not currently requesting blocked resources (`Request == 0`) will run to completion without requesting more, releasing its held `Allocation` (§8.7.2)!"},
            {"q": "What happens if Process Termination recovery kills all deadlocked processes vs. 1 process at a time?", "a": "Killing all breaks deadlock in 1 O(1) sweep at huge wasted computation cost; killing 1 at a time saves uninvolved processes' work at the cost of re-running O(m*n^2) detection after every kill."}
        ]
    },
    "deck_16": {
        "inlineSabotage": {
            "find": "<strong>Limit Register:</strong> Specifies the size of the legal contiguous range. Valid physical addresses satisfy: <strong><code>Base &le; Address &lt; Base + Limit</code></strong>.",
            "corrupt": "<strong>Limit Register:</strong> Holds the highest absolute physical address directly, so hardware verifies simply <strong><code>Base &le; Address &le; Limit</code></strong>.",
            "why": "WAIT! The Limit Register stores partition SIZE (length), NOT the upper endpoint—and boundary check is strict `<` (`Base + Limit`), NOT `<= Limit`! (E.g. Base=300040, Limit=120900 -> valid up to 420939!) (§9.1.1)"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Contiguous Memory & Fit)",
                "prompt": "Spot the single false claim about Address Binding and Fragmentation:",
                "items": [
                    "1. Memory Compaction requires Execution-Time dynamic binding supported by an MMU Relocation Register.",
                    "2. Under Best-Fit allocation, choosing the smallest adequate hole tends to leave tiny unusable fragments (high external fragmentation).",
                    "3. Paging suffers high External Fragmentation because free frames are scattered across physical RAM.",
                    "4. The 50-Percent Rule states First-Fit loses roughly 0.5N blocks (~1/3 of RAM) to external fragmentation."
                ],
                "bugIdx": 2,
                "fix": "Non-contiguous Paging completely ELIMINATES External Fragmentation (any free frame fits any page!). External fragmentation plagues Contiguous variable-partition schemes (§9.2–§9.3)."
            },
            {
                "type": "Hole Allocation Trace Bug (First-Fit vs Best-Fit)",
                "prompt": "Holes: 100K, 500K, 200K, 300K, 600K. Requests: P1=212K, P2=417K, P3=112K, P4=426K. Catch the wrong First-Fit step:",
                "items": [
                    "Step 1 (First-Fit): P1 (212K) enters first hole >= 212K -> 500K hole (leaving 288K free).",
                    "Step 2 (First-Fit): P2 (417K) skips 100K, 288K, 200K, 300K -> enters 600K hole (leaving 183K free).",
                    "Step 3 (First-Fit): P3 (112K) enters the 288K leftover hole (leaving 176K free).",
                    "Step 4 (First-Fit): P4 (426K) enters the merged 176K + 200K + 183K holes automatically!"
                ],
                "bugIdx": 3,
                "fix": "Contiguous holes CANNOT be merged unless adjacent holes happen to touch or Compaction runs! None of {100K, 176K, 200K, 300K, 183K} fits 426K, so P4 MUST WAIT under First-Fit! (§9.2)"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why can Dynamic Loading reduce a process's memory usage WITHOUT any OS kernel support, whereas Dynamic Linking needs OS help?", "a": "Dynamic Loading uses ordinary user-level loader library routines inside a single process; Dynamic Linking shares ONE physical copy of library pages safely across multiple processes' protected virtual spaces! (§9.1.4–§9.1.5)"},
            {"q": "If a contiguous fixed partition of size 4,096 B holds a 3,000 B process leaving 1,096 B unused inside that block, is that Internal or External fragmentation?", "a": "INTERNAL Fragmentation! Because those 1,096 unused bytes belong to an allocated partition already assigned to the process."}
        ]
    },
    "deck_17": {
        "inlineSabotage": {
            "find": "<strong>ASIDs (Address-Space Identifiers):</strong> Tagging each TLB entry with the process's ASID prevents flushing the entire TLB on every context switch, while still blocking process A from accessing process B's translations.",
            "corrupt": "<strong>ASIDs (Address-Space Identifiers):</strong> Force hardware to flush every TLB entry on every context switch so physical frames remain strictly contiguous in RAM.",
            "why": "Opposite! ASIDs ELIMINATE needing to flush the entire TLB on context switches by stamping each TLB row with its owning process tag (§9.3.2)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Paging & TLB Structures)",
                "prompt": "Find the misleading textbook claim about Paging and Page Tables:",
                "items": [
                    "1. Inverted Page Tables maintain one global table sized proportionally to physical frames rather than virtual pages.",
                    "2. Without a TLB, accessing an address through an in-memory single-level page table requires 2 RAM accesses.",
                    "3. A 32-bit logical address with 4 KB pages splits into a 12-bit Page Number `p` and a 20-bit Page Offset `d`.",
                    "4. Hashed Page Tables are effective for sparse 64-bit virtual address spaces."
                ],
                "bugIdx": 2,
                "fix": "BITS REVERSED! Page Size = 4 KB = 2^12 bytes -> lower 12 bits = Offset `d`! Remaining upper 32 - 12 = 20 bits = Page Number `p`! (§9.3.1)"
            },
            {
                "type": "EAT Calculation Bug (TLB=20ns, Mem=100ns, alpha=0.80)",
                "prompt": "Spot the math mistake in calculating Effective Access Time (TLB=20ns, RAM=100ns, alpha=80%):",
                "items": [
                    "Step 1: On TLB HIT (prob = 0.80), time = TLB (20 ns) + RAM Data (100 ns) = 120 ns.",
                    "Step 2: On TLB MISS (prob = 0.20), time = TLB (20 ns) + PageTable RAM (100 ns) + Data RAM (100 ns) = 220 ns.",
                    "Step 3: Weighted sum: EAT = 0.80 * (120) + 0.20 * (120) = 120 ns.",
                    "Step 4: Raising hit rate alpha to 99% drops EAT cleanly to 121 ns."
                ],
                "bugIdx": 2,
                "fix": "Step 3 used `120 ns` instead of `220 ns` on the MISS branch! Correct math: `0.80(120) + 0.20(220) = 96 + 44 = 140 ns`! (§9.3.2)"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why can't two processes easily share memory pages inside a classic Inverted Page Table without extra kernel machinery?", "a": "Because an Inverted Page Table has only ONE slot per physical frame, each containing a single `<pid, page_num>` pair—it cannot map two different processes' virtual pages directly to one slot! (§9.4.3)"},
            {"q": "Why does 2-level paging (say 10-bit outer p1, 10-bit inner p2, 12-bit offset) save megabytes of RAM for small programs?", "a": "You only allocate inner page tables for virtual regions actually used (code + stack + small heap), leaving gigabytes of empty address holes completely unallocated!"}
        ]
    },
    "deck_18": {
        "inlineSabotage": {
            "find": "<strong>Step 1 (Trap):</strong> Reference to page marks PTE bit = <code>i</code> (invalid) &rArr; MMU hardware raises a <strong>Page-Fault Trap</strong> to the OS.",
            "corrupt": "<strong>Step 1 (Trap):</strong> Reference to page marks PTE bit = <code>i</code> (invalid) &rArr; Hardware ignores the bit quietly or terminates the process immediately without letting the OS page from disk.",
            "why": "Invalid PTE bits trigger a recoverable Page-Fault Trap to the OS (Step 1), letting the OS verify PCB bounds (Step 2) and swap valid disk pages smoothly into RAM! (§10.2.1)"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Virtual Memory & Anomalies)",
                "prompt": "Spot the single false claim about Demand Paging, Replacement, and Thrashing:",
                "items": [
                    "1. Copy-on-Write avoids duplicating unmodified parent RAM pages during `fork()` until either process writes.",
                    "2. Optimal (OPT) and LRU are Stack Algorithms and can NEVER suffer Belady's Anomaly.",
                    "3. Thrashing occurs when total working-set frame demand D exceeds total physical frames m, crashing CPU utilization.",
                    "4. Increasing physical frames from 3 to 4 guarantees fewer or equal page faults under ALL page replacement algorithms including FIFO."
                ],
                "bugIdx": 3,
                "fix": "BELADY'S ANOMALY! On reference string `1,2,3,4,1,2,5,1,2,3,4,5`, FIFO actually suffers MORE faults with 4 frames (10) than with 3 frames (9)! Only Stack Algorithms (OPT, LRU) avoid this (§10.4.2)."
            },
            {
                "type": "6-Step Page Fault Handler Bug",
                "prompt": "Spot the corrupted order/step inside the OS Page Fault Handler:",
                "items": [
                    "Step A: CPU traps on PTE valid-invalid bit = `i` -> saves registers & checks PCB internal table.",
                    "Step B: OS allocates a free physical frame (evicting a victim if RAM full; skipping disk write-back if dirty == 0!).",
                    "Step C: Schedules disk read into frame while process moves to Waiting state.",
                    "Step D: On disk interrupt, update PTE bit `i -> v`, and resume execution at the NEXT instruction SKIPPING the trapped opcode!"
                ],
                "bugIdx": 3,
                "fix": "NEVER skip the instruction! The trapped memory load/store never succeeded before the fault! Step 6 MUST RESTART THE EXACT TRAPPED INSTRUCTION cleanly so the read/write executes now that the page is in RAM (§10.2.1)!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why does Enhanced Second-Chance Clock search `(ref, modify)` pairs in exact order `(0,0) -> (0,1) -> (1,0) -> (1,1)`?", "a": "`(0,0)` was neither recently used NOR modified (zero disk write-back needed = free victim!). `(0,1)` wasn't recently used, needs write-back. `(1,0)` was used recently but clean. `(1,1)` is worst (recently used AND dirty)!"},
            {"q": "When Thrashing hits, why does a naive scheduler that adds MORE jobs whenever CPU utilization drops make Thrashing catastrophically worse?", "a": "Low CPU utilization happens because processes are blocked WAITING ON SWAP DISK, NOT idle waiting for CPU! Swapping in more processes shrinks everyone's frame count further, multiplying page faults!"}
        ]
    },
    "deck_19": {
        "inlineSabotage": {
            "find": "RAID combines multiple physical drives for two goals: <strong>Reliability via Redundancy</strong> (surviving disk failure) and <strong>Performance via Striping</strong> (splitting data blocks across drives in parallel):",
            "corrupt": "RAID levels including <strong>RAID 0</strong> always reserve at least one parity or mirror drive for redundancy, guaranteeing every RAID array survives at least 1 failed disk safely:",
            "why": "CRITICAL EXAM TRAP! RAID 0 provides PURE non-redundant block striping—0 redundancy! Losing a single drive in RAID 0 destroys the entire array (§11.8.3)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (SSD, Scheduling & RAID)",
                "prompt": "Find the broken engineering statement among these Mass Storage facts:",
                "items": [
                    "1. NAND Flash SSDs must erase an entire multi-page Erase Block before overwriting updated pages, requiring Wear Leveling.",
                    "2. SSTF minimizes local seek distance greedily, creating a risk of Starvation for extreme outer/inner cylinder requests.",
                    "3. C-SCAN services requests both on its upward sweep AND on its rapid downward return sweep back toward cylinder 0.",
                    "4. For 6 x 4TB disks, RAID 5 gives 20TB (1 fail tolerance) while RAID 6 gives 16TB (2 simultaneous fail tolerance)."
                ],
                "bugIdx": 2,
                "fix": "C-SCAN treats the disk circularly: it services ONLY in ONE direction (e.g., UP 53 -> 199), then returns immediately `199 -> 0` WITHOUT servicing any requests during the return sweep! (Doing both directions is bidirectional SCAN!) (§11.2.3)."
            },
            {
                "type": "Numerical Trace Bug (Silberschatz Disk Queue 0..199, Head=53, Queue=98,183,37,122,14,124,65,67)",
                "prompt": "Spot the miscalculated head movement among these disk algorithms:",
                "items": [
                    "FCFS (53->98->183->37->122->14->124->65->67) = 640 total cylinders.",
                    "SSTF (53->65->67->37->14->98->122->124->183) = 236 total cylinders.",
                    "C-LOOK moving UP (53->183->14->37) = (183-53) + (37-14) = 153 total cylinders.",
                    "LOOK moving DOWN first (53->37->14->65->183) = (53-14) + (183-14) = 208 total cylinders."
                ],
                "bugIdx": 2,
                "fix": "You omitted the physical head travel jump from highest request `183` back to lowest request `14` (`183 - 14 = 169`)! Correct C-LOOK distance: `130 + 169 + 23 = 322 cylinders`! (Slide 19 / 9th Ed. §10.4)"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why does RAID 1+0 (Stripe of Mirrors) outperform RAID 0+1 (Mirror of Stripes) in reliability when 2 random drives fail across a 4-disk array?", "a": "In RAID 0+1, if 1 disk fails in Left Stripe, the whole Left Stripe fails; losing ANY drive in Right Stripe destroys the array (4/6 two-drive pairs kill it!). In RAID 1+0, losing 1 drive from Pair A leaves Pair A mirrored; ONLY losing Pair A's exact partner destroys it (only 2/6 pairs kill it!) (§11.8.3)."},
            {"q": "For a 7,200 RPM HDD transferring a 4 KB block across tracks vs. an NVMe SSD, why are OS Disk Scheduling algorithms like SCAN/SSTF mostly disabled (`none`/`noop`) for NVMe SSDs?", "a": "SSDs have zero mechanical seek arm or spinning platter! All NAND channels answer uniformly in microseconds regardless of LBA cylinder address (§11.1.2)."}
        ]
    },
    "deck_20": {
        "inlineSabotage": {
            "find": "<strong>System-Wide Open-File Table:</strong> Holds process-independent FCB metadata (file size, disk block pointers, dates, and an <strong>Open Count</strong> so deleting/closing only destroys the file once <code>open_count == 0</code>).",
            "corrupt": "<strong>System-Wide Open-File Table:</strong> Tracks per-process private cursor offsets (each process's independent read/write byte position inside the file).",
            "why": "Careful! Individual cursor read/write offsets belong in the PER-PROCESS Open-File Table! The System-Wide table shares global FCB location/size/open_count across all openers (§13.1.2)."
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (File Allocation & Free Space)",
                "prompt": "Click the single false claim about Disk Allocation & File Systems:",
                "items": [
                    "1. Linked Allocation solves External Fragmentation completely, yet suffers poor O(N) direct random access without FAT RAM caching.",
                    "2. Contiguous Allocation supports ultra-fast O(1) direct seeks using `[start + i]`, yet suffers external fragmentation.",
                    "3. UNIX Hard Links copy the target pathname text into a special link file that turns into a dangling pointer if deleted.",
                    "4. Write-ahead Journaling replays recent committed metadata logs quickly after crashes instead of full-disk `fsck` scans."
                ],
                "bugIdx": 2,
                "fix": "That describes a SYMBOLIC (SOFT) LINK! A UNIX Hard Link points directly to the shared Inode number with an incremented reference count (`link_count`), never creating dangling text paths (§13.3.4)."
            },
            {
                "type": "Inode Max File Size Math Bug (4KB Block, 4B Pointer = 1024 Ptrs/Blk)",
                "prompt": "Find the order-of-magnitude bug in calculating max file size for a UNIX Inode (12 Direct + 1 Single + 1 Double + 1 Triple Indirect, 4KB blocks, 4B ptrs):",
                "items": [
                    "Line 1: Pointers per Index Block P = 4,096 B / 4 B = 1,024 = 2^10 pointers.",
                    "Line 2: 12 Direct Blocks = 12 * 4 KB = 48 KB.",
                    "Line 3: 1 Single Indirect = 1,024 * 4 KB = 4 MB; 1 Double Indirect = (1,024)^2 * 4 KB = 4 GB.",
                    "Line 4: 1 Triple Indirect = (1,024)^3 * 4 B = 4 GB -> Total Max File Size ~ 8 GB!"
                ],
                "bugIdx": 3,
                "fix": "Multiply data block count `(1024)^3` by **4 KB** (4,096 B per data block), NOT by 4 Bytes (pointer size)! Correct: `2^30 * 4 KB = 4 TB` (~4.004 TB total) (§14.4.3)!"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Suppose OS Buffer Cache and Virtual Memory Page Cache sit separately in kernel RAM. What bug/waste occurs when calling `read()` on a file simultaneously `mmap()`-ed into virtual memory?", "a": "DOUBLE CACHING! Two identical copies of the same disk file sit in RAM simultaneously (one in Buffer Cache, one in Page Cache), risking inconsistency and halving effective cache RAM—cured by Unified Buffer Cache (§14.6.2)!"},
            {"q": "In a 32-bit-word Bit Vector (`1 = free`), if Word 0 is `0x00000000` (all used) and Word 1 is `0x00000004` (bit index 2 = 1), which block is free?", "a": "Block `(32 * 1) + 2 = Block 34`! (§14.5.1)"}
        ]
    },
    "deck_21": {
        "inlineSabotage": {
            "find": "When <code>byte_count == 0</code>, DMA controller raises <strong>ONE single hardware interrupt</strong> to signal the CPU!",
            "corrupt": "When <code>byte_count == 0</code>, DMA controller forces the CPU to poll the disk Status Register byte-by-byte, raising <strong>1 interrupt per transferred byte</strong>!",
            "why": "That completely misses the point of DMA! DMA transfers an entire block via cycle-stealing and fires ONLY 1 single completion interrupt when the entire block finishes (§12.2.4)!"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (I/O Hardware & Kernel Subsystem)",
                "prompt": "Find the erroneous statement in these I/O Systems claims:",
                "items": [
                    "1. Memory-Mapped I/O maps controller registers directly into physical RAM address space for fast graphics/NVMe writes.",
                    "2. Polling (Programmed I/O) beats Interrupt-Driven I/O when ultra-fast device latency is shorter than interrupt dispatch overhead.",
                    "3. Spooling queues exclusive jobs onto disk spool files so multiple users don't interleave lines on a shared printer.",
                    "4. A Kernel Cache may hold the sole existing copy of an item in transit, whereas a Kernel Buffer strictly copies data stored permanently elsewhere."
                ],
                "bugIdx": 3,
                "fix": "REVERSED DEFINITIONS (§12.4.3)! A **Buffer** holds data in transit and may hold the ONLY copy of an item; a **Cache** strictly holds a faster temporary copy of data stored safely elsewhere!"
            },
            {
                "type": "I/O API Mode Check (Blocking vs Nonblocking vs Async)",
                "prompt": "Match each syscall trace to its exact Silberschatz §12.3.4 semantics—click the mismatched line:",
                "items": [
                    "Blocking read(): Calling thread suspends inside Waiting Queue until controller completes transfer and copies data into user buffer.",
                    "Nonblocking read(): Returns immediately with whatever bytes currently reside in kernel buffer (even 0 / EAGAIN).",
                    "Asynchronous read(): Returns immediately so app computes concurrently, and kernel signals app ONLY AFTER the full transfer finishes.",
                    "Copy Semantics bug: Asynchronous write() needs Double Buffering because nonblocking reads never use kernel buffers."
                ],
                "bugIdx": 3,
                "fix": "Kernel uses **Copy Semantics** (copying user write-buffer into a private kernel buffer at call time) so if the app modifies its own array immediately after calling async `write()`, the disk still gets the clean snapshot as of the call instant! (§12.4.2)"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: During DMA Cycle Stealing, does the CPU halt completely until the 4 KB disk transfer ends?", "a": "NO! The DMA controller borrows only the memory bus cycles between CPU cache/register instructions; the CPU continues executing compute instructions inside registers/L1/L2 cache seamlessly! (§12.2.4)"},
            {"q": "Why must ALL direct I/O port instructions (`IN`/`OUT` or memory-mapped control writes) remain strictly privileged Kernel-Mode instructions?", "a": "If User Mode could issue raw controller commands, a malicious app could overwrite disk sector 0 (partition table / OS kernel) or sniff other processes' keystrokes bypassing file permissions!"}
        ]
    },
    "deck_22": {
        "inlineSabotage": {
            "find": "<strong>Copy Flag (<code>*</code>):</strong> Allows domain D<sub>i</sub> to copy <em>that exact right</em> into another row of the <strong>same column</strong> (may transfer as copyable <code>*</code> or non-copyable!).",
            "corrupt": "<strong>Copy Flag (<code>*</code>):</strong> Authorizes domain D<sub>i</sub> to copy an access right horizontally across <strong>other objects in the same row</strong> inside Domain D<sub>i</sub>!",
            "why": "Check Access Matrix geometry! Columns = Objects, Rows = Domains! Copying a right applies to THAT EXACT OBJECT—so you copy vertically within the **same Column** into another Domain's row! (§17.5)"
        },
        "bugHunts": [
            {
                "type": "Statement Sabotage (Protection & Cryptography)",
                "prompt": "Spot the subtly corrupted statement about OS Security & Protection:",
                "items": [
                    "1. Access Control Lists (ACLs) store permissions column-wise with each object, making per-file user revocation immediate.",
                    "2. Capability Lists store unforgeable tokens row-wise with each protection domain, making immediate selective revocation harder.",
                    "3. A Digital Signature encrypts a document hash using the sender's PUBLIC key so anyone claiming to be the sender can decrypt it.",
                    "4. Per-user password Salting defeats precomputed Rainbow Tables even if two users pick identical weak passwords."
                ],
                "bugIdx": 2,
                "fix": "Digital Signatures MUST encrypt the digest `Hash(M)` with the sender's **PRIVATE Key**! Anyone can verify using the sender's Public Key—proving ONLY the private-key holder could have signed it (§16.4.1.3)!"
            },
            {
                "type": "Access Matrix Operations Trace Bug",
                "prompt": "Inspect this Lampson Access Matrix rule trace and spot the unauthorized step:",
                "items": [
                    "Rule A: Cell M[D1, F1] holds `read*` -> D1 may legally copy `read` to M[D3, F1] (same column F1!).",
                    "Rule B: Cell M[D2, F2] holds `owner` -> D2 may add `write` to M[D1, F2] or revoke rights in column F2.",
                    "Rule C: Cell M[D2, D3] holds `control` -> D2 may remove `read` from M[D3, F1] (modifying Row D3!).",
                    "Rule D: Cell M[D1, F1] holds `owner` -> D1 may copy `print` into M[D3, printer] across columns!"
                ],
                "bugIdx": 3,
                "fix": "`owner` ONLY controls permissions on THAT EXACT OBJECT's COLUMN (`F1`)! Owning `F1` never lets D1 grant rights on `printer`! (§17.5)"
            }
        ],
        "socratic": [
            {"q": "Pause & Predict: Why can a Network Worm replicate across thousands of machines automatically without human clicking, unlike a classic File Virus?", "a": "A Virus is parasitic code attached to a host executable requiring users to share/run files; a Worm is a standalone network process exploiting remote vulnerabilities (like buffer overflows) over TCP/IP autonomously! (§16.2.3)"},
            {"q": "How do NX/DEP and ASLR work together like a two-layer lock against Stack Buffer Overflows?", "a": "Even if an overflow overwrites the Saved Return Address, NX blocks executing injected shellcode on the stack, AND ASLR randomizes libc/gadget memory addresses so Return-Oriented Programming (ROP) jumps miss blindly! (§16.6.7)"}
        ]
    }
}
