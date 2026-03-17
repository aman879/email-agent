import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { type AddSenderAccountRequest } from '../types';

interface AddSenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddSenderAccountRequest) => Promise<void>;
  isLoading: boolean;
}

export function AddSenderModal({ isOpen, onClose, onSubmit, isLoading }: AddSenderModalProps) {
  const [data, setData] = useState({
    email: '',
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    imap_host: '',
    imap_port: 993,
    imap_user: '',
    imap_password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(data);
    setData({ 
      email: '', 
      smtp_host: '', 
      smtp_port: 587, 
      smtp_user: '',
      smtp_password: '',
      imap_host: '', 
      imap_port: 993, 
      imap_user: '',
      imap_password: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Sender Account">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div>
          <label className="block text-sm font-medium text-[#888] mb-1.5">Email Address</label>
          <input 
            type="email" 
            required
            value={data.email}
            onChange={(e) => {
              const val = e.target.value;
              setData({ 
                ...data, 
                email: val,
                smtp_user: data.smtp_user || val,
                imap_user: data.imap_user || val
              });
            }}
            className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none"
            placeholder="sender@example.com"
          />
        </div>

        <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/[0.04]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary/70">SMTP Settings (Outgoing)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1.5">Host</label>
              <input 
                type="text" 
                required
                value={data.smtp_host}
                onChange={(e) => setData({ ...data, smtp_host: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1.5">Port</label>
              <input 
                type="number" 
                required
                value={data.smtp_port}
                onChange={(e) => setData({ ...data, smtp_port: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1.5">Login User</label>
              <input 
                type="text" 
                required
                value={data.smtp_user}
                onChange={(e) => setData({ ...data, smtp_user: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1.5">Password</label>
              <input 
                type="password" 
                required
                value={data.smtp_password}
                onChange={(e) => setData({ ...data, smtp_password: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/[0.04]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary/70">IMAP Settings (Incoming)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1.5">Host</label>
              <input 
                type="text" 
                required
                value={data.imap_host}
                onChange={(e) => setData({ ...data, imap_host: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="imap.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1.5">Port</label>
              <input 
                type="number" 
                required
                value={data.imap_port}
                onChange={(e) => setData({ ...data, imap_port: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1.5">Login User</label>
              <input 
                type="text" 
                required
                value={data.imap_user}
                onChange={(e) => setData({ ...data, imap_user: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#888] mb-1.5">Password</label>
              <input 
                type="password" 
                required
                value={data.imap_password}
                onChange={(e) => setData({ ...data, imap_password: e.target.value })}
                className="w-full bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2 text-[#EDEDED] focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>
        </div>
        <Button 
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Save Account
        </Button>
      </form>
    </Modal>
  );
}
