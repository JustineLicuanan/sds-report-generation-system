import { z } from 'zod';

import { OrderBy, jsonSchema } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      where: z
        .object({ id: z.string().cuid().optional(), organizationId: z.string().cuid().optional() })
        .optional(),
      include: z.object({ organization: z.literal(true).optional() }).optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),
};

const sharedSchemas = {
  get: z
    .object({
      where: z.object({ id: z.string().cuid().optional() }).optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    position: z.string().trim().min(1, 'Position is required'),
    content: jsonSchema.transform((arg) => JSON.stringify(arg)),
  }),

  update: z.object({
    id: z.string().cuid(),
    name: z.string().trim().min(1, 'Name is required').optional(),
    position: z.string().trim().min(1, 'Position is required').optional(),
    content: jsonSchema.transform((arg) => JSON.stringify(arg)).optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const curriculumVitaeSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
