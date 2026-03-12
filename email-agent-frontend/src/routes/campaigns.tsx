import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { CampaignsPage } from '@/features/campaigns/components/CampaignsPage';

export const campaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/campaigns',
  component: CampaignsPage,
});
