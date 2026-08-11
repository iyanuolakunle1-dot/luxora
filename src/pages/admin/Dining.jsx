import { useState } from 'react';
import { ShoppingBag, Wallet, Users, TrendingUp, Clock, Plus, UploadCloud, Loader2, Trash2, Pencil, UtensilsCrossed } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import RevenueLineChart from '../../components/charts/RevenueLineChart';
import { useResource } from '../../hooks/useResource';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { uploadViaServer } from '../../lib/cloudinary';
import { notify } from '../../lib/toast';

const revenueData = [
  { label: 'Mon', value: 60000 }, { label: 'Tue', value: 110000 }, { label: 'Wed', value: 95000 },
  { label: 'Thu', value: 150000 }, { label: 'Fri', value: 130000 }, { label: 'Sat', value: 170000 }, { label: 'Sun', value: 245000 },
];

const statusColor = { pending: 'yellow', preparing: 'blue', served: 'purple', completed: 'green', cancelled: 'red' };

export default function Dining() {
  const { data, total, loading } = useResource('/dining-orders', { limit: 50 });
  const [tab, setTab] = useState('orders');

  const totalRevenue = data.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const avgOrder = data.length ? Math.round(totalRevenue / data.length) : 0;
  const pendingOrders = data.filter((o) => o.status === 'pending').length;
  const completedOrders = data.filter((o) => o.status === 'completed').length;

  return (
    <div>
      <PageHeader title="Dining" subtitle="Manage restaurant operations, menu, orders and reservations."
        actions={<button className="btn-primary" onClick={() => setTab('menu')}><Plus size={16} /> Manage Menu</button>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <StatCard icon={ShoppingBag} label="Total Orders" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
        <StatCard icon={Wallet} label="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
        <StatCard icon={Clock} label="Pending Orders" value={pendingOrders} iconColor="text-amber-400" iconBg="bg-amber-500/15" />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={`₦${avgOrder.toLocaleString()}`} iconColor="text-violet-400" iconBg="bg-violet-500/15" />
        <StatCard icon={Users} label="Completed Orders" value={completedOrders} iconColor="text-sky-400" iconBg="bg-sky-500/15" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-luxora-text">Revenue Overview</h3>
            <span className="text-xs text-luxora-muted">This Week</span>
          </div>
          <RevenueLineChart data={revenueData} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-luxora-text mb-4">Table Status</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="flex items-center gap-2 text-luxora-muted"><i className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Available</span><span className="text-luxora-text font-medium">18 (42.9%)</span></li>
            <li className="flex justify-between"><span className="flex items-center gap-2 text-luxora-muted"><i className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Occupied</span><span className="text-luxora-text font-medium">20 (47.6%)</span></li>
            <li className="flex justify-between"><span className="flex items-center gap-2 text-luxora-muted"><i className="w-2 h-2 rounded-full bg-red-400 inline-block" />Reserved</span><span className="text-luxora-text font-medium">4 (9.5%)</span></li>
          </ul>
        </div>
      </div>

      <div className="card p-5 mt-6">
        <div className="flex gap-6 border-b border-luxora-border mb-4 text-sm overflow-x-auto">
          {['orders', 'menu', 'reservations', 'kitchen'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`pb-3 -mb-px border-b-2 font-medium capitalize whitespace-nowrap ${tab === t ? 'border-luxora-gold text-luxora-gold' : 'border-transparent text-luxora-muted hover:text-luxora-text'}`}>
              {t === 'kitchen' ? 'KOT (Kitchen Orders)' : t === 'orders' ? 'Recent Orders' : t === 'menu' ? 'Menu Management' : 'Table Reservations'}
            </button>
          ))}
        </div>

        {tab === 'menu' ? <MenuManager /> : (
          <div className="table-wrap">
            <table className="table-base">
              <thead><tr><th>Order ID</th><th>Table</th><th>Guest</th><th>Amount</th><th>Status</th><th>Time</th></tr></thead>
              <tbody>
                {loading ? Array.from({ length: 4 }).map((_, i) => <tr key={i}><td colSpan={6}><Skeleton className="h-6 w-full" /></td></tr>) : data.map((o) => (
                  <tr key={o.id}>
                    <td className="text-luxora-gold font-medium">{o.order_code}</td>
                    <td>{o.dining_tables?.table_number || '—'}</td>
                    <td>{o.guest_name}</td>
                    <td>₦{Number(o.amount || 0).toLocaleString()}</td>
                    <td><Badge color={statusColor[o.status]}>{o.status}</Badge></td>
                    <td>{new Date(o.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const emptyMenuForm = { name: '', price: '', category: '', image_url: '' };

// Manages `menu_items` — this is exactly what powers the live menu on the
// public Dining page (/dining). Add an item here, set status active, and it
// shows up on the website immediately — no hardcoded content involved.
function MenuManager() {
  const { data, loading, create, update, remove } = useResource('/menu-items', { limit: 50 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMenuForm);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function openCreate() { setEditing(null); setForm(emptyMenuForm); setModalOpen(true); }
  function openEdit(item) { setEditing(item); setForm({ ...emptyMenuForm, ...item }); setModalOpen(true); }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadViaServer(file, 'luxora/menu');
      setForm((f) => ({ ...f, image_url: res.url }));
      notify.success('Image uploaded');
    } catch { notify.error('Upload failed — check your Cloudinary/server config'); }
    finally { setUploading(false); }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await update(editing.id, form); notify.success('Menu item updated'); }
      else { await create(form); notify.success('Menu item added'); }
      setModalOpen(false);
    } catch (err) { notify.error(err?.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try { await remove(deleting.id); notify.success('Menu item deleted'); setDeleting(null); }
    catch (err) { notify.error(err?.response?.data?.error || 'Failed to delete'); }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Menu Item</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : data.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.id} className="border border-luxora-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden shrink-0">
                {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" alt="" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-luxora-text truncate">{item.name}</p>
                <p className="text-xs text-luxora-muted">{item.category} · ₦{Number(item.price).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button className="btn-ghost !px-2" onClick={() => openEdit(item)}><Pencil size={14} /></button>
                <button className="btn-ghost !px-2 hover:!text-red-400" onClick={() => setDeleting(item)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={UtensilsCrossed} title="No menu items yet" message="Add your first dish — it will immediately appear on the public Dining page." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Menu Item' : 'Add Menu Item'}
        footer={<><button className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary" form="menu-form" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></>}>
        <form id="menu-form" onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-luxora-border overflow-hidden flex items-center justify-center shrink-0">
                {form.image_url ? <img src={form.image_url} className="w-full h-full object-cover" alt="" /> : <UploadCloud size={18} className="text-luxora-muted" />}
              </div>
              <label className="btn-outline cursor-pointer">
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />} {uploading ? 'Uploading…' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
            </div>
          </div>
          <div><label className="label">Dish Name</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Price (₦)</label><input type="number" required className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div><label className="label">Category</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Starters, Mains…" /></div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete this menu item?" message="It will also disappear from the public Dining page." />
    </div>
  );
}
