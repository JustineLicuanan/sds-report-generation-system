import { UserRole } from '@prisma/client';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const logRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.log.findMany(
      ctx.session.user.role === UserRole.ADMIN
        ? undefined
        : { where: { userId: ctx.session.user.id } }
    );
  }),
});
