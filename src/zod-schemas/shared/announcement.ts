import { z } from 'zod';

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
    })
    .optional(),
};
