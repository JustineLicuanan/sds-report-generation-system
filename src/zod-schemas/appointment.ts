import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      where: z
        .object({
          id: z.string().cuid().optional(),
          isCompleted: z.boolean().optional(),
          organizationId: z.string().cuid().optional(),
        })
        .optional(),
      include: z.object({ organization: z.literal(true).optional() }).optional(),
      orderBy: z.object({ due: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  create: z.object({
    due: z
      .string()
      .min(1, 'Date & Time is required')
      .transform((arg) => new Date(arg).toISOString()),
    message: z.string().trim().optional(),
    organizationId: z.string().cuid(),
  }),

  update: z.object({
    id: z.string().cuid(),
    due: z
      .string()
      .min(1, 'Date & Time is required')
      .transform((arg) => new Date(arg).toISOString())
      .optional(),
    message: z.string().trim().optional(),
    organizationId: z.string().cuid().optional(),
  }),

  delete: z.object({ id: z.string().cuid() }),
};

// const sharedSchemas = {};

export const appointmentSchemas = {
  admin: adminSchemas,
  // shared: sharedSchemas,
};
