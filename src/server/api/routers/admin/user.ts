import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { userSchemas } from '~/zod-schemas/admin/user';

export const userRouter = createTRPCRouter({
  create: adminProcedure.input(userSchemas.create).mutation(async ({ ctx, input }) => {
    const { organization, email, ...data } = input;

    try {
      const userExists = !!(await ctx.db.user.count({
        where: { email, isActive: true, organizationIsArchived: false },
      }));

      if (userExists) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      return ctx.db.user.upsert({
        where: { email },
        update: {
          ...data,
          organization: { connect: { id_name_isArchived: { ...organization, isArchived: false } } },
        },
        create: {
          ...data,
          email,
          organization: { connect: { id_name_isArchived: { ...organization, isArchived: false } } },
        },
      });
    } catch (err) {
      if (err instanceof TRPCError && err.code === 'CONFLICT') {
        throw err;
      }

      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  update: adminProcedure.input(userSchemas.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.user.update({ where: { id }, data });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  countSessions: adminProcedure.input(userSchemas.countSessions).query(({ ctx, input }) => {
    try {
      return ctx.db.session.count({ where: { userId: input.id } });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  clearAllSessions: adminProcedure
    .input(userSchemas.clearAllSessions)
    .mutation(({ ctx, input }) => {
      try {
        return ctx.db.session.deleteMany({ where: { userId: input.id } });
      } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),

  remove: adminProcedure.input(userSchemas.archive).mutation(({ ctx, input }) => {
    try {
      return ctx.db.user.update({
        where: { id: input.id },
        data: { organization: { disconnect: true }, notifications: { deleteMany: {} } },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
