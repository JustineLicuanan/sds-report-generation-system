import { z } from 'zod';

export const reportSchemas = {
  create: z.object({
    subject: z.string().trim().min(1),
    message: z.string().trim().min(1),
    file: z.string().url().nullable().optional(),
    announcementId: z.string().cuid().nullable().optional(),
  }),

  get: z
    .object({
      id: z.string().cuid().optional(),
      withComments: z.literal(true).optional(),
      withAnnouncement: z.literal(true).optional(),
    })
    .optional(),

  update: z.object({
    id: z.string().cuid(),
    subject: z.string().trim().min(1).optional(),
    message: z.string().trim().min(1).optional(),
    file: z.string().url().nullable().optional(),
    announcementId: z.string().cuid().nullable().optional(),
  }),

  archive: z.object({ id: z.string().cuid() }),
};
