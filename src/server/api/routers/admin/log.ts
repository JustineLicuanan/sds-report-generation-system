import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { logSchemas } from '~/zod-schemas/admin/log';

export const logRouter = createTRPCRouter({
  get: adminProcedure.input(logSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.log.findMany({
        where: {
          type: input.type,
          email: input.email,
          category: input.category,
          action: input.action,
        },
        include: {
          createdBy: input.includeCreatedBy,
          report: input.includeReport,
          organization: input.includeOrganization,
        },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
