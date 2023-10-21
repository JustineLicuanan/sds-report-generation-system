import { TRPCError } from '@trpc/server';
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { UserStatus } from '~/server/auth';
import {
  archiveOrgSchema,
  createOrgSchema,
  getOrgSchema,
  updateOrgSchema,
} from '~/zod-schemas/org';

export const orgRouter = createTRPCRouter({
  create: adminProcedure.input(createOrgSchema).mutation(({ ctx, input }) => {
    return ctx.db.user.create({ data: input });
  }),

  get: adminProcedure.input(getOrgSchema).query(async ({ ctx, input }) => {
    if (!input.all && !!input.id) {
      return [await ctx.db.user.findUnique({ where: { id: input.id } })];
    }

    if (input.all && !input.id) {
      return ctx.db.user.findMany();
    }

    throw new TRPCError({ code: 'BAD_REQUEST' });
  }),

  update: adminProcedure.input(updateOrgSchema).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    return ctx.db.user.update({ where: { id }, data });
  }),

  archive: adminProcedure.input(archiveOrgSchema).mutation(({ ctx, input }) => {
    return ctx.db.user.update({ where: { id: input.id }, data: { status: UserStatus.ARCHIVED } });

    // TODO: Archive related too
  }),
});
