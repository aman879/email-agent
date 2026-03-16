import { BarChart3, Users, Send, CheckCircle, Activity, Loader2 } from 'lucide-react';
import { useGetStats } from '../api/useStats';

function timeAgo(dateParam: string | Date) {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function DashboardPage() {
  const { data: statsData, isLoading } = useGetStats();

  const stats = [
    { label: 'Total Leads', value: statsData?.total_leads.toLocaleString() || '0', icon: Users },
    { label: 'Emails Sent', value: statsData?.total_sent.toLocaleString() || '0', icon: Send },
    { label: 'Replies', value: statsData?.total_replied.toLocaleString() || '0', icon: CheckCircle },
    { label: 'Conversion Rate', value: statsData?.conversion_rate || '0%', icon: BarChart3 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-[#EDEDED]">Overview</h1>
          <p className="text-sm text-[#888] mt-1.5 font-light">Monitor automation performance and engagement metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-8 px-3 text-xs font-medium bg-[#EDEDED] text-black rounded transition-transform hover:scale-[1.02]">
            New Campaign
          </button>
          <button className="h-8 px-3 text-xs font-medium bg-[#0A0A0A] text-[#EDEDED] border border-white/[0.08] rounded hover:bg-white/[0.02] transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col justify-between p-5 rounded-lg border border-white/[0.06] bg-[#050505] hover:border-white/[0.12] transition-colors group relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <stat.icon className="w-3.5 h-3.5 text-[#666] group-hover:text-[#EDEDED] transition-colors" />
                <p className="text-xs font-medium text-[#888]">{stat.label}</p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-medium tracking-tight text-[#EDEDED] font-mono">{stat.value}</h3>
            </div>
            {/* Subtle bottom highlight on hover */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart Area */}
        <div className="lg:col-span-2 rounded-lg border border-white/[0.06] bg-[#050505] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#666]" />
              <h3 className="font-medium text-sm text-[#EDEDED]">Delivery Volume</h3>
            </div>
            <select className="bg-transparent border-none text-xs text-[#888] cursor-pointer focus:outline-none hover:text-[#EDEDED] transition-colors">
              <option className="bg-[#0A0A0A]">Last 7 Days</option>
              <option className="bg-[#0A0A0A]">Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-1 p-6 h-[320px]">
            {(!statsData?.chart_data || statsData.chart_data.length === 0) ? (
              <div className="w-full h-full flex items-center justify-center text-[#444] text-xs font-mono">
                No delivery data yet
              </div>
            ) : (
              statsData?.chart_data.map((item, i) => {
                const max = Math.max(...statsData.chart_data.map((d) => d.count), 1);
                const height = (item.count / max) * 100;
                return (
                  <div 
                    key={i} 
                    className="w-full bg-[#222] hover:bg-[#EDEDED] transition-colors cursor-crosshair relative group rounded-sm"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/[0.1] px-2 py-1 rounded text-[10px] font-mono text-[#EDEDED] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                      {item.count} msg - {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-lg border border-white/[0.06] bg-[#050505] flex flex-col">
          <div className="p-5 border-b border-white/[0.04]">
            <h3 className="font-medium text-sm text-[#EDEDED]">Audit Log</h3>
          </div>
          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            {(!statsData?.recent_logs || statsData.recent_logs.length === 0) ? (
              <div className="h-full flex items-center justify-center text-[#444] text-xs font-mono">
                No activity recorded
              </div>
            ) : (
              statsData?.recent_logs.map((log, i) => (
                <div key={log.id} className="flex gap-4 group cursor-default">
                  <div className="flex flex-col items-center">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      log.type === 'error' ? 'bg-red-500' : 
                      log.type === 'success' ? 'bg-emerald-500' : 
                      'bg-[#444]'
                    } group-hover:scale-125 transition-transform mt-1.5`}></div>
                    {i !== statsData.recent_logs.length - 1 && <div className="w-[1px] h-full bg-white/[0.04] mt-2"></div>}
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
        </div>
      </div>
    </div>
  );
}
