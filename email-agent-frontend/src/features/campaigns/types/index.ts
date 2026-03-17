export interface WorkFlowStep {
  id?: number;
  campaign_id?: number;
  step_order: number;
  action_type: 'SEND_EMAIL' | 'WAIT';
  delay_hours: number;
  template: string;
}

export interface Lead {
  id: number;
  campaign_id: number;
  email: string;
  data: string;
  current_step: number;
  status: 'pending' | 'sent' | 'replied' | 'failed';
  next_action_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  status: 'paused' | 'running' | 'completed' | 'draft';
  created_at: string;
  updated_at: string;
  steps: WorkFlowStep[];
  leads: Lead[];
}

export interface CreateCampaignRequest {
  name: string;
}

export interface AddWorkFlowStepRequest {
  campaign_id: number;
  step_order: number;
  action_type: 'SEND_EMAIL' | 'WAIT';
  delay_hours: number;
  template: string;
}

export interface LinkSenderRequest {
  campaign_id: number;
  sender_id: number;
}
