import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wifi, Coffee, Wind, Tv, Wine, Users, BedDouble, Ruler, ArrowRight, LayoutGrid, Calendar, CheckCircle2, Loader2, Sparkles, User, Lock, LogIn, UserPlus } from 'lucide-react';
import { PLACEHOLDER } from '../../utils/placeholderImages';
import { getRoomImageUrl } from '../../utils/imageHelper';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { notify } from '../../lib/toast';
import { useGuestAuth } from '../../context/GuestAuthContext';

const amenities = [{ icon: Wifi, label: 'Free Wi-Fi' }, { icon: Coffee, label: 'Breakfast' }, { icon: Wind, label: 'Air Conditioned' }, { icon: Tv, label: 'Smart TV' }, { icon: Wine, label: 'Mini Bar' }];

export default function Rooms() {
  const { session, user, guest, login, signup } = useGuestAuth();
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Quick inline auth state if user chooses to sign up/login inside modal
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Booking form state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [bookingForm, setBookingForm] = useState({
    check_in: tomorrow.toISOString().slice(0, 10),
    check_out: dayAfter.toISOString().slice(0, 10),
    adults: 2,
    children: 0,
    full_name: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Pre-fill user data when guest is logged in
  useEffect(() => {
    if (guest || user) {
      setBookingForm((prev) => ({
        ...prev,
        full_name: guest?.full_name || user?.user_metadata?.full_name || prev.full_name,
        email: guest?.email || user?.email || prev.email,
        phone: guest?.phone || prev.phone,
      }));
    }
  }, [guest, user]);

  useEffect(() => {
    api.get('/room-types', { params: { limit: 50 } })
      .then(({ data }) => setRoomTypes(data?.data || []))
      .catch(() => setRoomTypes([]))
      .finally(() => setLoading(false));
  }, []);

  function toggle(name) {
    setChecked((c) => (c.includes(name) ? c.filter((n) => n !== name) : [...c, name]));
  }

  function openRoomDetails(room) {
    setSelectedRoom(room);
    setBookingSuccess(null);
  }

  async function handleQuickAuth(e) {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        await signup(authEmail, authPassword, authFullName);
        notify.success('Guest account created! You can now complete your booking.');
      } else {
        await login(authEmail, authPassword);
        notify.success('Signed in successfully! Complete your booking below.');
      }
    } catch (err) {
      notify.error(err?.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleBook(e) {
    e.preventDefault();
    if (!selectedRoom) return;

    setSubmitting(true);
    try {
      // If user provided a password to create an account on checkout
      if (!session && !user && authPassword && authPassword.length >= 6) {
        try {
          await signup(bookingForm.email, authPassword, bookingForm.full_name);
        } catch (authErr) {
          // If already registered, attempt login
          try {
            await login(bookingForm.email, authPassword);
          } catch {
            /* continue with direct booking */
          }
        }
      }

      const payload = {
        room_type_id: selectedRoom.id,
        full_name: guest?.full_name || bookingForm.full_name || user?.email?.split('@')[0],
        email: guest?.email || bookingForm.email || user?.email,
        phone: guest?.phone || bookingForm.phone,
        check_in: bookingForm.check_in,
        check_out: bookingForm.check_out,
        adults: bookingForm.adults,
        children: bookingForm.children,
        notes: bookingForm.notes,
      };

      const res = await api.post('/bookings/public-book', payload);
      setBookingSuccess(res.data?.data);
      notify.success('Reservation confirmed successfully!');
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = checked.length ? roomTypes.filter((r) => checked.includes(r.name)) : roomTypes;

  // Nights calculation
  const nights = selectedRoom && bookingForm.check_in && bookingForm.check_out
    ? Math.max(1, Math.ceil((new Date(bookingForm.check_out) - new Date(bookingForm.check_in)) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalPrice = selectedRoom ? nights * Number(selectedRoom.base_rate || 0) : 0;

  return (
    <div className="pt-20">
      <section className="relative h-[52vh] min-h-[380px] flex items-end">
        <img src={PLACEHOLDER.heroRooms} className="absolute inset-0 w-full h-full object-cover" alt="Rooms" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxora-bg via-luxora-bg/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 pb-14 w-full">
          <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">OUR ROOMS &amp; SUITES</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">Comfort Meets Luxury</h1>
          <p className="text-luxora-muted max-w-lg">Indulge in our elegantly designed rooms and suites, crafted for your ultimate comfort and relaxation.</p>
          <div className="flex flex-wrap gap-5 mt-6">
            {amenities.map((a) => (
              <span key={a.label} className="flex items-center gap-2 text-sm text-luxora-muted"><a.icon size={15} className="text-luxora-gold" /> {a.label}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
          </div>
        ) : roomTypes.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="card p-5 h-fit lg:sticky lg:top-24">
              <h3 className="font-semibold text-luxora-text mb-4">Filter Rooms</h3>
              <p className="label">Room Type</p>
              <div className="space-y-2 mb-5">
                {roomTypes.map((r) => (
                  <label key={r.id} className="flex items-center gap-2 text-sm text-luxora-muted cursor-pointer hover:text-luxora-text">
                    <input type="checkbox" checked={checked.includes(r.name)} onChange={() => toggle(r.name)} className="accent-luxora-gold w-4 h-4 rounded" />
                    {r.name}
                  </label>
                ))}
              </div>
              <button className="btn-primary w-full" onClick={() => setChecked([])}>Reset Filters</button>
            </aside>

            <div className="lg:col-span-3">
              <p className="text-sm text-luxora-muted mb-6">Showing {filtered.length} of {roomTypes.length} room types</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.map((r) => (
                  <div key={r.id} className="card overflow-hidden group hover:border-luxora-gold/50 transition-all duration-300">
                    <div className="relative h-52 overflow-hidden bg-white/5 cursor-pointer" onClick={() => openRoomDetails(r)}>
                      <img src={getRoomImageUrl(r.images, r.name)} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-luxora-text mb-2 text-lg">{r.name}</h3>
                      <div className="flex gap-4 text-xs text-luxora-muted mb-3">
                        <span className="flex items-center gap-1"><Users size={13} />{r.max_adults} Guests</span>
                        <span className="flex items-center gap-1"><BedDouble size={13} />King Bed</span>
                        {r.size_sqm && <span className="flex items-center gap-1"><Ruler size={13} />{r.size_sqm} m²</span>}
                      </div>
                      <p className="text-sm text-luxora-muted mb-4 line-clamp-2">{r.description || 'Elegantly appointed room with luxury amenities.'}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-luxora-border">
                        <div>
                          <span className="text-xs text-luxora-muted block">Starting from</span>
                          <p className="text-luxora-gold font-semibold text-base">₦{Number(r.base_rate).toLocaleString()} <span className="text-luxora-muted font-normal text-xs">/night</span></p>
                        </div>
                        <button className="btn-primary !py-2 !px-4 text-xs" onClick={() => openRoomDetails(r)}>
                          Book Room <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState icon={LayoutGrid} title="No rooms published yet"
            message="Room types added from the admin dashboard (Rooms & Rates → Room Types → Add Room Type) will automatically appear here." />
        )}
      </section>

      {/* ROOM DETAILS & BOOKING MODAL */}
      <Modal open={!!selectedRoom} onClose={() => { setSelectedRoom(null); setBookingSuccess(null); }} size="xl"
        title={bookingSuccess ? 'Booking Confirmed!' : (selectedRoom?.name || 'Room Details')}
        footer={!bookingSuccess && (
          <>
            <button className="btn-outline" onClick={() => setSelectedRoom(null)}>Close</button>
            <button className="btn-primary" form="public-book-form" type="submit" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Reserve Room'}
            </button>
          </>
        )}>
        {selectedRoom && (
          bookingSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-luxora-text">Reservation Successful!</h2>
              <p className="text-luxora-muted text-sm max-w-md mx-auto">
                Your reservation for <strong className="text-luxora-gold">{selectedRoom.name}</strong> has been confirmed and saved to your guest record.
              </p>
              <div className="p-4 bg-white/5 border border-luxora-border rounded-xl max-w-sm mx-auto text-left text-sm space-y-2">
                <div className="flex justify-between"><span className="text-luxora-muted">Reservation ID:</span><span className="text-luxora-gold font-mono font-bold">{bookingSuccess.reservation_code}</span></div>
                <div className="flex justify-between"><span className="text-luxora-muted">Check-In:</span><span className="text-luxora-text font-medium">{bookingSuccess.check_in}</span></div>
                <div className="flex justify-between"><span className="text-luxora-muted">Check-Out:</span><span className="text-luxora-text font-medium">{bookingSuccess.check_out}</span></div>
                <div className="flex justify-between"><span className="text-luxora-muted">Total Amount:</span><span className="text-luxora-gold font-bold">₦{Number(bookingSuccess.total_amount || 0).toLocaleString()}</span></div>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button className="btn-outline rounded-full px-6" onClick={() => { setSelectedRoom(null); setBookingSuccess(null); }}>Done</button>
                <Link to="/account/reservations" className="btn-primary rounded-full px-6">View My Reservations</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Room Presentation */}
              <div className="space-y-4">
                <div className="h-48 rounded-2xl overflow-hidden bg-white/5 border border-luxora-border">
                  <img src={getRoomImageUrl(selectedRoom.images, selectedRoom.name)} alt={selectedRoom.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-luxora-text">{selectedRoom.name}</h3>
                  <p className="text-luxora-gold font-semibold text-lg mt-1">₦{Number(selectedRoom.base_rate).toLocaleString()} <span className="text-xs text-luxora-muted font-normal">/ night</span></p>
                </div>
                <p className="text-sm text-luxora-muted leading-relaxed">{selectedRoom.description || 'Experience ultimate luxury with modern amenities, premium bedding, and breathtaking views.'}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-luxora-muted pt-2 border-t border-luxora-border">
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-luxora-gold" /> Max {selectedRoom.max_adults} Adults</span>
                  <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-luxora-gold" /> Premium King Bed</span>
                  {selectedRoom.size_sqm && <span className="flex items-center gap-1.5"><Ruler size={14} className="text-luxora-gold" /> {selectedRoom.size_sqm} m² Area</span>}
                  <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-luxora-gold" /> Luxury Amenities</span>
                </div>
              </div>

              {/* Right Column: Unified Booking Form */}
              <form id="public-book-form" onSubmit={handleBook} className="space-y-3 bg-luxora-card/50 p-4 border border-luxora-border rounded-2xl">
                {session || user ? (
                  <div className="flex items-center justify-between pb-2 border-b border-luxora-border">
                    <span className="text-xs text-luxora-muted flex items-center gap-1.5"><User size={13} className="text-luxora-gold" /> Logged in: <strong className="text-luxora-text">{guest?.full_name || user?.email}</strong></span>
                    <span className="badge bg-emerald-500/15 text-emerald-400 text-[10px]">Verified Member</span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-luxora-gold/10 border border-luxora-gold/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-luxora-text">Have an account?</span>
                    <Link to="/account/login" className="text-luxora-gold font-bold hover:underline flex items-center gap-1">
                      <LogIn size={13} /> Sign In for Member Rates
                    </Link>
                  </div>
                )}

                {/* Contact Fields (shown for unauthenticated guests) */}
                {!session && !user && (
                  <>
                    <div>
                      <label className="label text-xs">Your Full Name</label>
                      <input required className="input text-xs" placeholder="e.g. Adeola Johnson" value={bookingForm.full_name} onChange={(e) => setBookingForm({ ...bookingForm, full_name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="label text-xs">Email Address</label>
                        <input type="email" required className="input text-xs" placeholder="you@example.com" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} />
                      </div>
                      <div>
                        <label className="label text-xs">Phone Number</label>
                        <input required className="input text-xs" placeholder="+234 810..." value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="label text-xs flex items-center justify-between">
                        <span>Account Password (Optional)</span>
                        <span className="text-[10px] text-luxora-muted">Creates your guest portal</span>
                      </label>
                      <input type="password" minLength={6} className="input text-xs" placeholder="Create a password (min 6 chars)" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="label text-xs">Check-in Date</label>
                    <input type="date" required className="input text-xs" value={bookingForm.check_in} onChange={(e) => setBookingForm({ ...bookingForm, check_in: e.target.value })} />
                  </div>
                  <div>
                    <label className="label text-xs">Check-out Date</label>
                    <input type="date" required className="input text-xs" value={bookingForm.check_out} onChange={(e) => setBookingForm({ ...bookingForm, check_out: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="label text-xs">Adults</label>
                    <input type="number" min={1} max={selectedRoom.max_adults || 4} className="input text-xs" value={bookingForm.adults} onChange={(e) => setBookingForm({ ...bookingForm, adults: e.target.value })} />
                  </div>
                  <div>
                    <label className="label text-xs">Children</label>
                    <input type="number" min={0} max={4} className="input text-xs" value={bookingForm.children} onChange={(e) => setBookingForm({ ...bookingForm, children: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="label text-xs">Special Requests / Notes</label>
                  <textarea rows={2} className="input text-xs" placeholder="e.g. Quiet floor, early check-in, honeymoon setup" value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} />
                </div>

                {/* Price summary */}
                <div className="p-3 bg-white/5 rounded-xl border border-luxora-border text-xs space-y-1 mt-2">
                  <div className="flex justify-between text-luxora-muted">
                    <span>{nights} {nights === 1 ? 'night' : 'nights'} × ₦{Number(selectedRoom.base_rate).toLocaleString()}</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-luxora-gold pt-1 border-t border-luxora-border">
                    <span>Total Estimated Price</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </form>
            </div>
          )
        )}
      </Modal>
    </div>
  );
}
