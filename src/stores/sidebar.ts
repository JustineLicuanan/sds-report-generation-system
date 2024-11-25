import {
  CalendarCheck2,
  ClipboardCheck,
  File,
  FileSpreadsheet,
  FileText,
  History,
  LayoutDashboard,
  Megaphone,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { create } from 'zustand';

import { paths } from '~/meta';

type SidebarLink = { Icon: LucideIcon; name: string; href: string };

type SidebarState = {
  adminSidebarLinks: SidebarLink[];
  organizationSidebarLinks: SidebarLink[];
  isSidebarExpanded: boolean;
  toggleIsSidebarExpanded: (value?: () => boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  adminSidebarLinks: [
    { Icon: LayoutDashboard, name: 'Dashboard', href: paths.ADMIN },
    { Icon: CalendarCheck2, name: 'Appointments', href: `${paths.ADMIN}${paths.APPOINTMENTS}` },
    { Icon: Users, name: 'Organizations', href: `${paths.ADMIN}${paths.ORGANIZATIONS}` },

    {
      Icon: FileText,
      name: 'Accomplishment Report',
      href: `${paths.ADMIN}${paths.ACCOMPLISHMENT_REPORT}`,
    },
    {
      Icon: FileSpreadsheet,
      name: 'Financial Statement',
      href: `${paths.ADMIN}${paths.FINANCIAL_STATEMENT}`,
    },
    { Icon: Megaphone, name: 'Announcements', href: `${paths.ADMIN}${paths.ANNOUNCEMENTS}` },
    // {
    //   Icon: History,
    //   name: 'Report Logs',
    //   href: `${paths.ADMIN}${paths.ORGANIZATION_REPORTS}${paths.LOGS}`,
    // },
    { Icon: History, name: 'Authentication Logs', href: `${paths.ADMIN}${paths.AUTH_LOGS}` },
  ],

  organizationSidebarLinks: [
    { Icon: LayoutDashboard, name: 'Dashboard', href: paths.ORGANIZATION },
    { Icon: Users, name: 'My Organization', href: `${paths.ORGANIZATION}${paths.MY_ORGANIZATION}` },
    {
      Icon: CalendarCheck2,
      name: 'Appointments',
      href: `${paths.ORGANIZATION}${paths.APPOINTMENTS}`,
    },
    { Icon: Megaphone, name: 'Announcements', href: `${paths.ORGANIZATION}${paths.ANNOUNCEMENTS}` },
    {
      Icon: ClipboardCheck,
      name: 'Consulted Reports',
      href: `${paths.ORGANIZATION}${paths.ORGANIZATION_REPORTS}`,
    },
    {
      Icon: File,
      name: 'Report Templates',
      href: `${paths.ORGANIZATION}${paths.GENERATED_AR}`,
    },
    {
      Icon: FileText,
      name: 'Accomplishment Report',
      href: `${paths.ORGANIZATION}${paths.ACCOMPLISHMENT_REPORT}`,
    },
    {
      Icon: FileSpreadsheet,
      name: 'Financial Statement',
      href: `${paths.ORGANIZATION}${paths.FINANCIAL_STATEMENT}`,
    },
  ],

  isSidebarExpanded: false,
  toggleIsSidebarExpanded: (value) => {
    set((state) => ({ isSidebarExpanded: value ? value() : !state.isSidebarExpanded }));
  },
}));
