import { z } from 'zod';

export const organizationSchemas = {
  get: z
    .object({
      include: z
        .object({
          curriculumVitaes: z.literal(true).optional(),
          generatedARs: z.literal(true).optional(),
          financialStatements: z.literal(true).optional(),
          monthlyFSs: z.literal(true).optional(),
          inflowCollectionFS: z.literal(true).optional(),
          inflowCollectionRowFS: z.literal(true).optional(),
          inflowIgpFS: z.literal(true).optional(),
          inflowIgpRowFS: z.literal(true).optional(),
          outflowFS: z.literal(true).optional(),
          outflowRowFS: z.literal(true).optional(),
        })
        .optional(),

      includeMembers: z.literal(true).optional(),
      includeReports: z.literal(true).optional(),
      includeComments: z.literal(true).optional(),
      includeNotifications: z.literal(true).optional(),
      includeLogs: z.literal(true).optional(),
      includeAnnouncements: z.literal(true).optional(),
    })
    .optional(),

  update: z.object({
    description: z.string().trim().optional(),
    preamble: z.string().trim().optional(),
    mission: z.string().trim().optional(),
    vision: z.string().trim().optional(),
    goals: z.string().trim().optional(),
    cbl: z.string().url().nullable().optional(),
    cblId: z.string().nullable().optional(),
  }),
};
