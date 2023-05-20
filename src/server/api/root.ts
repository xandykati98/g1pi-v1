import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { funcionarioRouter } from "./routers/funcionario";
import { userRouter } from "./routers/user";
import { agendamentoRouter } from "./routers/agendamento";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  funcionario: funcionarioRouter,
  user: userRouter,
  agendamento: agendamentoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
