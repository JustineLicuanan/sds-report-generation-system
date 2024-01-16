import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const generatedARRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.generatedAR.get).query(({ ctx, input }) => {
    return ctx.db.generatedAR.findMany({
      where: {
        ...(input?.where ?? {}),
        ...(input?.archived === undefined ? { archivedAt: '' } : { NOT: { archivedAt: '' } }),
        organizationId: ctx.session.user.organizationId,
      },
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure.input(schemas.shared.generatedAR.create).mutation(({ ctx, input }) => {
    return ctx.db.generatedAR.create({
      data: {
        ...input,
        content: JSON.stringify(input.content),
        organizationId: ctx.session.user.organizationId!,
        userId: ctx.session.user.id,
      },
    });
  }),

  update: protectedProcedure.input(schemas.shared.generatedAR.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.generatedAR.update({
      where: { id, organizationId: ctx.session.user.organizationId },
      data: {
        ...data,
        content: input.content === undefined ? undefined : JSON.stringify(input.content),
      },
    });
  }),

  archive: protectedProcedure
    .input(schemas.shared.generatedAR.delete)
    .mutation(({ ctx, input }) => {
      return ctx.db.generatedAR.update({
        where: { id: input.id, organizationId: ctx.session.user.organizationId },
        data: { archivedAt: new Date().toISOString() },
      });
    }),

  delete: protectedProcedure.input(schemas.shared.generatedAR.delete).mutation(({ ctx, input }) => {
    return ctx.db.generatedAR.delete({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
    });
  }),
});
