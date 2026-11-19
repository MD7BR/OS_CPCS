import * as React from 'react';
import * as DialogPrim from '@radix-ui/react-dialog';
import * as TabsPrim from '@radix-ui/react-tabs';
import * as AccordionPrim from '@radix-ui/react-accordion';
import * as SwitchPrim from '@radix-ui/react-switch';
import * as ProgressPrim from '@radix-ui/react-progress';
import * as ToggleGroupPrim from '@radix-ui/react-toggle-group';
import * as ResizablePrim from 'react-resizable-panels';
import { ChevronDown, GripVertical, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[2px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        ink: 'border border-[var(--shuta-ink)] bg-[var(--shuta-ink)] text-[var(--shuta-bg)] hover:opacity-85',
        outline:
          'border border-[var(--shuta-line-strong)] bg-transparent text-[var(--shuta-ink)] hover:bg-[var(--shuta-ink)] hover:text-[var(--shuta-bg)] hover:border-[var(--shuta-ink)]',
        subtle:
          'border border-[var(--shuta-line)] bg-[var(--shuta-panel)] text-[var(--shuta-ink)] hover:border-[var(--shuta-ink)]',
        ghost:
          'border border-transparent bg-transparent text-[var(--shuta-dim)] hover:text-[var(--shuta-ink)]',
        live: 'border border-[var(--shuta-live)] bg-[color-mix(in_srgb,var(--shuta-live)_12%,transparent)] text-[var(--shuta-live)] hover:bg-[var(--shuta-live)] hover:text-[var(--shuta-bg)]',
        danger:
          'border border-[var(--shuta-error)] bg-[color-mix(in_srgb,var(--shuta-error)_10%,transparent)] text-[var(--shuta-error)] hover:bg-[var(--shuta-error)] hover:text-[var(--shuta-bg)]',
      },
      size: {
        default: 'h-8 px-3',
        sm: 'h-7 px-2.5 text-[10px]',
        lg: 'h-10 px-4 text-[11px]',
        icon: 'h-8 w-8 p-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = 'Button';

export function Pill({
  children,
  tone = 'default',
  className,
}: {
  children: React.ReactNode;
  tone?: 'default' | 'ink' | 'live' | 'warn' | 'error';
  className?: string;
}) {
  const tones = {
    default: 'border-[var(--shuta-line)] text-[var(--shuta-dim)] bg-transparent',
    ink: 'border-[var(--shuta-ink)] bg-[var(--shuta-ink)] text-[var(--shuta-bg)]',
    live: 'border-[var(--shuta-live)] text-[var(--shuta-live)] bg-[color-mix(in_srgb,var(--shuta-live)_9%,transparent)]',
    warn: 'border-[var(--shuta-warn)] text-[var(--shuta-warn)] bg-[color-mix(in_srgb,var(--shuta-warn)_10%,transparent)]',
    error: 'border-[var(--shuta-error)] text-[var(--shuta-error)] bg-[color-mix(in_srgb,var(--shuta-error)_9%,transparent)]',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em]',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-[2px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-bg)] px-3 py-1 font-mono text-xs text-[var(--shuta-ink)] placeholder:text-[var(--shuta-dim)] focus-visible:border-[var(--shuta-ink)] focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[140px] w-full rounded-[2px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-bg)] px-3 py-2.5 font-serif text-sm text-[var(--shuta-ink)] placeholder:text-[var(--shuta-dim)] focus-visible:border-[var(--shuta-ink)] focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export function HairlineProgress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <ProgressPrim.Root
      className={cn('relative h-[3px] w-full overflow-hidden bg-[var(--shuta-line)]', className)}
    >
      <ProgressPrim.Indicator
        className="h-full w-full bg-[var(--shuta-ink)] transition-transform duration-300"
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </ProgressPrim.Root>
  );
}

export function ShutaSwitch(props: React.ComponentPropsWithoutRef<typeof SwitchPrim.Root>) {
  return (
    <SwitchPrim.Root
      {...props}
      className={cn(
        'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-[var(--shuta-line-strong)] bg-transparent transition-colors data-[state=checked]:border-[var(--shuta-ink)] data-[state=checked]:bg-[var(--shuta-ink)]',
        props.className
      )}
    >
      <SwitchPrim.Thumb className="pointer-events-none block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-[var(--shuta-ink)] transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-[var(--shuta-bg)]" />
    </SwitchPrim.Root>
  );
}

/* Shutabug Slide-Over Monograph Drawer (a0qCAG_panel inspired) */
export const ShutaDrawer = DialogPrim.Root;

export function ShutaDrawerPanel({
  side = 'right',
  title,
  kicker,
  widthClass = 'w-[min(32rem,100vw)]',
  children,
}: {
  side?: 'left' | 'right';
  title: React.ReactNode;
  kicker?: React.ReactNode;
  widthClass?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrim.Portal>
      <DialogPrim.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[5px]" />
      <DialogPrim.Content
        className={cn(
          'fixed inset-y-0 z-50 flex flex-col bg-[var(--shuta-bg)] text-[var(--shuta-ink)] shadow-2xl outline-none',
          side === 'right' ? 'right-0 border-l border-[var(--shuta-line)]' : 'left-0 border-r border-[var(--shuta-line)]',
          widthClass
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--shuta-line)] px-6 py-5">
          <div className="min-w-0">
            <DialogPrim.Title className="font-display text-2xl font-extrabold uppercase leading-none tracking-[0.01em] text-[var(--shuta-ink)]">
              {title}
            </DialogPrim.Title>
            {kicker && (
              <DialogPrim.Description className="shuta-chrome mt-2 text-[var(--shuta-dim)]">
                {kicker}
              </DialogPrim.Description>
            )}
          </div>
          <DialogPrim.Close className="shuta-close-btn shrink-0" aria-label="Close panel">
            <X className="h-4 w-4" />
          </DialogPrim.Close>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </DialogPrim.Content>
    </DialogPrim.Portal>
  );
}

/* Editorial Modal Dialog (for Mock Exam, Boss Arena, Operator Profile, Guide) */
export const ShutaModal = DialogPrim.Root;

export function ShutaModalBody({
  title,
  kicker,
  maxWidth = 'max-w-4xl',
  children,
}: {
  title: React.ReactNode;
  kicker?: React.ReactNode;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrim.Portal>
      <DialogPrim.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[5px]" />
      <DialogPrim.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[calc(100vw-1.25rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[4px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-bg)] text-[var(--shuta-ink)] shadow-2xl',
          maxWidth
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--shuta-line)] px-6 py-5">
          <div className="min-w-0">
            <DialogPrim.Title className="font-display text-xl font-extrabold uppercase leading-tight tracking-[0.01em] text-[var(--shuta-ink)] md:text-2xl">
              {title}
            </DialogPrim.Title>
            {kicker && (
              <DialogPrim.Description className="shuta-chrome mt-1.5 text-[var(--shuta-dim)]">
                {kicker}
              </DialogPrim.Description>
            )}
          </div>
          <DialogPrim.Close className="shuta-close-btn shrink-0" aria-label="Close modal">
            <X className="h-4 w-4" />
          </DialogPrim.Close>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </DialogPrim.Content>
    </DialogPrim.Portal>
  );
}

export const ShutaTabs = TabsPrim.Root;

export function ShutaTabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrim.List>) {
  return (
    <TabsPrim.List
      className={cn('inline-flex items-center gap-1 border border-[var(--shuta-line)] bg-[var(--shuta-panel)] p-1 rounded-[2px]', className)}
      {...props}
    />
  );
}

export function ShutaTabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrim.Trigger>) {
  return (
    <TabsPrim.Trigger
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[2px] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--shuta-dim)] transition-all data-[state=active]:bg-[var(--shuta-ink)] data-[state=active]:text-[var(--shuta-bg)]',
        className
      )}
      {...props}
    />
  );
}

export const ShutaTabsContent = TabsPrim.Content;

export const ShutaAccordion = AccordionPrim.Root;
export function ShutaAccordionItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrim.Item>) {
  return (
    <AccordionPrim.Item
      className={cn('border-b border-[var(--shuta-line)] py-1', className)}
      {...props}
    />
  );
}
export function ShutaAccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrim.Trigger>) {
  return (
    <AccordionPrim.Header className="flex">
      <AccordionPrim.Trigger
        className={cn(
          'flex flex-1 items-center justify-between gap-3 py-3 text-left font-serif text-sm font-medium text-[var(--shuta-ink)] transition-opacity hover:opacity-70 [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--shuta-dim)] transition-transform duration-200" />
      </AccordionPrim.Trigger>
    </AccordionPrim.Header>
  );
}
export function ShutaAccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrim.Content>) {
  return (
    <AccordionPrim.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pb-4 pt-1 font-serif text-sm leading-relaxed text-[var(--text-secondary)]', className)}>
        {children}
      </div>
    </AccordionPrim.Content>
  );
}

export const ShutaToggleGroup = ToggleGroupPrim.Root;
export function ShutaToggleItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToggleGroupPrim.Item>) {
  return (
    <ToggleGroupPrim.Item
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-[var(--shuta-line)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--shuta-dim)] transition-colors hover:border-[var(--shuta-ink)] hover:text-[var(--shuta-ink)] data-[state=on]:border-[var(--shuta-ink)] data-[state=on]:bg-[var(--shuta-ink)] data-[state=on]:text-[var(--shuta-bg)]',
        className
      )}
      {...props}
    />
  );
}

export const SplitPanelGroup = ResizablePrim.PanelGroup;
export const SplitPanel = ResizablePrim.Panel;

export function SplitHandle() {
  return (
    <ResizablePrim.PanelResizeHandle className="relative flex w-2 items-center justify-center bg-[var(--shuta-line)] transition-colors hover:bg-[var(--shuta-ink)]/25">
      <div className="z-10 flex h-8 w-3.5 items-center justify-center rounded-[2px] border border-[var(--shuta-line-strong)] bg-[var(--shuta-bg)] text-[var(--shuta-dim)]">
        <GripVertical className="h-3 w-3" />
      </div>
    </ResizablePrim.PanelResizeHandle>
  );
}
