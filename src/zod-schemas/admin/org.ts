import { OrganizationCategory } from '@prisma/client';
import { z } from 'zod';

export const orgSchemas = {
  create: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    acronym: z.string().trim().min(1, 'Acronym is required'),
    description: z.string().trim().optional(),
    adviser1: z.string().trim().optional(),
    adviser2: z.string().trim().optional(),
    deptChairperson: z.string().trim().optional(),
    category: z.nativeEnum(OrganizationCategory),
    image: z.string().url().nullable().optional(),
    imageId: z.string().nullable().optional(),
    members: z
      .object({
        name: z.string().trim().min(1, 'Position is required'),
        email: z.string().trim().toLowerCase().email(),
        isActive: z.boolean().optional(),
      })
      .array()
      .refine(
        (arg) => {
          const names = arg.map(({ name }) => name);
          return new Set(names).size === names.length;
        },
        {
          message: 'Duplicate Positions found.',
        }
      ),

    // Extras
    preamble: z.string().trim().optional(),
    mission: z.string().trim().optional(),
    vision: z.string().trim().optional(),
    goals: z.string().trim().optional(),
    chart: z.string().url().nullable().optional(),
    chartId: z.string().nullable().optional(),
    cbl: z.string().url().nullable().optional(),
    cblId: z.string().nullable().optional(),
  }),

  get: z
    .object({
      id: z.string().cuid().optional(),
      category: z.nativeEnum(OrganizationCategory).optional(),
      isArchived: z.literal(true).optional(),
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
    id: z.string().cuid(),
    name: z.string().trim().min(1, 'Name is required').optional(),
    acronym: z.string().trim().min(1, 'Acronym is required').optional(),
    description: z.string().trim().optional(),
    adviser1: z.string().trim().optional(),
    adviser2: z.string().trim().optional(),
    deptChairperson: z.string().trim().optional(),
    category: z.nativeEnum(OrganizationCategory).optional(),
    image: z.string().url().nullable().optional(),
    imageId: z.string().nullable().optional(),

    // Extras
    preamble: z.string().trim().optional(),
    mission: z.string().trim().optional(),
    vision: z.string().trim().optional(),
    goals: z.string().trim().optional(),
    chart: z.string().url().nullable().optional(),
    chartId: z.string().nullable().optional(),
    cbl: z.string().url().nullable().optional(),
    cblId: z.string().nullable().optional(),
  }),

  archive: z.object({ id: z.string().cuid() }),
};
