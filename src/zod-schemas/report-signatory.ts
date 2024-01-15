import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      where: z
        .object({ id: z.string().cuid().optional(), position: z.string().trim().optional() })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  update: z.object({
    signatories: z
      .object({
        position: z.string().trim().min(1, 'Position is required'),
        name: z.string().trim(),
      })
      .array(),
  }),
};

const sharedSchemas = {
  get: z
    .object({
      where: z
        .object({ id: z.string().cuid().optional(), position: z.string().trim().optional() })
        .optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),
};

export const reportSignatorySchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
