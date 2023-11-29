import { LogType, ReportVisibility } from '@prisma/client';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { logSchemas } from '~/zod-schemas/shared/log';

export const logRouter = createTRPCRouter({
  get: protectedProcedure.input(logSchemas.get).query(({ ctx, input }) => {
    try {
      return ctx.db.log.findMany({
        where:
          input.type === LogType.AUTH
            ? {
                type: input.type,
                email: input.email,
                action: input.action,
                createdById: ctx.session.user.id,
              }
            : input.type === LogType.REPORT
            ? {
                type: input.type,
                category: input.category,
                action: input.action,
                organizationId: ctx.session.user.organizationId,
                OR: [
                  { createdById: ctx.session.user.id },
                  { reportVisibility: ReportVisibility.PUBLIC },
                ],
              }
            : undefined,
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
