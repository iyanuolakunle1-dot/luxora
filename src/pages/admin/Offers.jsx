import { Tag, Gift, CalendarClock, Percent } from 'lucide-react';
import ResourceTablePage from '../../components/ui/ResourceTablePage';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { getOfferImageUrl } from '../../utils/imageHelper';

const statusColor = { active: 'green', upcoming: 'blue', expired: 'red' };
const typeColor = { seasonal_offer: 'yellow', package: 'purple', discount: 'blue', corporate: 'green' };
const emptyForm = { title: '', description: '', category: '', type: 'discount', discount_percent: '', fixed_price: '', valid_from: '', valid_to: '', status: 'upcoming' };

export default function Offers() {
  return (
    <ResourceTablePage
      endpoint="/offers"
      title="Offers & Packages"
      subtitle="Create and manage special offers, discounts and packages."
      icon={Tag}
      addLabel="Create New Offer"
      searchColumn="title"
      emptyForm={emptyForm}
      filterOptions={[
        { key: 'status', label: 'Status', options: [{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'expired', label: 'Expired' }] },
        { key: 'type', label: 'Type', options: [{ value: 'all', label: 'All Types' }, { value: 'seasonal_offer', label: 'Seasonal' }, { value: 'package', label: 'Package' }, { value: 'discount', label: 'Discount' }, { value: 'corporate', label: 'Corporate' }] },
      ]}
      statCards={({ data, total }) => {
        const active = data.filter((o) => o.status === 'active').length;
        const upcoming = data.filter((o) => o.status === 'upcoming').length;
        const totalBookings = data.reduce((sum, o) => sum + Number(o.bookings_count || 0), 0);
        return (
          <>
            <StatCard icon={Tag} label="Total Offers" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
            <StatCard icon={Gift} label="Active Offers" value={active} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
            <StatCard icon={CalendarClock} label="Upcoming Offers" value={upcoming} iconColor="text-sky-400" iconBg="bg-sky-500/15" />
            <StatCard icon={Percent} label="Total Redemptions" value={totalBookings} iconColor="text-violet-400" iconBg="bg-violet-500/15" />
          </>
        );
      }}
      columns={[
        { key: 'title', label: 'Offer Name', render: (r) => (
          <div className="flex items-center gap-3">
            <img src={getOfferImageUrl(r.image_url, r.title)} className="w-10 h-10 rounded-lg object-cover" alt="" />
            <span className="text-luxora-text font-medium">{r.title}</span>
          </div>
        ) },
        { key: 'type', label: 'Type', render: (r) => <Badge color={typeColor[r.type]}>{r.type?.replace('_', ' ')}</Badge> },
        { key: 'category', label: 'Category' },
        { key: 'discount', label: 'Discount / Price', render: (r) => r.discount_percent ? `${r.discount_percent}% OFF` : r.fixed_price ? `₦${Number(r.fixed_price).toLocaleString()}` : '—' },
        { key: 'valid', label: 'Valid Period', render: (r) => (r.valid_from && r.valid_to) ? `${r.valid_from} – ${r.valid_to}` : '—' },
        { key: 'status', label: 'Status', render: (r) => <Badge color={statusColor[r.status]}>{r.status}</Badge> },
        { key: 'bookings_count', label: 'Bookings' },
      ]}
      FormFields={({ form, setForm }) => (<>
        <div className="sm:col-span-2"><label className="label">Offer Title</label><input required className="input" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={2} className="input" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div><label className="label">Category</label><input className="input" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Leisure, Couple, Business…" /></div>
        <div><label className="label">Type</label>
          <select className="input" value={form.type || 'discount'} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="discount">Discount</option><option value="seasonal_offer">Seasonal Offer</option><option value="package">Package</option><option value="corporate">Corporate</option>
          </select>
        </div>
        <div><label className="label">Discount %</label><input type="number" className="input" value={form.discount_percent || ''} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} /></div>
        <div><label className="label">Fixed Price (₦)</label><input type="number" className="input" value={form.fixed_price || ''} onChange={(e) => setForm({ ...form, fixed_price: e.target.value })} /></div>
        <div><label className="label">Valid From</label><input type="date" className="input" value={form.valid_from || ''} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} /></div>
        <div><label className="label">Valid To</label><input type="date" className="input" value={form.valid_to || ''} onChange={(e) => setForm({ ...form, valid_to: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="label">Status</label>
          <select className="input" value={form.status || 'upcoming'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="upcoming">Upcoming</option><option value="active">Active</option><option value="expired">Expired</option>
          </select>
        </div>
      </>)}
    />
  );
}
