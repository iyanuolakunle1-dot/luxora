import { useState } from 'react';
import { Plus, Download, Eye, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import RelationSelect from '../../components/ui/RelationSelect';
import { useResource } from '../../hooks/useResource';
import { notify } from '../../lib/toast';
import { CalendarCheck, Clock, XCircle, CheckCircle2 } from 'lucide-react';

const statusColor = { confirmed: 'green', pending: 'yellow', cancelled: 'red', checked_in: 'blue', checked_out: 'purple' };
const paymentColor = { paid: 'green', pending: 'yellow', refunded: 'gray', failed: 'red' };

const emptyForm = { guest_id: '', room_id: '', check_in: '', check_out: '', adults: 2, children: 0, total_amount: '', status: 'pending', payment_status: 'pending' };

export default function Reservations() {
  const { data, total, totalPages, loading, params, setParams, create, update, remove } = useResource('/bookings', { limit: 7 });
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(row) { setEditing(row); setForm({ ...emptyForm, ...row }); setModalOpen(true); }
  function openView(row) { setViewing(row); }

  function handleExport() {
    notify.success('Exporting reservations…');
    const header = 'Reservation Code,Guest Name,Guest Email,Check In,Check Out,Total Amount,Status,Payment Status\n';
    const rows = data.map((b) => `"${b.reservation_code}","${b.guests?.full_name || ''}","${b.guests?.email || ''}","${b.check_in}","${b.check_out}","${b.total_amount || 0}","${b.status}","${b.payment_status}"`).join('\n');
    const encoded = encodeURI('data:text/csv;charset=utf-8,' + header + rows);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `reservations_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await update(editing.id, form); notify.success('Reservation updated'); }
      else {
        const code = `#RES-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
        await create({ ...form, reservation_code: code });
        notify.success('Reservation created');
      }
      setModalOpen(false);
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Failed to save reservation');
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await remove(deleting.id); notify.success('Reservation deleted'); setDeleting(null); }
    catch (err) { notify.error(err?.response?.data?.error || 'Failed to delete'); }
  }

  const confirmedCount = data.filter((d) => d.status === 'confirmed').length;
  const pendingCount = data.filter((d) => d.status === 'pending').length;
  const cancelledCount = data.filter((d) => d.status === 'cancelled').length;

  return (
    <div>
      <PageHeader
        title="Reservations"
        subtitle="Manage all hotel reservations and bookings."
        actions={<button onClick={openCreate} className="btn-primary"><Plus size={16} /> New Reservation</button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CalendarCheck} label="Total Reservations" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={confirmedCount} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
        <StatCard icon={Clock} label="Pending" value={pendingCount} iconColor="text-amber-400" iconBg="bg-amber-500/15" />
        <StatCard icon={XCircle} label="Cancelled" value={cancelledCount} iconColor="text-red-400" iconBg="bg-red-500/15" />
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap gap-3 mb-5">
          <SearchInput value={params.search || ''} onChange={(v) => setParams((p) => ({ ...p, search: v, searchColumn: 'reservation_code', page: 1 }))} placeholder="Search by reservation code…" />
          <Select value={params.status || 'all'} onChange={(v) => setParams((p) => ({ ...p, status: v, page: 1 }))} className="max-w-[160px]"
            options={[{ value: 'all', label: 'All Status' }, { value: 'confirmed', label: 'Confirmed' }, { value: 'pending', label: 'Pending' }, { value: 'cancelled', label: 'Cancelled' }, { value: 'checked_in', label: 'Checked-in' }, { value: 'checked_out', label: 'Checked-out' }]} />
          <button className="btn-outline" onClick={handleExport}><Download size={16} /> Export</button>
        </div>

        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr><th>Reservation ID</th><th>Guest</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Amount</th><th>Status</th><th>Payment</th><th></th></tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={9}><Skeleton className="h-6 w-full" /></td></tr>
              )) : data.map((b) => (
                <tr key={b.id}>
                  <td className="text-luxora-gold font-medium">{b.reservation_code}</td>
                  <td>
                    <p className="text-luxora-text font-medium">{b.guests?.full_name || '—'}</p>
                    <p className="text-xs text-luxora-muted">{b.guests?.email}</p>
                  </td>
                  <td>{b.check_in}</td>
                  <td>{b.check_out}</td>
                  <td>{b.nights || 1}</td>
                  <td>₦{Number(b.total_amount || 0).toLocaleString()}</td>
                  <td><Badge color={statusColor[b.status]}>{b.status?.replace('_', ' ')}</Badge></td>
                  <td><Badge color={paymentColor[b.payment_status]}>{b.payment_status}</Badge></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn-ghost !px-2" title="View Details" onClick={() => openView(b)}><Eye size={15} /></button>
                      <button className="btn-ghost !px-2" title="Edit" onClick={() => openEdit(b)}><Pencil size={15} /></button>
                      <button className="btn-ghost !px-2 hover:!text-red-400" title="Delete" onClick={() => setDeleting(b)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !data.length && <EmptyState icon={CalendarCheck} title="No reservations found" message="Try adjusting your filters, or create a new reservation." />}
        </div>

        <Pagination page={params.page} totalPages={totalPages} onChange={(p) => setParams((prev) => ({ ...prev, page: p }))} totalLabel={`Showing ${data.length} of ${total} reservations`} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Reservation' : 'New Reservation'} size="lg"
        footer={<>
          <button className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn-primary" form="res-form" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Reservation'}</button>
        </>}>
        <form id="res-form" onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Guest</label>
            <RelationSelect endpoint="/guests" labelKey="full_name" secondaryKey="email" value={form.guest_id} onChange={(id) => setForm({ ...form, guest_id: id })} placeholder="Select a guest…" />
          </div>
          <div>
            <label className="label">Room</label>
            <RelationSelect endpoint="/rooms" labelKey="room_number" secondaryKey="floor" value={form.room_id} onChange={(id) => setForm({ ...form, room_id: id })} placeholder="Select a room…" />
          </div>
          <div><label className="label">Check-in</label><input type="date" className="input" value={form.check_in || ''} onChange={(e) => setForm({ ...form, check_in: e.target.value })} required /></div>
          <div><label className="label">Check-out</label><input type="date" className="input" value={form.check_out || ''} onChange={(e) => setForm({ ...form, check_out: e.target.value })} required /></div>
          <div><label className="label">Adults</label><input type="number" min={1} className="input" value={form.adults} onChange={(e) => setForm({ ...form, adults: e.target.value })} /></div>
          <div><label className="label">Children</label><input type="number" min={0} className="input" value={form.children} onChange={(e) => setForm({ ...form, children: e.target.value })} /></div>
          <div><label className="label">Total Amount (₦)</label><input type="number" className="input" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} required /></div>
          <div><label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="checked_in">Checked-in</option><option value="checked_out">Checked-out</option><option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div><label className="label">Payment Status</label>
            <select className="input" value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}>
              <option value="pending">Pending</option><option value="paid">Paid</option><option value="refunded">Refunded</option><option value="failed">Failed</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Reservation Details" size="lg"
        footer={<button className="btn-outline" onClick={() => setViewing(null)}>Close</button>}>
        {viewing && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-luxora-border rounded-xl">
              <div>
                <p className="text-xs text-luxora-muted">Reservation ID</p>
                <p className="text-luxora-gold font-mono font-bold text-lg">{viewing.reservation_code}</p>
              </div>
              <Badge color={statusColor[viewing.status]}>{viewing.status?.replace('_', ' ').toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Guest</p>
                <p className="text-luxora-text font-medium">{viewing.guests?.full_name || '—'}</p>
                <p className="text-xs text-luxora-muted">{viewing.guests?.email}</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Room / Category</p>
                <p className="text-luxora-text font-medium">{viewing.rooms?.room_number ? `Room #${viewing.rooms.room_number}` : 'Room assigned on arrival'}</p>
                <p className="text-xs text-luxora-muted">{viewing.room_types?.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Check-In</p>
                <p className="text-luxora-text font-medium mt-1">{viewing.check_in}</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Check-Out</p>
                <p className="text-luxora-text font-medium mt-1">{viewing.check_out}</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Nights</p>
                <p className="text-luxora-text font-medium mt-1">{viewing.nights || 1}</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Guests</p>
                <p className="text-luxora-text font-medium mt-1">{viewing.adults || 1} Adult, {viewing.children || 0} Child</p>
              </div>
            </div>
            <div className="p-3 bg-white/5 border border-luxora-border rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-luxora-muted">Total Amount & Payment</p>
                <Badge color={paymentColor[viewing.payment_status]}>{viewing.payment_status?.toUpperCase()}</Badge>
              </div>
              <p className="text-xl font-bold text-luxora-gold">₦{Number(viewing.total_amount || 0).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete this reservation?" message={`Reservation ${deleting?.reservation_code} will be permanently removed.`} />
    </div>
  );
}
