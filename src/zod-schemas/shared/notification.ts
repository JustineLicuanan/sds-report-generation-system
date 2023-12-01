import { NotificationType } from '@prisma/client';
import { z } from 'zod';

export const notificationSchemas = {
  get: z
    .object({
      type: z.nativeEnum(NotificationType).optional(),
      isRead: z.boolean().optional(),
      includeOrganization: z.literal(true).optional(),
      includeUser: z.literal(true).optional(),
      includeAnnouncement: z.literal(true).optional(),
      includeReport: z.literal(true).optional(),
      includeComment: z.literal(true).optional(),
      isAsc: z.literal(true).optional(),
    })
    .optional(),

  read: z
    .object({ id: z.string().cuid().optional(), isRead: z.literal(false).optional() })
    .optional(),
};
