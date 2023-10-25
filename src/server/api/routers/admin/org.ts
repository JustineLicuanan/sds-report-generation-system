import { CommonStatus } from '@prisma/client';
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { orgSchemas } from '~/zod-schemas/org';

export const orgRouter = createTRPCRouter({
  create: adminProcedure.input(orgSchemas.create).mutation(({ ctx, input }) => {
    return ctx.db.user.create({ data: input });
  }),

  get: adminProcedure.input(orgSchemas.get).query(async ({ ctx, input }) => {
    return ctx.db.user.findMany({ where: { id: input.id } });
  }),

  update: adminProcedure.input(orgSchemas.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.user.update({ where: { id }, data });
  }),

  archive: adminProcedure.input(orgSchemas.archive).mutation(({ ctx, input }) => {
    return ctx.db.user.update({ where: { id: input.id }, data: { status: CommonStatus.ARCHIVED } });

    // TODO: Archive related too
  }),
});
