import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className,
  spotlightColor = 'rgba(var(--spotlight-rgb), 0.14)',
  onMouseMove,
  onMouseLeave,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
    }
    onMouseMove?.(e);
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setPos((prev) => ({ ...prev, opacity: 0 }));
    onMouseLeave?.(e);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        'relative overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200',
        className
      )}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 75%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

interface SquaresProps {
  speed?: number;
  squareSize?: number;
  borderColor?: string;
  hoverFillColor?: string;
  paused?: boolean;
  className?: string;
}

export const Squares: React.FC<SquaresProps> = ({
  speed = 0.25,
  squareSize = 42,
  borderColor = 'rgba(30, 41, 59, 0.45)',
  hoverFillColor = 'rgba(0, 240, 255, 0.06)',
  paused = false,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverCell = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (paused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let offsetX = 0;
    let offsetY = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      hoverCell.current = {
        x: Math.floor((e.clientX - rect.left + offsetX) / squareSize),
        y: Math.floor((e.clientY - rect.top + offsetY) / squareSize),
      };
    };
    const onLeave = () => {
      hoverCell.current = null;
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const draw = () => {
      offsetX = (offsetX + speed) % squareSize;
      offsetY = (offsetY + speed * 0.6) % squareSize;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;

      const cols = Math.ceil(canvas.width / squareSize) + 2;
      const rows = Math.ceil(canvas.height / squareSize) + 2;
      for (let gx = -1; gx < cols; gx++) {
        for (let gy = -1; gy < rows; gy++) {
          const px = gx * squareSize - offsetX;
          const py = gy * squareSize - offsetY;
          if (hoverCell.current && hoverCell.current.x === gx && hoverCell.current.y === gy) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(px, py, squareSize, squareSize);
          }
          ctx.strokeRect(px, py, squareSize, squareSize);
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [paused, speed, squareSize, borderColor, hoverFillColor]);

  return <canvas ref={canvasRef} className={cn('pointer-events-auto absolute inset-0 h-full w-full', className)} />;
};

interface MagnetProps {
  padding?: number;
  magnetStrength?: number;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Magnet: React.FC<MagnetProps> = ({
  padding = 24,
  magnetStrength = 4,
  disabled = false,
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  if (disabled || isCoarse) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        if (Math.abs(dx) < rect.width / 2 + padding && Math.abs(dy) < rect.height / 2 + padding) {
          setOffset({ x: dx / magnetStrength, y: dy / magnetStrength });
        }
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      <div
        style={{
          transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
          transition: offset.x === 0 && offset.y === 0 ? 'transform 0.35s ease-out' : 'transform 0.08s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface ClickSparkProps {
  sparkColor?: string;
  sparkCount?: number;
  sparkRadius?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#00FFA3',
  sparkCount = 9,
  sparkRadius = 22,
  duration = 380,
  className,
  children,
}) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<{ x: number; y: number; angle: number; born: number }[]>([]);
  const rafRef = useRef<number | null>(null);

  const runLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tick = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((s) => now - s.born < duration);
      for (const s of sparksRef.current) {
        const progress = (now - s.born) / duration;
        const eased = progress * (2 - progress);
        const dist = eased * sparkRadius;
        const len = 8 * (1 - eased);
        const x1 = s.x + Math.cos(s.angle) * dist;
        const y1 = s.y + Math.sin(s.angle) * dist;
        const x2 = s.x + Math.cos(s.angle) * (dist + len);
        const y2 = s.y + Math.sin(s.angle) * (dist + len);
        ctx.strokeStyle = sparkColor;
        ctx.globalAlpha = 1 - progress;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (sparksRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target || !target.closest('button, [role="button"], .spark-trigger')) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const rect = wrap.getBoundingClientRect();
    if (canvas.width !== Math.round(rect.width) || canvas.height !== Math.round(rect.height)) {
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
    }
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (Math.PI * 2 * i) / sparkCount,
        born: now,
      });
    }
    runLoop();
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} onClick={handleClick} className={cn('relative', className)}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-50 h-full w-full" />
      {children}
    </div>
  );
};

interface StarBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  speed?: string;
  active?: boolean;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  color = '#00F0FF',
  speed = '4s',
  active = true,
  className,
  children,
  ...rest
}) => {
  return (
    <div className={cn('relative overflow-hidden rounded-lg p-[1px]', className)} {...rest}>
      {active && (
        <>
          <div
            className="pointer-events-none absolute -bottom-2 right-[-150%] h-8 w-[260%] rounded-full opacity-70 animate-star-movement-bottom"
            style={{
              background: `radial-gradient(circle, ${color}, transparent 22%)`,
              animationDuration: speed,
            }}
          />
          <div
            className="pointer-events-none absolute -top-2 left-[-150%] h-8 w-[260%] rounded-full opacity-70 animate-star-movement-top"
            style={{
              background: `radial-gradient(circle, ${color}, transparent 22%)`,
              animationDuration: speed,
            }}
          />
        </>
      )}
      <div className="relative z-10 h-full w-full rounded-[7px] bg-card">{children}</div>
    </div>
  );
};

interface AnimatedListProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}

export function AnimatedList<T>({
  items,
  keyExtractor,
  renderItem,
  className,
  emptyState,
}: AnimatedListProps<T>) {
  if (items.length === 0) {
    return <>{emptyState || <div className="py-8 text-center font-mono text-xs text-muted-foreground">No matching entries.</div>}</>;
  }
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item, idx) => (
        <div
          key={keyExtractor(item, idx)}
          className="transition-all duration-200"
          style={{ animationDelay: `${Math.min(idx, 12) * 20}ms` }}
        >
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );
}
