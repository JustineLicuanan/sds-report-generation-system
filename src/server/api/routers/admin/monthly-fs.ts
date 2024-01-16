import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const monthlyFSRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.monthlyFS.get).query(({ ctx, input }) => {
    return ctx.db.monthlyFS.findMany({
      where: { ...(input?.where ?? {}), archivedAt: input?.current && '' },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
