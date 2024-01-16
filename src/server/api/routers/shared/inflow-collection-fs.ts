import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const inflowCollectionFSRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.inflowCollectionFS.get).query(({ ctx, input }) => {
    return ctx.db.inflowCollectionFS.findMany({
      where: {
        ...(input?.where ?? {}),
        organizationId: ctx.session.user.organizationId,
      },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure
    .input(schemas.shared.inflowCollectionFS.create)
    .mutation(({ ctx, input }) => {
      return ctx.db.inflowCollectionFS.create({
        data: { ...input, organizationId: ctx.session.user.organizationId! },
      });
    }),

  update: protectedProcedure
    .input(schemas.shared.inflowCollectionFS.update)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.inflowCollectionFS.update({
        where: { id, organizationId: ctx.session.user.organizationId },
        data,
      });
    }),

  delete: protectedProcedure
    .input(schemas.shared.inflowCollectionFS.delete)
    .mutation(({ ctx, input }) => {
      return ctx.db.inflowCollectionFS.delete({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
      });
    }),
});
