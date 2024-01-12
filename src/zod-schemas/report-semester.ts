import { SemesterTerm } from '@prisma/client';
import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          yearStart: z.number().int().optional(),
          yearEnd: z.number().int().optional(),
          term: z.nativeEnum(SemesterTerm).optional(),
        })
        .optional(),
      include: z
        .object({
          accomplishmentReports: z.literal(true).optional(),
          ARUploads: z.literal(true).optional(),
          ARGenerated: z.literal(true).optional(),
          financialStatements: z.literal(true).optional(),
          FSMonthly: z.literal(true).optional(),
          FSInflows: z.literal(true).optional(),
          FSInflowRows: z.literal(true).optional(),
          FSOutflows: z.literal(true).optional(),
          FSOutflowRows: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    yearStart: z.number().int(),
    yearEnd: z.number().int(),
    term: z.nativeEnum(SemesterTerm),
    dueDateAR: z.string().datetime({ offset: true }).nullable().optional(),
    dueDateFS: z.string().datetime({ offset: true }).nullable().optional(),
  }),

  update: z.object({
    id: z.string().cuid().optional(),
    yearStart: z.number().int().optional(),
    yearEnd: z.number().int().optional(),
    term: z.nativeEnum(SemesterTerm).optional(),
    dueDateAR: z.string().datetime({ offset: true }).nullable().optional(),
    dueDateFS: z.string().datetime({ offset: true }).nullable().optional(),
  }),

  unarchive: z.object({ id: z.string().cuid() }),
};

// const sharedSchemas = {};

export const reportSemesterSchemas = {
  admin: adminSchemas,
  // shared: sharedSchemas,
};
