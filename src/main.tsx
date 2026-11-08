import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { workspaceStore } from './store/workspaceStore';
import './index.css';

const reloadStateKey = 'polyglot-arcade-pwa-reload';

try {
  const savedState = sessionStorage.getItem(reloadStateKey);
  if (savedState) {
    sessionStorage.removeItem(reloadStateKey);
    const restored = JSON.parse(savedState);
    if (restored && typeof restored === 'object') {
      workspaceStore.setState((current) => ({ ...current, ...restored, isRunning: false }));
    }
  }
} catch (error) {
  console.warn('Could not restore workspace after update:', error);
}

// Development should always serve current source, including on phones that
// previously visited while the dev PWA service worker was enabled.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    const hadController = Boolean(navigator.serviceWorker.controller);
    await Promise.all(registrations.map((registration) => registration.unregister()));
    if (hadController) window.location.reload();
  }).catch((error) => console.warn('Could not clear development service worker:', error));
}

if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedReload: () => {
      try {
        sessionStorage.setItem(reloadStateKey, JSON.stringify({ ...workspaceStore.state, isRunning: false }));
      } catch (error) {
        console.warn('Could not save workspace before update:', error);
      }
      window.location.reload();
    },
  });
}

createRoot(document.getElementById('root')!).render(<AppErrorBoundary><App /></AppErrorBoundary>);
