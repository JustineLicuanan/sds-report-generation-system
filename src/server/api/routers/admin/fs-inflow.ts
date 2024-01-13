import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const FSInflowRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.FSInflow.get).query(({ ctx, input }) => {
    return ctx.db.fSInflow.findMany({
      where: { ...(input?.where ?? {}), deletedAt: '', archivedAt: input?.current && '' },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),
});
