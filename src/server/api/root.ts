import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { taskRouter } from "./routers/task";
import { userRouter } from "./routers/user";
import { clientRouter } from "./routers/client";
import { contractRouter } from "./routers/contract";
import { financesRouter } from "./routers/finances";
import { invoicesRouter } from "./routers/invoices";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  task: taskRouter,
  user: userRouter,
  clients: clientRouter,
  contract: contractRouter,
  finances: financesRouter,
  invoice: invoicesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
