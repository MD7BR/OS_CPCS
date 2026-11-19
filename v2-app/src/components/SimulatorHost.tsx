import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { mountLegacySimulator } from '@/simulators/legacySimulators';
import { useKernelStore } from '@/store/useKernelStore';
import { Button } from '@/components/ui/button';

interface SimulatorHostProps {
  deckId: string;
  onFormulasExtracted?: (html: string) => void;
}

export const SimulatorHost: React.FC<SimulatorHostProps> = ({ deckId, onFormulasExtracted }) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { markSimExplored } = useKernelStore();
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.innerHTML = '';
    const formulaProxy = { innerHTML: '' };
    mountLegacySimulator(deckId, el, formulaProxy);
    if (formulaProxy.innerHTML && onFormulasExtracted) {
      onFormulasExtracted(formulaProxy.innerHTML);
    }
    markSimExplored(deckId);
  }, [deckId, mountKey, markSimExplored, onFormulasExtracted]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-2 font-mono text-[11px] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Hardware &amp; Algorithm Lab · Live Handwritten Exam Workings</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => setMountKey((k) => k + 1)}>
          <RotateCcw className="h-3 w-3" />
          Reset Lab
        </Button>
      </div>

      <div ref={stageRef} className="min-w-0" />
    </div>
  );
};
