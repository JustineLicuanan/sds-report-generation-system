import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { orgSchemas } from '~/zod-schemas/admin/org';

export const orgRouter = createTRPCRouter({
  create: adminProcedure.input(orgSchemas.create).mutation(async ({ ctx, input }) => {
    const { members, ...data } = input;

    try {
      const userExists = !!(await ctx.db.user.count({
        where: {
          email: { in: members.map(({ where }) => where.email) },
          organizationIsArchived: false,
        },
      }));

      if (userExists) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      return ctx.db.organization.create({
        data: { ...data, members: { connectOrCreate: members } },
      });
    } catch (err) {
      if (err instanceof TRPCError && err.code === 'CONFLICT') {
        throw err;
      }

      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  get: adminProcedure.input(orgSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.organization.findMany({
        where: { id: input?.id, category: input?.category, isArchived: input?.isArchived ?? false },
        include: {
          members: input?.includeMembers,
          reports: input?.includeReports,
          comments: input?.includeComments,
          notifications: input?.includeNotifications,
          logs: input?.includeLogs,
          announcements: input?.includeAnnouncements,
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  // FIXME:
  // update: adminProcedure.input(orgSchemas.update).mutation(async ({ ctx, input }) => {
  //   const { id, members, ...data } = input;

  //   try {
  //     // FIXME: count w/ filter available, upsert, set (use $transaction(?) to exec all or nothing)
  //     await ctx.db.user.upsert(members!);

  //     return ctx.db.organization.update({
  //       where: { id },
  //       data: { ...data, members: {  } },
  //     });
  //   } catch (err) {
  //     throw new TRPCError({ code: 'CONFLICT' });
  //   }
  // }),

  archive: adminProcedure.input(orgSchemas.archive).mutation(({ ctx, input }) => {
    try {
      return ctx.db.organization.update({
        where: { id: input.id },
        data: { isArchived: true, notifications: { deleteMany: {} } },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
