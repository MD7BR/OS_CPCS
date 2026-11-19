import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-mono text-xs font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:brightness-110',
        cyber: 'border border-primary/45 bg-primary/12 text-primary hover:bg-primary/22 hover:border-primary',
        secondary: 'border border-border bg-secondary text-secondary-foreground hover:border-primary/50 hover:text-primary',
        outline: 'border border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/40',
        ghost: 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
        destructive: 'border border-destructive/50 bg-destructive/15 text-destructive hover:bg-destructive/25',
        emerald: 'border border-accent/50 bg-accent/15 text-accent hover:bg-accent/25',
      },
      size: {
        default: 'h-8 px-3 py-1.5',
        sm: 'h-7 px-2.5 text-[11px]',
        lg: 'h-9 px-4 text-xs',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = 'Button';
