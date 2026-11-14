/**
 * High-Voltage Canvas Signal Bus & Trace Renderer
 * Renders 60fps hardware bus lines, circuit copper traces, and 
 * data packets pulsing between OS subsystems.
 */

export class CanvasSignalBus {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.buses = []; // Array of { id, from: {x,y}, to: {x,y}, color, pulseSpeed, width }
    this.packets = []; // Active data pulses along buses
    this.clockPhase = 0;
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  setBuses(busList) {
    this.buses = busList;
  }

  emitPacket(busId, { color = '#00F0FF', size = 4, speed = 0.008, payload = '0x1' } = {}) {
    const bus = this.buses.find(b => b.id === busId);
    if (!bus) return;
    this.packets.push({
      bus,
      progress: 0,
      speed,
      color,
      size,
      payload
    });
  }

  render(dt = 0.016) {
    this.clockPhase += dt * 2.0;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Silicon Grid / Traces
    for (const bus of this.buses) {
      ctx.beginPath();
      ctx.strokeStyle = bus.color || 'rgba(217, 119, 54, 0.2)';
      ctx.lineWidth = bus.width || 1.5;
      ctx.setLineDash(bus.dashed ? [4, 4] : []);
      
      // Right-angle trace routing (hardware PCB style: horizontal then 45deg/vertical)
      const x1 = bus.from.x;
      const y1 = bus.from.y;
      const x2 = bus.to.x;
      const y2 = bus.to.y;
      
      const midX = (x1 + x2) / 2;
      ctx.moveTo(x1, y1);
      ctx.lineTo(midX, y1);
      ctx.lineTo(midX, y2);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Bus connection pads / solder points
      ctx.fillStyle = bus.color || '#D97736';
      ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
      ctx.fillRect(x2 - 2, y2 - 2, 4, 4);
    }
    ctx.setLineDash([]);

    // 2. Animate and Render Active Data Packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.progress += p.speed;

      if (p.progress >= 1.0) {
        this.packets.splice(i, 1);
        continue;
      }

      // Calculate position along orthogonal route
      const x1 = p.bus.from.x;
      const y1 = p.bus.from.y;
      const x2 = p.bus.to.x;
      const y2 = p.bus.to.y;
      const midX = (x1 + x2) / 2;

      let curX, curY;
      if (p.progress < 0.33) {
        const segT = p.progress / 0.33;
        curX = x1 + (midX - x1) * segT;
        curY = y1;
      } else if (p.progress < 0.66) {
        const segT = (p.progress - 0.33) / 0.33;
        curX = midX;
        curY = y1 + (y2 - y1) * segT;
      } else {
        const segT = (p.progress - 0.66) / 0.34;
        curX = midX + (x2 - midX) * segT;
        curY = y2;
      }

      // Glowing Data Electron
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Core bright center
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(curX, curY, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}
