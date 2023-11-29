import { OrganizationCategory } from '@prisma/client';
import { z } from 'zod';

export const orgSchemas = {
  create: z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional(),
    category: z.nativeEnum(OrganizationCategory),
    image: z.string().url().nullable().optional(),
    imageId: z.string().nullable().optional(),
    members: z
      .object({
        where: z.object({ email: z.string().trim().toLowerCase().email() }),
        create: z.object({
          name: z.string().trim().min(1),
          email: z.string().trim().toLowerCase().email(),
        }),
      })
      .array(),
  }),

  get: z
    .object({
      id: z.string().cuid().optional(),
      category: z.nativeEnum(OrganizationCategory).optional(),
      isArchived: z.literal(true).optional(),
      includeMembers: z.literal(true).optional(),
      includeReports: z.literal(true).optional(),
      includeComments: z.literal(true).optional(),
      includeNotifications: z.literal(true).optional(),
      includeLogs: z.literal(true).optional(),
      includeAnnouncements: z.literal(true).optional(),
    })
    .optional(),

  // FIXME:
  update: z.object({
    id: z.string().cuid(),
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    category: z.nativeEnum(OrganizationCategory).optional(),
    image: z.string().url().nullable().optional(),
    imageId: z.string().nullable().optional(),
    members: z
      .object({
        where: z.object({ id: z.string().cuid().default('undefined') }),
        update: z.object({
          name: z.string().trim().min(1),
          email: z.string().trim().toLowerCase().email(),
        }),
        create: z.object({
          name: z.string().trim().min(1),
          email: z.string().trim().toLowerCase().email(),
        }),
      })
      .array()
      .optional(),
  }),

  archive: z.object({ id: z.string().cuid() }),
};
