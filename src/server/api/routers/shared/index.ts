import { reportRouter } from '~/server/api/routers/shared/report';
import { createTRPCRouter } from '~/server/api/trpc';

export const sharedRouter = createTRPCRouter({ report: reportRouter });
