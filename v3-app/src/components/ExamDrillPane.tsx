import React from 'react';
import { Check, X } from 'lucide-react';
import { QUIZ_KNOWLEDGE_BASE } from '@/data/trove';
import { useKernelStore } from '@/store/useKernelStore';
import { Sound } from '@/lib/sound';
import { HairlineProgress, Pill } from '@/components/ui';

interface ExamDrillPaneProps {
  deckId: string;
}

export const ExamDrillPane: React.FC<ExamDrillPaneProps> = ({ deckId }) => {
  const { state, recordQuizAnswer, comboMult } = useKernelStore();
  const questions = QUIZ_KNOWLEDGE_BASE[deckId] || [];
  const rec = state.quizScores[deckId];
  const answers = rec?.answers || {};
  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  if (questions.length === 0) {
    return (
      <div className="border border-[var(--shuta-line)] bg-[var(--shuta-card)] p-8 text-center font-serif italic text-[var(--shuta-dim)]">
        No exam drill items indexed for this plate.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border-b border-[var(--shuta-line)] pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.03em] text-[var(--shuta-ink)]">
              Exam Drill Verification
            </span>
            <Pill tone={correctCount >= 3 ? 'live' : 'warn'}>
              {correctCount} / {questions.length} Verified
            </Pill>
            {state.streak >= 2 && <Pill tone="ink">{state.streak}x · {comboMult}x XP</Pill>}
          </div>
          <span className="shuta-chrome text-[var(--shuta-dim)]">Best {rec?.bestCorrect ?? 0}/{questions.length}</span>
        </div>
        <HairlineProgress value={pct} className="mt-3" />
      </div>

      {questions.map((q, qIdx) => {
        const picked = answers[qIdx];
        return (
          <article key={qIdx} className="border-b border-[var(--shuta-line)] pb-5">
            <div className="mb-2 flex items-center justify-between gap-2 shuta-chrome text-[var(--shuta-dim)]">
              <span>Item {String(qIdx + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span>
              {picked && (
                <span className={picked.correct ? 'font-bold text-[var(--shuta-live)]' : 'font-bold text-[var(--shuta-error)]'}>
                  {picked.correct ? '✓ Verified' : '✕ Incorrect'}
                </span>
              )}
            </div>

            <p className="mb-3 font-serif text-base font-medium leading-relaxed text-[var(--shuta-ink)]">{q.q}</p>

            <div className="grid grid-cols-1 gap-2">
              {(q.opts || []).map((opt, optIdx) => {
                const isSelected = picked?.selected === optIdx;
                const isAnswer = optIdx === q.answer;
                let cls =
                  'border-[var(--shuta-line)] bg-[var(--shuta-card)] text-[var(--shuta-ink)] hover:border-[var(--shuta-ink)]';
                if (picked) {
                  if (isAnswer) {
                    cls = 'border-[var(--shuta-live)] bg-[color-mix(in_srgb,var(--shuta-live)_10%,var(--shuta-card))] text-[var(--shuta-live)]';
                  } else if (isSelected && !isAnswer) {
                    cls = 'border-[var(--shuta-error)] bg-[color-mix(in_srgb,var(--shuta-error)_9%,var(--shuta-card))] text-[var(--shuta-error)]';
                  } else {
                    cls = 'border-[var(--shuta-line)] opacity-55';
                  }
                }
                const hasPrefix = /^[A-D]\)\s/.test(opt);
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
                    className={`spark-trigger flex items-start gap-2.5 rounded-[2px] border px-3.5 py-2.5 text-left font-serif text-sm transition-colors ${cls}`}
                  >
                    {!hasPrefix && (
                      <span className="mt-0.5 font-mono text-[10px] font-bold opacity-70">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                    )}
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {picked && isAnswer && <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--shuta-live)]" />}
                    {picked && isSelected && !isAnswer && <X className="mt-1 h-4 w-4 shrink-0 text-[var(--shuta-error)]" />}
                  </button>
                );
              })}
            </div>

            {picked && (
              <div className="mt-3 border-l-2 border-[var(--shuta-ink)] bg-[var(--shuta-panel)] px-3.5 py-2.5 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                <span className="shuta-chrome mr-2 font-bold text-[var(--shuta-ink)]">Rubric —</span>
                {q.explanation}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};
