import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const inflowCollectionRowFSRouter = createTRPCRouter({
  get: protectedProcedure
    .input(schemas.shared.inflowCollectionRowFS.get)
    .query(({ ctx, input }) => {
      return ctx.db.inflowCollectionRowFS.findMany({
        where: {
          ...(input?.where ?? {}),
          organizationId: ctx.session.user.organizationId,
        },
        include: { ...(input?.include ?? {}) },
        orderBy: input?.orderBy,
      });
    }),

  create: protectedProcedure
    .input(schemas.shared.inflowCollectionRowFS.create)
    .mutation(({ ctx, input }) => {
      return ctx.db.inflowCollectionRowFS.create({
        data: { ...input, organizationId: ctx.session.user.organizationId! },
      });
    }),

  update: protectedProcedure
    .input(schemas.shared.inflowCollectionRowFS.update)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.inflowCollectionRowFS.update({
        where: { id, organizationId: ctx.session.user.organizationId },
        data,
      });
    }),

  delete: protectedProcedure
    .input(schemas.shared.inflowCollectionRowFS.delete)
    .mutation(({ ctx, input }) => {
      return ctx.db.inflowCollectionRowFS.delete({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
      });
    }),
});
