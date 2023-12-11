import { create } from 'zustand';

type SidebarState = {
  isSidebarExpanded: boolean;
  toggleIsSidebarExpanded: (value?: () => boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarExpanded: false,
  toggleIsSidebarExpanded: (value) => {
    set((state) => ({ isSidebarExpanded: value ? value() : !state.isSidebarExpanded }));
  },
}));
