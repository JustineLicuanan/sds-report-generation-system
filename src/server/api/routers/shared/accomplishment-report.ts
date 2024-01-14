import { SemReportStatus } from '@prisma/client';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const accomplishmentReportRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.AR.get).query(({ ctx, input }) => {
    return ctx.db.accomplishmentReport.findMany({
      where: { ...(input?.where ?? {}), organizationId: ctx.session.user.organizationId },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),

  getOrCreate: protectedProcedure
    .input(schemas.shared.AR.getOrCreate)
    .query(async ({ ctx, input }) => {
      const reportSemester = await ctx.db.reportSemester.findUnique({
        select: { id: true, archivedAt: true },
        where: { archivedAt: '' },
      });

      if (!reportSemester) return null;

      return ctx.db.accomplishmentReport.upsert({
        where: {
          reportSemesterId_organizationId: {
            reportSemesterId: reportSemester.id,
            organizationId: ctx.session.user.organizationId!,
          },
        },
        update: {},
        create: {
          reportSemesterId: reportSemester.id,
          archivedAt: reportSemester.archivedAt,
          organizationId: ctx.session.user.organizationId!,
        },
        include: { ...(input?.include ?? {}) },
      });
    }),

  turnIn: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.accomplishmentReport.updateMany({
      where: { archivedAt: '', organizationId: ctx.session.user.organizationId },
      data: { status: SemReportStatus.TURNED_IN },
    });
  }),

  cancel: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.accomplishmentReport.updateMany({
      where: { archivedAt: '', organizationId: ctx.session.user.organizationId },
      data: { status: SemReportStatus.DRAFT },
    });
  }),
});
