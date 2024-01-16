export const meta = {
  NAME: 'Office of Student Development Services',
  SHORT_NAME: 'SDS',
  LOGO: '/sds_icon.png',
  DESCRIPTION: 'Report-File Scheduling & Management System',
  SEPARATOR: '|',
} as const;

export const logo = {
  PHILIPPINE_LOGO: '/bagong_pilipinas_logo.png',
  CVSU_LOGO: '/cvsu_logo.png',
  SDS_LOGO: '/sds_icon.png',
};

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
  MEMBERS: '/members',
  CBL: '/cbl',
  ORGANIZATION_CREATE: '/create',
  REPORT_CREATE: '/create',
  AUTH_LOGS: '/auth/logs',
  MY_ORGANIZATION: '/my-organization',
  POSITIONS: '/positions',

  GENERATED_AR: '/generated-ar',
  FINANCIAL_REPORT: '/financial-report',

  CREATE: '/create',
  EDIT: '/edit',
} as const;
