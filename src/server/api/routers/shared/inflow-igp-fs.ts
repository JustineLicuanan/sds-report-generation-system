import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const inflowIgpFSRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.inflowIgpFS.get).query(({ ctx, input }) => {
    return ctx.db.inflowIgpFS.findMany({
      where: {
        ...(input?.where ?? {}),
        organizationId: ctx.session.user.organizationId,
      },
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure.input(schemas.shared.inflowIgpFS.create).mutation(({ ctx, input }) => {
    return ctx.db.inflowIgpFS.create({
      data: { ...input, organizationId: ctx.session.user.organizationId! },
    });
  }),

  update: protectedProcedure.input(schemas.shared.inflowIgpFS.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.inflowIgpFS.update({
      where: { id, organizationId: ctx.session.user.organizationId },
      data,
    });
  }),

  delete: protectedProcedure.input(schemas.shared.inflowIgpFS.delete).mutation(({ ctx, input }) => {
    return ctx.db.inflowIgpFS.delete({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
    });
  }),
});
