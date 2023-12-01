import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { adminNotificationSchemas } from '~/zod-schemas/admin/notification';

export const notificationRouter = createTRPCRouter({
  get: adminProcedure.input(adminNotificationSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.adminNotification.findMany({
        where: { type: input?.type, isRead: input?.isRead },
        include: {
          announcement: input?.includeAnnouncement,
          report: input?.includeReport,
          comment: input?.includeComment,
        },
        orderBy: { createdAt: input?.isAsc ? 'asc' : 'desc' },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  read: adminProcedure.input(adminNotificationSchemas.read).mutation(({ ctx, input }) => {
    const isRead = input?.isRead === false ? input?.isRead : true;

    try {
      return ctx.db.adminNotification.updateMany({
        where: input?.id ? { id: input?.id } : { isRead: !isRead },
        data: { isRead },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
