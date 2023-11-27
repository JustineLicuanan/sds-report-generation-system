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
  ANNOUNCEMENT: '/announcement',
  ORGANIZATION_CREATE: '/create',
} as const;
