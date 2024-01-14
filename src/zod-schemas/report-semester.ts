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
          // ARUploads: z.literal(true).optional(),
          // ARGenerated: z.literal(true).optional(),
          financialStatements: z.literal(true).optional(),
          FSMonthly: z.literal(true).optional(),
          // FSInflows: z.literal(true).optional(),
          FSInflowRows: z.literal(true).optional(),
          // FSOutflows: z.literal(true).optional(),
          FSOutflowRows: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    yearStart: z
      .string()
      .min(1, 'Start of year is required')
      .transform((arg) => parseInt(arg)),
    yearEnd: z
      .string()
      .min(1, 'End of year is required')
      .transform((arg) => parseInt(arg)),
    term: z.nativeEnum(SemesterTerm),
    dueDateAR: z
      .string()
      .transform((arg) => (arg.length <= 0 ? undefined : new Date(arg).toISOString()))
      .nullable()
      .optional(),
    dueDateFS: z
      .string()
      .transform((arg) => (arg.length <= 0 ? undefined : new Date(arg).toISOString()))
      .nullable()
      .optional(),
  }),

  update: z.object({
    id: z.string().cuid().optional(),
    yearStart: z
      .string()
      .min(1, 'Start of year is required')
      .transform((arg) => parseInt(arg))
      .optional(),
    yearEnd: z
      .string()
      .min(1, 'End of year is required')
      .transform((arg) => parseInt(arg))
      .optional(),
    term: z.nativeEnum(SemesterTerm).optional(),
    dueDateAR: z
      .string()
      .transform((arg) => (arg.length <= 0 ? undefined : new Date(arg).toISOString()))
      .nullable()
      .optional(),
    dueDateFS: z
      .string()
      .transform((arg) => (arg.length <= 0 ? undefined : new Date(arg).toISOString()))
      .nullable()
      .optional(),
  }),

  unarchive: z.object({ id: z.string().cuid() }),
};

// const sharedSchemas = {};

export const reportSemesterSchemas = {
  admin: adminSchemas,
  // shared: sharedSchemas,
};
