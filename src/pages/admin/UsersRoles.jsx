import { Users, UserCheck, UserX, Lock } from 'lucide-react';
import ResourceTablePage from '../../components/ui/ResourceTablePage';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import RelationSelect from '../../components/ui/RelationSelect';

const statusColor = { active: 'green', inactive: 'yellow', locked: 'red' };
const emptyForm = { full_name: '', email: '', password: '', phone: '', department: '', role_id: '' };

export default function UsersRoles() {
  return (
    <ResourceTablePage
      endpoint="/users"
      title="Users & Roles"
      subtitle="Manage system users and their roles & permissions."
      icon={Users}
      addLabel="Add User"
      searchColumn="full_name"
      emptyForm={emptyForm}
      filterOptions={[{ key: 'status', label: 'Status', options: [{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'locked', label: 'Locked' }] }]}
      statCards={({ data, total }) => {
        const active = data.filter((u) => u.status === 'active').length;
        const inactive = data.filter((u) => u.status === 'inactive').length;
        const locked = data.filter((u) => u.status === 'locked').length;
        return (
          <>
            <StatCard icon={Users} label="Total Staff Users" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
            <StatCard icon={UserCheck} label="Active Users" value={active} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
            <StatCard icon={UserX} label="Inactive Users" value={inactive} iconColor="text-amber-400" iconBg="bg-amber-500/15" />
            <StatCard icon={Lock} label="Locked Users" value={locked} iconColor="text-red-400" iconBg="bg-red-500/15" />
          </>
        );
      }}
      columns={[
        { key: 'full_name', label: 'User', render: (r) => (<div><p className="text-luxora-text font-medium">{r.full_name}</p><p className="text-xs text-luxora-muted">{r.email}</p></div>) },
        { key: 'role', label: 'Role', render: (r) => <Badge color="purple">{r.roles?.name || '—'}</Badge> },
        { key: 'department', label: 'Department' },
        { key: 'status', label: 'Status', render: (r) => <Badge color={statusColor[r.status]}>{r.status}</Badge> },
        { key: 'last_login_at', label: 'Last Login', render: (r) => r.last_login_at ? new Date(r.last_login_at).toLocaleString() : '—' },
      ]}
      FormFields={({ form, setForm }) => (<>
        <div><label className="label">Full Name</label><input required className="input" value={form.full_name || ''} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
        <div><label className="label">Email</label><input type="email" required className="input" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Temporary Password</label><input type="text" className="input" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Only required when creating" /></div>
        <div><label className="label">Phone</label><input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="label">Department</label><input className="input" value={form.department || ''} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
        <div>
          <label className="label">Role</label>
          <RelationSelect endpoint="/roles" labelKey="name" value={form.role_id} onChange={(id) => setForm({ ...form, role_id: id })} placeholder="Select a role…" />
        </div>
      </>)}
    />
  );
}
