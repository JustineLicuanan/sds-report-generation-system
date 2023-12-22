export const meta = {
  NAME: 'Office of Student Development Services',
  SHORT_NAME: 'SDS',
  LOGO: '/cvsu_logo.png',
  DESCRIPTION: 'AR & FS Generator with File Management System',
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
  MY_ORGANIZATION: '/information',
  ORGANIZATION_CREATE: '/create',
  REPORT_CREATE: '/create',
  AUTH_LOGS: '/auth/logs',
  ACCOMPLISHMENT_REPORT: '/accomplishment-report',
  FINANCIAL_STATEMENT: '/financial-statement',
} as const;
