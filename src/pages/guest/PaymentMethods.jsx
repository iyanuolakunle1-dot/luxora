import { useEffect, useState } from 'react';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { notify } from '../../lib/toast';

const emptyForm = { brand: 'Visa', last4: '', exp_month: '', exp_year: '', is_default: false };

export default function GuestPaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  function load() {
    setLoading(true);
    api.get('/me/payment-methods').then(({ data }) => setMethods(data?.data || [])).catch(() => setMethods([])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleSave(e) {
    e.preventDefault();
    if (form.last4.length !== 4) return notify.error('Enter the last 4 digits of the card');
    setSaving(true);
    try {
      await api.post('/me/payment-methods', form);
      notify.success('Card added');
      setModalOpen(false); setForm(emptyForm); load();
    } catch (err) { notify.error(err?.response?.data?.error || 'Failed to add card'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await api.delete(`/me/payment-methods/${deleting.id}`); notify.success('Card removed'); setDeleting(null); load(); }
    catch (err) { notify.error(err?.response?.data?.error || 'Failed to remove'); }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-luxora-text">Payment Methods</h1><p className="text-sm text-luxora-muted mt-1">Manage the cards on file for faster checkout.</p></div>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={16} /> Add Card</button>
      </div>

      <p className="text-xs text-luxora-muted mb-5 bg-white/5 border border-luxora-border rounded-xl p-3">
        For your security, we only ever store the card brand and last 4 digits here — full card numbers are handled by your payment processor (e.g. Paystack), never stored in this app.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}</div>
      ) : methods.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {methods.map((m) => (
            <div key={m.id} className="card p-5 relative overflow-hidden bg-gradient-to-br from-luxora-gold/10 to-transparent">
              {m.is_default && <span className="absolute top-4 right-4 badge bg-luxora-gold text-luxora-bg"><Star size={11} /> Default</span>}
              <CreditCard size={22} className="text-luxora-gold mb-4" />
              <p className="text-lg font-semibold text-luxora-text tracking-widest">•••• •••• •••• {m.last4}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-luxora-muted">{m.brand} · Expires {String(m.exp_month).padStart(2, '0')}/{m.exp_year}</p>
                <button onClick={() => setDeleting(m)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={CreditCard} title="No cards saved" message="Add a card to make checkout faster next time." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Payment Method"
        footer={<><button className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary" form="card-form" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add Card'}</button></>}>
        <form id="card-form" onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Card Brand</label>
            <select className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}>
              <option>Visa</option><option>Mastercard</option><option>Verve</option><option>American Express</option>
            </select>
          </div>
          <div><label className="label">Last 4 Digits</label><input maxLength={4} required className="input" value={form.last4} onChange={(e) => setForm({ ...form, last4: e.target.value.replace(/\D/g, '') })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Exp. Month</label><input type="number" min={1} max={12} required className="input" value={form.exp_month} onChange={(e) => setForm({ ...form, exp_month: e.target.value })} /></div>
            <div><label className="label">Exp. Year</label><input type="number" min={2024} required className="input" value={form.exp_year} onChange={(e) => setForm({ ...form, exp_year: e.target.value })} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm text-luxora-text"><input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} className="accent-luxora-gold w-4 h-4" /> Set as default card</label>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Remove this card?" />
    </div>
  );
}
