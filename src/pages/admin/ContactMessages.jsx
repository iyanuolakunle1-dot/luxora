import { useState } from 'react';
import { Mail, MailOpen, Trash2, Eye } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import { useResource } from '../../hooks/useResource';
import { notify } from '../../lib/toast';

export default function ContactMessages() {
  const { data, total, totalPages, loading, params, setParams, update, remove } = useResource('/contact-messages', { limit: 8 });
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function openMessage(msg) {
    setViewing(msg);
    if (!msg.is_read) {
      try { await update(msg.id, { is_read: true }); } catch { /* non-fatal */ }
    }
  }

  async function handleDelete() {
    try { await remove(deleting.id); notify.success('Message deleted'); setDeleting(null); }
    catch (err) { notify.error(err?.response?.data?.error || 'Failed to delete'); }
  }

  const unread = data.filter((m) => !m.is_read).length;

  return (
    <div>
      <PageHeader title="Contact Messages" subtitle="Messages submitted through the public website's Contact form." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard icon={Mail} label="Total Messages" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
        <StatCard icon={MailOpen} label="Unread (this page)" value={unread} iconColor="text-sky-400" iconBg="bg-sky-500/15" />
      </div>

      <div className="card p-5">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : data.length ? (
          <ul className="divide-y divide-luxora-border">
            {data.map((m) => (
              <li key={m.id} onClick={() => openMessage(m)} className="flex items-center justify-between gap-4 py-4 cursor-pointer hover:bg-white/[0.03] px-2 -mx-2 rounded-lg transition-colors">
                <div className="min-w-0 flex items-center gap-3">
                  {!m.is_read && <span className="w-2 h-2 rounded-full bg-luxora-gold shrink-0" />}
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${m.is_read ? 'text-luxora-muted' : 'text-luxora-text font-semibold'}`}>{m.name} <span className="text-xs text-luxora-muted font-normal">· {m.email}</span></p>
                    <p className="text-xs text-luxora-muted truncate">{m.subject || m.message}</p>
                  </div>
                </div>
                <span className="text-xs text-luxora-muted shrink-0">{new Date(m.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Mail} title="No messages yet" message="When a visitor submits the Contact form on the public website, their message will show up here." />
        )}
        <Pagination page={params.page} totalPages={totalPages} onChange={(p) => setParams((prev) => ({ ...prev, page: p }))} totalLabel={`Showing ${data.length} of ${total}`} />
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.subject || 'Message'} subtitle={`${viewing?.name} · ${viewing?.email}`}
        footer={<button className="btn-danger" onClick={() => { setDeleting(viewing); setViewing(null); }}><Trash2 size={15} /> Delete</button>}>
        <div className="space-y-3 text-sm">
          {viewing?.phone && <p className="text-luxora-muted">Phone: <span className="text-luxora-text">{viewing.phone}</span></p>}
          <p className="text-luxora-text whitespace-pre-wrap leading-relaxed">{viewing?.message}</p>
          <p className="text-xs text-luxora-muted pt-2">Received {viewing && new Date(viewing.created_at).toLocaleString()}</p>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete this message?" message="This cannot be undone." />
    </div>
  );
}
