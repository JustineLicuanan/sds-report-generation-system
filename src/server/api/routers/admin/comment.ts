import { NotificationType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { commentSchemas } from '~/zod-schemas/admin/comment';

export const commentRouter = createTRPCRouter({
  createInAnnouncement: adminProcedure
    .input(commentSchemas.createInAnnouncement)
    .mutation(({ ctx, input }) => {
      const { audience, ...data } = input;

      try {
        return ctx.db.comment.create({
          data: {
            ...data,
            createdById: ctx.session.user.id,
            createdByName: ctx.session.user.name!,
            notifications: {
              createMany: {
                data: audience?.map(({ id }) => ({
                  type: NotificationType.ANNOUNCEMENT_COMMENT,
                  message: `${ctx.session.user.name} commented: ${data.content}`,
                  organizationId: id,
                  announcementId: data.announcementId,
                })),
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),

  createInReport: adminProcedure.input(commentSchemas.createInReport).mutation(({ ctx, input }) => {
    const { notificationData, ...data } = input;

    try {
      return ctx.db.comment.create({
        data: {
          ...data,
          createdById: ctx.session.user.id,
          createdByName: ctx.session.user.name!,
          notifications: {
            create: {
              ...notificationData,
              type: NotificationType.REPORT_COMMENT,
              message: `${ctx.session.user.name} commented: ${data.content}`,
              reportId: data.reportId,
            },
          },
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  update: adminProcedure.input(commentSchemas.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.comment.update({ where: { id, createdById: ctx.session.user.id }, data });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  archive: adminProcedure.input(commentSchemas.archive).mutation(({ ctx, input }) => {
    try {
      return ctx.db.comment.update({
        where: { id: input.id },
        data: {
          isArchived: true,
          adminNotifications: { deleteMany: {} },
          notifications: { deleteMany: {} },
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
