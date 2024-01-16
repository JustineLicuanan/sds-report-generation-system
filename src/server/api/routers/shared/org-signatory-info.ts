import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const orgSignatoryInfoRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.orgSignatoryInfo.get).query(({ ctx, input }) => {
    return ctx.db.orgSignatoryInfo.findUnique({
      where: { organizationId: ctx.session.user.organizationId },
      include: { ...(input?.include ?? {}) },
    });
  }),

  update: protectedProcedure
    .input(schemas.shared.orgSignatoryInfo.update)
    .mutation(({ ctx, input }) => {
      return ctx.db.orgSignatoryInfo.update({
        where: { organizationId: ctx.session.user.organizationId },
        data: input,
      });
    }),
});
