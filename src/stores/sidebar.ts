import {
  CalendarCheck2,
  FileSpreadsheet,
  FileText,
  Fingerprint,
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
    { Icon: Megaphone, name: 'Announcements', href: `${paths.ADMIN}${paths.ANNOUNCEMENTS}` },
    {
      Icon: History,
      name: 'Report Logs',
      href: `${paths.ADMIN}${paths.ORGANIZATION_REPORTS}${paths.LOGS}`,
    },
    { Icon: Fingerprint, name: 'Authentication Logs', href: `${paths.ADMIN}${paths.AUTH_LOGS}` },
  ],

  organizationSidebarLinks: [
    { Icon: LayoutDashboard, name: 'Dashboard', href: paths.ORGANIZATION },
    {
      Icon: CalendarCheck2,
      name: 'Appointments',
      href: `${paths.ORGANIZATION}${paths.APPOINTMENTS}`,
    },
    { Icon: Users, name: 'My Organization', href: `${paths.ORGANIZATION}${paths.MY_ORGANIZATION}` },
    {
      Icon: FileText,
      name: 'Accomplishment Report',
      href: `${paths.ORGANIZATION}/${paths.GENERATED_AR}`,
    },
    {
      Icon: FileSpreadsheet,
      name: 'Financial Statement',
      href: `${paths.ORGANIZATION}${paths.FINANCIAL_REPORT}`,
    },
    { Icon: Megaphone, name: 'Announcements', href: `${paths.ORGANIZATION}${paths.ANNOUNCEMENTS}` },
  ],

  isSidebarExpanded: false,
  toggleIsSidebarExpanded: (value) => {
    set((state) => ({ isSidebarExpanded: value ? value() : !state.isSidebarExpanded }));
  },
}));
