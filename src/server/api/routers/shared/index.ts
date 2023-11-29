import { announcementRouter } from '~/server/api/routers/shared/announcement';
import { commentRouter } from '~/server/api/routers/shared/comment';
import { logRouter } from '~/server/api/routers/shared/log';
import { notificationRouter } from '~/server/api/routers/shared/notification';
import { organizationRouter } from '~/server/api/routers/shared/organization';
import { reportRouter } from '~/server/api/routers/shared/report';
import { createTRPCRouter } from '~/server/api/trpc';

export const sharedRouter = createTRPCRouter({
  organization: organizationRouter,
  announcement: announcementRouter,
  report: reportRouter,
  comment: commentRouter,
  notification: notificationRouter,
  log: logRouter,
});
