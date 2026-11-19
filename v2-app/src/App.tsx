import React from 'react';
import { KernelProvider } from '@/store/useKernelStore';
import { KernelTooltipProvider } from '@/components/ui/overlays';
import { AppShell } from '@/components/AppShell';

export default function App() {
  return (
    <KernelTooltipProvider delayDuration={200}>
      <KernelProvider>
        <AppShell />
      </KernelProvider>
    </KernelTooltipProvider>
  );
}
