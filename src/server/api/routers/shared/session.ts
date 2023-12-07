import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const sessionRouter = createTRPCRouter({
  count: protectedProcedure.query(({ ctx }) => {
    try {
      return ctx.db.session.count({ where: { userId: ctx.session.user.id } });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  delete: protectedProcedure.mutation(({ ctx }) => {
    try {
      return ctx.db.session.deleteMany({ where: { userId: ctx.session.user.id } });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
