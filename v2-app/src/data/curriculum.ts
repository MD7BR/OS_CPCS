export interface SectorDef {
  id: string;
  name: string;
  shortName: string;
  hex: string;
  color: string;
  bookChapters: string;
  examScope: 'midterm' | 'final';
  nodes: string[];
  bounds: { x: number; y: number; w: number; h: number };
}

export interface CapabilityDef {
  id: string;
  name: string;
  badge: string;
  icon: string;
  desc: string;
}

export interface CurriculumNode {
  id: string;
  deckNumber: string;
  sector: string;
  shortTitle: string;
  slideTitle: string;
  silberschatz: {
    chapter: string;
    sections: string;
    title: string;
  };
  summary: string;
  anomaly: {
    title: string;
    brief: string;
  };
  unlockedCapability: string | null;
  requiredCapabilities: string[];
  prerequisites: string[];
  mapCoords: { x: number; y: number };
}

export interface KernelRank {
  level: number;
  minXp: number;
  short: string;
  title: string;
}

export interface MockExamQuestion {
  id: string;
  number: string;
  points: number;
  topic: string;
  parts: {
    label: string;
    promptHtml: string;
    answerHtml: string;
  }[];
}

export const SECTORS: SectorDef[] = [
  { id: 'sec_01', name: 'Sector 01: Kernel Core', shortName: 'S1 · Kernel Core', hex: '0x0010_0000', color: '#00F0FF', bookChapters: 'Ch. 1, 2, 3, 4', examScope: 'midterm', nodes: ['deck_02', 'deck_03'], bounds: { x: 60, y: 416, w: 492, h: 204 } },
  { id: 'sec_02', name: 'Sector 02: Clockwork Dispatcher', shortName: 'S2 · CPU Sched', hex: '0x0020_0000', color: '#FFB800', bookChapters: 'Ch. 5', examScope: 'midterm', nodes: ['deck_04', 'deck_05', 'deck_06', 'deck_07', 'deck_08'], bounds: { x: 624, y: 36, w: 772, h: 332 } },
  { id: 'sec_03', name: 'Sector 03: Concurrency Foundry', shortName: 'S3 · Sync', hex: '0x0030_0000', color: '#FF6B00', bookChapters: 'Ch. 6, 7', examScope: 'midterm', nodes: ['deck_09', 'deck_10', 'deck_11', 'deck_12'], bounds: { x: 624, y: 416, w: 1026, h: 204 } },
  { id: 'sec_04', name: 'Sector 04: Deadlock Labyrinth', shortName: 'S4 · Deadlocks', hex: '0x0040_0000', color: '#FF2A6D', bookChapters: 'Ch. 8', examScope: 'final', nodes: ['deck_13', 'deck_14', 'deck_15'], bounds: { x: 1132, y: 696, w: 772, h: 204 } },
  { id: 'sec_05', name: 'Sector 05: The Address Matrix', shortName: 'S5 · Memory', hex: '0x0050_0000', color: '#A855F7', bookChapters: 'Ch. 9, 10', examScope: 'final', nodes: ['deck_16', 'deck_17', 'deck_18'], bounds: { x: 60, y: 696, w: 380, h: 528 } },
  { id: 'sec_06', name: 'Sector 06: Persistence & I/O Vault', shortName: 'S6 · Storage/IO', hex: '0x0060_0000', color: '#00FFA3', bookChapters: 'Ch. 11, 12, 13, 14', examScope: 'final', nodes: ['deck_19', 'deck_20', 'deck_21'], bounds: { x: 624, y: 1020, w: 772, h: 204 } },
  { id: 'sec_07', name: 'Sector 07: Citadel Firewall', shortName: 'S7 · Security', hex: '0x0070_0000', color: '#38BDF8', bookChapters: 'Ch. 16, 17', examScope: 'final', nodes: ['deck_22'], bounds: { x: 624, y: 696, w: 432, h: 204 } },
];

export const CAPABILITIES: Record<string, CapabilityDef> = {
  ring_0: { id: 'ring_0', name: 'Ring-0 Privilege', badge: 'RING-0', icon: '⚡', desc: 'Hardware mode-bit control; unlocks privileged kernel traps.' },
  pcb_fork: { id: 'pcb_fork', name: 'PCB Splitter', badge: 'PCB-FORK', icon: '🧬', desc: 'Process tree synthesis and context-switch control.' },
  timer_irq: { id: 'timer_irq', name: 'Timer Interrupt', badge: 'TIMER-IRQ', icon: '⏱️', desc: 'Preemptive quantum interrupts for SRTF and Round Robin.' },
  aging_boost: { id: 'aging_boost', name: 'Aging Vector', badge: 'AGING-BOOST', icon: '📈', desc: 'Dynamic priority escalation to prevent starvation.' },
  atomic_cas: { id: 'atomic_cas', name: 'Atomic CAS', badge: 'ATOMIC-CAS', icon: '🔒', desc: 'Hardware Compare-And-Swap and Peterson synchronization.' },
  semaphore: { id: 'semaphore', name: 'Semaphore Token', badge: 'SEMAPHORE', icon: '🚦', desc: 'Counting semaphore keys to unlock mutual exclusion locks.' },
  rag_analyzer: { id: 'rag_analyzer', name: 'RAG Cycle Scanner', badge: 'RAG-SCAN', icon: '🕸️', desc: 'Cycle detection in resource allocation graphs.' },
  banker_vec: { id: 'banker_vec', name: 'Banker Safety Matrix', badge: 'BANKER-VEC', icon: '🏦', desc: 'Dynamic safe-sequence verification for resource allocation.' },
  mmu_tlb: { id: 'mmu_tlb', name: 'TLB Associative Cache', badge: 'MMU-TLB', icon: '🔍', desc: 'Paging address translation cache.' },
  page_fault: { id: 'page_fault', name: 'Page Fault Handler', badge: 'PAGE-FAULT', icon: '📄', desc: 'Demand paging and LRU/FIFO replacement.' },
  dma_master: { id: 'dma_master', name: 'DMA Controller', badge: 'DMA-MASTER', icon: '🚀', desc: 'High-speed block I/O bypass.' },
  root_seal: { id: 'root_seal', name: 'Citadel Root Seal', badge: 'ROOT-SEAL', icon: '🛡️', desc: 'Full access matrix verification.' },
};

export const CURRICULUM_NODES: CurriculumNode[] = [
  { id: 'deck_02', deckNumber: '02', sector: 'sec_01', shortTitle: 'Dual-Mode & Hardware Traps', slideTitle: '02-CPCS-361-Introduction To OS - Tagged.pdf', silberschatz: { chapter: 'Chapter 1 & 2', sections: '§1.1–§1.10, §2.1–§2.10', title: 'Introduction & OS Structures' }, summary: 'Dual-mode execution, mode bit 1 vs 0, interrupt vectoring, system call categories, and OS structures.', anomaly: { title: 'PRIVILEGED TRAP EXCEPTION', brief: 'User mode attempted direct CPU halt. Mode bit = 1 trapped to IVT vector 0x80.' }, unlockedCapability: 'ring_0', requiredCapabilities: [], prerequisites: [], mapCoords: { x: 86, y: 494 } },
  { id: 'deck_03', deckNumber: '03', sector: 'sec_01', shortTitle: 'Processes & Thread Loom', slideTitle: '03-CPCS-361-ProcessThreads.pdf', silberschatz: { chapter: 'Chapter 3 & 4', sections: '§3.1–§3.6, §4.1–§4.3', title: 'Processes & Threads' }, summary: 'Process concept, 5-state diagram preview (Slide 04 / §3.1.2), PCB, context switch, fork/exec, cascading termination, IPC models, and multithreading.', anomaly: { title: 'ZOMBIE CASCADE HAZARD', brief: 'Child process terminated without parent wait() call, leaking PCB table slots.' }, unlockedCapability: 'pcb_fork', requiredCapabilities: ['ring_0'], prerequisites: ['deck_02'], mapCoords: { x: 322, y: 494 } },
  { id: 'deck_04', deckNumber: '04', sector: 'sec_02', shortTitle: 'CPU Sched & FCFS Convoy', slideTitle: '04-CPCS-361-CPU Scheduling - Introduction-FCFS.pdf', silberschatz: { chapter: 'Chapter 3 & 5', sections: '§3.2, §5.1–§5.3.1, §5.8.2', title: 'CPU Scheduling & FCFS' }, summary: 'Burst cycle alternation, non-preemptive FCFS queue, Gantt charts, and convoy effect latency.', anomaly: { title: 'CONVOY EFFECT FREEZE', brief: 'A 24ms batch job blocks short 3ms interactive threads, blowing average waiting time to 17ms.' }, unlockedCapability: null, requiredCapabilities: ['pcb_fork'], prerequisites: ['deck_03'], mapCoords: { x: 654, y: 242 } },
  { id: 'deck_05', deckNumber: '05', sector: 'sec_02', shortTitle: 'SJF & Exponential Smoothing', slideTitle: '05-CPCS-361-CPU Scheduling-SJF.pdf', silberschatz: { chapter: 'Chapter 5', sections: '§5.3.2', title: 'Shortest Job First' }, summary: 'Non-preemptive SJF optimality proof and exponential averaging burst prediction.', anomaly: { title: 'BURST PREDICTION SKEW', brief: 'CPU burst estimation variance causing scheduling mispredictions.' }, unlockedCapability: null, requiredCapabilities: ['pcb_fork'], prerequisites: ['deck_04'], mapCoords: { x: 908, y: 242 } },
  { id: 'deck_06', deckNumber: '06', sector: 'sec_02', shortTitle: 'Preemptive SJF (SRTF)', slideTitle: '06-CPCS-361-CPU Scheduling-SRTF.pdf', silberschatz: { chapter: 'Chapter 5', sections: '§5.3.2', title: 'Shortest Remaining Time First' }, summary: 'Preemptive SJF, arrival-tick preemption evaluations, and remaining burst tracking.', anomaly: { title: 'PREEMPTION THRASHING', brief: 'Continuous arrival of shorter tasks causing frequent context-switching.' }, unlockedCapability: 'timer_irq', requiredCapabilities: ['pcb_fork'], prerequisites: ['deck_05'], mapCoords: { x: 908, y: 108 } },
  { id: 'deck_07', deckNumber: '07', sector: 'sec_02', shortTitle: 'Priority Sched & Aging', slideTitle: '07-CPCS-361-CPU Scheduling-Priority.pdf', silberschatz: { chapter: 'Chapter 5', sections: '§5.3.4, §5.6.3–§5.6.4', title: 'Priority Scheduling & Starvation' }, summary: 'Priority scheduling, lower integer = higher priority rule, starvation, and aging escalation.', anomaly: { title: 'INDEFINITE STARVATION', brief: 'Low-priority threads blocked indefinitely by stream of high-priority jobs.' }, unlockedCapability: 'aging_boost', requiredCapabilities: ['timer_irq'], prerequisites: ['deck_06'], mapCoords: { x: 1162, y: 108 } },
  { id: 'deck_08', deckNumber: '08', sector: 'sec_02', shortTitle: 'Round Robin & MLQ Queues', slideTitle: '08-CPCS-361-CPU Scheduling - RR-MLQs.pdf', silberschatz: { chapter: 'Chapter 5', sections: '§5.3.3, §5.3.5–§5.3.6, §5.5', title: 'Round Robin & MLQs' }, summary: 'Circular ready queue, time quantum trade-offs, 80% rule, MLQ bands, and MLFQ parameters.', anomaly: { title: 'QUANTUM SKEW OVERHEAD', brief: 'Excessively small time quantum causing context-switch overhead to destroy throughput.' }, unlockedCapability: null, requiredCapabilities: ['timer_irq'], prerequisites: ['deck_07'], mapCoords: { x: 1162, y: 242 } },
  { id: 'deck_09', deckNumber: '09', sector: 'sec_03', shortTitle: 'Race Condition Collider', slideTitle: '09-CPCS-361-ProcessSynchronization - Introduction.pdf', silberschatz: { chapter: 'Chapter 3 & 6', sections: '§3.5.1, §6.1–§6.2', title: 'Synchronization Background' }, summary: 'Cooperating processes, race conditions, count++ assembly disassembly, and bounded buffer.', anomaly: { title: 'RACE CORRUPTION HAZARD', brief: 'Unsynchronized register interleaving corrupted shared count variable to 4 instead of 5.' }, unlockedCapability: null, requiredCapabilities: ['pcb_fork'], prerequisites: ['deck_03'], mapCoords: { x: 654, y: 494 } },
  { id: 'deck_10', deckNumber: '10', sector: 'sec_03', shortTitle: 'Critical Section Solutions', slideTitle: '10-CPCS-361-CriticalSectionProblem - SW-HW Solution.pdf', silberschatz: { chapter: 'Chapter 6', sections: '§6.2–§6.5', title: 'Critical-Section Solutions' }, summary: 'Mutual exclusion, progress, bounded waiting, Peterson 2-process solution, TestAndSet, and spinlocks.', anomaly: { title: 'STRICT ALTERNATION LOCK', brief: 'Software Attempt 1 turn variable violated Progress due to remainder section freeze.' }, unlockedCapability: 'atomic_cas', requiredCapabilities: ['pcb_fork'], prerequisites: ['deck_09'], mapCoords: { x: 908, y: 494 } },
  { id: 'deck_11', deckNumber: '11', sector: 'sec_03', shortTitle: 'Semaphores & Producer-Consumer', slideTitle: '11-CPCS-361-CriticalSectionProblem - Semaphore - P-C Problem.pdf', silberschatz: { chapter: 'Chapter 6 & 7', sections: '§6.6–§6.8, §7.1.1', title: 'Semaphores & Classical Sync' }, summary: 'Atomic wait/signal, counting vs binary semaphores, blocked queues, and bounded-buffer wiring.', anomaly: { title: 'SEMAPHORE DEADLOCK TRAP', brief: 'Inverted wait calls caused mutual deadlock between concurrent producer and consumer.' }, unlockedCapability: 'semaphore', requiredCapabilities: ['atomic_cas'], prerequisites: ['deck_10'], mapCoords: { x: 1162, y: 494 } },
  { id: 'deck_12', deckNumber: '12', sector: 'sec_03', shortTitle: 'Readers-Writers & Dining Phil', slideTitle: '12-CPCS-361-Semaphore - R-W and DP Problem.pdf', silberschatz: { chapter: 'Chapter 7', sections: '§7.1.2–§7.1.3', title: 'Classic Sync Problems' }, summary: 'First Readers-Writers problem, writer starvation, dining philosophers deadlock, and asymmetric solution.', anomaly: { title: 'PHILOSOPHER CIRCULAR WAIT', brief: 'All 5 philosophers grabbed left chopstick simultaneously, causing fatal circular wait.' }, unlockedCapability: null, requiredCapabilities: ['semaphore'], prerequisites: ['deck_11'], mapCoords: { x: 1416, y: 494 } },
  { id: 'deck_13', deckNumber: '13', sector: 'sec_04', shortTitle: 'Coffman Conditions & Prevention', slideTitle: '13-CPCS-361-ProcessDeadlocks - Intro - Prevention - Tagged.pdf', silberschatz: { chapter: 'Chapter 8', sections: '§8.1–§8.5', title: 'Deadlocks & Prevention' }, summary: '4 Coffman conditions, Resource-Allocation Graphs (RAG), and prevention protocols.', anomaly: { title: 'RAG CYCLE DETECTED', brief: 'Closed cycle in single-instance resource graph guaranteed system deadlock.' }, unlockedCapability: 'rag_analyzer', requiredCapabilities: ['semaphore'], prerequisites: ['deck_11'], mapCoords: { x: 1162, y: 774 } },
  { id: 'deck_14', deckNumber: '14', sector: 'sec_04', shortTitle: "Banker's Algorithm Avoidance", slideTitle: '14-CPCS-361-ProcessDeadlocks - Avoidance.pdf', silberschatz: { chapter: 'Chapter 8', sections: '§8.6', title: 'Deadlock Avoidance' }, summary: "Safe vs unsafe states, Available/Max/Allocation/Need matrices, and Banker's safety test.", anomaly: { title: 'UNSAFE STATE BREACH', brief: 'Requested allocation would transition system to unsafe state; request denied.' }, unlockedCapability: 'banker_vec', requiredCapabilities: ['rag_analyzer'], prerequisites: ['deck_13'], mapCoords: { x: 1416, y: 774 } },
  { id: 'deck_15', deckNumber: '15', sector: 'sec_04', shortTitle: 'Deadlock Detection & Recovery', slideTitle: '15-CPCS-361-ProcessDeadlocks - DetectionRecovery.pdf', silberschatz: { chapter: 'Chapter 8', sections: '§8.7–§8.8', title: 'Detection & Recovery' }, summary: 'Wait-for graphs, cycle detection, process termination, resource preemption, and rollback.', anomaly: { title: 'DEADLOCK CYCLE COLLISION', brief: 'Wait-For graph cycle confirmed; selecting victim process for rollback.' }, unlockedCapability: null, requiredCapabilities: ['banker_vec'], prerequisites: ['deck_14'], mapCoords: { x: 1670, y: 774 } },
  { id: 'deck_16', deckNumber: '16', sector: 'sec_05', shortTitle: 'Contiguous MMU & Compaction', slideTitle: '16-CPCS-361-MemoryManagement - Contiguous.pdf', silberschatz: { chapter: 'Chapter 9', sections: '§9.1–§9.2, §9.5', title: 'Main Memory: Contiguous' }, summary: 'Base/limit registers, dynamic relocation, First-Fit/Best-Fit/Worst-Fit, fragmentation, and compaction.', anomaly: { title: 'EXTERNAL FRAGMENTATION', brief: 'Free holes total 120KB but largest contiguous block is only 20KB; allocation failed.' }, unlockedCapability: null, requiredCapabilities: ['ring_0'], prerequisites: ['deck_02'], mapCoords: { x: 86, y: 774 } },
  { id: 'deck_17', deckNumber: '17', sector: 'sec_05', shortTitle: 'Paging & TLB Associativity', slideTitle: '17-CPCS-361-MemoryManagement - NonContiguous.pdf', silberschatz: { chapter: 'Chapter 9', sections: '§9.3–§9.4', title: 'Paging & Address Translation' }, summary: 'Page tables, frame translation, TLB associative cache, hit ratio, and Effective Access Time (EAT).', anomaly: { title: 'TLB MISS CASCADE', brief: 'Low TLB hit ratio doubled memory access latency to read multi-level page tables.' }, unlockedCapability: 'mmu_tlb', requiredCapabilities: ['ring_0'], prerequisites: ['deck_16'], mapCoords: { x: 86, y: 936 } },
  { id: 'deck_18', deckNumber: '18', sector: 'sec_05', shortTitle: "Virtual Memory & Belady's Trap", slideTitle: '18-CPCS-361-MemoryManagement - Virtual Memory.pdf', silberschatz: { chapter: 'Chapter 10', sections: '§10.1–§10.6', title: 'Virtual Memory & Replacement' }, summary: "Demand paging, page fault sequence, FIFO, Belady's anomaly, LRU, OPT, and thrashing.", anomaly: { title: 'BELADY ANOMALY', brief: 'Allocating 4 frames instead of 3 increased FIFO page faults from 9 to 10.' }, unlockedCapability: 'page_fault', requiredCapabilities: ['mmu_tlb'], prerequisites: ['deck_17'], mapCoords: { x: 86, y: 1098 } },
  { id: 'deck_19', deckNumber: '19', sector: 'sec_06', shortTitle: 'Disk Scheduling & Head Seek', slideTitle: '19-CPCS-361-MemoryManagement -MassStorage_only.pdf', silberschatz: { chapter: 'Chapter 11', sections: '§11.1–§11.2, §11.8', title: 'Mass Storage & Disks' }, summary: 'Magnetic platters, seek time, rotational latency, FCFS, SSTF, SCAN, and C-SCAN.', anomaly: { title: 'SSTF STARVATION DETECTED', brief: 'Outlying disk cylinder request starved by continuous cluster of local reads.' }, unlockedCapability: null, requiredCapabilities: ['page_fault'], prerequisites: ['deck_18'], mapCoords: { x: 654, y: 1098 } },
  { id: 'deck_20', deckNumber: '20', sector: 'sec_06', shortTitle: 'File System & Inode Blocks', slideTitle: '20-CPCS-361-FileManagement - Tagged.pdf', silberschatz: { chapter: 'Chapter 13, 14 & 15', sections: '§13.1–§13.4, §14.1–§14.7, §15.5', title: 'File System Implementation' }, summary: 'File concepts, sequential/direct access, contiguous/linked/indexed allocation, and inodes.', anomaly: { title: 'LINKED SEEK BOTTLENECK', brief: 'Random access to block 500 required 500 disk seeks through linked pointer chain.' }, unlockedCapability: null, requiredCapabilities: ['page_fault'], prerequisites: ['deck_19'], mapCoords: { x: 908, y: 1098 } },
  { id: 'deck_21', deckNumber: '21', sector: 'sec_06', shortTitle: 'I/O Subsystems, Interrupts & DMA', slideTitle: '21-CPCS-361-IO Management.pdf', silberschatz: { chapter: 'Chapter 12', sections: '§12.1–§12.5', title: 'I/O Hardware & Subsystems' }, summary: 'Polling vs interrupts vs DMA, device-status table, buffering, caching, and spooling.', anomaly: { title: 'POLLING CPU SATURATION', brief: 'CPU pinned at 100% busy-waiting on slow serial port controller.' }, unlockedCapability: 'dma_master', requiredCapabilities: ['page_fault'], prerequisites: ['deck_20'], mapCoords: { x: 1162, y: 1098 } },
  { id: 'deck_22', deckNumber: '22', sector: 'sec_07', shortTitle: 'Security & Access Matrix Firewall', slideTitle: 'Updated2_22-CPCS-361-Security & Privacy.pdf', silberschatz: { chapter: 'Chapter 16 & 17', sections: '§16.1–§16.6, §17.1–§17.6', title: 'Security & Protection' }, summary: 'Access matrix model, domains, objects, access rights, ACLs, and capability lists.', anomaly: { title: 'ACCESS MATRIX VIOLATION', brief: 'Domain 2 attempted unauthorized write to protected system file Object 4.' }, unlockedCapability: 'root_seal', requiredCapabilities: ['dma_master'], prerequisites: ['deck_16'], mapCoords: { x: 738, y: 774 } },
];

export const KERNEL_RANKS: KernelRank[] = [
  { level: 1, minXp: 0, short: 'RING 3', title: 'Ring 3: User Process' },
  { level: 2, minXp: 150, short: 'SYSCALL', title: 'Syscall Trapper' },
  { level: 3, minXp: 350, short: 'DISPATCHER', title: 'Interrupt Dispatcher' },
  { level: 4, minXp: 650, short: 'SCHEDULER', title: 'Scheduler Architect' },
  { level: 5, minXp: 1050, short: 'MUTEX', title: 'Mutex Enforcer' },
  { level: 6, minXp: 1550, short: 'WARDEN', title: 'Deadlock Warden' },
  { level: 7, minXp: 2200, short: 'MMU ARCH', title: 'MMU Page Master' },
  { level: 8, minXp: 3000, short: 'RING 0 ROOT', title: 'Ring 0: Kernel Root' },
];

export const MOCK_EXAM_QUESTIONS: MockExamQuestion[] = [
  {
    id: 'q1',
    number: 'QUESTION 1',
    points: 4,
    topic: 'CONCEPT COMPARISONS',
    parts: [
      {
        label: 'A. Multiprogramming vs. Multitasking (Time-Sharing) (2 Points)',
        promptHtml: 'Give two fundamental differences between multiprogramming and multitasking.',
        answerHtml:
          '<strong>Difference 1: Objective.</strong> Multiprogramming maximizes CPU utilization by keeping multiple jobs in memory; Multitasking minimizes response time so interactive users can interact with programs concurrently.<br/><strong>Difference 2: Switching Trigger.</strong> Multiprogramming switches only when the active job waits for I/O; Multitasking switches frequently via a hardware timer interrupt even if the process is computing.',
      },
      {
        label: 'B. Shared Memory vs. Message Passing (IPC Models) (2 Points)',
        promptHtml: 'Give two fundamental differences between Shared Memory and Message Passing.',
        answerHtml:
          '<strong>Difference 1: Kernel Involvement.</strong> Shared memory requires kernel involvement only once to establish the mapping, then transfers occur at memory bus speed; Message passing requires kernel system calls for every message exchange.<br/><strong>Difference 2: Network Applicability.</strong> Message passing works naturally across distributed network nodes; Shared memory is difficult to implement across different machines without distributed hardware.',
      },
    ],
  },
  {
    id: 'q2',
    number: 'QUESTION 2',
    points: 5,
    topic: 'DUAL-MODE & PARALLELISM',
    parts: [
      {
        label: 'A. Mode Transition Trace (3 Points)',
        promptHtml: 'During a system call, what are the 6 steps and mode bit values?',
        answerHtml:
          '1. User process executing in User Mode (Mode bit = 1).<br/>2. Executes system call trap instruction.<br/>3. Hardware flips Mode bit to 0 (Kernel Mode).<br/>4. CPU indexes into Interrupt Vector Table (IVT) to locate system call handler.<br/>5. Kernel executes privileged service routine in Ring 0.<br/>6. Return-from-trap instruction restores Mode bit to 1 and resumes user program.',
      },
      {
        label: 'B & C. Parallelism in Array Addition (2 Points)',
        promptHtml:
          'A program adds 5 to every element of an array of 1,000 numbers by splitting it into 4 parts of 250 across 4 cores. Which type of parallelism is this? Justify.',
        answerHtml:
          '<strong>Answer: Data Parallelism.</strong><br/><em>Justification:</em> The identical arithmetic operation (+5) is applied concurrently across multiple sub-partitions of the same dataset. (Task parallelism would involve executing different functions on each core).',
      },
    ],
  },
  {
    id: 'q3',
    number: 'QUESTION 3',
    points: 5,
    topic: 'BOUNDED BUFFER TRACE',
    parts: [
      {
        label: 'Ring Buffer Pointer Logic (5 Points)',
        promptHtml:
          'Explain the exact purpose of:<br/>1. <code>while (in == out);</code> in the consumer process.<br/>2. <code>% BUFFER_SIZE</code> in <code>out = (out + 1) % BUFFER_SIZE;</code>',
        answerHtml:
          '1. <code>while (in == out);</code> blocks (busy-waits) the consumer when the buffer is completely empty, preventing it from consuming uninitialized or already-consumed memory.<br/>2. <code>% BUFFER_SIZE</code> implements a circular ring buffer, wrapping the index back to 0 when it exceeds array boundaries and reusing empty slots.',
      },
    ],
  },
  {
    id: 'q4',
    number: 'QUESTION 4',
    points: 5,
    topic: 'CRITICAL SECTION & PETERSON',
    parts: [
      {
        label: 'A. Software Attempt 1 (turn variable) (5 Points)',
        promptHtml:
          'Is Mutual Exclusion, Progress, and Bounded Waiting satisfied under sequential processing?',
        answerHtml:
          '• <strong>Mutual Exclusion: Satisfied.</strong> Only one process can match turn at a time.<br/>• <strong>Progress: NOT SATISFIED!</strong> Enforces strict alternation. If P1 is in remainder section, P0 cannot enter twice.<br/>• <strong>Bounded Waiting: NOT SATISFIED!</strong> P0 waits indefinitely for P1.',
      },
    ],
  },
  {
    id: 'q5',
    number: 'QUESTION 5',
    points: 3,
    topic: 'SEMAPHORE DEADLOCK',
    parts: [
      {
        label: 'Inverted Semaphore Acquisition (3 Points)',
        promptHtml:
          'Threads T1 and T2 share semaphores S=1 and Q=1. T1 executes <code>wait(S); wait(Q);</code> while T2 executes <code>wait(Q); wait(S);</code>.<br/>Why is output "Nothing is printed" possible? What is this problem called?',
        answerHtml:
          '<strong>Problem: Deadlock (Circular Wait).</strong><br/>T1 executes <code>wait(S)</code> (S=0). Context switch occurs. T2 executes <code>wait(Q)</code> (Q=0). Now T1 blocks waiting for Q, and T2 blocks waiting for S. Neither can proceed.<br/><strong>Fix:</strong> Enforce strict resource acquisition ordering: both threads must call <code>wait(S)</code> before <code>wait(Q)</code>.',
      },
    ],
  },
  {
    id: 'q6',
    number: 'QUESTION 6',
    points: 8,
    topic: 'CPU SCHEDULING TABLE & GANTT',
    parts: [
      {
        label: 'Preemptive Priority Gantt & Metrics (8 Points)',
        promptHtml:
          'Processes P1(0, 6, P=3), P2(1, 4, P=2), P3(3, 2, P=1), P4(4, 4, P=4), P5(6, 3, P=2). (1 = Highest Priority). Preemptive Priority.<br/>Find Completion Time, TAT, WT, and Average Waiting Time.',
        answerHtml:
          '<strong>Gantt Chart:</strong> | P1 (0–1) | P2 (1–3) | P3 (3–5) | P2 (5–7) | P5 (7–10) | P1 (10–15) | P4 (15–19) |<br/>• P1: CT=15, TAT=15−0=15, WT=15−6=<strong>9 ms</strong><br/>• P2: CT=7, TAT=7−1=6, WT=6−4=<strong>2 ms</strong><br/>• P3: CT=5, TAT=5−3=2, WT=2−2=<strong>0 ms</strong><br/>• P4: CT=19, TAT=19−4=15, WT=15−4=<strong>11 ms</strong><br/>• P5: CT=10, TAT=10−6=4, WT=4−3=<strong>1 ms</strong><br/><strong>Average Waiting Time = (9 + 2 + 0 + 11 + 1) / 5 = 23 / 5 = 4.6 ms</strong>.',
      },
    ],
  },
];

export function getRankInfo(xp: number) {
  let cur = KERNEL_RANKS[0];
  let next: KernelRank | null = KERNEL_RANKS[1];
  for (let i = 0; i < KERNEL_RANKS.length; i++) {
    if (xp >= KERNEL_RANKS[i].minXp) {
      cur = KERNEL_RANKS[i];
      next = KERNEL_RANKS[i + 1] || null;
    }
  }
  const span = next ? next.minXp - cur.minXp : 1;
  const pct = next ? Math.min(100, Math.round(((xp - cur.minXp) / span) * 100)) : 100;
  return { ...cur, nextMin: next ? next.minXp : cur.minXp, pct };
}

export function getComboMultiplier(streak: number) {
  if (streak >= 5) return 2.0;
  if (streak >= 3) return 1.5;
  if (streak >= 2) return 1.25;
  return 1.0;
}
