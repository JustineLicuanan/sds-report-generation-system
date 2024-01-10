export const meta = {
  NAME: 'Office of Student Development Services',
  SHORT_NAME: 'SDS',
  LOGO: '/sds_icon.png',
  DESCRIPTION: 'AR & FS Generator with File Management System',
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
  MY_ORGANIZATION: '/my-organization',
  MEMBER_INFO: '/information',
  ORGANIZATION_CREATE: '/create',
  REPORT_CREATE: '/create',
  AUTH_LOGS: '/auth/logs',
  ADD_MEMBER: '/add-member',
  ACCOMPLISHMENT_REPORT: '/accomplishment-report',
  FINANCIAL_STATEMENT: '/financial-statement',
  MODIFY_FINANCIAL_STATEMENT: '/modify',

  ADD_INFLOW: '/add-inflow',
  ADD_OUTFLOW: '/add-outflow',
  SEM_CASH_FLOW: '/semester-cash-flow',
  SEM_SIGNATORIES: '/semester-signatories',
  MONTH_LABEL: '/month-label',
  MONTH_SIGNATORIES: '/month-signatories',
  MONTH_NOTES: '/month-notes',
  MONTH_CASH_FLOW: '/month-cash-flow',
  RECEIPTS: '/receipts',
  EXPENSE_SUMMARY: '/expense-summary',
  FORMS: '/forms',
  LIQUIDATION: '/liquidation',

  RESOLUTION: '/resolution',
  MINUTES_OF_THE_MEETING: '/minutes-of-the-meeting',

  PRINT: '/print',
  // FIXME: To remove or replace
  MEMBERS: '/members',
  CBL: '/cbl',
} as const;
