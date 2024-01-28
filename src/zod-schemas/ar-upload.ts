import { ARUploadContentType } from '@prisma/client';
import { z } from 'zod';

export enum MoveDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

const adminSchemas = {
  get: z
    .object({
      current: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          contentType: z.nativeEnum(ARUploadContentType).optional(),
          accomplishmentReportId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
          organizationId: z.string().cuid().optional(),
          userId: z.string().cuid().optional(),
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
          contentType: z.nativeEnum(ARUploadContentType).optional(),
          accomplishmentReportId: z.string().cuid().optional(),
          reportSemesterId: z.string().cuid().optional(),
        })
        .optional(),
      include: z
        .object({
          accomplishmentReport: z.literal(true).optional(),
          reportSemester: z.literal(true).optional(),
        })
        .optional(),
    })
    .optional(),

  create: z.object({
    contentType: z.nativeEnum(ARUploadContentType),
    contentNumber: z.coerce.number().int().min(1).max(150).optional(),
    title: z.string().trim().optional(),
    file: z.string().url('File is required'),
    fileId: z.string(),
  }),

  update: z.object({
    id: z.string().cuid(),
    title: z.string().trim().optional(),
    file: z.string().url('File is required').optional(),
    fileId: z.string().optional(),
  }),

  move: z.object({ id: z.string().cuid(), direction: z.nativeEnum(MoveDirection) }),

  delete: z.object({ id: z.string().cuid() }),
};

export const ARUploadSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
