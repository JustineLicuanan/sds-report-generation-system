import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { organizationSchemas } from '~/zod-schemas/shared/organization';

export const organizationRouter = createTRPCRouter({
  get: protectedProcedure.input(organizationSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.organization.findUnique({
        where: { id: ctx.session.user.organizationId },
        include: {
          ...(input?.include ?? {}),
          members: input?.includeMembers,
          reports: input?.includeReports,
          comments: input?.includeComments,
          notifications: input?.includeNotifications,
          logs: input?.includeLogs,
          announcements: input?.includeAnnouncements,
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  update: protectedProcedure.input(organizationSchemas.update).mutation(({ ctx, input }) => {
    try {
      return ctx.db.organization.update({
        where: { id: ctx.session.user.organizationId },
        data: input,
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
