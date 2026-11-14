# build_src/app_js.py

APP_JS = """
// CPCS-361 Study Guide Core Application Engine

const App = {
  activeModule: 'm1',
  theme: 'dark',
  scope: 'all', // 'all', 'midterm', 'final'
  progress: {},

  init() {
    this.loadState();
    this.setupEventListeners();
    this.initSimulators();
    this.updateProgress();
    this.switchModule(this.activeModule);
  },

  loadState() {
    const savedTheme = localStorage.getItem('cpcs361_theme');
    if (savedTheme) {
      this.theme = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    const savedProgress = localStorage.getItem('cpcs361_progress');
    if (savedProgress) {
      try { this.progress = JSON.parse(savedProgress); } catch (e) {}
    }
  },

  toggleTheme() {
    this.theme = (this.theme === 'dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('cpcs361_theme', this.theme);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.innerHTML = (this.theme === 'dark') ? '🌙 Dark' : '☀️ Light';
  },

  setScope(scope) {
    this.scope = scope;
    document.querySelectorAll('.scope-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-scope') === scope);
    });

    // Filter sidebar modules
    document.querySelectorAll('.nav-item').forEach(item => {
      const mod = item.getAttribute('data-module');
      const modNum = parseInt(mod.replace('m', ''));
      if (scope === 'all') {
        item.style.display = 'block';
      } else if (scope === 'midterm') {
        item.style.display = (modNum <= 7) ? 'block' : 'none';
      } else if (scope === 'final') {
        item.style.display = (modNum >= 8) ? 'block' : 'none';
      }
    });
  },

  switchModule(modId) {
    this.activeModule = modId;
    document.querySelectorAll('.module-page').forEach(page => {
      page.classList.remove('active');
    });
    const target = document.getElementById(`page-${modId}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-mod') === modId);
    });

    // Trigger simulator render if on active page
    if (modId === 'm2') { W1_StateMachine.init(); W2_ForkVisualizer.init(); }
    if (modId === 'm3') { W3_CPUScheduler.calculate(); }
    if (modId === 'm4') { W5_RaceCondition.init(); W6_BoundedBuffer.render(); }
    if (modId === 'm5') { W7_CriticalSection.init(); }
    if (modId === 'm6') { W8_Semaphore.render(); }
    if (modId === 'm7') { W10_DiningPhilosophers.render(); }
    if (modId === 'm9') { W12_Bankers.init(); }
    if (modId === 'm11') { W13_MemoryAlloc.reset(); }
    if (modId === 'm12') { W14_PagingTranslator.translate(); }
    if (modId === 'm13') { W15_PageReplacement.run('FIFO'); }
    if (modId === 'm14') { W16_DiskScheduling.run('FCFS'); }
  },

  initSimulators() {
    W1_StateMachine.init();
    W2_ForkVisualizer.init();
    W3_CPUScheduler.calculate();
    W5_RaceCondition.init();
    W6_BoundedBuffer.render();
    W7_CriticalSection.init();
    W8_Semaphore.render();
    W10_DiningPhilosophers.render();
    W12_Bankers.init();
    W13_MemoryAlloc.reset();
    W14_PagingTranslator.translate();
    W15_PageReplacement.run('FIFO');
    W16_DiskScheduling.run('FCFS');
  },

  toggleChecklist(id) {
    this.progress[id] = !this.progress[id];
    localStorage.setItem('cpcs361_progress', JSON.stringify(this.progress));
    this.updateProgress();
  },

  updateProgress() {
    const allCheckboxes = document.querySelectorAll('.checklist-checkbox');
    let total = allCheckboxes.length;
    let checked = 0;
    allCheckboxes.forEach(cb => {
      const id = cb.getAttribute('data-check-id');
      if (this.progress[id]) {
        cb.checked = true;
        checked++;
      } else {
        cb.checked = false;
      }
    });

    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    const bar = document.getElementById('progress-bar');
    const label = document.getElementById('progress-percent');
    if (bar) bar.style.width = `${percent}%`;
    if (label) label.innerText = `${percent}%`;
  },

  filterSearch(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.nav-item').forEach(item => {
      const text = item.innerText.toLowerCase();
      item.style.display = text.includes(q) ? 'block' : 'none';
    });
  },

  setupEventListeners() {
    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const searchInput = document.getElementById('sidebar-search');
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });
  },

  // Modal Dialogs
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },

  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }
};

// ----------------------------------------------------
// Flashcards Engine
// ----------------------------------------------------
const Flashcards = {
  currentIdx: {},

  flip(elem) {
    elem.classList.toggle('flipped');
  },

  prev(modId, cards) {
    let idx = this.currentIdx[modId] || 0;
    idx = (idx - 1 + cards.length) % cards.length;
    this.currentIdx[modId] = idx;
    this.render(modId, cards);
  },

  next(modId, cards) {
    let idx = this.currentIdx[modId] || 0;
    idx = (idx + 1) % cards.length;
    this.currentIdx[modId] = idx;
    this.render(modId, cards);
  },

  render(modId, cards) {
    const idx = this.currentIdx[modId] || 0;
    const card = cards[idx];
    const cardElem = document.getElementById(`fc-card-${modId}`);
    const countElem = document.getElementById(`fc-count-${modId}`);
    if (!cardElem) return;

    cardElem.classList.remove('flipped');
    setTimeout(() => {
      const qElem = cardElem.querySelector('.fc-q');
      const aElem = cardElem.querySelector('.fc-a');
      if (qElem) qElem.innerHTML = card.q;
      if (aElem) aElem.innerHTML = card.a;
      if (countElem) countElem.innerText = `Card ${idx + 1} of ${cards.length}`;
    }, 150);
  }
};

// ----------------------------------------------------
// Self-Quiz Engine
// ----------------------------------------------------
const Quiz = {
  selectOption(btn, isCorrect, explanation) {
    const card = btn.closest('.quiz-card');
    const options = card.querySelectorAll('.quiz-opt');
    const feedback = card.querySelector('.quiz-feedback');

    options.forEach(opt => {
      opt.disabled = true;
      if (opt.getAttribute('data-correct') === 'true') {
        opt.classList.add('correct');
      }
    });

    if (!isCorrect) {
      btn.classList.add('wrong');
    }

    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.background = isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)';
      feedback.style.border = `1px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`;
      feedback.innerHTML = `
        <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</strong> ${explanation}
      `;
    }
  }
};

// ----------------------------------------------------
// Exam Mode Simulator
// ----------------------------------------------------
const ExamMode = {
  timer: null,
  timeLeft: 2400, // 40 minutes in seconds

  start() {
    App.openModal('modal-exam');
    this.timeLeft = 2400;
    this.updateTimerDisplay();
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.submit();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const m = Math.floor(this.timeLeft / 60);
    const s = this.timeLeft % 60;
    const el = document.getElementById('exam-timer');
    if (el) el.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  },

  submit() {
    clearInterval(this.timer);
    const inputs = document.querySelectorAll('input[name^="exam-q-"]:checked');
    let score = 0;
    inputs.forEach(inp => {
      if (inp.value === '1') score++;
    });
    const resultBox = document.getElementById('exam-results');
    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="padding:16px; background:var(--primary-glow); border-radius:8px; border:1px solid var(--primary); margin-bottom:20px;">
          <h3 style="color:var(--primary); margin-bottom:6px;">Exam Completed!</h3>
          <p style="font-size:1.1rem;">You scored: <strong>${score} / 15</strong> (${Math.round((score/15)*100)}%)</p>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-top:4px;">Review your answers below with citations to Silberschatz Operating System Concepts (10th Ed.).</p>
        </div>
      `;
    }
  }
};

// ----------------------------------------------------
// Formula Sheet Quick Calculators
// ----------------------------------------------------
const Formulas = {
  calcTAT() {
    const ct = parseFloat(document.getElementById('f-ct').value) || 0;
    const at = parseFloat(document.getElementById('f-at').value) || 0;
    document.getElementById('f-tat-res').innerText = (ct - at);
  },
  calcWT() {
    const tat = parseFloat(document.getElementById('f-tat').value) || 0;
    const bt = parseFloat(document.getElementById('f-bt').value) || 0;
    document.getElementById('f-wt-res').innerText = (tat - bt);
  },
  calcExpAvg() {
    const a = parseFloat(document.getElementById('f-alpha').value) || 0.5;
    const tn = parseFloat(document.getElementById('f-tn').value) || 10;
    const taun = parseFloat(document.getElementById('f-taun').value) || 10;
    const res = (a * tn + (1 - a) * taun).toFixed(2);
    document.getElementById('f-exp-res').innerText = res;
  },
  calcEAT() {
    const h = (parseFloat(document.getElementById('f-hit').value) || 80) / 100;
    const tlb = parseFloat(document.getElementById('f-tlb-t').value) || 20;
    const ram = parseFloat(document.getElementById('f-ram-t').value) || 100;
    // EAT = h*(tlb + ram) + (1-h)*(tlb + 2*ram)
    const eat = (h * (tlb + ram) + (1 - h) * (tlb + 2 * ram)).toFixed(2);
    document.getElementById('f-eat-res').innerText = `${eat} ns`;
  }
};
"""
