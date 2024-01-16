import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const inflowIgpRowFSRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.inflowIgpRowFS.get).query(({ ctx, input }) => {
    return ctx.db.inflowIgpRowFS.findMany({
      where: input?.where,
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
