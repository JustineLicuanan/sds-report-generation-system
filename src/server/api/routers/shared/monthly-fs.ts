import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { getMonthName } from '~/utils/get-month-name';
import { schemas } from '~/zod-schemas';

export const monthlyFSRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.monthlyFS.get).query(({ ctx, input }) => {
    return ctx.db.monthlyFS.findMany({
      where: {
        ...(input?.where ?? {}),
        archivedAt: input?.current && '',
        organizationId: ctx.session.user.organizationId,
      },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure
    .input(schemas.shared.monthlyFS.create)
    .mutation(async ({ ctx, input }) => {
      const financialStatement = await ctx.db.financialStatement.findFirst({
        select: { id: true, reportSemesterId: true, archivedAt: true },
        where: { archivedAt: '', organizationId: ctx.session.user.organizationId },
      });

      if (!financialStatement) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Financial Statement not found.',
        });
      }

      try {
        const monthlyFS = await ctx.db.monthlyFS.create({
          data: {
            ...input,
            financialStatementId: financialStatement.id,
            reportSemesterId: financialStatement.reportSemesterId,
            archivedAt: financialStatement.archivedAt,
            organizationId: ctx.session.user.organizationId!,
          },
        });

        return monthlyFS;
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `${getMonthName(input.month)} ${input.year} already exist`,
        });
      }
    }),

  update: protectedProcedure
    .input(schemas.shared.monthlyFS.update)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      try {
        const monthlyFS = await ctx.db.monthlyFS.update({
          where: { id, organizationId: ctx.session.user.organizationId },
          data,
        });

        return monthlyFS;
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message:
            input.month && input.year
              ? `${getMonthName(input.month)} ${input.year} already exist`
              : 'Inputted Month & Year already exist',
        });
      }
    }),

  delete: protectedProcedure.input(schemas.shared.monthlyFS.delete).mutation(({ ctx, input }) => {
    return ctx.db.monthlyFS.delete({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
    });
  }),
});
