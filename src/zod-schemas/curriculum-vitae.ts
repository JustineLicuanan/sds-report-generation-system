import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

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
    content: z.any(),
  }),

  update: z.object({
    id: z.string().cuid(),
    name: z.string().trim().min(1, 'Name is required').optional(),
    position: z.string().trim().min(1, 'Position is required').optional(),
    content: z.any().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const curriculumVitaeSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
