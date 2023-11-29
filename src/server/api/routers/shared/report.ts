import {
  LogAction,
  LogType,
  NotificationType,
  ReportStatus,
  ReportVisibility,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { reportSchemas } from '~/zod-schemas/shared/report';

export const reportRouter = createTRPCRouter({
  create: protectedProcedure.input(reportSchemas.create).mutation(({ ctx, input }) => {
    try {
      return ctx.db.report.create({
        data: {
          ...input,
          organizationId: ctx.session.user.organizationId!,
          createdById: ctx.session.user.id,
          adminNotifications: {
            create: {
              type: NotificationType.REPORT,
              message: `${ctx.session.user.organizationName} ${
                ctx.session.user.name
              } submitted a ${input.category.toLowerCase()} report: ${input.subject}`,
            },
          },
          logs: {
            create: {
              type: LogType.REPORT,
              name: ctx.session.user.organizationName!,
              subject: input.subject,
              category: input.category,
              action: LogAction.PENDING,
              createdById: ctx.session.user.id,
              organizationId: ctx.session.user.organizationId,
            },
          },
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  get: protectedProcedure.input(reportSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.report.findMany({
        where: {
          AND: {
            id: input?.id,
            category: input?.category,
            hasSchedule: input?.hasSchedule,
            status: input?.status,
            isArchived: false,
            organizationId: ctx.session.user.organizationId,
          },
          OR: [{ visibility: ReportVisibility.PUBLIC }, { createdById: ctx.session.user.id }],
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

  update: protectedProcedure.input(reportSchemas.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.report.update({
        where: {
          id,
          status: ReportStatus.PENDING,
          isArchived: false,
          createdById: ctx.session.user.id,
        },
        data,
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  cancel: protectedProcedure.input(reportSchemas.cancel).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.report.update({
        where: {
          id,
          status: ReportStatus.PENDING,
          isArchived: false,
          createdById: ctx.session.user.id,
        },
        data: {
          status: ReportStatus.CANCELLED,
          notifications: { deleteMany: {} },
          logs: {
            create: {
              ...data,
              type: LogType.REPORT,
              name: ctx.session.user.organizationName!,
              action: LogAction.CANCELLED,
              createdById: ctx.session.user.id,
              organizationId: ctx.session.user.organizationId,
            },
          },
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  archive: protectedProcedure.input(reportSchemas.archive).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.report.update({
        where: { id, createdById: ctx.session.user.id },
        data: {
          isArchived: true,
          notifications: { deleteMany: {} },
          logs: {
            create: {
              ...data,
              type: LogType.REPORT,
              name: ctx.session.user.organizationName!,
              action: LogAction.ARCHIVED,
              createdById: ctx.session.user.id,
              organizationId: ctx.session.user.organizationId,
            },
          },
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
