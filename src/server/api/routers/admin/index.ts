import { announcementRouter } from '~/server/api/routers/admin/announcement';
import { commentRouter } from '~/server/api/routers/admin/comment';
import { financialStatementRouter } from '~/server/api/routers/admin/financial-statement';
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
  announcement: announcementRouter,
  reportSemester: reportSemesterRouter,
  report: reportRouter,
  reportSignatory: reportSignatoryRouter,
  FS: financialStatementRouter,
  comment: commentRouter,
  notification: notificationRouter,
  log: logRouter,
  session: sessionRouter,
});
