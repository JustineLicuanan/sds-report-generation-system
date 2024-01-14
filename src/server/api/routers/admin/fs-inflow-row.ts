import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const FSInflowRowRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.FSInflowRow.get).query(({ ctx, input }) => {
    return ctx.db.fSInflowRow.findMany({
      where: { ...(input?.where ?? {}), archivedAt: input?.current && '' },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
