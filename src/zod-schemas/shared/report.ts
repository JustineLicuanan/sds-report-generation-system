import { ReportCategory, ReportVisibility } from '@prisma/client';
import { z } from 'zod';

export const reportSchemas = {
  create: z.object({
    subject: z.string().trim().min(1),
    message: z.string().trim().min(1),
    category: z.nativeEnum(ReportCategory),
    visibility: z.nativeEnum(ReportVisibility),
    file: z.string().url().nullable().optional(),
    withSchedule: z.boolean(),
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
    category: z.nativeEnum(ReportCategory).optional(),
    visibility: z.nativeEnum(ReportVisibility).optional(),
    file: z.string().url().nullable().optional(),
    withSchedule: z.boolean(),
    announcementId: z.string().cuid().nullable().optional(),
  }),

  cancel: z.object({
    id: z.string().cuid(),
    createdAt: z.string().datetime({ offset: true }),
    subject: z.string().trim().min(1),
  }),

  archive: z.object({ id: z.string().cuid() }),
};
