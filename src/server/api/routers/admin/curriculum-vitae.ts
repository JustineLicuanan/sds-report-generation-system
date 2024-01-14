import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const curriculumVitaeRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.curriculumVitae.get).query(({ ctx, input }) => {
    return ctx.db.curriculumVitae.findMany({
      where: input?.where,
      include: { ...(input?.include ?? {}) },
      orderBy: input?.orderBy,
    });
  }),
});
