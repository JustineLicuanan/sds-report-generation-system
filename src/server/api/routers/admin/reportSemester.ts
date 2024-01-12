import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const reportSemesterRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.reportSemester.get).query(({ ctx, input }) => {
    return ctx.db.reportSemester.findMany({
      where: { ...(input?.where ?? {}), archivedAt: input?.current && '' },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  create: adminProcedure
    .input(schemas.admin.reportSemester.create)
    .query(async ({ ctx, input }) => {
      try {
        const reportSemester = await ctx.db.reportSemester.create({ data: input });
        return reportSemester;
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message:
            'There is already an active semester! Please archive or delete it first before creating a new one.',
        });
      }
    }),

  update: adminProcedure.input(schemas.admin.reportSemester.update).query(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.reportSemester.update({
      where: { id, archivedAt: input.id ? undefined : '' },
      data,
    });
  }),

  archive: adminProcedure.query(({ ctx }) => {
    return ctx.db.reportSemester.update({
      where: { archivedAt: '' },
      data: { archivedAt: new Date().toISOString() },
    });
  }),

  unarchive: adminProcedure
    .input(schemas.admin.reportSemester.unarchive)
    .query(async ({ ctx, input }) => {
      try {
        const reportSemester = await ctx.db.reportSemester.update({
          where: { id: input.id },
          data: { archivedAt: '' },
        });

        return reportSemester;
      } catch (err) {
        throw new TRPCError({
          code: 'CONFLICT',
          message:
            'There is already an active semester! Please archive or delete it first before unarchiving a semester.',
        });
      }
    }),
});
