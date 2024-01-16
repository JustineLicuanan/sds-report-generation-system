import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const inflowIgpFSRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.inflowIgpFS.get).query(({ ctx, input }) => {
    return ctx.db.inflowIgpFS.findMany({
      where: input?.where,
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
