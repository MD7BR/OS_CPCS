/**
 * Linear Syllabus Mode (Exam & Lecture Track)
 * Organizes all 21 decks into a chronological lecture timeline
 * with Silberschatz 10th Ed. correlations and instant room access.
 */

import { SECTORS, CURRICULUM_NODES, CAPABILITIES } from '../data/curriculum.js';
import { SoundFX } from '../audio.js';

export class LinearSyllabus {
  constructor({ container, onSelectNode, userState }) {
    this.container = container;
    this.onSelectNode = onSelectNode;
    this.userState = userState;
    this.searchQuery = '';
    this.activeFilter = 'ALL';

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="linear-header">
        <div>
          <div class="linear-title">CHRONOLOGICAL LECTURE & EXAM TRACK</div>
          <div class="linear-subtitle">All 21 CPCS-361 Modules Correlated with Silberschatz 10th Edition • Direct Access</div>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <input type="text" id="syllabus-search" placeholder="FILTER KEYWORDS (E.G. 'BANKER', 'SEMAPHORE')..." 
            style="background: #060910; border: 1.5px solid var(--border-trace); color: var(--text-primary); font-family: var(--font-mono); font-size: 11px; padding: 8px 14px; width: 320px; outline: none;" />
        </div>
      </div>

      <!-- Quick Topic Filter Bar -->
      <div style="max-width: 980px; margin: 0 auto; width: 100%; display: flex; gap: 6px; flex-wrap: wrap;">
        <button class="btn-industrial filter-btn active" data-filter="ALL">ALL (21)</button>
        <button class="btn-industrial filter-btn" data-filter="sec_01">KERNEL CORE (2)</button>
        <button class="btn-industrial filter-btn" data-filter="sec_02">CPU SCHEDULING (5)</button>
        <button class="btn-industrial filter-btn" data-filter="sec_03">CONCURRENCY (4)</button>
        <button class="btn-industrial filter-btn" data-filter="sec_04">DEADLOCKS (3)</button>
        <button class="btn-industrial filter-btn" data-filter="sec_05">MEMORY & VM (3)</button>
        <button class="btn-industrial filter-btn" data-filter="sec_06">STORAGE & I/O (3)</button>
        <button class="btn-industrial filter-btn" data-filter="sec_07">SECURITY (1)</button>
      </div>

      <div id="linear-sectors-container"></div>
    `;

    this.renderSectorBlocks();
    this.bindEvents();
  }

  renderSectorBlocks() {
    const listContainer = this.container.querySelector('#linear-sectors-container');
    listContainer.innerHTML = '';

    const query = this.searchQuery.toLowerCase();

    SECTORS.forEach(sec => {
      // Filter by sector button if not ALL
      if (this.activeFilter !== 'ALL' && sec.id !== this.activeFilter) return;

      // Find matching nodes in this sector
      const sectorNodes = CURRICULUM_NODES.filter(n => {
        if (n.sector !== sec.id) return false;
        if (!query) return true;
        return n.shortTitle.toLowerCase().includes(query) ||
               n.slideTitle.toLowerCase().includes(query) ||
               n.silberschatz.chapter.toLowerCase().includes(query) ||
               n.silberschatz.title.toLowerCase().includes(query) ||
               n.summary.toLowerCase().includes(query);
      });

      if (sectorNodes.length === 0) return;

      const secBlock = document.createElement('div');
      secBlock.className = 'linear-sector-block';
      secBlock.innerHTML = `
        <div class="linear-sector-title" style="border-left-color: ${sec.color}">
          <span>${sec.name}</span>
          <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${sec.bookChapters}</span>
        </div>
        <div class="linear-cards-group" style="display: flex; flex-direction: column; gap: 8px;"></div>
      `;

      const cardsGroup = secBlock.querySelector('.linear-cards-group');

      sectorNodes.forEach(node => {
        const isMastered = this.userState.masteredNodes.has(node.id);
        const rewardCap = node.unlockedCapability ? CAPABILITIES[node.unlockedCapability] : null;

        const card = document.createElement('div');
        card.className = 'linear-node-card panel-chamfer';
        card.innerHTML = `
          <div class="linear-node-left">
            <div class="linear-deck-num">${node.deckNumber}</div>
            <div class="linear-node-info">
              <h4>${node.shortTitle}</h4>
              <p>${node.summary}</p>
              <div class="linear-book-tag">
                <span>📖 ${node.silberschatz.chapter} (${node.silberschatz.sections}) — "${node.silberschatz.title}"</span>
              </div>
            </div>
          </div>
          <div class="linear-node-right">
            ${rewardCap ? `<span class="brand-badge" style="border-color: var(--color-amber); color: var(--color-amber);">${rewardCap.icon} ${rewardCap.badge}</span>` : ''}
            <span class="btn-industrial ${isMastered ? 'primary' : ''}">
              ${isMastered ? '✓ COMPLETED' : 'LAUNCH LAB →'}
            </span>
          </div>
        `;

        card.addEventListener('click', () => {
          SoundFX.playRelayClick();
          this.onSelectNode(node, true); // Linear mode always allows access
        });

        cardsGroup.appendChild(card);
      });

      listContainer.appendChild(secBlock);
    });
  }

  bindEvents() {
    const searchInput = this.container.querySelector('#syllabus-search');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim();
      this.renderSectorBlocks();
    });

    const filterBtns = this.container.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        SoundFX.playRelayClick();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter;
        this.renderSectorBlocks();
      });
    });
  }

  refresh() {
    this.renderSectorBlocks();
  }
}
