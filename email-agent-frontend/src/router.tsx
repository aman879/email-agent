import { indexRoute } from './routes/index';
import { campaignsRoute } from './routes/campaigns';
import { settingsRoute } from './routes/settings';
import { Route as rootRoute } from './routes/__root';
import { createRouter } from '@tanstack/react-router';

export const routeTree = rootRoute.addChildren([
  indexRoute,
  campaignsRoute,
  settingsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
