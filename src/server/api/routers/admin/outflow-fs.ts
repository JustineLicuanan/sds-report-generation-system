import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const outflowFSRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.outflowFS.get).query(({ ctx, input }) => {
    return ctx.db.outflowFS.findMany({
      where: input?.where,
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
