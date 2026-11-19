import * as React from 'react';
import * as TabsPrim from '@radix-ui/react-tabs';
import * as AccordionPrim from '@radix-ui/react-accordion';
import * as SwitchPrim from '@radix-ui/react-switch';
import * as ToggleGroupPrim from '@radix-ui/react-toggle-group';
import { ChevronDown, GripVertical } from 'lucide-react';
import * as ResizablePrim from 'react-resizable-panels';
import { cn } from '@/lib/utils';

export const KernelTabs = TabsPrim.Root;

export function KernelTabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrim.List>) {
  return (
    <TabsPrim.List
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-border bg-muted/80 p-1 text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export function KernelTabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrim.Trigger>) {
  return (
    <TabsPrim.Trigger
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded px-2.5 py-1 font-mono text-[11px] font-semibold transition-all data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  );
}

export const KernelTabsContent = TabsPrim.Content;

export const KernelAccordion = AccordionPrim.Root;
export const KernelAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrim.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrim.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrim.Item
    ref={ref}
    className={cn('rounded-md border border-border bg-card/80 px-3', className)}
    {...props}
  />
));
KernelAccordionItem.displayName = 'KernelAccordionItem';

export function KernelAccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrim.Trigger>) {
  return (
    <AccordionPrim.Header className="flex">
      <AccordionPrim.Trigger
        className={cn(
          'flex flex-1 items-center justify-between py-2.5 text-left font-sans text-xs font-semibold text-foreground transition-colors hover:text-primary [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200" />
      </AccordionPrim.Trigger>
    </AccordionPrim.Header>
  );
}

export function KernelAccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrim.Content>) {
  return (
    <AccordionPrim.Content
      className="overflow-hidden text-xs data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('border-t border-border/70 pb-3 pt-2.5 text-muted-foreground', className)}>{children}</div>
    </AccordionPrim.Content>
  );
}

export function KernelSwitch({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrim.Root>) {
  return (
    <SwitchPrim.Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border bg-muted transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary/80',
        className
      )}
      {...props}
    >
      <SwitchPrim.Thumb className="pointer-events-none block h-3.5 w-3.5 translate-x-0.5 rounded-full bg-foreground shadow transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-primary-foreground" />
    </SwitchPrim.Root>
  );
}

export const KernelToggleGroup = ToggleGroupPrim.Root;

export function KernelToggleItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToggleGroupPrim.Item>) {
  return (
    <ToggleGroupPrim.Item
      className={cn(
        'inline-flex items-center gap-1 rounded border border-border bg-secondary/70 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary/15 data-[state=on]:text-primary',
        className
      )}
      {...props}
    />
  );
}

export const SplitPanelGroup = ResizablePrim.PanelGroup;
export const SplitPanel = ResizablePrim.Panel;

export function SplitHandle({ className }: { className?: string }) {
  return (
    <ResizablePrim.PanelResizeHandle
      className={cn(
        'relative flex w-2 items-center justify-center bg-border/60 transition-colors hover:bg-primary/40 data-[resize-handle-active]:bg-primary/70',
        className
      )}
    >
      <div className="z-10 flex h-8 w-3.5 items-center justify-center rounded-sm border border-border bg-card text-muted-foreground">
        <GripVertical className="h-3 w-3" />
      </div>
    </ResizablePrim.PanelResizeHandle>
  );
}
