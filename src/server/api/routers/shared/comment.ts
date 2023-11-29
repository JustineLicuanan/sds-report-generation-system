import { NotificationType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { commentSchemas } from '~/zod-schemas/shared/comment';

export const commentRouter = createTRPCRouter({
  createInAnnouncement: protectedProcedure
    .input(commentSchemas.createInAnnouncement)
    .mutation(({ ctx, input }) => {
      const { audience, ...data } = input;
      const message = `${ctx.session.user.organizationName} ${ctx.session.user.name} commented: ${data.content}`;

      try {
        return ctx.db.comment.create({
          data: {
            ...data,
            createdById: ctx.session.user.id,
            createdByName: ctx.session.user.name!,
            organizationId: ctx.session.user.organizationId,
            organizationName: ctx.session.user.organizationName,
            adminNotifications: {
              create: {
                type: NotificationType.ANNOUNCEMENT_COMMENT,
                message,
                announcementId: data.announcementId,
              },
            },
            notifications: {
              createMany: {
                data: audience.map(({ id }) => ({
                  type: NotificationType.ANNOUNCEMENT_COMMENT,
                  message,
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

  createInReport: protectedProcedure
    .input(commentSchemas.createInReport)
    .mutation(({ ctx, input }) => {
      const message = `${ctx.session.user.organizationName} ${ctx.session.user.name} commented: ${input.content}`;

      try {
        return ctx.db.comment.create({
          data: {
            ...input,
            createdById: ctx.session.user.id,
            createdByName: ctx.session.user.name!,
            organizationId: ctx.session.user.organizationId,
            organizationName: ctx.session.user.organizationName,
            adminNotifications: {
              create: {
                type: NotificationType.REPORT_COMMENT,
                message,
                reportId: input.reportId,
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),

  update: protectedProcedure.input(commentSchemas.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.comment.update({ where: { id, createdById: ctx.session.user.id }, data });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  archive: protectedProcedure.input(commentSchemas.archive).mutation(({ ctx, input }) => {
    try {
      return ctx.db.comment.update({
        where: { id: input.id, createdById: ctx.session.user.id },
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
