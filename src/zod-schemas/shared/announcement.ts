import { z } from 'zod';
import { OrderBy } from '~/zod-schemas/shared/notification';

export const announcementSchemas = {
  get: z
    .object({
      id: z.string().cuid().optional(),
      hasReport: z.boolean().optional(),
      includeAudience: z.literal(true).optional(),
      includeComments: z.literal(true).optional(),
      includeReports: z.literal(true).optional(),
      includeAdminNotifications: z.literal(true).optional(),
      includeNotifications: z.literal(true).optional(),
      orderByDue: z.nativeEnum(OrderBy).optional(),
      orderByCreatedAt: z.nativeEnum(OrderBy).optional(),
    })
    .optional(),
};
