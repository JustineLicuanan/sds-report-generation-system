import { ARGeneratedContentType } from '@prisma/client';
import { z } from 'zod';

import { jsonSchema } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      id: z.string().cuid().optional(),
      contentType: z.nativeEnum(ARGeneratedContentType).optional(),
    })
    .optional(),

  create: z.object({
    name: z.string().trim().optional(),
    description: z.string().trim().optional(),
    contentType: z.nativeEnum(ARGeneratedContentType),
    content: jsonSchema.transform((arg) => JSON.stringify(arg)),
  }),

  update: z.object({
    id: z.string().cuid(),
    name: z.string().trim().optional(),
    description: z.string().trim().optional(),
    contentType: z.nativeEnum(ARGeneratedContentType).optional(),
    content: jsonSchema.transform((arg) => JSON.stringify(arg)).optional(),
    isActive: z.boolean().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

const sharedSchemas = {
  get: z
    .object({
      id: z.string().cuid().optional(),
      contentType: z.nativeEnum(ARGeneratedContentType).optional(),
    })
    .optional(),
};

export const ARTemplateSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
