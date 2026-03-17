import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { type SenderAccount } from '../../settings/types';

interface AssignSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (senderId: number) => Promise<void>;
  isLoading: boolean;
  senders?: SenderAccount[];
}

export function AssignSenderModal({ isOpen, onClose, onSubmit, isLoading, senders }: AssignSenderModalProps) {
  const [selectedSenderId, setSelectedSenderId] = useState<number | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSenderId === '') return;
    await onSubmit(selectedSenderId);
    setSelectedSenderId('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Sender Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#888] mb-1.5">Select Account</label>
          <select 
            value={selectedSenderId}
            onChange={(e) => setSelectedSenderId(parseInt(e.target.value))}
            required
            className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="" className="bg-[#0A0A0A]">Select a sender...</option>
            {senders?.map((sender) => (
              <option key={sender.id} value={sender.id} className="bg-[#0A0A0A]">
                {sender.email} ({sender.smtp_host})
              </option>
            ))}
          </select>
        </div>
        <Button 
          type="submit"
          isLoading={isLoading}
          disabled={selectedSenderId === ''}
          className="w-full"
        >
          Assign to Campaign
        </Button>
      </form>
    </Modal>
  );
}
