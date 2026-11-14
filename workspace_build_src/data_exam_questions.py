# build_src/data_exam_questions.py

EXAM_QUESTIONS = [
  {
    "q": "What is the primary difference between Multiprogramming and Multitasking (Time-Sharing)?",
    "opts": [
      {"t": "Multiprogramming maximizes CPU utilization by keeping multiple jobs in memory; Multitasking switches CPU rapidly so users can interact with each job.", "correct": True},
      {"t": "Multiprogramming allows multiple CPUs; Multitasking uses only one CPU.", "correct": False},
      {"t": "Multiprogramming uses virtual memory; Multitasking cannot use virtual memory.", "correct": False},
      {"t": "There is no difference; they are exact synonyms.", "correct": False}
    ],
    "citation": "Slide 02 (p. 75-78) & Mock Midterm Q1.A"
  },
  {
    "q": "During a system call, what are the values of the hardware mode bit in User Mode and Kernel Mode respectively?",
    "opts": [
      {"t": "User Mode = 1, Kernel Mode = 0", "correct": True},
      {"t": "User Mode = 0, Kernel Mode = 1", "correct": False},
      {"t": "User Mode = 2, Kernel Mode = 1", "correct": False},
      {"t": "User Mode = -1, Kernel Mode = 0", "correct": False}
    ],
    "citation": "Slide 02 (p. 88) & Mock Midterm Q2.A (Silberschatz Fig 1.10)"
  },
  {
    "q": "In the Bounded-Buffer Producer-Consumer problem using shared memory, what is the purpose of '(in + 1) % BUFFER_SIZE == out'?",
    "opts": [
      {"t": "To check if the buffer is completely full, forcing the producer to wait.", "correct": True},
      {"t": "To check if the buffer is empty, forcing the consumer to wait.", "correct": False},
      {"t": "To reset the buffer index to zero.", "correct": False},
      {"t": "To increment the mutex lock atomically.", "correct": False}
    ],
    "citation": "Slide 09 (p. 42) & Mock Midterm Q3.A"
  },
  {
    "q": "Consider Critical Section Algorithm 1 (Pi: while(turn != i); CS; turn = j;). Which condition is NOT satisfied?",
    "opts": [
      {"t": "Progress is NOT satisfied because of strict alternation (if Pj is in remainder, Pi cannot re-enter).", "correct": True},
      {"t": "Mutual Exclusion is NOT satisfied.", "correct": False},
      {"t": "Bounded Waiting is NOT satisfied.", "correct": False},
      {"t": "All conditions are fully satisfied.", "correct": False}
    ],
    "citation": "Slide 10 (p. 35) & Mock Midterm Q4.A"
  },
  {
    "q": "In Peterson's solution, why does process Pi execute 'turn = j' immediately after setting 'flag[i] = true'?",
    "opts": [
      {"t": "To grant priority/permission to the other process Pj, avoiding deadlock if both want to enter.", "correct": True},
      {"t": "To immediately enter its own critical section.", "correct": False},
      {"t": "To release the lock after exiting.", "correct": False},
      {"t": "To disable interrupts on multicore hardware.", "correct": False}
    ],
    "citation": "Slide 10 (p. 65) & Mock Midterm Q4.B"
  },
  {
    "q": "Processes P1 (BT=24), P2 (BT=3), P3 (BT=3) arrive at time 0. Under FCFS in order P1, P2, P3, what is the average waiting time?",
    "opts": [
      {"t": "17 ms  (WT: P1=0, P2=24, P3=27 -> (0+24+27)/3 = 17)", "correct": True},
      {"t": "3 ms", "correct": False},
      {"t": "27 ms", "correct": False},
      {"t": "13 ms", "correct": False}
    ],
    "citation": "Slide 04 (p. 32) & Silberschatz §5.3.1"
  },
  {
    "q": "Which CPU scheduling algorithm provably gives the minimum average waiting time for a given set of processes?",
    "opts": [
      {"t": "SJF (Shortest Job First)", "correct": True},
      {"t": "FCFS (First-Come First-Served)", "correct": False},
      {"t": "Round Robin with small quantum", "correct": False},
      {"t": "Priority Scheduling without aging", "correct": False}
    ],
    "citation": "Slide 05 (p. 15) & Silberschatz §5.3.2"
  },
  {
    "q": "What are the four necessary Coffman conditions for a deadlock to occur?",
    "opts": [
      {"t": "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait", "correct": True},
      {"t": "Mutual Exclusion, Progress, Bounded Waiting, Aging", "correct": False},
      {"t": "Paging, Segmentation, Swapping, Compaction", "correct": False},
      {"t": "Semaphore, Mutex, Spinlock, Monitor", "correct": False}
    ],
    "citation": "Slide 13 (p. 18) & Silberschatz §8.3.1"
  },
  {
    "q": "If a Resource Allocation Graph contains a cycle and every resource type has EXACTLY ONE instance, does a deadlock exist?",
    "opts": [
      {"t": "Yes, with single-instance resources, a cycle is necessary AND sufficient for deadlock.", "correct": True},
      {"t": "No, a cycle never implies deadlock.", "correct": False},
      {"t": "Only if there are at least 5 processes.", "correct": False},
      {"t": "It depends on whether Banker's algorithm is running.", "correct": False}
    ],
    "citation": "Slide 13 (p. 45) & Silberschatz §8.3.3"
  },
  {
    "q": "In Banker's Algorithm, what formula calculates the Need matrix?",
    "opts": [
      {"t": "Need[i, j] = Max[i, j] - Allocation[i, j]", "correct": True},
      {"t": "Need[i, j] = Allocation[i, j] + Available[j]", "correct": False},
      {"t": "Need[i, j] = Max[i, j] - Available[j]", "correct": False},
      {"t": "Need[i, j] = Work[j] - Allocation[i, j]", "correct": False}
    ],
    "citation": "Slide 14 (p. 75) & Silberschatz §8.6.3"
  },
  {
    "q": "A system has a page size of 1 KB (1024 bytes). For logical address 3085, what are the Page Number and Offset?",
    "opts": [
      {"t": "Page Number = 3, Offset = 13  (3085 / 1024 = 3, 3085 % 1024 = 13)", "correct": True},
      {"t": "Page Number = 2, Offset = 1037", "correct": False},
      {"t": "Page Number = 3, Offset = 85", "correct": False},
      {"t": "Page Number = 4, Offset = 13", "correct": False}
    ],
    "citation": "Slide 17 (p. 128, Sample Question 02)"
  },
  {
    "q": "In contiguous memory allocation, which strategy allocates the smallest hole that is big enough?",
    "opts": [
      {"t": "Best-Fit", "correct": True},
      {"t": "First-Fit", "correct": False},
      {"t": "Worst-Fit", "correct": False},
      {"t": "Quick-Fit", "correct": False}
    ],
    "citation": "Slide 16 (p. 38) & Silberschatz §9.2.2"
  },
  {
    "q": "What is Belady's Anomaly in Virtual Memory page replacement?",
    "opts": [
      {"t": "Page fault rate increases even when more physical frames are allocated (occurs in FIFO).", "correct": True},
      {"t": "Page fault rate decreases to zero under LRU.", "correct": False},
      {"t": "The CPU enters thrashing when page size is doubled.", "correct": False},
      {"t": "Optimal page replacement causes more faults than FIFO.", "correct": False}
    ],
    "citation": "Slide 18 (p. 25) & Silberschatz §10.4.1"
  },
  {
    "q": "In disk scheduling, what is the main advantage of C-SCAN over standard SCAN?",
    "opts": [
      {"t": "Provides a more uniform and fair waiting time across all cylinders.", "correct": True},
      {"t": "Services requests on both forward and backward passes.", "correct": False},
      {"t": "Guarantees zero seek time.", "correct": False},
      {"t": "Eliminates rotational latency completely.", "correct": False}
    ],
    "citation": "Slide 19 (p. 10) & Silberschatz §11.2.4"
  },
  {
    "q": "In an Access Matrix model, what does an asterisk (*) attached to an access right (e.g. read*) signify?",
    "opts": [
      {"t": "Copy right: the process can copy that right to other domains.", "correct": True},
      {"t": "Owner right: the process can delete the object.", "correct": False},
      {"t": "Control right: the process can modify the domain.", "correct": False},
      {"t": "Wildcard right: grants all permissions.", "correct": False}
    ],
    "citation": "Slide 22 (p. 25) & Silberschatz §17.5.2"
  }
]
