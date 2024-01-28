import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const ARUploadRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.ARUpload.get).query(({ ctx, input }) => {
    return ctx.db.aRUpload.findMany({
      where: { ...(input?.where ?? {}), archivedAt: input?.current && '' },
      include: { ...(input?.include ?? {}) },
      orderBy: { contentNumber: 'asc' },
    });
  }),
});
