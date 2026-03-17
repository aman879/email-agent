import { useState } from 'react';
import { Plus, Loader2, Link as LinkIcon } from 'lucide-react';
import { useGetSenders, useAddSender, useLinkSender } from '../api/useSenders';
import { useGetCampaigns } from '../../campaigns/api/useCampaigns';
import { Button } from '../../../components/ui/Button';
import { SenderCard } from './SenderCard';
import { AddSenderModal } from './AddSenderModal';
import { LinkAccountModal } from './LinkAccountModal';

export function SettingsPage() {
  const { data: senders, isLoading: isSendersLoading } = useGetSenders();
  const { data: campaigns } = useGetCampaigns();
  const addSenderMutation = useAddSender();
  const linkSenderMutation = useLinkSender();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleAddSender = async (data: any) => {
    await addSenderMutation.mutateAsync(data);
    setIsAddModalOpen(false);
  };

  const handleLinkSender = async (campaignId: number, senderId: number) => {
    await linkSenderMutation.mutateAsync({
      campaign_id: campaignId,
      sender_id: senderId,
    });
    setIsLinkModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-[#EDEDED]">Settings</h1>
          <p className="text-sm text-[#888] mt-1.5 font-light">Configure your sender accounts and campaign routing.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            onClick={() => setIsLinkModalOpen(true)}
            className="gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            Link Account
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Sender
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isSendersLoading ? (
          <div className="col-span-full flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          senders?.map((sender) => (
            <SenderCard key={sender.id} sender={sender} />
          ))
        )}
      </div>

      {/* Modals */}
      <AddSenderModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSender}
        isLoading={addSenderMutation.isPending}
      />

      <LinkAccountModal 
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSubmit={handleLinkSender}
        isLoading={linkSenderMutation.isPending}
        campaigns={campaigns}
        senders={senders}
      />
    </div>
  );
}

