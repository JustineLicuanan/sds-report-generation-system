import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      where: z
        .object({
          id: z.string().cuid().optional(),
          monthlyId: z.string().cuid().optional(),
          inflowCollectionId: z.string().cuid().optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          inflowCollection: z.literal(true).optional(),
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
          inflowCollectionId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          inflowCollection: z.literal(true).optional(),
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
    name: z.string().trim().min(1, 'Name is required'),
    ORNumber: z.string().trim().min(1, 'OR Number is required'),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .transform((arg) => parseFloat(arg).toFixed(2))
      .or(z.number()),
    receipt: z.string().nullable().optional(),
    receiptId: z.string().nullable().optional(),
    monthlyId: z.string().cuid(),
    inflowCollectionId: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    date: z
      .string()
      .min(1, 'Date is required')
      .transform((arg) => new Date(arg).toISOString())
      .optional(),
    name: z.string().trim().min(1, 'Name is required').optional(),
    ORNumber: z.string().trim().min(1, 'OR Number is required').optional(),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .transform((arg) => parseFloat(arg).toFixed(2))
      .or(z.number())
      .optional(),
    receipt: z.string().nullable().optional(),
    receiptId: z.string().nullable().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const inflowCollectionRowFSSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
