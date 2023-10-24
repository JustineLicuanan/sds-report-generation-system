import { UserCategory } from '@prisma/client';
import { z } from 'zod';

export const orgSchemas = {
  signIn: z.object({ email: z.string().trim().toLowerCase().email() }),

  create: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
    image: z.string().url(),
    description: z.string().trim().optional(),
    category: z.nativeEnum(UserCategory),
  }),

  get: z.object({ id: z.string().cuid().optional() }),

  update: z.object({
    id: z.string().cuid(),
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    image: z.string().url().optional(),
    description: z.string().trim().optional(),
    category: z.nativeEnum(UserCategory).optional(),
  }),

  archive: z.object({ id: z.string().cuid() }),
};
