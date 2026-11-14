# -*- coding: utf-8 -*-
"""
Part 4 Knowledge Trove:
- QUIZ_KNOWLEDGE_BASE (5 rigorous textbook questions x 21 decks = 105 questions)
- FORMULAS_DATA (24 master formulas across Chapters 1-17)
- EXTRA_GLOSSARY_DATA (merged with baseline 64 terms -> 115+ alphabetical glossary terms)
"""

QUIZ_KNOWLEDGE_BASE = {
    "deck_02": [
        {
            "q": "What is the primary operational difference between Multiprogramming and Multitasking (Time-Sharing) (§1.4)?",
            "opts": [
                "A) Multiprogramming maximizes CPU utilization by switching only on I/O waits; Multitasking minimizes response time via timer-driven preemption.",
                "B) Multiprogramming requires multiple CPU cores; Multitasking runs exclusively on single-core CPUs.",
                "C) Multiprogramming runs entirely in User Mode; Multitasking runs entirely in Kernel Mode.",
                "D) Multitasking uses FCFS queues exclusively while Multiprogramming uses Round Robin."
            ],
            "answer": 0,
            "explanation": "Silberschatz §1.4 & Mock Midterm Q1.A: Multiprogramming boosts CPU utilization by holding multiple jobs in RAM and switching when a job waits (e.g., for I/O). Multitasking extends this so timer interrupts switch jobs frequently to achieve fast interactive response time."
        },
        {
            "q": "When a user program invokes read(), what happens to the CPU hardware Mode Bit across the full system call lifecycle (§1.4.2, Mock Midterm Q2.A)?",
            "opts": [
                "A) Remains 1 (User Mode) for security while reading disk.",
                "B) Trap flips Mode Bit from 1 -> 0 (Kernel Mode), kernel executes service via IVT, then return-from-trap restores 0 -> 1.",
                "C) Trap flips Mode Bit from 0 -> 1 so the device driver runs in Ring 3.",
                "D) Interrupt controller clears the Mode Bit permanently until next process creation."
            ],
            "answer": 1,
            "explanation": "Execution starts in User Mode (Mode Bit = 1). The syscall trap flips Mode Bit to 0 (Kernel Mode / Ring 0), hardware jumps via the Interrupt Vector Table (IVT), kernel handles read(), and return-from-trap sets Mode Bit back to 1."
        },
        {
            "q": "Why is Direct Memory Access (DMA) dramatically faster than Interrupt-Driven Programmed I/O for disk block transfers (§1.2)?",
            "opts": [
                "A) DMA converts HDD platters into SRAM cache lines.",
                "B) DMA bypasses Main Memory and loads disk blocks directly into CPU general registers.",
                "C) DMA transfers an entire block between device buffer and RAM directly, generating 1 interrupt per block instead of 1 per byte.",
                "D) DMA executes user-space threads inside Ring 0."
            ],
            "answer": 2,
            "explanation": "Silberschatz §1.2.3: Without DMA, the CPU handles interrupts byte-by-byte. DMA controller transfers an entire block directly to/from RAM and interrupts the CPU only once when the block transfer completes."
        },
        {
            "q": "Which System Call parameter-passing method removes any limit on the number or length of arguments without pushing them individually on the hardware stack (§2.3)?",
            "opts": [
                "A) Passing all parameters directly in general-purpose CPU registers.",
                "B) Storing parameters inside a memory block/table in RAM and passing the block's starting address in a register.",
                "C) Hardcoding parameters inside the bootstrap EEPROM.",
                "D) Writing parameters into the DMA controller control register."
            ],
            "answer": 1,
            "explanation": "Silberschatz §2.3: CPU registers limit argument count. Linux/Solaris use the memory block/table method (address in 1 register) or stack method when parameter lists exceed register capacity."
        },
        {
            "q": "Which OS architecture achieves high modularity and fault isolation by moving file systems and device drivers out of Ring 0 into user-space servers communicating via IPC (§2.8)?",
            "opts": [
                "A) Traditional Monolithic UNIX Kernel",
                "B) Microkernel (e.g., Mach, QNX)",
                "C) MS-DOS Unstructured Architecture",
                "D) Asymmetric Multiprocessing (AMP)"
            ],
            "answer": 1,
            "explanation": "Silberschatz §2.8.3: Microkernels keep only minimal IPC, scheduling, and basic memory services in kernel mode, relocating other services to user space (at the cost of added IPC message-passing overhead)."
        }
    ],
    "deck_03": [
        {
            "q": "What value does fork() return to the newly created CHILD process upon success, and what does it return to the PARENT (§3.3)?",
            "opts": [
                "A) Child's PID to both parent and child.",
                "B) 0 to the child process; the child's positive PID to the parent process.",
                "C) -1 to the child; 0 to the parent.",
                "D) Parent's PID to the child; 0 to the parent."
            ],
            "answer": 1,
            "explanation": "Silberschatz §3.3.1: fork() returns 0 to the child so it knows it is the new process, and returns the positive child PID to the parent so the parent can track/wait() for that child."
        },
        {
            "q": "If a single process executes three unconditional sequential fork() calls (fork(); fork(); fork();), how many TOTAL processes exist at the end (§3.3)?",
            "opts": [
                "A) 3 processes",
                "B) 4 processes",
                "C) 6 processes",
                "D) 8 processes"
            ],
            "answer": 3,
            "explanation": "Each fork() doubles the number of executing processes: 2^n total processes. For n = 3 unconditional forks: 2^3 = 8 total processes (1 original + 7 newly created)."
        },
        {
            "q": "What is the exact distinction between a Zombie process and an Orphan process in UNIX/Linux (§3.3.2)?",
            "opts": [
                "A) A Zombie has terminated while its living parent hasn't called wait(); an Orphan's parent terminated while the child still runs (reparented to init/systemd).",
                "B) A Zombie waits on disk I/O; an Orphan runs infinitely without a PCB.",
                "C) Orphans leak entries in the process table permanently; Zombies are immediately destroyed.",
                "D) Zombies only exist in Shared Memory IPC; Orphans exist only in Message Passing."
            ],
            "answer": 0,
            "explanation": "Silberschatz §3.3.2: Terminated children waiting to be reaped by wait() are Zombies. If the parent exits first without calling wait(), the child becomes an Orphan and gets adopted by PID 1 (init/systemd)."
        },
        {
            "q": "A program adds 5 to every element of a 1,000-element array by splitting 250 elements per core across 4 cores. Which parallelism type is this (Mock Midterm Q2.B/C)?",
            "opts": [
                "A) Task Parallelism",
                "B) Data Parallelism",
                "C) Asymmetric Multiprocessing",
                "D) Many-to-One Multithreading"
            ],
            "answer": 1,
            "explanation": "Silberschatz §4.2: Data Parallelism distributes subsets of the same data across multiple cores and executes the exact same operation (+5) on each subset."
        },
        {
            "q": "According to Amdahl's Law, if 25% of an application must execute serially (S = 0.25), what is the absolute theoretical maximum speedup even with an infinite number of CPU cores (§4.2)?",
            "opts": [
                "A) 2.5x",
                "B) 4.0x",
                "C) 10.0x",
                "D) Unlimited (N -> infinity)"
            ],
            "answer": 1,
            "explanation": "Silberschatz §4.2: Speedup <= 1 / (S + (1 - S)/N). As N -> infinity, (1 - S)/N -> 0, leaving Speedup <= 1 / S = 1 / 0.25 = 4.0x!"
        }
    ],
    "deck_04": [
        {
            "q": "Under which of the 4 CPU scheduling transition circumstances MUST scheduling be strictly Non-Preemptive (§5.1.3)?",
            "opts": [
                "A) Transitions 2 (Running -> Ready) and 3 (Waiting -> Ready)",
                "B) Transitions 1 (Running -> Waiting) and 4 (Running -> Terminated)",
                "C) Transitions 1 (Running -> Waiting) and 2 (Running -> Ready)",
                "D) All 4 transitions require preemption"
            ],
            "answer": 1,
            "explanation": "Silberschatz §5.1.3: When a process blocks for I/O (1) or exits (4), there is no choice—another process must be picked. Preemption applies only to timer/interrupt transitions (2) and (3)."
        },
        {
            "q": "Which of the 5 CPU scheduling criteria directly measures the time from process submission until the FIRST response begins to be produced (§5.2)?",
            "opts": [
                "A) Turnaround Time (TAT)",
                "B) Waiting Time (WT)",
                "C) Response Time (RT)",
                "D) Dispatch Latency"
            ],
            "answer": 2,
            "explanation": "Silberschatz §5.2: Response Time = First CPU Start - Arrival Time. Turnaround Time measures total completion latency (CT - AT), which is often unsuitable for interactive time-sharing."
        },
        {
            "q": "Three processes arrive at AT = 0 in exact order P1 (BT=24), P2 (BT=3), P3 (BT=3). What is the Average Waiting Time under FCFS, and what phenomenon causes it (§5.3.1)?",
            "opts": [
                "A) 3.0 ms — Aging Effect",
                "B) 5.67 ms — Priority Inversion",
                "C) 17.0 ms — Convoy Effect",
                "D) 20.0 ms — Thrashing"
            ],
            "answer": 2,
            "explanation": "Gantt: P1(0-24), P2(24-27), P3(27-30). Waiting times: P1=0, P2=24, P3=27 -> (0+24+27)/3 = 17.0 ms. Short I/O jobs stuck behind 1 long CPU hog exemplifies the Convoy Effect."
        },
        {
            "q": "Given AT = [0, 1, 2] and BT = [8, 4, 2] for P1, P2, P3, what is P3's Waiting Time under non-preemptive FCFS?",
            "opts": [
                "A) 6 ms",
                "B) 10 ms",
                "C) 12 ms",
                "D) 14 ms"
            ],
            "answer": 1,
            "explanation": "P1 runs 0-8, P2 runs 8-12, P3 runs 12-14. P3 arrived at AT=2 and started at 12, so WT(P3) = First Start - AT = 12 - 2 = 10 ms (also CT 14 - AT 2 - BT 2 = 10 ms)."
        },
        {
            "q": "Using Little's Formula (n = lambda * W), if processes arrive at 5 per second and the Ready Queue averages 20 waiting processes in steady state, what is the average waiting time W (§5.8.2)?",
            "opts": [
                "A) 0.25 seconds",
                "B) 4.0 seconds",
                "C) 15.0 seconds",
                "D) 100.0 seconds"
            ],
            "answer": 1,
            "explanation": "Little's Formula: n = lambda * W -> W = n / lambda = 20 / 5 = 4.0 seconds average wait."
        }
    ],
    "deck_05": [
        {
            "q": "Why is non-preemptive SJF provably optimal in minimizing Average Waiting Time for a given set of ready processes (§5.3.2)?",
            "opts": [
                "A) Because moving a shorter job ahead of a longer job decreases the short job's wait by more than it increases the long job's wait.",
                "B) Because SJF always avoids timer interrupts and context switches.",
                "C) Because SJF estimates infinite bursts accurately without OS assistance.",
                "D) Because SJF assigns higher throughput weight to interactive jobs."
            ],
            "answer": 0,
            "explanation": "Silberschatz §5.3.2 exchange proof: Swapping a short job (S) ahead of a long job (L > S) reduces total waiting time by (L - S) > 0, minimizing average waiting time."
        },
        {
            "q": "In Exponential Averaging tau_{n+1} = alpha * t_n + (1 - alpha) * tau_n, what happens if alpha = 0 and alpha = 1 respectively (§5.3.2)?",
            "opts": [
                "A) alpha=0 uses only most recent actual burst t_n; alpha=1 ignores history completely.",
                "B) alpha=0 retains initial prediction forever ignoring recent history; alpha=1 predicts strictly the most recent actual burst t_n.",
                "C) alpha=0 halves every prediction; alpha=1 doubles it.",
                "D) Both alpha=0 and alpha=1 converge to the mathematical mean of all bursts."
            ],
            "answer": 1,
            "explanation": "If alpha = 0, tau_{n+1} = tau_n (recent actual t_n multiplied by 0!). If alpha = 1, tau_{n+1} = t_n (historical tau_n multiplied by 0!)."
        },
        {
            "q": "Given initial estimate tau_0 = 10 ms, alpha = 0.5, and actual bursts t_0 = 6 ms and t_1 = 4 ms, what is the predicted burst tau_2 (§5.3.2)?",
            "opts": [
                "A) 8 ms",
                "B) 7 ms",
                "C) 6 ms",
                "D) 5 ms"
            ],
            "answer": 2,
            "explanation": "Step 1: tau_1 = 0.5(6) + 0.5(10) = 3 + 5 = 8 ms. Step 2: tau_2 = 0.5(4) + 0.5(8) = 2 + 4 = 6 ms."
        },
        {
            "q": "Consider processes (AT, BT): P1=(0,7), P2=(2,4), P3=(4,1), P4=(5,4). Under Non-Preemptive SJF with FCFS tie-breaking, in what order do they complete (§5.3.2)?",
            "opts": [
                "A) P3, P2, P4, P1",
                "B) P1, P3, P2, P4",
                "C) P1, P2, P3, P4",
                "D) P1, P3, P4, P2"
            ],
            "answer": 1,
            "explanation": "At t=0, only P1 exists so P1 runs uninterrupted (0-7). At t=7, all of P2(4), P3(1), P4(4) are ready. P3(1) runs 7-8. P2 & P4 tie at 4ms -> FCFS picks P2(arrived t=2) 8-12, then P4 12-16."
        },
        {
            "q": "What is the primary practical obstacle preventing direct implementation of exact SJF in general-purpose CPU schedulers (§5.3.2)?",
            "opts": [
                "A) SJF cannot run on multi-core processors.",
                "B) A general-purpose OS cannot know the exact length of a process's upcoming CPU burst in advance.",
                "C) SJF requires virtual memory page tables.",
                "D) SJF generates higher waiting times than FCFS."
            ],
            "answer": 1,
            "explanation": "Silberschatz §5.3.2: While long-term batch systems used user-submitted job estimates, interactive CPU schedulers don't know future CPU bursts and must approximate them via exponential averaging."
        }
    ],
    "deck_06": [
        {
            "q": "Under Shortest Remaining Time First (SRTF), what exact condition triggers preemption when process P_new arrives while P_running executes (§5.3.2)?",
            "opts": [
                "A) Burst(P_new) <= Remaining(P_running)",
                "B) Burst(P_new) < Remaining(P_running)",
                "C) Total_Burst(P_new) < Total_Burst(P_running)",
                "D) ArrivalTime(P_new) < CompletionTime(P_running)"
            ],
            "answer": 1,
            "explanation": "Strict less-than (<)! If Burst(P_new) < Remaining(P_running), P_running is preempted. On equality (==), keeping P_running avoids useless context switch overhead."
        },
        {
            "q": "Using the classic SRTF trace: P1(AT=0, BT=8), P2(1,4), P3(2,9), P4(3,5). What happens at time t = 1 ms?",
            "opts": [
                "A) P2 waits in queue because P1 only ran 1 ms.",
                "B) P2 preempts P1 because Burst(P2)=4 < Remaining(P1)=7.",
                "C) P1 finishes at t=8 before P2 is examined.",
                "D) P3 preempts P2 immediately."
            ],
            "answer": 1,
            "explanation": "At t=1, P1 has consumed 1ms, leaving 8 - 1 = 7ms remaining. P2 arrives with burst 4ms < 7ms, so P1 is preempted and P2 takes the CPU."
        },
        {
            "q": "In the same classic SRTF trace [P1(0,8), P2(1,4), P3(2,9), P4(3,5)], what is the Completion Time and Waiting Time of P1?",
            "opts": [
                "A) CT = 8 ms, WT = 0 ms",
                "B) CT = 17 ms, WT = 9 ms",
                "C) CT = 10 ms, WT = 2 ms",
                "D) CT = 26 ms, WT = 18 ms"
            ],
            "answer": 1,
            "explanation": "Gantt: P1(0-1), P2(1-5), P4(5-10), P1(10-17), P3(17-26). Thus CT(P1) = 17 ms, TAT(P1) = 17 - 0 = 17 ms, WT(P1) = 17 - 8 = 9 ms."
        },
        {
            "q": "For a preempted process like P1 in SRTF above, why is its Waiting Time (9 ms) DIFFERENT from its Response Time (0 ms)?",
            "opts": [
                "A) Because P1 spent 9 ms waiting in the ready queue AFTER its first CPU execution at t = 0.",
                "B) Because Response Time includes I/O burst delays.",
                "C) Because P1 arrived at t = 9 ms.",
                "D) Wait Time is always strictly less than Response Time."
            ],
            "answer": 0,
            "explanation": "Response Time measures delay only until FIRST CPU execution (0 - 0 = 0 ms), whereas Waiting Time sums ALL intervals spent waiting in the ready queue (0 + (10 - 1) = 9 ms)."
        },
        {
            "q": "What is the Average Waiting Time of SRTF vs. Non-Preemptive SJF on P1(0,8), P2(1,4), P3(2,9), P4(3,5)?",
            "opts": [
                "A) SRTF = 6.50 ms; Non-Preemptive SJF = 7.75 ms",
                "B) SRTF = 7.75 ms; Non-Preemptive SJF = 6.50 ms",
                "C) Both give 6.50 ms",
                "D) SRTF = 13.0 ms; SJF = 14.5 ms"
            ],
            "answer": 0,
            "explanation": "SRTF WTs: P1=9, P2=0, P3=15, P4=2 -> 26/4 = 6.50 ms. SJF WTs: P1=0, P2=7, P4=9, P3=15 -> 31/4 = 7.75 ms. SRTF achieves the lower global minimum!"
        }
    ],
    "deck_07": [
        {
            "q": "In Silberschatz 10th Ed. and CPCS-361 exams, unless stated otherwise, what does Priority 1 mean compared to Priority 5 (§5.3.4)?",
            "opts": [
                "A) Priority 5 is higher than Priority 1.",
                "B) Priority 1 is HIGHER than Priority 5 (smaller integer = higher priority).",
                "C) Equal priority assigned dynamically.",
                "D) Negative integers must be used for kernel threads."
            ],
            "answer": 1,
            "explanation": "Silberschatz §5.3.4: Typically small integer numbers represent high priority (0 or 1 = highest priority)."
        },
        {
            "q": "How does Priority Scheduling solve the problem of Starvation (Indefinite Blocking) of low-priority processes (§5.3.4)?",
            "opts": [
                "A) By switching the algorithm to non-preemptive FCFS permanently.",
                "B) By using Aging: gradually increasing the priority of processes waiting for a long time.",
                "C) By terminating processes that wait too long instead of running them.",
                "D) By shrinking the ready queue limit to 4 processes."
            ],
            "answer": 1,
            "explanation": "Silberschatz §5.3.4: Aging progressively escalates waiting processes' priority over time so every ready process eventually attains top priority and runs."
        },
        {
            "q": "In Mock Midterm Q6 (Preemptive Priority, 1=High): P1(AT=0,BT=6,Pr=3), P2(1,4,2), P3(3,2,1), P4(4,4,4), P5(6,3,2). What is the Completion Time and Waiting Time of P2?",
            "opts": [
                "A) CT = 5 ms, WT = 0 ms",
                "B) CT = 7 ms, WT = 2 ms",
                "C) CT = 10 ms, WT = 5 ms",
                "D) CT = 15 ms, WT = 10 ms"
            ],
            "answer": 1,
            "explanation": "Gantt: P1(0-1), P2(1-3), P3(3-5), P2(5-7), P5(7-10), P1(10-15), P4(15-19). P2 completes at t = 7! TAT = 7 - 1 = 6 ms, WT = 6 - 4 = 2 ms."
        },
        {
            "q": "In that same Mock Midterm Q6 trace, when P5 arrives at t = 6 ms with Priority 2 while P2 (also Priority 2) is running, what occurs?",
            "opts": [
                "A) P5 immediately preempts P2.",
                "B) P2 continues running because equal priority does NOT trigger preemption (tie goes to currently running P2).",
                "C) Both P2 and P5 switch into Round Robin instantly at t = 6.",
                "D) P4 runs before P5."
            ],
            "answer": 1,
            "explanation": "Preemption occurs only when newly arrived priority is STRICTLY higher (< integer). On tie (Pr=2 == Pr=2), running P2 finishes at t=7, then P5 runs."
        },
        {
            "q": "Comparing static Rate-Monotonic Scheduling (RMS) and dynamic Earliest-Deadline-First (EDF) for hard real-time tasks (§5.6), which statement is true?",
            "opts": [
                "A) EDF assigns priorities dynamically by nearest deadline and can achieve up to 100% CPU utilization.",
                "B) RMS achieves 100% utilization while EDF caps at 69%.",
                "C) Both RMS and EDF are strictly non-preemptive.",
                "D) RMS ignores task periods completely."
            ],
            "answer": 0,
            "explanation": "Silberschatz §5.6.3–§5.6.4: EDF is theoretically optimal up to 100% CPU utilization, whereas fixed-priority RMS hits a worst-case schedulable utilization bound near ln(2) ~ 69% for large N."
        }
    ],
    "deck_08": [
        {
            "q": "If the Round Robin time quantum q becomes very large (q -> infinity), what scheduling algorithm does RR degenerate into (§5.3.3)?",
            "opts": [
                "A) Shortest Job First (SJF)",
                "B) First-Come, First-Served (FCFS)",
                "C) Preemptive Priority",
                "D) Processor Sharing"
            ],
            "answer": 1,
            "explanation": "If q exceeds all CPU bursts, no timer preemption ever occurs, so every ready process runs to completion in arrival FIFO order—identical to FCFS."
        },
        {
            "q": "What is the standard Silberschatz rule of thumb for sizing the Round Robin time quantum q relative to burst lengths and context switches (§5.3.3)?",
            "opts": [
                "A) Set q smaller than context switch time for maximum fairness.",
                "B) Choose q so roughly 80% of CPU bursts are shorter than q, and q >> context-switch time.",
                "C) Choose q equal to the longest single CPU burst.",
                "D) Choose q so 80% of bursts are preempted twice."
            ],
            "answer": 1,
            "explanation": "Silberschatz §5.3.3: Around 80% of CPU bursts should finish within 1 quantum so interactive tasks don't stall, while keeping q orders of magnitude larger than context switch time."
        },
        {
            "q": "Given AT=0, P1=24ms, P2=3ms, P3=3ms under Round Robin with q = 4 ms, what is the Average Waiting Time (§5.3.3)?",
            "opts": [
                "A) 17.00 ms",
                "B) 5.67 ms",
                "C) 3.00 ms",
                "D) 10.33 ms"
            ],
            "answer": 1,
            "explanation": "Gantt (drawing each q=4 slice): P1(0-4), P2(4-7), P3(7-10), P1(10-14), P1(14-18), P1(18-22), P1(22-26), P1(26-30). WTs: P1=(30-24)=6ms, P2=4ms, P3=7ms -> (6+4+7)/3 = 17/3 = 5.67 ms (Slide 08 truncates to 5.6)!"
        },
        {
            "q": "How does Multilevel Feedback Queue (MLFQ) overcome the main rigidity flaw of standard Multilevel Queue (MLQ) (§5.3.5–§5.3.6)?",
            "opts": [
                "A) MLFQ disables preemption across all queues.",
                "B) MLFQ allows processes to migrate dynamically between queues (demoting CPU hogs and aging starving interactive jobs).",
                "C) MLFQ forces all processes into one single FIFO queue.",
                "D) MLFQ deletes I/O-bound processes from memory."
            ],
            "answer": 1,
            "explanation": "Silberschatz §5.3.6: Unlike static MLQ partitioning, MLFQ demotes processes exceeding their quantum and promotes long-waiting jobs via aging."
        },
        {
            "q": "In SMP multiprocessor scheduling, why does Load Balancing (Push/Pull Migration) conflict directly with Processor Affinity (§5.5)?",
            "opts": [
                "A) Migrating a thread to an idle core loses its warm L1/L2 cache state on the original core.",
                "B) Pull migration locks the OS mode bit to 1.",
                "C) Processor affinity disables virtual memory paging.",
                "D) Load balancing only works on uniprocessors."
            ],
            "answer": 0,
            "explanation": "Silberschatz §5.5.3–§5.5.4: Keeping a thread on its current core preserves cache warmth (Processor Affinity), whereas moving it to another core for Load Balancing invalidates cached lines (and risks remote NUMA access)."
        }
    ],
    "deck_09": [
        {
            "q": "Initially shared count = 5. Producer executes count++ (3 assembly instructions) and Consumer executes count-- (3 assembly instructions) concurrently without locks. Which final values of count are possible (§6.1)?",
            "opts": [
                "A) Only 5",
                "B) 4, 5, or 6",
                "C) 0, 5, or 10",
                "D) Any negative integer"
            ],
            "answer": 1,
            "explanation": "Silberschatz §6.1: Interleaving the LOAD/ADD/STORE and LOAD/SUB/STORE instructions can make Consumer overwrite Producer (count=4), Producer overwrite Consumer (count=6), or run cleanly sequentially (count=5)."
        },
        {
            "q": "In the circular Bounded Buffer (BUFFER_SIZE = 10) from Mock Midterm Q3, why must `while (in == out);` remain inside the Consumer code?",
            "opts": [
                "A) It sorts produced items alphabetically.",
                "B) It busy-waits whenever the buffer is completely empty, preventing reading uninitialized/stale entries.",
                "C) It wraps index `in` around back to index 0.",
                "D) It signals the hardware timer interrupt."
            ],
            "answer": 1,
            "explanation": "Mock Midterm Q3.A: When `in == out`, zero unconsumed items sit in the buffer, so the consumer spins until Producer writes an item and increments `in`."
        },
        {
            "q": "In that same circular Bounded Buffer array of size N, how many items can simultaneously fit before `((in + 1) % N) == out` blocks the Producer (§3.5.1 / §6.1)?",
            "opts": [
                "A) N items",
                "B) N - 1 items",
                "C) N + 1 items",
                "D) N / 2 items"
            ],
            "answer": 1,
            "explanation": "Silberschatz §3.5.1 / §6.1: One slot is intentionally left empty so that Full (`(in + 1) % N == out`) and Empty (`in == out`) remain distinguishable without an extra counter variable."
        },
        {
            "q": "How must the Bounded Buffer code be modified to support an UNBOUNDED buffer (Mock Midterm Q3.C)?",
            "opts": [
                "A) Delete both the producer full-check loop (`while (((in + 1) % BUFFER_SIZE) == out);`) and remove `% BUFFER_SIZE` from index updates.",
                "B) Double BUFFER_SIZE to 20 and add `out = in;`.",
                "C) Delete the consumer's `while (in == out);` loop.",
                "D) Replace `in` and `out` with negative indices."
            ],
            "answer": 0,
            "explanation": "Mock Midterm Q3.C: In an unbounded buffer, capacity is unlimited, so Producer never waits for full space and indices advance linearly (`in++`, `out++`) without modulo wrap-around."
        },
        {
            "q": "Which statement accurately describes Preemptive vs. Non-Preemptive OS kernels regarding race conditions (§6.2)?",
            "opts": [
                "A) Non-preemptive kernels are essentially free from kernel data races on uniprocessors because a kernel-mode process holds CPU until blocking/exiting.",
                "B) Preemptive kernels cannot run on multi-core hardware.",
                "C) Non-preemptive kernels automatically cure user-space race conditions too.",
                "D) Preemptive kernels eliminate the need for mutexes inside the kernel."
            ],
            "answer": 0,
            "explanation": "Silberschatz §6.2: A non-preemptive kernel allows only one process at a time in kernel mode on single-core systems. Preemptive kernels require careful locking on kernel structures (like next_available_pid) for both responsiveness and SMP safety."
        }
    ],
    "deck_10": [
        {
            "q": "Software Attempt 1 uses a shared `turn` variable (`while (turn != i); ... turn = j;`). Which of the 3 Critical-Section requirements does it VIOLATE (§6.2, Mock Midterm Q4.A)?",
            "opts": [
                "A) Mutual Exclusion",
                "B) Progress",
                "C) Register Atomicity",
                "D) Bounded Buffer Wrapping"
            ],
            "answer": 1,
            "explanation": "Strict alternation enforces Mutual Exclusion, but violates Progress: if `turn == 0` and P0 sits indefinitely in its Remainder Section, P1 is forbidden from entering its CS even though the CS is completely empty!"
        },
        {
            "q": "In Peterson's Solution (`flag[i]=true; turn=j; while(flag[j] && turn==j);`), if P0 sets `flag[0]=true` and `turn=1`, then P1 immediately sets `flag[1]=true` and `turn=0`, who enters CS (§6.3, Mock Midterm Q4.B)?",
            "opts": [
                "A) Both enter simultaneously",
                "B) Neither enters (Deadlock)",
                "C) P0 enters; P1 waits",
                "D) P1 enters; P0 waits"
            ],
            "answer": 2,
            "explanation": "The last write wins: `turn` equals 0. For P0, `flag[1] && turn==1` is `true && false` (FALSE -> breaks loop and enters!). For P1, `flag[0] && turn==0` is `true && true` (TRUE -> spins)."
        },
        {
            "q": "Why can Peterson's Solution fail on modern multi-core processors unless explicit Memory Barriers (Fences) are inserted (§6.3–§6.4)?",
            "opts": [
                "A) Processors and compilers may reorder independent memory writes/reads (`turn = j` before `flag[i] = true`), breaking mutual exclusion.",
                "B) `flag[2]` arrays cannot fit in L1 cache.",
                "C) Memory barriers turn spinlocks into counting semaphores.",
                "D) Peterson's algorithm fails even on strictly sequentially consistent hardware."
            ],
            "answer": 0,
            "explanation": "Silberschatz §6.3–§6.4: Out-of-order instruction execution on modern architectures can reorder `flag[i] = true` and `turn = j`, allowing both processes into the critical section simultaneously without memory barriers."
        },
        {
            "q": "Which 3 Critical-Section requirements does the simple `while (TestAndSet(&lock));` algorithm satisfy (§6.4.2)?",
            "opts": [
                "A) All three (Mutual Exclusion, Progress, Bounded Waiting)",
                "B) Mutual Exclusion and Progress ONLY (NOT Bounded Waiting)",
                "C) Progress and Bounded Waiting ONLY",
                "D) None of them"
            ],
            "answer": 1,
            "explanation": "Silberschatz §6.4.2: Naive `while (TestAndSet(&lock));` guarantees Mutual Exclusion and Progress, but NOT Bounded Waiting (a fast thread could re-acquire `lock` repeatedly while another waits forever)."
        },
        {
            "q": "When does a Spinlock (busy-waiting mutex) outperform a blocking sleep/wakeup mutex on a multi-core processor (§6.5)?",
            "opts": [
                "A) When threads hold the lock for several seconds.",
                "B) When the system has only 1 CPU core.",
                "C) When the expected lock-hold duration is shorter than two context switches (no sleep/wakeup switch needed).",
                "D) Whenever processes are CPU-bound inside loops."
            ],
            "answer": 2,
            "explanation": "Silberschatz §6.5: Spinlocks avoid two costly context switches (block + wakeup), making them faster than sleep-locks on multi-core hardware for ultra-short critical sections."
        }
    ],
    "deck_11": [
        {
            "q": "In a non-busy-waiting semaphore (`S->value--; if (S->value < 0) block();`), if S is initialized to 2 and 5 threads call `wait(S)`, what is S->value and what does it mean (§6.6.2)?",
            "opts": [
                "A) S->value = 0; 3 threads busy-waiting",
                "B) S->value = -3; 2 threads permitted past wait(S) and 3 threads asleep on S->list",
                "C) S->value = 2; deadlock triggered",
                "D) S->value = -5; 5 threads asleep"
            ],
            "answer": 1,
            "explanation": "Silberschatz §6.6.2: First 2 threads decrement S to 1 and 0 and proceed. Next 3 decrement S to -1, -2, -3 and block onto S->list. Magnitude |-3| = 3 waiting threads!"
        },
        {
            "q": "Two threads execute crossed semaphore calls: T1 runs `wait(S); wait(Q);` while T2 runs `wait(Q); wait(S);` (with S=1, Q=1). What failure occurs and how is it fixed (Mock Midterm Q5)?",
            "opts": [
                "A) Race condition; fix by converting Q to a spinlock.",
                "B) Deadlock (Circular Wait); fix by enforcing identical lock ordering (`wait(S); wait(Q);` in both threads).",
                "C) Belady's Anomaly; fix by adding 1 frame.",
                "D) Priority Inversion; fix via aging."
            ],
            "answer": 1,
            "explanation": "Mock Midterm Q5: T1 holds S waiting for Q, T2 holds Q waiting for S -> permanent deadlock. Enforcing strict total acquisition order (always S then Q) eliminates circular wait."
        },
        {
            "q": "In the Bounded-Buffer semaphore solution (`mutex=1, empty=N, full=0`), why MUST the Producer call `wait(empty)` BEFORE `wait(mutex)` (§7.1.1)?",
            "opts": [
                "A) Swapping them causes deadlock if the buffer is full (`empty==0`): Producer holds `mutex` and blocks on `empty`, locking out Consumer!",
                "B) Swapping them causes arithmetic overflow in `% N`.",
                "C) `mutex` can only be acquired after `signal(full)`.",
                "D) `wait(empty)` disables interrupts."
            ],
            "answer": 0,
            "explanation": "If Producer locks `mutex` first when `empty == 0`, it sleeps while holding `mutex`. Consumer must call `wait(mutex)` to drain an item and signal `empty`, so both sleep forever!"
        },
        {
            "q": "How does a Monitor's `x.signal()` differ fundamentally from a Semaphore's `signal(S)` when NO thread is currently waiting (§6.7)?",
            "opts": [
                "A) Monitor `x.signal()` increments an internal condition counter by +1.",
                "B) Monitor `x.signal()` has NO effect (the signal is completely lost), whereas Semaphore `signal(S)` increments `S.value` for future callers.",
                "C) Monitor `x.signal()` terminates the calling thread.",
                "D) Semaphore `signal(S)` blocks the caller until `wait(S)` arrives."
            ],
            "answer": 1,
            "explanation": "Silberschatz §6.7.1: Condition variables have no memory! An `x.signal()` with an empty condition queue does nothing, whereas semaphore `signal()` persists state via `S.value++`."
        },
        {
            "q": "In a Priority Inversion scenario (Low-prio L holds lock needed by High-prio H, while Medium-prio M keeps preempting L), what protocol cures it (§6.8.2)?",
            "opts": [
                "A) Priority Inheritance Protocol (L temporarily inherits H's high priority until releasing the lock)",
                "B) Shortest Remaining Time First",
                "C) Monitor Signal-and-Wait",
                "D) Dynamic Loading"
            ],
            "answer": 0,
            "explanation": "Priority Inheritance prevents medium-priority tasks from preempting lock-holder L while high-priority H waits for that lock (famously fixed NASA Mars Pathfinder watchdog resets)."
        }
    ],
    "deck_12": [
        {
            "q": "In the First Readers-Writers solution, which readers execute `wait(rw_mutex)` and `signal(rw_mutex)` respectively (§7.1.2)?",
            "opts": [
                "A) Every individual reader executes `wait(rw_mutex)` and `signal(rw_mutex)`.",
                "B) Only the FIRST active reader (`read_count == 1`) calls `wait(rw_mutex)`, and only the LAST departing reader (`read_count == 0`) calls `signal(rw_mutex)`.",
                "C) Writers call `wait(mutex)` instead of `wait(rw_mutex)`.",
                "D) Readers call `wait(rw_mutex)` only if a writer is already inside."
            ],
            "answer": 1,
            "explanation": "Silberschatz §7.1.2: Subsequent readers simply increment `read_count` and enter concurrently once the 1st reader holds `rw_mutex`; the last reader exiting releases `rw_mutex` for writers."
        },
        {
            "q": "Which group risks Indefinite Blocking (Starvation) under the First vs. Second Readers-Writers solutions (§7.1.2)?",
            "opts": [
                "A) Readers starve in First R-W; Writers starve in Second R-W.",
                "B) Writers starve in First R-W (continuous incoming readers keep `read_count > 0`); Readers starve in Second R-W (writer priority).",
                "C) Both solutions are strictly starvation-free.",
                "D) Only Readers can ever starve."
            ],
            "answer": 1,
            "explanation": "First R-W prioritizes Readers (starving Writers); Second R-W blocks new Readers once a Writer awaits (starving Readers behind continuous Writers)."
        },
        {
            "q": "Why does the naive Dining Philosophers algorithm (`wait(chopstick[i]); wait(chopstick[(i+1)%5]);`) deadlock (§7.1.3)?",
            "opts": [
                "A) Chopsticks are counting semaphores initialized to 5.",
                "B) If all 5 philosophers become hungry simultaneously and each grabs their left chopstick, all 5 block forever waiting for a right chopstick.",
                "C) Only 2 philosophers can think at once.",
                "D) The modulo index `(i + 1) % 5` produces out-of-bounds memory."
            ],
            "answer": 1,
            "explanation": "Silberschatz §7.1.3: All 5 `chopstick[]` semaphores drop to 0 simultaneously, trapping all 5 philosophers in a Circular Wait cycle."
        },
        {
            "q": "Which of the following is NOT one of Silberschatz's 4 deadlock remedies for the 5 Dining Philosophers (§7.1.3)?",
            "opts": [
                "A) Allow at most 4 philosophers to sit at the table simultaneously.",
                "B) Pick up both chopsticks only inside a critical section when both are available.",
                "C) Asymmetric rule: odd-numbered grabs left first, even-numbered grabs right first.",
                "D) Initialize all chopsticks to value 2 instead of 1."
            ],
            "answer": 3,
            "explanation": "Initializing chopsticks to 2 violates physical mutual exclusion (two philosophers would share the same physical chopstick!). The valid textbook solutions are cap=4, atomic pair pickup, asymmetric order, and Monitor."
        },
        {
            "q": "In the Monitor solution (`DiningPhilosophers`), how does `test(i)` guarantee mutual exclusion among adjacent eating philosophers (§7.1.3)?",
            "opts": [
                "A) `state[i]` becomes EATING only if `state[(i+4)%5] != EATING && state[i] == HUNGRY && state[(i+1)%5] != EATING`.",
                "B) Only 1 philosopher can ever enter the room to eat at a time.",
                "C) Philosophers drop chopsticks randomly every 5 ms.",
                "D) It uses busy-wait spinlocks inside `pickup(i)`."
            ],
            "answer": 0,
            "explanation": "Silberschatz §7.1.3: `test(i)` verifies both immediate neighbors `(i+4)%5` and `(i+1)%5` are not `EATING`, permitting non-adjacent philosophers (e.g., P0 and P2) to eat concurrently while remaining deadlock-free!"
        }
    ],
    "deck_13": [
        {
            "q": "Which of the following is NOT one of the four Coffman necessary conditions for Deadlock (§8.3.1)?",
            "opts": [
                "A) Mutual Exclusion",
                "B) Hold and Wait",
                "C) Preemptive Scheduling",
                "D) Circular Wait"
            ],
            "answer": 2,
            "explanation": "The 4 Coffman conditions are: (1) Mutual Exclusion, (2) Hold and Wait, (3) NO Preemption (NOT Preemptive Scheduling!), and (4) Circular Wait."
        },
        {
            "q": "In a Resource-Allocation Graph (RAG) where EVERY resource type has multiple (2+) instances, if the RAG contains a directed cycle, what can you conclude (§8.3.2)?",
            "opts": [
                "A) The system is guaranteed to be deadlocked.",
                "B) A deadlock MAY exist, but is NOT guaranteed (cycle is necessary, not sufficient).",
                "C) No deadlock can exist.",
                "D) All threads immediately starve."
            ],
            "answer": 1,
            "explanation": "Silberschatz §8.3.2: Cycle implies definite deadlock ONLY for single-instance resources. With multiple instances, another thread holding an instance inside the cycle might finish without blocking and break the cycle!"
        },
        {
            "q": "How does a directed edge `R_j -> T_i` differ from `T_i -> R_j` in a Resource-Allocation Graph (§8.3.2)?",
            "opts": [
                "A) `R_j -> T_i` is an Assignment Edge (instance allocated to T_i); `T_i -> R_j` is a Request Edge (T_i waits for R_j).",
                "B) `T_i -> R_j` is an Assignment Edge; `R_j -> T_i` is a Request Edge.",
                "C) Both represent dashed future Claim Edges.",
                "D) `R_j -> T_i` represents Livelock."
            ],
            "answer": 0,
            "explanation": "Request edge points FROM thread TO resource box (`T_i -> R_j`). Assignment edge points FROM an instance dot INSIDE the resource box TO thread (`R_j -> T_i`)."
        },
        {
            "q": "Which Coffman condition is most practically and widely prevented in real OS kernels and multi-lock programs by imposing a strict numerical ordering `F(R)` on locks (§8.5.4)?",
            "opts": [
                "A) Mutual Exclusion",
                "B) Hold and Wait",
                "C) No Preemption",
                "D) Circular Wait"
            ],
            "answer": 3,
            "explanation": "Silberschatz §8.5.4: Imposing total ordering F(R) and requiring processes to request locks strictly in increasing order prevents Circular Wait mathematically (a cycle would force F(R0) < F(R0))."
        },
        {
            "q": "What is the key operational difference between Deadlock and Livelock (§8.2.1)?",
            "opts": [
                "A) In Deadlock, threads are blocked sleeping; in Livelock, threads remain runnable/active repeatedly attempting an action that continuously fails without progressing.",
                "B) Livelock requires Circular Wait while Deadlock never involves locks.",
                "C) Deadlock affects only User Mode while Livelock affects only DMA controllers.",
                "D) They are identical synonyms."
            ],
            "answer": 0,
            "explanation": "Silberschatz §8.2.1: Deadlocked threads block permanently in Waiting state. Livelocked threads stay active (e.g., two people stepping side-to-side identically in a hallway) and are commonly cured with random backoff."
        }
    ],
    "deck_14": [
        {
            "q": "What is the relationship between Safe States, Unsafe States, and Deadlock States in Deadlock Avoidance (§8.6.1)?",
            "opts": [
                "A) Unsafe State is a strict synonym for Deadlock.",
                "B) A Safe State guarantees NO deadlock; an Unsafe State does NOT guarantee deadlock, only that the OS can no longer prevent one if processes request their Max.",
                "C) Deadlock is a strict subset of Safe States.",
                "D) Safe States exist only for single-instance resources."
            ],
            "answer": 1,
            "explanation": "Silberschatz §8.6.1 Fig. 8.8: Deadlock is a subset of Unsafe States! Safe -> never deadlocked. Unsafe -> MIGHT deadlock if processes request full remaining Need."
        },
        {
            "q": "In Banker's Algorithm, how is `Need[i][j]` computed from `Max[i][j]` and `Allocation[i][j]` (§8.6.3)?",
            "opts": [
                "A) Need[i][j] = Max[i][j] + Allocation[i][j]",
                "B) Need[i][j] = Allocation[i][j] - Available[j]",
                "C) Need[i][j] = Max[i][j] - Allocation[i][j]",
                "D) Need[i][j] = Work[j] - Max[i][j]"
            ],
            "answer": 2,
            "explanation": "`Need[i][j] = Max[i][j] - Allocation[i][j]` tracks the maximum remaining instances process i might still ask for."
        },
        {
            "q": "In Silberschatz's classic Banker's snapshot (Available = (3,3,2), Need: P0=(7,4,3), P1=(1,2,2), P2=(6,0,0), P3=(0,1,1), P4=(4,3,1)), which of the following is a valid Safe Sequence?",
            "opts": [
                "A) <P0, P1, P2, P3, P4>",
                "B) <P1, P3, P4, P2, P0>",
                "C) <P4, P3, P2, P1, P0>",
                "D) No safe sequence exists"
            ],
            "answer": 1,
            "explanation": "Work=(3,3,2) satisfies P1(1,2,2) -> Work=(5,3,2) -> P3(0,1,1) -> (7,4,3) -> P4(4,3,1) -> (7,4,5) -> P2(6,0,0) -> (10,4,7) -> P0(7,4,3) -> (10,5,7). Sequence <P1, P3, P4, P2, P0> succeeds!"
        },
        {
            "q": "In the Resource-Request Algorithm, after P1's request (1,0,2) lowers Available to (2,3,0), P0 requests (0,2,0) which yields tentative Available = (2,1,0). Why MUST the Banker DENY P0's request?",
            "opts": [
                "A) (0,2,0) exceeds Max[P0].",
                "B) Although Available >= (0,2,0), the resulting state (2,1,0) leaves NO process able to satisfy its Need -> Unsafe State -> Rollback!",
                "C) Banker's algorithm only grants 1 request per minute.",
                "D) P0 is in its Remainder Section."
            ],
            "answer": 1,
            "explanation": "Silberschatz §8.6.3.3: Even though (0,2,0) <= Available(2,3,0), pretending to grant leaves Work=(2,1,0), which cannot satisfy P1's Need(0,2,0) or P3's Need(0,1,1). Zero safe sequences exist -> unsafe -> roll back!"
        },
        {
            "q": "What is the worst-case time complexity of executing the Banker's Safety Algorithm for `n` threads and `m` resource types (§8.6.3.1)?",
            "opts": [
                "A) O(m + n)",
                "B) O(m * n)",
                "C) O(m * n^2)",
                "D) O(2^n)"
            ],
            "answer": 2,
            "explanation": "Silberschatz §8.6.3.1: Up to n iterations of scanning up to n threads comparing length-m vectors takes O(m * n^2) operations."
        }
    ],
    "deck_15": [
        {
            "q": "How is a Wait-For Graph (WFG) constructed from a single-instance Resource-Allocation Graph (§8.7.1)?",
            "opts": [
                "A) Keep only resource nodes and remove thread nodes.",
                "B) Collapse resource nodes; draw edge Ti -> Tj iff Ti is waiting for a resource currently assigned to Tj.",
                "C) Replace assignment edges with dashed Claim edges.",
                "D) Connect every process to every other process bi-directionally."
            ],
            "answer": 1,
            "explanation": "Silberschatz §8.7.1: Removing resource vertices turns chains `Ti -> Rq -> Tj` into direct wait edges `Ti -> Tj`. Any cycle in the single-instance WFG indicates deadlock."
        },
        {
            "q": "In the Multi-Instance Deadlock Detection Algorithm (§8.7.2), why is `Finish[i]` initialized to `true` when `Allocation[i] == 0` (unlike Banker's Safety where all start `false`)?",
            "opts": [
                "A) Because a thread holding ZERO resources cannot be holding anything another thread is blocked waiting on!",
                "B) Because threads holding zero resources have infinite Max claims.",
                "C) To artificially boost CPU utilization.",
                "D) Because Request[i] is ignored for all processes."
            ],
            "answer": 0,
            "explanation": "Silberschatz §8.7.2: A process with `Allocation[i] == 0` contributes 0 instances back to `Work` and cannot be part of a hold-and-wait deadlock cycle."
        },
        {
            "q": "How does Multi-Instance Deadlock Detection differ in matrix inputs from Banker's Avoidance (§8.7.2)?",
            "opts": [
                "A) Detection uses `Max` and `Need`; Avoidance uses `Request`.",
                "B) Detection uses current `Request[n][m]` instead of future `Max`/`Need` because processes do not declare max claims upfront.",
                "C) Detection ignores `Available` completely.",
                "D) Detection runs in O(1) constant time."
            ],
            "answer": 1,
            "explanation": "In Detection, the OS assumes processes don't declare `Max`, so it checks only currently blocked requests `Request[i] <= Work`."
        },
        {
            "q": "If the Multi-Instance Detection Algorithm terminates with `Finish = [true, false, true, false, false]`, what does this mean (§8.7.2)?",
            "opts": [
                "A) System is Safe with sequence <P0, P2>.",
                "B) System is DEADLOCKED, and specifically processes P1, P3, and P4 are in the deadlock.",
                "C) Only P0 and P2 are deadlocked.",
                "D) All 5 processes must be terminated."
            ],
            "answer": 1,
            "explanation": "Silberschatz §8.7.2: If any `Finish[i] == false` when the algorithm halts, the system is in deadlock and every process with `Finish[i] == false` is deadlocked."
        },
        {
            "q": "When recovering from deadlock via Resource Preemption (§8.8.2), how does an OS prevent the SAME low-cost process from repeatedly being chosen as victim and starving?",
            "opts": [
                "A) Always pick the oldest process regardless of cost.",
                "B) Include the number of times a process has been rolled back as a factor in the victim selection cost function.",
                "C) Convert all locks into non-preemptive mutexes.",
                "D) Reboot the machine automatically after 2 rollbacks."
            ],
            "answer": 1,
            "explanation": "Silberschatz §8.8.2: Adding the count of previous rollbacks to the cost metric ensures repeated victims soon become too 'expensive' to preempt again, guaranteeing finite recovery without starvation."
        }
    ],
    "deck_16": [
        {
            "q": "How do hardware Base and Limit Registers verify every user-mode memory access dynamically (§9.1.1)?",
            "opts": [
                "A) Address <= Base OR Address >= Limit",
                "B) Base <= Address < Base + Limit (any violation traps immediately to the OS)",
                "C) Address = Limit - Base",
                "D) Only Kernel Mode accesses are checked by Base and Limit."
            ],
            "answer": 1,
            "explanation": "Silberschatz §9.1.1: Hardware checks every User Mode physical address against [Base, Base + Limit). Out-of-bounds triggers an addressing error trap to OS."
        },
        {
            "q": "Which Address Binding stage is REQUIRED if the OS wants to relocate a running process dynamically inside RAM during execution (e.g., for Compaction or Swapping) (§9.1.2)?",
            "opts": [
                "A) Compile-Time Binding",
                "B) Load-Time Binding",
                "C) Execution-Time Binding (supported by MMU relocation register)",
                "D) Static Link-Time Binding"
            ],
            "answer": 2,
            "explanation": "Silberschatz §9.1.2: Compile-time (absolute code) and Load-time (fixed at load) forbid moving a process once loaded. Only Execution-Time binding via MMU hardware relocation allows dynamic movement."
        },
        {
            "q": "Memory holes exist in order: 100 KB, 500 KB, 200 KB, 300 KB, 600 KB. Processes arrive in order: P1=212K, P2=417K, P3=112K, P4=426K. Under BEST-FIT, where is P4 placed (Slide 16 / Classic Silberschatz Contiguous Allocation)?",
            "opts": [
                "A) P4 must wait (all holes too small)",
                "B) P4 goes into the 600 KB hole (leaving 174 KB)",
                "C) P4 goes into the 500 KB hole",
                "D) P4 goes into the 300 KB hole"
            ],
            "answer": 1,
            "explanation": "Best-Fit trace: P1(212K)->300K (left 88K); P2(417K)->500K (left 83K); P3(112K)->200K (left 88K); P4(426K)->600K (left 174K). All 4 fit! (Whereas First-Fit and Worst-Fit leave P4 waiting!)"
        },
        {
            "q": "What is the exact difference between External Fragmentation and Internal Fragmentation (§9.2.3)?",
            "opts": [
                "A) External = enough total free memory exists, but split into non-contiguous small holes; Internal = unused space allocated INSIDE a fixed block/partition.",
                "B) External occurs only inside Paging frames; Internal occurs only in Variable Partitions.",
                "C) Internal fragmentation can be fixed by Compaction; External fragmentation cannot.",
                "D) There is no difference; both terms mean 50% RAM loss."
            ],
            "answer": 0,
            "explanation": "Silberschatz §9.2.3: External fragmentation happens between blocks (variable partitions; cured by Compaction or Paging). Internal fragmentation happens wasted inside a fixed-size block/page."
        },
        {
            "q": "According to the statistical 50-Percent Rule for First-Fit contiguous allocation, if N blocks are allocated, roughly how much RAM is lost to fragmentation (§9.2.3)?",
            "opts": [
                "A) 5% (0.05 N blocks)",
                "B) 33% (another 0.5 N blocks unusable out of 1.5 N total)",
                "C) 50% of every individual byte",
                "D) 90% of virtual space"
            ],
            "answer": 1,
            "explanation": "Silberschatz §9.2.3: Given N allocated blocks, ~0.5 N blocks are lost in unusable holes—meaning 0.5 / 1.5 = one-third (33.3%) of memory is unusable!"
        }
    ],
    "deck_17": [
        {
            "q": "A system has a 32-bit logical address space and 4 KB (4,096 B) pages. How many bits are used for Page Number `p` vs. Page Offset `d` (§9.3.1)?",
            "opts": [
                "A) p = 12 bits, d = 20 bits",
                "B) p = 20 bits, d = 12 bits",
                "C) p = 16 bits, d = 16 bits",
                "D) p = 24 bits, d = 8 bits"
            ],
            "answer": 1,
            "explanation": "4 KB = 2^12 bytes -> offset `d` needs n = 12 bits. Remaining high bits = m - n = 32 - 12 = 20 bits for page number `p` (2^20 = 1,048,576 pages)."
        },
        {
            "q": "If Page Size = 1,024 bytes and Page Table maps Page 2 -> Frame 7, what is the Physical Address corresponding to Logical Address 2,500 (§9.3.1)?",
            "opts": [
                "A) 7,620",
                "B) 7,168",
                "C) 2,500",
                "D) 8,192"
            ],
            "answer": 0,
            "explanation": "p = floor(2500 / 1024) = 2; d = 2500 % 1024 = 452. Lookup Page 2 -> Frame f = 7. Physical Address = (7 * 1024) + 452 = 7168 + 452 = 7,620."
        },
        {
            "q": "Assuming TLB lookup = 20 ns, RAM access = 100 ns, and TLB hit ratio alpha = 90% (0.90), what is the Effective Access Time (EAT) (§9.3.2)?",
            "opts": [
                "A) 110 ns",
                "B) 120 ns",
                "C) 130 ns",
                "D) 220 ns"
            ],
            "answer": 2,
            "explanation": "EAT = 0.90*(20 + 100) + 0.10*(20 + 2*100) = 0.90(120) + 0.10(220) = 108 + 22 = 130 ns."
        },
        {
            "q": "Why do Hierarchical (Multi-Level) Page Tables become impractical on 64-bit architectures, making Hashed or Inverted Page Tables preferable (§9.4)?",
            "opts": [
                "A) 64-bit addresses are not powers of 2.",
                "B) Splitting 52 virtual page bits into 10-bit levels requires 5–7 levels of nested page tables, causing up to 7 RAM reads per TLB miss!",
                "C) Hierarchical tables cannot support read/write protection bits.",
                "D) Hierarchical tables cause 50% External Fragmentation."
            ],
            "answer": 1,
            "explanation": "Silberschatz §9.4.1: 64-bit logical space requires 6+ levels of hierarchical translation, making TLB misses painfully slow in RAM hops; Hashed & Inverted tables scale cleanly with sparse or physical memory size."
        },
        {
            "q": "What is the main disadvantage of an Inverted Page Table (1 global table indexed by physical frame `<pid, p>`) compared to standard per-process page tables (§9.4.3)?",
            "opts": [
                "A) It consumes far more RAM as more processes start.",
                "B) Lookup searches take longer (requiring a hash table), and implementing Shared Memory across processes becomes difficult because 1 frame entry maps only 1 `<pid, p>`.",
                "C) It suffers from External Fragmentation.",
                "D) It disables the Valid-Invalid bit."
            ],
            "answer": 1,
            "explanation": "Silberschatz §9.4.3: Inverted page tables save huge amounts of table RAM, but trade off lookup latency (mitigated via hashing) and complicate shared memory mapping where two virtual `<pid, p>` addresses share 1 physical frame."
        }
    ],
    "deck_18": [
        {
            "q": "Suppose RAM access = 200 ns and average page-fault service time = 8 ms (8,000,000 ns). With page-fault rate p = 0.001, what is the Demand Paging Effective Access Time (EAT) (§10.2.3)?",
            "opts": [
                "A) 200 ns",
                "B) 8,199.8 ns (approx 41x slowdown)",
                "C) 800 ns",
                "D) 8,000,200 ns"
            ],
            "answer": 1,
            "explanation": "EAT = (1 - 0.001)*200 + 0.001*(8,000,000) = 199.8 + 8000 = 8,199.8 ns! Even 1 fault per 1,000 accesses slows execution 41-fold."
        },
        {
            "q": "How does Copy-on-Write (CoW) accelerate `fork()` when the child promptly calls `exec()` (§10.3)?",
            "opts": [
                "A) Parent and child share read-only physical frames initially; pages are duplicated ONLY if either process writes to a shared page.",
                "B) It copies all parent RAM onto SSD immediately on `fork()`.",
                "C) It disables page fault traps permanently.",
                "D) It prevents the child from executing `exec()`."
            ],
            "answer": 0,
            "explanation": "Silberschatz §10.3: CoW skips copying unmodified pages completely when `fork()` is quickly followed by `exec()`, copying only individual modified pages on write fault."
        },
        {
            "q": "Using 3 physical frames on `7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1`, how many page faults do Optimal (OPT), LRU, and FIFO incur respectively (§10.4)?",
            "opts": [
                "A) OPT=15, LRU=12, FIFO=9",
                "B) OPT=9, LRU=12, FIFO=15",
                "C) OPT=12, LRU=9, FIFO=15",
                "D) All three produce 12 faults"
            ],
            "answer": 1,
            "explanation": "Classic Silberschatz §10.4 result: Optimal achieves the minimum 9 faults, LRU gets 12 faults, and FIFO suffers 15 faults."
        },
        {
            "q": "Which page replacement algorithms are Stack Algorithms (satisfy the inclusion property `M(k) subseteq M(k+1)`) and therefore CANNOT suffer Belady's Anomaly (§10.4.2–§10.4.4)?",
            "opts": [
                "A) FIFO and Random",
                "B) Optimal (OPT) and Least Recently Used (LRU)",
                "C) FIFO and Second-Chance Clock",
                "D) Second-Chance ONLY"
            ],
            "answer": 1,
            "explanation": "Silberschatz §10.4.4: Both OPT and LRU are stack algorithms—frames held with k frames always form a subset of frames held with k+1 frames, proving Belady's Anomaly impossible for them!"
        },
        {
            "q": "What triggers Thrashing, and how does the Working-Set Model (`WSS_i`, sum D = sum(WSS_i)) cure it (§10.6)?",
            "opts": [
                "A) Thrashing occurs when D > m (active locality demand exceeds total physical frames); fix by suspending one or more processes so remaining processes hold their full Working Sets.",
                "B) Thrashing occurs when CPU utilization hits 100%; fix by increasing multiprogramming degree.",
                "C) Thrashing occurs when internal fragmentation reaches 0%; fix via FIFO replacement.",
                "D) Thrashing happens when disk speed exceeds RAM speed."
            ],
            "answer": 0,
            "explanation": "Silberschatz §10.6.2: When total working-set demand D > available frames m, processes fault constantly and disk paging saturates while CPU utilization collapses. Suspending a process frees frames to restore locality."
        }
    ],
    "deck_19": [
        {
            "q": "For a 7,200 RPM hard disk drive, what is the average Rotational Latency (time for half a platter revolution) (§11.1.1)?",
            "opts": [
                "A) 8.33 ms",
                "B) 4.17 ms",
                "C) 1.00 ms",
                "D) 12.50 ms"
            ],
            "answer": 1,
            "explanation": "7,200 rev/min = 120 rev/sec -> 1 full rotation = 1/120 s = 8.33 ms. Average rotational latency = 1/2 rotation = 4.17 ms."
        },
        {
            "q": "Why do NAND Flash SSDs experience 'Write Amplification' and require a Flash Translation Layer (FTL) with Wear Leveling (§11.1.2)?",
            "opts": [
                "A) Because Flash platters spin faster than HDDs.",
                "B) Because NAND cannot overwrite pages in place—an entire large Erase Block must be erased before rewriting, wearing out finite P/E cells.",
                "C) Because SSDs use magnetic read/write arms.",
                "D) Because SSDs lack DMA support."
            ],
            "answer": 1,
            "explanation": "Silberschatz §11.1.2: NAND writes per page (e.g., 4KB) but erases per large block (~128-512KB), forcing FTL garbage collection to copy valid pages before erasing blocks (Write Amplification) and spread erases evenly (Wear Leveling)."
        },
        {
            "q": "On a 200-cylinder disk (0–199) with head at 53 moving UP toward 199, queue = [98, 183, 37, 122, 14, 124, 65, 67]. What is the TOTAL head movement under C-LOOK (Slide 19 / 9th Ed. §10.4)?",
            "opts": [
                "A) 640 cylinders",
                "B) 382 cylinders",
                "C) 322 cylinders",
                "D) 236 cylinders"
            ],
            "answer": 2,
            "explanation": "C-LOOK services UP: 53 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 (distance 183-53 = 130), jumps directly to lowest request 14 (distance 183-14 = 169), then -> 37 (distance 37-14 = 23). Total = 130 + 169 + 23 = 322 cylinders!"
        },
        {
            "q": "Using that same Silberschatz dataset (Head=53, 0–199, queue=[98,183,37,122,14,124,65,67]), what is the total head movement under FCFS (§11.2.1) vs. SSTF (Slide 19 / 9th Ed. §10.4)?",
            "opts": [
                "A) FCFS = 236, SSTF = 640",
                "B) FCFS = 640, SSTF = 236",
                "C) FCFS = 382, SSTF = 208",
                "D) Both equal 331"
            ],
            "answer": 1,
            "explanation": "FCFS swings back and forth for 640 total cylinders. SSTF greedily picks nearest cylinder (`53->65->67->37->14->98->122->124->183`) for 236 cylinders (at risk of starving edge requests!)."
        },
        {
            "q": "Given N = 6 identical 4 TB disks, compare usable storage capacity and simultaneous drive fault tolerance of RAID 5 vs. RAID 6 vs. RAID 10 (§11.8)?",
            "opts": [
                "A) RAID 5: 20 TB (1 fail); RAID 6: 16 TB (2 fails); RAID 10: 12 TB (1 fail per mirror pair)",
                "B) RAID 5: 24 TB (0 fails); RAID 6: 20 TB (1 fail); RAID 10: 16 TB",
                "C) RAID 5: 12 TB (2 fails); RAID 6: 20 TB (1 fail); RAID 10: 20 TB",
                "D) All three give 16 TB usable capacity."
            ],
            "answer": 0,
            "explanation": "Silberschatz §11.8.3: N=6 disks * 4TB: RAID 5 = (N-1)*4 = 20 TB (1 failure); RAID 6 = (N-2)*4 = 16 TB (2 simultaneous failures); RAID 10 = (N/2)*4 = 12 TB (tolerates up to 1 drive lost in EACH mirror pair)."
        }
    ],
    "deck_20": [
        {
            "q": "Why does the OS kernel maintain BOTH a System-Wide Open-File Table AND a Per-Process Open-File Table (§13.1.2)?",
            "opts": [
                "A) Per-Process stores independent process state (current file-position offset, R/W mode); System-Wide stores shared disk FCB metadata + open_count.",
                "B) Per-Process caches entire 4 GB video files in L1 cache.",
                "C) System-Wide stores only directory names while Per-Process stores free space bitmaps.",
                "D) To disable concurrent file reading."
            ],
            "answer": 0,
            "explanation": "Silberschatz §13.1.2: Two processes reading the same file share one file entry (FCB + open_count) in the System-Wide table while advancing independent read pointers in their own Per-Process entries."
        },
        {
            "q": "Compare Contiguous, Linked, and Indexed Disk Allocation on direct (random) access to block `i` and external fragmentation (§14.4):",
            "opts": [
                "A) Linked gives O(1) random access; Contiguous eliminates external fragmentation.",
                "B) Contiguous & Indexed support O(1) random access; Linked suffers O(N) pointer-chasing random access; Linked & Indexed suffer ZERO external fragmentation.",
                "C) Indexed causes severe external fragmentation.",
                "D) Contiguous is best for dynamically growing append-only logs."
            ],
            "answer": 1,
            "explanation": "Silberschatz §14.4: Contiguous jumps straight to `start + i` (O(1)) but suffers external fragmentation & growth pain. Linked fixes external fragmentation but forces slow O(N) pointer walks for random seeks (improved by FAT caching in RAM). Indexed fixes BOTH!"
        },
        {
            "q": "A UNIX Inode uses 4 KB blocks, 4-byte disk block pointers (1,024 pointers/block), 12 direct pointers, 1 single indirect, 1 double indirect, and 1 triple indirect pointer. Roughly what is the maximum supported file size (§14.4.3)?",
            "opts": [
                "A) ~4 MB",
                "B) ~4 GB",
                "C) ~4 TB (48 KB + 4 MB + 4 GB + 4 TB)",
                "D) ~16 PB"
            ],
            "answer": 2,
            "explanation": "P = 4096/4 = 1024 = 2^10 pointers/block. Direct = 12*4KB = 48KB; Single = 2^10 * 4KB = 4MB; Double = 2^20 * 4KB = 4GB; Triple = 2^30 * 4KB = 4TB! Total ~ 4.004 TB."
        },
        {
            "q": "Using a Free-Space Bit Vector organized into 32-bit words (1=free, 0=used), if words 0 and 1 are all zeros (0x00000000) and word 2's first `1` bit is at bit offset 7, which disk block is free (§14.5.1)?",
            "opts": [
                "A) Block 39",
                "B) Block 69",
                "C) Block 71",
                "D) Block 96"
            ],
            "answer": 2,
            "explanation": "Silberschatz §14.5.1: `Block # = (BitsPerWord * NumberOfAllZeroWords) + Offset = (32 * 2) + 7 = 64 + 7 = 71`!"
        },
        {
            "q": "How do Journaling File Systems (like ext4, NTFS) recover cleanly in seconds after an unexpected power outage compared to legacy `fsck` (§14.7.2)?",
            "opts": [
                "A) They write metadata transactions sequentially to a circular Journal Log first, allowing fast replay of committed transactions on reboot instead of scanning the entire disk.",
                "B) They keep duplicate copies of every user file in CPU registers.",
                "C) They forbid buffering writes in RAM.",
                "D) They store all files contiguously."
            ],
            "answer": 0,
            "explanation": "Silberschatz §14.7.2: Write-ahead metadata journaling ensures crash recovery only replays/aborts tiny recent transactions in the journal log rather than scanning terabytes with `fsck`."
        }
    ],
    "deck_21": [
        {
            "q": "When is Polling (Programmed I/O busy-waiting the Status register) actually MORE efficient than Interrupt-Driven I/O (§12.2.1)?",
            "opts": [
                "A) On slow mechanical printers and keyboards.",
                "B) When the device completes operations so fast (nanoseconds/a few cycles) that waiting takes less CPU time than saving state & servicing an interrupt!",
                "C) Never; polling is strictly forbidden in modern kernels.",
                "D) Only during multi-gigabyte disk transfers."
            ],
            "answer": 1,
            "explanation": "Silberschatz §12.2.1: If a fast SSD/NIC controller becomes ready in fewer cycles than interrupt dispatch + context switch overhead, a brief poll beats interrupt overhead!"
        },
        {
            "q": "In the 6-step DMA transfer sequence, how does the DMA controller move words into RAM while the CPU stays active (§12.2.4)?",
            "opts": [
                "A) Cycle Stealing: DMA temporarily arbitrates the memory bus for bus cycles (CPU keeps computing on registers/L1 cache) and fires only 1 interrupt when byte count reaches 0.",
                "B) CPU executes an `IN` loop for every single byte.",
                "C) DMA freezes all CPU cores completely with a nonmaskable interrupt.",
                "D) DMA copies data exclusively through the L1 instruction cache."
            ],
            "answer": 0,
            "explanation": "Silberschatz §12.2.4: DMA steals occasional memory bus cycles (delaying CPU RAM stalls slightly without interrupting execution) and raises a single completion interrupt per block."
        },
        {
            "q": "What is the key behavioral difference between Nonblocking I/O and Asynchronous I/O system calls (§12.3.4)?",
            "opts": [
                "A) Nonblocking returns immediately with whatever bytes are currently ready (may be 0); Asynchronous returns immediately and notifies the app later AFTER the kernel finishes the entire I/O operation.",
                "B) Nonblocking puts the thread in the Waiting queue until disk spins; Asynchronous blocks forever.",
                "C) Asynchronous works only on keyboards.",
                "D) They are completely identical terms."
            ],
            "answer": 0,
            "explanation": "Silberschatz §12.3.4 Fig 12.9–12.10: Nonblocking transfers what is ready right now and returns; Asynchronous initiates the full transfer in the background, returns immediately, and signals upon completion."
        },
        {
            "q": "What is the crucial textbook distinction between Kernel Caching and Kernel Buffering (§12.4.2–§12.4.3)?",
            "opts": [
                "A) Caching speeds up reads/writes using a copy of data stored elsewhere; Buffering holds data in transit and may hold the ONLY copy of an item!",
                "B) Caching uses magnetic disks while Buffering uses optical drives.",
                "C) Buffering cannot be used for network sockets.",
                "D) Caching causes race conditions while Buffering prevents all deadlocks."
            ],
            "answer": 0,
            "explanation": "Silberschatz §12.4.3: A cache strictly duplicates data whose authoritative copy resides elsewhere; a buffer in transit (e.g., before disk flush or from NIC) may hold the sole existing copy!"
        },
        {
            "q": "Why does an OS use Spooling for devices like laser printers (§12.4.4)?",
            "opts": [
                "A) To increase printer memory bandwidth via DMA cycle stealing.",
                "B) Because printers cannot interleave outputs from multiple processes directly; spooling queues each job cleanly into separate disk files printed sequentially.",
                "C) To map printer registers into User Mode directly.",
                "D) To bypass device drivers."
            ],
            "answer": 1,
            "explanation": "Silberschatz §12.4.4: Spooling virtualizes non-sharable exclusive devices by intercepting each job to a separate disk spool file and feeding the printer one completed job at a time."
        }
    ],
    "deck_22": [
        {
            "q": "How does UNIX `setuid` safely implement Protection Domain Switching when a normal user executes `/usr/bin/passwd` (§17.4)?",
            "opts": [
                "A) It permanently grants the user `root` shell privileges.",
                "B) When `setuid` is set on a root-owned binary, the process temporarily switches effective UID to `root` only while executing that program, then drops privileges on exit.",
                "C) It disables Dual-Mode protection bits globally.",
                "D) It writes the plaintext root password into User RAM."
            ],
            "answer": 1,
            "explanation": "Silberschatz §17.4.2: Domain switching via `setuid` embodies Least Privilege—raising effective domain just long enough to safely edit `/etc/shadow` under controlled code, then reverting."
        },
        {
            "q": "In Lampson's Access Matrix, what does the `control` right in cell `M[D2, D3]` authorize Domain D2 to do (§17.5)?",
            "opts": [
                "A) Add or remove any access rights inside Row D3 (controlling what Domain D3 can access).",
                "B) Read every file in the entire column.",
                "C) Shut down the CPU Mode Bit.",
                "D) Copy rights into Domain D1's column."
            ],
            "answer": 0,
            "explanation": "Silberschatz §17.5: `owner` grants control over an object's COLUMN; `copy (*)` copies a specific right down a COLUMN; `control` applies to a Domain object letting D2 modify ROW D3; `switch` permits execution transition into a domain."
        },
        {
            "q": "Comparing Access Control Lists (ACLs) vs. Capability Lists (C-Lists) for implementing the Access Matrix (§17.6.2–§17.6.3), which trade-off is true?",
            "opts": [
                "A) ACLs are stored per-Domain (row-wise) and make revocation hard; Capabilities are stored per-Object (column-wise).",
                "B) ACLs are stored per-Object (column-wise), making selective revocation instant; Capabilities are unforgeable per-Domain tokens (row-wise), making verification fast but revocation hard!",
                "C) Capabilities eliminate the need for kernel/crypto protection.",
                "D) Both store a huge dense global matrix directly in RAM."
            ],
            "answer": 1,
            "explanation": "Silberschatz §17.6.2–§17.6.3: ACL = column slice per file/object (easy to delete a user's right instantly). Capability = row slice per domain/process (instant check, hard to revoke everywhere once distributed without keys/indirection/expiration)."
        },
        {
            "q": "How do hardware NX/DEP (Non-Executable Stack) and ASLR defend specifically against Stack Buffer Overflow attacks (§16.2.2 / §16.6.7)?",
            "opts": [
                "A) NX marks stack memory non-executable so injected shellcode traps on `RET`; ASLR randomizes stack/library addresses so attackers can't hardcode jump targets!",
                "B) They encrypt network packets with RSA.",
                "C) They disable Dual-Mode interrupts.",
                "D) They force all buffers onto tape storage."
            ],
            "answer": 0,
            "explanation": "Silberschatz §16.2.2 & §16.6.7: Stack overflows overwrite the saved return address to jump into injected buffer bytes. NX/DEP prevents stack execution and ASLR breaks predictable target addresses."
        },
        {
            "q": "Why do real-world secure protocols (TLS, SSH) combine Asymmetric Encryption (RSA/Diffie-Hellman) with Symmetric Encryption (AES) (§16.4)?",
            "opts": [
                "A) Asymmetric crypto solves key distribution and authentication (Digital Signatures) cleanly, then exchanges a fast Symmetric session key for high-speed bulk data!",
                "B) Symmetric encryption cannot decrypt text, only hash it.",
                "C) Asymmetric encryption is 1000x faster than AES on large streams.",
                "D) Combining both eliminates the need for passwords or firewalls."
            ],
            "answer": 0,
            "explanation": "Silberschatz §16.4.1–§16.4.3: Asymmetric algorithms (RSA) are orders of magnitude slower than Symmetric ciphers (AES), so systems use public-key crypto once for handshake/authentication + session key exchange, then stream bulk payload via AES."
        }
    ]
}

FORMULAS_DATA = [
    {
        "name": "Dual-Mode & IVT Hardware Trap",
        "category": "Ch. 1-2 Foundations",
        "formula": "ModeBit = 1 (User / Ring 3) -> Trap / IRQ -> ModeBit = 0 (Kernel / Ring 0); Handler = IVT[Vector_ID]",
        "desc": "CPU checks ModeBit before privileged opcodes (HLT, CLI, PTBR write). System calls trap cleanly via Interrupt Vector Table.",
        "vars": "IVT: Interrupt Vector Table in low RAM, ModeBit: Hardware PSW bit"
    },
    {
        "name": "Process Creation Count (Sequential fork)",
        "category": "Ch. 3 Processes",
        "formula": "Total Processes = 2^n | Newly Spawned Children = 2^n - 1",
        "desc": "Each unconditional sequential fork() doubles all running processes.",
        "vars": "n: Number of unconditional consecutive fork() calls"
    },
    {
        "name": "Amdahl's Law (Parallel Speedup Limit)",
        "category": "Ch. 4 Multithreading",
        "formula": "Speedup <= 1 / [ S + (1 - S) / N ]",
        "desc": "Limits theoretical parallel speedup based on the strictly serial portion of code. As N -> infinity, max Speedup = 1 / S.",
        "vars": "S: Serial fraction (0..1), N: Number of processing cores"
    },
    {
        "name": "CPU Utilization (Multiprogramming Model — Supplemental)",
        "category": "Ch. 3-5 Performance (Supplemental)",
        "formula": "CPU Utilization = 1 - p^n",
        "desc": "Supplemental textbook queueing estimate for fraction of time CPU is busy when n jobs each wait on I/O fraction p of their lifetime.",
        "vars": "p: Fraction of time one process waits for I/O (0..1), n: Degree of multiprogramming"
    },
    {
        "name": "Scheduling Throughput (Slide 04-08 Exam Formula)",
        "category": "Ch. 5 CPU Scheduling",
        "formula": "Throughput = N / (CT_max - AT_min)",
        "desc": "Number of completed processes divided by total active span (from earliest arrival to final completion; Slide 04-08 truncates to 2 decimals).",
        "vars": "N: Process count, CT_max: Latest completion time, AT_min: Earliest arrival time"
    },
    {
        "name": "Turnaround Time (TAT)",
        "category": "Ch. 5 CPU Scheduling",
        "formula": "TAT = CT - AT",
        "desc": "Total interval from process submission (Arrival) until final Completion (includes ready wait, CPU execution, and I/O waits).",
        "vars": "CT: Completion Time, AT: Arrival Time"
    },
    {
        "name": "Waiting Time (WT)",
        "category": "Ch. 5 CPU Scheduling",
        "formula": "WT = TAT - BT = (CT - AT) - BT",
        "desc": "Total time a process spent waiting strictly inside the Ready Queue.",
        "vars": "TAT: Turnaround Time, BT: Total CPU Burst Time"
    },
    {
        "name": "Response Time (RT)",
        "category": "Ch. 5 CPU Scheduling",
        "formula": "RT = First_Start_Time - AT",
        "desc": "Latency until first CPU response. Equals WT only for non-preemptive single-burst schedules; under preemption WT >= RT.",
        "vars": "First_Start_Time: Time first allocated CPU, AT: Arrival Time"
    },
    {
        "name": "Little's Formula (Queueing Law)",
        "category": "Ch. 5 CPU Scheduling",
        "formula": "n = lambda * W",
        "desc": "Steady-state law relating average queue length, process arrival rate, and average wait time.",
        "vars": "n: Avg queue length, lambda: Arrival rate (proc/sec), W: Avg wait time"
    },
    {
        "name": "Exponential Averaging (SJF Burst Prediction)",
        "category": "Ch. 5 CPU Scheduling",
        "formula": "tau_{n+1} = alpha * t_n + (1 - alpha) * tau_n",
        "desc": "Predicts next CPU burst length dynamically; alpha=0 keeps old history, alpha=1 uses only latest burst t_n.",
        "vars": "t_n: Actual n-th burst, tau_n: Previous prediction, 0 <= alpha <= 1"
    },
    {
        "name": "Priority Aging Escalation",
        "category": "Ch. 5 CPU Scheduling",
        "formula": "NewPrio = max(TopPrio, InitialPrio - floor(WaitTime / Interval))",
        "desc": "Gradually lowers priority integer (raising priority) as wait time grows to prevent indefinite Starvation.",
        "vars": "TopPrio: Highest priority (typically 0), WaitTime: Time in ready queue"
    },
    {
        "name": "Circular Bounded Buffer Bounds",
        "category": "Ch. 6 Synchronization",
        "formula": "Empty: in == out | Full: ((in + 1) % BUFFER_SIZE) == out | Max Items = BUFFER_SIZE - 1",
        "desc": "Lock-free ring buffer leaves 1 slot unused so Empty and Full predicates never collide.",
        "vars": "in: Next write slot, out: Next read slot"
    },
    {
        "name": "Non-Busy-Wait Semaphore Invariant",
        "category": "Ch. 6 Synchronization",
        "formula": "If S.value < 0 then Blocked_Threads_Count = |S.value|",
        "desc": "Negative semaphore value directly counts how many PCBs currently sleep on S->list.",
        "vars": "S.value: Signed semaphore counter"
    },
    {
        "name": "Banker's Algorithm Need Matrix & Safety",
        "category": "Ch. 8 Deadlocks",
        "formula": "Need[i][j] = Max[i][j] - Allocation[i][j] | Safe Step: Need[i] <= Work -> Work += Alloc[i]",
        "desc": "Determines remaining potential demand per thread; Safety & Multi-Instance Detection both run in O(m * n^2).",
        "vars": "Max: Declared limit, Allocation: Held instances, Work: Mutable Available vector"
    },
    {
        "name": "Hardware Base & Limit Protection",
        "category": "Ch. 9 Contiguous Memory",
        "formula": "Base <= Physical_Address < Base + Limit | Physical = Logical + Relocation_Reg",
        "desc": "Hardware checks every User Mode access dynamically via MMU relocation and bounds comparators.",
        "vars": "Base: Lowest legal RAM address, Limit: Partition span size"
    },
    {
        "name": "50-Percent Rule (First-Fit Fragmentation)",
        "category": "Ch. 9 Contiguous Memory",
        "formula": "Lost_Blocks ~= 0.5 * N (approx 1/3 of total RAM unusable)",
        "desc": "Statistical external fragmentation loss under variable-partition First-Fit contiguous allocation.",
        "vars": "N: Number of currently allocated memory blocks"
    },
    {
        "name": "Paging Address Translation (Decimal & Binary)",
        "category": "Ch. 9 Paging",
        "formula": "p = floor(Addr / PageSize); d = Addr % PageSize; Phys = (Frame[p] * PageSize) + d",
        "desc": "Binary bit split for 2^m logical space & 2^n page size: upper (m - n) bits = p; lower n bits = offset d; Entries = 2^(m-n).",
        "vars": "p: Page #, d: Offset, m: Logical address bits, n: Offset bits"
    },
    {
        "name": "TLB Effective Access Time (EAT)",
        "category": "Ch. 9 Paging",
        "formula": "EAT = alpha * (TLB + Mem) + (1 - alpha) * (TLB + 2 * Mem)  [or simplified alpha*Mem + (1-alpha)*2*Mem]",
        "desc": "Weighted average memory access delay across associative TLB hits (1 RAM access) and misses (2 RAM accesses); 10th Ed. §9.3.2.1 treats TLB lookup as negligible.",
        "vars": "alpha: TLB hit ratio (0..1), TLB: Associative search time, Mem: Physical RAM latency"
    },
    {
        "name": "Demand Paging Effective Access Time (EAT)",
        "category": "Ch. 10 Virtual Memory",
        "formula": "EAT = (1 - p) * ma + p * Page_Fault_Service_Time",
        "desc": "Shows why fault probability p must be kept extremely small (< 10^-6) since disk fault latency dominates RAM speed by ~40,000x.",
        "vars": "p: Page fault probability (0..1), ma: Memory access time"
    },
    {
        "name": "Proportional Frame Allocation & Working Set",
        "category": "Ch. 10 Virtual Memory",
        "formula": "a_i = (s_i / sum(s_k)) * m | Thrashing Condition: D = sum(WSS_i) > m",
        "desc": "Allocates m physical frames proportionally to virtual sizes s_i; Thrashing erupts whenever aggregate Working-Set demand D exceeds m.",
        "vars": "m: Total free frames, s_i: Process virtual size, WSS_i: Pages touched in delta window"
    },
    {
        "name": "HDD Physical Access Time",
        "category": "Ch. 11 Mass Storage",
        "formula": "Access_Time = Seek_Time + Avg_Rotational_Latency (0.5 / RPS) + (Transfer_Bytes / Transfer_Rate)",
        "desc": "Total I/O positioning + payload time on mechanical magnetic disks; 7200 RPM -> 4.17 ms avg rotational latency.",
        "vars": "RPS: Revolutions per second (RPM / 60)"
    },
    {
        "name": "RAID Usable Capacity & Tolerance (N Disks)",
        "category": "Ch. 11 RAID",
        "formula": "RAID 0: N (0 fail) | RAID 1/10: N/2 | RAID 5: N - 1 (1 fail) | RAID 6: N - 2 (2 fails)",
        "desc": "Usable array size and concurrent drive failure survival across parity/mirrored arrays.",
        "vars": "N: Number of identical capacity disks in the array"
    },
    {
        "name": "UNIX Multi-Level Inode Max File Size",
        "category": "Ch. 14 File Systems",
        "formula": "P = BlockSize / PtrSize; MaxSize = [Direct + P + P^2 + P^3] * BlockSize",
        "desc": "Combines direct pointers plus single, double, and triple indirect blocks for massive file addressing.",
        "vars": "P: Block pointers fitting inside one index block"
    },
    {
        "name": "Free-Space Bit Vector Block Lookup",
        "category": "Ch. 14 File Systems",
        "formula": "Block_Number = (Bits_Per_Word * Full_Zero_Word_Count) + First_1_Bit_Offset",
        "desc": "Translates hardware bit-scan position inside the allocation bitmap directly into a disk block index.",
        "vars": "Bits_Per_Word: CPU word width (32 or 64)"
    },
    {
        "name": "DMA Interrupt Reduction Efficiency",
        "category": "Ch. 12 I/O Systems",
        "formula": "Interrupts_DMA = 1 per Block vs Interrupts_PIO = BlockSize bytes (e.g., 4,096x fewer IRQs)",
        "desc": "Direct Memory Access uses bus cycle stealing to move entire blocks between controller and RAM before signaling completion.",
        "vars": "BlockSize: Transfer unit in bytes (e.g., 4096 B)"
    },
    {
        "name": "Protection Bitmask (UNIX chmod & Access Matrix)",
        "category": "Ch. 17 Protection / Slide 22",
        "formula": "Octal Digit = 4*Read + 2*Write + 1*Execute  (e.g., 761 = rwx rw- --x) | Matrix Lookup: (right in M[D_i, O_j])",
        "desc": "Encodes Owner/Group/World access rights cleanly into 3 octal bits each; Access Matrix splits by column (ACL) or row (Capability List).",
        "vars": "4=R, 2=W, 1=X; M[D_i, O_j]: Allowed operations of domain D_i on object O_j"
    }
]

EXTRA_GLOSSARY_DATA = [
    {"term": "Access Control List (ACL)", "mod": "M17", "def": "A column-wise implementation of the Access Matrix stored with each object listing every domain/user and its allowed rights (supports instant selective revocation)."},
    {"term": "Address Binding", "mod": "M11", "def": "Mapping program symbolic addresses to physical RAM addresses at Compile time (absolute), Load time (relocatable), or Execution time (MMU dynamic relocation)."},
    {"term": "Address-Space Identifier (ASID)", "mod": "M12", "def": "A process tag stored inside each TLB entry preventing unnecessary TLB flushes on context switches while isolating process address translations."},
    {"term": "Amdahl's Law", "mod": "M2", "def": "Formula Speedup <= 1 / (S + (1 - S)/N) proving that the strictly serial portion S of an algorithm caps parallel speedup regardless of core count N."},
    {"term": "Asynchronous I/O", "mod": "M16", "def": "An I/O model where the syscall returns immediately so execution continues, and the kernel notifies the caller only after the entire I/O operation completes."},
    {"term": "Atomic Variable", "mod": "M5", "def": "Hardware-assisted variable (e.g., atomic_t) supporting uninterruptible read-modify-write operations like atomic_inc via Compare-and-Swap without explicit mutexes."},
    {"term": "Bootstrap Program", "mod": "M1", "def": "Initial firmware code (ROM/EEPROM) executed at power-on that initializes hardware controllers and loads the OS kernel into RAM."},
    {"term": "Bounded vs. Unbounded Buffer", "mod": "M4", "def": "IPC producer-consumer models (§3.5.1): Unbounded buffer places no limit on capacity (producer never waits); Bounded buffer fixes capacity so producer also blocks when full."},
    {"term": "Buffering (Double Buffering)", "mod": "M16", "def": "Storing data in transit in RAM to absorb device speed/size mismatches and preserve copy semantics; double buffering fills one buffer via DMA while CPU processes the other."},
    {"term": "C-LOOK", "mod": "M14", "def": "Circular LOOK disk scheduling (Slide 19 / 9th Ed. §10.4): services requests in one direction up to the highest request cylinder, then jumps directly to the lowest request cylinder without touching endpoints 0 or Max."},
    {"term": "C-SCAN", "mod": "M14", "def": "Circular SCAN disk scheduling: sweeps from head to end cylinder (e.g., 199), immediately returns to cylinder 0 without servicing on the return trip, providing uniform wait times."},
    {"term": "Capability List (C-List)", "mod": "M17", "def": "A row-wise Access Matrix implementation stored per protection domain holding unforgeable `<object, rights>` tokens (fast verification, harder selective revocation)."},
    {"term": "Cascading Termination", "mod": "M2", "def": "OS policy (§3.3.2 / Slide 03) where terminating a parent process automatically forces termination of all its children and descendants."},
    {"term": "Character vs. Block Device", "mod": "M16", "def": "Block devices (HDD/SSD) transfer fixed blocks with random seek (`read/write/seek`); Character devices (keyboard/serial) transmit unaddressed byte streams (`get/put`)."},
    {"term": "Client-Server Architecture", "mod": "M1", "def": "Distributed computing model (§1.10.3) separating specialized compute-servers or file-servers that respond to requests generated by client systems."},
    {"term": "Clock Algorithm (Second-Chance)", "mod": "M13", "def": "Circular-queue approximation of LRU using each frame's hardware Reference Bit (`ref=1` gets cleared & spared once; `ref=0` is evicted)."},
    {"term": "Compare-and-Swap (CAS)", "mod": "M5", "def": "Atomic CPU instruction `CompareAndSwap(&val, expected, new)` that updates `*val` only if `*val == expected`, returning the original value."},
    {"term": "Condition Variable", "mod": "M6", "def": "Monitor synchronization queue supporting `x.wait()` (releases monitor & sleeps) and `x.signal()` (wakes 1 waiter; no-op if queue empty)."},
    {"term": "Contiguous Allocation", "mod": "M15", "def": "Storing each file in consecutive disk blocks (`[start, length]`); delivers O(1) random & sequential reads but suffers external fragmentation and growth stiffness."},
    {"term": "Copy-on-Write (CoW)", "mod": "M13", "def": "Virtual memory optimization after `fork()` where parent and child share physical frames read-only until either writes, copying only modified pages."},
    {"term": "Data Parallelism", "mod": "M2", "def": "Distributing partitions of a single dataset across multiple cores where every core applies the identical operation concurrently."},
    {"term": "Dispatch Latency", "mod": "M3", "def": "The elapsed time required for the short-term dispatcher to stop one process, switch context + user mode, and jump to the next process."},
    {"term": "Dynamic Linking (Shared Libraries)", "mod": "M11", "def": "Postponing external library linking until runtime via memory stubs so multiple processes share one read-only RAM copy of libraries like libc/DLLs."},
    {"term": "Earliest-Deadline-First (EDF)", "mod": "M3", "def": "Dynamic-priority real-time scheduler prioritizing whichever task has the earliest upcoming deadline (theoretically achieves up to 100% CPU utilization)."},
    {"term": "exec()", "mod": "M2", "def": "System call (typically called in a forked child) that completely overwrites the calling process's address space with a brand-new binary image."},
    {"term": "Extent", "mod": "M15", "def": "A contiguous chunk of disk blocks; modern file systems (ext4, NTFS) link multiple large extents together to combine contiguous speed with growth flexibility."},
    {"term": "File Control Block (FCB)", "mod": "M15", "def": "Per-file on-disk metadata structure (called an Inode in UNIX) holding permissions, owner, size, timestamps, and pointers to data blocks."},
    {"term": "Flash Translation Layer (FTL)", "mod": "M14", "def": "SSD controller firmware mapping logical block addresses (LBAs) onto physical NAND pages while handling garbage collection, over-provisioning, and wear leveling."},
    {"term": "Hard Link vs. Symbolic Link", "mod": "M15", "def": "Hard links are multiple directory names pointing to the exact same Inode (reference-counted); Symbolic (Soft) links store a text path string that can dangle if target deletes."},
    {"term": "Hashed Page Table", "mod": "M12", "def": "Page table structure for >32-bit sparse address spaces hashing virtual page number `p` into collision-chained buckets (`Clustered` stores 16 pages/entry)."},
    {"term": "Indexed Allocation", "mod": "M15", "def": "Storing all disk block pointers of a file inside a dedicated Index Block (or multi-level index), achieving O(1) random access with zero external fragmentation."},
    {"term": "Inode", "mod": "M15", "def": "UNIX File Control Block storing file metadata plus direct, single-indirect, double-indirect, and triple-indirect block pointers."},
    {"term": "Journaling File System", "mod": "M15", "def": "File system that writes metadata updates first to an append-only transaction Journal Log before applying them on disk, enabling second-scale crash recovery."},
    {"term": "Little's Formula", "mod": "M3", "def": "Queueing theory identity `n = lambda * W` relating average queue occupancy `n`, arrival rate `lambda`, and average waiting time `W`."},
    {"term": "Livelock", "mod": "M8", "def": "Failure state where runnable threads continuously consume CPU retrying conflicting actions (e.g., polite lock-backoff collisions) without making progress."},
    {"term": "Loadable Kernel Module (LKM)", "mod": "M1", "def": "Modern modular OS kernel pattern (Linux/macOS/Windows) inserting drivers and filesystems dynamically at runtime with full monolithic call speed."},
    {"term": "Logical vs. Physical Address", "mod": "M11", "def": "Logical (virtual) addresses are generated by the CPU inside a process's view; Physical addresses are actual hardware addresses sent by the MMU onto the RAM bus."},
    {"term": "Long-Term vs. Medium-Term vs. Short-Term Scheduler", "mod": "M3", "def": "Long-term (job) controls degree of multiprogramming slowly; Medium-term swaps processes in/out to relieve RAM; Short-term (CPU) dispatches a Ready process in milliseconds."},
    {"term": "LOOK", "mod": "M14", "def": "Improved SCAN elevator disk scheduler that reverses head sweep direction as soon as it reaches the final request in the current direction rather than hitting tracks 0 or Max."},
    {"term": "Memory Barrier (Memory Fence)", "mod": "M5", "def": "Hardware instruction forcing all pending memory loads/stores to become globally visible across CPU cores before subsequent instructions execute."},
    {"term": "Memory-Mapped I/O", "mod": "M16", "def": "Assigning device controller registers directly into standard physical RAM address ranges so standard CPU load/store opcodes control I/O devices."},
    {"term": "Microkernel", "mod": "M1", "def": "OS architecture minimizing kernel code in Ring 0 (IPC, basic scheduling/memory) while running file systems and drivers as isolated user-space processes."},
    {"term": "Monitor", "mod": "M6", "def": "High-level compiler synchronization construct encapsulating shared data and procedures such that at most one thread executes inside the monitor at once."},
    {"term": "Monolithic Kernel", "mod": "M1", "def": "Architecture placing all core OS subsystems (scheduler, VFS, drivers, network stack) inside a single privileged Ring 0 address space for fast direct calls."},
    {"term": "Non-Uniform Memory Access (NUMA)", "mod": "M1", "def": "Multiprocessor topology where accessing DRAM attached to a CPU's local socket is significantly faster than accessing remote socket memory across interconnect."},
    {"term": "Orphan Process", "mod": "M2", "def": "A still-running child process whose parent terminated before calling wait(); automatically adopted and later reaped by PID 1 (init / systemd)."},
    {"term": "Page-Fault Frequency (PFF)", "mod": "M13", "def": "Dynamic frame-allocation policy that grants extra frames when a process's page-fault rate exceeds an upper threshold and reclaims frames below a lower threshold."},
    {"term": "Peer-to-Peer (P2P)", "mod": "M1", "def": "Distributed model (§1.10.4) with no client/server split; all nodes act equally as peers (e.g., Gnutella, Skype) discovering services via central lookup or broadcast."},
    {"term": "Polling (Programmed I/O)", "mod": "M16", "def": "Busy-waiting I/O transfer loop where CPU repeatedly inspects a device controller's `busy` status bit (efficient only for ultra-fast nanosecond operations)."},
    {"term": "Priority Inheritance Protocol", "mod": "M6", "def": "Real-time lock protocol temporarily boosting a low-priority lock-holder to match the highest waiting thread's priority until it releases the lock."},
    {"term": "Priority Inversion", "mod": "M6", "def": "Scheduling hazard where a high-priority thread stalls waiting on a lock held by a low-priority thread that keeps getting preempted by medium-priority threads."},
    {"term": "Processor Affinity", "mod": "M3", "def": "Tendency to keep a thread dispatched on the same physical CPU core so its L1/L2 cache lines remain warm (Soft vs. Hard `sched_setaffinity`)."},
    {"term": "Protection Domain", "mod": "M17", "def": "A set of `<object, access-rights>` pairs defining what operations an executing entity may legally perform (switched via CPU Rings or UNIX `setuid`)."},
    {"term": "RAID (0, 1, 5, 6, 10)", "mod": "M14", "def": "Redundant Arrays of Independent Disks balancing speed via striping (0), mirroring redundancy (1), distributed single/dual parity (5/6), and nested stripe-of-mirrors (10)."},
    {"term": "Rate-Monotonic Scheduling (RMS)", "mod": "M3", "def": "Static-priority real-time scheduler prioritizing periodic tasks inversely by period (`priority = 1/p`); optimal among fixed-priority policies."},
    {"term": "Role-Based Access Control (RBAC)", "mod": "M17", "def": "Enterprise access control tying privileges to organizational Roles rather than individual users, simplifying Least Privilege management."},
    {"term": "Salting", "mod": "M17", "def": "Appending a unique random string per user before hashing passwords so identical user passwords produce completely different hashes, defeating Rainbow Tables."},
    {"term": "SCAN (Elevator Algorithm)", "mod": "M14", "def": "Disk head moves back and forth all the way across cylinders `0 <-> Max`, servicing every queued cylinder in its path."},
    {"term": "Spooling", "mod": "M16", "def": "Simultaneous Peripheral Operations On-Line: queuing output for exclusive non-sharable devices (e.g., printers) into separate disk files to prevent interleaved job chaos."},
    {"term": "Stack Algorithm", "mod": "M13", "def": "Class of page replacement policies (including OPT and LRU) guaranteeing pages held with k frames are always a subset of k+1 frames, preventing Belady's Anomaly."},
    {"term": "Starvation (Indefinite Blocking)", "mod": "M3", "def": "Condition where a ready process waits indefinitely because higher-priority or shorter jobs continually run ahead of or preempt it (solved in Priority scheduling via Aging)."},
    {"term": "Swapping", "mod": "M11", "def": "Temporarily moving an entire idle process (or individual pages in modern OSes) between RAM and disk backing store to increase multiprogramming capacity."},
    {"term": "Task Parallelism", "mod": "M2", "def": "Distributing distinct functional threads/operations concurrently across multiple CPU cores operating on shared or independent data."},
    {"term": "Test-and-Set (TAS)", "mod": "M5", "def": "Atomic hardware instruction reading a boolean memory word and unconditionally setting it `true` in a single indivisible cycle."},
    {"term": "Throughput", "mod": "M3", "def": "Number of processes that complete execution per unit time: N / (CT_max - AT_min)."},
    {"term": "Trap vs. Interrupt", "mod": "M1", "def": "Hardware raises asynchronous Interrupts (timer/disk); software generates synchronous Traps/Exceptions either by error (divide-by-zero) or intent (`syscall`)."},
    {"term": "Unified Buffer Cache", "mod": "M15", "def": "Design merging file-system buffer cache with virtual-memory page cache so memory-mapped files and standard `read()`/`write()` never double-cache pages."},
    {"term": "Unsafe State", "mod": "M9", "def": "Resource allocation state where no guaranteed Safe Sequence exists; does NOT imply current deadlock, only that deadlock could occur if processes claim Max."},
    {"term": "Virtual File System (VFS)", "mod": "M15", "def": "Kernel abstraction layer exposing uniform file syscalls (`open/read/write` via `vnode` interfaces) seamlessly over heterogeneous ext4, NTFS, or NFS backends."},
    {"term": "Wait-For Graph (WFG)", "mod": "M10", "def": "Simplified single-instance deadlock-detection graph containing only threads with directed edge `Ti -> Tj` whenever `Ti` awaits a resource held by `Tj`."},
    {"term": "Wear Leveling", "mod": "M14", "def": "SSD FTL technique distributing block erasures evenly across all NAND flash blocks so hot sectors do not burn out hardware prematurely."}
]
