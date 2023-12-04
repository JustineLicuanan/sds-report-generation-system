import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { announcementSchemas } from '~/zod-schemas/shared/announcement';

export const announcementRouter = createTRPCRouter({
  get: protectedProcedure.input(announcementSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.announcement.findMany({
        where: {
          id: input?.id,
          hasReport: input?.hasReport,
          isArchived: false,
          audience: { some: { id: ctx.session.user.organizationId } },
        },
        include: {
          audience: input?.includeAudience,
          comments: input?.includeComments,
          reports: input?.includeReports,
          adminNotifications: input?.includeAdminNotifications,
          notifications: input?.includeNotifications,
        },
        orderBy: { due: input?.orderByDue, createdAt: input?.orderByCreatedAt },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
