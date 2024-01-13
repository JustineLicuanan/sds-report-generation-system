import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const FSOutflowRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.FSOutflow.get).query(({ ctx, input }) => {
    return ctx.db.fSOutflow.findMany({
      where: { ...(input?.where ?? {}), deletedAt: '', archivedAt: input?.current && '' },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),
});
