# build_src/data_formulas.py

FORMULA_LIST = [
  {
    "name": "Turnaround Time (TAT)",
    "category": "CPU Scheduling",
    "formula": "TAT = CT - AT",
    "desc": "Total time taken from process arrival to complete execution.",
    "vars": "CT: Completion Time, AT: Arrival Time"
  },
  {
    "name": "Waiting Time (WT)",
    "category": "CPU Scheduling",
    "formula": "WT = TAT - BT",
    "desc": "Total time spent by a process sitting in the ready queue waiting for CPU.",
    "vars": "TAT: Turnaround Time, BT: CPU Burst Time"
  },
  {
    "name": "Exponential Averaging (SJF Burst Prediction)",
    "category": "CPU Scheduling",
    "formula": "&tau;<sub>n+1</sub> = &alpha; &middot; t<sub>n</sub> + (1 - &alpha;) &middot; &tau;<sub>n</sub>",
    "desc": "Predicts next CPU burst length using historical burst history.",
    "vars": "t<sub>n</sub>: actual burst, &tau;<sub>n</sub>: previous prediction, &alpha;: weight (0 &le; &alpha; &le; 1)"
  },
  {
    "name": "Banker's Algorithm Need Matrix",
    "category": "Deadlocks",
    "formula": "Need[i, j] = Max[i, j] - Allocation[i, j]",
    "desc": "Remaining resource requirements for process i of resource type j.",
    "vars": "Max: maximum declared need, Allocation: currently held resources"
  },
  {
    "name": "Paging Logical to Physical Address (Decimal)",
    "category": "Memory Management",
    "formula": "p = &lfloor;LA / PageSize&rfloor; &nbsp;|&nbsp; d = LA mod PageSize &nbsp;|&nbsp; PA = (Frame &times; PageSize) + d",
    "desc": "Decimal address translation formula used extensively in OS paging practice exams.",
    "vars": "LA: Logical Address, p: Page Number, d: Offset, PA: Physical Address"
  },
  {
    "name": "Paging Address Bit Allocation (Binary)",
    "category": "Memory Management",
    "formula": "d = n bits &nbsp;|&nbsp; p = m - n bits &nbsp;|&nbsp; PA = f + n bits",
    "desc": "Binary splitting for m-bit address with page size 2<sup>n</sup> and 2<sup>f</sup> frames.",
    "vars": "m: total LA bits, n: offset bits, f: frame index bits"
  },
  {
    "name": "TLB Effective Access Time (EAT)",
    "category": "Memory Management",
    "formula": "EAT = h &middot; (t<sub>TLB</sub> + t<sub>RAM</sub>) + (1 - h) &middot; (t<sub>TLB</sub> + 2 &middot; t<sub>RAM</sub>)",
    "desc": "Calculates average memory latency considering TLB cache hit ratio h.",
    "vars": "h: hit ratio, t<sub>TLB</sub>: TLB lookup latency, t<sub>RAM</sub>: physical memory access latency"
  },
  {
    "name": "Demand Paging EAT",
    "category": "Virtual Memory",
    "formula": "EAT = (1 - p) &middot; ma + p &middot; (Page Fault Service Time)",
    "desc": "Effective access time with page fault rate p (must be very low, e.g. < 0.001%).",
    "vars": "p: page fault probability, ma: normal memory access time"
  },
  {
    "name": "Disk Head Movement (Seek Distance)",
    "category": "Mass Storage",
    "formula": "Total Head Movement = &sum; |Cylinder<sub>i</sub> - Cylinder<sub>i-1</sub>|",
    "desc": "Sum of absolute differences between consecutive serviced cylinders.",
    "vars": "Cylinder<sub>i</sub>: sequence of visited disk tracks"
  },
  {
    "name": "Process Creation with fork()",
    "category": "Processes",
    "formula": "Total Processes = 2<sup>n</sup> &nbsp;|&nbsp; Child Processes = 2<sup>n</sup> - 1",
    "desc": "Number of processes generated after n consecutive fork() system calls.",
    "vars": "n: number of fork() calls"
  }
]
