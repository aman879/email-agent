import { timeAgo } from '../../../lib/utils';
import { Card } from '../../../components/ui/Card';

interface AuditLogProps {
  logs?: Array<{
    id: number;
    type: string;
    message: string;
    created_at: string;
  }>;
}

export function AuditLog({ logs }: AuditLogProps) {
  return (
    <Card className="flex flex-col !p-0 h-full" hoverable={false}>
      <div className="p-5 border-b border-white/[0.04]">
        <h3 className="font-medium text-sm text-[#EDEDED]">Audit Log</h3>
      </div>
      <div className="p-5 space-y-6 flex-1 overflow-y-auto max-h-[400px]">
        {(!logs || logs.length === 0) ? (
          <div className="h-full flex items-center justify-center text-[#444] text-xs font-mono">
            No activity recorded
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={log.id} className="flex gap-4 group cursor-default">
              <div className="flex flex-col items-center">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  log.type === 'error' ? 'bg-red-500' : 
                  log.type === 'success' ? 'bg-emerald-500' : 
                  'bg-[#444]'
                } group-hover:scale-125 transition-transform mt-1.5`}></div>
                {i !== logs.length - 1 && <div className="w-[1px] h-full bg-white/[0.04] mt-2"></div>}
              </div>
              <div className="pb-1">
                <p className="text-[13px] text-[#A1A1AA] font-light leading-snug group-hover:text-[#EDEDED] transition-colors">
                  {log.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-[#666] font-mono">{timeAgo(log.created_at)}</span>
                  <span className="text-[9px] text-[#444] font-mono border border-white/[0.04] px-1 rounded">evt_{log.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 border-t border-white/[0.04]">
        <button className="w-full py-1.5 text-xs text-[#888] hover:text-[#EDEDED] transition-colors font-medium">
          View complete log &rarr;
        </button>
      </div>
    </Card>
  );
}
