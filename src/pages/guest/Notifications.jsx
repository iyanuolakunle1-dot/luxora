import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function GuestNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.get('/me/notifications').then(({ data }) => setItems(data?.data || [])).catch(() => setItems([])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function markRead(id) {
    try { await api.put(`/me/notifications/${id}`); load(); } catch { /* non-fatal */ }
  }

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-luxora-text">Notifications</h1><p className="text-sm text-luxora-muted mt-1">Updates about your reservations and account.</p></div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : items.length ? (
        <div className="card divide-y divide-luxora-border">
          {items.map((n) => (
            <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${!n.is_read ? 'bg-luxora-gold/5' : ''} hover:bg-white/[0.03]`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-luxora-gold/15 text-luxora-gold' : 'bg-white/5 text-luxora-muted'}`}><Bell size={14} /></div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.is_read ? 'text-luxora-text font-semibold' : 'text-luxora-muted'}`}>{n.title}</p>
                <p className="text-xs text-luxora-muted mt-0.5">{n.message}</p>
                <p className="text-[11px] text-luxora-muted mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.is_read && <span className="w-2 h-2 rounded-full bg-luxora-gold shrink-0 mt-1" />}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={CheckCheck} title="You're all caught up" message="New notifications about your reservations will appear here." />
      )}
    </div>
  );
}
