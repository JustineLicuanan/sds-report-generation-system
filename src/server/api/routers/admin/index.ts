import { announcementRouter } from '~/server/api/routers/admin/announcement';
import { commentRouter } from '~/server/api/routers/admin/comment';
import { logRouter } from '~/server/api/routers/admin/log';
import { notificationRouter } from '~/server/api/routers/admin/notification';
import { orgRouter } from '~/server/api/routers/admin/org';
import { reportRouter } from '~/server/api/routers/admin/report';
import { sessionRouter } from '~/server/api/routers/admin/session';
import { settingsRouter } from '~/server/api/routers/admin/settings';
import { userRouter } from '~/server/api/routers/admin/user';
import { createTRPCRouter } from '~/server/api/trpc';

export const adminRouter = createTRPCRouter({
  settings: settingsRouter,
  org: orgRouter,
  user: userRouter,
  announcement: announcementRouter,
  report: reportRouter,
  comment: commentRouter,
  notification: notificationRouter,
  log: logRouter,
  session: sessionRouter,
});
