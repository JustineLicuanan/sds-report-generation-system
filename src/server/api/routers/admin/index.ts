import { orgRouter } from '~/server/api/routers/admin/org';
import { createTRPCRouter } from '~/server/api/trpc';

export const adminRouter = createTRPCRouter({ org: orgRouter });
