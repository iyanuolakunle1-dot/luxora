import { Users, UserPlus, Crown, RefreshCcw } from 'lucide-react';
import ResourceTablePage from '../../components/ui/ResourceTablePage';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';

const statusColor = { active: 'green', inactive: 'gray', vip: 'purple' };
const emptyForm = { full_name: '', email: '', phone: '', nationality: '', status: 'active' };

export default function Guests() {
  return (
    <ResourceTablePage
      endpoint="/guests"
      title="Guests"
      subtitle="View and manage all registered guests."
      icon={Users}
      addLabel="Add New Guest"
      searchColumn="full_name"
      emptyForm={emptyForm}
      buildCreatePayload={(f) => ({ ...f, guest_code: `#GUEST-${Math.floor(Math.random() * 9000 + 1000)}` })}
      filterOptions={[{ key: 'status', label: 'Status', options: [{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'vip', label: 'VIP' }] }]}
      statCards={({ data, total }) => {
        const active = data.filter((g) => g.status === 'active').length;
        const vip = data.filter((g) => g.status === 'vip').length;
        const totalRevenue = data.reduce((sum, g) => sum + Number(g.total_spent || 0), 0);
        return (
          <>
            <StatCard icon={Users} label="Total Guests" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
            <StatCard icon={UserPlus} label="Active Guests" value={active} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
            <StatCard icon={Crown} label="VIP Guests" value={vip} iconColor="text-violet-400" iconBg="bg-violet-500/15" />
            <StatCard icon={RefreshCcw} label="Total Guest Revenue" value={`₦${totalRevenue.toLocaleString()}`} iconColor="text-sky-400" iconBg="bg-sky-500/15" />
          </>
        );
      }}
      columns={[
        { key: 'full_name', label: 'Guest', render: (r) => (<div><p className="text-luxora-text font-medium">{r.full_name}</p><p className="text-xs text-luxora-muted">{r.guest_code}</p></div>) },
        { key: 'email', label: 'Contact', render: (r) => (<div><p>{r.email}</p><p className="text-xs text-luxora-muted">{r.phone}</p></div>) },
        { key: 'nationality', label: 'Nationality' },
        { key: 'total_stays', label: 'Total Stays' },
        { key: 'total_spent', label: 'Total Spent', render: (r) => `₦${Number(r.total_spent || 0).toLocaleString()}` },
        { key: 'status', label: 'Status', render: (r) => <Badge color={statusColor[r.status]}>{r.status}</Badge> },
      ]}
      FormFields={({ form, setForm }) => (<>
        <div><label className="label">Full Name</label><input required className="input" value={form.full_name || ''} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
        <div><label className="label">Email</label><input type="email" className="input" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Phone</label><input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="label">Nationality</label><input className="input" value={form.nationality || ''} onChange={(e) => setForm({ ...form, nationality: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="label">Status</label>
          <select className="input" value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option><option value="inactive">Inactive</option><option value="vip">VIP</option>
          </select>
        </div>
      </>)}
    />
  );
}
