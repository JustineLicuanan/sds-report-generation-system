import { announcementRouter } from '~/server/api/routers/shared/announcement';
import { commentRouter } from '~/server/api/routers/shared/comment';
import { financialStatementRouter } from '~/server/api/routers/shared/financial-statement';
import { logRouter } from '~/server/api/routers/shared/log';
import { notificationRouter } from '~/server/api/routers/shared/notification';
import { organizationRouter } from '~/server/api/routers/shared/organization';
import { reportRouter } from '~/server/api/routers/shared/report';
import { reportSemesterRouter } from '~/server/api/routers/shared/report-semester';
import { reportSignatoryRouter } from '~/server/api/routers/shared/report-signatory';
import { sessionRouter } from '~/server/api/routers/shared/session';
import { createTRPCRouter } from '~/server/api/trpc';

export const sharedRouter = createTRPCRouter({
  organization: organizationRouter,
  session: sessionRouter,
  announcement: announcementRouter,
  reportSemester: reportSemesterRouter,
  report: reportRouter,
  reportSignatory: reportSignatoryRouter,
  FS: financialStatementRouter,
  comment: commentRouter,
  notification: notificationRouter,
  log: logRouter,
});
