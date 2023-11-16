import { ReportCategory, ReportStatus } from '@prisma/client';
import { z } from 'zod';

export const reportSchemas = {
  get: z
    .object({
      id: z.string().cuid().optional(),
      withComments: z.literal(true).optional(),
      withAnnouncement: z.literal(true).optional(),
      withCreatedBy: z.literal(true).optional(),
    })
    .optional(),

  update: z.object({
    id: z.string().cuid(),
    category: z.nativeEnum(ReportCategory).optional(),
    withSchedule: z.boolean().optional(),
    schedule: z.string().datetime({ offset: true }).nullable().optional(),
    status: z.nativeEnum(ReportStatus).optional(),
    announcementId: z.string().cuid().nullable().optional(),
    logData: z
      .object({
        userId: z.string().cuid(),
        userName: z.string().trim(),
        createdAt: z.string().datetime({ offset: true }),
        subject: z.string().trim().min(1),
      })
      .optional(),
  }),

  updateStatus: z.object({
    id: z.string().cuid(),
    status: z.nativeEnum(ReportStatus),
    userId: z.string().cuid(),
    userName: z.string().trim(),
    createdAt: z.string().datetime({ offset: true }),
    subject: z.string().trim().min(1),
  }),
};
