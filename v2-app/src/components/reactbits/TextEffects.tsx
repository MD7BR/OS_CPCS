import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_GLYPHS = '01ABCDEF_//:#';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 28,
  maxIterations = 10,
  characters = DEFAULT_GLYPHS,
  className,
}) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    const total = Math.max(maxIterations, text.length);
    const id = window.setInterval(() => {
      frame += 1;
      const revealedCount = Math.floor((frame / total) * text.length);
      let next = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ' || i < revealedCount) {
          next += text[i];
        } else {
          next += characters[Math.floor(Math.random() * characters.length)];
        }
      }
      setDisplay(next);
      if (frame >= total) {
        window.clearInterval(id);
        setDisplay(text);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, maxIterations, characters]);

  return <span className={className}>{display}</span>;
};

interface ShinyTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text, speed = 3.2, className }) => {
  return (
    <span
      className={cn('inline-block bg-clip-text text-transparent', className)}
      style={{
        backgroundImage:
          'linear-gradient(110deg, currentColor 35%, rgba(255,255,255,0.95) 50%, currentColor 65%)',
        backgroundSize: '220% 100%',
        animation: `shine ${speed}s linear infinite`,
        WebkitBackgroundClip: 'text',
        color: 'var(--color-cyan)',
      }}
    >
      {text}
    </span>
  );
};

interface CountUpProps {
  to: number;
  duration?: number;
  separator?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ to, duration = 0.55, separator = ',', className }) => {
  const [val, setVal] = useState(to);
  const prevRef = useRef(to);

  useEffect(() => {
    const startVal = prevRef.current;
    prevRef.current = to;
    if (startVal === to) {
      setVal(to);
      return;
    }
    const startTime = performance.now();
    const durationMs = Math.max(120, duration * 1000);
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(startVal + (to - startVal) * eased));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  const formatted = separator ? val.toLocaleString('en-US').replace(/,/g, separator) : String(val);
  return <span className={cn('tabular-nums', className)}>{formatted}</span>;
};
