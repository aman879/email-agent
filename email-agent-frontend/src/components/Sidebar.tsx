import { LayoutDashboard, Send, Settings, User, Mail, BarChart2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Campaigns', icon: Send, to: '/campaigns' },
  { label: 'Analytics', icon: BarChart2, to: '/analytics' },
  { label: 'Settings', icon: Settings, to: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/[0.04] bg-[#000000] flex flex-col">
      <div className="p-6 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 font-semibold text-lg tracking-tight text-[#EDEDED]">
          <Mail className="w-5 h-5 text-[#888]" />
          <span>EmailAgent</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to as any}
            activeProps={{ className: 'bg-[#111111] text-[#EDEDED]' }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[#888] transition-colors hover:text-[#EDEDED] text-sm font-medium"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#111111] transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded bg-[#222] flex items-center justify-center text-[#888]">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-medium text-[#EDEDED] truncate">Admin User</p>
            <p className="text-[10px] text-[#666] truncate font-mono">admin@agent.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
