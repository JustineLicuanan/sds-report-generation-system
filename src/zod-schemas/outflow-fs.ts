import { OutflowFSCategory } from '@prisma/client';
import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      where: z
        .object({
          id: z.string().cuid().optional(),
          monthlyId: z.string().cuid().optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          rows: z.literal(true).optional(),
          monthly: z.literal(true).optional(),
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
      where: z
        .object({
          id: z.string().cuid().optional(),
          monthlyId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          rows: z.literal(true).optional(),
          monthly: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ date: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    category: z.nativeEnum(OutflowFSCategory),
    date: z
      .string()
      .min(1, 'Date is required')
      .transform((arg) => new Date(arg).toISOString()),
    description: z.string().trim().optional(),
    monthlyId: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    category: z.nativeEnum(OutflowFSCategory).optional(),
    date: z
      .string()
      .min(1, 'Date is required')
      .transform((arg) => new Date(arg).toISOString())
      .optional(),
    description: z.string().trim().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const outflowFSSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
