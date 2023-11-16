import { announcementRouter } from '~/server/api/routers/admin/announcement';
import { orgRouter } from '~/server/api/routers/admin/org';
import { reportRouter } from '~/server/api/routers/admin/report';
import { createTRPCRouter } from '~/server/api/trpc';

export const adminRouter = createTRPCRouter({
  org: orgRouter,
  announcement: announcementRouter,
  report: reportRouter,
});
