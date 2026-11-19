import React from 'react';
import { KernelProvider } from '@/store/useKernelStore';
import { KernelTooltipProvider } from '@/components/ui/overlays';
import { AppShell } from '@/components/AppShell';

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
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center font-mono text-foreground">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 max-w-lg">
            <h2 className="font-display text-base font-bold text-destructive">
              KERNEL//BREACH — Recoverable UI Fault
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">{this.state.error.message}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => this.setState({ error: null })}
                className="rounded border border-primary bg-primary/15 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/25"
              >
                Recover Workspace
              </button>
              <a
                href="../"
                className="rounded border border-border bg-secondary px-3 py-1.5 text-xs text-foreground"
              >
                Open v1 Classic
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
      <KernelTooltipProvider delayDuration={200}>
        <KernelProvider>
          <AppShell />
        </KernelProvider>
      </KernelTooltipProvider>
    </KernelErrorBoundary>
  );
}
