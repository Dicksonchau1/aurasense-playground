import { create } from 'zustand';

interface DemoState {
  mode: 'rehearse-nurse' | 'attas' | 'robotics';
  setMode: (mode: DemoState['mode']) => void;
}

export const useDemoState = create<DemoState>((set) => ({
  mode: 'rehearse-nurse',
  setMode: (mode) => set({ mode })
}));
