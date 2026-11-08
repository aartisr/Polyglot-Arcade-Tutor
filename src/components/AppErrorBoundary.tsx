import React from 'react';

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App render failed:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-950 p-6 text-center text-slate-100">
        <h1 className="text-xl font-semibold">This screen could not load</h1>
        <p className="max-w-md text-sm text-slate-400">Your progress is still in this session. Try reloading, or return home.</p>
        {import.meta.env.DEV && (
          <pre className="max-w-full overflow-auto rounded-lg bg-slate-900 p-3 text-left text-xs text-rose-300">{this.state.error.message}</pre>
        )}
        <div className="flex gap-3">
          <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">Reload</button>
          <a href="/" className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200">Home</a>
        </div>
      </main>
    );
  }
}
