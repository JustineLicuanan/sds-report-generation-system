import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const reportSignatoryRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.reportSignatory.get).query(({ ctx, input }) => {
    return ctx.db.reportSignatory.findMany({ where: input?.where, orderBy: input?.orderBy });
  }),

  update: adminProcedure
    .input(schemas.admin.reportSignatory.update)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(
        input.signatories.map(({ position, name }) => {
          return ctx.db.reportSignatory.update({ where: { position }, data: { name } });
        })
      );

      return { success: true };
    }),
});
