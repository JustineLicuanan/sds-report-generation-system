import { LogAction, LogType, ReportCategory, ReportVisibility } from '@prisma/client';
import { z } from 'zod';

export const logSchemas = {
  get: z.object({
    type: z.nativeEnum(LogType),
    email: z.string().trim().toLowerCase().email().optional(),
    category: z.nativeEnum(ReportCategory).optional(),
    reportVisibility: z.nativeEnum(ReportVisibility).optional(),
    action: z.nativeEnum(LogAction).optional(),
    includeCreatedBy: z.literal(true).optional(),
    includeReport: z.literal(true).optional(),
    includeOrganization: z.literal(true).optional(),
  }),
};
