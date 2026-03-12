import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { SettingsPage } from '@/features/settings/components/SettingsPage';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});
