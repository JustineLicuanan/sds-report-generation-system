import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const appointmentRouter = createTRPCRouter({
  get: adminProcedure.input(schemas.admin.appointment.get).query(({ ctx, input }) => {
    return ctx.db.appointment.findMany({
      where: input?.where,
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  create: adminProcedure.input(schemas.admin.appointment.create).mutation(({ ctx, input }) => {
    return ctx.db.appointment.create({ data: input });
  }),

  update: adminProcedure.input(schemas.admin.appointment.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.appointment.update({ where: { id }, data });
  }),

  delete: adminProcedure.input(schemas.admin.appointment.delete).mutation(({ ctx, input }) => {
    return ctx.db.appointment.delete({ where: { id: input.id } });
  }),
});
