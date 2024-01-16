import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const outflowRowFSRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.outflowRowFS.get).query(({ ctx, input }) => {
    return ctx.db.outflowRowFS.findMany({
      where: input?.where,
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
