import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const FSOutflowRowRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.FSOutflowRow.get).query(({ ctx, input }) => {
    return ctx.db.fSOutflowRow.findMany({
      where: {
        ...(input?.where ?? {}),
        archivedAt: input?.current && '',
        organizationId: ctx.session.user.organizationId,
      },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure
    .input(schemas.shared.FSOutflowRow.create)
    .mutation(async ({ ctx, input }) => {
      const fSOutflow = await ctx.db.fSOutflow.findFirst({
        select: {
          monthlyId: true,
          reportSemesterId: true,
          archivedAt: true,
        },
        where: { id: input.outflowId, organizationId: ctx.session.user.organizationId },
      });

      if (!fSOutflow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Outflow not found.',
        });
      }

      return ctx.db.fSOutflowRow.create({
        data: { ...input, ...fSOutflow, organizationId: ctx.session.user.organizationId! },
      });
    }),

  update: protectedProcedure
    .input(schemas.shared.FSOutflowRow.update)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.fSOutflowRow.update({
        where: { id, organizationId: ctx.session.user.organizationId },
        data,
      });
    }),

  delete: protectedProcedure
    .input(schemas.shared.FSOutflowRow.delete)
    .mutation(({ ctx, input }) => {
      return ctx.db.fSOutflowRow.delete({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
      });
    }),
});
