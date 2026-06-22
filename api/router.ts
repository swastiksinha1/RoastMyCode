import { createRouter, publicQuery } from "./middleware";
import { roastRouter } from "./routers/roast";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  // RoastMyCode - Code roasting endpoint
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
