import { announcementRouter } from '~/server/api/routers/admin/announcement';
import { commentRouter } from '~/server/api/routers/admin/comment';
import { financialStatementRouter } from '~/server/api/routers/admin/financial-statement';
import { inflowCollectionFSRouter } from '~/server/api/routers/admin/inflow-collection-fs';
import { inflowCollectionRowFSRouter } from '~/server/api/routers/admin/inflow-collection-row-fs';
import { inflowIgpFSRouter } from '~/server/api/routers/admin/inflow-igp-fs';
import { inflowIgpRowFSRouter } from '~/server/api/routers/admin/inflow-igp-row-fs';
import { logRouter } from '~/server/api/routers/admin/log';
import { monthlyFSRouter } from '~/server/api/routers/admin/monthly-fs';
import { notificationRouter } from '~/server/api/routers/admin/notification';
import { orgRouter } from '~/server/api/routers/admin/org';
import { orgSignatoryInfoRouter } from '~/server/api/routers/admin/org-signatory-info';
import { outflowFSRouter } from '~/server/api/routers/admin/outflow-fs';
import { outflowRowFSRouter } from '~/server/api/routers/admin/outflow-row-fs';
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
  orgSignatoryInfo: orgSignatoryInfoRouter,
  user: userRouter,
  announcement: announcementRouter,
  reportSemester: reportSemesterRouter,
  report: reportRouter,
  reportSignatory: reportSignatoryRouter,
  FS: financialStatementRouter,
  monthlyFS: monthlyFSRouter,
  inflowCollectionFS: inflowCollectionFSRouter,
  inflowCollectionRowFS: inflowCollectionRowFSRouter,
  inflowIgpFS: inflowIgpFSRouter,
  inflowIgpRowFS: inflowIgpRowFSRouter,
  outflowFS: outflowFSRouter,
  outflowRowFS: outflowRowFSRouter,
  comment: commentRouter,
  notification: notificationRouter,
  log: logRouter,
  session: sessionRouter,
});
