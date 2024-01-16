import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const inflowCollectionFSRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.inflowCollectionFS.get).query(({ ctx, input }) => {
    return ctx.db.inflowCollectionFS.findMany({
      where: input?.where,
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
