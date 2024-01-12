import { ARUploadContentType } from '@prisma/client';
import { z } from 'zod';

import { OrderBy } from '~/zod-schemas';

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
    contentNumber: z.number().int(),
    file: z.string().url(),
    fileId: z.string(),
  }),

  update: z.object({
    id: z.string().cuid(),
    contentType: z.nativeEnum(ARUploadContentType).optional(),
    contentNumber: z.number().int().optional(),
    file: z.string().url().optional(),
    fileId: z.string().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const ARUploadSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
