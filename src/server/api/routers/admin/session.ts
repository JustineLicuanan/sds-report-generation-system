import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { sessionSchemas } from '~/zod-schemas/admin/session';

export const sessionRouter = createTRPCRouter({
  count: adminProcedure.input(sessionSchemas.count).query(({ ctx, input }) => {
    try {
      return ctx.db.user.findMany({
        select: { id: true, name: true, email: true, _count: { select: { sessions: true } } },
        where: { id: input?.id, organizationId: input?.organizationId },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  deleteAll: adminProcedure.input(sessionSchemas.deleteAll).mutation(({ ctx, input }) => {
    try {
      return ctx.db.session.deleteMany({ where: { userId: input.id } });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
