import { useEffect, useState } from 'react';
import { BedDouble, MapPin, Calendar, Moon, Search, Star, Printer } from 'lucide-react';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { getRoomImageUrl } from '../../utils/imageHelper';

const tabs = [{ id: 'all', label: 'All Stays' }, { id: 'completed', label: 'Completed' }, { id: 'cancelled', label: 'Cancelled' }];

export default function GuestStays() {
  const [tab, setTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingStay, setViewingStay] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/me/bookings', { params: tab === 'all' ? {} : { status: tab } })
      .then(({ data }) => setBookings(data?.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const filtered = bookings.filter((b) => !search || b.hotels?.name?.toLowerCase().includes(search.toLowerCase()) || b.reservation_code?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-luxora-text">My Stays</h1>
        <p className="text-sm text-luxora-muted mt-1">Here's a summary of all your past and completed stays.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1 bg-luxora-card border border-luxora-border rounded-xl p-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-luxora-gold text-luxora-bg' : 'text-luxora-muted hover:text-luxora-text'}`}>{t.label}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
          <input className="input pl-10" placeholder="Search stays…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}</div>
      ) : filtered.length ? (
        <div className="space-y-4">
          {filtered.map((s) => (
            <div key={s.id} className="card p-5 flex flex-col sm:flex-row gap-5 items-start hover:border-luxora-gold/40 transition-colors">
              <div className="w-full sm:w-40 h-28 rounded-xl bg-white/5 shrink-0 overflow-hidden border border-luxora-border">
                <img src={getRoomImageUrl(s.room_types?.images, s.room_types?.name)} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                  <h3 className="font-semibold text-luxora-text flex items-center gap-2">{s.hotels?.name || 'Grand Luxora Hotel'} {s.status === 'checked_out' && <span className="flex text-amber-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></span>}</h3>
                  <Badge color={s.status === 'cancelled' ? 'red' : 'green'}>{s.status === 'checked_out' ? 'Completed' : s.status?.replace('_', ' ')}</Badge>
                </div>
                <p className="text-xs text-luxora-muted flex items-center gap-1 mb-3"><MapPin size={12} /> {s.hotels?.city || 'Victoria Island, Lagos'}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                  <div><p className="text-luxora-muted flex items-center gap-1"><Calendar size={12} /> Check-in</p><p className="text-luxora-text font-medium">{s.check_in}</p></div>
                  <div><p className="text-luxora-muted flex items-center gap-1"><Calendar size={12} /> Check-out</p><p className="text-luxora-text font-medium">{s.check_out}</p></div>
                  <div><p className="text-luxora-muted flex items-center gap-1"><Moon size={12} /> Duration</p><p className="text-luxora-text font-medium">{s.nights || 1} Nights</p></div>
                  <div><p className="text-luxora-muted">Room Type</p><p className="text-luxora-text font-medium">{s.room_types?.name || '—'}</p></div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-luxora-border">
                  <span className="text-xs text-luxora-muted">Booking ID <span className="text-luxora-gold font-mono font-medium">{s.reservation_code}</span> · <span className="text-luxora-gold font-bold">₦{Number(s.total_amount || 0).toLocaleString()}</span></span>
                  <button className="btn-outline !py-1.5 !px-3 text-xs" onClick={() => setViewingStay(s)}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={BedDouble} title="No stays yet" message="Once you complete a stay with us, it will appear here." />
      )}

      {/* STAY DETAILS MODAL */}
      <Modal open={!!viewingStay} onClose={() => setViewingStay(null)} title="Stay Details & Receipt" size="lg"
        footer={<>
          <button className="btn-outline" onClick={() => window.print()}><Printer size={15} /> Print Receipt</button>
          <button className="btn-primary" onClick={() => setViewingStay(null)}>Close</button>
        </>}>
        {viewingStay && (
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-luxora-border rounded-xl">
              <div>
                <span className="text-xs text-luxora-muted block">Stay Reservation Code</span>
                <span className="text-luxora-gold font-mono font-bold text-lg">{viewingStay.reservation_code}</span>
              </div>
              <Badge color={viewingStay.status === 'checked_out' ? 'green' : 'blue'}>{viewingStay.status?.toUpperCase()}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl space-y-1">
                <p className="text-xs text-luxora-muted">Property</p>
                <p className="text-luxora-text font-semibold">{viewingStay.hotels?.name || 'Grand Luxora Hotel'}</p>
                <p className="text-xs text-luxora-muted">{viewingStay.hotels?.city || 'Victoria Island, Lagos, Nigeria'}</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl space-y-1">
                <p className="text-xs text-luxora-muted">Accommodation</p>
                <p className="text-luxora-text font-semibold">{viewingStay.room_types?.name || 'Deluxe Room'}</p>
                <p className="text-xs text-luxora-gold">{viewingStay.rooms?.room_number ? `Room #${viewingStay.rooms.room_number}` : 'Room assigned during stay'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <span className="text-luxora-muted block">Check-in Date</span>
                <span className="text-luxora-text font-medium text-sm mt-1 block">{viewingStay.check_in}</span>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <span className="text-luxora-muted block">Check-out Date</span>
                <span className="text-luxora-text font-medium text-sm mt-1 block">{viewingStay.check_out}</span>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <span className="text-luxora-muted block">Total Paid</span>
                <span className="text-luxora-gold font-bold text-sm mt-1 block">₦{Number(viewingStay.total_amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
