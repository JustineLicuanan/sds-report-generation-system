import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const inflowCollectionRowFSRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.inflowCollectionRowFS.get).query(({ ctx, input }) => {
    return ctx.db.inflowCollectionRowFS.findMany({
      where: input?.where,
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
