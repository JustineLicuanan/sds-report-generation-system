import { announcementRouter } from '~/server/api/routers/admin/announcement';
import { commentRouter } from '~/server/api/routers/admin/comment';
import { orgRouter } from '~/server/api/routers/admin/org';
import { reportRouter } from '~/server/api/routers/admin/report';
import { settingsRouter } from '~/server/api/routers/admin/settings';
import { createTRPCRouter } from '~/server/api/trpc';

export const adminRouter = createTRPCRouter({
  settings: settingsRouter,
  org: orgRouter,
  announcement: announcementRouter,
  report: reportRouter,
  comment: commentRouter,
});
