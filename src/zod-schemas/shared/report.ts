import { ReportCategory, ReportStatus, ReportVisibility } from '@prisma/client';
import { z } from 'zod';

export const reportSchemas = {
  create: z.object({
    subject: z.string().trim().min(1),
    description: z.string().trim().min(1),
    category: z.nativeEnum(ReportCategory),
    visibility: z.nativeEnum(ReportVisibility),
    file: z.string().url().nullable().optional(),
    fileId: z.string().nullable().optional(),
    hasSchedule: z.boolean(),
    announcementId: z.string().cuid().nullable().optional(),
  }),

  get: z
    .object({
      id: z.string().cuid().optional(),
      category: z.nativeEnum(ReportCategory).optional(),
      hasSchedule: z.boolean().optional(),
      status: z.nativeEnum(ReportStatus).optional(),
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
    subject: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    category: z.nativeEnum(ReportCategory).optional(),
    visibility: z.nativeEnum(ReportVisibility).optional(),
    file: z.string().url().nullable().optional(),
    fileId: z.string().nullable().optional(),
    hasSchedule: z.boolean().optional(),
    announcementId: z.string().cuid().nullable().optional(),
  }),

  cancel: z.object({
    id: z.string().cuid(),
    subject: z.string().trim().min(1),
    category: z.nativeEnum(ReportCategory),
  }),

  archive: z.object({
    id: z.string().cuid(),
    subject: z.string().trim().min(1),
    category: z.nativeEnum(ReportCategory),
  }),
};
