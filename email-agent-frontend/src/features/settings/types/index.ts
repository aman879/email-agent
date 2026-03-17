export interface SenderAccount {
  id: number;
  email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  imap_host: string;
  imap_port: number;
  imap_user: string;
  daily_limit: number;
  sent_count: number;
  is_active: boolean;
  last_used_at: string;
}

export interface AddSenderAccountRequest {
  email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password?: string;
  imap_host: string;
  imap_port: number;
  imap_user: string;
  imap_password?: string;
}

export interface LinkSenderRequest {
  campaign_id: number;
  sender_id: number;
}
