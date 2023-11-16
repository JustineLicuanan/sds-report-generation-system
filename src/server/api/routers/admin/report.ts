import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { reportSchemas } from '~/zod-schemas/admin/report';

export const reportRouter = createTRPCRouter({
  get: adminProcedure.input(reportSchemas.get).query(async ({ ctx, input }) => {
    return ctx.db.report.findMany({
      where: { id: input?.id },
      include: {
        comments: input?.withComments,
        announcement: input?.withAnnouncement,
        createdBy: input?.withCreatedBy,
      },
    });
  }),

  update: adminProcedure.input(reportSchemas.update).mutation(({ ctx, input }) => {
    const { id, announcementId, logData, ...data } = input;
    return ctx.db.report.update({
      where: { id },
      data: {
        ...data,
        announcement: { connect: { id: announcementId! } },
        logs: { create: [{ ...logData!, reportStatus: logData && data.status }] },
      },
    });
  }),

  updateStatus: adminProcedure.input(reportSchemas.updateStatus).mutation(({ ctx, input }) => {
    const { id, status, ...data } = input;
    return ctx.db.report.update({
      where: { id },
      data: { status, logs: { create: [{ ...data, reportStatus: status }] } },
    });
  }),
});
