import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';
import { MoveDirection } from '~/zod-schemas/ar-upload';

export const ARUploadRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.ARUpload.get).query(({ ctx, input }) => {
    return ctx.db.aRUpload.findMany({
      where: {
        ...(input?.where ?? {}),
        archivedAt: input?.current && '',
        organizationId: ctx.session.user.organizationId,
      },
      include: { ...(input?.include ?? {}) },
      orderBy: { contentNumber: 'asc' },
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
        const ARUpload = ctx.db.aRUpload.create({
          data: {
            ...input,
            accomplishmentReportId: accomplishmentReport.id,
            reportSemesterId: accomplishmentReport.reportSemesterId,
            archivedAt: accomplishmentReport.archivedAt,
            organizationId: ctx.session.user.organizationId!,
            userId: ctx.session.user.id,
          },
        });

        return ARUpload;
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `${input.contentType.replace(/_/g, ' ').toLowerCase()} ${
            input.contentNumber ?? ''
          } already exist`,
        });
      }
    }),

  update: protectedProcedure.input(schemas.shared.ARUpload.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.aRUpload.update({
      where: { id, organizationId: ctx.session.user.organizationId },
      data,
    });
  }),

  move: protectedProcedure.input(schemas.shared.ARUpload.move).mutation(async ({ ctx, input }) => {
    const isMoveUp = input.direction === MoveDirection.UP;
    const ARUpload = await ctx.db.aRUpload.findUnique({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
    });

    const UNPROCESSABLE_CONTENT_ERROR = new TRPCError({
      code: 'UNPROCESSABLE_CONTENT',
      message: `Move ${input.direction.toLowerCase()} action is unprocessable.`,
    });

    if (!ARUpload || (isMoveUp && ARUpload.contentNumber <= 1)) throw UNPROCESSABLE_CONTENT_ERROR;

    const targetContentNumber = isMoveUp ? ARUpload.contentNumber - 1 : ARUpload.contentNumber + 1;
    const transaction = (async (tx) => {
      const ARUploadToSwap = await tx.aRUpload.update({
        select: { id: true },
        where: {
          contentType_contentNumber_accomplishmentReportId: {
            contentType: ARUpload.contentType,
            contentNumber: targetContentNumber,
            accomplishmentReportId: ARUpload.accomplishmentReportId,
          },
        },
        data: { contentNumber: -targetContentNumber },
      });

      const movedARUpload = await tx.aRUpload.update({
        where: { id: input.id },
        data: { contentNumber: targetContentNumber },
      });

      await tx.aRUpload.update({
        where: { id: ARUploadToSwap.id },
        data: { contentNumber: ARUpload.contentNumber },
      });

      return movedARUpload;
    }) satisfies Parameters<typeof ctx.db.$transaction>[0];

    if (isMoveUp) return ctx.db.$transaction(transaction);

    const ARUploadCount = await ctx.db.aRUpload.count({
      where: {
        contentType: ARUpload.contentType,
        accomplishmentReportId: ARUpload.accomplishmentReportId,
      },
    });

    if (ARUpload.contentNumber >= ARUploadCount) throw UNPROCESSABLE_CONTENT_ERROR;

    return ctx.db.$transaction(transaction);
  }),

  delete: protectedProcedure.input(schemas.shared.ARUpload.delete).mutation(({ ctx, input }) => {
    return ctx.db.$transaction(async (tx) => {
      const ARUpload = await tx.aRUpload.delete({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
      });

      if (!Object.keys(ARUpload ?? {}).length) return ARUpload;

      const ARUploadCount = await tx.aRUpload.count({
        where: {
          contentType: ARUpload.contentType,
          accomplishmentReportId: ARUpload.accomplishmentReportId,
        },
      });

      if (ARUpload.contentNumber > ARUploadCount) return ARUpload;

      for (let i = ARUpload.contentNumber + 1; i <= ARUploadCount + 1; i++) {
        await tx.aRUpload.update({
          where: {
            contentType_contentNumber_accomplishmentReportId: {
              contentType: ARUpload.contentType,
              contentNumber: i,
              accomplishmentReportId: ARUpload.accomplishmentReportId,
            },
          },
          data: { contentNumber: i - 1 },
        });
      }

      return ARUpload;
    });
  }),
});
