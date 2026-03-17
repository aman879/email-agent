import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { type SenderAccount } from '../types';
import { type Campaign } from '../../campaigns/types';

interface LinkAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignId: number, senderId: number) => Promise<void>;
  isLoading: boolean;
  campaigns?: Campaign[];
  senders?: SenderAccount[];
}

export function LinkAccountModal({ isOpen, onClose, onSubmit, isLoading, campaigns, senders }: LinkAccountModalProps) {
  const [data, setData] = useState({
    campaign_id: 0,
    sender_id: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(data.campaign_id, data.sender_id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link Account to Campaign">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#888] mb-1.5">Select Campaign</label>
          <select 
            required
            value={data.campaign_id}
            onChange={(e) => setData({ ...data, campaign_id: parseInt(e.target.value) })}
            className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] outline-none"
          >
            <option value="" className="bg-[#0A0A0A]">Choose a campaign...</option>
            {campaigns?.map(c => (
              <option key={c.id} value={c.id} className="bg-[#0A0A0A]">{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#888] mb-1.5">Select Sender Account</label>
          <select 
            required
            value={data.sender_id}
            onChange={(e) => setData({ ...data, sender_id: parseInt(e.target.value) })}
            className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] outline-none"
          >
            <option value="" className="bg-[#0A0A0A]">Choose an account...</option>
            {senders?.map(s => (
              <option key={s.id} value={s.id} className="bg-[#0A0A0A]">{s.email}</option>
            ))}
          </select>
        </div>
        <Button 
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Establish Link
        </Button>
      </form>
    </Modal>
  );
}
