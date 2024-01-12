import { accomplishmentReportRouter } from '~/server/api/routers/shared/accomplishment-report';
import { announcementRouter } from '~/server/api/routers/shared/announcement';
import { ARUploadRouter } from '~/server/api/routers/shared/ar-upload';
import { commentRouter } from '~/server/api/routers/shared/comment';
import { logRouter } from '~/server/api/routers/shared/log';
import { notificationRouter } from '~/server/api/routers/shared/notification';
import { organizationRouter } from '~/server/api/routers/shared/organization';
import { reportRouter } from '~/server/api/routers/shared/report';
import { reportSemesterRouter } from '~/server/api/routers/shared/report-semester';
import { sessionRouter } from '~/server/api/routers/shared/session';
import { createTRPCRouter } from '~/server/api/trpc';

export const sharedRouter = createTRPCRouter({
  organization: organizationRouter,
  session: sessionRouter,
  comment: commentRouter,
  log: logRouter,

  // Extras
  reportSemester: reportSemesterRouter,
  AR: accomplishmentReportRouter,
  ARUpload: ARUploadRouter,

  // TODO: To remove
  announcement: announcementRouter,
  report: reportRouter,
  notification: notificationRouter,
});
