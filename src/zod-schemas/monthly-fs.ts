import { OutflowFSCategory } from '@prisma/client';
import { z } from 'zod';

import { inflowCollectionRowFSSchemas } from '~/zod-schemas/inflow-collection-row-fs';
import { inflowIgpRowFSSchemas } from '~/zod-schemas/inflow-igp-row-fs';
import { outflowRowFSSchemas } from '~/zod-schemas/outflow-row-fs';

import { OrderBy } from '~/zod-schemas/utils';

export enum Month {
  JANUARY = '1',
  FEBRUARY = '2',
  MARCH = '3',
  APRIL = '4',
  MAY = '5',
  JUNE = '6',
  JULY = '7',
  AUGUST = '8',
  SEPTEMBER = '9',
  OCTOBER = '10',
  NOVEMBER = '11',
  DECEMBER = '12',
}

export enum FlowType {
  INFLOW = 'INFLOW',
  OUTFLOW = 'OUTFLOW',
}

export enum InflowCategory {
  COLLECTION = 'COLLECTION',
  IGP = 'IGP',
}

const adminSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          month: z.number().int().min(1).max(12).optional(),
          year: z.string().trim().optional(),
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
          year: z.string().trim().optional(),
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

  create: z.object({
    month: z.nativeEnum(Month).transform(Number).or(z.number()),
    year: z.string().trim().min(1, 'Year is required'),
  }),

  importFlows: z.object({
    monthlyId: z.string().cuid(),
    inflowCollections: inflowCollectionRowFSSchemas.shared.create
      .omit({
        receipt: true,
        receiptId: true,
        monthlyId: true,
        inflowCollectionId: true,
      })
      .array(),
    inflowIGPs: inflowIgpRowFSSchemas.shared.create
      .omit({
        receipt: true,
        receiptId: true,
        monthlyId: true,
        inflowIGPId: true,
      })
      .array(),
    outflows: outflowRowFSSchemas.shared.create
      .omit({
        receipt: true,
        receiptId: true,
        monthlyId: true,
        outflowId: true,
      })
      .extend({ category: z.nativeEnum(OutflowFSCategory) })
      .array(),
  }),

  update: z.object({
    id: z.string().cuid(),
    month: z.nativeEnum(Month).transform(Number).or(z.number()).optional(),
    year: z.string().trim().min(1, 'Year is required').optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const MonthlyFSSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
