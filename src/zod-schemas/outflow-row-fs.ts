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
          outflowId: z.string().cuid().optional(),
          category: z.nativeEnum(OutflowFSCategory).optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          outflow: z.literal(true).optional(),
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
          outflowId: z.string().cuid().optional(),
          category: z.nativeEnum(OutflowFSCategory).optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          outflow: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ date: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    date: z
      .string()
      .min(1, 'Date is required')
      .transform((arg) => new Date(arg).toISOString()),
    quantity: z
      .string()
      .min(1, 'Quantity is required')
      .transform((arg) => parseInt(arg))
      .or(z.number()),
    particulars: z.string().trim().min(1, 'Particulars is required'),
    unit: z.string().trim().min(1, 'Unit is required'),
    price: z
      .string()
      .min(1, 'Price is required')
      .transform((arg) => parseFloat(arg).toFixed(2))
      .or(z.number()),
    receipt: z.string().nullable().optional(),
    receiptId: z.string().nullable().optional(),
    monthlyId: z.string().cuid(),
    outflowId: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    date: z
      .string()
      .min(1, 'Date is required')
      .transform((arg) => new Date(arg).toISOString())
      .optional(),
    quantity: z
      .string()
      .min(1, 'Quantity is required')
      .transform((arg) => parseInt(arg))
      .or(z.number())
      .optional(),
    particulars: z.string().trim().min(1, 'Particulars is required').optional(),
    unit: z.string().trim().min(1, 'Unit is required').optional(),
    price: z
      .string()
      .min(1, 'Price is required')
      .transform((arg) => parseFloat(arg).toFixed(2))
      .or(z.number())
      .optional(),
    receipt: z.string().nullable().optional(),
    receiptId: z.string().nullable().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const outflowRowFSSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
