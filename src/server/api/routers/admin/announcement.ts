import { NotificationType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { announcementSchemas } from '~/zod-schemas/admin/announcement';

export const announcementRouter = createTRPCRouter({
  create: adminProcedure.input(announcementSchemas.create).mutation(({ ctx, input }) => {
    const { audience, ...data } = input;

    try {
      return ctx.db.announcement.create({
        data: {
          ...data,
          audience: { connect: audience },
          notifications: {
            createMany: {
              data: audience.map(({ id }) => ({
                type: NotificationType.ANNOUNCEMENT,
                message: `Announcement: ${data.subject}`,
                organizationId: id,
              })),
            },
          },
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  get: adminProcedure.input(announcementSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.announcement.findMany({
        where: {
          id: input?.id,
          hasReport: input?.hasReport,
          isArchived: input?.isArchived ?? false,
        },
        include: {
          audience: input?.includeAudience,
          comments: input?.includeComments,
          reports: input?.includeReports,
          adminNotifications: input?.includeAdminNotifications,
          notifications: input?.includeNotifications,
        },
        orderBy: { due: input?.orderByDue, createdAt: input?.orderByCreatedAt },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  update: adminProcedure.input(announcementSchemas.update).mutation(({ ctx, input }) => {
    const { id, audience, ...data } = input;

    try {
      return ctx.db.announcement.update({
        where: { id },
        data: { ...data, audience: { set: audience } },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  archive: adminProcedure.input(announcementSchemas.archive).mutation(({ ctx, input }) => {
    try {
      return ctx.db.announcement.update({
        where: { id: input.id },
        data: { isArchived: true, notifications: { deleteMany: {} } },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
