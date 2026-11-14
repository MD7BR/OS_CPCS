# build_src/styles.py

CSS = """
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  
  --bg-body: #0f172a;
  --bg-sidebar: #1e293b;
  --bg-card: #1e293b;
  --bg-card-hover: #334155;
  --bg-input: #0f172a;
  --bg-code: #0b1120;
  
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  
  --border: #334155;
  --border-light: #475569;
  
  --primary: #38bdf8;
  --primary-hover: #0284c7;
  --primary-glow: rgba(56, 189, 248, 0.15);
  
  --success: #10b981;
  --success-bg: rgba(16, 185, 129, 0.1);
  --warning: #f59e0b;
  --warning-bg: rgba(245, 158, 11, 0.1);
  --danger: #ef4444;
  --danger-bg: rgba(239, 68, 68, 0.1);
  --info: #6366f1;
  --info-bg: rgba(99, 102, 241, 0.1);

  --p1-col: #38bdf8;
  --p2-col: #f97316;
  --p3-col: #10b981;
  --p4-col: #a855f7;
  --p5-col: #ef4444;
  --p6-col: #06b6d4;
  --p7-col: #ec4899;
  --p8-col: #eab308;
}

[data-theme="light"] {
  --bg-body: #f8fafc;
  --bg-sidebar: #ffffff;
  --bg-card: #ffffff;
  --bg-card-hover: #f1f5f9;
  --bg-input: #f8fafc;
  --bg-code: #f1f5f9;
  
  --text-main: #0f172a;
  --text-muted: #475569;
  --text-dim: #94a3b8;
  
  --border: #e2e8f0;
  --border-light: #cbd5e1;
  
  --primary: #0284c7;
  --primary-hover: #0369a1;
  --primary-glow: rgba(2, 132, 199, 0.1);
  
  --success: #059669;
  --success-bg: rgba(5, 150, 105, 0.08);
  --warning: #d97706;
  --warning-bg: rgba(217, 119, 6, 0.08);
  --danger: #dc2626;
  --danger-bg: rgba(220, 38, 38, 0.08);
  --info: #4f46e5;
  --info-bg: rgba(79, 70, 229, 0.08);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background: var(--bg-body);
  color: var(--text-main);
  line-height: 1.6;
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-body);
}
::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 4px;
}

/* Layout */
#sidebar {
  width: 320px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 50;
  transition: transform 0.25s ease;
}

#main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
}

/* Header */
#top-header {
  position: sticky;
  top: 0;
  background: var(--bg-sidebar);
  border-bottom: 1px solid var(--border);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  z-index: 40;
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-main);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}
.btn:hover {
  background: var(--bg-card-hover);
  border-color: var(--primary);
}
.btn-primary {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}
.btn-primary:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}
.btn-sm {
  padding: 4px 10px;
  font-size: 0.8rem;
}

/* Search Input */
.search-box {
  position: relative;
  width: 280px;
}
.search-box input {
  width: 100%;
  padding: 8px 12px 8px 32px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-main);
  font-size: 0.88rem;
}
.search-box input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--primary-glow);
}
.search-box .search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim);
  font-size: 0.85rem;
}

/* Sidebar Contents */
.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}
.sidebar-header h2 {
  font-size: 1rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}
.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: var(--bg-input);
  border-radius: 3px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: var(--primary);
  width: 0%;
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 0.78rem;
  color: var(--text-dim);
  display: flex;
  justify-content: space-between;
}

.scope-selector {
  display: flex;
  gap: 4px;
  padding: 8px 16px;
  background: var(--bg-body);
  border-bottom: 1px solid var(--border);
}
.scope-btn {
  flex: 1;
  padding: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
}
.scope-btn.active {
  background: var(--bg-card);
  color: var(--primary);
  border-color: var(--border);
}

.nav-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
  list-style: none;
}
.nav-item {
  margin-bottom: 4px;
}
.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
}
.nav-link:hover {
  background: var(--bg-card-hover);
  color: var(--text-main);
}
.nav-link.active {
  background: var(--primary-glow);
  color: var(--primary);
  font-weight: 600;
  border-left: 3px solid var(--primary);
}
.nav-badge {
  font-size: 0.72rem;
  padding: 2px 6px;
  border-radius: 10px;
  background: var(--bg-input);
  color: var(--text-dim);
}

/* Main Content Area */
#content {
  padding: 32px 48px 100px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.module-page {
  display: none;
}
.module-page.active {
  display: block;
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Module Header */
.module-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.module-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--primary-glow);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  text-transform: uppercase;
}
.module-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 12px;
  color: var(--text-main);
}
.module-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.88rem;
  color: var(--text-muted);
}
.meta-chip {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Content Sections */
.section-block {
  margin-bottom: 40px;
}
.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 10px;
}

p {
  margin-bottom: 14px;
  color: var(--text-main);
  font-size: 0.98rem;
}

/* Callouts */
.callout {
  padding: 16px 20px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid;
}
.callout-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.callout-exam {
  background: var(--warning-bg);
  border-color: var(--warning);
  color: var(--text-main);
}
.callout-exam .callout-title {
  color: var(--warning);
}

.callout-compare {
  background: var(--info-bg);
  border-color: var(--info);
  color: var(--text-main);
}
.callout-compare .callout-title {
  color: var(--info);
}

.callout-definition {
  background: var(--success-bg);
  border-color: var(--success);
  color: var(--text-main);
}
.callout-definition .callout-title {
  color: var(--success);
}

.callout-deep {
  background: rgba(148, 163, 184, 0.08);
  border-color: var(--border-light);
}

/* Beyond the Slides Collapsible */
details.beyond-slides {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  margin: 20px 0;
  overflow: hidden;
}
details.beyond-slides summary {
  padding: 12px 16px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  background: var(--bg-body);
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
}
details.beyond-slides summary:hover {
  color: var(--primary);
}
details.beyond-slides .details-body {
  padding: 16px;
  border-top: 1px solid var(--border);
}

/* SVG Figures */
.figure-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  margin: 24px 0;
  text-align: center;
}
.figure-container svg {
  max-width: 100%;
  height: auto;
  display: inline-block;
}
.figure-caption {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 12px;
  font-style: italic;
}

/* Tables */
.table-wrapper {
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid var(--border);
  border-radius: 8px;
}
table.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  text-align: left;
}
table.data-table th {
  background: var(--bg-body);
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
  font-weight: 600;
}
table.data-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
}
table.data-table tr:last-child td {
  border-bottom: none;
}
table.data-table tr:hover {
  background: var(--bg-card-hover);
}

/* Code Blocks */
pre.code-block {
  background: var(--bg-code);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: #38bdf8;
  margin: 16px 0;
  position: relative;
}
code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--bg-code);
  color: var(--primary);
}

/* Interactive Simulator Cards */
.sim-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  margin: 28px 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.sim-header {
  padding: 14px 20px;
  background: var(--bg-body);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.sim-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.sim-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.sim-body {
  padding: 20px;
}
.sim-canvas {
  background: var(--bg-body);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
}
.sim-narration {
  padding: 12px 16px;
  background: var(--primary-glow);
  border-left: 3px solid var(--primary);
  border-radius: 4px;
  font-size: 0.88rem;
  color: var(--text-main);
  margin-bottom: 16px;
}

/* Flashcards */
.flashcards-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 32px 0;
}
.flashcard {
  width: 100%;
  max-width: 580px;
  height: 260px;
  perspective: 1000px;
  cursor: pointer;
}
.flashcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.flashcard.flipped .flashcard-inner {
  transform: rotateY(180deg);
}
.flashcard-front, .flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  background: var(--bg-card);
}
.flashcard-back {
  transform: rotateY(180deg);
  background: var(--bg-card-hover);
  border-color: var(--primary);
}
.flashcard-badge {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--primary);
  font-weight: 700;
  margin-bottom: 12px;
}
.flashcard-text {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-main);
}
.flashcard-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Self-Quiz */
.quiz-container {
  margin: 32px 0;
}
.quiz-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}
.quiz-question {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-main);
}
.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.quiz-opt {
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-body);
  color: var(--text-main);
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.quiz-opt:hover {
  background: var(--bg-card-hover);
  border-color: var(--primary);
}
.quiz-opt.correct {
  background: var(--success-bg) !important;
  border-color: var(--success) !important;
  color: var(--success) !important;
  font-weight: 600;
}
.quiz-opt.wrong {
  background: var(--danger-bg) !important;
  border-color: var(--danger) !important;
  color: var(--danger) !important;
}
.quiz-feedback {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.88rem;
  display: none;
}

/* Checklists */
.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
}
.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: none;
  justify-content: center;
  align-items: center;
  padding: 24px;
}
.modal-overlay.active {
  display: flex;
}
.modal-content {
  background: var(--bg-sidebar);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}
.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* Responsive */
@media (max-width: 992px) {
  #sidebar {
    position: fixed;
    left: -320px;
    z-index: 99;
  }
  #sidebar.open {
    transform: translateX(320px);
  }
  #content {
    padding: 24px 20px 80px;
  }
}

/* Print Styles */
@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  #sidebar, #top-header, .sim-controls, .flashcards-container, .btn {
    display: none !important;
  }
  #main-wrapper {
    height: auto !important;
    overflow: visible !important;
  }
  .module-page {
    display: block !important;
    page-break-after: always;
  }
  .figure-container, .sim-card {
    border: 1px solid #ccc !important;
    page-break-inside: avoid;
  }
}
"""
