import { router } from './trpc';
import { userRouter } from './routers/user';
import { leaderboardRouter } from './routers/leaderboard';
import { generatorRouter } from './routers/generator';

export const appRouter = router({
  user: userRouter,
  leaderboard: leaderboardRouter,
  generator: generatorRouter,
});

export type AppRouter = typeof appRouter;

