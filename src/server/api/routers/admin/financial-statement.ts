import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const financialStatementRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.FS.get).query(({ ctx, input }) => {
    return ctx.db.financialStatement.findMany({
      where: { ...(input?.where ?? {}), archivedAt: input?.current && '' },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  updateStatus: adminProcedure.input(schemas.admin.FS.updateStatus).mutation(({ ctx, input }) => {
    return ctx.db.financialStatement.update({
      where: { id: input.id },
      data: { status: input.status },
    });
  }),
});
