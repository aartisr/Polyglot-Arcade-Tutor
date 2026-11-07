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
      <RouterProvider router={router} />
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
