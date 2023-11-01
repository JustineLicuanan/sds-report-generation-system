import { adminRouter } from '~/server/api/routers/admin';
import { exampleRouter } from '~/server/api/routers/example';
import { sharedRouter } from '~/server/api/routers/shared';
import { createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  admin: adminRouter,
  shared: sharedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
