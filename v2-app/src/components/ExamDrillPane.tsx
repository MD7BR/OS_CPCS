import React from 'react';
import { CheckCircle2, Flame, RotateCcw, XCircle } from 'lucide-react';
import { QUIZ_KNOWLEDGE_BASE } from '@/data/trove';
import { useKernelStore } from '@/store/useKernelStore';
import { Sound } from '@/lib/sound';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/primitives';

interface ExamDrillPaneProps {
  deckId: string;
}

export const ExamDrillPane: React.FC<ExamDrillPaneProps> = ({ deckId }) => {
  const { state, recordQuizAnswer, comboMult } = useKernelStore();
  const questions = QUIZ_KNOWLEDGE_BASE[deckId] || [];
  const rec = state.quizScores[deckId];
  const answers = rec?.answers || {};
  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  const answeredCount = Object.keys(answers).length;
  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center font-mono text-xs text-muted-foreground">
        No exam drill questions registered for this deck.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
              Exam Drill Clearance
            </span>
            <Badge variant={correctCount >= 3 ? 'emerald' : 'amber'}>
              {correctCount} / {questions.length} Correct
            </Badge>
            {state.streak >= 2 && (
              <Badge variant="amber">
                <Flame className="h-3 w-3" /> {state.streak}x ({comboMult}x XP)
              </Badge>
            )}
          </div>
          <span className="font-mono text-[10.5px] text-muted-foreground">
            Best score: {rec?.bestCorrect ?? 0}/{questions.length} · Strict Gate threshold: ≥3/5
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={pct} className="w-28" />
          <span className="font-mono text-xs font-bold text-primary">{pct}%</span>
        </div>
      </div>

      {questions.map((q, qIdx) => {
        const picked = answers[qIdx];
        return (
          <div key={qIdx} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[10.5px] text-muted-foreground">
              <span>QUESTION {qIdx + 1} OF {questions.length}</span>
              {picked && (
                <span className={picked.correct ? 'font-bold text-accent' : 'font-bold text-destructive'}>
                  {picked.correct ? '✓ VERIFIED' : '✕ INCORRECT'}
                </span>
              )}
            </div>
            <p className="mb-3 font-sans text-sm font-semibold leading-relaxed text-foreground">{q.q}</p>

            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt, optIdx) => {
                const isSelected = picked?.selected === optIdx;
                const isAnswer = optIdx === q.answer;
                let cls = 'border-border bg-secondary/50 text-foreground hover:border-primary/60 hover:bg-primary/10';
                if (picked) {
                  if (isAnswer) {
                    cls = 'border-accent bg-accent/15 text-accent';
                  } else if (isSelected && !isAnswer) {
                    cls = 'border-destructive bg-destructive/15 text-destructive';
                  } else {
                    cls = 'border-border/50 bg-muted/30 text-muted-foreground opacity-70';
                  }
                }
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => {
                      const ok = optIdx === q.answer;
                      if (ok) Sound.click(1120);
                      else Sound.alarm();
                      recordQuizAnswer(deckId, qIdx, optIdx, ok, questions.length);
                    }}
                    className={`spark-trigger flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-left font-sans text-xs transition-all ${cls}`}
                  >
                    <span className="mt-0.5 font-mono text-[10px] font-bold opacity-80">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {picked && isAnswer && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />}
                    {picked && isSelected && !isAnswer && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
                  </button>
                );
              })}
            </div>

            {picked && (
              <div className="mt-3 rounded-md border-l-2 border-primary bg-muted/60 px-3 py-2 font-sans text-xs leading-relaxed text-muted-foreground">
                <strong className="font-mono text-[10.5px] uppercase text-primary">Rubric Explanation: </strong>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {answeredCount > 0 && (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Resetting answers is easy by re-answering or keep bestCorrect intact
              Sound.click(760);
            }}
            className="hidden"
          >
            <RotateCcw className="h-3 w-3" />
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};
