import { OutflowFSCategory } from '@prisma/client';
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

  importFlows: protectedProcedure
    .input(schemas.shared.monthlyFS.importFlows)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        if (input.inflowCollections.length > 0) {
          await tx.inflowCollectionFS.create({
            data: {
              date: new Date().toISOString(),
              rows: {
                createMany: {
                  data: input.inflowCollections.map((collection) => ({
                    ...collection,
                    monthlyId: input.monthlyId,
                    organizationId: ctx.session.user.organizationId!,
                  })),
                },
              },
              monthlyId: input.monthlyId,
              organizationId: ctx.session.user.organizationId!,
            },
          });
        }

        if (input.inflowIGPs.length > 0) {
          await tx.inflowIgpFS.create({
            data: {
              date: new Date().toISOString(),
              rows: {
                createMany: {
                  data: input.inflowIGPs.map((IGP) => ({
                    ...IGP,
                    monthlyId: input.monthlyId,
                    organizationId: ctx.session.user.organizationId!,
                  })),
                },
              },
              monthlyId: input.monthlyId,
              organizationId: ctx.session.user.organizationId!,
            },
          });
        }

        if (input.outflows.length > 0) {
          const categories = [] as OutflowFSCategory[];
          const outflowRows = input.outflows.reduce(
            (acc, { category, ...outflowRow }) => {
              if (!categories.includes(category)) categories.push(category);
              if (!acc[category]) acc[category] = [];

              acc[category]?.push({
                ...outflowRow,
                monthlyId: input.monthlyId,
                organizationId: ctx.session.user.organizationId!,
              });

              return acc;
            },
            {} as Partial<
              Record<
                OutflowFSCategory,
                Omit<
                  Parameters<typeof tx.outflowRowFS.create>[0]['data'],
                  'outflow' | 'outflowId'
                >[]
              >
            >
          );

          for (const category of categories) {
            await tx.outflowFS.create({
              data: {
                category,
                date: new Date().toISOString(),
                rows: { createMany: { data: outflowRows[category] as any } },
                monthlyId: input.monthlyId,
                organizationId: ctx.session.user.organizationId!,
              },
            });
          }
        }
      });
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
