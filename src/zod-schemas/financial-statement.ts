import { SemReportStatus } from '@prisma/client';
import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          status: z.nativeEnum(SemReportStatus).optional(),
          reportSemesterId: z.string().cuid().optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
          organization: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  updateStatus: z.object({ id: z.string().cuid(), status: z.nativeEnum(SemReportStatus) }),
};

const sharedSchemas = {
  get: z
    .object({
      where: z
        .object({
          id: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          monthly: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  getOrCreate: z
    .object({
      include: z
        .object({
          monthly: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
        })
        .optional(),
    })
    .optional(),

  update: z.object({
    actualCash: z
      .string()
      .min(1, 'Amount is required')
      .transform((arg) => parseFloat(arg).toFixed(2))
      .or(z.number())
      .optional(),
    compiled: z.string().url('File is required').nullable().optional(),
    compiledId: z.string().nullable().optional(),
  }),
};

export const financialStatementSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
