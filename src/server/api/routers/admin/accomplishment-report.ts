import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const accomplishmentReportRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.AR.get).query(({ ctx, input }) => {
    return ctx.db.accomplishmentReport.findMany({
      where: { ...(input?.where ?? {}), archivedAt: input?.current && '' },
      include: {
        ...(input?.include ?? {}),
        ...(input?.include?.uploads ? { uploads: { orderBy: { contentNumber: 'asc' } } } : {}),
      },
      orderBy: input?.orderBy,
    });
  }),

  updateStatus: adminProcedure.input(schemas.admin.AR.updateStatus).mutation(({ ctx, input }) => {
    return ctx.db.accomplishmentReport.update({
      where: { id: input.id },
      data: { status: input.status },
    });
  }),
});
