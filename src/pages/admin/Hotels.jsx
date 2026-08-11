import { Building2 } from 'lucide-react';
import ResourceTablePage from '../../components/ui/ResourceTablePage';
import Badge from '../../components/ui/Badge';

const emptyForm = { name: '', slug: '', city: '', address: '', description: '', is_active: true };

export default function Hotels() {
  return (
    <ResourceTablePage
      endpoint="/hotels"
      title="Hotels"
      subtitle="Manage each property in your Luxora portfolio."
      icon={Building2}
      addLabel="Add New Hotel"
      searchColumn="name"
      emptyForm={emptyForm}
      buildCreatePayload={(f) => ({ ...f, slug: f.slug || f.name?.toLowerCase().replace(/\s+/g, '-') })}
      columns={[
        { key: 'name', label: 'Hotel Name', render: (r) => <span className="text-luxora-text font-medium">{r.name}</span> },
        { key: 'city', label: 'City' },
        { key: 'address', label: 'Address' },
        { key: 'is_active', label: 'Status', render: (r) => <Badge color={r.is_active ? 'green' : 'gray'}>{r.is_active ? 'Active' : 'Inactive'}</Badge> },
      ]}
      FormFields={({ form, setForm }) => (<>
        <div className="sm:col-span-2"><label className="label">Hotel Name</label><input required className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="label">City</label><input className="input" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
        <div><label className="label">Slug</label><input className="input" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if empty" /></div>
        <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={3} className="input" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      </>)}
    />
  );
}
