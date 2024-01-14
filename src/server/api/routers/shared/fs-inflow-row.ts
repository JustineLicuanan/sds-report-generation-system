import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const FSInflowRowRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.FSInflowRow.get).query(({ ctx, input }) => {
    return ctx.db.fSInflowRow.findMany({
      where: {
        ...(input?.where ?? {}),
        archivedAt: input?.current && '',
        organizationId: ctx.session.user.organizationId,
      },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),

  createCollection: protectedProcedure
    .input(schemas.shared.FSInflowRow.createCollection)
    .mutation(async ({ ctx, input }) => {
      const fSInflow = await ctx.db.fSInflow.findFirst({
        select: {
          category: true,
          monthlyId: true,
          reportSemesterId: true,
          archivedAt: true,
        },
        where: { id: input.inflowId, organizationId: ctx.session.user.organizationId },
      });

      if (!fSInflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Inflow not found.',
        });
      }

      return ctx.db.fSInflowRow.create({
        data: { ...input, ...fSInflow, organizationId: ctx.session.user.organizationId! },
      });
    }),

  createIGP: protectedProcedure
    .input(schemas.shared.FSInflowRow.createIGP)
    .mutation(async ({ ctx, input }) => {
      const fSInflow = await ctx.db.fSInflow.findFirst({
        select: {
          category: true,
          monthlyId: true,
          reportSemesterId: true,
          archivedAt: true,
        },
        where: { id: input.inflowId, organizationId: ctx.session.user.organizationId },
      });

      if (!fSInflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Inflow not found.',
        });
      }

      return ctx.db.fSInflowRow.create({
        data: { ...input, ...fSInflow, organizationId: ctx.session.user.organizationId! },
      });
    }),

  updateCollection: protectedProcedure
    .input(schemas.shared.FSInflowRow.updateCollection)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.fSInflowRow.update({
        where: { id, organizationId: ctx.session.user.organizationId },
        data,
      });
    }),

  updateIGP: protectedProcedure
    .input(schemas.shared.FSInflowRow.updateIGP)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.fSInflowRow.update({
        where: { id, organizationId: ctx.session.user.organizationId },
        data,
      });
    }),

  delete: protectedProcedure.input(schemas.shared.FSInflowRow.delete).mutation(({ ctx, input }) => {
    return ctx.db.fSInflowRow.delete({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
    });
  }),
});
