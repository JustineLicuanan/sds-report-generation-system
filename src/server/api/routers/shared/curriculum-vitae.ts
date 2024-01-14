import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const curriculumVitaeRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.curriculumVitae.get).query(({ ctx, input }) => {
    return ctx.db.curriculumVitae.findMany({ where: input?.where, orderBy: input?.orderBy });
  }),

  create: protectedProcedure
    .input(schemas.shared.curriculumVitae.create)
    .mutation(({ ctx, input }) => {
      return ctx.db.curriculumVitae.create({
        data: {
          ...input,
          organizationId: ctx.session.user.organizationId!,
        },
      });
    }),

  update: protectedProcedure
    .input(schemas.shared.curriculumVitae.update)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.curriculumVitae.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(schemas.shared.curriculumVitae.delete)
    .mutation(({ ctx, input }) => {
      return ctx.db.curriculumVitae.delete({ where: { id: input.id } });
    }),
});
