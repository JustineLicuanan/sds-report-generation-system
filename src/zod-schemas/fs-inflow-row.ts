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
          monthlyId: z.string().cuid().optional(),
          category: z.nativeEnum(FSInflowCategory).optional(),
          inflowId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          inflow: z.literal(true).optional(),
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
          monthlyId: z.string().cuid().optional(),
          category: z.nativeEnum(FSInflowCategory).optional(),
          inflowId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          inflow: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ date: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  createCollection: z.object({
    date: z
      .string()
      .min(1, 'Date is required')
      .transform((arg) => new Date(arg).toISOString()),
    name: z.string().trim().min(1, 'Name is required'),
    ORNumber: z.string().trim().min(1, 'OR Number is required'),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .transform((arg) => parseFloat(arg).toFixed(2)),
    receipt: z.string().nullable().optional(),
    receiptId: z.string().nullable().optional(),
    inflowId: z.string().cuid(),
  }),

  createIGP: z
    .object({
      date: z
        .string()
        .min(1, 'Date is required')
        .transform((arg) => new Date(arg).toISOString()),
      quantity: z
        .string()
        .min(1, 'Quantity is required')
        .transform((arg) => parseInt(arg)),
      particulars: z.string().trim().min(1, 'Particulars is required'),
      ORNumber: z.string().trim().min(1, 'OR Number is required'),
      unit: z.string().trim().min(1, 'Unit is required'),
      price: z
        .string()
        .min(1, 'Price is required')
        .transform((arg) => parseFloat(arg).toFixed(2)),
      receipt: z.string().nullable().optional(),
      receiptId: z.string().nullable().optional(),
      inflowId: z.string().cuid(),
    })
    .transform(({ particulars, ...arg }) => ({ ...arg, name: particulars })),

  updateCollection: z.object({
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
      .optional(),
    receipt: z.string().nullable().optional(),
    receiptId: z.string().nullable().optional(),
  }),

  updateIGP: z
    .object({
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
        .optional(),
      particulars: z.string().trim().min(1, 'Particulars is required').optional(),
      ORNumber: z.string().trim().min(1, 'OR Number is required').optional(),
      unit: z.string().trim().min(1, 'Unit is required').optional(),
      price: z
        .string()
        .min(1, 'Price is required')
        .transform((arg) => parseFloat(arg).toFixed(2))
        .optional(),
      receipt: z.string().nullable().optional(),
      receiptId: z.string().nullable().optional(),
    })
    .transform(({ particulars, ...arg }) => ({ ...arg, name: particulars })),

  delete: z.object({ id: z.string().cuid() }),
};

export const FSInflowRowSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
