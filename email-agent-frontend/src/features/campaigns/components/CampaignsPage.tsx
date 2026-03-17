import { useState } from 'react';
import { Plus, Download, Filter, Loader2 } from 'lucide-react';
import { useGetCampaigns, useCreateCampaign, useUploadCSV, useAddWorkFlowStep } from '../api/useCampaigns';
import { useGetSenders, useLinkSender } from '../../settings/api/useSenders';
import { Button } from '../../../components/ui/Button';
import { CampaignTable } from './CampaignTable';
import { CreateCampaignModal } from './CreateCampaignModal';
import { AddStepModal } from './AddStepModal';
import { AssignSenderModal } from './AssignSenderModal';

export function CampaignsPage() {
  const { data: campaigns, isLoading } = useGetCampaigns();
  const { data: senders } = useGetSenders();
  const createCampaignMutation = useCreateCampaign();
  const uploadCSVMutation = useUploadCSV();
  const addStepMutation = useAddWorkFlowStep();
  const linkSenderMutation = useLinkSender();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [initialStepOrder, setInitialStepOrder] = useState(1);

  const handleCreateCampaign = async (name: string) => {
    await createCampaignMutation.mutateAsync({ name });
    setIsCreateModalOpen(false);
  };

  const handleFileUpload = async (campaignId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadCSVMutation.mutateAsync({ campaignId, file });
    alert('Leads uploaded successfully!');
  };

  const handleAddStep = async (data: any) => {
    await addStepMutation.mutateAsync(data);
    setIsAddStepModalOpen(false);
  };

  const openAddStepModal = (campaignId: number, nextOrder: number) => {
    setSelectedCampaignId(campaignId);
    setInitialStepOrder(nextOrder);
    setIsAddStepModalOpen(true);
  };

  const handleAssignSender = async (senderId: number) => {
    if (!selectedCampaignId) return;
    await linkSenderMutation.mutateAsync({ campaign_id: selectedCampaignId, sender_id: senderId });
    setIsAssignModalOpen(false);
  };

  const openAssignModal = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-[#EDEDED]">Campaigns</h1>
          <p className="text-sm text-[#888] mt-1.5 font-light">Manage and monitor your automated email sequences.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#666]" />
          <input 
            type="text" 
            placeholder="Filter campaigns..." 
            className="w-full bg-white/5 border border-white/[0.06] rounded-lg pl-10 pr-4 py-2 text-sm text-[#EDEDED] focus:outline-none focus:border-white/[0.12]"
          />
        </div>
        <Button variant="secondary" size="sm" className="p-2">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <CampaignTable 
          campaigns={campaigns} 
          onUploadLeads={handleFileUpload}
          onAddStep={openAddStepModal}
          onAssignSender={openAssignModal}
        />
      )}

      {/* Modals */}
      <CreateCampaignModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
        isLoading={createCampaignMutation.isPending}
      />

      <AddStepModal 
        isOpen={isAddStepModalOpen}
        onClose={() => setIsAddStepModalOpen(false)}
        onSubmit={handleAddStep}
        isLoading={addStepMutation.isPending}
        campaignId={selectedCampaignId}
        initialStepOrder={initialStepOrder}
      />

      <AssignSenderModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSender}
        isLoading={linkSenderMutation.isPending}
        senders={senders}
      />
    </div>
  );
}

