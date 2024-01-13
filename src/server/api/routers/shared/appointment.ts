import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const appointmentRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.appointment.findMany({
      where: { organizationId: ctx.session.user.organizationId, isCompleted: false },
    });
  }),
});
