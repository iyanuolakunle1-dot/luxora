import { useState } from 'react';
import { BedDouble, DoorOpen, Tag, TrendingUp, Plus, UploadCloud, Loader2, Pencil, Trash2, LayoutGrid } from 'lucide-react';
import ResourceTablePage from '../../components/ui/ResourceTablePage';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import RelationSelect from '../../components/ui/RelationSelect';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import PageHeader from '../../components/ui/PageHeader';
import { useResource } from '../../hooks/useResource';
import { uploadViaServer } from '../../lib/cloudinary';
import { getRoomImageUrl } from '../../utils/imageHelper';
import { notify } from '../../lib/toast';

const statusColor = { active: 'green', maintenance: 'yellow', inactive: 'gray' };
const availColor = { available: 'green', unavailable: 'red' };
const emptyRoomForm = { room_number: '', floor: '', room_type_id: '', rate_override: '', status: 'active', availability: 'available' };

export default function RoomsRates() {
  const [tab, setTab] = useState('rooms');

  return (
    <div>
      <PageHeader title="Rooms & Rates" subtitle="Manage hotel rooms, room types, and pricing." />

      <div className="flex gap-6 border-b border-luxora-border mb-6 text-sm">
        {[['rooms', 'Rooms'], ['types', 'Room Types']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`pb-3 -mb-px border-b-2 font-medium ${tab === id ? 'border-luxora-gold text-luxora-gold' : 'border-transparent text-luxora-muted hover:text-luxora-text'}`}>{label}</button>
        ))}
      </div>

      {tab === 'rooms' ? <RoomsTab /> : <RoomTypesTab />}
    </div>
  );
}

function RoomsTab() {
  return (
    <ResourceTablePage
      endpoint="/rooms"
      title="Rooms"
      subtitle=""
      icon={BedDouble}
      addLabel="Add New Room"
      searchColumn="room_number"
      emptyForm={emptyRoomForm}
      filterOptions={[
        { key: 'status', label: 'Status', options: [{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'inactive', label: 'Inactive' }] },
        { key: 'availability', label: 'Availability', options: [{ value: 'all', label: 'All' }, { value: 'available', label: 'Available' }, { value: 'unavailable', label: 'Unavailable' }] },
      ]}
      statCards={({ data, total }) => {
        const available = data.filter((r) => r.availability === 'available').length;
        const maintenance = data.filter((r) => r.status === 'maintenance').length;
        const totalRates = data.reduce((sum, r) => sum + Number(r.rate_override || r.room_types?.base_rate || 0), 0);
        const avgRate = data.length ? Math.round(totalRates / data.length) : 0;
        return (
          <>
            <StatCard icon={BedDouble} label="Total Rooms" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
            <StatCard icon={DoorOpen} label="Available Rooms" value={available} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
            <StatCard icon={Tag} label="Average Rate" value={`₦${avgRate.toLocaleString()}`} iconColor="text-sky-400" iconBg="bg-sky-500/15" />
            <StatCard icon={TrendingUp} label="Maintenance" value={maintenance} iconColor="text-amber-400" iconBg="bg-amber-500/15" />
          </>
        );
      }}
      columns={[
        { key: 'room_number', label: 'Room No.', render: (r) => <span className="text-luxora-gold font-semibold">{r.room_number}</span> },
        { key: 'room_type', label: 'Room Type', render: (r) => r.room_types?.name || '—' },
        { key: 'floor', label: 'Floor' },
        { key: 'rate', label: 'Rate / Night', render: (r) => `₦${Number(r.rate_override || r.room_types?.base_rate || 0).toLocaleString()}` },
        { key: 'status', label: 'Status', render: (r) => <Badge color={statusColor[r.status]}>{r.status}</Badge> },
        { key: 'availability', label: 'Availability', render: (r) => <Badge color={availColor[r.availability]}>{r.availability}</Badge> },
      ]}
      FormFields={({ form, setForm }) => (<>
        <div><label className="label">Room Number</label><input required className="input" value={form.room_number || ''} onChange={(e) => setForm({ ...form, room_number: e.target.value })} /></div>
        <div><label className="label">Floor</label><input className="input" value={form.floor || ''} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></div>
        <div><label className="label">Room Type</label>
          <RelationSelect endpoint="/room-types" labelKey="name" value={form.room_type_id} onChange={(id) => setForm({ ...form, room_type_id: id })} placeholder="Select a room type…" />
        </div>
        <div><label className="label">Rate Override (₦)</label><input type="number" className="input" value={form.rate_override || ''} onChange={(e) => setForm({ ...form, rate_override: e.target.value })} /></div>
        <div><label className="label">Status</label>
          <select className="input" value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option><option value="maintenance">Maintenance</option><option value="inactive">Inactive</option>
          </select>
        </div>
        <div><label className="label">Availability</label>
          <select className="input" value={form.availability || 'available'} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
            <option value="available">Available</option><option value="unavailable">Unavailable</option>
          </select>
        </div>
      </>)}
    />
  );
}

const emptyTypeForm = { name: '', description: '', base_rate: '', max_adults: 2, max_children: 0, size_sqm: '', images: [] };

// Manages `room_types` — this is exactly what the PUBLIC /rooms page and the
// Guest Portal booking flow read from. Add one here with a photo + price and
// it appears on the website immediately.
function RoomTypesTab() {
  const { data, loading, create, update, remove } = useResource('/room-types', { limit: 50 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTypeForm);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openCreate() { setEditing(null); setForm(emptyTypeForm); setModalOpen(true); }
  function openEdit(rt) { setEditing(rt); setForm({ ...emptyTypeForm, ...rt, images: rt.images || [] }); setModalOpen(true); }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadViaServer(file, 'luxora/room-types');
      setForm((f) => ({ ...f, images: [res.url, ...(f.images || [])] }));
      notify.success('Image uploaded');
    } catch { notify.error('Upload failed — check your Cloudinary/server config'); }
    finally { setUploading(false); }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await update(editing.id, form); notify.success('Room type updated'); }
      else { await create(form); notify.success('Room type created'); }
      setModalOpen(false);
    } catch (err) { notify.error(err?.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await remove(deleting.id); notify.success('Room type deleted'); setDeleting(null); }
    catch (err) { notify.error(err?.response?.data?.error || 'Failed to delete'); }
  }

  return (
    <div className="card p-5">
      <div className="flex justify-end mb-5">
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Add Room Type</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)}</div>
      ) : data.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((rt) => (
            <div key={rt.id} className="border border-luxora-border rounded-2xl overflow-hidden">
              <div className="h-36 bg-white/5"><img src={getRoomImageUrl(rt.images, rt.name)} className="w-full h-full object-cover" alt={rt.name} /></div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-luxora-text">{rt.name}</h3>
                  <span className="text-luxora-gold text-sm font-semibold">₦{Number(rt.base_rate).toLocaleString()}</span>
                </div>
                <p className="text-xs text-luxora-muted mb-3 line-clamp-2">{rt.description}</p>
                <div className="flex gap-2">
                  <button className="btn-ghost !px-2" onClick={() => openEdit(rt)}><Pencil size={14} /></button>
                  <button className="btn-ghost !px-2 hover:!text-red-400" onClick={() => setDeleting(rt)}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={LayoutGrid} title="No room types yet" message="Create your first room type (Deluxe, Executive, Suite…) — it will show up on the public Rooms page and in the Guest Portal booking flow." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Room Type' : 'Add Room Type'} size="lg"
        footer={<><button className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary" form="type-form" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
        <form id="type-form" onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-luxora-border overflow-hidden flex items-center justify-center shrink-0">
                {form.images?.[0] ? <img src={form.images[0]} className="w-full h-full object-cover" alt="" /> : <UploadCloud size={20} className="text-luxora-muted" />}
              </div>
              <label className="btn-outline cursor-pointer">
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />} {uploading ? 'Uploading…' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2"><label className="label">Name</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Deluxe Room" /></div>
          <div><label className="label">Base Rate (₦ / night)</label><input type="number" required className="input" value={form.base_rate} onChange={(e) => setForm({ ...form, base_rate: e.target.value })} /></div>
          <div><label className="label">Size (m²)</label><input type="number" className="input" value={form.size_sqm} onChange={(e) => setForm({ ...form, size_sqm: e.target.value })} /></div>
          <div><label className="label">Max Adults</label><input type="number" className="input" value={form.max_adults} onChange={(e) => setForm({ ...form, max_adults: e.target.value })} /></div>
          <div><label className="label">Max Children</label><input type="number" className="input" value={form.max_children} onChange={(e) => setForm({ ...form, max_children: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete this room type?" message="It will disappear from the public Rooms page and Guest Portal." />
    </div>
  );
}
