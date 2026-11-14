/**
 * Metroidvania Silicon Die World Map
 * Interactive spatial facility map of the 7 OS sectors.
 * Houses the SVG conduit network and hardware IC chip nodes.
 */

import { SECTORS, CURRICULUM_NODES, CAPABILITIES } from '../data/curriculum.js';
import { ConduitNetwork } from './conduit-network.js';
import { SoundFX } from '../audio.js';

export class MetroidvaniaMap {
  constructor({ container, onSelectNode, userState }) {
    this.container = container;
    this.onSelectNode = onSelectNode;
    this.userState = userState;

    // Pan & Zoom initialization (centered on Sector 01 & 02)
    this.panX = 80;
    this.panY = 60;
    this.scale = 0.85;
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;

    this.initDOM();
    this.conduitNetwork = new ConduitNetwork(this.svgEl, this.userState);
    this.renderWorld();
    this.bindEvents();
  }

  initDOM() {
    this.container.innerHTML = `
      <!-- Floating Capability Inventory HUD -->
      <div class="hud-capabilities-bar panel-chamfer">
        <div class="hud-title">
          <span>KERNEL CAPABILITIES</span>
          <span id="hud-cap-counter">0 / ${Object.keys(CAPABILITIES).length}</span>
        </div>
        <div class="cap-slot-grid" id="hud-cap-grid"></div>
        <div class="hud-subtext">EARNED FROM SYSTEM MODULES</div>
      </div>

      <!-- Minimap / Radar HUD -->
      <div class="hud-radar-panel panel-chamfer">
        <div class="radar-header">FACILITY RADAR // SECTOR MATRIX</div>
        <div class="radar-grid" id="hud-radar-grid"></div>
      </div>

      <!-- Interactive Viewport Wrapper -->
      <div class="map-viewport-wrapper" id="map-viewport">
        <div class="map-world" id="map-world">
          <!-- SVG Conduit Network (Renders in World Coordinates) -->
          <svg class="conduit-svg-layer" id="conduit-svg" width="2200" height="1500"></svg>
          
          <!-- Sector Frames & Silicon IC Nodes Layer -->
          <div class="sectors-layer" id="sectors-layer"></div>
          <div class="nodes-layer" id="nodes-layer"></div>
        </div>
      </div>

      <!-- Map Navigation Controls -->
      <div class="map-controls-panel">
        <button class="icon-btn" id="btn-zoom-in" title="Zoom In">+</button>
        <button class="icon-btn" id="btn-zoom-out" title="Zoom Out">-</button>
        <button class="icon-btn" id="btn-zoom-reset" title="Recenter Facility Map">CENTER</button>
      </div>
    `;

    this.viewportEl = this.container.querySelector('#map-viewport');
    this.worldEl = this.container.querySelector('#map-world');
    this.svgEl = this.container.querySelector('#conduit-svg');
    this.sectorsLayer = this.container.querySelector('#sectors-layer');
    this.nodesLayer = this.container.querySelector('#nodes-layer');
    this.capGridEl = this.container.querySelector('#hud-cap-grid');
    this.capCounterEl = this.container.querySelector('#hud-cap-counter');
  }

  renderWorld() {
    // 1. Render Sector Boundaries
    this.sectorsLayer.innerHTML = '';
    SECTORS.forEach(sec => {
      const b = sec.bounds;
      const secDiv = document.createElement('div');
      secDiv.className = 'die-sector-chassis';
      secDiv.style.left = `${b.x}px`;
      secDiv.style.top = `${b.y}px`;
      secDiv.style.width = `${b.w}px`;
      secDiv.style.height = `${b.h}px`;
      secDiv.style.borderColor = `${sec.color}33`;

      secDiv.innerHTML = `
        <div class="die-sector-label" style="color: ${sec.color}">
          <span>${sec.name}</span>
          <span class="die-sector-hex">${sec.hex}</span>
        </div>
        <div class="die-sector-sub">${sec.bookChapters}</div>
      `;
      this.sectorsLayer.appendChild(secDiv);
    });

    // 2. Render SVG Conduits
    this.conduitNetwork.render();

    // 3. Render Hardware IC Chip Nodes
    this.nodesLayer.innerHTML = '';
    CURRICULUM_NODES.forEach(node => {
      const isMastered = this.userState.masteredNodes.has(node.id);
      const isUnlocked = this.isNodeUnlocked(node);
      const rewardCap = node.unlockedCapability ? CAPABILITIES[node.unlockedCapability] : null;

      const chip = document.createElement('div');
      chip.className = `ic-chip-node ${isMastered ? 'mastered' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`;
      chip.style.left = `${node.mapCoords.x}px`;
      chip.style.top = `${node.mapCoords.y}px`;

      // Status visual text
      let statusBadge = '<span class="chip-status-text ready">ONLINE</span>';
      if (isMastered) {
        statusBadge = '<span class="chip-status-text mastered">✓ MASTERED</span>';
      } else if (!isUnlocked) {
        const reqBadge = node.requiredCapabilities[0] ? CAPABILITIES[node.requiredCapabilities[0]]?.badge : 'LOCKED';
        statusBadge = `<span class="chip-status-text locked">🔒 ${reqBadge}</span>`;
      }

      chip.innerHTML = `
        <!-- IC Package Metal Pins on North & South Edges -->
        <div class="ic-pins-row top">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </div>

        <div class="ic-chip-substrate">
          <div class="ic-header">
            <span class="ic-id">D-${node.deckNumber}</span>
            ${statusBadge}
          </div>

          <div class="ic-body">
            <div class="ic-title">${node.shortTitle}</div>
            <div class="ic-slide-source">${node.slideTitle.replace('.pdf', '')}</div>
          </div>

          <div class="ic-footer">
            <span class="ic-chap">${node.silberschatz.chapter}</span>
            ${rewardCap ? `<span class="ic-reward" title="Unlocks Capability: ${rewardCap.name}">${rewardCap.icon} ${rewardCap.badge}</span>` : ''}
          </div>
        </div>

        <div class="ic-pins-row bottom">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </div>
      `;

      chip.addEventListener('click', () => {
        SoundFX.playRelayClick();
        this.onSelectNode(node, isUnlocked);
      });

      this.nodesLayer.appendChild(chip);
    });

    this.renderCapabilitiesHUD();
    this.renderRadarHUD();
    this.updateTransform();
  }

  isNodeUnlocked(node) {
    if (this.userState.isLinearMode) return true;
    if (node.requiredCapabilities.length === 0) return true;
    return node.requiredCapabilities.every(capId => this.userState.unlockedCapabilities.has(capId));
  }

  renderCapabilitiesHUD() {
    this.capGridEl.innerHTML = '';
    const capKeys = Object.keys(CAPABILITIES);
    let unlockedCount = 0;

    capKeys.forEach(key => {
      const cap = CAPABILITIES[key];
      const isUnlocked = this.userState.unlockedCapabilities.has(key);
      if (isUnlocked) unlockedCount++;

      const slot = document.createElement('div');
      slot.className = `cap-slot ${isUnlocked ? 'unlocked' : 'empty'}`;
      slot.title = `${cap.name}: ${cap.desc}`;
      slot.innerHTML = `
        <span class="cap-slot-icon">${isUnlocked ? cap.icon : '·'}</span>
        <span class="cap-slot-badge">${cap.badge}</span>
      `;
      this.capGridEl.appendChild(slot);
    });

    this.capCounterEl.textContent = `${unlockedCount} / ${capKeys.length}`;
  }

  renderRadarHUD() {
    const radarGrid = this.container.querySelector('#hud-radar-grid');
    if (!radarGrid) return;
    radarGrid.innerHTML = '';

    SECTORS.forEach(sec => {
      const allMastered = sec.nodes.every(id => this.userState.masteredNodes.has(id));
      const someUnlocked = sec.nodes.some(id => {
        const n = CURRICULUM_NODES.find(node => node.id === id);
        return n && this.isNodeUnlocked(n);
      });

      const cell = document.createElement('div');
      cell.className = `radar-cell ${allMastered ? 'mastered' : someUnlocked ? 'unlocked' : 'locked'}`;
      cell.style.borderColor = sec.color;
      cell.title = `${sec.name}: ${sec.bookChapters}`;
      cell.innerHTML = `<span>${sec.id.toUpperCase().replace('SEC_', 'S')}</span>`;
      radarGrid.appendChild(cell);
    });
  }

  bindEvents() {
    // Pan Dragging
    this.viewportEl.addEventListener('mousedown', (e) => {
      if (e.target.closest('.ic-chip-node') || e.target.closest('.hud-capabilities-bar') || e.target.closest('.hud-radar-panel')) return;
      this.isPanning = true;
      this.startX = e.clientX - this.panX;
      this.startY = e.clientY - this.panY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      this.panX = e.clientX - this.startX;
      this.panY = e.clientY - this.startY;
      this.updateTransform();
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });

    // Zoom Wheel
    this.viewportEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      this.scale = Math.max(0.4, Math.min(1.6, this.scale * zoomFactor));
      this.updateTransform();
    }, { passive: false });

    // Buttons
    this.container.querySelector('#btn-zoom-in').addEventListener('click', () => {
      this.scale = Math.min(1.6, this.scale * 1.15);
      this.updateTransform();
    });

    this.container.querySelector('#btn-zoom-out').addEventListener('click', () => {
      this.scale = Math.max(0.4, this.scale * 0.85);
      this.updateTransform();
    });

    this.container.querySelector('#btn-zoom-reset').addEventListener('click', () => {
      this.panX = 80;
      this.panY = 60;
      this.scale = 0.85;
      this.updateTransform();
    });
  }

  updateTransform() {
    this.worldEl.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
  }

  refresh() {
    this.renderWorld();
  }
}
