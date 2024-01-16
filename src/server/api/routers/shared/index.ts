import { announcementRouter } from '~/server/api/routers/shared/announcement';
import { commentRouter } from '~/server/api/routers/shared/comment';
import { financialStatementRouter } from '~/server/api/routers/shared/financial-statement';
import { generatedARRouter } from '~/server/api/routers/shared/generated-ar';
import { inflowCollectionFSRouter } from '~/server/api/routers/shared/inflow-collection-fs';
import { inflowCollectionRowFSRouter } from '~/server/api/routers/shared/inflow-collection-row-fs';
import { inflowIgpFSRouter } from '~/server/api/routers/shared/inflow-igp-fs';
import { inflowIgpRowFSRouter } from '~/server/api/routers/shared/inflow-igp-row-fs';
import { logRouter } from '~/server/api/routers/shared/log';
import { monthlyFSRouter } from '~/server/api/routers/shared/monthly-fs';
import { notificationRouter } from '~/server/api/routers/shared/notification';
import { orgSignatoryInfoRouter } from '~/server/api/routers/shared/org-signatory-info';
import { organizationRouter } from '~/server/api/routers/shared/organization';
import { outflowFSRouter } from '~/server/api/routers/shared/outflow-fs';
import { outflowRowFSRouter } from '~/server/api/routers/shared/outflow-row-fs';
import { reportRouter } from '~/server/api/routers/shared/report';
import { reportSemesterRouter } from '~/server/api/routers/shared/report-semester';
import { reportSignatoryRouter } from '~/server/api/routers/shared/report-signatory';
import { sessionRouter } from '~/server/api/routers/shared/session';
import { createTRPCRouter } from '~/server/api/trpc';

export const sharedRouter = createTRPCRouter({
  organization: organizationRouter,
  orgSignatoryInfo: orgSignatoryInfoRouter,
  session: sessionRouter,
  announcement: announcementRouter,
  reportSemester: reportSemesterRouter,
  report: reportRouter,
  reportSignatory: reportSignatoryRouter,
  generatedAR: generatedARRouter,
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
});
