import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { SenderAccount, AddSenderAccountRequest, LinkSenderRequest } from '../types';

export const useGetSenders = () => {
  return useQuery({
    queryKey: ['senders'],
    queryFn: async () => {
      const response = await apiClient.get<SenderAccount[]>('/senders');
      return response.data;
    },
  });
};

export const useAddSender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddSenderAccountRequest) => {
      const response = await apiClient.post<SenderAccount>('/senders', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['senders'] });
    },
  });
};

export const useLinkSender = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LinkSenderRequest) => {
      const response = await apiClient.post('/senders/link', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['senders'] });
    },
  });
};
