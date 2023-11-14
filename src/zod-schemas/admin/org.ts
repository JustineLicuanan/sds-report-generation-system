import { UserCategory } from '@prisma/client';
import { z } from 'zod';

export const orgSchemas = {
  signIn: z.object({ email: z.string().trim().toLowerCase().email() }),

  create: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
    image: z.string().url().nullable().optional(),
    imageId: z.string().nullable().optional(),
    description: z.string().trim().optional(),
    category: z.nativeEnum(UserCategory),
  }),

  get: z
    .object({ id: z.string().cuid().optional(), withReports: z.literal(true).optional() })
    .optional(),

  update: z.object({
    id: z.string().cuid(),
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    image: z.string().url().nullable().optional(),
    imageId: z.string().nullable().optional(),
    description: z.string().trim().optional(),
    category: z.nativeEnum(UserCategory).optional(),
  }),

  countSessions: z.object({ id: z.string().cuid() }),

  clearAllSessions: z.object({ id: z.string().cuid() }),

  archive: z.object({ id: z.string().cuid() }),
};
