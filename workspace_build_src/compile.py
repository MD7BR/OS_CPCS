# build_src/compile.py
import os
import json
from styles import CSS
from simulators_js import SIMULATORS_JS
from app_js import APP_JS
from data_glossary import GLOSSARY_TERMS
from data_formulas import FORMULA_LIST
from data_exam_questions import EXAM_QUESTIONS

from modules_m1_m5 import M1_CONTENT, M2_CONTENT, M3_CONTENT, M4_CONTENT, M5_CONTENT
from modules_m6_m10 import M6_CONTENT, M7_CONTENT, M8_CONTENT, M9_CONTENT, M10_CONTENT
from modules_m11_m17 import M11_CONTENT, M12_CONTENT, M13_CONTENT, M14_CONTENT, M15_CONTENT, M16_CONTENT, M17_CONTENT

MODULES = [
    ("m1", "M1: Intro & OS Structures", M1_CONTENT),
    ("m2", "M2: Processes & Threads", M2_CONTENT),
    ("m3", "M3: CPU Scheduling", M3_CONTENT),
    ("m4", "M4: Sync & Race Conditions", M4_CONTENT),
    ("m5", "M5: Critical-Section Problem", M5_CONTENT),
    ("m6", "M6: Semaphores & P-C", M6_CONTENT),
    ("m7", "M7: Readers-Writers & DP", M7_CONTENT),
    ("m8", "M8: Deadlocks: Characterization", M8_CONTENT),
    ("m9", "M9: Deadlock Avoidance (Banker's)", M9_CONTENT),
    ("m10", "M10: Deadlock Detection & Recovery", M10_CONTENT),
    ("m11", "M11: Memory: Contiguous", M11_CONTENT),
    ("m12", "M12: Memory: Non-Contiguous (Paging)", M12_CONTENT),
    ("m13", "M13: Virtual Memory", M13_CONTENT),
    ("m14", "M14: Mass Storage & Disks", M14_CONTENT),
    ("m15", "M15: File Management", M15_CONTENT),
    ("m16", "M16: I/O Management", M16_CONTENT),
    ("m17", "M17: Security & Protection", M17_CONTENT),
]

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CPCS-361 Operating Systems I — A-to-Z Master Interactive Study Guide</title>
  <style>
__CSS__
  </style>
</head>
<body>

  <!-- Left Sidebar Navigation -->
  <aside id="sidebar">
    <div class="sidebar-header">
      <div class="brand-title">
        <span>⚡ CPCS-361 OS-I</span>
      </div>
      <div style="font-size:0.78rem; color:var(--text-dim); margin-top:2px;">Unofficial AI Study Companion &bull; Silberschatz 10th Ed.</div>
      
      <div class="progress-container">
        <div class="progress-text">
          <span>Course Completion</span>
          <span id="progress-percent">0%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" id="progress-bar"></div>
        </div>
      </div>
    </div>

    <!-- Scope Filter Buttons -->
    <div class="scope-selector">
      <button class="scope-btn active" data-scope="all" onclick="App.setScope('all')">All (17)</button>
      <button class="scope-btn" data-scope="midterm" onclick="App.setScope('midterm')">Midterm (M1–7)</button>
      <button class="scope-btn" data-scope="final" onclick="App.setScope('final')">Final (M8–17)</button>
    </div>

    <div style="padding: 10px 16px 4px;">
      <div class="search-box" style="width:100%;">
        <span class="search-icon">🔍</span>
        <input type="text" id="sidebar-search" placeholder="Search topics (Press '/')..." oninput="App.filterSearch(this.value)">
      </div>
    </div>

    <!-- Module List -->
    <ul class="nav-list" id="sidebar-modules">
__NAV_ITEMS__
    </ul>

    <!-- Quick Footer Links -->
    <div style="padding:12px 16px; border-top:1px solid var(--border); background:var(--bg-body); display:flex; gap:8px; justify-content:space-between;">
      <button class="btn btn-sm" style="flex:1;" onclick="App.openModal('modal-formulas')">🧮 Formulas</button>
      <button class="btn btn-sm" style="flex:1;" onclick="App.openModal('modal-glossary')">📖 Glossary</button>
      <button class="btn btn-sm btn-primary" style="flex:1;" onclick="ExamMode.start()">🎯 Exam</button>
    </div>
  </aside>

  <!-- Main Content Wrapper -->
  <div id="main-wrapper">
    <!-- Top Sticky Header -->
    <header id="top-header">
      <div style="display:flex; align-items:center; gap:12px;">
        <button class="btn btn-sm" onclick="document.getElementById('sidebar').classList.toggle('open')">☰ Menu</button>
        <span style="font-size:0.92rem; font-weight:600; color:var(--text-muted);">A-to-Z Slides &times; Textbook Interactive Companion</span>
      </div>

      <div class="header-actions">
        <button class="btn btn-sm" onclick="App.openModal('modal-formulas')">🧮 Formula Sheet</button>
        <button class="btn btn-sm" onclick="App.openModal('modal-glossary')">📖 A–Z Glossary</button>
        <button class="btn btn-sm btn-primary" onclick="ExamMode.start()">🎯 Mock Exam</button>
        <button class="btn btn-sm" id="theme-btn" onclick="App.toggleTheme()">🌙 Dark</button>
      </div>
    </header>

    <!-- Reading Content Area -->
    <main id="content">
__PAGES__
    </main>
  </div>

  <!-- MODAL: Formula Sheet -->
  <div class="modal-overlay" id="modal-formulas" onclick="if(event.target===this) App.closeModals()">
    <div class="modal-content">
      <div class="modal-header">
        <h2 style="font-size:1.2rem; color:var(--primary);">🧮 CPCS-361 Formula Sheet & Quick Calculators</h2>
        <button class="btn btn-sm" onclick="App.closeModals()">✕ Close</button>
      </div>
      <div class="modal-body">
__FORMULAS__
__CALC__
      </div>
    </div>
  </div>

  <!-- MODAL: A-to-Z Glossary -->
  <div class="modal-overlay" id="modal-glossary" onclick="if(event.target===this) App.closeModals()">
    <div class="modal-content">
      <div class="modal-header">
        <h2 style="font-size:1.2rem; color:var(--primary);">📖 A-to-Z Operating Systems Glossary</h2>
        <button class="btn btn-sm" onclick="App.closeModals()">✕ Close</button>
      </div>
      <div style="padding:12px 24px; border-bottom:1px solid var(--border); background:var(--bg-card);">
        <input type="text" id="glossary-search" placeholder="Type to filter glossary terms..." style="width:100%; padding:8px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:6px; color:var(--text-main);" oninput="
          const q = this.value.toLowerCase();
          document.querySelectorAll('.glossary-entry').forEach(el => {
            const match = el.getAttribute('data-term').includes(q);
            el.style.display = match ? 'block' : 'none';
          });
        ">
      </div>
      <div class="modal-body" id="glossary-list">
__GLOSSARY__
      </div>
    </div>
  </div>

  <!-- MODAL: Mock Exam Mode -->
  <div class="modal-overlay" id="modal-exam" onclick="if(event.target===this) App.closeModals()">
    <div class="modal-content">
      <div class="modal-header">
        <div>
          <h2 style="font-size:1.2rem; color:var(--primary);">🎯 CPCS-361 Comprehensive Mock Exam</h2>
          <span style="font-size:0.85rem; color:var(--text-muted);">Timed Practice &bull; 15 High-Yield Questions &bull; Immediate Scoring</span>
        </div>
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="font-family:var(--font-mono); font-size:1.3rem; font-weight:bold; color:var(--warning);" id="exam-timer">40:00</div>
          <button class="btn btn-sm" onclick="App.closeModals()">✕ Close</button>
        </div>
      </div>
      <div class="modal-body">
        <div id="exam-results" style="display:none;"></div>
__EXAM__
        <div style="text-align:center; margin:24px 0 12px;">
          <button class="btn btn-primary" style="font-size:1.05rem; padding:10px 32px;" onclick="ExamMode.submit()">Submit Exam & Calculate Score</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Embedded Interactive Logic -->
  <script>
__SIMULATORS_JS__
__APP_JS__

    const M1_CARDS = [
      { q: "What is the difference between Multiprogramming and Multitasking?", a: "Multiprogramming maximizes CPU utilization by switching only on I/O waits.<br>Multitasking switches rapidly on timer quantums to minimize user response time (&lt;1s)." },
      { q: "What are the mode bit values for User Mode and Kernel Mode?", a: "User Mode = 1<br>Kernel Mode = 0" },
      { q: "What is Direct Memory Access (DMA)?", a: "High-speed device controller transfers full blocks of data directly to/from RAM without CPU, interrupting only once per block." },
      { q: "What is a privileged instruction?", a: "An instruction that can only be executed in Kernel Mode (mode bit 0), such as disabling interrupts or changing timer/memory registers." }
    ];

    window.addEventListener('DOMContentLoaded', () => {
      App.init();
      Formulas.calcTAT();
      Formulas.calcWT();
      Formulas.calcEAT();
    });
  </script>
</body>
</html>
"""

def build():
    # Build sidebar navigation items
    nav_items_html = ""
    for mod_id, title, _ in MODULES:
        mod_num = int(mod_id.replace("m", ""))
        badge = "Midterm" if mod_num <= 7 else "Final"
        badge_col = "var(--primary)" if mod_num <= 7 else "var(--warning)"
        active_cls = "active" if mod_id == "m1" else ""
        nav_items_html += f"""
        <li class="nav-item" data-module="{mod_id}">
          <a class="nav-link {active_cls}" data-mod="{mod_id}" onclick="App.switchModule('{mod_id}')">
            <span>{title}</span>
            <span class="nav-badge" style="color:{badge_col}">{badge}</span>
          </a>
        </li>
        """

    # Build module pages
    pages_html = ""
    for mod_id, _, content in MODULES:
        active_cls = "active" if mod_id == "m1" else ""
        pages_html += f"""
        <div class="module-page {active_cls}" id="page-{mod_id}">
          {content}
        </div>
        """

    # Build Formulas modal content
    formulas_html = ""
    for f in FORMULA_LIST:
        formulas_html += f"""
        <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="color:var(--primary); font-size:1.05rem;">{f['name']}</strong>
            <span class="nav-badge">{f['category']}</span>
          </div>
          <div style="background:var(--bg-code); padding:8px 12px; border-radius:6px; font-family:var(--font-mono); font-size:1rem; color:#38bdf8; margin-bottom:8px;">
            {f['formula']}
          </div>
          <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:4px;">{f['desc']}</p>
          <div style="font-size:0.8rem; color:var(--text-dim);">{f['vars']}</div>
        </div>
        """

    # Quick interactive calculators block
    calc_html = """
    <div style="background:var(--bg-body); border:1px solid var(--border); border-radius:8px; padding:16px; margin-top:20px;">
      <h3 style="color:var(--warning); margin-bottom:12px;">⚡ Interactive Quick Calculators</h3>
      
      <!-- TAT Calc -->
      <div style="margin-bottom:16px;">
        <strong>Turnaround Time:</strong> <code>TAT = CT - AT</code>
        <div style="display:flex; gap:10px; align-items:center; margin-top:6px; flex-wrap:wrap;">
          <label>CT:</label><input type="number" id="f-ct" value="30" style="width:70px; padding:4px;" oninput="Formulas.calcTAT()">
          <label>AT:</label><input type="number" id="f-at" value="0" style="width:70px; padding:4px;" oninput="Formulas.calcTAT()">
          <span>&rarr; TAT = <strong id="f-tat-res" style="color:var(--primary);">30</strong> ms</span>
        </div>
      </div>

      <!-- WT Calc -->
      <div style="margin-bottom:16px;">
        <strong>Waiting Time:</strong> <code>WT = TAT - BT</code>
        <div style="display:flex; gap:10px; align-items:center; margin-top:6px; flex-wrap:wrap;">
          <label>TAT:</label><input type="number" id="f-tat" value="30" style="width:70px; padding:4px;" oninput="Formulas.calcWT()">
          <label>BT:</label><input type="number" id="f-bt" value="24" style="width:70px; padding:4px;" oninput="Formulas.calcWT()">
          <span>&rarr; WT = <strong id="f-wt-res" style="color:var(--warning);">6</strong> ms</span>
        </div>
      </div>

      <!-- EAT TLB Calc -->
      <div>
        <strong>TLB Effective Access Time (EAT):</strong> <code>EAT = h*(tTLB + tRAM) + (1-h)*(tTLB + 2*tRAM)</code>
        <div style="display:flex; gap:10px; align-items:center; margin-top:6px; flex-wrap:wrap;">
          <label>Hit Ratio (h %):</label><input type="number" id="f-hit" value="80" style="width:65px; padding:4px;" oninput="Formulas.calcEAT()">
          <label>TLB Latency (ns):</label><input type="number" id="f-tlb-t" value="20" style="width:65px; padding:4px;" oninput="Formulas.calcEAT()">
          <label>RAM Latency (ns):</label><input type="number" id="f-ram-t" value="100" style="width:65px; padding:4px;" oninput="Formulas.calcEAT()">
          <span>&rarr; EAT = <strong id="f-eat-res" style="color:var(--success);">140.00 ns</strong></span>
        </div>
      </div>
    </div>
    """

    # Build Glossary modal content
    glossary_items_html = ""
    for item in sorted(GLOSSARY_TERMS, key=lambda x: x["term"]):
        glossary_items_html += f"""
        <div class="glossary-entry" data-term="{item['term'].lower()}" data-mod="{item['mod'].lower()}" style="padding:12px; border-bottom:1px solid var(--border);">
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
            <strong style="color:var(--primary); font-size:1.05rem;">{item['term']}</strong>
            <span class="nav-badge">{item['mod']}</span>
          </div>
          <p style="font-size:0.9rem; color:var(--text-main); margin-bottom:0;">{item['def']}</p>
        </div>
        """

    # Build Exam Questions
    exam_questions_html = ""
    for i, q in enumerate(EXAM_QUESTIONS):
        opts_html = ""
        for opt in q["opts"]:
            val = "1" if opt["correct"] else "0"
            opts_html += f"""
            <label style="display:flex; align-items:center; gap:8px; padding:8px 12px; border:1px solid var(--border); border-radius:6px; cursor:pointer; background:var(--bg-body);">
              <input type="radio" name="exam-q-{i}" value="{val}">
              <span style="font-size:0.92rem;">{opt['t']}</span>
            </label>
            """
        exam_questions_html += f"""
        <div style="background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:18px; margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="font-size:0.85rem; color:var(--primary); font-weight:bold;">Question {i+1} of {len(EXAM_QUESTIONS)}</span>
            <span style="font-size:0.75rem; color:var(--text-dim);">{q['citation']}</span>
          </div>
          <div style="font-size:1rem; font-weight:600; margin-bottom:14px; color:var(--text-main);">{q['q']}</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            {opts_html}
          </div>
        </div>
        """

    res = HTML_TEMPLATE
    res = res.replace("__CSS__", CSS)
    res = res.replace("__NAV_ITEMS__", nav_items_html)
    res = res.replace("__PAGES__", pages_html)
    res = res.replace("__FORMULAS__", formulas_html)
    res = res.replace("__CALC__", calc_html)
    res = res.replace("__GLOSSARY__", glossary_items_html)
    res = res.replace("__EXAM__", exam_questions_html)
    res = res.replace("__SIMULATORS_JS__", SIMULATORS_JS)
    res = res.replace("__APP_JS__", APP_JS)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(os.path.dirname(script_dir), "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(res)
    
    print(f"Successfully generated {out_path} ({len(res)} bytes)")

if __name__ == "__main__":
    build()
