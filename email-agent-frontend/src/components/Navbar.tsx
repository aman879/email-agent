import { Bell, Search } from 'lucide-react';
import { useHealthCheck } from '@/features/dashboard/api/useHealthCheck';

export function Navbar() {
  const { data: health, isLoading } = useHealthCheck();
  const isHealthy = health?.status === 'ok' || health?.status === 'healthy' || health?.status === 'online';

  return (
    <header className="h-16 border-b border-white/[0.04] bg-[#000000] flex items-center justify-between px-8">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
        <input 
          type="text" 
          placeholder="Search campaigns, leads..." 
          className="w-full bg-[#0A0A0A] border border-white/[0.04] rounded-md pl-9 pr-4 py-1.5 text-xs text-[#EDEDED] placeholder-[#666] focus:outline-none focus:border-white/[0.12] transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-[#666] hover:text-[#EDEDED] transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#EDEDED] rounded-full"></span>
        </button>
        <div className="h-4 w-px bg-white/[0.04]"></div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-mono text-[#666] uppercase tracking-wider mb-0.5">System Status</p>
            {isLoading ? (
              <p className="text-xs text-[#888] font-medium animate-pulse">Checking...</p>
            ) : (
              <p className={`text-xs font-medium ${isHealthy ? 'text-[#EDEDED]' : 'text-rose-400'}`}>
                {isHealthy ? 'Connected' : 'Disconnected'}
              </p>
            )}
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-[#EDEDED] shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'bg-rose-500'}`}></div>
        </div>
      </div>
    </header>
  );
}
