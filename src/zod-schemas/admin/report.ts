import { ReportCategory, ReportStatus, ReportVisibility } from '@prisma/client';
import { z } from 'zod';

export const reportSchemas = {
  get: z
    .object({
      id: z.string().cuid().optional(),
      category: z.nativeEnum(ReportCategory).optional(),
      visibility: z.nativeEnum(ReportVisibility).optional(),
      hasSchedule: z.boolean().optional(),
      status: z.nativeEnum(ReportStatus).optional(),
      isArchived: z.literal(true).optional(),
      includeComments: z.literal(true).optional(),
      includeAdminNotifications: z.literal(true).optional(),
      includeNotifications: z.literal(true).optional(),
      includeLogs: z.literal(true).optional(),
      includeAnnouncement: z.literal(true).optional(),
      includeOrganization: z.literal(true).optional(),
      includeCreatedBy: z.literal(true).optional(),
    })
    .optional(),

  update: z.object({
    id: z.string().cuid(),
    category: z.nativeEnum(ReportCategory).optional(),
    hasSchedule: z.boolean().optional(),
    due: z.string().datetime({ offset: true }).nullable().optional(),
    status: z.nativeEnum(ReportStatus).optional(),
    announcementId: z.string().cuid().nullable().optional(),
  }),

  updateStatus: z.object({
    id: z.string().cuid(),
    due: z.string().datetime({ offset: true }).nullable().optional(),
    status: z.nativeEnum(ReportStatus),
  }),
};
