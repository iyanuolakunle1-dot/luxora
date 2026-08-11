import { Brush, CheckCircle2, Clock, AlertTriangle, Wrench } from 'lucide-react';
import ResourceTablePage from '../../components/ui/ResourceTablePage';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import RelationSelect from '../../components/ui/RelationSelect';

const statusColor = { clean: 'green', in_progress: 'yellow', dirty: 'red', maintenance: 'blue' };
const priorityColor = { low: 'gray', medium: 'yellow', high: 'red' };
const emptyForm = { room_id: '', status: 'dirty', priority: 'low', notes: '' };

export default function Housekeeping() {
  return (
    <ResourceTablePage
      endpoint="/housekeeping"
      title="Housekeeping"
      subtitle="Track room status and housekeeping activities."
      icon={Brush}
      addLabel="Add Housekeeping Task"
      searchColumn="notes"
      emptyForm={emptyForm}
      filterOptions={[{ key: 'status', label: 'Status', options: [{ value: 'all', label: 'All Status' }, { value: 'clean', label: 'Clean' }, { value: 'in_progress', label: 'In Progress' }, { value: 'dirty', label: 'Dirty' }, { value: 'maintenance', label: 'Maintenance' }] }]}
      statCards={({ data, total }) => {
        const clean = data.filter((t) => t.status === 'clean').length;
        const inProgress = data.filter((t) => t.status === 'in_progress').length;
        const dirty = data.filter((t) => t.status === 'dirty').length;
        return (
          <>
            <StatCard icon={Brush} label="Total Tasks" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
            <StatCard icon={CheckCircle2} label="Clean Rooms" value={clean} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
            <StatCard icon={Clock} label="In Progress" value={inProgress} iconColor="text-amber-400" iconBg="bg-amber-500/15" />
            <StatCard icon={AlertTriangle} label="Dirty Rooms" value={dirty} iconColor="text-red-400" iconBg="bg-red-500/15" />
          </>
        );
      }}
      columns={[
        { key: 'room', label: 'Room No.', render: (r) => <span className="text-luxora-gold font-semibold">{r.rooms?.room_number || '—'}</span> },
        { key: 'floor', label: 'Floor', render: (r) => r.rooms?.floor || '—' },
        { key: 'status', label: 'Status', render: (r) => <Badge color={statusColor[r.status]}>{r.status?.replace('_', ' ')}</Badge> },
        { key: 'priority', label: 'Priority', render: (r) => <Badge color={priorityColor[r.priority]}>{r.priority}</Badge> },
        { key: 'assigned', label: 'Assigned To', render: (r) => r.profiles?.full_name || '—' },
        { key: 'updated_at', label: 'Last Updated', render: (r) => r.updated_at ? new Date(r.updated_at).toLocaleString() : '—' },
      ]}
      FormFields={({ form, setForm }) => (<>
        <div className="sm:col-span-2">
          <label className="label">Room</label>
          <RelationSelect endpoint="/rooms" labelKey="room_number" secondaryKey="floor" value={form.room_id} onChange={(id) => setForm({ ...form, room_id: id })} placeholder="Select a room…" />
        </div>
        <div><label className="label">Status</label>
          <select className="input" value={form.status || 'dirty'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="clean">Clean</option><option value="in_progress">In Progress</option><option value="dirty">Dirty</option><option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div><label className="label">Priority</label>
          <select className="input" value={form.priority || 'low'} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </div>
        <div className="sm:col-span-2"><label className="label">Notes</label><textarea rows={3} className="input" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
      </>)}
    />
  );
}
