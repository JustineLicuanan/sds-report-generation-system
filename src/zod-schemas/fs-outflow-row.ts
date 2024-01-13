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
          outflowId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          outflow: z.literal(true).optional(),
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
          outflowId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          outflow: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ date: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    date: z.string().datetime({ offset: true }),
    quantity: z.number().int(),
    particulars: z.string().min(1).trim(),
    unit: z.string().min(1).trim(),
    price: z.number(),
    receipt: z.string().nullable().optional(),
    receiptId: z.string().nullable().optional(),
    outflowId: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    date: z.string().datetime({ offset: true }).optional(),
    quantity: z.number().int().optional(),
    particulars: z.string().min(1).trim().optional(),
    unit: z.string().min(1).trim().optional(),
    price: z.number().optional(),
    receipt: z.string().nullable().optional(),
    receiptId: z.string().nullable().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const FSOutflowRowSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
