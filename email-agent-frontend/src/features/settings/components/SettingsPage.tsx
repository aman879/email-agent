import { useState } from 'react';
import { Plus, Shield, Mail, Server, Loader2, X, Link as LinkIcon } from 'lucide-react';
import { useGetSenders, useAddSender, useLinkSender } from '../api/useSenders';
import { useGetCampaigns } from '../../campaigns/api/useCampaigns';

export function SettingsPage() {
  const { data: senders, isLoading: isSendersLoading } = useGetSenders();
  const { data: campaigns } = useGetCampaigns();
  const addSenderMutation = useAddSender();
  const linkSenderMutation = useLinkSender();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  
  const [newSender, setNewSender] = useState({
    email: '',
    smtp_host: '',
    smtp_port: 587,
    imap_host: '',
    imap_port: 993,
    password: '',
  });

  const [linkData, setLinkData] = useState({
    campaign_id: 0,
    sender_id: 0,
  });

  const handleAddSender = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSenderMutation.mutateAsync(newSender);
    setIsAddModalOpen(false);
    setNewSender({ email: '', smtp_host: '', smtp_port: 587, imap_host: '', imap_port: 993, password: '' });
  };

  const handleLinkSender = async (e: React.FormEvent) => {
    e.preventDefault();
    await linkSenderMutation.mutateAsync({
      campaign_id: linkData.campaign_id,
      sender_id: linkData.sender_id,
    });
    setIsLinkModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your sender accounts and campaign routing.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsLinkModalOpen(true)}
            className="border border-border bg-white/5 text-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/10 transition-all"
          >
            <LinkIcon className="w-4 h-4" />
            Link Account
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add Sender
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isSendersLoading ? (
          <div className="col-span-full flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          senders?.map((sender) => (
            <div key={sender.id} className="glass-card p-6 space-y-4 group hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  sender.is_active ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                }`}>
                  {sender.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg truncate" title={sender.email}>{sender.email}</h3>
                <p className="text-sm text-muted-foreground">Sent today: {sender.sent_count}/{sender.daily_limit}</p>
              </div>
              <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Server className="w-3 h-3" />
                  <span>{sender.smtp_host}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>SSL/TLS</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Sender Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border w-full max-w-lg rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Sender Account</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSender} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newSender.email}
                  onChange={(e) => setNewSender({ ...newSender, email: e.target.value })}
                  className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="sender@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SMTP Host</label>
                  <input 
                    type="text" 
                    required
                    value={newSender.smtp_host}
                    onChange={(e) => setNewSender({ ...newSender, smtp_host: e.target.value })}
                    className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SMTP Port</label>
                  <input 
                    type="number" 
                    required
                    value={newSender.smtp_port}
                    onChange={(e) => setNewSender({ ...newSender, smtp_port: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">IMAP Host</label>
                  <input 
                    type="text" 
                    required
                    value={newSender.imap_host}
                    onChange={(e) => setNewSender({ ...newSender, imap_host: e.target.value })}
                    className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="imap.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">IMAP Port</label>
                  <input 
                    type="number" 
                    required
                    value={newSender.imap_port}
                    onChange={(e) => setNewSender({ ...newSender, imap_port: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">App Password</label>
                <input 
                  type="password" 
                  required
                  value={newSender.password}
                  onChange={(e) => setNewSender({ ...newSender, password: e.target.value })}
                  className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <button 
                type="submit"
                disabled={addSenderMutation.isPending}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {addSenderMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Link Account Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border w-full max-w-md rounded-xl shadow-2xl p-6 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Link Account to Campaign</h2>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLinkSender} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Campaign</label>
                <select 
                  required
                  value={linkData.campaign_id}
                  onChange={(e) => setLinkData({ ...linkData, campaign_id: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 outline-none"
                >
                  <option value="">Choose a campaign...</option>
                  {campaigns?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Sender Account</label>
                <select 
                  required
                  value={linkData.sender_id}
                  onChange={(e) => setLinkData({ ...linkData, sender_id: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-border rounded-lg px-4 py-2 outline-none"
                >
                  <option value="">Choose an account...</option>
                  {senders?.map(s => (
                    <option key={s.id} value={s.id}>{s.email}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                disabled={linkSenderMutation.isPending}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {linkSenderMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Establish Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
