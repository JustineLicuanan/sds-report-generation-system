import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { userSchemas } from '~/zod-schemas/shared/user';

export const userRouter = createTRPCRouter({
  create: protectedProcedure.input(userSchemas.create).mutation(async ({ ctx, input }) => {
    const { email, ...data } = input;

    try {
      const userExists = !!(await ctx.db.user.count({
        where: { email, organizationIsArchived: false },
      }));

      if (userExists) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      return ctx.db.user.upsert({
        where: { email },
        update: {
          ...data,
          isActive: false,
          organization: {
            connect: {
              id_name_isArchived: {
                id: ctx.session.user.organizationId!,
                name: ctx.session.user.name!,
                isArchived: false,
              },
            },
          },
        },
        create: {
          ...data,
          email,
          organization: {
            connect: {
              id_name_isArchived: {
                id: ctx.session.user.organizationId!,
                name: ctx.session.user.name!,
                isArchived: false,
              },
            },
          },
        },
      });
    } catch (err) {
      if (err instanceof TRPCError && err.code === 'CONFLICT') {
        throw err;
      }

      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  update: protectedProcedure.input(userSchemas.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.user.update({
        where: { id, isActive: false, organizationId: ctx.session.user.organizationId! },
        data,
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  remove: protectedProcedure.input(userSchemas.archive).mutation(({ ctx, input }) => {
    try {
      return ctx.db.user.update({
        where: { id: input.id, isActive: false, organizationId: ctx.session.user.organizationId! },
        data: { organization: { disconnect: true }, notifications: { deleteMany: {} } },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
