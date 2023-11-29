import { TRPCError } from '@trpc/server';
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { commentSchemas } from '~/zod-schemas/admin/comment';

export const commentRouter = createTRPCRouter({
  create: adminProcedure.input(commentSchemas.create).mutation(({ ctx, input }) => {
    try {
      return ctx.db.comment.create({
        data: { ...input, createdById: ctx.session.user.id, createdByName: ctx.session.user.name! },
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  update: adminProcedure.input(commentSchemas.update).mutation(({ ctx, input }) => {
    const { id, ...data } = input;

    try {
      return ctx.db.comment.update({ where: { id, createdById: ctx.session.user.id }, data });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),

  archive: adminProcedure.input(commentSchemas.archive).mutation(({ ctx, input }) => {
    try {
      return ctx.db.comment.update({ where: { id: input.id }, data: { isArchived: true } });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
  }),
});
