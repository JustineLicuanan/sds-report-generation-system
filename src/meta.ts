export const meta = {
  NAME: 'Office of Student Development Services',
  SHORT_NAME: 'SDS',
  LOGO: '/cvsu_logo.png',
  DESCRIPTION: 'Report-File Scheduling & Management System',
  SEPARATOR: '|',
} as const;

export const paths = {
  SIGN_IN: '/auth/sign-in',
  SIGN_OUT: '/auth/sign-out',
  ADMIN: '/admin',
  REPORT: '/report',
  ORGANIZATION: '/organization',
  ORGANIZATIONS: '/organizations',
  ORGANIZATION_REPORTS: '/reports',
  ORGANIZATION_EDIT: '/edit',
  LOGS: '/logs',
  ANNOUNCEMENTS: '/announcements',
  EDIT_ANNOUNCEMENTS: '/edit',
  APPOINTMENTS: '/appointments',
  ORGANIZATION_CREATE: '/create',
  REPORT_CREATE: '/create',
  AUTH_LOGS: '/auth/logs',
} as const;
