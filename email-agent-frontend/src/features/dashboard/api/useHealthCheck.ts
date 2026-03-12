import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await apiClient.get('/health');
      return data;
    },
    refetchInterval: 30000, // Every 30 seconds
  });
};
