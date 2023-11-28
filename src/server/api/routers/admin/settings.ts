import { TRPCError } from '@trpc/server';

import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { settingsSchemas } from '~/zod-schemas/admin/settings';

export const settingsRouter = createTRPCRouter({
  get: adminProcedure.query(({ ctx }) => {
    try {
      return ctx.db.settings.findUnique({ where: { ofAdmin: true } });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  update: adminProcedure.input(settingsSchemas.update).mutation(({ ctx, input }) => {
    try {
      return ctx.db.settings.update({ where: { ofAdmin: true }, data: input });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
