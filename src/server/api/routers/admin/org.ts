import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { orgSchemas } from '~/zod-schemas/admin/org';

export const orgRouter = createTRPCRouter({
  create: adminProcedure.input(orgSchemas.create).mutation(({ ctx, input }) => {
    const { members, ...data } = input;

    try {
      return ctx.db.organization.create({
        data: { ...data, members: { createMany: { data: members } } },
      });
    } catch (err) {
      throw new TRPCError({ code: 'CONFLICT' });
    }
  }),

  get: adminProcedure.input(orgSchemas.get).query(async ({ ctx, input }) => {
    try {
      return ctx.db.organization.findMany({
        where: { id: input?.id, category: input?.category, isArchived: input?.isArchived ?? false },
        include: {
          members: input?.withMembers,
          reports: input?.withReports,
          announcements: input?.withAnnouncements,
          notifications: input?.withNotifications,
          logs: input?.withLogs,
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
      return ctx.db.organization.update({ where: { id: input.id }, data: { isArchived: true } });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
