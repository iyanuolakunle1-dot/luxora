import { useState } from 'react';
import { Sparkles, CheckCircle2, Wrench, Star, CalendarCheck, UploadCloud, Loader2 } from 'lucide-react';
import ResourceTablePage from '../../components/ui/ResourceTablePage';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { uploadViaServer } from '../../lib/cloudinary';
import { notify } from '../../lib/toast';
import { getFacilityImageUrl } from '../../utils/imageHelper';

const statusColor = { active: 'green', maintenance: 'yellow', inactive: 'gray' };
const emptyForm = { name: '', category: 'Wellness', location: '', description: '', image_url: '', status: 'active', availability: 'available' };

export default function Facilities() {
  return (
    <ResourceTablePage
      endpoint="/facilities"
      title="Facilities & Amenities"
      subtitle="Manage hotel facilities, wellness centers, and recreational amenities."
      icon={Sparkles}
      addLabel="Add New Facility"
      searchColumn="name"
      emptyForm={emptyForm}
      filterOptions={[{ key: 'status', label: 'Status', options: [{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'inactive', label: 'Inactive' }] }]}
      statCards={({ data, total }) => {
        const active = data.filter((f) => f.status === 'active').length;
        const maintenance = data.filter((f) => f.status === 'maintenance').length;
        const totalRating = data.reduce((sum, f) => sum + Number(f.guest_rating || 0), 0);
        const avgRating = data.length ? (totalRating / data.length).toFixed(1) : '5.0';
        return (
          <>
            <StatCard icon={Sparkles} label="Total Facilities" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
            <StatCard icon={CheckCircle2} label="Active Facilities" value={active} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
            <StatCard icon={Wrench} label="Under Maintenance" value={maintenance} iconColor="text-amber-400" iconBg="bg-amber-500/15" />
            <StatCard icon={Star} label="Guest Rating (Avg.)" value={`${avgRating} / 5`} iconColor="text-violet-400" iconBg="bg-violet-500/15" />
          </>
        );
      }}
      columns={[
        { key: 'name', label: 'Facility', render: (r) => (
          <div className="flex items-center gap-3">
            <img src={getFacilityImageUrl(r.image_url, r.name, r.category)} className="w-10 h-10 rounded-lg object-cover" alt="" />
            <span className="text-luxora-text font-medium">{r.name}</span>
          </div>
        ) },
        { key: 'category', label: 'Category', render: (r) => <Badge color="blue">{r.category}</Badge> },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status', render: (r) => <Badge color={statusColor[r.status]}>{r.status}</Badge> },
        { key: 'guest_rating', label: 'Rating', render: (r) => `${r.guest_rating || 0} / 5` },
        { key: 'bookings_month', label: 'Bookings', render: (r) => r.bookings_month ?? '—' },
      ]}
      FormFields={FacilityForm}
    />
  );
}

function FacilityForm({ form, setForm }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadViaServer(file, 'luxora/facilities');
      setForm((f) => ({ ...f, image_url: res.url }));
      notify.success('Image uploaded');
    } catch {
      notify.error('Upload failed — check your Cloudinary/server config');
    } finally { setUploading(false); }
  }

  return (
    <>
      <div className="sm:col-span-2">
        <label className="label">Facility Image</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-white/5 border border-luxora-border overflow-hidden flex items-center justify-center shrink-0">
            {form.image_url ? <img src={form.image_url} className="w-full h-full object-cover" alt="" /> : <UploadCloud size={20} className="text-luxora-muted" />}
          </div>
          <label className="btn-outline cursor-pointer">
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
            {uploading ? 'Uploading…' : 'Upload Image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        </div>
      </div>
      <div><label className="label">Name</label><input required className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Infinity Pool, Serena Spa" /></div>
      <div><label className="label">Category</label><input required className="input" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Wellness, Recreation, Dining…" /></div>
      <div><label className="label">Location</label><input className="input" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
      <div><label className="label">Status</label>
        <select className="input" value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="active">Active</option><option value="maintenance">Maintenance</option><option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={3} className="input" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
    </>
  );
}
