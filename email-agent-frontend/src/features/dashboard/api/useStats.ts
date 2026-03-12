import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface DashboardStats {
  total_leads: number;
  total_sent: number;
  total_replied: number;
  conversion_rate: string;
  chart_data: { date: string; count: number }[];
  recent_logs: { id: number; type: string; message: string; created_at: string }[];
}

export const useGetStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await apiClient.get<DashboardStats>('/stats');
      return response.data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });
};
