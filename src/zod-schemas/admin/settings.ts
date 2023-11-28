import { z } from 'zod';

export const settingsSchemas = {
  update: z.object({
    appIcon: z.string().url().nullable().optional(),
    appIconId: z.string().nullable().optional(),
    appName: z.string().trim().min(1).optional(),
    appDescription: z.string().trim().optional(),
  }),
};
