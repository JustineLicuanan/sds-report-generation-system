import { z } from 'zod';

export const commentSchemas = {
  create: z.object({
    content: z.string().trim().min(1),
    announcementId: z.string().cuid().optional(),
    reportId: z.string().cuid().optional(),
  }),

  update: z.object({ id: z.string().cuid(), content: z.string().trim().min(1).optional() }),

  archive: z.object({ id: z.string().cuid() }),
};
