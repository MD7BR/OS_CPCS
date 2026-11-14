# Interactive Metroidvania Study Companion — Universal Process & Engineering Blueprint

> **Purpose**: A complete, reusable blueprint documenting every architectural rule, pedagogical mechanic, QOL feature, simulator/handwritten-math pattern, visual/CSS invariant, build workflow, and automated verification gate forged while building **KERNEL//BREACH** (CPCS-361 Operating Systems). Feed this Markdown alongside a course's textbook and slide deck syllabus to build an equivalent single-file interactive study trove for **any subject**.

---

## 1. Core Philosophy & Hard Content Rules

Most study apps fail in one of two ways: they are either passive slide summaries that strip out 99% of textbook depth, or generic SaaS flashcard pages with static tables. This architecture enforces four non-negotiable principles:

1. **Textbook-First Knowledge Trove (Zero-Truncation & Zero-Guessing Rule)**:
   - Never condense an entire lecture or midterm unit into a 3-minute bullet summary.
   - **Never rely on slide filenames or AI parametric memory alone** when the actual textbook PDF or lecture slides are available on disk! Extract and inspect the real textbook TOC/sections and professor slide decks (e.g., via `pdftotext` chapter-by-chapter / deck-by-deck) so every section number (`§X.Y`), formal definition, algorithm tie-breaker, worked dataset, and notation matches the authoritative book and professor's slides verbatim.
   - Every topic module must be an exhaustive study chapter (`~3,000–6,000+` characters of structured HTML): Intuition-First Hook, Learning Objectives, Verbatim Textbook Definitions, physical mental models (plus where analogies break), step-by-step derivations, trace tables, comparison grids, code/pseudocode blocks, ASCII/SVG diagrams, and **Common Exam Traps**.
2. **Offline-First Single-File Delivery (`file://` Clean)**:
   - The final deliverable must run directly when opened locally in a browser via `file://` with **zero build step required by the student** and **zero external runtime JS dependencies** (no React/Vue/CDN scripts or external JSON `fetch()` calls that fail under CORS on `file://`).
   - All data, styles, logic, WebAudio synth effects, and SVG graphics compile into a single self-contained `index.html`.
   - Fonts loaded from CDNs must always declare clean system monospace/sans fallbacks (`'JetBrains Mono', 'Fira Code', monospace`) so offline rendering never breaks.
3. **Every Topic Is a Living Machine**:
   - Wherever a subject contains an algorithm, state transition, protocol, circuit, equation, proof step, or calculation, build a **bespoke interactive simulator** with live **playable parameters** and **"As Written By Hand"** exam workings—never just a static summary box.
4. **Preserve Study Agency (Zero Lock-In)**:
   - Gamification and ability gates must motivate exploration without ever blocking urgent exam prep. Always pair guided progression with instant linear search access and **Red Pill / Blue Pill** overrides.

---

## 2. The End-to-End 6-Phase Build Process

When creating a companion for a new subject, follow this exact sequence to protect context limits, keep content exhaustive, and prevent subtle DOM/CSS bugs:

### Phase 1 — Source PDF Extraction, Curriculum Graph & Skeleton
1. **Extract Real Course Sources (No Memory-Only Guessing)**: Dump the textbook Table of Contents and inspect target chapter page ranges alongside each lecture PDF (`pdftotext`) and past/mock exam rubrics into indexed plain-text scratch files so later authoring reads exact equations, figure numbers, slide examples, and professor notation directly—without blowing context by loading an entire 900-page PDF at once.
2. Map decks/chapters into **5–8 Sectors** (major thematic units) and **15–25 Topic Nodes**.
3. Define **Capability Unlocks** per node (conceptual tools the student earns that unlock downstream cross-sector mechanics) and build the **Dual-Mode Map Skeleton** + persistent `localStorage` state schema.

### Phase 2 — Subject Shell, Theme Tokens & Audio/UI Framework
1. Establish a subject-appropriate diegetic aesthetic (hardware/oscilloscope telemetry, laboratory notebook, architectural blueprint, etc.) rather than generic light-gray SaaS cards.
2. Lock down the **Complete CSS Variable Contract** across dark themes AND a crisp high-contrast **Light Mode** before writing any simulator markup (Section 5).
3. Wire global utilities: **Master Formula Sheet**, **A–Z Searchable Glossary**, **Mock Exam Simulator**, **Operator Profile**, **Weak-Spot Raid / Sector Boss Arena**, and **6-Step Interactive Tutorial**.

### Phase 3 — Modular Authoring in Split Build Files (Never Edit Huge Raw JSON Directly)
Split authoring into clean, focused source modules inside `workspace_build_src/` instead of hand-editing an 8,000+ line HTML file:
* `part1_decks_XX_YY.py`, `part2_...`, `part3_...`: Textbook-deep Theory HTML + governing formulas partitioned into 6–8 decks per file so each unit receives full textbook depth without hitting output truncation.
* `part4_quizzes_formulas_glossary.py`: Non-placeholder MCQs (`>= 5` per deck, each citing exact textbook sections), Formula Sheet entries, and Glossary terms merged cleanly with base terms.
* `part5_teaching_trove.py`: 4-color `KEYWORDS_LEXICON` + per-deck `TEACHING_TROVE_DATA` (Bug Hunts, Inline Sabotage, Socratic Pause & Predict).
* `build_and_inject.py`: Validates every invariant (Section 10) and deterministically injects compiled JSON payloads into `index.html`.

### Phase 4 — Bespoke Simulators + "As Written By Hand" Workings
1. Build per-module simulators (`W1..Wn`) with synchronized sliders, direct numeric inputs, and inline editable tables.
2. Add `.handwritten-sheet` step-by-step paper derivations to every numerical simulator AND embed `.formula-sandbox` calculators inside matching Theory `.formula-display` boxes.

### Phase 5 — Active Pedagogy, Gamification & QOL Polish
Wire semantic keyword colorization, character-offset persistent user highlighting, Recall Blur cloze chips, Lecture Sabotage hunting, XP/rank/combo streaks/medals, Boss raids, Markdown notes export, JSON backup, and keyboard shortcuts.

### Phase 6 — Automated Pre-Flight Verification & File Sync
Run all 4 verification gates (Section 10) after **every** code/content edit, and ensure any user-opened copy (e.g., in `Downloads/`) is verified in sync byte-for-byte with the workspace `index.html`.

---

## 3. Dual-Navigation Architecture & The Red/Blue Pill Protocols

A single top-level HUD switch (`TAB` or `M`) flips seamlessly between two views sharing one persistent `state` object:

### Mode A — Metroidvania Spatial Map
* Interactive pan-and-zoom world (`drag` obsidian canvas, `scroll` / `+` / `-` / `CENTER`) showing all Sectors, dependency conduits (orthogonal SVG paths), and clickable IC/Module nodes.
* **Cross-Sector Capability Gates**: Early nodes grant conceptual "capabilities" required to unlock later nodes across sectors (e.g., mastering *Preemption* unlocks the gate into *Concurrency Race Conditions*; mastering *Paging* unlocks the gate into *Mass Storage Swap*).
* **HUD Widgets**: Live **Capabilities Grid** (`X / N`) and clickable **Sector Radar Matrix** (`S1..S7`, launching each sector's Boss Gauntlet).

### Mode B — Linear Exam Track
* Clean vertical card list strictly matching lecture & syllabus sequence—all rooms immediately accessible for exam cramming.
* **Live Search + Filter Chips**:
  * `ALL` · `MIDTERM` · `FINAL` · `FLAGGED (⭐)` · `INCOMPLETE (🔧)` · `UNSOLVED BUGS (🐞)` · `S1..S7` Sector filters.
  * Each card displays mini telemetry pills: `Quiz x/5`, `Bugs x/2`, `Sabotage ✓`, `⭐ Flagged`, `🖍️ N Highlights`, `📝 Notes`, plus textbook chapter/section citations.

### The Pill Protocols (Zero-Friction State Controls)
| Control | Action | Critical Protection Rule |
| :--- | :--- | :--- |
| **💊 Red Pill ("Wake Up / Learn All")** | Immediately unlocks all modules, marks every node mastered, and grants all capabilities. | Preserves earned notes/highlights and updates achievements & all HUD views cleanly. |
| **💊 Blue Pill ("Forget Everything")** | Requires explicit `confirm()`. Wipes earned XP, rank, combo streak, medals, quiz/bug/sabotage clears back to the starting deck. | **MUST preserve user `notes` and `highlights`** (and keep `tutorialSeen = true`) so students never accidentally lose written study notes. |

---

## 4. Standardized 3-Tab Room Workbench + Codex Sidebar

Clicking any map node or linear card opens the full-screen Workbench Overlay without losing background context:

* **Top Action Bar**:
  * Breadcrumb (`SECTOR`, `DECK ##`, `Title`)
  * Adjacent navigation: `← PREV` (`[`), `NEXT →` (`]`), `☆ FLAG` (bookmark for weak-topic review), `SYNTHESIZE CAPABILITY`, `CLOSE` (`ESC`)
  * Continuous **Reading Scroll Progress Bar** (`0%..100%`) pinned across the top edge while scrolling long lectures.
* **Three Standardized Tabs (`1`, `2`, `3` hotkeys)**:
  1. **Tab 1 (`1`) — Interactive Simulator Lab**: Live custom machine (`W1..Wn`) with anomaly banner, playable controls, SVG/canvas diagram, and handwritten workings.
  2. **Tab 2 (`2`) — Textbook Theory & Active Pedagogy**: Pedagogy Toolbar + Sabotage Banner (when active) + full lecture article + embedded Formula Sandboxes + bottom `Teach Zone` (2 Bug Hunts + 2 Socratic checks).
  3. **Tab 3 (`3`) — Exam Drill (Practice Quiz)**: 5+ non-placeholder MCQs per deck with instant answer validation, streak tracking, rubric explanations citing the textbook, and best-score tracking (`quizScores[deckId]`).
* **Right Rail — Reference Codex Drawer**:
  * **Room Clearance Telemetry** (Sim Inspected ✓, Exam Drill Best `x/5`, Bug Hunts `x/2`, Sabotage Caught)
  * **Textbook Correlation** (Edition, Chapter, Sections) + **Slide Deck Source Filename**
  * **Governing Formulas** quick reference
  * **Pedagogical Synopsis** & Capability Unlock preview
  * **Auto-Saved Personal Deck Notes** (`<textarea>` synced on `input`) + `⬇ Export Notes (.md)`

---

## 5. Visual System, CSS Variable Contract & Theme Safety Rules

### 5.1 Hardware / Bespoke Aesthetic Rules
* **Anti-SaaS Prohibitions**: Never use plain white rounded bootstrap cards with soft grey drop shadows, generic purple-blue hero gradients, unstyled default scrollbars, or generic `Inter` without contrast hierarchy.
* **Typography Pairings**: Display headers (uppercase, tracked `+0.08em`), Crisp ligature Monospace for telemetry/math/code (`font-variant-numeric: tabular-nums` so counters never jitter horizontally), readable body copy with adjustable font scale (`11px..18px`), chamfered panels (`panel-chamfer`), and a `📺 CRT / FLAT` toggle.
* **Offline Math Formatting Invariant**: Never embed raw LaTeX delimiters (single/double dollar-sign math wrappers, `\frac`, `\tau`, `\alpha`, `\implies`, `\le`, `\text`, tabs) inside rendered HTML strings unless an offline math renderer is bundled. Use semantic HTML + Unicode (`≤`, `≥`, `≠`, `×`, `÷`, `−`, `→`, `↔`, `≈`, `∑`, `∞`, `α`, `τ`, `ε`, `Δ`, `σ`, `π`, `<sub>`, `<sup>`, `<pre>`).

### 5.2 Complete CSS Variable Contract (Lesson Learned!)
**Never split theme tokens and simulator tokens.** If legacy or simulator code uses `--primary`, `--bg-card`, `--text-main`, `--danger`, etc., define **both** sets of aliases explicitly across `:root` AND **every `[data-theme="..."]` selector** (e.g., `cyan`, `amber`, `matrix`, `cobalt`, `light`):

```css
:root {
  /* Core Palette */
  --bg-deep: #05070A;
  --bg-silicon: #090D15;
  --bg-panel: #0E1420;
  --bg-panel-elevated: #151D2E;
  --border-trace: #24324D;
  --border-light: #38507A;
  --border-active: #00F0FF;

  /* Signal Phosphors */
  --color-cyan: #00F0FF;
  --color-amber: #FFB000;
  --color-crimson: #FF2A54;
  --color-emerald: #00FFA3;
  --color-purple: #B55FE6;

  /* Text Hierarchy */
  --text-primary: #EDF2F7;
  --text-secondary: #8E9EB5;
  --text-muted: #4B5A70;

  /* Simulator & Component Aliases (Mandatory across ALL themes!) */
  --primary: var(--color-cyan);
  --primary-glow: rgba(0, 240, 255, 0.16);
  --on-primary: #041016;       /* Text color drawn ON solid --primary fills */
  --bg-card: var(--bg-panel-elevated);
  --bg-body: var(--bg-deep);
  --bg-input: var(--bg-panel);
  --bg-sidebar: var(--bg-silicon);
  --border: var(--border-trace);
  --text-main: var(--text-primary);
  --text-dim: var(--text-secondary);
  --danger: var(--color-crimson);
  --danger-bg: rgba(255, 42, 84, 0.14);
  --warning: var(--color-amber);
  --warning-bg: rgba(255, 176, 0, 0.14);
  --success: var(--color-emerald);
  --success-bg: rgba(0, 255, 163, 0.14);
  --p2-col: var(--color-purple);
}
```

### 5.3 Light Theme & SVG Contrast Rules
* Inside SVG diagrams and HTML5 `<canvas>`, **never hardcode `#000`, `#111`, `#FFF`, or dark inline hexes without CSS variables**.
  * Box fills -> `var(--bg-card)` or `var(--bg-panel)`
  * Borders/arrows -> `var(--border-light)` or `var(--primary)`
  * Primary text -> `var(--text-primary)` / `var(--text-secondary)`
  * Text centered inside solid `--primary` circles/bars -> **`var(--on-primary)`** (dark ink on bright neon themes; crisp white on Light mode).
* Explicitly override `.sim-card`, `.panel-chamfer`, `code`, `.play-controls-bar`, and `.handwritten-sheet` (switching dark phosphor paper to warm cream ruled exam paper `#FFFDF7` with blue rule lines & red ink headers) under `[data-theme="light"]`, and auto-hide CRT scanline overlays in Light mode.
* Every button/badge CSS class used anywhere in simulators (`.btn`, `.btn-primary`, `.btn-sm`, `.btn-industrial`, `.nav-badge`, `.btn-mini`) **must** exist in `<style>`. Zero unstyled native browser white buttons!

---

## 6. Playable Controls & "As Written By Hand" Calculation Standard

Every quantitative module and formula must go beyond fixed presets so students can plug in arbitrary homework or past-exam numbers and verify **exact manual exam steps**:

### 6.1 Synchronized Playable Parameter Controls
Pair visual manipulation with exact numeric entry cleanly across a `.play-controls-bar`:
1. **Slider + Direct Number Pair (`.play-range` + `.play-num`)**: Every scalar parameter (cores `N`, serial fraction `S`, alpha `α`, quantum `q`, initial semaphore value, frames `F`, start cylinder, file size, block size, TLB hit ratio `α`, RAM access `m`) renders both a range slider AND a direct `<input type="number">` bound bidirectionally (`oninput`).
2. **Inline Editable Tables (`.cell-num`)**: In matrix/schedule tables (e.g., CPU Scheduling `AT`/`BT`/`Priority`, Banker's `Allocation`/`Max`/`Available`), make input columns editable directly inside table cells.
   * **DOM Focus Preservation Invariant**: When the user edits a `.cell-num` live, update only computed output `<td>` cells (`textContent`), summary banners, Gantt/SVG diagrams, and handwritten derivations in-place (`preserveInputs = true`) rather than rebuilding `tbody.innerHTML` and kicking focus out of the active `<input>`.
3. **Editable Sequences & Presets (`.play-text`)**: Reference strings, disk cylinder queues, and hole/process size lists must accept comma/space-separated text input alongside 1-click textbook/exam presets (plus `+ Add` / `×` Remove row buttons where row counts vary).

### 6.2 "As Written By Hand" Derivation Sheet (`.handwritten-sheet`)
Style as lined exam notebook paper (`repeating-linear-gradient` ruled lines + margin stripe). Every calculator output follows this strict 4-step exam layout:
1. **Title Row (`.hw-title`)**: Algorithm/law name + textbook rule reminder.
2. **Formula Line**: Exact symbolic formula first (e.g., `TAT = CT − AT`, `Need[i] = Max[i] − Alloc[i]`, `Speedup ≤ 1 / [ S + (1 − S) / N ]`, `EAT = (1 − p) × m + p × PFT`).
3. **Verbatim Substitution + Intermediate Sums (`.hw-step` / `.hw-sub`)**: Show **every term before simplifying**—never jump straight from inputs to a single float!
   * Sums & Fractions: `Avg WT = (6 + 0 + 16 + 18 + 1) / 5 = 41 / 5 = 8.20 ms`
   * Absolute Differences: `|53 − 98| + |98 − 183| + ... = 45 + 85 + ...`
   * Step-by-step Safety/Fit/Page Eviction trace showing *why* each item succeeds, skips, waits, or faults.
4. **Boxed Final Answer + Edge Warnings (`.hw-ans` / `.hw-warn`)**: Box the final numeric result with units and flag traps automatically (e.g., Unsafe State rollback reason, Belady's Anomaly spike comparing `3` vs `4` frames, Amdahl's `1/S` upper limit).

### 6.3 Embedded Theory Formula Sandboxes (`.formula-sandbox`)
In addition to dedicated Tab 1 Simulators, dynamically attach compact interactive **sliders + number inputs + live handwritten derivation** inside matching `.formula-display` callouts inside Tab 2 Theory (e.g., `Amdahl's Law`, `Exponential Averaging`, `Aging`, `Page Split & TLB EAT`, `Demand Paging EAT`).

### 6.4 Axis & Gantt Anti-Overlap Rule
For timeline SVGs (Gantt charts, waveforms, seek paths), draw explicit boundary tick markers at **every event transition (`0..Total`)**, and stagger alternating tick labels vertically (`y = base + (idx % 2) * 11`) whenever consecutive labels sit within minimum pixel spacing (`< 18px`) so numbers never collide.

---

## 7. Active Pedagogy & Intuition-Building Engine

Facts memorized blindly collapse the moment an exam tweaks one constraint. Every module combines an **Intuition-First Ladder (7.0)** with **5 Active Reading Tools (7.1–7.5)** controlled from `#pedagogy-toolbar-root`:

### 7.0 The 5-Part Intuition-Building Ladder (Discovery Before Formalism)
Never drop a formal equation or final algorithm onto the screen cold. Structure every concept around five intuition builders:
1. **Concreteness Before Formalism ("Naive Attempt → Visible Failure")**: Start with the obvious/naive human design (e.g., solving Mutual Exclusion with just `turn`, serving processes in FCFS arrival order, granting every safe-looking resource greedily, using a single flat page table) and trace or simulate **exactly how it breaks** first. Once the student feels the pain of the bug, the textbook's real mechanism reads as an *inevitable engineering necessity* rather than arbitrary trivia to cram.
2. **Physical Mental Model + "Where the Analogy Breaks"**: Pair abstract concepts with a concrete everyday analogy (e.g., TLB = sticky-note speed-dial vs. walking down the hall to the phonebook; Semaphore = bin of identical restroom keys vs. Mutex ownership badge; Thrashing = spending 55 minutes swapping binders out of storage and 5 minutes studying). Always add a crisp warning showing **where the analogy stops holding** so intuition never misleads on trick questions.
3. **Plain-English Equation Translation ("Every Symbol Tells a Story")**: Before simplifying numbers, translate every term in an equation into physical causality (e.g., in `EAT = (1 − α)(ε + 2m) + α(ε + m)`, `2m` means you pay RAM *twice* on a TLB miss: once to read the Page Table, once to fetch the actual byte). Live playable sliders in `.formula-sandbox` reinforce this kinesthetically.
4. **"Predict Before You Simulate" Surprise Hooks**: Prompt a falsifiable intuition bet *before* clicking Run or dragging a slider (e.g., *"Will increasing frames from 3 to 4 ALWAYS cut FIFO page faults?"*, *"Can 1,000 CPU cores give > 5× speedup if 20% of the task is serial?"*), letting the simulator create memorable **cognitive surprise** when common intuition fails (Belady's Anomaly, Amdahl's asymptote).
5. **"Knock Out One Pillar" Sensitivity Checks**: Explicitly demonstrate what fails when a single rule changes (`wait(mutex)` before `wait(empty)`, removing *Hold & Wait* vs. *Circular Wait*, lowering Time Quantum `q` below context-switch time).

### 7.1 4-Color Semantic Keyword System (`KEYWORDS_LEXICON`)
* Partition essential domain terminology into **4 visual color classes** consistent across all decks:
  * `.kw-hw` (Cyan): Hardware primitives, physical mechanisms, low-level components
  * `.kw-hazard` (Crimson): Failures, anomalies, errors, attacks, performance cliffs
  * `.kw-sync` (Emerald): Algorithms, protocols, synchronization, invariants, solutions
  * `.kw-struct` (Amber): Abstract models, tables, schedulers, mathematical structures
* **Matching Rules**:
  * Sort `KEYWORDS_LEXICON` **longest-phrase-first** before compiling a word-boundary `RegExp` so `"Translation Lookaside Buffer"` wins before `"Buffer"`.
  * **DOM Exclusion List**: Never wrap inside `<script>`, `<style>`, `<pre>`, `<code>`, `<mark>`, headings `<h1>–<h4>`, `<button>`, `<input>`, `<select>`, `.theory-banner`, `.callout-title`, `.teach-zone`, `.pedagogy-toolbar`, `.sabotage-correction-box`, `.formula-sandbox`, or `.handwritten-sheet`.

### 7.2 Persistent Character-Offset User Highlighter
Highlighting DOM nodes directly breaks as soon as keyword spans toggle or content re-renders. Instead, store highlights per deck as **merged, non-overlapping plain-text character intervals** `[{ id, start, end, color }]`:
* **Dual Interaction Modes**:
  1. **Select -> Click Swatch**: Prevent default `mousedown` on `.pen-swatch-btn` so clicking the color button does **not** collapse the active text `Selection`!
  2. **Click Swatch (Empty Selection) -> Live Brush Mode**: Clicking a pen with no text selected toggles active brush painting on `mouseup`.
* **4 Pen Labels + Eraser**: e.g., `Core` (yellow), `Proof` (green), `HW/Trap` (cyan), `Critical` (pink), plus `⌫ Eraser`, `Alt+Click` quick erase on any `<mark>`, `Clear`, and a clickable `🔖 Marks` drawer listing highlighted snippets with `scrollIntoView()`.
* **Strict Offset Stability Rule**: When computing plain-text offsets (`collectOffsetTextNodes`), **skip `.sabotage-correction-box` and `.formula-sandbox`** so live interactive widgets injected inside the lecture never shift user highlight offsets! Disable new highlight creation while `Sabotage Mode` is active with a toast explanation so offsets always align with canonical lecture text.

### 7.3 "Sprinkle a Mistake" (Silent Inline Lecture Sabotage)
* Each deck specifies **1 `{ find, corrupt, why }` triple** in `TEACHING_TROVE_DATA`.
* `find` must match an exact substring **count === 1** in the clean lecture HTML; `corrupt` replaces a realistic nuance (flipped inequality, swapped complexity, inverted lock condition, wrong column/row rule) with **zero visual badge or hint**.
* Clicking a non-sabotaged paragraph/cell triggers a brief crimson shake (`recordMistake()` resets streak); clicking inside dragging selection is ignored so text selection isn't penalized; clicking the sabotaged element reveals the verified textbook truth, explains *why* exams exploit that exact trap, awards **+75 XP**, and records completion.

### 7.4 Spot-the-Mistake Bug Hunts & Socratic "Pause & Predict" (`#teach-zone-root`)
Every deck appends two structured mastery zones below the lecture:
1. **2 Interactive Bug Hunts**: Each presents 4 realistic lines/steps/claims (`items`) with **1 subtle flaw** (`bugIdx`) and a detailed textbook `fix` explanation (**+40 XP** per isolated bug).
2. **2 Socratic "Pause & Predict" Cards**: Intuition-testing *"why does X fail / why is Y true?"* prompts with an explicit reveal button hiding the textbook proof so students formulate an answer before checking.

### 7.5 Recall Blur (Interactive Cloze Study)
* CSS toggles blur (`filter: blur(5px)`) across `.kw-*` spans and `<strong>` terms inside `#theory-body-root` (while keeping headings and UI controls legible). Clicking any blurred phrase toggles `.revealed` on that chip so students can test recall sentence by sentence.

---

## 8. Gamification & Progression System

Gamification rewards **accuracy and breadth** without encouraging blind clicking:

| Mechanic | Specification |
| :--- | :--- |
| **XP & Multi-Tier Ranks** | 8 Ranks from `LVL 1` (0 XP) up to `LVL 8` (3,000+ XP), tracked in a clickable top HUD XP pill + progress bar. Deduplicate one-time XP awards via `rewardedEvents` Set (`mcq:deck:q`, `bug:deck:i`, `sab:deck`, `sim:deck`, `master:deck`, `boss:sec`). |
| **Overclock Combo Streak** | Consecutive accurate answers multiply XP: `2+ -> x1.25`, `3+ -> x1.5`, `5+ -> x2.0`. **Any mistake calls `recordMistake()`**, resetting `streak = 0` so guessing sprees don't earn x2.0 multipliers. |
| **Achievement Medals (`9+`)** | Behavior milestones: First Fault Isolated, 10 Bug Hunts, 5 Silent Sabotages Caught, 5/5 Exam Ace, 5x Overclock Streak, 6+ Simulators Explored, Sector Boss Slayer, Midterm Clear, Full Course Mastery. |
| **Weak-Spot Raid & Sector Bosses** | 6-question arena gauntlets with **3 Integrity Shields (`❤️❤️❤️`)**. **Weak-Spot Raid** automatically prioritizes *unsolved Bug Hunts and unmastered MCQs* across the whole course (`priority = 0` vs solved `2`); **Sector Bosses** draw from all decks in one sector and award `+200 XP` + Radar crown upon ≥4/6 survival. |
| **Optional Strict Clearance Gates** | Toggleable in Operator Profile: when **ON**, clicking `SYNTHESIZE CAPABILITY` requires earning `≥3/5` on that deck's Exam Drill AND `≥1/2` Bug Hunt (otherwise shows exact remaining gate count). |

---

## 9. QOL, Onboarding & File Portability Checklist

* **Auto First-Run 6-Step Guided Tutorial (`?` or `🎓 TUTORIAL`)**:
  * Check `HAD_EXISTING_SAVE = Boolean(localStorage.getItem(STORAGE_KEY))` **before** saving default state so first-time visitors see the interactive walkthrough automatically.
  * Step 6 includes the **Keyboard Shortcut Matrix** (`TAB`/`M`, `1/2/3`, `[`/`]`, `?`, `ESC`, `Alt+Click`) and a 1-click **Start Lesson** shortcut.
  * **Input Focus Guard**: Global keyboard listeners **must return early** when `e.target.tagName` is `INPUT`, `TEXTAREA`, or `SELECT` (allowing only `ESC` to blur).
* **Reading & Study Ergonomics**:
  * `▶ RESUME D-XX` HUD shortcut jumping straight to the last open deck.
  * `📑 Outline` drawer generating clickable `<h3>` ToC jump chips.
  * `A-` / `A+` persistent font size controls (`11px..18px` via `--theory-font-size`).
  * `linear-search` + filter pills (`ALL`, `MIDTERM`, `FINAL`, `FLAGGED`, `INCOMPLETE`, `UNSOLVED_BUGS`, Sector chips).
* **Export & Backup Safety**:
  * `⬇ Export Notes (.md)`: Exports a formatted Markdown study guide compiling per-deck user notes AND verbatim extracted text snippets of every saved highlight color.
  * `💾 Download Progress Backup (.json)`: Exports raw `localStorage` state offline via `Blob`.
* **Working Copy Sync Rule**: If the user opens the deliverable from a dedicated launch folder (e.g., `Downloads/.../index.html`) separate from the git/workspace repo, sync & verify matching byte counts at the end of every build!

---

## 10. Mandatory Automated Validation Pipeline

Never ship on manual inspection alone. Run all four gates cleanly (exiting `0`) after edits:

1. **Content & HTML Integrity Validator (`build_and_inject.py`)**:
   * Assert every expected deck key exists in Theory, Quizzes (`>= 5` MCQs, 4 options, valid answer index, no placeholders), and Teaching Trove (`2` Bug Hunts with valid `bugIdx`, `2` Socratic Q/A, `1` Sabotage).
   * Assert `inlineSabotage.find` occurs **exactly `1` time** (`html.count(find) == 1`) in each deck's lecture HTML.
   * Run a stack-based HTML balance checker (`BalanceChecker`) on **both** clean HTML and post-sabotage replaced HTML (`html.replace(find, corrupt, 1)`) so injected sabotage spans never break tag nesting.
   * Run a regex audit banning dirty LaTeX tokens (`$`, `\frac`, `\tau`, `\alpha`, `\implies`, `\mathbf`, `\text`, `\le`, `\dots`, `\to`, `\langle`, raw `\t`).
   * Verify `KEYWORDS_LEXICON` items have valid CSS classes and inject sorted longest-first.
2. **Undefined CSS Variable Audit**:
   * Parse all `var(--token)` references across `<style>`, JS template strings, and HTML attributes in `index.html`, and assert `0` undefined custom properties exist against `:root` and theme rules.
3. **JS Syntax Validation (`node --check`)**:
   * Extract the embedded `<script>` block from `index.html` and run `node --check` to catch template-literal, brace, or strict syntax errors immediately.
4. **Headless VM End-to-End Functional Harness (`verify_pedagogy.js`)**:
   * Load `index.html` into a Node `vm` + lightweight Mock DOM supporting `classList`, `closest`, `querySelectorAll`, `createTreeWalker`, `Range`, `Selection`, and mock `localStorage`.
   * Programmatically exercise every single deck (`1..N`): render Tab 1 Simulators + edit inputs/sliders/tables + assert `.handwritten-sheet` content updates, render Tab 2 Theory + `.formula-sandbox` calculators + keyword spans + add/restore character-offset highlights across re-renders + Sabotage miss vs. hit + Bug Hunts + Socratic toggle + Recall Blur, render Tab 3 Quizzes, step Tutorial, verify Red/Blue pill preservation of notes/highlights, trigger Raids/Bosses, and assert zero uncaught errors.

---

## 11. Adapting to Other University Subjects

Use this mapping table to adapt the exact same engine to any discipline:

| Subject | Sectors (`S1..S7`) | Capabilities Unlocked | Simulators & Playable Calculators | "As Written By Hand" Workings | 4 Semantic Keyword Categories |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Computer Networks** | Physical, Data Link, MAC/LAN, IP/Routing, Transport (TCP/UDP), App Layer, Security | Framing, CRC/Checksum, Sliding Window, Subnetting, Dijkstra/DV, Congestion Control, TLS | Frame Bit-Stuffing, Go-Back-N/SR Timeline, CIDR Splitter, Dijkstra/Bellman-Ford Stepper, TCP cwnd/ssthresh Graph | Subnet mask binary AND + host range; CRC polynomial XOR division; TCP RTT/RTO EWMA; Propagation vs Transmission delay sum | `.kw-hw` Physical/Frames<br>`.kw-hazard` Loss/Collisions/Loops<br>`.kw-sync` Protocols/Congestion/Crypto<br>`.kw-struct` Headers/Tables/Layers |
| **Algorithms & Data Structures** | Asymptotics, Recurrences, Sorting/Trees, Graphs/MST, Greedy, Dynamic Prog, NP-Complete | Master Theorem, Heapify, AVL/RB Rotations, BFS/DFS/Topo, Dijkstra/Kruskal, DP Table, Reductions | Recurrence Tree Visualizer, AVL/RB Rotation Stepper, Heap Sort Array, Dijkstra Priority Queue, Knapsack/LCS Grid | Master Theorem case proof; Recursion cost per level sum; DP recurrence filling cell `(i,j)` with backpointer trace | `.kw-hw` Ops/Primitives<br>`.kw-hazard` Worst-Case/Cycles/NP<br>`.kw-sync` Algos/Invariants/Proofs<br>`.kw-struct` Trees/Graphs/Tables |
| **Database Systems** | ER Model, Relational Algebra, SQL, Normalization (1NF–BCNF), B+ Trees/Indexing, Transactions/ACID, Recovery (ARIES) | ER Mapping, Join Planner, FD Closure, B+ Split/Merge, 2PL Lock Manager, ARIES Log Replay | Relational Algebra Evaluator, FD/Candidate Key Finder, B+ Tree Insert/Split, Precedence Graph & Strict 2PL | Attribute closure `X+`; Lossless/Dependency-preserving decomposition check; B+ Tree fanout & I/O depth math; Wait-for cycle check | `.kw-hw` Disk Pages/WAL/Buffers<br>`.kw-hazard` Anomalies/Dirty Read/Skew<br>`.kw-sync` ACID/2PL/Serializability<br>`.kw-struct` Schemas/FDs/B+ Indexes |
| **Calculus / Linear Algebra / Discrete Math** | Limits, Derivatives, Integrals, Series, Matrices/Eigen, Vector Spaces, Graph/Combinatorics | Chain/Product Rule, U-Sub/By-Parts, Ratio/Root Test, RREF Pivot, Eigen Solver, Induction | Derivative Tangent Plotter, Riemann Sum Slider (`n`), Row-Reduction Stepper, Eigenvalue/2D Matrix Transform | Complete line-by-line symbolic rule application, pivot row ops `[R2 -> R2 - 3*R1]`, characteristic `det(A - λI) = 0`, boxed exact fraction | `.kw-hw` Operators/Transforms<br>`.kw-hazard` Divergence/Singular/Edge<br>`.kw-sync` Theorems/Tests/Rules<br>`.kw-struct` Spaces/Matrices/Series |
| **Physics / Digital Logic / Comp Arch** | Gates/Boolean, Combinational/Sequential, ISA/MIPS, Single-Cycle, Pipelining, Cache/Memory, Virtual I/O | K-Map Simplifier, ALU/Control, Pipeline Hazard Forwarding, Direct/Set-Assoc Cache | Logic Gate Truth Canvas, Pipeline Timing Diagram (with Stalls/Forwarding), Cache Hit/Miss Tag Splitter | Boolean/K-Map prime implicants; CPI with hazard stall penalty; Cache `Tag | Index | Offset` bit split & AMAT | `.kw-hw` Registers/Gates/Signals<br>`.kw-hazard` Hazards/Stalls/Misses<br>`.kw-sync` Forwarding/Policies/ISA<br>`.kw-struct` Datapath/Cache/Formats |

---

## 12. Ready-to-Use Prompt Template for New Subjects

Copy and customize this block whenever starting a study companion for a new course:

```markdown
Build a complete, standalone offline-first (`file://`) single-file interactive study companion (`index.html`) for **[COURSE CODE & NAME]** grounded primarily in **[TEXTBOOK TITLE, AUTHOR, EDITION]** and mapped 1:1 to my attached **[N] slide deck titles / exam format**.

Follow ALL architecture and quality rules in `STUDY_COMPANION_BLUEPRINT.md`:
1. **Extract Real Book & Slides First (No Guessing from Titles/Memory)**: Use `pdftotext` (chapter-by-chapter and slide-by-slide into scratch text) so every subsection citation (`§X.Y`), definition, formula, worked example, and professor convention is verified directly against the actual textbook PDF and slide files on disk.
2. **No Condensed Fluff + Intuition-First**: Each module's Theory tab must be an exhaustive textbook chapter built on the 5-part Intuition Ladder (*Naive Attempt → Visible Failure*, *Physical Analogy + Breaking Point*, *Plain-English Formula Story*, *Predict-Before-Simulate Hooks*, *Knock-Out-One-Pillar Checks*), trace tables, code/diagrams, and Exam Traps (zero raw LaTeX delimiters offline).
3. **Dual Navigation + Pills**: Metroidvania spatial dependency map (Sectors + Capability Unlocks) <-> Linear Exam Track (`TAB`/`M`) with Midterm/Final/Flagged/Unsolved-Bugs filters, plus Red Pill (unlock all) and Blue Pill (wipe progress while keeping Notes & Highlights).
4. **Interactive Simulators + Playable Controls + Written-by-Hand Sheets**: Every quantitative/algorithmic topic gets a live simulator with paired range sliders + direct numeric inputs, inline focus-preserving editable tables, SVG diagrams with theme-safe CSS variables, and a `.handwritten-sheet` showing Formula -> Substituted Numbers -> Intermediate Arithmetic -> Boxed Answer (plus embedded `.formula-sandbox` cards inside Theory formulas).
5. **Active Pedagogy Engine**: Per-deck 4-color longest-first semantic keywords, persistent character-offset 4-pen highlighter + brush/eraser + marks drawer (excluding `.formula-sandbox` from offsets), Silent Inline Sabotage (`{find, corrupt, why}` occurring verbatim once), 2 Spot-the-Mistake Bug Hunts, 2 Socratic Pause & Predict cards, and Recall Blur.
6. **Gamification & QOL**: XP/Ranks, zero-mistake Combo Streak multiplier, 9+ Medals, 3-Shield Weak-Spot Raid & Sector Bosses, optional Strict Clearance Gates, 6-step Guided Tutorial on first load, Keyboard Shortcuts, Font Sizer, Outline drawer, JSON backup, and `.md` Notes+Highlights export.
7. **Modular Build & 4 Verification Gates**: Author in `workspace_build_src/`, compile with validation checking HTML tag balance pre/post sabotage and zero LaTeX leaks, audit 0 undefined CSS variables across dark + light themes, pass `node --check`, and pass a full headless VM test suite across every module before finishing.
```
