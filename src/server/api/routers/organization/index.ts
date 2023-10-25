import { reportRouter } from '~/server/api/routers/organization/report';
import { createTRPCRouter } from '~/server/api/trpc';

export const organizationRouter = createTRPCRouter({ report: reportRouter });
