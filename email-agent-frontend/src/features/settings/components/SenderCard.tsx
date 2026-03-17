import { Mail, Server, Shield, Trash2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { type SenderAccount } from '../types';

interface SenderCardProps {
  sender: SenderAccount;
  onDelete?: (id: number) => void;
}

export function SenderCard({ sender, onDelete }: SenderCardProps) {
  return (
    <Card className="p-6 space-y-4 group hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start justify-between">
          <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          {onDelete && (
            <button 
              onClick={() => onDelete(sender.id)}
              className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              title="Delete Account"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          sender.is_active ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
        }`}>
          {sender.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-lg truncate text-[#EDEDED]" title={sender.email}>{sender.email}</h3>
        <p className="text-sm text-[#888]">Sent today: {sender.sent_count}/{sender.daily_limit}</p>
      </div>
      <div className="pt-4 border-t border-white/[0.04] grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-xs text-[#666]">
          <Server className="w-3 h-3" />
          <span className="truncate">{sender.smtp_host}:{sender.smtp_port}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#666]">
          <Shield className="w-3 h-3" />
          <span>SSL/TLS</span>
        </div>
      </div>
    </Card>
  );
}
