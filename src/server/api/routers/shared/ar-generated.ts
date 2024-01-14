import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const ARGeneratedRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.ARGenerated.get).query(({ ctx, input }) => {
    return ctx.db.aRGenerated.findMany({
      where: {
        ...(input?.where ?? {}),
        deletedAt: '',
        archivedAt: input?.current && '',
        organizationId: ctx.session.user.organizationId,
      },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  getDeleted: protectedProcedure.input(schemas.shared.ARGenerated.get).query(({ ctx, input }) => {
    return ctx.db.aRGenerated.findMany({
      where: {
        ...(input?.where ?? {}),
        archivedAt: input?.current && '',
        organizationId: ctx.session.user.organizationId,
        NOT: { deletedAt: '' },
      },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure
    .input(schemas.shared.ARGenerated.create)
    .mutation(async ({ ctx, input }) => {
      const accomplishmentReport = await ctx.db.accomplishmentReport.findFirst({
        select: { id: true, reportSemesterId: true, archivedAt: true },
        where: { archivedAt: '', organizationId: ctx.session.user.organizationId },
      });

      if (!accomplishmentReport) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Accomplishment Report not found.',
        });
      }

      return ctx.db.aRGenerated.create({
        data: {
          ...input,
          content: JSON.stringify(input.content),
          accomplishmentReportId: accomplishmentReport.id,
          reportSemesterId: accomplishmentReport.reportSemesterId,
          archivedAt: accomplishmentReport.archivedAt,
          organizationId: ctx.session.user.organizationId!,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure.input(schemas.shared.ARGenerated.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.aRGenerated.update({
      where: { id, organizationId: ctx.session.user.organizationId },
      data: {
        ...data,
        content: input.content === undefined ? undefined : JSON.stringify(input.content),
      },
    });
  }),

  delete: protectedProcedure.input(schemas.shared.ARGenerated.delete).mutation(({ ctx, input }) => {
    return ctx.db.aRGenerated.update({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
      data: { deletedAt: new Date().toISOString() },
    });
  }),
});
