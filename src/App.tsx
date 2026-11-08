import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './app/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineIndicator />
      <React.Suspense fallback={
        <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-slate-100">
          <p className="text-sm font-semibold">Opening the arcade…</p>
          <a href="/" className="text-sm text-cyan-300 underline underline-offset-4">Home</a>
        </main>
      }>
        <RouterProvider router={router} />
      </React.Suspense>
    </QueryClientProvider>
  );
}

function OfflineIndicator() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  if (isOnline) return null;
  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-lg">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      Offline Mode — Persistence enabled.
    </div>
  );
}
