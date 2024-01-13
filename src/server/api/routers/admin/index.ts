import { accomplishmentReportRouter } from '~/server/api/routers/admin/accomplishment-report';
import { announcementRouter } from '~/server/api/routers/admin/announcement';
import { appointmentRouter } from '~/server/api/routers/admin/appointment';
import { ARGeneratedRouter } from '~/server/api/routers/admin/ar-generated';
import { commentRouter } from '~/server/api/routers/admin/comment';
import { curriculumVitaeRouter } from '~/server/api/routers/admin/curriculum-vitae';
import { financialStatementRouter } from '~/server/api/routers/admin/financial-statement';
import { FSInflowRouter } from '~/server/api/routers/admin/fs-inflow';
import { FSInflowRowRouter } from '~/server/api/routers/admin/fs-inflow-row';
import { FSMonthlyRouter } from '~/server/api/routers/admin/fs-monthly';
import { FSOutflowRouter } from '~/server/api/routers/admin/fs-outflow';
import { FSOutflowRowRouter } from '~/server/api/routers/admin/fs-outflow-row';
import { logRouter } from '~/server/api/routers/admin/log';
import { notificationRouter } from '~/server/api/routers/admin/notification';
import { orgRouter } from '~/server/api/routers/admin/org';
import { reportRouter } from '~/server/api/routers/admin/report';
import { reportSemesterRouter } from '~/server/api/routers/admin/report-semester';
import { reportSignatoryRouter } from '~/server/api/routers/admin/report-signatory';
import { sessionRouter } from '~/server/api/routers/admin/session';
import { settingsRouter } from '~/server/api/routers/admin/settings';
import { userRouter } from '~/server/api/routers/admin/user';
import { createTRPCRouter } from '~/server/api/trpc';

export const adminRouter = createTRPCRouter({
  settings: settingsRouter,
  org: orgRouter,
  user: userRouter,
  comment: commentRouter,
  log: logRouter,
  session: sessionRouter,

  // Extras
  appointment: appointmentRouter,
  reportSignatory: reportSignatoryRouter,
  reportSemester: reportSemesterRouter,
  AR: accomplishmentReportRouter,
  ARGenerated: ARGeneratedRouter,
  curriculumVitae: curriculumVitaeRouter,
  FS: financialStatementRouter,
  FSMonthly: FSMonthlyRouter,
  FSInflow: FSInflowRouter,
  FSInflowRow: FSInflowRowRouter,
  FSOutflow: FSOutflowRouter,
  FSOutflowRow: FSOutflowRowRouter,

  // TODO: To remove
  announcement: announcementRouter,
  report: reportRouter,
  notification: notificationRouter,
});
