# -*- coding: utf-8 -*-
"""
Part 3 Knowledge Trove: Decks 16 through 22
Silberschatz 10th Ed. Chapters 9, 10, 11, 12, 13, 14, 16, 17
Comprehensive textbook-grade chapters for all Final Exam modules.
"""

DECKS_16_22 = {
    "deck_16": {
        "title": "CONTIGUOUS MEMORY ALLOCATION, MMU & FRAGMENTATION",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 9 (§9.1–§9.2, §9.5)",
        "formulas": "Hardware Protection: Base &le; Physical Address &lt; Base + Limit<br>MMU Dynamic Relocation: Physical = Logical + Relocation Register<br>50-Percent Rule (First Fit): For N allocated blocks, ~0.5N blocks lost to fragmentation<br>Swap Latency: T = 2 &times; (Process Size / Transfer Rate)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 16 · CONTIGUOUS MEMORY ARCHITECTURE · SILBERSCHATZ CH. 9 (§9.1–§9.2, §9.5)</div>
    <h2 class="theory-heading">Address Binding, Hardware Protection, Dynamic Allocation, Fragmentation &amp; Swapping</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 9 (§9.1–§9.2, §9.5) · CPCS-361 Final Exam Core</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Enforce OS-level memory protection cleanly using hardware <strong>Base and Limit Registers</strong> (§9.1.1).</li>
      <li>Compare all <strong>3 Address Binding stages</strong>: Compile Time, Load Time, and Execution Time (§9.1.2).</li>
      <li>Differentiate <strong>Logical (Virtual)</strong> vs. <strong>Physical Addresses</strong> translated dynamically by the <strong>MMU</strong> (§9.1.3).</li>
      <li>Explain <strong>Dynamic Loading</strong> vs. <strong>Dynamic Linking (Shared Libraries / DLLs)</strong> (§9.1.4–§9.1.5).</li>
      <li>Trace <strong>First-Fit, Best-Fit, and Worst-Fit</strong> hole allocation (Slide 16 variable/fixed traces &amp; §9.2.2) and distinguish <strong>Internal vs. External Fragmentation</strong>, <strong>Compaction</strong> (§9.2.3), and <strong>Swapping</strong> (§9.5).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Parallel-Parked Cars Along One Curb</div>
    <ul>
      <li><strong>Naive Attempts &rarr; Visible Failure:</strong> Letting programs compile fixed physical addresses (<code>§9.1.3</code>) crashes whenever two apps load at <code>0x1000</code>, and sharing RAM without hardware bounds lets one bad pointer overwrite the kernel. Even with relocation + bounds, dynamic variable partitions carve free RAM into scattered small holes (§9.2.3)—on Slide 16's <code>2400</code>-unit memory trace, <code>P4 = 350</code> fails under First-Fit despite <code>360</code> free units!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Contiguous variable allocation is <strong>parallel parking cars of unequal length along one 2,400-foot curb</strong>: your <strong>Base (Relocation) Register</strong> marks your rear bumper's zero-point; your <strong>Limit Register</strong> enforces your car's legal bay length; <strong>Compaction</strong> asks every parked car to pull forward simultaneously to squeeze empty curb gaps together. <em>Where the analogy breaks:</em> Running CPU threads and DMA hardware hold live addresses, so Compaction requires <strong>execution-time dynamic binding</strong> plus routing pending I/O strictly through OS kernel buffers (Slide 16 double-buffering note), while <strong>Swapping (§9.5)</strong> hauls idle cars onto a slow off-street disk lot (<code>4,000 ms</code> for <code>100 MB</code> @ <code>50 MB/s</code>)!</li>
      <li><strong>Why Each Rule Exists:</strong> Why Swapping pays <code>2 &times; (Size / Rate)</code> (evict victim + reload entrant); why <code>Best-Fit</code> usually increases tiny dust fragments even though Slide 16's exact trace lets <code>P4=350</code> squeeze through cleanly.</li>
    </ul>
  </div>

  <h3>1. Base &amp; Limit Registers and Hardware Protection (§9.1.1)</h3>
  <p>Before running any user process, the OS must guarantee no user process overwrites kernel memory or another process's RAM. Hardware enforces this via two dedicated registers checked on <strong>every single CPU memory fetch/store in User Mode</strong>:</p>
  <ul>
    <li><strong>Base Register:</strong> Holds the smallest legal physical memory address assigned to the process.</li>
    <li><strong>Limit Register:</strong> Specifies the size of the legal contiguous range. Valid physical addresses satisfy: <strong><code>Base &le; Address &lt; Base + Limit</code></strong>.</li>
    <li>Only the OS running in <strong>Kernel Mode (Mode Bit = 0)</strong> can load Base/Limit registers via privileged instructions. Any out-of-bounds user access triggers an immediate <strong>addressing error trap to the OS</strong>!</li>
  </ul>

  <h3>2. Address Binding Stages &amp; Logical vs. Physical Addresses (§9.1.2–§9.1.3)</h3>
  <table class="data-table">
    <thead>
      <tr><th>Binding Stage</th><th>When Physical Address Is Decided</th><th>Consequence / Flexibility</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Compile Time</strong></td><td>Absolute physical address known at compile time.</td><td>Generates <strong>absolute code</strong> (e.g., old MS-DOS <code>.com</code>). If start address shifts later, program must be recompiled!</td></tr>
      <tr><td><strong>2. Load Time</strong></td><td>Physical location unknown at compile time; compiler emits <strong>relocatable code</strong>.</td><td>Loader fixes addresses once when loading into RAM. Cannot move process in RAM once running!</td></tr>
      <tr><td><strong>3. Execution Time</strong></td><td>Process can move between physical segments <em>while executing</em>!</td><td>Used by ALL modern OSes! Requires <strong>Memory Management Unit (MMU)</strong> hardware mapping.</td></tr>
    </tbody>
  </table>
  <p><strong>Logical vs. Physical Address:</strong> The address generated by the CPU is a <strong>Logical Address</strong> (0 to max); the address placed onto the memory bus for RAM chips is a <strong>Physical Address</strong>. Under Compile-Time and Load-Time binding, logical == physical. Under Execution-Time binding, they differ (logical is called a <em>virtual address</em>), and the hardware <strong>MMU</strong> adds the <strong>Relocation Register</strong> (= Base) at runtime: <code>Physical = Logical + Relocation_Register</code>. User programs deal exclusively with logical addresses and <em>never see real physical addresses</em>!</p>

  <p><strong>Dynamic Loading vs. Dynamic Linking:</strong> <em>Dynamic Loading</em> delays loading infrequently called routines (e.g., error handlers) from disk until actually invoked—reducing memory footprint without OS kernel help. <em>Dynamic Linking &amp; Shared Libraries</em> (<code>.so</code> on Linux, <code>.dll</code> on Windows) postpones linking external library code until execution via a tiny memory <em>stub</em>, allowing multiple running processes to share <strong>one physical RAM copy</strong> of standard library code (requires OS assistance for shared read-only pages).</p>

  <h3>3. Contiguous Memory Allocation &amp; Fit Strategies (§9.2)</h3>
  <p>Main memory typically holds the OS (low memory with Interrupt Vector) and multiple user processes in high memory. In <strong>Variable-Partition (Dynamic) Contiguous Allocation</strong>, the OS tracks allocated blocks and a linked list of free <strong>holes</strong>. When a new process of size <code>S</code> arrives, three classic heuristics pick which hole (<code>&ge; S</code>) to allocate:</p>
  <table class="data-table">
    <thead>
      <tr><th>Strategy</th><th>Selection Rule</th><th>Strength vs. Weakness</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>First-Fit</strong></td><td>Allocate the <strong>first hole</strong> scanned from the start that is big enough.</td><td>Fastest scan; good overall utilization, tends to leave small fragments near front.</td></tr>
      <tr><td><strong>Best-Fit</strong></td><td>Allocate the <strong>smallest hole</strong> that is still big enough (searches full list unless sorted).</td><td>Saves huge holes, <strong>BUT creates tiny unusable leftover slivers</strong> (worst external fragmentation!).</td></tr>
      <tr><td><strong>Worst-Fit</strong></td><td>Allocate the <strong>largest available hole</strong> (searches full list unless sorted).</td><td>Leftover pieces stay large enough to reuse, yet breaks up huge contiguous blocks quickly.</td></tr>
    </tbody>
  </table>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Worked Allocation Traces (Slide 16 Variable Trace &amp; Practice Exercise)</div>
    <p><strong>1. Slide 16 Variable-Partition Trace (Total RAM = 2,400 units after initial OS/jobs; requests P8=115, P9=500, P6=35, P1=200, P4=350):</strong><br>
    &bull; <strong>First-Fit:</strong> Int Frag = 0, Ext Frag = <strong>360</strong> (holes 210 + 150) &rarr; <strong>P4 (350) FAILS!</strong><br>
    &bull; <strong>Best-Fit:</strong> Int Frag = 0, Ext Frag = <strong>10</strong> &rarr; <strong>P4 (350) SUCCEEDS!</strong> (Also check Slide 16 Fixed Same-Size <code>20 MB</code> partitions with <code>P1=8, P2=17, P3=20 MB</code> &rArr; <code>12+3+0 = 15 MB</code> internal fragmentation, and Varying Fixed Partitions matching 10th Ed. Practice Ex. 9.6 holes <code>300, 600, 350, 200, 750, 125 KB</code>).<br>
    &bull; <strong>Worst-Fit:</strong> Int Frag = 0, Ext Frag = <strong>360</strong> (150 + 115 + 95) &rarr; <strong>P4 (350) FAILS!</strong></p>
    <p><strong>2. Classic Edition Hole Problem (Holes = 100K, 500K, 200K, 300K, 600K; Requests P1=212K, P2=417K, P3=112K, P4=426K):</strong></p>
    <ul>
      <li><strong>First-Fit:</strong> P1&rarr;500K (288K left), P2&rarr;600K (183K left), P3&rarr;288K (176K left), P4 (426K) &rarr; <strong>MUST WAIT!</strong></li>
      <li><strong>Best-Fit:</strong> P1&rarr;300K (88K), P2&rarr;500K (83K), P3&rarr;200K (88K), P4&rarr;<strong>600K (174K)! ALL 4 SUCCEED!</strong></li>
      <li><strong>Worst-Fit:</strong> P1&rarr;600K (388K), P2&rarr;500K (83K), P3&rarr;388K (276K), P4 (426K) &rarr; <strong>MUST WAIT!</strong></li>
    </ul>
  </div>

  <h3>4. Internal vs. External Fragmentation, Compaction &amp; Swapping (§9.2.3 &amp; §9.5)</h3>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>External Fragmentation (§9.2.3)</h4>
      <p>Enough <em>total</em> free memory exists across RAM to satisfy a request, <strong>but it is scattered into non-contiguous small holes</strong> too small individually.<br><strong>50-Percent Rule (First-Fit):</strong> Statistically, given <code>N</code> allocated blocks, another <code>0.5N</code> blocks are lost to fragmentation—i.e., <strong>1/3 of all RAM is unusable</strong>!<br><strong>Remedies:</strong> (1) <strong>Compaction</strong> (shuffle allocated blocks together—ONLY works with execution-time dynamic binding, expensive I/O copy!), or (2) <strong>Non-Contiguous Paging</strong>.</p>
    </div>
    <div class="compare-card">
      <h4>Internal Fragmentation &amp; Swapping (§9.5)</h4>
      <p><strong>Internal Fragmentation (§9.2.3):</strong> Unused wasted bytes <em>inside</em> an already allocated fixed-size block/partition (e.g., allocating a 18,464-byte block when a process only needed 18,462 bytes wastes 2 bytes because tracking micro-holes costs more overhead than leaving them attached).<br><strong>Swapping (§9.5):</strong> Temporarily rolling idle processes (or pages) out of RAM to a fast <em>backing store</em> on disk and bringing them back later—Slide 16 timing trace: swapping a <code>100 MB</code> process over a <code>50 MB/s</code> bus takes <code>2000 ms</code> out + <code>2000 ms</code> in = <strong>4,000 ms (4 s)</strong>, and pending I/O must target OS kernel buffers!</p>
    </div>
  </div>
</div>
""",
    },
    "deck_17": {
        "title": "PAGING, PAGE TABLE STRUCTURES & TLB",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 9 (§9.3–§9.4) + Slide 17 Segmentation",
        "formulas": "Address Split: p = Address / PageSize; &nbsp;d = Address % PageSize<br>Binary Split: Page Size = 2<sup>n</sup> bytes &rArr; lower n bits = offset d; upper (m&minus;n) bits = page p<br>Physical Address = (Frame f &times; PageSize) + d<br>TLB EAT = &alpha;(TLB + Mem) + (1 &minus; &alpha;)(TLB + 2 &times; Mem) &nbsp;[10th Ed. §9.3.2.1 simplifies TLB &approx; 0]<br>Segmentation Check: s &lt; STLR &amp; 0 &le; d &lt; SegLimit &rArr; PA = SegBase + d",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 17 · NON-CONTIGUOUS MEMORY · SILBERSCHATZ CH. 9 (§9.3–§9.4)</div>
    <h2 class="theory-heading">Paging Architecture, TLB Hardware, Effective Access Time, Page Tables &amp; Segmentation</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 9 (§9.3–§9.4) &amp; Lecture Slide 17 · CPCS-361 Final Exam Core Calculations</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Explain why Paging eliminates <strong>External Fragmentation</strong> completely (while retaining Internal Fragmentation only on the final page, e.g., <code>962 B</code> on Slide 17) (§9.3.1).</li>
      <li>Translate logical addresses <code>(p, d)</code> into physical addresses <code>(f, d)</code> using binary bit-splitting and decimal division (incl. Slide 17 Sample Q1 &amp; Q2) (§9.3.1).</li>
      <li>Calculate <strong>Effective Access Time (EAT)</strong> using the <strong>Translation Lookaside Buffer (TLB)</strong> hit ratio <code>&alpha;</code> (§9.3.2).</li>
      <li>Interpret Valid-Invalid bits, protection bits (Read/Write/Execute), <strong>Shared Pages</strong>, and <strong>ASIDs</strong> (§9.3.3–§9.3.4).</li>
      <li>Compare <strong>Hierarchical (Multi-Level)</strong>, <strong>Hashed</strong>, and <strong>Inverted Page Tables</strong> (§9.4), plus hardware <strong>Segmentation</strong> (<code>STBR</code>/<code>STLR</code>, Slide 17).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Loose-Leaf Bindings &amp; Sticky-Note Speed Dials</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Storing a process as uniform fixed pages inside non-contiguous frames cures external fragmentation completely—yet storing a flat Page Table in RAM forces <strong>two RAM trips per byte</strong> (50% slowdown!). Worse, on 64-bit systems a flat page table demands <code>2<sup>52</sup></code> entries per process—impossible to allocate contiguously!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Think of Paging as slicing a bound book (<em>logical address space</em>) into uniform loose-leaf sheets housed in random library shelves (<em>frames</em>), tracked by an index binder (<em>page table</em>) plus a tiny desk-side sticky-note speed dial (<em>TLB</em>, 32–1,024 hot shortcuts). <em>Where the analogy breaks:</em> Unlike human eyes scanning a list sequentially, a TLB searches every sticky note in <strong>1 cycle using parallel associative CAM hardware</strong>, and power-of-2 page sizes (<code>2<sup>n</sup></code>) turn division/modulo into zero-logic wire slicing!</li>
      <li><strong>Why Each Mechanism Exists:</strong> Hierarchical Paging breaks sparse page tables into demand-allocated sub-tables (until 64-bit depth hits 4+ RAM hops, Slide 17); Hashed Page Tables compact sparse 64-bit lookups; Inverted Page Tables bound table RAM strictly to physical frame count <code>O(RAM)</code> at the cost of making shared memory hard; Segmentation (Slide 17) matches programmer views (code/stack/heap) with variable-length bounds checked by <code>STBR/STLR</code>.</li>
    </ul>
  </div>

  <h3>1. The Paging Hardware Model &amp; Bit-Split Math (§9.3.1)</h3>
  <p>Paging permits a process's physical address space to be <strong>completely non-contiguous</strong>! Physical memory is divided into fixed-sized blocks called <strong>Frames</strong>, and logical memory is broken into same-sized blocks called <strong>Pages</strong> (always a power of 2, typically 4 KB to 1 GB). Because every free frame fits any logical page, <strong>External Fragmentation is 0%</strong>! Only the last page of a process averages ~50% <strong>Internal Fragmentation</strong> (half a page).</p>

  <div class="formula-display">
    m-bit Logical Address Space (2<sup>m</sup> bytes) &amp; Page Size = 2<sup>n</sup> bytes:<br>
    <strong>Lower n bits = Page Offset (d)</strong> &nbsp;|&nbsp; <strong>Upper (m &minus; n) bits = Page Number (p)</strong><br>
    Page Table Entries = 2<sup>m&minus;n</sup> &nbsp;|&nbsp; Physical Address = (Frame f &times; 2<sup>n</sup>) + d
  </div>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Exam Calculations: Slide 17 Sample Q1, Sample Q2, Internal Frag &amp; Decimal Paging</div>
    <ul>
      <li><strong>Binary Bit-Split:</strong> Suppose a system has a <strong>32-bit logical address space</strong> (4 GB) and <strong>4 KB page size</strong> (<code>4 KB = 4096 = 2<sup>12</sup> bytes</code>).
        <br>&rArr; Offset <code>d</code> takes <strong>12 bits</strong>; Page Number <code>p</code> takes <code>32 &minus; 12 =</code> <strong>20 bits</strong> (meaning up to <code>2<sup>20</sup> = 1,048,576</code> pages per process!). (Similarly on 8-bit Slide 17 trace: <code>m=8, frame=4B=2<sup>2</sup></code> &rArr; <code>LA=7 = 000001|11</code> gives <code>p=1, d=3</code>.)</li>
      <li><strong>Decimal Translation:</strong> Page Size = 4 bytes, Page Table maps <code>P0&rarr;F5, P1&rarr;F6, P2&rarr;F1, P3&rarr;F2</code>, Logical Address = <strong>13</strong>: <code>p = 13/4 = 3</code>, <code>d = 13%4 = 1</code>, <code>PageTable[3] &rArr; f = 2</code>, so <code>PA = (2 &times; 4) + 1 = <strong>9</strong></code>! (Slide 17 also traces <code>LA=2 ('c') &rarr; p=0, d=2 &rarr; F5 &rarr; PA=22</code>.)</li>
      <li><strong>Slide 17 Internal Frag &amp; Sample Q1/Q2 (Ex 9.4 &amp; 9.7):</strong> With <code>2,048 B</code> pages and <code>72,766 B</code> process: <code>35 pages + 1,086 B</code> &rArr; <code>2,048 &minus; 1,086 = <strong>962 B</strong></code> internal frag (watch slide 17 typo printing <code>2^11 (1024)</code>—<code>2^11</code> is 2048!). Sample Q1: <code>64 pages (6b)</code> &times; <code>1024 B (10b)</code> = <strong>16-bit LA</strong>; <code>32 frames (5b)</code> + 10b = <strong>15-bit PA</strong>. Sample Q2 (<code>1 KB = 1024 B</code>): <code>3085 &rarr; (3, 13)</code>, <code>42095 &rarr; (41, 111)</code>, <code>215201 &rarr; (210, 161)</code>, <code>650000 &rarr; (634, 784)</code>, <code>2000001 &rarr; (1953, 129)</code>.</li>
    </ul>
  </div>

  <h3>2. Hardware Support: Translation Lookaside Buffer (TLB) &amp; EAT (§9.3.2)</h3>
  <p>Because the Page Table resides in main memory (pointed to by the CPU's <strong>PTBR</strong> — Page-Table Base Register), every memory read/write naively requires <strong>two RAM accesses</strong> (1 to fetch frame <code>f</code> from Page Table, 1 for the actual data byte—cutting speed in half!). Hardware fixes this with a high-speed associative cache called the <strong>TLB</strong> (typically 32–1,024 entries searched in parallel in ~1 CPU cycle):</p>
  <div class="ascii-diagram">CPU ──(p, d)──&gt; [ TLB Associative Lookup ]
                   ├── HIT  (&alpha;)    ──&gt; yields Frame f immediately ──&gt; Physical (f, d) in RAM  (Time: TLB + Mem)
                   └── MISS (1-&alpha;) ──&gt; reads PageTable[p] in RAM &amp; updates TLB ──&gt; Physical (f, d) (Time: TLB + 2&times;Mem)</div>
  <ul>
    <li><strong>ASIDs (Address-Space Identifiers):</strong> Tagging each TLB entry with the process's ASID prevents flushing the entire TLB on every context switch, while still blocking process A from accessing process B's translations.</li>
    <li><strong>Protection &amp; Shared Pages (§9.3.3–§9.3.4):</strong> Each Page Table Entry (PTE) stores <strong>Valid-Invalid bit</strong> (<code>v</code>=in logical address space, <code>i</code>=illegal access trap) plus <strong>R/W/X protection bits</strong>. Reentrant read-only code (e.g., 40 users running <code>libc</code> or text editor) maps different processes' PTEs to the <strong>same physical frames</strong>!</li>
  </ul>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Exam Calculation 2: Effective Access Time (EAT) with TLB</div>
    <div class="formula-display">
      EAT = &alpha; &middot; (TLB + Mem) + (1 &minus; &alpha;) &middot; (TLB + 2 &middot; Mem)
      <span class="formula-note">Note: Silberschatz 10th Ed. §9.3.2.1 uses 10 ns RAM with parallel TLB (&approx; 0 ns), simplifying to &alpha;(10) + (1&minus;&alpha;)(20) = 12 ns at 80% / 10.1 ns at 99%. Always include TLB latency if explicitly specified by the problem!</span>
    </div>
    <strong>Worked Numerical Problem (with explicit 20 ns TLB):</strong> Assume TLB lookup = <strong>20 ns</strong>, Main Memory access = <strong>100 ns</strong>.<br>
    &bull; At <strong>80% Hit Ratio (&alpha; = 0.80):</strong> <code>EAT = 0.80(20 + 100) + 0.20(20 + 200) = 96 + 44 = <strong>140 ns</strong></code> (40% slowdown over 100 ns).<br>
    &bull; At <strong>99% Hit Ratio (&alpha; = 0.99):</strong> <code>EAT = 0.99(120) + 0.01(220) = 118.8 + 2.2 = <strong>121 ns</strong></code> (only 21% overhead!).
  </div>

  <h3>3. Page Table Structures (§9.4) &amp; Segmentation (Slide 17)</h3>
  <p>With 32-bit addresses and 4 KB pages, <code>2<sup>20</sup></code> entries &times; 4 B = <strong>4 MB per process</strong>! Worse, with 64-bit addresses (<code>2<sup>52</sup></code> entries!), a flat contiguous page table per process is astronomically impossible. Three 10th Ed. §9.4 solutions—plus Hardware Segmentation from Slide 17—exist:</p>
  <table class="data-table">
    <thead>
      <tr><th>Structure (§9.4 / Slide 17)</th><th>How It Works</th><th>Pros &amp; Cons (64-Bit Verdict)</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Hierarchical (Multi-Level, §9.4.1)</strong></td><td>Pages the page table itself! E.g., 32-bit splits into <code>p1 (10b) | p2 (10b) | d (12b)</code>. Only active inner tables allocated in RAM.</td><td>Works great for 32-bit (2 levels). <strong>FAILS on 64-bit:</strong> needs 4–7 levels &rarr; up to 4–7 RAM hops on a TLB miss!</td></tr>
      <tr><td><strong>2. Hashed Page Tables (§9.4.2)</strong></td><td>Hashes virtual page number <code>p</code> into a bucket chain; compares <code>p</code> along linked list elements (<code>Clustered</code> stores 16 consecutive pages/node).</td><td>Excellent for sparse 64-bit address spaces (&gt;32 bits).</td></tr>
      <tr><td><strong>3. Inverted Page Table (§9.4.3)</strong></td><td><strong>ONE global table</strong> for the entire OS with exactly 1 slot per <em>physical frame</em> (entry = <code>&lt;pid, page_num&gt;</code>)! Indexed by frame <code>f</code>.</td><td>Slashes page-table RAM drastically regardless of process count. <em>Cons:</em> Lookup requires searching (needs hash table); makes <strong>shared memory hard</strong> (1 frame maps 1 <code>&lt;pid, p&gt;</code>!).</td></tr>
      <tr><td><strong>4. Segmentation (Slide 17)</strong></td><td>Logical address is <code>&lt;segment-number s, offset d&gt;</code> mapped through Segment Table <code>(base, limit)</code> pointed to by <strong>STBR</strong> &amp; <strong>STLR</strong>; traps unless <code>s &lt; STLR</code> and <code>0 &le; d &lt; limit</code>.</td><td>Matches programmer view (code/stack/data) &amp; per-segment protection, yet re-introduces variable-size external fragmentation!</td></tr>
    </tbody>
  </table>
</div>
""",
    },
    "deck_18": {
        "title": "VIRTUAL MEMORY, DEMAND PAGING & PAGE REPLACEMENT",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 10 (§10.1–§10.6)",
        "formulas": "Demand Paging EAT = (1 &minus; p) &middot; ma + p &middot; page_fault_time<br>LRU / OPT = Stack Algorithms (Immune to Belady's Anomaly)<br>FIFO = Vulnerable to Belady's Anomaly<br>Thrashing Risk: D = &Sigma; WSS<sub>i</sub> &gt; m (Total Demand &gt; Physical Frames)",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 18 · VIRTUAL MEMORY &amp; PAGER · SILBERSCHATZ CH. 10 (§10.1–§10.6)</div>
    <h2 class="theory-heading">Virtual Memory, Demand Paging, Copy-on-Write, Page Replacement &amp; Thrashing</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 10 (§10.1–§10.6) · CPCS-361 Final Exam Flagship Topic</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Trace all <strong>6 hardware/OS steps of handling a Page Fault</strong> (§10.2.1).</li>
      <li>Compute <strong>Demand Paging Effective Access Time (EAT)</strong> showing why page-fault rate <code>p</code> must stay tiny (§10.2.3).</li>
      <li>Explain <strong>Copy-on-Write (CoW)</strong> optimization during <code>fork()</code> (§10.3.1).</li>
      <li>Hand-trace <strong>FIFO, Optimal (OPT), LRU, Second-Chance (Clock), and Enhanced Clock</strong> page replacement (§10.4).</li>
      <li>Demonstrate <strong>Belady's Anomaly</strong> and explain the <strong>Stack Property</strong> (§10.4.2–§10.4.4).</li>
      <li>Analyze Frame Allocation (Equal/Proportional, incl. Slide 18 <code>m=62</code> free frames), <strong>Thrashing</strong>, the <strong>Working-Set Model</strong>, and <strong>Page-Fault Frequency (PFF)</strong> (§10.5–§10.6).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Desk vs. Basement Archive &amp; The Thrashing Cliff</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Preloading every byte of a binary wastes RAM on error handlers that never run; conversely, cramming too many runnable processes until <code>&Sigma; WSS<sub>i</sub> &gt; m</code> flips the OS into <strong>Thrashing (§10.6.1)</strong>: every process steals frames from peers, CPU utilization nosedives toward 0% waiting on swap, and a naive scheduler admits <em>even more</em> jobs thinking the CPU is idle! Meanwhile FIFO isn't even monotonic—giving <code>1,2,3,4,1,2,5,1,2,3,4,5</code> a 4th frame increases faults from 9 to 10 (Belady's Anomaly)!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Treat RAM as a <strong>small study desk (<code>m</code> frames)</strong> beside a slow basement file room (<em>swap</em>): keep only today's active locality on the desk and fetch missing sheets on demand (<em>page fault</em>). <strong>Copy-on-Write (§10.3.1)</strong> lets forked siblings share one clean textbook until someone writes a margin note—copying only that single edited page. <em>Where the analogy breaks:</em> Desk clutter degrades gradually, whereas virtual memory suffers a sudden <strong>40&times; cliff</strong> even at <code>p = 0.001</code> (8 ms disk vs 200 ns RAM), and real CPUs cannot reorder hardware LRU stacks on every memory load so they run a Clock sweep (<code>(0,0)</code> clean-unused evicted before <code>(0,1)</code> dirty victims needing two disk trips!).</li>
      <li><strong>Why Each Formula Exists:</strong> <code>EAT = (1&minus;p)&middot;ma + p&middot;page_fault_time</code> (§10.2.3) proves <code>p</code> must stay below ~1 in 400,000 for &le;10% slowdown; <strong>Working-Set <code>D = &Sigma; WSS<sub>i</sub></code></strong> and <strong>PFF</strong> throttle multiprogramming directly before thrashing starts.</li>
    </ul>
  </div>

  <h3>1. Demand Paging &amp; The 6-Step Page Fault Sequence (§10.2)</h3>
  <p>Virtual memory separates the programmer's huge logical view (e.g., stacks/heaps separated by gigabytes of sparse empty space) from limited physical RAM. With <strong>Demand Paging</strong> (a lazy <em>pager</em>), pages are loaded from disk <strong>only when actually referenced</strong>! Each PTE carries a Valid-Invalid bit: <code>v</code> = in RAM; <code>i</code> = either illegal address OR valid page still on disk.</p>
  <div class="callout callout-exam">
    <div class="callout-title">⚠️ Memorize All 6 Steps of Handling a Page Fault (Silberschatz Fig. 10.5)</div>
    <ol>
      <li><strong>Step 1 (Trap):</strong> Reference to page marks PTE bit = <code>i</code> (invalid) &rArr; MMU hardware raises a <strong>Page-Fault Trap</strong> to the OS.</li>
      <li><strong>Step 2 (PCB Validation):</strong> Kernel checks an internal process table: if the memory reference is truly <em>illegal</em> (segfault), terminate process; if valid but on disk, proceed to page it in.</li>
      <li><strong>Step 3 (Free Frame):</strong> OS locates a free physical frame from the free-frame list (if none, runs Page Replacement to evict a victim!).</li>
      <li><strong>Step 4 (Disk Read):</strong> OS schedules disk controller I/O to read the desired page into the newly allocated frame (process enters <em>Waiting</em> state while disk runs).</li>
      <li><strong>Step 5 (Update Tables):</strong> Upon disk interrupt completion, OS modifies the internal table and sets the PTE's frame number + flips bit <strong><code>i &rarr; v</code></strong>.</li>
      <li><strong>Step 6 (Restart Instruction):</strong> OS reschedules the process and <strong>restarts the exact trapped machine instruction</strong>—now the PTE is valid and execution resumes seamlessly!</li>
    </ol>
  </div>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Exam Calculation: Demand Paging EAT (Showing Sensitivity to p)</div>
    <div class="formula-display">
      EAT = (1 &minus; p) &times; ma + p &times; page_fault_time
      <span class="formula-note">page_fault_time includes: fault trap overhead + swap-out dirty victim (if needed) + swap-in desired page + restart overhead.</span>
    </div>
    <p><strong>Worked Problem:</strong> Memory access time <code>ma = 200 ns</code>, average page-fault service time = <code>8 ms = 8,000,000 ns</code>, and 1 fault out of 1,000 accesses (<code>p = 0.001</code>):</p>
    <code>EAT = (1 &minus; 0.001) &times; 200 + 0.001 &times; 8,000,000 = 199.8 + 8,000 = <strong>8,199.8 ns</strong> (&approx; 8.2 &mu;s!)</code><br>
    That single <code>0.1%</code> fault rate causes a <strong>~41&times; slowdown</strong> (<code>8,199.8 / 200 = 40.999</code>; Silberschatz §10.2.3 rounds to "a factor of 40"!). To keep performance degradation under <strong>10%</strong> (<code>EAT &le; 220 ns</code>), we need <code>p &lt; 0.0000025</code> (fewer than 1 fault in ~400,000 accesses)!
  </div>

  <h3>2. Copy-on-Write (CoW — §10.3.1)</h3>
  <p>Naively copying every parent page on <code>fork()</code> is wasteful when the child immediately calls <code>exec()</code>! With <strong>Copy-on-Write</strong>, parent and child initially <strong>share the exact same physical frames</strong>, marked read-only. Only if either process attempts to <em>write</em> to a shared page does hardware trap, causing the OS to duplicate <em>just that one modified page</em> cleanly.</p>

  <h3>3. Page Replacement Algorithms &amp; Belady's Anomaly (§10.4)</h3>
  <p>Notice the <strong>Modify (Dirty) Bit</strong> optimization: if an evicted victim frame has <code>dirty == 0</code>, it matches disk identically—so OS skips writing it back to swap, saving 50% of page-fault disk I/O!</p>
  <p>Compare algorithms using Silberschatz §10.4.1's 20-page reference string with <strong>3 physical frames</strong>: <code>7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1</code> (<em>Slide 18 note:</em> Lecture Slide 18 inserts an extra <code>0, 3</code> mid-string making 22 references—both strings yield identical totals: <strong>FIFO = 15, OPT = 9, LRU = 12</strong>!): </p>
  <table class="data-table">
    <thead>
      <tr><th>Algorithm</th><th>Eviction Policy</th><th>Faults (3 Frames)</th><th>Notes &amp; Belady Check</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>FIFO</strong></td><td>Evicts the page brought into RAM <strong>earliest</strong> (oldest arrival).</td><td><strong>15 faults</strong></td><td>Simple queue, ignores usage! <strong>SUFFERS BELADY'S ANOMALY!</strong></td></tr>
      <tr><td><strong>Optimal (OPT / MIN)</strong></td><td>Evicts the page that will <strong>not be used for the longest time in the future</strong>.</td><td><strong>9 faults</strong></td><td>Provably lowest faults! Impossible to implement live (requires future knowledge); used as theoretical benchmark.</td></tr>
      <tr><td><strong>LRU</strong></td><td>Evicts the page <strong>unused for the longest time in the past</strong>.</td><td><strong>12 faults</strong></td><td>Excellent! A <strong>Stack Algorithm</strong> (frames with <code>k</code> &sub; frames with <code>k+1</code>) &rArr; <strong>immune to Belady's Anomaly</strong>. Hardware approximates via counters or stack.</td></tr>
      <tr><td><strong>Second-Chance (Clock)</strong></td><td>Circular FIFO pointer + 1 <strong>Reference Bit</strong>: if <code>ref==0</code>, evict; if <code>ref==1</code>, clear <code>ref=0</code>, advance clock!</td><td>~12–14 faults</td><td>Standard real-OS hardware approximation (used in Linux/UNIX variants). <em>Enhanced Clock</em> uses <code>(ref, dirty)</code> ordered classes: <code>(0,0) &rarr; (0,1) &rarr; (1,0) &rarr; (1,1)</code>.</td></tr>
    </tbody>
  </table>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Proof Trace: Belady's Anomaly on FIFO (String: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5)</div>
    <p>Counterintuitively, adding MORE physical frames under FIFO can INCREASE page faults!<br>
    &bull; With <strong>3 Frames:</strong> Total = <strong>9 page faults</strong>.<br>
    &bull; With <strong>4 Frames:</strong> <code>1(F), 2(F), 3(F), 4(F), 1(hit), 2(hit), 5(F replaces 1), 1(F replaces 2), 2(F replaces 3), 3(F replaces 4), 4(F replaces 5), 5(F replaces 1)</code> &rArr; Total = <strong>10 page faults!</strong><br>
    <strong>Why?</strong> FIFO lacks the <em>Stack Property</em>, whereas OPT and LRU satisfy the inclusion property where pages in RAM for <code>n</code> frames are always a strict subset of pages in RAM for <code>n+1</code> frames.</p>
  </div>

  <h3>4. Frame Allocation, Thrashing &amp; Working-Set Model (§10.5–§10.6)</h3>
  <ul>
    <li><strong>Frame Allocation (§10.5.2):</strong> Each process requires a strict architecture minimum (enough frames to complete a single complex assembly instruction with indirect operands). Allocation splits frames across processes via <strong>Equal Allocation</strong> (<code>m / n</code>, Slide 18 e.g. <code>100 / 5 = 20</code>) or <strong>Proportional Allocation</strong> (<code>(s<sub>i</sub> / S) &times; m</code>; e.g., in Silberschatz §10.5.2 with <code>m = 64</code> total where 2 are OS-reserved leaving <code>62</code> free user frames and sizes <code>s<sub>1</sub>=10, s<sub>2</sub>=127</code>, they get <code>4</code> and <code>57</code> frames!). <strong>Global Replacement</strong> lets a process steal frames from others (higher throughput, variable speed); <strong>Local Replacement</strong> restricts eviction to a process's own frames (predictable).</li>
    <li><strong>Thrashing (§10.6):</strong> When a process holds fewer frames than its active locality needs, it page-faults constantly, replacing a page it needs back within microseconds! As OS sees low CPU utilization (processes stuck waiting on paging disk), the scheduler foolishly swaps in <em>even more</em> processes, shrinking each process's frames further—causing <strong>CPU utilization to plummet toward 0%</strong> while disk swaps continuously!</li>
    <li><strong>Two Remedies Against Thrashing:</strong>
      <br>1. <strong>Working-Set Model (Denning):</strong> Tracks the set of unique pages referenced in the last <code>&Delta;</code> memory references (Working Set <code>WSS<sub>i</sub></code>). Total frame demand is <code>D = &Sigma; WSS<sub>i</sub></code>. If <code>D &gt; m</code> (total physical frames), <strong>suspend a process</strong> and swap it out until frames free!
      <br>2. <strong>Page-Fault Frequency (PFF):</strong> Sets upper and lower bounds on each process's actual page-fault rate: if faults exceed the upper bound, allocate an extra frame; if below the lower bound, reclaim a frame.</li>
  </ul>
</div>
""",
    },
    "deck_19": {
        "title": "MASS STORAGE, SSD/NVM, DISK SCHEDULING & RAID",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 11 (§11.1–§11.3, §11.8) + Slide 19 SSTF/LOOK/C-LOOK",
        "formulas": "HDD Access Time = Seek Time + Avg Rotational Latency (0.5 / RPM) + Transfer Time<br>RAID 0 (N drives): Capacity = N, Tolerance = 0 | RAID 1: Cap = N/2, Tol = 1/pair<br>RAID 5: Cap = N &minus; 1, Tol = 1 drive | RAID 6: Cap = N &minus; 2, Tol = 2 drives",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 19 · MASS STORAGE &amp; RAID · SILBERSCHATZ CH. 11 (§11.1–§11.3, §11.8)</div>
    <h2 class="theory-heading">HDD &amp; NVM Flash Structure, Disk Scheduling Algorithms &amp; RAID Levels</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 11 (§11.1–§11.3, §11.8) &amp; Lecture Slide 19 · CPCS-361 Final Exam Core Numerical Traces</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Describe magnetic HDD geometry (Platters, Tracks, Sectors, Cylinders) and compute <strong>Seek + Rotational + Transfer Latency</strong> (§11.1.1).</li>
      <li>Contrast HDDs with <strong>NVM / NAND Flash SSDs</strong> (erase blocks, FTL, garbage collection, write amplification, wear leveling, FIFO/NOOP scheduling) (§11.1.2, §11.3).</li>
      <li>Compute exact head-movement totals for <strong>FCFS, SCAN, C-SCAN</strong> (§11.2.1–§11.2.3) plus Slide 19's <strong>SSTF, LOOK, C-LOOK</strong> and <code>0..4999</code> Review Problem.</li>
      <li>Compare all standard <strong>RAID Levels (0, 1, 4, 5, 6, 0+1, 1+0)</strong> on capacity, fault tolerance, and small-write penalties (§11.8).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Skyscraper Elevators, One-Way Ski Lifts &amp; Non-Overwritable Flash</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Serving disk cylinders strictly <strong>FCFS</strong> swings the mechanical arm wildly (<code>7,037</code> cylinders on Slide 19's Review Problem vs <code>1,745</code> under SSTF!). Greedily chasing the nearest track (<strong>SSTF</strong>) slashes seeks yet can starve far-edge tracks forever. Conversely, applying mechanical elevator sorting to an NVMe SSD burns CPU time for zero gain while ignoring flash's real trap: <strong>NAND pages cannot overwrite in place</strong>!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> An HDD head arm is a <strong>5,000-floor freight elevator</strong>: <strong>SCAN</strong> rides all the way to the roof/basement (<code>0..199</code> or <code>0..4999</code>); <strong>C-SCAN</strong> acts like a <em>one-way ski lift</em> so edge floors never wait double turns; <strong>LOOK/C-LOOK</strong> stop at the highest/lowest waiting button instead of riding to an empty roof! <strong>RAID</strong> mirrors twin notebooks (RAID 1), deals cards across drives (RAID 0), or keeps algebraic XOR receipts (RAID 5). <em>Where the analogy breaks:</em> Flash SSDs have zero moving arms—they work like chalkboards where erasing requires wiping an entire big grid (<em>Erase Block</em>) to fresh space, driven by the controller's FTL and Wear Leveling (§11.1.2).</li>
      <li><strong>Why Each Formula Exists:</strong> <code>0.5 &times; (60 / RPM)</code> captures the average half-circle spin wait (e.g., <code>4.17 ms</code> at 7,200 RPM); <code>N, N/2, N&minus;1, N&minus;2</code> capture exact usable space vs. surviving 0, 1, or 2 dead drives (§11.8.3).</li>
    </ul>
  </div>

  <h3>1. HDD Physical Geometry vs. NVM Solid-State Drives (§11.1)</h3>
  <ul>
    <li><strong>Magnetic Hard Disks (HDDs):</strong> Composed of spinning platters covered in magnetic tracks subdivided into 512B/4KB sectors. The set of identical-radius tracks stacked across all surfaces forms a <strong>Cylinder</strong>. Total positioning delay = <strong>Seek Time</strong> (moving arm assembly to target cylinder, ~3–12 ms) + <strong>Rotational Latency</strong> (waiting for target sector to spin under head; average = <strong>&frac12; full rotation</strong>, e.g., 7,200 RPM = 8.33 ms/rev &rArr; <strong>4.17 ms avg rotational latency</strong>!).</li>
    <li><strong>Nonvolatile Memory (NVM / NAND Flash SSDs):</strong> Zero moving mechanical heads (&rarr; ~50–100 &mu;s random access, silent, shockproof). <em>Key Hardware Constraints:</em> Reads/writes occur per <strong>Page</strong> (e.g., 4 KB), <strong>BUT NAND cannot overwrite in place—an entire large Erase Block (~128–512 KB) must be erased before rewriting</strong>! Because flash cells wear out after finite Program/Erase (P/E) cycles, the controller's <strong>Flash Translation Layer (FTL)</strong> implements garbage collection, <strong>Wear Leveling</strong> (spreading writes across physical blocks evenly), and over-provisioning to combat <strong>Write Amplification</strong>.</li>
  </ul>

  <h3>2. Disk Head Scheduling Algorithms &amp; Complete Worked Trace (§11.2 &amp; Slide 19)</h3>
  <p>Because HDD seek distance dominates latency, the OS orders pending I/O cylinder requests cleanly. (Note: On SSDs, head movement doesn't exist, so simpler FCFS/NOOP FIFO queues excel—§11.3!). <em>Edition Note:</em> Silberschatz 10th Ed. §11.2 covers FCFS (§11.2.1), SCAN (§11.2.2), and C-SCAN (§11.2.3), while Slide 19 also tests <strong>SSTF, LOOK, and C-LOOK</strong>. Let's trace the <strong>famous Silberschatz Ch. 11 dataset</strong>:</p>
  <p><strong>Disk Geometry:</strong> Cylinders <strong>0 to 199</strong> &nbsp;|&nbsp; <strong>Initial Head Position: 53</strong> (previously moved downward toward 0 or upward—watch direction note!) &nbsp;|&nbsp; <strong>Request Queue:</strong> <code>98, 183, 37, 122, 14, 124, 65, 67</code></p>

  <table class="data-table">
    <thead>
      <tr><th>Algorithm</th><th>Service Order from Head = 53</th><th>Step-by-Step Distance</th><th>Total Head Movement</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>FCFS</strong></td><td><code>53 &rarr; 98 &rarr; 183 &rarr; 37 &rarr; 122 &rarr; 14 &rarr; 124 &rarr; 65 &rarr; 67</code></td><td>45 + 85 + 146 + 85 + 108 + 110 + 59 + 2</td><td><strong>640 cylinders</strong> (wild swings!)</td></tr>
      <tr><td><strong>SSTF</strong><br><em>(Shortest Seek Time First)</em></td><td><code>53 &rarr; 65 &rarr; 67 &rarr; 37 &rarr; 14 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183</code><br><em>(Picks nearest next request greedily; tie 53&rarr;65 vs 37 is 12 vs 16)</em></td><td>12 + 2 + 30 + 23 + 84 + 24 + 2 + 59</td><td><strong>236 cylinders</strong><br><em>(Warning: Can STARVE distant edge tracks!)</em></td></tr>
      <tr><td><strong>SCAN</strong><br><em>(Elevator — moving toward 0 first)</em></td><td><code>53 &rarr; 37 &rarr; 14 &rarr; <strong>0</strong> &rarr; 65 &rarr; 67 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183</code><br><em>(Sweeps ALL the way to end cylinder 0, then reverses!)</em></td><td>(53 &minus; 0) + (183 &minus; 0) = 53 + 183</td><td><strong>236 cylinders</strong><br><em>(Note: If moving UP toward 199 first: 53&rarr;199&rarr;14 = 146+185 = 331!)</em></td></tr>
      <tr><td><strong>C-SCAN</strong><br><em>(Circular SCAN — moving UP toward 199)</em></td><td><code>53 &rarr; 65 &rarr; 67 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183 &rarr; <strong>199 &rarr; 0</strong> &rarr; 14 &rarr; 37</code><br><em>(Treats disk as circular loop; zero servicing on 199&rarr;0 return!)</em></td><td>(199 &minus; 53) + (199 &minus; 0) + (37 &minus; 0) = 146 + 199 + 37</td><td><strong>382 cylinders</strong><br><em>(Gives much more uniform wait time than SCAN!)</em></td></tr>
      <tr><td><strong>LOOK</strong><br><em>(Moving DOWN toward 0 first)</em></td><td><code>53 &rarr; 37 &rarr; 14 &rarr; 65 &rarr; 67 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183</code><br><em>(Like SCAN, but reverses at last request 14—skips empty 14&rarr;0!)</em></td><td>(53 &minus; 14) + (183 &minus; 14) = 39 + 169</td><td><strong>208 cylinders</strong></td></tr>
      <tr><td><strong>C-LOOK</strong><br><em>(Moving UP toward 199 first)</em></td><td><code>53 &rarr; 65 &rarr; 67 &rarr; 98 &rarr; 122 &rarr; 124 &rarr; 183 &rarr; <strong>14</strong> &rarr; 37</code><br><em>(Jumps directly from highest request 183 to lowest request 14!)</em></td><td>(183 &minus; 53) + (183 &minus; 14) + (37 &minus; 14) = 130 + 169 + 23</td><td><strong>322 cylinders</strong></td></tr>
    </tbody>
  </table>
  <p><em>Exam Tip &amp; Slide 19 Review Problem:</em> Always verify whether the prompt includes the full-sweep return jump <code>199 &rarr; 0</code> in total C-SCAN head movement! Silberschatz explicitly counts <code>199</code> cylinders for that return sweep (hence <code>146 + 199 + 37 = 382</code>, and <code>183 &minus; 14 = 169</code> in C-LOOK). Also watch a known Slide 19 typo printing <code>SCAN = 208</code> (208 is actually LOOK without reaching <code>0</code>; hitting <code>0</code> gives <code>236</code>!). <strong>Slide 19 Review Question (<code>0..4999</code>, <code>curr=143</code>, <code>prev=125</code> moving UP; queue <code>130, 1750, 1022, 1509, 948, 1774, 913, 1470, 86</code>):</strong> <code>FCFS = 7,037</code>, <code>SSTF = 1,745</code>, <code>SCAN(to 4999) = 9,769</code>, <code>LOOK(to 1774) = 3,319</code>, <code>C-LOOK = 3,363</code> (1,675 excluding flyback).</p>

  <h3>3. RAID Levels (Redundant Arrays of Independent Disks — §11.8)</h3>
  <p>RAID combines multiple physical drives for two goals: <strong>Reliability via Redundancy</strong> (surviving disk failure) and <strong>Performance via Striping</strong> (splitting data blocks across drives in parallel):</p>
  <table class="data-table">
    <thead>
      <tr><th>RAID Level</th><th>Technique</th><th>Usable Space (N Disks)</th><th>Fault Tolerance &amp; Key Trade-Off</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>RAID 0</strong></td><td>Non-redundant <strong>Block Striping</strong></td><td><strong>N disks (100%)</strong></td><td><strong>ZERO redundancy!</strong> Losing 1 drive destroys the whole array. Max speed/space.</td></tr>
      <tr><td><strong>RAID 1</strong></td><td><strong>Disk Mirroring</strong></td><td><strong>N / 2 disks (50%)</strong></td><td>Survives 1 failure per mirror pair. Fastest reads (dual heads), 2&times; disk cost.</td></tr>
      <tr><td><strong>RAID 4</strong></td><td>Block Striping + <strong>1 Dedicated Parity Disk</strong></td><td><strong>N &minus; 1 disks</strong></td><td>Survives 1 failure, but the single parity disk becomes a severe <strong>write bottleneck</strong>!</td></tr>
      <tr><td><strong>RAID 5</strong></td><td>Block Striping + <strong>Distributed Parity (XOR)</strong> across all N drives</td><td><strong>N &minus; 1 disks</strong></td><td>Survives <strong>1 drive failure</strong>. Eliminates RAID 4 parity bottleneck; small random write requires 4 I/Os (read old data+parity, write new data+parity).</td></tr>
      <tr><td><strong>RAID 6</strong></td><td>Block Striping + <strong>Dual Distributed Parity (P+Q Reed-Solomon)</strong></td><td><strong>N &minus; 2 disks</strong></td><td>Survives <strong>2 simultaneous drive failures</strong>! Essential for massive modern TB arrays where a 2nd drive often fails during rebuild.</td></tr>
      <tr><td><strong>RAID 1+0 (10) vs 0+1</strong></td><td>Nested Striping + Mirroring</td><td><strong>N / 2 disks (50%)</strong></td><td><strong>RAID 1+0 (Stripe of Mirrors) beats RAID 0+1 (Mirror of Stripes)!</strong> Why? If 1 drive fails in RAID 0+1, an entire half-stripe degrades and losing ANY drive in the other half kills the array; RAID 1+0 tolerates losing 1 drive from <em>every</em> mirror pair!</td></tr>
    </tbody>
  </table>
</div>
""",
    },
    "deck_20": {
        "title": "FILE SYSTEM INTERFACE, INODES & DISK ALLOCATION",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapters 13, 14 &amp; 15 (§13.1–§13.4, §14.1–§14.7, §15.5)",
        "formulas": "Contiguous Map (B=512): Q = LA / 512, R = LA % 512, DiskBlk = Q + Start<br>UNIX Inode Max File Size = [Direct + Single + Double + Triple] &times; Block Size<br>Pointers per Index Block (P) = BlockSize / PointerSize<br>Bit Vector Block # = (BitsPerWord &times; FirstNonZeroWordIdx) + FirstFreeBitOffset",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 20 · FILE SYSTEMS &amp; STORAGE ALLOCATION · SILBERSCHATZ CH. 13, 14 &amp; 15</div>
    <h2 class="theory-heading">File System Interface, Directories, Allocation Methods, UNIX Inodes &amp; Free Space</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapters 13, 14 &amp; 15 (§13.1–§13.4, §14.1–§14.7, §15.5) · CPCS-361 Final Exam Core</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Identify core File Attributes, Operations, Open-File Tables (per-process vs. system-wide), Access Methods (§13.1–§13.2), and UNIX <code>rwx</code> octal protection (§13.4 / Slide 20).</li>
      <li>Compare the 5 Directory Structures (Single-Level, Two-Level, Tree, Acyclic Graph hard/soft links, General Graph) (§13.3).</li>
      <li>Trace File-System Layers (§14.1) and the <strong>Virtual File System (VFS)</strong> interface (§15.5).</li>
      <li>Compare <strong>Contiguous (with Q/R mapping &amp; Extents), Linked (FAT), and Indexed Allocation</strong> (§14.4).</li>
      <li>Calculate maximum file capacity in the <strong>UNIX Multi-Level Inode Scheme</strong> (§14.4.3).</li>
      <li>Master <strong>Free-Space Management</strong> (Bit Vector formula, Linked List, Grouping, Counting), <strong>Unified Buffer Cache</strong> (§14.6.2), and <strong>Journaling</strong> (§14.5–§14.7).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Tiered Shipping Manifests, Write-Ahead Ledgers &amp; Universal Plugs</div>
    <ul>
      <li><strong>Naive Designs &rarr; Visible Failure:</strong> Laying every file strictly contiguous on disk suffers external fragmentation and freezes file growth without full copies (§14.4.1). Pure linked lists cure fragmentation yet force slow <code>O(N)</code> pointer hops on random seeks—and 1 flipped sector loses the whole file tail! Updating metadata directly in-place crashes into hours-long full-disk <code>fsck</code> scans, and keeping un-unified Buffer + Page caches stores two conflicting copies of <code>mmap()</code>-ed files (§14.6.2)!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> A <strong>UNIX Inode (§14.4.3)</strong> is a tiered shipping manifest: 12 direct tracking numbers on page 1 for tiny files (1 hop!), plus single/double/triple nested binders stretching past 4 TB! <strong>VFS (§15.5)</strong> is a standardized wall socket (<code>vnode</code>) letting one <code>read()</code> syscall drive ext4, NTFS, or network NFS seamlessly. <strong>Journaling (§14.7.2)</strong> logs receipts in an append-only notebook before touching the main ledger. <em>Where analogies break:</em> Unlike human file folders, allowing general cyclic links breaks simple reference-count deletion (requiring garbage collection, §13.3.5).</li>
      <li><strong>Why Each Formula Exists:</strong> Contiguous <code>Q = LA / 512, Block = Start + Q, offset = R</code> gives zero-lookup O(1) disk arithmetic (Slide 20); Bit Vector <code>word*w + bit</code> uses &lt;0.003% RAM (<code>32 MB</code> for <code>1 TB</code>) to locate free runs in a single CPU bit-scan instruction (§14.5.1).</li>
    </ul>
  </div>

  <h3>1. File Concept, Open-File Tables &amp; Directory Structures (Ch. 13)</h3>
  <p>A <strong>File</strong> is a named collection of related information recorded on secondary storage. Its metadata (name, unique identifier number, type, disk location, size, protection, timestamps) lives in directory entries and the disk's <strong>File Control Block (FCB / UNIX Inode)</strong>. To avoid searching directories on every <code>read()</code>/<code>write()</code>, <code>open()</code> loads metadata into two kernel tables:</p>
  <ul>
    <li><strong>Per-Process Open-File Table:</strong> Tracks process-specific state (<strong>current file-position pointer</strong>, access mode R/W, pointer to system-wide entry) indexed by File Descriptor (FD).</li>
    <li><strong>System-Wide Open-File Table:</strong> Holds process-independent FCB metadata (file size, disk block pointers, dates, and an <strong>Open Count</strong> so deleting/closing only destroys the file once <code>open_count == 0</code>).</li>
  </ul>
  <p><strong>Directory Structures &amp; Protection (§13.3–§13.4):</strong> <em>Single-Level</em> (name collisions across users) &rarr; <em>Two-Level</em> (one directory per user, isolates names) &rarr; <em>Tree-Structured</em> (subdirectories, absolute vs. relative paths) &rarr; <em>Acyclic-Graph</em> (permits shared files/dirs via <strong>Hard Links</strong> sharing the same Inode + reference count vs. <strong>Symbolic/Soft Links</strong> holding a pathname string; watch out for dangling pointers!) &rarr; <em>General Graph</em> (cycles possible, needs garbage-collection cycle detection). <strong>UNIX File Protection (§13.4 / Slide 20):</strong> 3-bit octals for <code>owner / group / public</code>—e.g., <code>chmod 761 game</code> sets owner=<code>111 (rwx)</code>, group=<code>110 (rw-)</code>, public=<code>001 (--x)</code>, paired with <code>chgrp G game</code>.</p>

  <h3>2. File System Layers (§14.1) &amp; Virtual File System (VFS — §15.5)</h3>
  <div class="ascii-diagram">Application &rarr; Logical File System (Dirs, FCB/Inode, Protection)
            &rarr; [ VFS Interface (§15.5 uniform vnode abstraction over ext4, NTFS, NFS) ]
            &rarr; File-Organization Module (maps Logical Block # &rarr; Physical Disk Block #, Free Space)
            &rarr; Basic File System &amp; I/O Control (Device Drivers + Buffer Cache) &rarr; Hardware Disk</div>

  <h3>3. Disk Space Allocation Methods Compared (§14.4)</h3>
  <table class="data-table">
    <thead>
      <tr><th>Method</th><th>Mechanism</th><th>Sequential &amp; Random Access</th><th>Key Pros &amp; Cons</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Contiguous</strong></td><td>File occupies consecutive disk blocks <code>[start, length]</code>. (Slide 20 with 512 B blocks: <code>Q = LA / 512</code>, <code>DiskBlk = Start + Q</code>, byte offset = <code>R = LA % 512</code>.)</td><td>Sequential: <strong>Fastest!</strong><br>Direct/Random: <strong>O(1)</strong> (<code>start + i</code>).</td><td><strong>Suffers External Fragmentation</strong> &amp; hard to grow a file without copying! (Modern <em>Extents</em> like Veritas allocate contiguous chunks linked together to cure this!).</td></tr>
      <tr><td><strong>2. Linked Allocation</strong></td><td>Each block holds a pointer to the next block (file = linked list anywhere; clustering groups multiple blocks per pointer to shrink pointer overhead!).</td><td>Sequential: Good.<br>Direct/Random: <strong>TERRIBLE O(N)</strong> (must chase pointers!).</td><td><strong>Zero external fragmentation</strong>, easy growth. <em>Cons:</em> Pointer overhead (~4B/block) + 1 corrupted pointer loses rest of file.</td></tr>
      <tr><td><strong>FAT (File Allocation Table)</strong></td><td>Linked pointers pulled out of data blocks into a central table on disk <strong>cached in RAM</strong>!</td><td>Random access jumps straight through RAM FAT pointers before hitting disk!</td><td>Simple, zero external fragmentation, fast random seeks (still O(N) pointer walk in RAM, bottlenecked for multi-TB disks).</td></tr>
      <tr><td><strong>3. Indexed Allocation</strong></td><td>Puts all data block pointers into a per-file <strong>Index Block</strong>.</td><td>Sequential: Fast.<br>Direct/Random: <strong>O(1)!</strong></td><td><strong>Zero external fragmentation!</strong> Small files waste most of an index block; huge files outgrow 1 index block (fixed via Multi-Level Index!).</td></tr>
    </tbody>
  </table>

  <h3>4. UNIX Combined Scheme (Inode) &amp; Max File Size Calculation (§14.4.3)</h3>
  <p>A UNIX <strong>Inode</strong> combines direct pointers (zero extra disk hops for tiny files!) with multi-level indirect blocks for gigabyte/terabyte files:</p>
  <div class="ascii-diagram">INODE STRUCTURE (Example: 12 Direct + 1 Single Indirect + 1 Double Indirect + 1 Triple Indirect):
  [ 12 Direct Ptrs ] &rarr; Point directly to first 12 Data Blocks
  [ 1 Single Indir ] &rarr; Index Block &rarr; P Data Blocks
  [ 1 Double Indir ] &rarr; Outer Index Block &rarr; P Inner Index Blocks &rarr; P&sup2; Data Blocks
  [ 1 Triple Indir ] &rarr; Level-1 &rarr; P Level-2 &rarr; P&sup2; Level-3 &rarr; P&sup3; Data Blocks</div>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Worked Final Exam Problem: Calculate Max File Size for UNIX Inode</div>
    <p>Given: Block Size = <strong>4 KB (4,096 B)</strong>, Disk Block Pointer Size = <strong>4 Bytes</strong>, and Inode has <strong>12 Direct, 1 Single Indirect, 1 Double Indirect, 1 Triple Indirect</strong> pointer:</p>
    <ol>
      <li><strong>Pointers per Index Block (P):</strong> <code>4,096 B / 4 B = <strong>1,024 = 2<sup>10</sup> pointers</strong></code>.</li>
      <li><strong>Direct Capacity:</strong> <code>12 &times; 4 KB = 48 KB</code>.</li>
      <li><strong>Single Indirect:</strong> <code>2<sup>10</sup> &times; 4 KB = 1,024 &times; 4 KB = 4 MB</code>.</li>
      <li><strong>Double Indirect:</strong> <code>(2<sup>10</sup>)<sup>2</sup> &times; 4 KB = 2<sup>20</sup> &times; 4 KB = 4 GB</code>.</li>
      <li><strong>Triple Indirect:</strong> <code>(2<sup>10</sup>)<sup>3</sup> &times; 4 KB = 2<sup>30</sup> &times; 4 KB = <strong>4 TB</strong></code>.</li>
      <li><strong>Total Max File Size:</strong> <code>48 KB + 4 MB + 4 GB + 4 TB &approx; <strong>4.004 TB</strong></code>!</li>
    </ol>
  </div>

  <h3>5. Free-Space Management &amp; Recovery (§14.5–§14.7)</h3>
  <ul>
    <li><strong>Bit Vector (Bitmap):</strong> 1 bit per disk block (<code>1 = free, 0 = allocated</code>, or vice versa). Compact (1 TB disk with 4 KB blocks = 2<sup>28</sup> bits = only 32 MB bitmap) and fast hardware bit-scan instructions!
      <br><code>Block # = (Bits_per_word &times; First_nonempty_word) + First_1_bit_offset</code> (e.g., 32-bit words, word #2 has first 1-bit at offset 5 &rArr; Block <code>32 &times; 2 + 5 = <strong>69</strong></code>).</li>
    <li><strong>Linked Free List:</strong> Chains free blocks together using disk pointers (no extra bitmap RAM, slow to find contiguous runs).</li>
    <li><strong>Grouping:</strong> Stores addresses of <code>N</code> free blocks in the first free block; the <code>N</code>th address points to another block holding <code>N</code> more free addresses.</li>
    <li><strong>Counting (Run-Length):</strong> Stores pairs <code>(first_free_block, count_of_contiguous_free_blocks)</code>—great when contiguous allocation frees/allocates large runs!</li>
    <li><strong>Journaling (Log-Based File Systems):</strong> Writes metadata updates sequentially to a circular <strong>Journal Log</strong> before modifying disk structures; after a power crash, kernel replays committed journal entries in seconds instead of running an hours-long full-disk <code>fsck</code>!</li>
  </ul>
</div>
""",
    },
    "deck_21": {
        "title": "I/O SYSTEMS, POLLING, INTERRUPTS, DMA & KERNEL I/O",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapter 12 (§12.1–§12.5)",
        "formulas": "DMA Interrupt Rate = 1 interrupt per Block (vs 1 per Byte in PIO)<br>Total I/O Transfers per DMA = Direct Controller &harr; RAM via Cycle Stealing<br>Double Buffering: Overlaps CPU processing of Buffer A with DMA I/O fill of Buffer B",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 21 · HARDWARE &amp; KERNEL I/O · SILBERSCHATZ CH. 12 (§12.1–§12.5)</div>
    <h2 class="theory-heading">I/O Hardware, Polling vs. Interrupts vs. DMA, Application API &amp; Kernel I/O Subsystem</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Chapter 12 (§12.1–§12.5) · CPCS-361 Final Exam Core</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Trace I/O hardware communication over <strong>Ports, Buses, Controllers</strong>, and contrast Port-Mapped vs. <strong>Memory-Mapped I/O</strong> (§12.2–§12.2.1).</li>
      <li>Compare all <strong>3 Hardware I/O Transfer Mechanisms</strong>: <strong>Polling (PIO)</strong>, <strong>Interrupt-Driven I/O</strong>, and <strong>DMA</strong> (6-step transfer cycle, Fig. 12.6) (§12.2.2–§12.2.4).</li>
      <li>Classify OS Device Abstractions (Block vs. Character, Network, Clock) and <strong>Blocking vs. Nonblocking vs. Asynchronous I/O</strong> plus vectored <code>readv()</code> (§12.3.4–§12.3.5, Fig. 12.9).</li>
      <li>Master Kernel I/O Subsystem services: <strong>I/O Scheduling</strong> (Device-status table Fig. 12.10), <strong>Buffering (Single/Double/Circular)</strong>, <strong>Caching vs. Buffering</strong>, and <strong>Spooling</strong> (§12.4–§12.5).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Mailroom Doorbells, Freight Assistants &amp; Copy Isolation</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Checking <code>while (status.busy);</code> spins a GHz CPU core uselessly waiting milliseconds for a keyboard/disk (§12.2.2); raising an interrupt for <em>every single byte</em> during a 10 GB copy saturates CPU trap handlers (§12.2.4); issuing async writes directly out of a user's live array lets the app mutate buffer bytes mid-DMA!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> Picture the CPU as a busy executive and the disk controller as a distant mailroom: <strong>Polling</strong> means walking to the mailroom every microsecond; <strong>Interrupts (§12.2.3)</strong> install an <code>IRQ</code> doorbell checked between instructions; <strong>DMA (§12.2.4, Fig. 12.6)</strong> hands one signed work order (<em>command block</em>) to an assistant who wheels the whole crate directly into RAM (<em>cycle stealing</em>) and rings the doorbell <strong>once</strong> when done! <em>Where the analogy breaks:</em> Unlike human assistants stopping the boss, DMA cycle-stealing borrows RAM bus cycles while the CPU keeps computing inside registers and L1/L2 caches!</li>
      <li><strong>Why Each Distinction Exists:</strong> <strong>Buffer vs. Cache (§12.4.3):</strong> a Buffer may hold the <em>only</em> live copy of in-flight data, whereas a Cache always copies data safely backed elsewhere; <strong>Double Buffering (Slide 21 / §12.4.2):</strong> separates Kernel DMA buffer from User buffer via two copies so app writes never corrupt outbound DMA.</li>
    </ul>
  </div>

  <h3>1. I/O Hardware &amp; Controller Registers (§12.2–§12.2.1)</h3>
  <p>Devices communicate via a <strong>Port</strong> (connection point), shared <strong>Bus</strong> (PCIe/SATA daisy chain), and <strong>Device Controller</strong> electronics containing 4 internal registers:</p>
  <ul>
    <li><strong>Data-in Register</strong> (host reads from device) &amp; <strong>Data-out Register</strong> (host writes to device).</li>
    <li><strong>Status Register</strong> (bits: <code>busy</code>, <code>command-ready</code>, <code>data-available</code>, <code>error</code>).</li>
    <li><strong>Control Register</strong> (CPU writes commands: start read, change parity, seek).</li>
  </ul>
  <p><strong>Port-Mapped vs. Memory-Mapped I/O (§12.2.1):</strong> Legacy Port-Mapped I/O uses dedicated CPU instructions (<code>IN</code>/<code>OUT</code>). <strong>Memory-Mapped I/O</strong> maps device registers into the standard physical RAM address space (great for high-bandwidth GPUs/NVMe—regular store instructions write straight into frame buffers, protected by virtual-memory page tables!).</p>

  <h3>2. Polling vs. Interrupt-Driven I/O vs. DMA (§12.2.2–§12.2.4)</h3>
  <table class="data-table">
    <thead>
      <tr><th>Transfer Mode</th><th>Hardware Mechanism</th><th>When Best vs. Worst</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>1. Polling (Programmed I/O)</strong></td><td>CPU repeatedly spins checking <code>while (status.busy) ;</code> until device clears busy bit.</td><td><strong>Best</strong> when devices respond in nanoseconds (faster than paying interrupt+context-switch penalty!). <strong>Terrible</strong> on slow disks/keyboards (wastes 100% CPU!).</td></tr>
      <tr><td><strong>2. Interrupt-Driven I/O</strong></td><td>CPU executes user jobs until controller asserts <strong>Interrupt-Request Line</strong>; CPU jumps via IVT to ISR, handles byte/status, returns. Includes <strong>Nonmaskable (NMI)</strong> for critical hardware errors and <strong>Maskable</strong> (disabled during critical kernel sections) + <strong>Interrupt Chaining</strong> for shared vectors.</td><td>Efficient for slow/moderate sporadic I/O (mouse, keyboard, timers). Still burns excessive CPU interrupts if transferring gigabytes byte-by-byte!</td></tr>
      <tr><td><strong>3. Direct Memory Access (DMA)</strong></td><td>Dedicated <strong>DMA Controller</strong> (or <strong>DVMA</strong> on virtual-address IOMMU systems) moves entire memory blocks directly between controller buffer and RAM via bus <strong>cycle stealing</strong> without involving the CPU for each byte!</td><td><strong>Mandatory for high-bandwidth disks, NICs, GPUs!</strong> Drops interrupt rate by 4,096&times; (1 interrupt per 4 KB block instead of 4,096 interrupts!).</td></tr>
    </tbody>
  </table>

  <div class="callout callout-example">
    <div class="callout-title">🧮 Memorize the 6-Step DMA Transfer Cycle (Silberschatz Fig. 12.6)</div>
    <ol>
      <li>Device driver instructs disk controller to transfer disk data to a RAM buffer at address <code>X</code>.</li>
      <li>Disk controller initiates DMA transfer (or CPU writes target RAM address, direction, and byte count into DMA controller registers).</li>
      <li>Disk controller sends each byte/word to the <strong>DMA Controller</strong>.</li>
      <li>DMA controller <strong>cycle-steals</strong> the memory bus from the CPU (pausing CPU memory bus accesses briefly, never CPU cache work!) and writes bytes straight into RAM starting at <code>X</code>, incrementing address &amp; decrementing byte counter.</li>
      <li>When <code>byte_count == 0</code>, DMA controller raises <strong>ONE single hardware interrupt</strong> to signal the CPU!</li>
      <li>CPU interrupt handler checks status, moves blocked waiting process to <em>Ready</em> queue, and exits ISR.</li>
    </ol>
  </div>

  <h3>3. Application I/O Interface (§12.3.4–§12.3.5, Fig. 12.9)</h3>
  <ul>
    <li><strong>Block Devices</strong> (HDD, SSD, USB): Read/write fixed blocks (512B–4KB), support direct random seeking (<code>read/write/seek</code>), and memory-mapped access.</li>
    <li><strong>Character Stream Devices</strong> (Keyboard, Mouse, Serial Port): Send/receive unaddressed byte streams (<code>get/put</code>) without seeking; OSes also expose <code>ioctl()</code> for device-specific escape controls and vectored <code>readv()</code>/<code>writev()</code> scatter-gather (§12.3.5; note Slide 21 typos this as <code>readve()</code>).</li>
    <li><strong>Blocking vs. Nonblocking vs. Asynchronous I/O (§12.3.4, Fig. 12.9):</strong>
      <br>&bull; <strong>Blocking:</strong> Calling thread suspends (<em>Waiting</em> queue) until I/O finishes.
      <br>&bull; <strong>Nonblocking:</strong> Call returns <em>immediately</em> with whatever bytes are currently ready (or 0 / <code>EAGAIN</code>), often paired with <code>select()</code> polling multiple FDs.
      <br>&bull; <strong>Asynchronous:</strong> Call returns <em>immediately</em> so app keeps working while the kernel completes the <strong>entire</strong> I/O in the background and notifies via signal/callback when done!</li>
  </ul>

  <h3>4. Kernel I/O Subsystem (§12.4–§12.5)</h3>
  <table class="data-table">
    <thead>
      <tr><th>Kernel I/O Service</th><th>Textbook Mechanism &amp; Purpose</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>I/O Scheduling (§12.4.1)</strong></td><td>Reorders per-device wait queues tracked inside the kernel's <strong>Device-Status Table (Fig. 12.10)</strong> (routing disk queues through §11.2 schedulers) to boost aggregate throughput and fairness.</td></tr>
      <tr><td><strong>Buffering (§12.4.2)</strong></td><td>Memory area storing data in transit between two devices/app to handle <strong>(1) speed mismatch</strong> (modem vs SSD), <strong>(2) transfer-size mismatch</strong> (network packet reassembly), and <strong>(3) copy semantics</strong> (snapshot user buffer in kernel space before async disk write so app changes won't corrupt write!). <em>Double Buffering</em> keeps <strong>two separate copies</strong> (Kernel buffer + User buffer, Slide 21) so DMA fills cleanly while userspace reads/modifies safely!</td></tr>
      <tr><td><strong>Caching vs. Buffering</strong></td><td><strong>CRITICAL EXAM DISTINCTION:</strong> A <strong>Buffer</strong> may hold the <em>only existing copy</em> of a data item in transit; a <strong>Cache</strong> strictly holds a faster temporary <em>copy</em> of data that safely resides elsewhere!</td></tr>
      <tr><td><strong>Spooling &amp; Reservation</strong></td><td><strong>Spool (Simultaneous Peripheral Operations On-Line):</strong> Intermediate disk queue intercepting output for non-sharable sequential devices (printers) so multiple jobs appear to print concurrently without interleaving lines!</td></tr>
      <tr><td><strong>I/O Protection</strong></td><td>ALL I/O instructions are privileged (Kernel Mode only); users access devices exclusively through validated OS system calls.</td></tr>
    </tbody>
  </table>
</div>
""",
    },
    "deck_22": {
        "title": "SECURITY (CH. 16) & PROTECTION (CH. 17)",
        "citations": "Silberschatz, Galvin, Gagne — Operating System Concepts (10th Ed.), Chapters 16 (Security) &amp; 17 (Protection)",
        "formulas": "Access Matrix (Ch. 17 §17.5): M[Domain<sub>i</sub>, Object<sub>j</sub>] &sube; {read, write, execute, copy(*), owner, control, switch}<br>ACL (§17.6.2): Column-based (per Object) &rarr; Fast revocation | Capability (§17.6.3): Row-based (per Domain) &rarr; O(1) check, Hard revocation<br>Digital Signature (§16.4): Encrypt<sub>PrivateKey</sub>(Hash(Message))",
        "html": r"""
<div class="theory-article">
  <div class="theory-banner">
    <div class="theory-tag">DECK 22 · SECURITY &amp; PROTECTION · SILBERSCHATZ CH. 16 &amp; 17</div>
    <h2 class="theory-heading">Security Defenses (Ch. 16), Protection Domains, Lampson's Access Matrix &amp; ACLs/Capabilities (Ch. 17)</h2>
    <div class="theory-meta">Silberschatz 10th Ed. Ch. 16 (Security) &amp; Ch. 17 (Protection) + Slide 22 · CPCS-361 Final Exam Core</div>
  </div>

  <div class="callout callout-objectives">
    <div class="callout-title">🎯 Master Learning Objectives</div>
    <ul>
      <li>Distinguish <strong>Protection (Ch. 17)</strong> (internal access policies within the OS) from <strong>Security (Ch. 16)</strong> (defending against external/internal malicious attacks).</li>
      <li>Apply the <strong>Principle of Least Privilege (§17.2)</strong>, <strong>Protection Rings (§17.3)</strong>, and <strong>Domains</strong> + UNIX <code>setuid</code> (§17.4).</li>
      <li>Interpret <strong>Lampson's Access Matrix (§17.5, Fig. 17.5–17.6)</strong> rights: <code>copy (*)</code>, <code>owner</code>, <code>control</code>, and <code>switch</code> (Slide 22 calls <code>switch</code> <em>Transfer</em>).</li>
      <li>Compare <strong>Access Control Lists (ACLs)</strong> vs. <strong>Capability Lists</strong> vs. <strong>Lock-Key</strong> (§17.6), <strong>Revocation</strong> (§17.7), and <strong>RBAC</strong> (§17.8).</li>
      <li>Classify major OS threats (Trojans, Trapdoors, Logic Bombs, Spyware, Ransomware, RATs, <strong>Buffer Overflows</strong>, Worms, Viruses, DoS/DDoS, Theft of Service) &amp; Cryptography/Defenses (<strong>Ch. 16 §16.2–§16.6</strong>).</li>
    </ul>
  </div>

  <div class="callout callout-intuition">
    <div class="callout-title">💡 Intuition First: Interior Badge Architecture (Ch. 17) vs. Armored Couriers (Ch. 16)</div>
    <ul>
      <li><strong>Naive Solutions &rarr; Visible Failure:</strong> Leaving services <code>"open by default"</code> (Slide 22), running daemons as ambient root, trusting unbounded stack <code>strcpy()</code> buffers without NX/ASLR (§16.2.2, §16.6.7), and storing unsalted password hashes (§16.5.3) invite instant takeover—1 flipped return pointer hijacks control flow and unsalted hashes fall in milliseconds to Rainbow Tables!</li>
      <li><strong>Mental Model + Where It Breaks:</strong> <strong>Protection (Ch. 17)</strong> is a courthouse's interior badge design: nested <strong>Rings (<code>j &lt; i &rArr; D<sub>i</sub> &sub; D<sub>j</sub></code>)</strong> give inner Ring 0 supreme trust; an <strong>ACL (§17.6.2)</strong> is a guest list bolted to every <em>door</em> (instant deletion/revocation, slower door scan), whereas a <strong>Capability (§17.6.3)</strong> is an unforgeable VIP ticket carried by every <em>guest</em> (<code>O(1)</code> instant check, yet hard to revoke once copied!). <strong>Security (Ch. 16)</strong> guards outside perimeter attacks using <strong>TLS (§16.4.3)</strong>: slow armored RSA couriers safely exchange a fast AES session padlock key. <em>Where analogies break:</em> Public <strong>Password Salt (§16.5.3)</strong> does NOT need secrecy to block Rainbow Tables, and sandboxed guests can still signal secrets via covert timing channels (<em>Confinement Problem</em>)!</li>
      <li><strong>Why Each Rule Exists:</strong> Why Digital Signatures encrypt <code>Hash(M)</code> with the <strong>Private Key</strong> (only the sender can sign, everyone verifies with Public Key); why Capability revocation requires back-pointers, indirection tables, or expiring Lock-Keys (§17.7).</li>
    </ul>
  </div>

  <h3>1. Principles of Protection, Rings &amp; Domains (Ch. 17: §17.1–§17.4)</h3>
  <p><strong>Principle of Least Privilege (§17.2):</strong> Every program and every user should always operate with the <strong>minimum set of privileges</strong> necessary to complete its intended task (constrains damage from bugs or compromise). Note Silberschatz 10th Ed. organizes <strong>Protection in Chapter 17</strong> and <strong>Security in Chapter 16</strong> (reversed from 9th Ed.!). Hardware/OS supports layered <strong>Protection Rings (§17.3 / Slide 22: Ring 0..3 where inner ring <code>j &lt; i</code> includes all outer domains <code>D<sub>i</sub> &sub; D<sub>j</sub></code>)</strong> and <strong>Protection Domains (§17.4)</strong> defining sets of <code>&lt;object, rights&gt;</code> pairs—including UNIX <strong><code>setuid</code> (§17.4.2)</strong> where running <code>/usr/bin/passwd</code> temporarily elevates effective UID to <code>root</code>, then drops privilege on exit.</p>

  <h3>2. Lampson's Access Matrix &amp; Dynamic Rights (§17.5, Fig. 17.5–17.6)</h3>
  <p>Protection policies generalize cleanly into a matrix <code>M</code> where <strong>Rows = Protection Domains (D<sub>i</sub>)</strong> and <strong>Columns = Objects (Files F<sub>1</sub>–F<sub>3</sub>, Printer, Domains D<sub>1</sub>–D<sub>4</sub>)</strong> (matching Silberschatz Fig. 17.5–17.6 &amp; Slide 22; Slide 22 labels domain switching <em>Transfer</em>):</p>
  <table class="data-table">
    <thead>
      <tr><th>Domain \ Object</th><th>F<sub>1</sub></th><th>F<sub>2</sub></th><th>F<sub>3</sub></th><th>printer</th><th>D<sub>1</sub></th><th>D<sub>2</sub></th><th>D<sub>3</sub></th><th>D<sub>4</sub></th></tr>
    </thead>
    <tbody>
      <tr><td><strong>D<sub>1</sub></strong></td><td>read, copy(*)</td><td></td><td>read</td><td></td><td></td><td><strong>switch</strong></td><td></td><td></td></tr>
      <tr><td><strong>D<sub>2</sub></strong></td><td></td><td><strong>owner</strong></td><td></td><td>print</td><td></td><td></td><td>switch, <strong>control</strong></td><td>switch</td></tr>
      <tr><td><strong>D<sub>3</sub></strong></td><td></td><td>read*</td><td>execute</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td><strong>D<sub>4</sub></strong></td><td>write</td><td></td><td>read</td><td>print</td><td></td><td></td><td></td><td></td></tr>
    </tbody>
  </table>
  <ul>
    <li><strong>Switch Right:</strong> Entry <code>switch</code> in <code>M[D<sub>1</sub>, D<sub>2</sub>]</code> authorizes a process running in D<sub>1</sub> to switch execution into Domain D<sub>2</sub>.</li>
    <li><strong>Copy Flag (<code>*</code>):</strong> Allows domain D<sub>i</sub> to copy <em>that exact right</em> into another row of the <strong>same column</strong> (may transfer as copyable <code>*</code> or non-copyable!).</li>
    <li><strong>Owner Right:</strong> Allows a domain to add or remove <em>any</em> access right across any row in that object's column.</li>
    <li><strong>Control Right:</strong> Applies specifically to Domain objects (<code>M[D<sub>2</sub>, D<sub>3</sub>] = control</code> lets D<sub>2</sub> add or remove <em>any right inside row D<sub>3</sub></em>!).</li>
  </ul>

  <h3>3. Access Matrix Implementations, Revocation &amp; RBAC (§17.6–§17.8)</h3>
  <div class="compare-grid">
    <div class="compare-card">
      <h4>Access Control Lists (ACLs — Column-Wise, §17.6.2)</h4>
      <p>Every <strong>Object</strong> stores a list of <code>&lt;Domain, Rights&gt;</code> pairs (used by UNIX/Linux extended ACLs, Windows NTFS).<br><em>Pros:</em> <strong>Instant Revocation!</strong> Simply delete user's entry from the file's header.<br><em>Cons:</em> Determining "all objects domain D can access" scans the entire disk; checking on every read can be slower than capabilities (usually checked once at <code>open()</code>!).</p>
    </div>
    <div class="compare-card">
      <h4>Capability Lists (C-Lists — Row-Wise, §17.6.3)</h4>
      <p>Every <strong>Domain/Process</strong> carries unforgeable cryptographically/kernel-protected tokens called <strong>Capabilities</strong> (pointer + rights).<br><em>Pros:</em> <strong>O(1) instant permission verification</strong>—presenting the capability token IS proof of right!<br><em>Cons:</em> <strong>Hard Revocation!</strong> Object has no list of who copied tokens! (§17.7 revocation axes: <em>Immediate/Delayed, Selective/General, Partial/Total, Temporary/Permanent</em> via Reacquisition, Back-Pointers, Indirection Tables, or Lock-Key!).</p>
    </div>
  </div>
  <p><strong>Lock-Key Mechanism (§17.6.4):</strong> Hybrid approach—every object gets unique bit patterns (locks), and every domain holds matching bit patterns (keys); changing an object's lock bit immediately invalidates stale keys cleanly. Modern enterprises pair these with <strong>Role-Based Access Control (RBAC, §17.8)</strong> assigning permissions to job <em>roles</em> rather than individuals.</p>

  <h3>4. Security Threats &amp; Cryptographic Defenses (Ch. 16: §16.1–§16.6)</h3>
  <p>Security protects systems across core CIA triad violations (<strong>Confidentiality</strong>, <strong>Integrity</strong>, <strong>Availability</strong> plus <strong>Theft of Service</strong> &amp; <strong>Privacy</strong>; design rule: default <em>secure by default</em> rather than open by default!)—backed by Authentication (§16.5).</p>
  <table class="data-table">
    <thead>
      <tr><th>Threat Category (Ch. 16: §16.2–§16.3)</th><th>Mechanism &amp; OS Defense</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Trojan / Spyware / Ransomware / RATs / Logic Bomb (§16.2)</strong></td><td><em>Trojan:</em> Useful app hiding malicious payload; <em>Spyware:</em> covert telemetry/adware (~80% of spam ties to trojan botnets, Slide 22); <em>Ransomware:</em> encrypts files demanding ransom; <em>RAT:</em> Remote Access Trojan; <em>Trapdoor:</em> secret bypass; <em>Logic Bomb:</em> fires on trigger.</td></tr>
      <tr><td><strong>Stack / Buffer Overflow (§16.2.2)</strong></td><td>Writing past a fixed stack buffer overwrites the <strong>Saved Return Address</strong> so <code>RET</code> jumps straight into injected attacker shellcode!<br><em>OS Defenses (§16.6.7):</em> <strong>DEP / NX Bit</strong> (marks stack non-executable), <strong>ASLR</strong> (randomizes stack/heap/libc addresses every boot to foil ROP), <strong>Stack Canaries</strong>.</td></tr>
      <tr><td><strong>Virus vs. Worm (§16.2–§16.3)</strong></td><td><strong>Virus:</strong> Parasitic code embedded inside an executable host file; spreads when users run/copy infected files. <strong>Worm:</strong> Standalone self-replicating network process exploiting vulnerabilities automatically without host files (e.g., Morris Worm, WannaCry).</td></tr>
      <tr><td><strong>DoS / DDoS &amp; Port Scan (§16.3)</strong></td><td><strong>DoS / SYN Flood:</strong> Floods server half-open TCP connections or bandwidth, violating <em>Availability</em>. <strong>Port Scanning:</strong> Automated probing of TCP/UDP ports for vulnerable listeners.</td></tr>
    </tbody>
  </table>

  <div class="callout callout-definition">
    <div class="callout-title">🔐 Cryptography, Salting &amp; Defense-in-Depth (Ch. 16: §16.4–§16.6)</div>
    <ul>
      <li><strong>Symmetric Encryption (e.g., AES, §16.4.1):</strong> Single shared secret key encrypts &amp; decrypts. Extremely fast for bulk data, but requires secure out-of-band key distribution.</li>
      <li><strong>Asymmetric / Public-Key Encryption (e.g., RSA, §16.4.2):</strong> Public key encrypts, only matching Private key decrypts! Solves key distribution cleanly (often combined with TLS §16.4.3 to exchange a fast symmetric <em>session key</em>!).</li>
      <li><strong>Digital Signatures (§16.4.1.3):</strong> Compute cryptographic <strong>Hash (SHA-256)</strong> of message, then encrypt digest with sender's <strong>Private Key</strong> &rarr; proves both <em>Authenticity</em> and <em>Integrity / Non-repudiation</em>.</li>
      <li><strong>Password Salting &amp; Defense-in-Depth (§16.5.3, §16.6):</strong> Random per-user <strong>Salt</strong> hashed alongside passwords defeats precomputed Rainbow Tables; layer with <strong>MFA</strong>, <strong>Firewalls (§16.6.6)</strong> (Stateful packet inspection), and <strong>IDS</strong> (Signature vs. Anomaly detection).</li>
    </ul>
  </div>
</div>
""",
    },
}
