import { ReportStatus } from '@prisma/client';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { reportSchemas } from '~/zod-schemas/report';

export const reportRouter = createTRPCRouter({
  create: protectedProcedure.input(reportSchemas.create).mutation(({ ctx, input }) => {
    const { announcementId, ...data } = input;
    return ctx.db.report.create({
      data: {
        ...data,
        announcement: { connect: { id: announcementId } },
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });
  }),

  get: protectedProcedure.input(reportSchemas.get).query(async ({ ctx, input }) => {
    return ctx.db.report.findMany({
      where: { id: input?.id, createdBy: { id: ctx.session.user.id } },
      include: { comments: input?.withComments, announcement: input?.withAnnouncement },
    });
  }),

  update: protectedProcedure.input(reportSchemas.update).mutation(({ ctx, input }) => {
    const { id, announcementId, ...data } = input;
    return ctx.db.report.update({
      where: { id, createdBy: { id: ctx.session.user.id } },
      data: { ...data, announcement: { connect: { id: announcementId } } },
    });
  }),

  archive: protectedProcedure.input(reportSchemas.archive).mutation(({ ctx, input }) => {
    return ctx.db.report.update({
      where: { id: input.id, createdBy: { id: ctx.session.user.id } },
      data: { status: ReportStatus.ARCHIVED },
    });
  }),
});
