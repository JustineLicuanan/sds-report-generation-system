import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { orgSchemas } from '~/zod-schemas/admin/org';

export const orgRouter = createTRPCRouter({
  create: adminProcedure.input(orgSchemas.create).mutation(async ({ ctx, input }) => {
    const { members, ...data } = input;

    try {
      const userExists = !!(await ctx.db.user.count({
        where: {
          email: { in: members.map(({ email }) => email) },
          isActive: true,
          organizationIsArchived: false,
        },
      }));

      if (userExists) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      return ctx.db.organization.create({
        data: {
          ...data,
          members: {
            connectOrCreate: members.map((member) => ({
              where: { email: member.email },
              create: member,
            })),
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

  update: adminProcedure.input(orgSchemas.update).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.organization.update({ where: { id }, data });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

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
