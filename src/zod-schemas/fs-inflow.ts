import { FSInflowCategory } from '@prisma/client';
import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          category: z.nativeEnum(FSInflowCategory).optional(),
          monthlyId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          rows: z.literal(true).optional(),
          monthly: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
          organization: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ date: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),
};

const sharedSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          category: z.nativeEnum(FSInflowCategory).optional(),
          monthlyId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          rows: z.literal(true).optional(),
          monthly: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ date: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    category: z.nativeEnum(FSInflowCategory),
    date: z
      .string()
      .min(1, 'Date is required')
      .transform((arg) => new Date(arg).toISOString()),
    description: z.string().trim().optional(),
    monthlyId: z.string().cuid(),
    reportSemesterId: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    category: z.nativeEnum(FSInflowCategory).optional(),
    date: z
      .string()
      .min(1, 'Date is required')
      .transform((arg) => new Date(arg).toISOString())
      .optional(),
    description: z.string().trim().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const FSInflowSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
