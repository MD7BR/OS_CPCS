import * as React from 'react';
import * as DialogPrim from '@radix-ui/react-dialog';
import * as HoverCardPrim from '@radix-ui/react-hover-card';
import * as TooltipPrim from '@radix-ui/react-tooltip';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const KernelDialog = DialogPrim.Root;
export const KernelDialogTrigger = DialogPrim.Trigger;
export const KernelDialogClose = DialogPrim.Close;

export function KernelDialogBody({
  title,
  subtitle,
  maxWidth = 'max-w-4xl',
  className,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  maxWidth?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrim.Portal>
      <DialogPrim.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px]" />
      <DialogPrim.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[calc(100vw-1rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-primary/35 bg-popover text-popover-foreground shadow-2xl',
          maxWidth,
          className
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card/80 px-4 py-3">
          <div className="min-w-0">
            <DialogPrim.Title className="flex items-center gap-2 font-display text-sm font-bold tracking-wider text-primary">
              {title}
            </DialogPrim.Title>
            {subtitle && <DialogPrim.Description className="mt-0.5 font-mono text-[11px] text-muted-foreground">{subtitle}</DialogPrim.Description>}
          </div>
          <DialogPrim.Close className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Close</span>
          </DialogPrim.Close>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </DialogPrim.Content>
    </DialogPrim.Portal>
  );
}

export const KernelSheet = DialogPrim.Root;

export function KernelSheetPanel({
  side = 'right',
  title,
  badge,
  children,
  className,
}: {
  side?: 'left' | 'right';
  title: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrim.Portal>
      <DialogPrim.Overlay className="fixed inset-0 z-50 bg-black/65" />
      <DialogPrim.Content
        className={cn(
          'fixed inset-y-0 z-50 flex w-[min(410px,90vw)] flex-col border-border bg-popover text-popover-foreground shadow-2xl',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          className
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border bg-card/90 px-4 py-3">
          <DialogPrim.Title className="font-display text-xs font-bold uppercase tracking-widest text-primary">
            {title}
          </DialogPrim.Title>
          <div className="flex items-center gap-2">
            {badge}
            <DialogPrim.Close className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary">
              <X className="h-3.5 w-3.5" />
            </DialogPrim.Close>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </DialogPrim.Content>
    </DialogPrim.Portal>
  );
}

export const KernelHoverCard = HoverCardPrim.Root;
export const KernelHoverTrigger = HoverCardPrim.Trigger;

export function KernelHoverContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <HoverCardPrim.Portal>
      <HoverCardPrim.Content
        sideOffset={6}
        className={cn(
          'z-50 w-72 rounded-md border border-primary/40 bg-popover p-3 text-xs text-popover-foreground shadow-xl',
          className
        )}
      >
        {children}
      </HoverCardPrim.Content>
    </HoverCardPrim.Portal>
  );
}

export const KernelTooltipProvider = TooltipPrim.Provider;
export const KernelTooltip = TooltipPrim.Root;
export const KernelTooltipTrigger = TooltipPrim.Trigger;

export function KernelTooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipPrim.Portal>
      <TooltipPrim.Content
        sideOffset={5}
        className="z-50 rounded border border-border bg-popover px-2.5 py-1 font-mono text-[11px] text-foreground shadow-lg"
      >
        {children}
      </TooltipPrim.Content>
    </TooltipPrim.Portal>
  );
}
