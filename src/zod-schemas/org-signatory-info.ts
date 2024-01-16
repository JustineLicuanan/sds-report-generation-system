import { z } from 'zod';

import { OrderBy } from '~/zod-schemas/utils';

const adminSchemas = {
  get: z
    .object({
      where: z
        .object({ id: z.string().cuid().optional(), organizationId: z.string().cuid().optional() })
        .optional(),
      include: z.object({ organization: z.literal(true).optional() }).optional(),
      orderBy: z.object({ createdAt: z.nativeEnum(OrderBy).optional() }).optional(),
    })
    .optional(),

  update: z.object({
    organizationId: z.string().cuid(),
    president: z.string().trim().optional(),
    vicePresident: z.string().trim().optional(),
    treasurer: z.string().trim().optional(),
    auditor: z.string().trim().optional(),
    generalSecretary: z.string().trim().optional(),
    assistantSecretary: z.string().trim().optional(),
    finance: z.string().trim().optional(),
    recruitmentCoordinator: z.string().trim().optional(),
    trainingDirector: z.string().trim().optional(),
    adviser1: z.string().trim().optional(),
    adviser2: z.string().trim().optional(),
    deptChairperson: z.string().trim().optional(),
  }),
};

const sharedSchemas = {
  get: z
    .object({
      include: z.object({ organization: z.literal(true).optional() }).optional(),
    })
    .optional(),

  update: z.object({
    president: z.string().trim().optional(),
    vicePresident: z.string().trim().optional(),
    treasurer: z.string().trim().optional(),
    auditor: z.string().trim().optional(),
    generalSecretary: z.string().trim().optional(),
    assistantSecretary: z.string().trim().optional(),
    finance: z.string().trim().optional(),
    recruitmentCoordinator: z.string().trim().optional(),
    trainingDirector: z.string().trim().optional(),
    adviser1: z.string().trim().optional(),
    adviser2: z.string().trim().optional(),
    deptChairperson: z.string().trim().optional(),
  }),
};

export const orgSignatoryInfoSchemas = {
  admin: adminSchemas,
  shared: sharedSchemas,
};
