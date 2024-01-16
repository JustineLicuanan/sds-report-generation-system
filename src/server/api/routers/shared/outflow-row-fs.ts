import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const outflowRowFSRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.outflowRowFS.get).query(({ ctx, input }) => {
    return ctx.db.outflowRowFS.findMany({
      where: {
        ...(input?.where ?? {}),
        organizationId: ctx.session.user.organizationId,
      },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure
    .input(schemas.shared.outflowRowFS.create)
    .mutation(({ ctx, input }) => {
      return ctx.db.outflowRowFS.create({
        data: { ...input, organizationId: ctx.session.user.organizationId! },
      });
    }),

  update: protectedProcedure
    .input(schemas.shared.outflowRowFS.update)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.outflowRowFS.update({
        where: { id, organizationId: ctx.session.user.organizationId },
        data,
      });
    }),

  delete: protectedProcedure
    .input(schemas.shared.outflowRowFS.delete)
    .mutation(({ ctx, input }) => {
      return ctx.db.outflowRowFS.delete({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
      });
    }),
});
