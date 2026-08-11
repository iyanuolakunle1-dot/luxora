import { useState } from 'react';
import { Mail, Pencil } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { notify } from '../../lib/toast';

const templates = [
  { name: 'Booking Confirmation', trigger: 'On new reservation', status: 'active' },
  { name: 'Check-in Reminder', trigger: '24h before check-in', status: 'active' },
  { name: 'Post-stay Review Request', trigger: 'On check-out', status: 'active' },
  { name: 'Cancellation Notice', trigger: 'On booking cancelled', status: 'inactive' },
];

export default function EmailTemplates() {
  const [editing, setEditing] = useState(null);
  return (
    <div>
      <PageHeader title="Email Templates" subtitle="Manage the automated emails sent to your guests." />
      <div className="card p-5">
        <div className="table-wrap">
          <table className="table-base">
            <thead><tr><th>Template</th><th>Trigger</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.name}>
                  <td className="flex items-center gap-2 text-luxora-text font-medium"><Mail size={14} className="text-luxora-gold" />{t.name}</td>
                  <td className="text-luxora-muted">{t.trigger}</td>
                  <td><Badge color={t.status === 'active' ? 'green' : 'gray'}>{t.status}</Badge></td>
                  <td><button onClick={() => setEditing(t)} className="btn-ghost !px-2"><Pencil size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.name} size="lg"
        footer={<button className="btn-primary" onClick={() => { notify.success('Template saved'); setEditing(null); }}>Save Template</button>}>
        <label className="label">Subject</label>
        <input className="input mb-4" defaultValue={`Your ${editing?.name}`} />
        <label className="label">Body</label>
        <textarea rows={8} className="input" defaultValue={`Hi {{guest_name}},\n\nThis is your ${editing?.name} email from Luxora Hotels & Resorts.`} />
      </Modal>
    </div>
  );
}
