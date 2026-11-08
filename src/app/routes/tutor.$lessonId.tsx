import { createRoute, lazyRouteComponent, Link } from '@tanstack/react-router';
import { RootRoute } from './__root';

export const TutorRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/tutor/$lessonId',
  validateSearch: (search: Record<string, unknown>): { game?: string } => ({
    game: typeof search.game === 'string' ? search.game : undefined,
  }),
  component: lazyRouteComponent(() => import('./TutorScreen'), 'TutorComponent'),
  pendingMs: 0,
  pendingMinMs: 200,
  pendingComponent: () => (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-sm text-cyan-300">
      <span>Opening lesson…</span>
      <Link to="/" className="underline underline-offset-4">Home</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-sm text-slate-200">
      <p>The lesson could not open. Check your connection and try again.</p>
      <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950">
        Reload lesson
      </button>
      <Link to="/" className="text-cyan-300 underline underline-offset-4">Home</Link>
    </div>
  ),
});
