import { z } from 'zod';

export const userSchemas = {
  create: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
  }),

  update: z.object({
    id: z.string().cuid(),
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
  }),

  archive: z.object({ id: z.string().cuid() }),
};
