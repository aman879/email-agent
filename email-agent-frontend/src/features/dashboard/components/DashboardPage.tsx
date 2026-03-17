import { Loader2 } from 'lucide-react';
import { useGetStats } from '../api/useStats';
import { Button } from '../../../components/ui/Button';
import { StatsGrid } from './StatsGrid';
import { DeliveryChart } from './DeliveryChart';
import { AuditLog } from './AuditLog';

export function DashboardPage() {
  const { data: statsData, isLoading } = useGetStats();

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
          <Button size="sm">New Campaign</Button>
          <Button variant="secondary" size="sm">Export Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid statsData={statsData} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DeliveryChart chartData={statsData?.chart_data} />
        <AuditLog logs={statsData?.recent_logs} />
      </div>
    </div>
  );
}

