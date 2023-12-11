import { z } from 'zod';

export const organizationSchemas = {
  get: z
    .object({
      includeMembers: z.literal(true).optional(),
      includeReports: z.literal(true).optional(),
      includeComments: z.literal(true).optional(),
      includeNotifications: z.literal(true).optional(),
      includeLogs: z.literal(true).optional(),
      includeAnnouncements: z.literal(true).optional(),
    })
    .optional(),

  uploadCbl: z.object({ cbl: z.string().url(), cblId: z.string() }),
};
