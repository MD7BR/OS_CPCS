/**
 * SVG Hardware Bus Conduit Network
 * Replaces disconnected canvas overlays with deterministic SVG conduits
 * that scale and pan seamlessly with world space.
 * Orthogonal routing ensures conduits never cut through node bodies.
 */

import { CURRICULUM_NODES, CAPABILITIES } from '../data/curriculum.js';

export class ConduitNetwork {
  constructor(svgElement, userState) {
    this.svg = svgElement;
    this.userState = userState;
    this.nodeMap = new Map(CURRICULUM_NODES.map(n => [n.id, n]));
    this.NODE_W = 160;
    this.NODE_H = 90;
  }

  render() {
    this.svg.innerHTML = '';

    // Define SVG filters and defs for glowing circuit traces & data pulses
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="bus-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <linearGradient id="bus-pulse-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00F0FF" stop-opacity="0" />
        <stop offset="50%" stop-color="#00F0FF" stop-opacity="1" />
        <stop offset="100%" stop-color="#00F0FF" stop-opacity="0" />
      </linearGradient>

      <linearGradient id="bus-pulse-amber" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFB000" stop-opacity="0" />
        <stop offset="50%" stop-color="#FFB000" stop-opacity="1" />
        <stop offset="100%" stop-color="#FFB000" stop-opacity="0" />
      </linearGradient>
    `;
    this.svg.appendChild(defs);

    // Build connections from prerequisites
    CURRICULUM_NODES.forEach(targetNode => {
      targetNode.prerequisites.forEach(prereqId => {
        const sourceNode = this.nodeMap.get(prereqId);
        if (!sourceNode) return;

        const isConnectionUnlocked = this.checkConnectionUnlocked(targetNode);
        const pathD = this.calculateOrthogonalRoute(sourceNode, targetNode);

        // 1. Conduit Tray (outer structural casing)
        const casing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        casing.setAttribute('d', pathD);
        casing.setAttribute('class', 'conduit-casing');
        this.svg.appendChild(casing);

        // 2. High-Voltage Copper/Cyan Core Trace
        const core = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        core.setAttribute('d', pathD);
        core.setAttribute('class', `conduit-core ${isConnectionUnlocked ? 'active' : 'locked'}`);
        if (!isConnectionUnlocked) {
          core.setAttribute('stroke-dasharray', '6 6');
        }
        this.svg.appendChild(core);

        // 3. Solder Connection Terminals at ends
        const startPoint = this.getPortCoords(sourceNode, this.determinePort(sourceNode, targetNode).from);
        const endPoint = this.getPortCoords(targetNode, this.determinePort(sourceNode, targetNode).to);
        this.renderTerminalPad(startPoint.x, startPoint.y, isConnectionUnlocked);
        this.renderTerminalPad(endPoint.x, endPoint.y, isConnectionUnlocked);

        // 4. If connection requires capabilities and is locked, place a physical Security Airlock Gate
        if (!isConnectionUnlocked && targetNode.requiredCapabilities.length > 0) {
          this.renderAirlockGate(sourceNode, targetNode, targetNode.requiredCapabilities[0]);
        }
      });
    });
  }

  checkConnectionUnlocked(targetNode) {
    if (this.userState.isLinearMode) return true;
    if (targetNode.requiredCapabilities.length === 0) return true;
    return targetNode.requiredCapabilities.every(capId => this.userState.unlockedCapabilities.has(capId));
  }

  determinePort(source, target) {
    const dx = target.mapCoords.x - source.mapCoords.x;
    const dy = target.mapCoords.y - source.mapCoords.y;

    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx > 0) return { from: 'east', to: 'west' };
      else return { from: 'west', to: 'east' };
    } else {
      if (dy > 0) return { from: 'south', to: 'north' };
      else return { from: 'north', to: 'south' };
    }
  }

  getPortCoords(node, port) {
    const x = node.mapCoords.x;
    const y = node.mapCoords.y;
    const w = this.NODE_W;
    const h = this.NODE_H;

    switch (port) {
      case 'north': return { x: x + w / 2, y: y };
      case 'south': return { x: x + w / 2, y: y + h };
      case 'west':  return { x: x, y: y + h / 2 };
      case 'east':  return { x: x + w, y: y + h / 2 };
      default:      return { x: x + w / 2, y: y + h / 2 };
    }
  }

  calculateOrthogonalRoute(source, target) {
    const { from, to } = this.determinePort(source, target);
    const start = this.getPortCoords(source, from);
    const end = this.getPortCoords(target, to);

    // Direct horizontal or vertical conduit
    if (Math.abs(start.y - end.y) < 4) {
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }
    if (Math.abs(start.x - end.x) < 4) {
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }

    // Right-angle conduit with rounded fillet bend
    if (from === 'east' && to === 'west') {
      const midX = (start.x + end.x) / 2;
      return `M ${start.x} ${start.y} 
              L ${midX - 10} ${start.y} 
              Q ${midX} ${start.y} ${midX} ${start.y + (end.y > start.y ? 10 : -10)}
              L ${midX} ${end.y + (end.y > start.y ? -10 : 10)}
              Q ${midX} ${end.y} ${midX + 10} ${end.y}
              L ${end.x} ${end.y}`;
    }

    if (from === 'south' && to === 'north') {
      const midY = (start.y + end.y) / 2;
      return `M ${start.x} ${start.y}
              L ${start.x} ${midY - 10}
              Q ${start.x} ${midY} ${start.x + (end.x > start.x ? 10 : -10)} ${midY}
              L ${end.x + (end.x > start.x ? -10 : 10)} ${midY}
              Q ${end.x} ${midY} ${end.x} ${midY + (end.y > midY ? 10 : -10)}
              L ${end.x} ${end.y}`;
    }

    if (from === 'north' && to === 'south') {
      const midY = (start.y + end.y) / 2;
      return `M ${start.x} ${start.y}
              L ${start.x} ${midY + 10}
              Q ${start.x} ${midY} ${start.x + (end.x > start.x ? 10 : -10)} ${midY}
              L ${end.x + (end.x > start.x ? -10 : 10)} ${midY}
              Q ${end.x} ${midY} ${end.x} ${midY - 10}
              L ${end.x} ${end.y}`;
    }

    // Default 2-segment fallback
    return `M ${start.x} ${start.y} L ${end.x} ${start.y} L ${end.x} ${end.y}`;
  }

  renderTerminalPad(x, y, active) {
    const pad = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    pad.setAttribute('x', x - 4);
    pad.setAttribute('y', y - 4);
    pad.setAttribute('width', 8);
    pad.setAttribute('height', 8);
    pad.setAttribute('class', `conduit-terminal-pad ${active ? 'active' : 'locked'}`);
    this.svg.appendChild(pad);
  }

  renderAirlockGate(source, target, capKey) {
    const { from, to } = this.determinePort(source, target);
    const start = this.getPortCoords(source, from);
    const end = this.getPortCoords(target, to);
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    const cap = CAPABILITIES[capKey];
    const badgeText = cap ? cap.badge : 'LOCKED';

    // Group for the security gate badge
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${midX}, ${midY})`);
    g.setAttribute('class', 'airlock-security-gate');

    g.innerHTML = `
      <rect x="-38" y="-12" width="76" height="24" rx="2" class="gate-bg" />
      <text x="0" y="4" text-anchor="middle" class="gate-text">🔒 ${badgeText}</text>
    `;

    this.svg.appendChild(g);
  }
}
