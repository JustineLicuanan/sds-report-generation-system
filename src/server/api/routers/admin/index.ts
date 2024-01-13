import { accomplishmentReportRouter } from '~/server/api/routers/admin/accomplishment-report';
import { announcementRouter } from '~/server/api/routers/admin/announcement';
import { appointmentRouter } from '~/server/api/routers/admin/appointment';
import { ARGeneratedRouter } from '~/server/api/routers/admin/ar-generated';
import { commentRouter } from '~/server/api/routers/admin/comment';
import { financialStatementRouter } from '~/server/api/routers/admin/financial-statement';
import { FSInflowRouter } from '~/server/api/routers/admin/fs-inflow';
import { FSInflowRowRowRouter } from '~/server/api/routers/admin/fs-inflow-row';
import { FSMonthlyRouter } from '~/server/api/routers/admin/fs-monthly';
import { logRouter } from '~/server/api/routers/admin/log';
import { notificationRouter } from '~/server/api/routers/admin/notification';
import { orgRouter } from '~/server/api/routers/admin/org';
import { reportRouter } from '~/server/api/routers/admin/report';
import { reportSemesterRouter } from '~/server/api/routers/admin/report-semester';
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
  reportSemester: reportSemesterRouter,
  AR: accomplishmentReportRouter,
  ARGenerated: ARGeneratedRouter,
  FS: financialStatementRouter,
  FSMonthly: FSMonthlyRouter,
  FSInflow: FSInflowRouter,
  FSInflowRow: FSInflowRowRowRouter,

  // TODO: To remove
  announcement: announcementRouter,
  report: reportRouter,
  notification: notificationRouter,
});
