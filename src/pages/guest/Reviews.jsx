import { useEffect, useState } from 'react';
import { Star, MessageSquareText, Plus } from 'lucide-react';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { notify } from '../../lib/toast';

export default function GuestReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: '', room_type: '' });
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api.get('/me/reviews').then(({ data }) => setReviews(data?.data || [])).catch(() => setReviews([])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/me/reviews', form);
      notify.success('Thanks for your feedback!');
      setModalOpen(false); setForm({ rating: 5, comment: '', room_type: '' }); load();
    } catch (err) { notify.error(err?.response?.data?.error || 'Failed to submit review'); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-luxora-text">My Reviews</h1><p className="text-sm text-luxora-muted mt-1">Reviews you've shared about your stays.</p></div>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={16} /> Write a Review</button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : reviews.length ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-amber-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} />)}</div>
                <span className="text-xs text-luxora-muted">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              {r.room_type && <p className="text-xs text-luxora-muted mb-1">{r.room_type}</p>}
              <p className="text-sm text-luxora-text">{r.comment}</p>
              {r.response && (
                <div className="mt-3 pl-3 border-l-2 border-luxora-gold/40">
                  <p className="text-xs text-luxora-gold font-medium mb-1">Response from Luxora</p>
                  <p className="text-sm text-luxora-muted">{r.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={MessageSquareText} title="No reviews yet" message="Share your experience after a stay — it helps other guests and helps us improve." />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Write a Review"
        footer={<><button className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary" form="review-form" type="submit" disabled={saving}>{saving ? 'Submitting…' : 'Submit Review'}</button></>}>
        <form id="review-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Your Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button type="button" key={i} onClick={() => setForm({ ...form, rating: i + 1 })}>
                  <Star size={24} className={i < form.rating ? 'text-amber-400' : 'text-luxora-muted'} fill={i < form.rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          <div><label className="label">Room Type (optional)</label><input className="input" value={form.room_type} onChange={(e) => setForm({ ...form, room_type: e.target.value })} /></div>
          <div><label className="label">Your Review</label><textarea rows={4} required className="input" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Tell us about your stay…" /></div>
        </form>
      </Modal>
    </div>
  );
}
