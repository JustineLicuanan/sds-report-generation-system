import { NotificationType } from '@prisma/client';
import { z } from 'zod';
import { OrderBy } from '~/zod-schemas/shared/notification';

export const adminNotificationSchemas = {
  get: z
    .object({
      type: z.nativeEnum(NotificationType).optional(),
      isRead: z.boolean().optional(),
      includeAnnouncement: z.literal(true).optional(),
      includeReport: z.literal(true).optional(),
      includeComment: z.literal(true).optional(),
      orderByCreatedAt: z.nativeEnum(OrderBy).optional(),
    })
    .optional(),

  read: z
    .object({ id: z.string().cuid().optional(), isRead: z.literal(false).optional() })
    .optional(),
};
