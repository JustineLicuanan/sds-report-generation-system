import { z } from 'zod';

export const commentSchemas = {
  createInAnnouncement: z.object({
    content: z.string().trim().min(1),
    announcementId: z.string().cuid(),
    audience: z.object({ id: z.string().cuid() }).array(),
  }),

  createInReport: z.object({ content: z.string().trim().min(1), reportId: z.string().cuid() }),

  update: z.object({ id: z.string().cuid(), content: z.string().trim().min(1).optional() }),

  archive: z.object({ id: z.string().cuid() }),
};
