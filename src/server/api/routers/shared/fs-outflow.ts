import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { schemas } from '~/zod-schemas';

export const FSOutflowRouter = createTRPCRouter({
  get: protectedProcedure.input(schemas.shared.FSOutflow.get).query(({ ctx, input }) => {
    return ctx.db.fSOutflow.findMany({
      where: {
        ...(input?.where ?? {}),
        deletedAt: '',
        archivedAt: input?.current && '',
        organizationId: ctx.session.user.organizationId,
      },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  getDeleted: protectedProcedure.input(schemas.shared.FSOutflow.get).query(({ ctx, input }) => {
    return ctx.db.fSOutflow.findMany({
      where: {
        ...(input?.where ?? {}),
        archivedAt: input?.current && '',
        organizationId: ctx.session.user.organizationId,
        NOT: { deletedAt: '' },
      },
      include: input?.include,
      orderBy: input?.orderBy,
    });
  }),

  create: protectedProcedure.input(schemas.shared.FSOutflow.create).mutation(({ ctx, input }) => {
    return ctx.db.fSOutflow.create({
      data: { ...input, archivedAt: '', organizationId: ctx.session.user.organizationId! },
    });
  }),

  update: protectedProcedure.input(schemas.shared.FSOutflow.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.fSOutflow.update({
      where: { id, organizationId: ctx.session.user.organizationId },
      data,
    });
  }),

  delete: protectedProcedure.input(schemas.shared.FSOutflow.delete).mutation(({ ctx, input }) => {
    return ctx.db.fSOutflow.update({
      where: { id: input.id, organizationId: ctx.session.user.organizationId },
      data: { deletedAt: new Date().toISOString() },
    });
  }),
});
