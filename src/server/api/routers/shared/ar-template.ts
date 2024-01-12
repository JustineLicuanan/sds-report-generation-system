import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const ARTemplateRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.ARTemplate.get).query(({ ctx, input }) => {
    return ctx.db.aRTemplate.findMany({ where: { ...(input ?? {}), isActive: true } });
  }),
});
