import { useState } from 'react';
import { Plus, Download, Filter, MoreHorizontal, Loader2, Upload, X } from 'lucide-react';
import { useGetCampaigns, useCreateCampaign, useUploadCSV, useAddWorkFlowStep } from '../api/useCampaigns';

export function CampaignsPage() {
  const { data: campaigns, isLoading } = useGetCampaigns();
  const createCampaignMutation = useCreateCampaign();
  const uploadCSVMutation = useUploadCSV();
  const addStepMutation = useAddWorkFlowStep();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [newCampaignName, setNewCampaignName] = useState('');
  
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [stepData, setStepData] = useState({
    action_type: 'SEND_EMAIL' as 'SEND_EMAIL' | 'WAIT',
    template: '',
    delay_hours: 0,
    step_order: 1,
  });

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;
    await createCampaignMutation.mutateAsync({ name: newCampaignName });
    setNewCampaignName('');
    setIsCreateModalOpen(false);
  };

  const handleFileUpload = async (campaignId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadCSVMutation.mutateAsync({ campaignId, file });
    alert('Leads uploaded successfully!');
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) return;
    await addStepMutation.mutateAsync({
      ...stepData,
      campaign_id: selectedCampaignId,
    });
    setIsAddStepModalOpen(false);
    setStepData({ action_type: 'SEND_EMAIL', template: '', delay_hours: 0, step_order: 1 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor your automated email sequences.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Filter by name or status..." 
            className="w-full bg-white/5 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="p-2 border border-border rounded-lg hover:bg-white/5 text-muted-foreground transition-all">
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-card overflow-hidden !p-0">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campaign Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steps</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Leads</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns?.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4">
                    <span className="font-medium group-hover:text-primary transition-colors cursor-pointer">{campaign.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.status === 'running' ? 'bg-emerald-400/10 text-emerald-400' :
                      campaign.status === 'paused' ? 'bg-amber-400/10 text-amber-400' :
                      campaign.status === 'completed' ? 'bg-blue-400/10 text-blue-400' :
                      'bg-slate-400/10 text-slate-400'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{campaign.steps?.length || 0} steps</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{campaign.leads?.length || 0} leads</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer text-muted-foreground hover:text-primary transition-colors" title="Upload Leads">
                        <Upload className="w-4 h-4" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".csv"
                          onChange={(e) => handleFileUpload(campaign.id, e)}
                        />
                      </label>
                      <button 
                        onClick={() => {
                          setSelectedCampaignId(campaign.id);
                          setIsAddStepModalOpen(true);
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors" 
                        title="Add Step"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border w-full max-w-md rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">New Campaign</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g., Tech Founders Outreach"
                />
              </div>
              <button 
                type="submit"
                disabled={createCampaignMutation.isPending}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {createCampaignMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Campaign
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Step Modal */}
      {isAddStepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border w-full max-w-lg rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Workflow Step</h2>
              <button onClick={() => setIsAddStepModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Action Type</label>
                  <select 
                    value={stepData.action_type}
                    onChange={(e) => setStepData({ ...stepData, action_type: e.target.value as any })}
                    className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="SEND_EMAIL">Send Email</option>
                    <option value="WAIT">Wait</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Step Order</label>
                  <input 
                    type="number" 
                    value={stepData.step_order}
                    onChange={(e) => setStepData({ ...stepData, step_order: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {stepData.action_type === 'SEND_EMAIL' ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Email Template</label>
                  <p className="text-xs text-muted-foreground mb-2">Use Subject: ... --- Body: ... format</p>
                  <textarea 
                    value={stepData.template}
                    onChange={(e) => setStepData({ ...stepData, template: e.target.value })}
                    className="w-full h-32 bg-white/5 border border-border rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none resize-none"
                    placeholder="Subject: Welcome {{first_name}} --- Body: ..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">Wait Duration (Hours)</label>
                  <input 
                    type="number" 
                    value={stepData.delay_hours}
                    onChange={(e) => setStepData({ ...stepData, delay_hours: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 outline-none"
                    placeholder="24"
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={addStepMutation.isPending}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {addStepMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Step
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
