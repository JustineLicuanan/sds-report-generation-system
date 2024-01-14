import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const orgSignatoryInfoRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.orgSignatoryInfo.get).query(({ ctx, input }) => {
    return ctx.db.orgSignatoryInfo.findMany({
      where: input?.where,
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  update: adminProcedure.input(schemas.admin.orgSignatoryInfo.update).mutation(({ ctx, input }) => {
    const { organizationId, ...data } = input;
    return ctx.db.orgSignatoryInfo.update({ where: { organizationId }, data });
  }),
});
