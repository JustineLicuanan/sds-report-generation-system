import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const outflowFSRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.outflowFS.get).query(({ ctx, input }) => {
    return ctx.db.outflowFS.findMany({
      where: {
        ...(input?.where ?? {}),
        organizationId: ctx.session.user.organizationId,
      },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure.input(schemas.shared.outflowFS.create).mutation(({ ctx, input }) => {
    return ctx.db.outflowFS.create({
      data: { ...input, organizationId: ctx.session.user.organizationId! },
    });
  }),

  update: protectedProcedure.input(schemas.shared.outflowFS.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.outflowFS.update({
      where: { id, organizationId: ctx.session.user.organizationId },
      data,
    });
  }),

  delete: protectedProcedure.input(schemas.shared.outflowFS.delete).mutation(({ ctx, input }) => {
    return ctx.db.outflowFS.delete({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
    });
  }),
});
