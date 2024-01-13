import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const FSMonthlyRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.FSMonthly.get).query(({ ctx, input }) => {
    return ctx.db.fSMonthly.findMany({
      where: { ...(input?.where ?? {}), archivedAt: input?.current && '' },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),
});
