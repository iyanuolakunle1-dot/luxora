import { useState } from 'react';
import { MessageSquareText, Star, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import Pagination from '../../components/ui/Pagination';
import { useResource } from '../../hooks/useResource';
import { notify } from '../../lib/toast';

export default function Reviews() {
  const { data, total, totalPages, loading, params, setParams, update } = useResource('/reviews', { limit: 6 });
  const [responding, setResponding] = useState(null);
  const [response, setResponse] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleRespond(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await update(responding.id, { response, status: 'responded', responded_at: new Date().toISOString() });
      notify.success('Response sent to guest');
      setResponding(null); setResponse('');
    } catch (err) { notify.error(err?.response?.data?.error || 'Failed to send response'); }
    finally { setSaving(false); }
  }

  const avg = data.length ? (data.reduce((a, r) => a + Number(r.rating || 0), 0) / data.length).toFixed(1) : '5.0';
  const positive = data.filter((r) => Number(r.rating) >= 4).length;
  const negative = data.filter((r) => Number(r.rating) <= 2).length;
  const pending = data.filter((r) => r.status === 'pending_response').length;

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Track guest feedback and improve your service experience." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <StatCard icon={MessageSquareText} label="Total Reviews" value={total} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
        <StatCard icon={Star} label="Average Rating" value={`${avg} / 5`} iconColor="text-amber-400" iconBg="bg-amber-500/15" />
        <StatCard icon={ThumbsUp} label="Positive Reviews" value={`${positive} (${data.length ? Math.round((positive / data.length) * 100) : 0}%)`} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
        <StatCard icon={ThumbsDown} label="Critical Reviews" value={`${negative} (${data.length ? Math.round((negative / data.length) * 100) : 0}%)`} deltaPositive={false} iconColor="text-red-400" iconBg="bg-red-500/15" />
        <StatCard icon={Clock} label="Pending Response" value={pending} iconColor="text-sky-400" iconBg="bg-sky-500/15" />
      </div>

      <div className="card p-5">
        <div className="space-y-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />) : data.map((r) => (
            <div key={r.id} className="border border-luxora-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <img src={r.avatar_url || `https://i.pravatar.cc/100?u=${r.id}`} className="w-11 h-11 rounded-full object-cover shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-luxora-text">{r.guest_name}</p>
                    <p className="text-xs text-luxora-muted">{r.room_type} · {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} />)}
                  </div>
                </div>
                <p className="text-sm text-luxora-muted mt-2">{r.comment}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge color="blue">{r.source?.replace('_', '.')}</Badge>
                  <Badge color={r.status === 'responded' ? 'green' : 'yellow'}>{r.status?.replace('_', ' ')}</Badge>
                  <button className="text-xs text-luxora-gold font-medium ml-auto" onClick={() => { setResponding(r); setResponse(r.response || ''); }}>
                    {r.status === 'responded' ? 'View Response' : 'Respond'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && !data.length && <p className="text-center text-luxora-muted py-10">No reviews yet.</p>}
        </div>
        <Pagination page={params.page} totalPages={totalPages} onChange={(p) => setParams((prev) => ({ ...prev, page: p }))} totalLabel={`Showing ${data.length} of ${total}`} />
      </div>

      <Modal open={!!responding} onClose={() => setResponding(null)} title="Respond to Review" subtitle={responding?.guest_name}
        footer={<><button className="btn-outline" onClick={() => setResponding(null)}>Cancel</button><button className="btn-primary" form="review-form" type="submit" disabled={saving}>{saving ? 'Sending…' : 'Send Response'}</button></>}>
        <form id="review-form" onSubmit={handleRespond}>
          <p className="text-sm text-luxora-muted italic mb-4">"{responding?.comment}"</p>
          <label className="label">Your Response</label>
          <textarea rows={4} required className="input" value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Thank you for your feedback…" />
        </form>
      </Modal>
    </div>
  );
}
