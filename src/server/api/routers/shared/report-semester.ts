import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const reportSemesterRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.reportSemester.findUnique({ where: { archivedAt: '' } });
  }),
});
