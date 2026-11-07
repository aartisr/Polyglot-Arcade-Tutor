import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const RootRoute = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 antialiased font-sans">
      <Outlet />
    </div>
  ),
});
