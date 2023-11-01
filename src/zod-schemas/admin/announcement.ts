import { z } from 'zod';

export const announcementSchemas = {
  create: z.object({
    subject: z.string().trim().min(1),
    message: z.string().trim().min(1),
    start: z.string().datetime({ offset: true }).nullable().optional(),
    due: z.string().datetime({ offset: true }).nullable().optional(),
    withReport: z.boolean().optional(),
    audience: z.object({ id: z.string().cuid() }).array(),
  }),

  get: z
    .object({
      id: z.string().cuid().optional(),
      withAudience: z.literal(true).optional(),
      withComments: z.literal(true).optional(),
      withReports: z.literal(true).optional(),
    })
    .optional(),

  update: z.object({
    id: z.string().cuid(),
    subject: z.string().trim().min(1).optional(),
    message: z.string().trim().min(1).optional(),
    start: z.string().datetime({ offset: true }).nullable().optional(),
    due: z.string().datetime({ offset: true }).nullable().optional(),
    withReport: z.boolean().optional(),
    audience: z.object({ id: z.string().cuid() }).array().optional(),
  }),

  archive: z.object({ id: z.string().cuid() }),
};
