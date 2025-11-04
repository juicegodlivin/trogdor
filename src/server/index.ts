import { router } from './trpc';
import { userRouter } from './routers/user';
import { leaderboardRouter } from './routers/leaderboard';
import { generatorRouter } from './routers/generator';
import { statsRouter } from './routers/stats';

export const appRouter = router({
  user: userRouter,
  leaderboard: leaderboardRouter,
  generator: generatorRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;

