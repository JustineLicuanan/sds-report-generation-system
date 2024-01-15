import {
  ARGeneratedContentType,
  ARGeneratedTemplateType,
  GeneratedReportStatus,
} from '@prisma/client';
import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      where: z
        .object({
          id: z.string().cuid().optional(),
          contentType: z.nativeEnum(ARGeneratedContentType).optional(),
          organizationId: z.string().cuid().optional(),
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

  updateStatus: z.object({ id: z.string().cuid(), status: z.nativeEnum(GeneratedReportStatus) }),
};

const sharedSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          contentType: z.nativeEnum(ARGeneratedContentType).optional(),
          status: z.nativeEnum(GeneratedReportStatus).optional(),
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
    templateType: z.nativeEnum(ARGeneratedTemplateType),
    contentType: z.nativeEnum(ARGeneratedContentType),
    contentNumber: z
      .string()
      .min(1, 'Content Number is required')
      .transform((arg) => parseInt(arg))
      .or(z.number()),
    content: z.any(),
  }),

  update: z.object({
    id: z.string().cuid(),
    templateType: z.nativeEnum(ARGeneratedTemplateType).optional(),
    contentType: z.nativeEnum(ARGeneratedContentType).optional(),
    contentNumber: z
      .string()
      .min(1, 'Content Number is required')
      .transform((arg) => parseInt(arg))
      .or(z.number())
      .optional(),
    content: z.any().optional(),
  }),

  turnIn: z.object({ id: z.string().cuid() }),

  cancel: z.object({ id: z.string().cuid() }),

  delete: z.object({ id: z.string().cuid() }),
};

export const ARGeneratedSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
