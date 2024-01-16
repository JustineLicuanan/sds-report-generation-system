import { GeneratedARTemplate } from '@prisma/client';
import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

// const adminSchemas = {};

const sharedSchemas = {
  get: z
    .object({
      archived: z.literal(true).optional(),
      where: z
        .object({
          id: z.string().cuid().optional(),
          template: z.nativeEnum(GeneratedARTemplate).optional(),
        })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({ template: z.nativeEnum(GeneratedARTemplate), content: z.any() }),

  update: z.object({
    id: z.string().cuid(),
    template: z.nativeEnum(GeneratedARTemplate).optional(),
    content: z.any().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

export const generatedARSchemas = {
  // admin: adminSchemas,
  shared: sharedSchemas,
};
