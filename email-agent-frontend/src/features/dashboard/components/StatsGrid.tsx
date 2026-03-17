import { Users, Send, CheckCircle, BarChart3 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

interface StatsGridProps {
  statsData?: {
    total_leads: number;
    total_sent: number;
    total_replied: number;
    conversion_rate: string;
  };
}

export function StatsGrid({ statsData }: StatsGridProps) {
  const stats = [
    { label: 'Total Leads', value: statsData?.total_leads.toLocaleString() || '0', icon: Users },
    { label: 'Emails Sent', value: statsData?.total_sent.toLocaleString() || '0', icon: Send },
    { label: 'Replies', value: statsData?.total_replied.toLocaleString() || '0', icon: CheckCircle },
    { label: 'Conversion Rate', value: statsData?.conversion_rate || '0%', icon: BarChart3 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <stat.icon className="w-3.5 h-3.5 text-[#666] group-hover:text-[#EDEDED] transition-colors" />
              <p className="text-xs font-medium text-[#888]">{stat.label}</p>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-medium tracking-tight text-[#EDEDED] font-mono">{stat.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
