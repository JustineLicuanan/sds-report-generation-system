import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const inflowIgpRowFSRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.inflowIgpRowFS.get).query(({ ctx, input }) => {
    return ctx.db.inflowIgpRowFS.findMany({
      where: {
        ...(input?.where ?? {}),
        organizationId: ctx.session.user.organizationId,
      },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure
    .input(schemas.shared.inflowIgpRowFS.create)
    .mutation(({ ctx, input }) => {
      return ctx.db.inflowIgpRowFS.create({
        data: { ...input, organizationId: ctx.session.user.organizationId! },
      });
    }),

  update: protectedProcedure
    .input(schemas.shared.inflowIgpRowFS.update)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.inflowIgpRowFS.update({
        where: { id, organizationId: ctx.session.user.organizationId },
        data,
      });
    }),

  delete: protectedProcedure
    .input(schemas.shared.inflowIgpRowFS.delete)
    .mutation(({ ctx, input }) => {
      return ctx.db.inflowIgpRowFS.delete({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
      });
    }),
});
