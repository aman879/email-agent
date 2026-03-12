import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { Campaign, CreateCampaignRequest, AddWorkFlowStepRequest } from '../types';

export const useGetCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await apiClient.get<Campaign[]>('/campaigns');
      return response.data;
    },
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCampaignRequest) => {
      const response = await apiClient.post<Campaign>('/campaigns', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useAddWorkFlowStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddWorkFlowStepRequest) => {
      const response = await apiClient.post('/campaigns/steps', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useUploadCSV = () => {
  return useMutation({
    mutationFn: async ({ campaignId, file }: { campaignId: number; file: File }) => {
      const formData = new FormData();
      formData.append('campaign_id', campaignId.toString());
      formData.append('file', file);
      const response = await apiClient.post('/campaigns/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};
