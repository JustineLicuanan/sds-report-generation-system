import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const reportSignatoryRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.reportSignatory.get).query(({ ctx, input }) => {
    return ctx.db.reportSignatory.findMany({ where: input?.where, orderBy: input?.orderBy });
  }),
});
