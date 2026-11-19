import React from 'react';
import { KernelProvider } from '@/store/useKernelStore';
import { ExhibitionShell } from '@/components/ExhibitionShell';

class KernelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--shuta-bg)] p-6 text-center text-[var(--shuta-ink)]">
          <div className="max-w-lg rounded-[3px] border border-[var(--shuta-error)] p-6">
            <h2 className="font-display text-lg font-extrabold uppercase text-[var(--shuta-error)]">
              Recoverable Interface Fault
            </h2>
            <p className="mt-2 font-mono text-xs text-[var(--shuta-dim)]">{this.state.error.message}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => this.setState({ error: null })}
                className="rounded-[2px] bg-[var(--shuta-ink)] px-3 py-1.5 font-mono text-xs font-bold uppercase text-[var(--shuta-bg)]"
              >
                Recover Archive
              </button>
              <a
                href="../v2/"
                className="rounded-[2px] border border-[var(--shuta-line-strong)] px-3 py-1.5 font-mono text-xs uppercase text-[var(--shuta-ink)]"
              >
                v2 Beta
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <KernelErrorBoundary>
      <KernelProvider>
        <ExhibitionShell />
      </KernelProvider>
    </KernelErrorBoundary>
  );
}
