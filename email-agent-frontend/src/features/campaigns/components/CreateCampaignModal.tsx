import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  isLoading: boolean;
}

export function CreateCampaignModal({ isOpen, onClose, onSubmit, isLoading }: CreateCampaignModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit(name);
    setName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Campaign">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#888] mb-1.5">Campaign Name</label>
          <input 
            type="text" 
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2.5 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none placeholder:text-white/20"
            placeholder="e.g., Tech Founders Outreach"
          />
        </div>
        <Button 
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Create Campaign
        </Button>
      </form>
    </Modal>
  );
}
