import { exampleRouter } from '~/server/api/routers/example';
import { orgRouter } from '~/server/api/routers/org';
import { createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  org: orgRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
