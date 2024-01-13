import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          month: z.number().int().min(1).max(12).optional(),
          year: z.number().int().optional(),
          financialStatementId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          financialStatement: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
          organization: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z
        .object({ month: z.nativeEnum(OrderBy).optional(), year: z.nativeEnum(OrderBy).optional() })
        .optional(),
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
          month: z.number().int().min(1).max(12).optional(),
          year: z.number().int().optional(),
          financialStatementId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          financialStatement: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z
        .object({ month: z.nativeEnum(OrderBy).optional(), year: z.nativeEnum(OrderBy).optional() })
        .optional(),
    })
    .optional(),

  create: z.object({ month: z.number().int().min(1).max(12), year: z.number().int() }),

  update: z.object({
    id: z.string().cuid(),
    month: z.number().int().min(1).max(12).optional(),
    year: z.number().int().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const FSMonthlySchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
