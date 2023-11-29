import { z } from 'zod';

export const sessionSchemas = {
  count: z
    .object({ id: z.string().cuid().optional(), organizationId: z.string().cuid().optional() })
    .optional(),

  deleteAll: z.object({ id: z.string().cuid() }),
};
