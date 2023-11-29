export const meta = {
  NAME: 'SDS Scheduling System',
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
  ANNOUNCEMENTS: '/announcements/',
  EDIT_ANNOUNCEMENTS: '/edit',
  ORGANIZATION_CREATE: '/create',
  AUTH_LOGS: '/auth/logs',
} as const;
