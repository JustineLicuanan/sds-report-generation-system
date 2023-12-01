import { ReportVisibility } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { notificationSchemas } from '~/zod-schemas/shared/notification';

export const notificationRouter = createTRPCRouter({
  get: protectedProcedure.input(notificationSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.notification.findMany({
        where: {
          AND: {
            isRead: input?.isRead,
            organizationId: ctx.session.user.organizationId,
          },
          OR: [
            { userId: ctx.session.user.id },
            { NOT: { announcementId: null } },
            { reportVisibility: ReportVisibility.PUBLIC },
          ],
        },
        include: {
          organization: input?.includeOrganization,
          user: input?.includeUser,
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

  read: protectedProcedure.input(notificationSchemas.read).mutation(({ ctx, input }) => {
    const isRead = input?.isRead === false ? input?.isRead : true;

    try {
      return ctx.db.notification.updateMany({
        where: {
          AND: {
            ...(input?.id ? { id: input?.id } : { isRead: !isRead }),
            organizationId: ctx.session.user.organizationId,
          },
          OR: [
            { userId: ctx.session.user.id },
            { NOT: { announcementId: null } },
            { reportVisibility: ReportVisibility.PUBLIC },
          ],
        },
        data: { isRead },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
