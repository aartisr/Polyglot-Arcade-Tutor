import { createRouter } from '@tanstack/react-router';
import { RootRoute } from './routes/__root';
import { IndexRoute } from './routes/index';
import { TutorRoute } from './routes/tutor.$lessonId';

const routeTree = RootRoute.addChildren([IndexRoute, TutorRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
