import { useState } from 'react';
import { Plug, CheckCircle2, XCircle, Key, Globe, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { notify } from '../../lib/toast';

const initialIntegrations = [
  { id: 'cloudinary', name: 'Cloudinary', desc: 'Image & media storage', connected: true, keyField: 'Upload Preset', defaultValue: 'luxora_unsigned' },
  { id: 'supabase', name: 'Supabase', desc: 'Database & authentication', connected: true, keyField: 'Project URL', defaultValue: 'https://skgjzxhcqkhouqqxlxtz.supabase.co' },
  { id: 'paystack', name: 'Paystack', desc: 'Card, bank transfer & mobile money payment processing', connected: true, keyField: 'Public Key', defaultValue: 'pk_live_luxora_paystack' },
  { id: 'booking', name: 'Booking.com', desc: 'Two-way channel manager inventory sync', connected: false, keyField: 'Hotel ID / API Token', defaultValue: '' },
  { id: 'expedia', name: 'Expedia', desc: 'OTA distribution & rate synchronization', connected: false, keyField: 'Partner API Key', defaultValue: '' },
  { id: 'mailgun', name: 'Mailgun', desc: 'Transactional email delivery & booking receipts', connected: false, keyField: 'API Secret Key', defaultValue: '' },
];

export default function Integrations() {
  const [list, setList] = useState(initialIntegrations);
  const [selected, setSelected] = useState(null);
  const [apiKey, setApiKey] = useState('');

  function openModal(item) {
    setSelected(item);
    setApiKey(item.defaultValue || '');
  }

  function handleSave() {
    if (!selected) return;
    setList((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? { ...item, connected: true, defaultValue: apiKey }
          : item
      )
    );
    notify.success(`${selected.name} credentials saved and connected!`);
    setSelected(null);
  }

  function handleDisconnect() {
    if (!selected) return;
    setList((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? { ...item, connected: false, defaultValue: '' }
          : item
      )
    );
    notify.info(`${selected.name} disconnected`);
    setSelected(null);
  }

  return (
    <div>
      <PageHeader title="Integrations" subtitle="Connect Luxora with third-party providers and payment channels." />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((i) => (
          <div key={i.id} className="card p-5 flex flex-col justify-between gap-4 hover:border-luxora-gold/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-luxora-gold/15 flex items-center justify-center text-luxora-gold"><Plug size={18} /></div>
                {i.connected ? (
                  <Badge color="green"><CheckCircle2 size={12} /> Connected</Badge>
                ) : (
                  <Badge color="gray"><XCircle size={12} /> Disconnected</Badge>
                )}
              </div>
              <p className="font-semibold text-luxora-text text-base">{i.name}</p>
              <p className="text-xs text-luxora-muted mt-1 leading-relaxed">{i.desc}</p>
            </div>
            <button
              onClick={() => openModal(i)}
              className={i.connected ? 'btn-outline w-full justify-center text-xs !py-2' : 'btn-primary w-full justify-center text-xs !py-2'}
            >
              {i.connected ? 'Manage Credentials' : 'Connect Integration'}
            </button>
          </div>
        ))}
      </div>

      {/* CONFIGURE MODAL */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Configure ${selected?.name}`}
        size="md"
        footer={
          <>
            {selected?.connected && (
              <button className="btn-ghost text-red-400 mr-auto" onClick={handleDisconnect}>
                Disconnect
              </button>
            )}
            <button className="btn-outline" onClick={() => setSelected(null)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save & Connect</button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="p-3 bg-white/5 border border-luxora-border rounded-xl text-xs text-luxora-muted flex items-start gap-2">
              <ShieldCheck size={16} className="text-luxora-gold shrink-0 mt-0.5" />
              <span>All integration keys and tokens are securely encrypted. Changes take effect across background webhooks immediately.</span>
            </div>
            <div>
              <label className="label">{selected.keyField || 'API Key / Secret Token'}</label>
              <div className="relative">
                <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
                <input
                  className="input pl-10"
                  placeholder={`Enter ${selected.keyField}...`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
