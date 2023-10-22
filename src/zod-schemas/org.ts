import { UserCategory } from '@prisma/client';
import { z } from 'zod';

export const createOrgSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().toLowerCase().email(),
  image: z.string().trim(),
  description: z.string().trim().optional(),
  category: z.nativeEnum(UserCategory),
});

export const getOrgSchema = z.object({
  id: z.string().cuid().optional(),
  all: z.boolean().optional(),
});

export const updateOrgSchema = z.object({
  id: z.string().cuid(),
  name: z.string().trim().optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  image: z.string().trim().optional(),
  description: z.string().trim().optional(),
  category: z.nativeEnum(UserCategory).optional(),
});

export const archiveOrgSchema = z.object({ id: z.string().cuid() });
