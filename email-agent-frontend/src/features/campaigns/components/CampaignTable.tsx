import { Upload, Plus, MoreHorizontal, UserPlus } from 'lucide-react';
import { type Campaign } from '../types';

interface CampaignTableProps {
  campaigns?: Campaign[];
  onUploadLeads: (campaignId: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddStep: (campaignId: number, nextOrder: number) => void;
  onAssignSender: (campaignId: number) => void;
}

export function CampaignTable({ campaigns, onUploadLeads, onAddStep, onAssignSender }: CampaignTableProps) {
  return (
    <div className="glass-card overflow-hidden !p-0 border border-white/[0.06] bg-[#050505] rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.04] bg-white/[0.02]">
            <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Campaign Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Steps</th>
            <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Leads</th>
            <th className="px-6 py-4 text-xs font-semibold text-[#888] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {campaigns?.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-white/[0.01] transition-all group">
              <td className="px-6 py-4">
                <span className="font-medium text-[#EDEDED] group-hover:text-primary transition-colors cursor-pointer">{campaign.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  campaign.status === 'running' ? 'bg-emerald-400/10 text-emerald-400' :
                  campaign.status === 'paused' ? 'bg-amber-400/10 text-amber-400' :
                  campaign.status === 'completed' ? 'bg-blue-400/10 text-blue-400' :
                  'bg-white/10 text-[#888]'
                }`}>
                  {campaign.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-[#888]">{campaign.steps?.length || 0} steps</td>
              <td className="px-6 py-4 text-sm text-[#888]">{campaign.leads?.length || 0} leads</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer text-[#666] hover:text-[#EDEDED] transition-colors" title="Upload Leads">
                    <Upload className="w-4 h-4" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".csv"
                      onChange={(e) => onUploadLeads(campaign.id, e)}
                    />
                  </label>
                  <button 
                    onClick={() => onAddStep(campaign.id, (campaign.steps?.length || 0) + 1)}
                    className="text-[#666] hover:text-[#EDEDED] transition-colors" 
                    title="Add Step"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onAssignSender(campaign.id)}
                    className="text-[#666] hover:text-[#EDEDED] transition-colors" 
                    title="Assign Sender"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button className="text-[#666] hover:text-foreground transition-colors p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
