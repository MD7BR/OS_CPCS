# build_src/modules_m11_m17.py

M11_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M11</span>
  <h1 class="module-title">Memory Management: Contiguous Allocation</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 16-MemoryManagement - Contiguous (59 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 9 (§9.1–§9.2)</div>
    <div class="meta-chip">🎯 Exam Priority: HIGH</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Understand the stages of <strong>Address Binding</strong> (Compile time, Load time, Execution time).</li>
    <li>Differentiate between <strong>Logical (Virtual) Address</strong> and <strong>Physical Address</strong> and the role of the <strong>MMU</strong>.</li>
    <li>Distinguish between <strong>Base Register (Relocation Register)</strong> and <strong>Limit Register</strong>.</li>
    <li>Compare partition allocation strategies: <strong>First-Fit</strong>, <strong>Best-Fit</strong>, and <strong>Worst-Fit</strong>.</li>
    <li>Differentiate between <strong>Internal Fragmentation</strong> and <strong>External Fragmentation</strong>.</li>
    <li>Explain <strong>Compaction</strong> and why it is possible only with dynamic relocation.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Base & Limit Registers: Hardware Protection</h2>
  <p>To ensure that a user process accesses only memory addresses within its allocated partition, the CPU hardware provides two special registers:</p>
  <ul style="padding-left:20px; margin-bottom:14px;">
    <li><strong>Base Register (Relocation Register):</strong> Contains the smallest legal physical memory address of the process.</li>
    <li><strong>Limit Register:</strong> Specifies the size of the logical range (e.g., if base = 300040 and limit = 120900, program can legally access addresses from 300040 to 420940).</li>
  </ul>

  <div class="figure-container">
    <svg viewBox="0 0 600 200" style="width:100%; max-width:580px;">
      <!-- CPU -->
      <rect x="20" y="70" width="80" height="50" rx="4" fill="var(--primary)" />
      <text x="60" y="100" fill="#fff" font-weight="bold" font-size="12" text-anchor="middle">CPU (LA)</text>

      <!-- Comparator < Limit -->
      <path d="M 100 95 L 170 95" stroke="var(--primary)" stroke-width="2" marker-end="url(#arrow)"/>
      <polygon points="200,75 230,95 200,115 170,95" fill="var(--bg-card)" stroke="var(--warning)" stroke-width="2"/>
      <text x="200" y="99" fill="var(--warning)" font-size="12" font-weight="bold" text-anchor="middle">&lt; Limit?</text>

      <!-- Limit Register -->
      <rect x="160" y="20" width="80" height="30" rx="4" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="200" y="40" fill="var(--text-main)" font-size="11" text-anchor="middle">Limit Reg</text>
      <line x1="200" y1="50" x2="200" y2="75" stroke="var(--border)" stroke-width="2"/>

      <!-- Adder + Base -->
      <path d="M 230 95 L 310 95" stroke="var(--success)" stroke-width="2" marker-end="url(#arrow)"/>
      <circle cx="330" cy="95" r="20" fill="var(--bg-card)" stroke="var(--success)" stroke-width="2"/>
      <text x="330" y="101" fill="var(--success)" font-size="18" font-weight="bold" text-anchor="middle">+</text>

      <!-- Base Register -->
      <rect x="290" y="20" width="80" height="30" rx="4" fill="var(--bg-card)" stroke="var(--border)"/>
      <text x="330" y="40" fill="var(--text-main)" font-size="11" text-anchor="middle">Base Reg</text>
      <line x1="330" y1="50" x2="330" y2="75" stroke="var(--border)" stroke-width="2"/>

      <!-- RAM -->
      <path d="M 350 95 L 430 95" stroke="var(--success)" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="440" y="40" width="120" height="110" rx="6" fill="var(--bg-sidebar)" stroke="var(--primary)" stroke-width="2"/>
      <text x="500" y="70" fill="var(--primary)" font-weight="bold" font-size="12" text-anchor="middle">Physical</text>
      <text x="500" y="90" fill="var(--primary)" font-weight="bold" font-size="12" text-anchor="middle">Memory (RAM)</text>
      <text x="500" y="125" fill="var(--text-dim)" font-size="10" text-anchor="middle">Base + LA</text>
    </svg>
    <div class="figure-caption">Figure M11.1 — Hardware Address Protection with Base and Limit Registers (Silberschatz Fig. 9.2)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Partition Allocation Strategies & Fragmentation (Widget W13)</h2>
  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W13: Memory Allocation Simulator (Slide 16 Example)</div>
      <div class="sim-controls">
        <button class="btn btn-sm btn-primary" onclick="W13_MemoryAlloc.run('first')">First-Fit</button>
        <button class="btn btn-sm" onclick="W13_MemoryAlloc.run('best')">Best-Fit</button>
        <button class="btn btn-sm" onclick="W13_MemoryAlloc.run('worst')">Worst-Fit</button>
        <button class="btn btn-sm" onclick="W13_MemoryAlloc.reset()">Reset</button>
      </div>
    </div>
    <div class="sim-body">
      <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:12px;">
        Partitions: <strong>100 KB, 500 KB, 200 KB, 300 KB, 600 KB</strong> | 
        Incoming Processes: <strong>P1 (212 KB), P2 (417 KB), P3 (112 KB), P4 (426 KB)</strong>
      </p>
      <div class="sim-canvas" id="w13-canvas"></div>
      <div id="w13-summary" style="margin-top:12px; padding:10px; background:var(--bg-body); border-radius:6px; border:1px solid var(--border);"></div>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Internal vs. External Fragmentation (Crucial Exam Concept)</div>
    <ul>
      <li><strong>Internal Fragmentation:</strong> Memory allocated to a process is slightly larger than requested; the unused memory is internal to the partition. (Occurs in fixed-partition schemes and paging).</li>
      <li><strong>External Fragmentation:</strong> Total free memory exists to satisfy a request, but it is broken into scattered non-contiguous holes. (Occurs in variable-partition schemes and segmentation). Solved by <strong>Compaction</strong>.</li>
    </ul>
  </div>
</div>
"""

M12_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M12</span>
  <h1 class="module-title">Memory Management: Non-Contiguous (Paging)</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 17-MemoryManagement - NonContiguous (163 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 9 (§9.3–§9.5)</div>
    <div class="meta-chip">🎯 Exam Priority: TOP (Paging Address Translation Practice)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Understand the paging model: <strong>Frames</strong> (physical memory blocks) and <strong>Pages</strong> (logical memory blocks).</li>
    <li>Calculate <strong>Page Number (p)</strong> and <strong>Offset (d)</strong> in decimal addressing:
      <br><code>p = &lfloor;Logical Address / Page Size&rfloor;</code> and <code>d = Logical Address mod Page Size</code>.
    </li>
    <li>Calculate physical addresses: <code>Physical Address = (Frame &times; Page Size) + Offset</code>.</li>
    <li>Determine bit allocations for binary addressing (m total bits, n offset bits, m-n page bits).</li>
    <li>Calculate <strong>Effective Access Time (EAT)</strong> with Translation Lookaside Buffer (TLB).</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Interactive Paging Address Translator (Widget W14)</h2>
  <p>Preloaded with <strong>Sample Paging Question 02</strong>: Page Size = 1 KB (1024 bytes), Logical Address = 3085:</p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W14: Paging Address Translator</div>
      <div class="sim-controls">
        <label style="font-size:0.85rem;">Logical Address (LA): </label>
        <input type="number" id="w14-la" value="3085" style="width:90px; padding:4px;" onchange="W14_PagingTranslator.translate()">
        <label style="font-size:0.85rem;">Page Size (bytes): </label>
        <input type="number" id="w14-ps" value="1024" style="width:80px; padding:4px;" onchange="W14_PagingTranslator.translate()">
        <button class="btn btn-sm btn-primary" onclick="W14_PagingTranslator.translate()">Translate</button>
      </div>
    </div>
    <div class="sim-body">
      <div style="display:flex; justify-content:space-around; align-items:center; flex-wrap:wrap; margin-bottom:16px;">
        <div>Page Number (p): <strong id="w14-p" style="color:var(--primary); font-size:1.3rem;">3</strong></div>
        <div>Offset (d): <strong id="w14-d" style="color:var(--warning); font-size:1.3rem;">13</strong></div>
        <div>Mapped Frame: <strong id="w14-frame" style="color:var(--success); font-size:1.3rem;">2</strong></div>
        <div>Physical Address (PA): <strong id="w14-pa" style="color:var(--p2-col); font-size:1.3rem;">2061</strong></div>
      </div>
      <div class="sim-narration" id="w14-narr"></div>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Exact Slide 17 Sample Question 01 (Binary Addressing Bits)</div>
    A system has:
    <ul>
      <li>Number of Pages = 64 &rarr; <code>2<sup>6</sup> = 64</code> &rarr; <strong>6 bits</strong> for page number.</li>
      <li>Each Page = 1024 bytes &rarr; <code>2<sup>10</sup> = 1024</code> &rarr; <strong>10 bits</strong> for page offset.</li>
      <li><strong>Bits for Logical Address:</strong> 6 + 10 = <strong>16 bits</strong>.</li>
      <li>Number of Frames = 32 &rarr; <code>2<sup>5</sup> = 32</code> &rarr; <strong>5 bits</strong> for frame number.</li>
      <li>Frame size = Page size = 1024 bytes &rarr; <strong>10 bits</strong> for frame offset.</li>
      <li><strong>Bits for Physical Address:</strong> 5 + 10 = <strong>15 bits</strong>.</li>
    </ul>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">2. Translation Lookaside Buffer (TLB) & Effective Access Time (EAT)</h2>
  <p>To avoid two memory accesses per logical reference (one for the page table, one for the byte), a fast associative hardware cache called the <strong>Translation Lookaside Buffer (TLB)</strong> is used:</p>
  
  <div class="callout callout-definition">
    <div class="callout-title">📜 TLB Effective Access Time Formula</div>
    <code>EAT = h &middot; (t<sub>TLB</sub> + t<sub>RAM</sub>) + (1 - h) &middot; (t<sub>TLB</sub> + 2 &middot; t<sub>RAM</sub>)</code>
    <br>where <code>h</code> is the hit ratio, <code>t<sub>TLB</sub></code> is the TLB search latency (e.g. 20 ns), and <code>t<sub>RAM</sub></code> is the main memory access latency (e.g. 100 ns).
  </div>
</div>
"""

M13_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M13</span>
  <h1 class="module-title">Virtual Memory & Page Replacement</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 18-MemoryManagement - Virtual Memory (44 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 10 (§10.1–§10.6)</div>
    <div class="meta-chip">🎯 Exam Priority: TOP (Final Exam Classic)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Understand <strong>Demand Paging</strong> and trace the 6 steps of a <strong>Page Fault</strong> interrupt.</li>
    <li>Simulate Page Replacement algorithms: <strong>FIFO</strong>, <strong>Optimal (OPT)</strong>, and <strong>LRU</strong>.</li>
    <li>Demonstrate <strong>Belady's Anomaly</strong> (more frames yielding more page faults in FIFO).</li>
    <li>Understand LRU approximations: Reference Bit and <strong>Second-Chance (Clock) Algorithm</strong>.</li>
    <li>Explain <strong>Thrashing</strong> and the <strong>Working-Set Model</strong>.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Master Page Replacement Simulator (Widget W15)</h2>
  <p>Preloaded with <strong>Silberschatz Fig. 10.9 reference string</strong> (3 frames):<br>
  <code>7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1</code></p>

  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W15: Page Replacement Simulator</div>
      <div class="sim-controls">
        <button class="btn btn-sm btn-primary" onclick="W15_PageReplacement.run('FIFO')">Run FIFO</button>
        <button class="btn btn-sm" onclick="W15_PageReplacement.run('OPT')">Run OPT</button>
        <button class="btn btn-sm" onclick="W15_PageReplacement.run('LRU')">Run LRU</button>
      </div>
    </div>
    <div class="sim-body">
      <div id="w15-summary" style="margin-bottom:14px; padding:10px; background:var(--bg-body); border-radius:6px; border:1px solid var(--border);"></div>
      <div id="w15-grid"></div>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Exact Results from Slide 18 (Must Match on Exam!)</div>
    For the reference string above with 3 frames:
    <ul>
      <li><strong>FIFO (First-In-First-Out):</strong> <strong>15 Page Faults</strong></li>
      <li><strong>OPT (Optimal):</strong> <strong>9 Page Faults</strong> (provably minimum possible)</li>
      <li><strong>LRU (Least Recently Used):</strong> <strong>12 Page Faults</strong></li>
    </ul>
  </div>
</div>
"""

M14_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M14</span>
  <h1 class="module-title">Mass Storage Structure & Disk Scheduling</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 19-MemoryManagement -MassStorage_only (18 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 11 (§11.1–§11.2)</div>
    <div class="meta-chip">🎯 Exam Priority: HIGH</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Understand magnetic disk geometry: Platters, Tracks, Cylinders, Sectors, and Read-Write Heads.</li>
    <li>Calculate Positioning Time: <code>Positioning Time = Seek Time + Rotational Latency</code>.</li>
    <li>Simulate disk scheduling algorithms: <strong>FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK</strong>.</li>
    <li>Calculate Total Head Movement (seek distance) for standard disk-scheduling practice problems.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Master Disk Scheduling Simulator (Widget W16)</h2>
  <div class="sim-card">
    <div class="sim-header">
      <div class="sim-title">⚙️ Widget W16: Disk Scheduling Head-Movement Visualizer</div>
      <div class="sim-controls">
        <select class="btn btn-sm" id="w16-algo-sel" onchange="W16_DiskScheduling.run(this.value)">
          <option value="FCFS">FCFS</option>
          <option value="SSTF">SSTF</option>
          <option value="SCAN">SCAN</option>
          <option value="C-SCAN">C-SCAN</option>
          <option value="LOOK">LOOK</option>
          <option value="C-LOOK">C-LOOK</option>
        </select>
        <button class="btn btn-sm btn-primary" onclick="W16_DiskScheduling.loadStandardExample()">Load Book Queue (0-199)</button>
        <button class="btn btn-sm" onclick="W16_DiskScheduling.loadReviewQueueExample()">Load Practice Review Queue (0-4999)</button>
      </div>
    </div>
    <div class="sim-body">
      <div id="w16-summary" style="margin-bottom:12px; padding:10px; background:var(--bg-body); border-radius:6px; border:1px solid var(--border);"></div>
      <div class="sim-canvas" id="w16-canvas"></div>
    </div>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Standard Book Example vs. Extended Practice Review Problem</div>
    <ul>
      <li><strong>Standard Queue (0-199 disk, head at 53):</strong> <code>98, 183, 37, 122, 14, 124, 65, 67</code>
        <br>&bull; FCFS: <strong>640 cylinders</strong>
        <br>&bull; SSTF: <strong>236 cylinders</strong>
        <br>&bull; SCAN: <strong>208 cylinders</strong>
      </li>
      <li><strong>Extended Practice Queue (0-4999 cylinders, head at 143 moving upwards):</strong>
        <br>Queue: <code>130, 1750, 1022, 1509, 948, 1774, 913, 1470, 86</code>
      </li>
    </ul>
  </div>
</div>
"""

M15_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M15</span>
  <h1 class="module-title">File Management & Disk Space Allocation</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 20-FileManagement - Tagged (27 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapters 13 & 14 (§13.1–§13.3, §14.4–§14.5)</div>
    <div class="meta-chip">🎯 Exam Priority: MEDIUM / HIGH</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Define file attributes and access methods: <strong>Sequential Access</strong> vs. <strong>Direct (Relative) Access</strong>.</li>
    <li>Compare directory structures: Single-level, Two-level, Tree-structured, and Acyclic-graph.</li>
    <li>Analyze the 4 disk allocation methods: <strong>Contiguous, Linked, FAT, and Indexed Allocation</strong>.</li>
    <li>Explain Free-Space Management techniques: Bit Vector (Bitmap), Linked List, Grouping, and Counting.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Disk Allocation Methods Compared</h2>
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Method</th>
          <th>How It Works</th>
          <th>Advantages</th>
          <th>Disadvantages & Limitations</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Contiguous Allocation</strong></td>
          <td>Each file occupies a contiguous set of blocks on disk. Directory contains starting block and length.</td>
          <td>Fastest performance; excellent for both sequential and direct access.</td>
          <td>External fragmentation; file cannot easily grow without reallocation.</td>
        </tr>
        <tr>
          <td><strong>Linked Allocation</strong></td>
          <td>Each file is a linked list of disk blocks; each block contains a pointer to the next block.</td>
          <td>No external fragmentation; files can grow easily without size declaration.</td>
          <td>Very slow direct access (must traverse pointers from start); pointer overhead reduces usable block space; reliability risk if pointer corrupts.</td>
        </tr>
        <tr>
          <td><strong>FAT (File Allocation Table)</strong></td>
          <td>Pointers are kept in a separate table cached in main memory at the beginning of the disk.</td>
          <td>Faster random access than plain linked allocation because pointers are in memory cache.</td>
          <td>Significant memory overhead to store table; disk head seeks if table not fully cached.</td>
        </tr>
        <tr>
          <td><strong>Indexed Allocation</strong></td>
          <td>Each file has an <strong>Index Block</strong> containing pointers to all its data blocks.</td>
          <td>Supports fast direct access without external fragmentation.</td>
          <td>Index block overhead for small files (wastes a whole block even for a 1-byte file).</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
"""

M16_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M16</span>
  <h1 class="module-title">I/O Systems & Device Management</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: 21-IO Management (30 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapter 12 (§12.1–§12.5)</div>
    <div class="meta-chip">🎯 Exam Priority: MEDIUM</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Distinguish between <strong>Polling</strong> (busy waiting), <strong>Interrupt-Driven I/O</strong>, and <strong>DMA</strong>.</li>
    <li>Examine the structure of device controllers and device drivers.</li>
    <li>Identify kernel I/O subsystems: <strong>I/O Scheduling, Buffering, Caching, and Spooling</strong>.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. Three Communication Techniques Compared</h2>
  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Technique</th>
          <th>Mechanism</th>
          <th>Best Used For</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Polling (Programmed I/O)</strong></td>
          <td>Host repeatedly reads device status register in a tight loop until the busy bit becomes 0.</td>
          <td>Very fast devices where waiting is shorter than interrupt context-switch overhead.</td>
        </tr>
        <tr>
          <td><strong>Interrupt-Driven I/O</strong></td>
          <td>Device controller asserts interrupt hardware line when ready; CPU pauses user process and invokes ISR via interrupt vector.</td>
          <td>Moderately paced, unpredictable, or infrequent events (keyboards, mice, serial ports).</td>
        </tr>
        <tr>
          <td><strong>Direct Memory Access (DMA)</strong></td>
          <td>Special DMA controller handles data transfer between device buffer and main memory directly, interrupting CPU once per block.</td>
          <td>High-speed block devices (disk drives, network cards, video controllers).</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
"""

M17_CONTENT = """
<div class="module-header">
  <span class="module-tag">Module M17</span>
  <h1 class="module-title">Security & Protection: The Access Matrix</h1>
  <div class="module-meta">
    <div class="meta-chip">📑 Slides: Updated2_22-CPCS-361-Security & Privacy (41 slides)</div>
    <div class="meta-chip">📘 Silberschatz: Chapters 16 & 17 (§16.1–§16.3, §17.1–§17.5)</div>
    <div class="meta-chip">🎯 Exam Priority: HIGH (Final Exam Standard)</div>
  </div>
</div>

<div class="section-block">
  <h2 class="section-title">🎯 Learning Objectives</h2>
  <ul style="padding-left:20px; margin-bottom:16px;">
    <li>Understand the 4 security measure levels: Physical, Human, Operating System, and Network.</li>
    <li>Identify Program Threats (Trojan horse, trap door, virus, worm) and Network Threats (DoS, MITM, spoofing).</li>
    <li>Explain the <strong>Principle of Least Privilege</strong> and <strong>Protection Domains</strong>.</li>
    <li>Master the <strong>Access Matrix Model</strong>: Domains (rows), Objects (columns), and Rights (cells).</li>
    <li>Understand dynamic rights: <strong>Copy Right (*)</strong>, <strong>Owner Right</strong>, and <strong>Control Right</strong>.</li>
  </ul>
</div>

<div class="section-block">
  <h2 class="section-title">1. The Access Matrix Model & Dynamic Rights</h2>
  <p>The <strong>Access Matrix</strong> is an abstract model for computer protection:</p>
  <ul style="padding-left:20px; margin-bottom:12px;">
    <li><strong>Rows:</strong> Represent <em>Protection Domains</em> (users, processes, or roles).</li>
    <li><strong>Columns:</strong> Represent <em>Objects</em> (files, printers, memory segments, or other domains).</li>
    <li><strong>Entries <code>access(i, j)</code>:</strong> Define the set of legal operations domain <code>i</code> may perform on object <code>j</code>.</li>
  </ul>

  <div class="table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th>Domain</th>
          <th>File F1</th>
          <th>File F2</th>
          <th>File F3</th>
          <th>Laser Printer</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>D1</strong></td>
          <td>read*</td>
          <td>read, write</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr>
          <td><strong>D2</strong></td>
          <td>-</td>
          <td>-</td>
          <td>read</td>
          <td>print</td>
        </tr>
        <tr>
          <td><strong>D3</strong></td>
          <td>-</td>
          <td>read</td>
          <td>execute</td>
          <td>-</td>
        </tr>
        <tr>
          <td><strong>D4 (Owner)</strong></td>
          <td>read, write, owner</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Slide 22 Exam Rules for Special Rights</div>
    <ul>
      <li><strong>Copy Right (<code>*</code>):</strong> If an access right has an asterisk (e.g. <code>read*</code>), a process executing in that domain can <strong>copy that right to any other domain</strong> in that column!</li>
      <li><strong>Owner Right:</strong> A domain that has the <code>owner</code> right over an object can add or remove any access rights in that object's column.</li>
      <li><strong>Control Right:</strong> If domain Di has the <code>control</code> right over domain Dj, processes in Di can modify the access rights of domain Dj.</li>
    </ul>
  </div>
</div>
"""
