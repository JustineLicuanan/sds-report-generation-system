import { z } from 'zod';

export const userSchemas = {
  create: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
    organization: z.object({ id: z.string().cuid(), name: z.string().trim().min(1) }),
  }),

  update: z.object({
    id: z.string().cuid(),
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
  }),

  countSessions: z.object({ id: z.string().cuid() }),

  clearAllSessions: z.object({ id: z.string().cuid() }),

  archive: z.object({ id: z.string().cuid() }),
};
