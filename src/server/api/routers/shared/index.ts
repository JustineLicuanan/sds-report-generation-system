import { logRouter } from '~/server/api/routers/shared/log';
import { reportRouter } from '~/server/api/routers/shared/report';
import { createTRPCRouter } from '~/server/api/trpc';

export const sharedRouter = createTRPCRouter({ report: reportRouter, log: logRouter });
