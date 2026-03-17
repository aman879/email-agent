import { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { type AddWorkFlowStepRequest } from '../types';

interface AddStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddWorkFlowStepRequest) => Promise<void>;
  isLoading: boolean;
  campaignId: number | null;
  initialStepOrder: number;
}

export function AddStepModal({ isOpen, onClose, onSubmit, isLoading, campaignId, initialStepOrder }: AddStepModalProps) {
  const [stepData, setStepData] = useState({
    action_type: 'SEND_EMAIL' as 'SEND_EMAIL' | 'WAIT',
    template: '',
    delay_hours: 0,
    step_order: initialStepOrder,
  });

  useEffect(() => {
    if (isOpen) {
      setStepData(prev => ({ ...prev, step_order: initialStepOrder }));
    }
  }, [isOpen, initialStepOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignId) return;
    await onSubmit({
      ...stepData,
      campaign_id: campaignId,
    });
    setStepData({ action_type: 'SEND_EMAIL', template: '', delay_hours: 0, step_order: 1 });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Workflow Step">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#888] mb-1.5">Action Type</label>
            <select 
              value={stepData.action_type}
              onChange={(e) => setStepData({ ...stepData, action_type: e.target.value as 'SEND_EMAIL' | 'WAIT' })}
              className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-[#EDEDED] outline-none"
            >
              <option value="SEND_EMAIL" className="bg-[#0A0A0A]">Send Email</option>
              <option value="WAIT" className="bg-[#0A0A0A]">Wait</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#888] mb-1.5">Step Order</label>
            <input 
              type="number" 
              value={stepData.step_order}
              onChange={(e) => setStepData({ ...stepData, step_order: parseInt(e.target.value) })}
              className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-[#EDEDED] outline-none"
            />
          </div>
        </div>

        {stepData.action_type === 'SEND_EMAIL' ? (
          <div>
            <label className="block text-sm font-medium text-[#888] mb-1.5">Email Template</label>
            <p className="text-[11px] text-[#666] mb-2 font-mono">Use Subject: ... --- Body: ... format</p>
            <textarea 
              value={stepData.template}
              onChange={(e) => setStepData({ ...stepData, template: e.target.value })}
              className="w-full h-32 bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none resize-none placeholder:text-white/10"
              placeholder="Subject: Welcome {{first_name}} --- Body: ..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-[#888] mb-1.5">Wait Duration (Hours)</label>
            <input 
              type="number" 
              value={stepData.delay_hours}
              onChange={(e) => setStepData({ ...stepData, delay_hours: parseInt(e.target.value) })}
              className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-[#EDEDED] outline-none"
              placeholder="24"
            />
          </div>
        )}

        <Button 
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Save Step
        </Button>
      </form>
    </Modal>
  );
}
