import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck, BedDouble, Star, Wallet, MapPin, Calendar, Moon, Users2, ChevronRight, PlusCircle, Edit3, FileText, MessageCircle, Crown } from 'lucide-react';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';

export default function GuestDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/me/dashboard').then(({ data }) => setData(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />) : <>
          <StatBox icon={CalendarCheck} color="text-luxora-gold" bg="bg-luxora-gold/15" label="Upcoming Stay" value={data?.upcomingCount ?? 0} sub="Reservation" link="/account/reservations" />
          <StatBox icon={BedDouble} color="text-violet-400" bg="bg-violet-500/15" label="Total Stays" value={data?.totalStays ?? 0} sub="Stays Completed" link="/account/stays" />
          <StatBox icon={Star} color="text-amber-400" bg="bg-amber-500/15" label="Loyalty Points" value={data?.loyaltyPoints ?? 0} sub="Points Available" link="/account/loyalty" />
          <StatBox icon={Wallet} color="text-emerald-400" bg="bg-emerald-500/15" label="Total Spent" value={`₦${Number(data?.totalSpent ?? 0).toLocaleString()}`} sub="Lifetime Spending" link="/account/stays" />
        </>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-luxora-text mb-4">Upcoming Reservation</h3>
            {loading ? <Skeleton className="h-48 w-full rounded-xl" /> : data?.nextStay ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="h-40 rounded-xl overflow-hidden bg-white/5">{data.nextStay.rooms?.room_number && <div className="w-full h-full flex items-center justify-center text-luxora-muted text-sm">Room {data.nextStay.rooms.room_number}</div>}</div>
                <div>
                  <h4 className="font-semibold text-luxora-text mb-2">{data.nextStay.hotels?.name || 'Luxora Hotel'}</h4>
                  <p className="text-xs text-luxora-muted flex items-center gap-1 mb-3"><MapPin size={12} /> {data.nextStay.hotels?.city}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div><p className="text-luxora-muted flex items-center gap-1"><Calendar size={12} /> Check-in</p><p className="text-luxora-text font-medium">{data.nextStay.check_in}</p></div>
                    <div><p className="text-luxora-muted flex items-center gap-1"><Calendar size={12} /> Check-out</p><p className="text-luxora-text font-medium">{data.nextStay.check_out}</p></div>
                  </div>
                  <p className="text-xs text-luxora-gold font-medium mb-3">Booking ID: {data.nextStay.reservation_code}</p>
                  <Link to="/account/reservations" className="btn-primary !py-2 text-xs">View Reservation</Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-luxora-muted mb-4">You don't have any upcoming reservations yet.</p>
                <Link to="/rooms" className="btn-primary">Book Your Next Stay</Link>
              </div>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-luxora-text">Recent Stays</h3>
              <Link to="/account/stays" className="text-xs text-luxora-gold font-medium">View All →</Link>
            </div>
            {loading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div> : data?.recentStays?.length ? (
              <ul className="divide-y divide-luxora-border">
                {data.recentStays.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-luxora-text">{s.hotels?.name || 'Luxora Hotel'}</p>
                      <p className="text-xs text-luxora-muted">{s.check_in} – {s.check_out} · {s.room_types?.name}</p>
                    </div>
                    <Badge color="green">Completed</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-luxora-muted text-center py-8">No completed stays yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-luxora-text mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <QuickAction icon={PlusCircle} title="Make a New Reservation" sub="Book your next stay" to="/rooms" />
              <QuickAction icon={Edit3} title="Modify / Cancel Reservation" sub="View or change your booking" to="/account/reservations" />
              <QuickAction icon={FileText} title="View My Stays" sub="Get history of past stays" to="/account/stays" />
              <QuickAction icon={MessageCircle} title="Chat with Support" sub="We're here to help 24/7" to="/account/help" />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-luxora-gold/20 to-transparent border border-luxora-gold/30 p-5">
            <Crown size={20} className="text-luxora-gold mb-2" />
            <h3 className="font-semibold text-luxora-text mb-1">Exclusive Member Offers</h3>
            <p className="text-sm text-luxora-muted mb-4">Enjoy up to 20% off on your next booking.</p>
            <Link to="/account/offers" className="btn-primary !py-2 text-xs">Explore Offers</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, color, bg, label, value, sub, link }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${bg} ${color}`}><Icon size={16} /></div>
      <p className="text-xs text-luxora-muted">{label}</p>
      <p className="text-xl font-bold text-luxora-text">{value}</p>
      <p className="text-[11px] text-luxora-muted mt-1">{sub}</p>
      <Link to={link} className="text-[11px] text-luxora-gold font-medium flex items-center gap-0.5 mt-1">View <ChevronRight size={11} /></Link>
    </motion.div>
  );
}

function QuickAction({ icon: Icon, title, sub, to }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="w-9 h-9 rounded-lg bg-luxora-gold/15 text-luxora-gold flex items-center justify-center shrink-0"><Icon size={16} /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-luxora-text">{title}</p>
        <p className="text-xs text-luxora-muted">{sub}</p>
      </div>
      <ChevronRight size={15} className="text-luxora-muted group-hover:text-luxora-gold transition-colors" />
    </Link>
  );
}
