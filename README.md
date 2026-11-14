# KERNEL//BREACH — Unofficial AI OS Study Companion

> **DISCLAIMER — AI-GENERATED & UNOFFICIAL**
>
> This project is an **unofficial, AI-generated independent study tool** created for personal learning and review of Operating Systems concepts (aligned with *Operating System Concepts, 10th Edition* by Silberschatz, Galvin, and Gagne, covering standard undergraduate OS modules such as CPCS-361 topics).
>
> - **No Instructor or Faculty Affiliation:** This project has **zero relation, endorsement, sponsorship, or official connection** with any course instructor, lecturer, faculty member, department, or university.
> - **Verify Everything:** All module summaries, worked traces, quiz questions, practice mock exam items, bug hunts, and interactive simulators were generated with AI assistance and may contain errors or differ from your course's specific conventions or grading rules. Always rely on your official textbook, lectures, and syllabus.

---

## Live Site

Once GitHub Pages is active on this repository, the app is served at:

- **https://md7br.github.io/OS_CPCS/**

Because the application is compiled into a self-contained [`index.html`](index.html), it also runs completely offline by opening `index.html` directly in any modern browser.

---

## Features

- **Dual Exploration Modes**
  - **Metroidvania Silicon Die Map:** Interactive pan-and-zoom hardware die across 7 sectors, 21 curriculum modules (`deck_02`–`deck_22`), and 12 unlockable kernel capabilities.
  - **Linear Exam Track:** Searchable chronological view for sequential study and quick lookup.
- **21 Study Rooms & Interactive Simulators**
  - Dual-Mode trap & interrupt flow, process trees (`fork()`), CPU scheduling Gantt builders (`FCFS`, `SJF`, `SRTF`, `Priority`, `Round Robin`, `MLQ`), critical section & synchronization (`Peterson`, `TestAndSet`, semaphores), Deadlocks & Banker's Algorithm, Contiguous allocation, Paging/TLB/EAT calculators, Virtual Memory page replacement (`FIFO`, `LRU`, `OPT`, Belady's anomaly), Disk head seek scheduling (`FCFS`, `SSTF`, `SCAN`, `C-SCAN`, `LOOK`, `C-LOOK`), I/O & DMA, and Access Matrix security.
- **Active Learning & Self-Testing**
  - Highlighting pens, inline marks & outline drawer, active-recall blur mode, Socratic check questions, Bug Hunt drills, Inline Sabotage checks, 105 module MCQs, and a 30-mark interactive Practice Mock Midterm.
  - Persistent local progress (`localStorage`) with XP/rank progression, Sector Boss gauntlets, Red Pill (unlock all) / Blue Pill (reset), JSON backup/restore, and Markdown notes export.
- **5 Themes & Accessibility**
  - `CYAN`, `AMBER`, `MATRIX`, `COBALT`, and high-contrast `LIGHT` mode, CRT scanline toggle, synthesized WebAudio feedback toggle, and keyboard shortcuts (`TAB` / `M`, `1`/`2`/`3`, `[`/`]`, `?`).

---

## Running Locally

```bash
# Option 1: Open directly in your browser
xdg-open index.html   # Linux (or open index.html on macOS / Windows)

# Option 2: Serve over local HTTP
python3 -m http.server 8080
```

## Project Structure

- `index.html` — Standalone, compiled single-file web application (HTML + CSS + JS + embedded datasets).
- `workspace_build_src/` — Source Python modules and `knowledge_trove/build_and_inject.py` generator used to assemble the knowledge trove into `index.html`.
- `.nojekyll` — Configures GitHub Pages to serve static files directly from the `main` branch root.
