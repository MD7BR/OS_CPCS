export interface SoundBridge {
  click: (freq?: number) => void;
  chime: () => void;
  alarm: () => void;
  modeSwitch: () => void;
}
export function bindSimulatorSound(soundApi: SoundBridge): void;
export function mountLegacySimulator(
  nodeId: string,
  stage: HTMLElement,
  formulas?: HTMLElement | { innerHTML: string } | null
): void;
export function attachFormulaSandboxes(bodyRoot: HTMLElement): void;
