import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const FSOutflowRowRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.FSOutflowRow.get).query(({ ctx, input }) => {
    return ctx.db.fSOutflowRow.findMany({
      where: { ...(input?.where ?? {}), archivedAt: input?.current && '' },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
