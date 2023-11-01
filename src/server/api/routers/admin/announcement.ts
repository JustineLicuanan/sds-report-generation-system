import { CommonStatus } from '@prisma/client';
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { announcementSchemas } from '~/zod-schemas/admin/announcement';

export const announcementRouter = createTRPCRouter({
  create: adminProcedure.input(announcementSchemas.create).mutation(({ ctx, input }) => {
    const { audience, ...data } = input;
    return ctx.db.announcement.create({ data: { ...data, audience: { connect: audience } } });
  }),

  get: adminProcedure.input(announcementSchemas.get).query(async ({ ctx, input }) => {
    return ctx.db.announcement.findMany({
      where: { id: input?.id },
      include: {
        audience: input?.withAudience,
        comments: input?.withComments,
        reports: input?.withReports,
      },
    });
  }),

  update: adminProcedure.input(announcementSchemas.update).mutation(({ ctx, input }) => {
    const { id, audience, ...data } = input;
    return ctx.db.announcement.update({
      where: { id },
      data: { ...data, audience: { set: audience } },
    });
  }),

  archive: adminProcedure.input(announcementSchemas.archive).mutation(({ ctx, input }) => {
    return ctx.db.announcement.update({
      where: { id: input.id },
      data: { status: CommonStatus.ARCHIVED },
    });
  }),
});
