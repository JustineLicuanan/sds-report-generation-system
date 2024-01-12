import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const ARUploadRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.ARUpload.get).query(({ ctx, input }) => {
    return ctx.db.aRUpload.findMany({
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

  getDeleted: protectedProcedure.input(schemas.shared.ARUpload.get).query(({ ctx, input }) => {
    return ctx.db.aRUpload.findMany({
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
    .input(schemas.shared.ARUpload.create)
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

      try {
        const aRUpload = await ctx.db.aRUpload.create({
          data: {
            ...input,
            accomplishmentReportId: accomplishmentReport.id,
            reportSemesterId: accomplishmentReport.reportSemesterId,
            archivedAt: accomplishmentReport.archivedAt,
            organizationId: ctx.session.user.organizationId!,
            userId: ctx.session.user.id,
          },
        });

        return aRUpload;
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `${input.contentType.replace(/_/g, ' ').toLowerCase()} ${
            input.contentNumber
          } already exist.`,
        });
      }
    }),

  update: protectedProcedure
    .input(schemas.shared.ARUpload.update)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      try {
        const aRUpload = await ctx.db.aRUpload.update({
          where: { id, organizationId: ctx.session.user.organizationId },
          data,
        });

        return aRUpload;
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `${input.contentType?.replace(/_/g, ' ').toLowerCase()} ${
            input.contentNumber
          } already exist.`,
        });
      }
    }),

  delete: protectedProcedure.input(schemas.shared.ARUpload.delete).mutation(({ ctx, input }) => {
    return ctx.db.aRUpload.update({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
      data: { deletedAt: new Date().toISOString() },
    });
  }),
});
