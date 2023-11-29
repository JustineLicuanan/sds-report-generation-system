import { LogType, NotificationType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { reportSchemas } from '~/zod-schemas/admin/report';

export const reportRouter = createTRPCRouter({
  get: adminProcedure.input(reportSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.report.findMany({
        where: {
          id: input?.id,
          category: input?.category,
          visibility: input?.visibility,
          hasSchedule: input?.hasSchedule,
          status: input?.status,
          isArchived: input?.isArchived ?? false,
        },
        include: {
          comments: input?.includeComments,
          adminNotifications: input?.includeAdminNotifications,
          notifications: input?.includeNotifications,
          logs: input?.includeLogs,
          announcement: input?.includeAnnouncement,
          organization: input?.includeOrganization,
          createdBy: input?.includeCreatedBy,
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  update: adminProcedure.input(reportSchemas.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.report.update({ where: { id }, data });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  updateStatus: adminProcedure.input(reportSchemas.updateStatus).mutation(({ ctx, input }) => {
    const { id, notificationData, logData, ...data } = input;

    try {
      return ctx.db.report.update({
        where: { id },
        data: {
          ...data,
          notifications: {
            create: {
              ...notificationData,
              type: NotificationType.REPORT,
              message: `${ctx.session.user.name} ${data.status.toLowerCase()} your report.`,
            },
          },
          logs: {
            create: {
              ...logData,
              type: LogType.REPORT,
              action: data.status,
              createdById: notificationData.userId,
              organizationId: notificationData.organizationId,
            },
          },
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
