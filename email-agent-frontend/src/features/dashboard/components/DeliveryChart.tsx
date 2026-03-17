import { Activity } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

interface DeliveryChartProps {
  chartData?: Array<{ date: string; count: number }>;
}

export function DeliveryChart({ chartData }: DeliveryChartProps) {
  const max = chartData && chartData.length > 0 ? Math.max(...chartData.map((d) => d.count), 1) : 1;

  return (
    <Card className="lg:col-span-2 !p-0 flex flex-col h-full" hoverable={false}>
      <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#666]" />
          <h3 className="font-medium text-sm text-[#EDEDED]">Delivery Volume</h3>
        </div>
        <select className="bg-transparent border-none text-xs text-[#888] cursor-pointer focus:outline-none hover:text-[#EDEDED] transition-colors">
          <option value="7" className="bg-[#0A0A0A]">Last 7 Days</option>
          <option value="30" className="bg-[#0A0A0A]">Last 30 Days</option>
        </select>
      </div>
      
      <div className="flex-1 flex items-end justify-between gap-1 p-6 h-[320px]">
        {(!chartData || chartData.length === 0) ? (
          <div className="w-full h-full flex items-center justify-center text-[#444] text-xs font-mono">
            No delivery data yet
          </div>
        ) : (
          chartData.map((item, i) => {
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
    </Card>
  );
}
