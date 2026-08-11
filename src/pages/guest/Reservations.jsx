import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Moon, Users2, CalendarCheck, Search, BedDouble, ShieldCheck, Printer } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { getRoomImageUrl } from '../../utils/imageHelper';
import api from '../../lib/api';

const tabs = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function GuestReservations() {
  const [tab, setTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingBooking, setViewingBooking] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/me/bookings', { params: { status: tab } })
      .then(({ data }) => setBookings(data?.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const filtered = bookings.filter((b) =>
    !search || b.hotels?.name?.toLowerCase().includes(search.toLowerCase()) || b.reservation_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-luxora-text">My Reservations</h1>
          <p className="text-sm text-luxora-muted mt-1">Manage your reservations and bookings.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1 bg-luxora-card border border-luxora-border rounded-xl p-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-luxora-gold text-luxora-bg' : 'text-luxora-muted hover:text-luxora-text'}`}>{t.label}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
          <input className="input pl-10" placeholder="Search reservations…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}</div>
      ) : filtered.length ? (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="card p-5 flex flex-col sm:flex-row gap-5 hover:border-luxora-gold/40 transition-colors">
              <div className="w-full sm:w-48 h-32 rounded-xl bg-white/5 shrink-0 overflow-hidden border border-luxora-border">
                <img src={getRoomImageUrl(b.room_types?.images, b.room_types?.name)} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <h3 className="font-semibold text-luxora-text text-base">{b.hotels?.name || 'Grand Luxora Hotel'}</h3>
                    <p className="text-xs text-luxora-muted flex items-center gap-1 mt-0.5"><MapPin size={12} /> {b.hotels?.city || 'Victoria Island, Lagos'}</p>
                  </div>
                  <Badge color={tab === 'cancelled' ? 'red' : tab === 'completed' ? 'green' : 'yellow'}>{tab}</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                  <div><p className="text-luxora-muted flex items-center gap-1"><Calendar size={12} /> Check-in</p><p className="text-luxora-text font-medium">{b.check_in}</p></div>
                  <div><p className="text-luxora-muted flex items-center gap-1"><Calendar size={12} /> Check-out</p><p className="text-luxora-text font-medium">{b.check_out}</p></div>
                  <div><p className="text-luxora-muted flex items-center gap-1"><Moon size={12} /> Nights</p><p className="text-luxora-text font-medium">{b.nights || 1} Night(s)</p></div>
                  <div><p className="text-luxora-muted flex items-center gap-1"><Users2 size={12} /> Guests</p><p className="text-luxora-text font-medium">{b.adults || 1} Adults, {b.children || 0} Child</p></div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-luxora-border">
                  <div className="text-xs"><span className="text-luxora-muted">Booking ID: </span><span className="text-luxora-gold font-mono font-bold">{b.reservation_code}</span> · <span className="text-luxora-gold font-bold">₦{Number(b.total_amount || 0).toLocaleString()}</span></div>
                  <button className="btn-outline !py-1.5 !px-3 text-xs" onClick={() => setViewingBooking(b)}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={CalendarCheck} title={`No ${tab} reservations`} message="Your reservations will show up here as soon as they're made — by you or by our front desk team."
          action={<Link to="/rooms" className="btn-primary">Book a Room</Link>} />
      )}

      {/* VIEW DETAILS MODAL */}
      <Modal open={!!viewingBooking} onClose={() => setViewingBooking(null)} title="Reservation Details" size="lg"
        footer={<>
          <button className="btn-outline" onClick={() => window.print()}><Printer size={15} /> Print Receipt</button>
          <button className="btn-primary" onClick={() => setViewingBooking(null)}>Close</button>
        </>}>
        {viewingBooking && (
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-luxora-border rounded-xl">
              <div>
                <span className="text-xs text-luxora-muted block">Reservation Code</span>
                <span className="text-luxora-gold font-mono font-bold text-lg">{viewingBooking.reservation_code}</span>
              </div>
              <Badge color={viewingBooking.payment_status === 'paid' ? 'green' : 'yellow'}>{viewingBooking.payment_status?.toUpperCase()}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl space-y-1">
                <p className="text-xs text-luxora-muted">Hotel / Property</p>
                <p className="text-luxora-text font-semibold">{viewingBooking.hotels?.name || 'Grand Luxora Hotel'}</p>
                <p className="text-xs text-luxora-muted">{viewingBooking.hotels?.city || 'Victoria Island, Lagos, Nigeria'}</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl space-y-1">
                <p className="text-xs text-luxora-muted">Room & Category</p>
                <p className="text-luxora-text font-semibold">{viewingBooking.room_types?.name || 'Luxury Suite'}</p>
                <p className="text-xs text-luxora-gold">{viewingBooking.rooms?.room_number ? `Assigned Room: #${viewingBooking.rooms.room_number}` : 'Room assigned on arrival'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Check-In</p>
                <p className="text-luxora-text font-medium mt-1">{viewingBooking.check_in}</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Check-Out</p>
                <p className="text-luxora-text font-medium mt-1">{viewingBooking.check_out}</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Stay Duration</p>
                <p className="text-luxora-text font-medium mt-1">{viewingBooking.nights || 1} Night(s)</p>
              </div>
              <div className="p-3 bg-white/5 border border-luxora-border rounded-xl">
                <p className="text-xs text-luxora-muted">Guests</p>
                <p className="text-luxora-text font-medium mt-1">{viewingBooking.adults || 1} Adult, {viewingBooking.children || 0} Child</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-luxora-border rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-luxora-muted block">Total Stay Cost</span>
                <span className="text-xs text-emerald-400">Includes all taxes & resort fees</span>
              </div>
              <span className="text-2xl font-bold text-luxora-gold">₦{Number(viewingBooking.total_amount || 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
