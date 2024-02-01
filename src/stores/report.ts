import { create } from 'zustand';

type ReportState = { compileProgress?: number; setCompileProgress: (value?: () => number) => void };

export const useReportStore = create<ReportState>((set) => ({
  setCompileProgress: (value) => set(() => ({ compileProgress: value?.() })),
}));
