// import { TRPCError } from '@trpc/server';

import { GeneratedReportStatus } from '@prisma/client';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const ARGeneratedRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.ARGenerated.get).query(({ ctx, input }) => {
    return ctx.db.aRGenerated.findMany({
      where: {
        ...(input?.where ?? {}),
        deletedAt: '',
        archivedAt: '',
        NOT: { status: GeneratedReportStatus.DRAFT },
      },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  updateStatus: adminProcedure
    .input(schemas.admin.ARGenerated.updateStatus)
    .mutation(({ ctx, input }) => {
      return ctx.db.aRGenerated.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
