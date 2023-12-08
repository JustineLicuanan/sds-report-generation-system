import { z } from 'zod';
import { OrderBy } from '~/zod-schemas/shared/notification';

export const announcementSchemas = {
  create: z.object({
    subject: z.string().trim().min(1),
    description: z.string().trim().min(1),
    start: z.string().datetime({ offset: true }).nullable().optional(),
    due: z.string().datetime({ offset: true }).nullable().optional(),
    hasReport: z.boolean(),
    audience: z.object({ id: z.string().cuid() }).array(),
  }),

  get: z
    .object({
      id: z.string().cuid().optional(),
      hasReport: z.boolean().optional(),
      isArchived: z.literal(true).optional(),
      includeAudience: z.literal(true).optional(),
      includeComments: z.literal(true).optional(),
      includeReports: z.literal(true).optional(),
      includeAdminNotifications: z.literal(true).optional(),
      includeNotifications: z.literal(true).optional(),
      orderByDue: z.nativeEnum(OrderBy).optional(),
      orderByCreatedAt: z.nativeEnum(OrderBy).optional(),
    })
    .optional(),

  update: z.object({
    id: z.string().cuid(),
    subject: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    start: z.string().datetime({ offset: true }).nullable().optional(),
    due: z.string().datetime({ offset: true }).nullable().optional(),
    hasReport: z.boolean().optional(),
    audience: z.object({ id: z.string().cuid() }).array().optional(),
  }),

  markAsCompleted: z
    .object({ id: z.string().cuid().optional(), isCompleted: z.literal(false).optional() })
    .optional(),

  archive: z.object({ id: z.string().cuid() }),
};
