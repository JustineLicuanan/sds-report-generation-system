import { adminRouter } from '~/server/api/routers/admin';
// import { appRouter as rawRouter } from '~/server/api/routers/raw/routers';
import { sharedRouter } from '~/server/api/routers/shared';
import { createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  shared: sharedRouter,
  // raw: rawRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
