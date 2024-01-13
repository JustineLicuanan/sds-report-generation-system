import { z } from 'zod';

export const organizationSchemas = {
  get: z
    .object({
      includeMembers: z.literal(true).optional(),
      includeComments: z.literal(true).optional(),
      includeLogs: z.literal(true).optional(),

      // Extras
      include: z
        .object({
          curriculumVitaes: z.literal(true).optional(),
          appointments: z.literal(true).optional(),
          accomplishmentReports: z.literal(true).optional(),
          financialStatements: z.literal(true).optional(),
          FSMonthly: z.literal(true).optional(),
        })
        .optional(),

      // TODO: To remove
      includeReports: z.literal(true).optional(),
      includeNotifications: z.literal(true).optional(),
      includeAnnouncements: z.literal(true).optional(),
    })
    .optional(),

  update: z.object({
    description: z.string().trim().optional(),
    adviser1: z.string().trim().optional(),
    adviser2: z.string().trim().optional(),
    deptChairperson: z.string().trim().optional(),
    preamble: z.string().trim().optional(),
    mission: z.string().trim().optional(),
    vision: z.string().trim().optional(),
    goals: z.string().trim().optional(),
    chart: z.string().url().nullable().optional(),
    chartId: z.string().nullable().optional(),
    cbl: z.string().url().nullable().optional(),
    cblId: z.string().nullable().optional(),
  }),
};
