export interface SenderAccount {
  id: number;
  email: string;
  smtp_host: string;
  smtp_port: number;
  imap_host: string;
  imap_port: number;
  daily_limit: number;
  sent_count: number;
  is_active: boolean;
  last_used_at: string;
}

export interface AddSenderAccountRequest {
  email: string;
  smtp_host: string;
  smtp_port: number;
  imap_host: string;
  imap_port: number;
  password?: string;
}

export interface LinkSenderRequest {
  campaign_id: number;
  sender_id: number;
}
