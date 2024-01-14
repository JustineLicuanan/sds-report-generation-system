import { ARUploadContentType } from '@prisma/client';
import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {};

const sharedSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          contentType: z.nativeEnum(ARUploadContentType).optional(),
          accomplishmentReportId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          accomplishmentReport: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
          organization: z.literal(true).optional(),
          user: z.literal(true).optional(),
        })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    contentType: z.nativeEnum(ARUploadContentType),
    contentNumber: z
      .string()
      .min(1, 'Content Number is required')
      .transform((arg) => parseInt(arg))
      .or(z.number()),
    file: z.string().url('File is required'),
    fileId: z.string(),
  }),

  update: z.object({
    id: z.string().cuid(),
    contentType: z.nativeEnum(ARUploadContentType).optional(),
    contentNumber: z
      .string()
      .min(1, 'Content Number is required')
      .transform((arg) => parseInt(arg))
      .or(z.number())
      .optional(),
    file: z.string().url('File is required').optional(),
    fileId: z.string().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const ARUploadSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
