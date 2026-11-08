import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const RootRoute = createRootRoute({
  component: () => (
    <div className="app-shell flex flex-col w-full min-w-0 overflow-hidden bg-slate-950 text-slate-100 antialiased font-sans">
      <Outlet />
    </div>
  ),
});
