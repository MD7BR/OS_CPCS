/**
 * KERNEL//BREACH - Master Curriculum Dataset
 * 21 CPCS-361 slide decks correlated with Silberschatz 10th Edition.
 * Spatial coordinates arranged in an interconnected Metroidvania Silicon Citadel.
 */

export const SECTORS = [
  {
    id: 'sec_01',
    name: 'Sector 01: Kernel Core',
    hex: '0x0010_0000',
    color: '#00F0FF',
    accent: '#0099AA',
    desc: 'Hardware privilege separation, dual-mode operation, interrupt vectoring, PCB lifecycle and thread multiplexing.',
    bookChapters: 'Ch. 1, 2, 3, 4',
    nodes: ['deck_02', 'deck_03'],
    bounds: { x: 140, y: 300, w: 460, h: 200 }
  },
  {
    id: 'sec_02',
    name: 'Sector 02: Clockwork Dispatcher',
    hex: '0x0020_0000',
    color: '#FFB000',
    accent: '#B27B00',
    desc: 'CPU scheduling algorithms, Gantt time-dilation, burst estimation, preemption, starvation, and multilevel queues.',
    bookChapters: 'Ch. 5',
    nodes: ['deck_04', 'deck_05', 'deck_06', 'deck_07', 'deck_08'],
    bounds: { x: 380, y: 40, w: 660, h: 320 }
  },
  {
    id: 'sec_03',
    name: 'Sector 03: Concurrency Foundry',
    hex: '0x0030_0000',
    color: '#FF6B00',
    accent: '#B24B00',
    desc: 'Race conditions, Peterson’s algorithm, atomic hardware primitives, counting semaphores, and classic synchronization models.',
    bookChapters: 'Ch. 6, 7',
    nodes: ['deck_09', 'deck_10', 'deck_11', 'deck_12'],
    bounds: { x: 660, y: 380, w: 840, h: 180 }
  },
  {
    id: 'sec_04',
    name: 'Sector 04: Deadlock Labyrinth',
    hex: '0x0040_0000',
    color: '#FF2A54',
    accent: '#A01530',
    desc: 'Coffman conditions, Resource-Allocation Graphs, Banker’s safety algorithm, cycle detection, and recovery.',
    bookChapters: 'Ch. 8',
    nodes: ['deck_13', 'deck_14', 'deck_15'],
    bounds: { x: 1100, y: 580, w: 640, h: 180 }
  },
  {
    id: 'sec_05',
    name: 'Sector 05: The Address Matrix',
    hex: '0x0050_0000',
    color: '#A855F7',
    accent: '#6B21A8',
    desc: 'Base/limit MMU, dynamic allocation fragmentation, multi-level paging, TLB translation, and demand virtual memory.',
    bookChapters: 'Ch. 9, 10',
    nodes: ['deck_16', 'deck_17', 'deck_18'],
    bounds: { x: 380, y: 520, w: 220, h: 480 }
  },
  {
    id: 'sec_06',
    name: 'Sector 06: Persistence & I/O Vault',
    hex: '0x0060_0000',
    color: '#00FFA3',
    accent: '#009961',
    desc: 'Magnetic platter kinematics, disk scheduling, file allocation tables (FAT/Inodes), polling, interrupts, and DMA.',
    bookChapters: 'Ch. 11, 12, 13, 14, 15',
    nodes: ['deck_19', 'deck_20', 'deck_21'],
    bounds: { x: 620, y: 720, w: 460, h: 280 }
  },
  {
    id: 'sec_07',
    name: 'Sector 07: Citadel Firewall',
    hex: '0x0070_0000',
    color: '#3B82F6',
    accent: '#1D4ED8',
    desc: 'Protection domains, access matrices, capability lists, privilege escalation mitigation, and cryptographic handshakes.',
    bookChapters: 'Ch. 16, 17',
    nodes: ['deck_22'],
    bounds: { x: 860, y: 520, w: 220, h: 160 }
  }
];

export const CAPABILITIES = {
  RING0_PRIVILEGE: {
    id: 'cap_ring0',
    name: 'Ring-0 Privilege Bit',
    badge: 'RING-0',
    icon: '⚡',
    sector: 'sec_01',
    desc: 'Allows execution of privileged CPU instructions and hardware trap vector manipulation.'
  },
  PCB_SPAWNER: {
    id: 'cap_pcb_spawner',
    name: 'PCB Spawner & Fork',
    badge: 'PCB-FORK',
    icon: '🧬',
    sector: 'sec_01',
    desc: 'Ability to allocate Process Control Blocks, clone address spaces, and spawn concurrent threads.'
  },
  TIMER_INTERRUPT: {
    id: 'cap_timer_interrupt',
    name: 'Hardware Timer Interrupt',
    badge: 'TIMER-IRQ',
    icon: '⏱️',
    sector: 'sec_02',
    desc: 'Generates periodic clock interrupts enabling preemptive context switching (SRTF & Round Robin).'
  },
  AGING_ESCALATOR: {
    id: 'cap_aging_escalator',
    name: 'Aging Escalator Circuit',
    badge: 'AGING-BOOST',
    icon: '📈',
    sector: 'sec_02',
    desc: 'Dynamically escalates waiting processes\' priorities (decrementing priority integer toward 0 under lower=higher convention) to prevent starvation.'
  },
  ATOMIC_CAS: {
    id: 'cap_atomic_cas',
    name: 'Atomic CAS / Bus Lock',
    badge: 'ATOMIC-CAS',
    icon: '🔒',
    sector: 'sec_03',
    desc: 'Hardware-level atomic compare-and-swap instruction to build lock-free synchronization primitives.'
  },
  SEMAPHORE_VALVE: {
    id: 'cap_semaphore_valve',
    name: 'Counting Semaphore Valve',
    badge: 'SEMAPHORE',
    icon: '🚦',
    sector: 'sec_03',
    desc: 'Thread-blocking wait() and signal() semaphore primitive with an internal atomic queue.'
  },
  COFFMAN_BREAKER: {
    id: 'cap_coffman_breaker',
    name: 'Coffman Pillar Breaker',
    badge: 'COFFMAN-X',
    icon: '💥',
    sector: 'sec_04',
    desc: 'Allows programmatic elimination of Hold-and-Wait or Circular Wait conditions.'
  },
  BANKER_SOLVER: {
    id: 'cap_banker_solver',
    name: 'Safety Vector Analyzer',
    badge: 'BANKER-VEC',
    icon: '🧮',
    sector: 'sec_04',
    desc: 'Calculates the Work >= Need safety matrix before granting multi-instance resource claims.'
  },
  MMU_PAGING_WALKER: {
    id: 'cap_mmu_walker',
    name: 'MMU Page Table Walker',
    badge: 'MMU-TLB',
    icon: '🌐',
    sector: 'sec_05',
    desc: 'Hardware bit-splitter converting virtual address (p, d) to physical frame (f, d) with TLB caching.'
  },
  PAGE_FAULT_TRAP: {
    id: 'cap_page_fault',
    name: 'Demand Page Fault Trap',
    badge: 'PAGE-FAULT',
    icon: '🚨',
    sector: 'sec_05',
    desc: 'Traps missing frame references (Invalid bit) to swap requested pages from disk backing store.'
  },
  DMA_CONTROLLER: {
    id: 'cap_dma_controller',
    name: 'DMA Bus Master',
    badge: 'DMA-MASTER',
    icon: '🚀',
    sector: 'sec_06',
    desc: 'Transfers high-throughput data blocks between I/O and RAM with zero CPU cycle consumption.'
  },
  CITADEL_SEAL: {
    id: 'cap_citadel_seal',
    name: 'Kernel Master Architect Seal',
    badge: 'ROOT-SEAL',
    icon: '🛡️',
    sector: 'sec_07',
    desc: 'Full discretionary and role-based access control matrix enforcement.'
  }
};

export const CURRICULUM_NODES = [
  // SECTOR 01: KERNEL CORE
  {
    id: 'deck_02',
    deckNumber: '02',
    slideTitle: '02-CPCS-361-Introduction To OS - Tagged.pdf',
    shortTitle: 'Dual-Mode & Hardware Trap',
    sector: 'sec_01',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 1 & 2',
      sections: '§1.1–§1.10, §2.1–§2.10',
      title: 'Introduction & Operating-System Structures'
    },
    anomaly: {
      title: 'Privileged Port Access Violation',
      brief: 'An unprivileged ring-3 thread attempted OUT 0x3F8, threatening machine stability.'
    },
    unlockedCapability: 'RING0_PRIVILEGE',
    requiredCapabilities: [],
    prerequisites: [],
    mapCoords: { x: 180, y: 350 },
    interactiveType: 'DUAL_MODE_OSCILLOSCOPE',
    summary: 'Hardware dual-mode (User vs. Kernel mode), system calls, interrupts, IVT vectoring, and OS architectures.'
  },
  {
    id: 'deck_03',
    deckNumber: '03',
    slideTitle: '03-CPCS-361-ProcessThreads.pdf',
    shortTitle: 'Processes & Thread Loom',
    sector: 'sec_01',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 3 & 4',
      sections: '§3.1–§3.6, §4.1–§4.3',
      title: 'Processes & Threads and Concurrency'
    },
    anomaly: {
      title: 'Zombie Process Table Saturation',
      brief: 'Child process exited without parent wait(), leaking address space and exhausting PIDs.'
    },
    unlockedCapability: 'PCB_SPAWNER',
    requiredCapabilities: ['RING0_PRIVILEGE'],
    prerequisites: ['deck_02'],
    mapCoords: { x: 420, y: 350 },
    interactiveType: 'PROCESS_LIFECYCLE_REACTOR',
    summary: 'Process concept, 5-state diagram preview (Slide 04 / §3.1.2), PCB, context switch, fork/exec, cascading termination, IPC models, and multithreading.'
  },

  // SECTOR 02: CLOCKWORK DISPATCHER (North Wing)
  {
    id: 'deck_04',
    deckNumber: '04',
    slideTitle: '04-CPCS-361-CPU Scheduling - Introduction-FCFS.pdf',
    shortTitle: 'CPU Sched & FCFS Convoy',
    sector: 'sec_02',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 3 & 5',
      sections: '§3.2, §5.1–§5.3.1, §5.8.2',
      title: 'CPU Scheduling: Basic Concepts & FCFS'
    },
    anomaly: {
      title: 'Convoy Effect Freeze',
      brief: 'A 24ms batch job blocks short 3ms interactive threads, blowing average waiting time to 17ms.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['PCB_SPAWNER'],
    prerequisites: ['deck_03'],
    mapCoords: { x: 420, y: 220 },
    interactiveType: 'FCFS_CONVOY_WIND_TUNNEL',
    summary: 'CPU-I/O burst cycles, preemptive vs non-preemptive concepts, Gantt chart analysis, and FCFS convoy effect.'
  },
  {
    id: 'deck_05',
    deckNumber: '05',
    slideTitle: '05-CPCS-361-CPU Scheduling-SJF.pdf',
    shortTitle: 'SJF & Exponential Smoothing',
    sector: 'sec_02',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 5',
      sections: '§5.3.2',
      title: 'Shortest-Job-First Scheduling & Burst Estimation'
    },
    anomaly: {
      title: 'Future Burst Uncertainty',
      brief: 'CPU cannot read future bursts without exponential smoothing prediction formula.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['PCB_SPAWNER'],
    prerequisites: ['deck_04'],
    mapCoords: { x: 640, y: 220 },
    interactiveType: 'SJF_BURST_PREDICTOR',
    summary: 'Mathematical optimality of SJF for minimal waiting time, and exponential smoothing tau_{n+1} = alpha * t_n + (1-alpha)*tau_n.'
  },
  {
    id: 'deck_06',
    deckNumber: '06',
    slideTitle: '06-CPCS-361-CPU Scheduling-SRTF.pdf',
    shortTitle: 'Preemptive SJF (SRTF)',
    sector: 'sec_02',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 5',
      sections: '§5.3.2',
      title: 'Shortest-Remaining-Time-First'
    },
    anomaly: {
      title: 'Mid-Burst SLA Violation',
      brief: 'Short process arrives at t=3ms during a long burst. Non-preemption causes severe latency.'
    },
    unlockedCapability: 'TIMER_INTERRUPT',
    requiredCapabilities: ['PCB_SPAWNER'],
    prerequisites: ['deck_05'],
    mapCoords: { x: 640, y: 80 },
    interactiveType: 'SRTF_PREEMPTION_SLICER',
    summary: 'Shortest-Remaining-Time-First, dynamic remaining burst calculation, and hardware preemption triggers.'
  },
  {
    id: 'deck_07',
    deckNumber: '07',
    slideTitle: '07-CPCS-361-CPU Scheduling-Priority.pdf',
    shortTitle: 'Priority Sched & Aging',
    sector: 'sec_02',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 5',
      sections: '§5.3.4, §5.6.3–§5.6.4',
      title: 'Priority Scheduling & Indefinite Blocking'
    },
    anomaly: {
      title: 'Low-Priority Starvation Freeze',
      brief: 'Background task stalled indefinitely while higher priority threads stream into the queue.'
    },
    unlockedCapability: 'AGING_ESCALATOR',
    requiredCapabilities: ['TIMER_INTERRUPT'],
    prerequisites: ['deck_06'],
    mapCoords: { x: 860, y: 80 },
    interactiveType: 'PRIORITY_AGING_CHAMBER',
    summary: 'Internal vs external priority numbers, starvation (indefinite blocking), and dynamic aging escalator solutions.'
  },
  {
    id: 'deck_08',
    deckNumber: '08',
    slideTitle: '08-CPCS-361-CPU Scheduling - RR-MLQs.pdf',
    shortTitle: 'Round Robin & MLFQ Cascade',
    sector: 'sec_02',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 5',
      sections: '§5.3.3, §5.3.5–§5.3.6, §5.5',
      title: 'Round-Robin & Multilevel Feedback Queues'
    },
    anomaly: {
      title: 'Context-Switch Thrashing',
      brief: 'Time quantum q tuned too small (q = 1ms, switch = 1ms), burning 50% CPU cycles on registers.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['TIMER_INTERRUPT', 'AGING_ESCALATOR'],
    prerequisites: ['deck_07'],
    mapCoords: { x: 860, y: 220 },
    interactiveType: 'RR_MLFQ_WATERFALL',
    summary: 'Time quantum q sizing, context switch trade-offs, and Multilevel Feedback Queues (MLFQ) with adaptive demotion.'
  },

  // SECTOR 03: CONCURRENCY FOUNDRY (East Wing)
  {
    id: 'deck_09',
    deckNumber: '09',
    slideTitle: '09-CPCS-361-ProcessSynchronization - Introduction.pdf',
    shortTitle: 'Race Condition Collider',
    sector: 'sec_03',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 3 & 6',
      sections: '§3.5.1, §6.1–§6.2',
      title: 'Synchronization Tools: Background & Race Conditions'
    },
    anomaly: {
      title: 'Shared Memory Race Corruption',
      brief: 'Interleaved execution of count++ and count-- corrupted shared state from 5 to 4.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['PCB_SPAWNER', 'TIMER_INTERRUPT'],
    prerequisites: ['deck_03', 'deck_06'],
    mapCoords: { x: 700, y: 430 },
    interactiveType: 'RACE_CONDITION_COLLIDER',
    summary: 'Race conditions at the assembly instruction level (load, add, store), non-atomic concurrent memory mutation.'
  },
  {
    id: 'deck_10',
    deckNumber: '10',
    slideTitle: '10-CPCS-361-CriticalSectionProblem - SW-HW Solution.pdf',
    shortTitle: 'Critical Section Solutions',
    sector: 'sec_03',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 6',
      sections: '§6.2–§6.5',
      title: 'Peterson’s Solution & Hardware Atomic CAS'
    },
    anomaly: {
      title: 'Bounded-Waiting Violation',
      brief: 'A naive lock permits Process 0 to re-enter continuously, starving Process 1 forever.'
    },
    unlockedCapability: 'ATOMIC_CAS',
    requiredCapabilities: ['RING0_PRIVILEGE'],
    prerequisites: ['deck_09'],
    mapCoords: { x: 920, y: 430 },
    interactiveType: 'MUTUAL_EXCLUSION_GATEHOUSE',
    summary: 'Mutual Exclusion, Progress, and Bounded Waiting; Peterson’s software proof for 2 processes; hardware CompareAndSwap.'
  },
  {
    id: 'deck_11',
    deckNumber: '11',
    slideTitle: '11-CPCS-361-CriticalSectionProblem - Semaphore - P-C Problem.pdf',
    shortTitle: 'Semaphores & Producer-Consumer',
    sector: 'sec_03',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 6 & 7',
      sections: '§6.6–§6.8, §7.1.1',
      title: 'Semaphores & Bounded-Buffer Problem'
    },
    anomaly: {
      title: 'Inverted Semaphore Lockup',
      brief: 'Swapping wait(mutex) and wait(empty) locked the producer on a full buffer while holding the critical section.'
    },
    unlockedCapability: 'SEMAPHORE_VALVE',
    requiredCapabilities: ['ATOMIC_CAS'],
    prerequisites: ['deck_10'],
    mapCoords: { x: 1140, y: 430 },
    interactiveType: 'BOUNDED_BUFFER_CONVEYOR',
    summary: 'Counting vs binary semaphores, wait() / signal() implementations, and the Bounded Buffer problem.'
  },
  {
    id: 'deck_12',
    deckNumber: '12',
    slideTitle: '12-CPCS-361-Semaphore - R-W and DP Problem.pdf',
    shortTitle: 'Readers-Writers & Dining Phil',
    sector: 'sec_03',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 7',
      sections: '§7.1.2–7.1.3',
      title: 'Classic Problems of Synchronization'
    },
    anomaly: {
      title: 'Philosopher Circular Chopstick Lock',
      brief: 'All 5 philosophers grabbed their left chopstick at the exact same instant; deadlock achieved.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['SEMAPHORE_VALVE'],
    prerequisites: ['deck_11'],
    mapCoords: { x: 1360, y: 430 },
    interactiveType: 'CHOPSTICK_REACTOR',
    summary: 'Readers-Writers (reader preference vs writer starvation), Dining Philosophers problem, and asymmetric resource acquisition.'
  },

  // SECTOR 04: DEADLOCK LABYRINTH (Far East Wing)
  {
    id: 'deck_13',
    deckNumber: '13',
    slideTitle: '13-CPCS-361-ProcessDeadlocks - Intro - Prevention - Tagged.pdf',
    shortTitle: 'Coffman Conditions & Prevention',
    sector: 'sec_04',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 8',
      sections: '§8.1–8.5',
      title: 'Deadlocks: Characterization & Prevention'
    },
    anomaly: {
      title: '4-Pillar Coffman Gridlock',
      brief: 'Processes holding tape drives and printers have formed an unbreakable cyclic dependency.'
    },
    unlockedCapability: 'COFFMAN_BREAKER',
    requiredCapabilities: ['SEMAPHORE_VALVE'],
    prerequisites: ['deck_11'],
    mapCoords: { x: 1140, y: 630 },
    interactiveType: 'COFFMAN_PILLAR_TESTER',
    summary: 'The 4 Coffman conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) and prevention strategies.'
  },
  {
    id: 'deck_14',
    deckNumber: '14',
    slideTitle: '14-CPCS-361-ProcessDeadlocks - Avoidance.pdf',
    shortTitle: 'Banker’s Algorithm Avoidance',
    sector: 'sec_04',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 8',
      sections: '§8.6',
      title: 'Deadlock Avoidance & The Banker’s Algorithm'
    },
    anomaly: {
      title: 'Unsafe State Transition Danger',
      brief: 'Resource allocation would leave available resources below the max future claim of all processes.'
    },
    unlockedCapability: 'BANKER_SOLVER',
    requiredCapabilities: ['COFFMAN_BREAKER'],
    prerequisites: ['deck_13'],
    mapCoords: { x: 1360, y: 630 },
    interactiveType: 'BANKERS_MATRIX_VAULT',
    summary: 'Safe vs unsafe states, and Dijkstra’s Banker’s Algorithm for multiple instances with Allocation, Max, Available, and Need matrices.'
  },
  {
    id: 'deck_15',
    deckNumber: '15',
    slideTitle: '15-CPCS-361-ProcessDeadlocks - DetectionRecovery.pdf',
    shortTitle: 'Deadlock Detection & Recovery',
    sector: 'sec_04',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 8',
      sections: '§8.7–8.8',
      title: 'Deadlock Detection & Recovery'
    },
    anomaly: {
      title: 'Hidden Wait-For Graph Cycle',
      brief: 'Unnoticed circular wait in background worker threads has frozen enterprise operations.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['BANKER_SOLVER'],
    prerequisites: ['deck_14'],
    mapCoords: { x: 1580, y: 630 },
    interactiveType: 'WAIT_FOR_GRAPH_RADAR',
    summary: 'Wait-For Graph reduction, Tarjan cycle sweeps, and recovery via process abort vs resource rollback.'
  },

  // SECTOR 05: THE ADDRESS MATRIX (South Wing)
  {
    id: 'deck_16',
    deckNumber: '16',
    slideTitle: '16-CPCS-361-MemoryManagement - Contiguous.pdf',
    shortTitle: 'Contiguous MMU & Compaction',
    sector: 'sec_05',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 9',
      sections: '§9.1–§9.2, §9.5',
      title: 'Main Memory: Base/Limit & Contiguous Allocation'
    },
    anomaly: {
      title: 'External Fragmentation Stall',
      brief: '120MB total free RAM, but largest contiguous block is 18MB. A 24MB process cannot load.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['RING0_PRIVILEGE'],
    prerequisites: ['deck_02'],
    mapCoords: { x: 420, y: 560 },
    interactiveType: 'RAM_FRAGMENTATION_ARENA',
    summary: 'Base and limit registers, address binding, variable partitions, First-Fit, Best-Fit, Worst-Fit, and memory compaction.'
  },
  {
    id: 'deck_17',
    deckNumber: '17',
    slideTitle: '17-CPCS-361-MemoryManagement - NonContiguous.pdf',
    shortTitle: 'Paging & TLB Associative Router',
    sector: 'sec_05',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 9',
      sections: '§9.3–§9.4',
      title: 'Paging, TLB & Page Table Structure'
    },
    anomaly: {
      title: 'TLB Miss Latency Spike',
      brief: 'Low TLB hit ratio (12%) forces double memory lookups per instruction, cutting CPU speed 50%.'
    },
    unlockedCapability: 'MMU_PAGING_WALKER',
    requiredCapabilities: ['RING0_PRIVILEGE'],
    prerequisites: ['deck_16'],
    mapCoords: { x: 420, y: 720 },
    interactiveType: 'TLB_PAGING_ROUTER',
    summary: 'Logical address translation (p, d), physical frames, page tables, TLB hits/misses, and Effective Access Time (EAT).'
  },
  {
    id: 'deck_18',
    deckNumber: '18',
    slideTitle: '18-CPCS-361-MemoryManagement - Virtual Memory.pdf',
    shortTitle: 'Virtual Memory & Belady Arena',
    sector: 'sec_05',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 10',
      sections: '§10.1–10.6',
      title: 'Virtual Memory: Demand Paging & Page Replacement'
    },
    anomaly: {
      title: 'Belady’s Anomaly & Thrashing Cliff',
      brief: 'Increasing frames from 3 to 4 under FIFO multiplied page faults; disk I/O saturated.'
    },
    unlockedCapability: 'PAGE_FAULT_TRAP',
    requiredCapabilities: ['MMU_PAGING_WALKER'],
    prerequisites: ['deck_17'],
    mapCoords: { x: 420, y: 880 },
    interactiveType: 'BELADY_PAGE_FAULT_ARENA',
    summary: 'Demand paging, page fault handling, page replacement (FIFO, Optimal, LRU), Belady’s anomaly, and working set thrashing.'
  },

  // SECTOR 06: PERSISTENCE & I/O VAULT (Deep Basement)
  {
    id: 'deck_19',
    deckNumber: '19',
    slideTitle: '19-CPCS-361-MemoryManagement -MassStorage_only.pdf',
    shortTitle: 'Disk Scheduling & Head Kinematics',
    sector: 'sec_06',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 11',
      sections: '§11.1–§11.2, §11.8',
      title: 'Mass-Storage Structure & Disk Scheduling'
    },
    anomaly: {
      title: 'Actuator Head Oscillation Thrash',
      brief: 'FCFS disk scheduling moves the mechanical head back and forth across 200 cylinders.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['PAGE_FAULT_TRAP'],
    prerequisites: ['deck_18'],
    mapCoords: { x: 680, y: 880 },
    interactiveType: 'DISK_ACTUATOR_SIMULATOR',
    summary: 'Magnetic disk kinematics (seek, rotational latency, transfer rate), and disk scheduling: FCFS, SSTF, SCAN, C-SCAN, and LOOK.'
  },
  {
    id: 'deck_20',
    deckNumber: '20',
    slideTitle: '20-CPCS-361-FileManagement - Tagged.pdf',
    shortTitle: 'File System & Inode Block Matrix',
    sector: 'sec_06',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 13, 14 & 15',
      sections: '§13.1–§13.4, §14.1–§14.7, §15.5',
      title: 'File-System Interface & Block Allocation'
    },
    anomaly: {
      title: 'Dangling Block Chain Severance',
      brief: 'Linked allocation lost a pointer on block 42, destroying remaining 80% of database.'
    },
    unlockedCapability: null,
    requiredCapabilities: ['PAGE_FAULT_TRAP'],
    prerequisites: ['deck_19'],
    mapCoords: { x: 920, y: 880 },
    interactiveType: 'FILE_ALLOCATION_MATRIX',
    summary: 'File concept, directory structures (tree, DAG), block allocation (contiguous, linked, FAT, UNIX inodes), and free space management.'
  },
  {
    id: 'deck_21',
    deckNumber: '21',
    slideTitle: '21-CPCS-361-IO Management.pdf',
    shortTitle: 'I/O Subsystems, Interrupts & DMA',
    sector: 'sec_06',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 12',
      sections: '§12.1–12.5',
      title: 'I/O Systems: Polling, Interrupts & DMA'
    },
    anomaly: {
      title: 'CPU Busy-Wait Polling Choke',
      brief: 'CPU is trapped in a tight loop checking a slow serial register, starving user threads.'
    },
    unlockedCapability: 'DMA_CONTROLLER',
    requiredCapabilities: ['RING0_PRIVILEGE'],
    prerequisites: ['deck_20'],
    mapCoords: { x: 920, y: 720 },
    interactiveType: 'DMA_BUS_RACE',
    summary: 'I/O hardware ports, memory-mapped I/O, polling vs interrupts, and Direct Memory Access (DMA) bus master transfer.'
  },

  // SECTOR 07: CITADEL FIREWALL & ROOT ARCHITECT
  {
    id: 'deck_22',
    deckNumber: '22',
    slideTitle: 'Updated2_22-CPCS-361-Security & Privacy.pdf',
    shortTitle: 'Security & Access Matrix Citadel',
    sector: 'sec_07',
    silberschatz: {
      edition: '10th Ed.',
      chapter: 'Chapter 16 & 17',
      sections: '§16.1–§16.6, §17.1–§17.6',
      title: 'Security & Protection: Access Matrix & Principles'
    },
    anomaly: {
      title: 'Privilege Escalation Buffer Overflow',
      brief: 'Corrupted return address on stack hijacked execution flow into root shellcode.'
    },
    unlockedCapability: 'CITADEL_SEAL',
    requiredCapabilities: ['DMA_CONTROLLER', 'BANKER_SOLVER'],
    prerequisites: ['deck_21', 'deck_15'],
    mapCoords: { x: 920, y: 560 },
    interactiveType: 'CITADEL_ACCESS_MATRIX',
    summary: 'Security principles, buffer overflow defense, Access Matrix, ACLs vs Capability Lists, least privilege, and cryptography.'
  }
];
