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
          yearStart: z.string().trim().optional(),
          yearEnd: z.string().trim().optional(),
          term: z.nativeEnum(SemesterTerm).optional(),
        })
        .optional(),
      include: z
        .object({
          financialStatements: z.literal(true).optional(),
          monthlyFSs: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    yearStart: z.string().trim().min(1, 'Start of year is required'),
    yearEnd: z.string().trim().min(1, 'End of year is required'),
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
    yearStart: z.string().trim().min(1, 'Start of year is required').optional(),
    yearEnd: z.string().trim().min(1, 'End of year is required').optional(),
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
