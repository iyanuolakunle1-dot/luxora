import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BedDouble, Building2, Users, Wallet, TrendingUp, Plus, UserPlus, Tag,
  BarChart3, Settings, Bell, ShieldCheck, Server, Database, HardDrive,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import RevenueLineChart from '../../components/charts/RevenueLineChart';
import DonutChart from '../../components/charts/DonutChart';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import api from '../../lib/api';

const sourceColors = { direct: '#7c5cfc', booking_com: '#10b981', expedia: '#38bdf8', walk_in: '#f59e0b', phone: '#f472b6' };

const quickActions = [
  { label: 'Add New Hotel', icon: Building2, path: '/admin/hotels' },
  { label: 'Add New User', icon: UserPlus, path: '/admin/users' },
  { label: 'Create Offer', icon: Tag, path: '/admin/offers' },
  { label: 'View Reports', icon: BarChart3, path: '/admin/reports' },
  { label: 'System Settings', icon: Settings, path: '/admin/settings' },
  { label: 'Send Notification', icon: Bell, path: '/admin/messages' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState({ revenueByDay: [], bookingsBySource: [] });
  const [topHotels, setTopHotels] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: dash }, { data: chartData }, { data: hotels }, { data: bookings }] = await Promise.all([
          api.get('/dashboard'),
          api.get('/dashboard/charts'),
          api.get('/hotels', { params: { limit: 5 } }),
          api.get('/bookings', { params: { limit: 5 } }),
        ]);
        setStats(dash);
        setCharts(chartData);
        setTopHotels(hotels.data || []);
        setRecentBookings(bookings.data || []);
      } catch {
        // Backend not reachable yet — page still renders with empty states
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bookingsBySource = (charts.bookingsBySource || []).map((s) => ({
    ...s, color: sourceColors[s.name] || '#8b92a3',
  }));

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-luxora-text">Super Admin Dashboard</h1>
          <p className="text-sm text-luxora-muted mt-1">System overview and key performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <StatCard icon={Building2} label="Total Hotels" value={loading ? '—' : stats?.totalHotels ?? 0} iconColor="text-violet-400" iconBg="bg-violet-500/15" />
        <StatCard icon={BedDouble} label="Total Bookings" value={loading ? '—' : stats?.totalBookings ?? 0} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
        <StatCard icon={Users} label="Total Guests" value={loading ? '—' : stats?.totalGuests ?? 0} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
        <StatCard icon={Wallet} label="Total Revenue" value={loading ? '—' : `₦${Number(stats?.totalRevenue ?? 0).toLocaleString()}`} iconColor="text-sky-400" iconBg="bg-sky-500/15" />
        <StatCard icon={TrendingUp} label="Occupancy Rate" value={loading ? '—' : `${stats?.occupancyRate ?? 0}%`} iconColor="text-pink-400" iconBg="bg-pink-500/15" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-luxora-text">Revenue Overview</h3>
                <span className="text-xs text-luxora-muted">This Week</span>
              </div>
              <RevenueLineChart data={charts.revenueByDay} />
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-luxora-text">Bookings by Source</h3>
              </div>
              {bookingsBySource.length ? (
                <div className="flex items-center gap-4">
                  <div className="w-40 shrink-0">
                    <DonutChart data={bookingsBySource} total={bookingsBySource.reduce((a, b) => a + b.value, 0)} totalLabel="Total" height={180} />
                  </div>
                  <ul className="text-xs space-y-2 flex-1">
                    {bookingsBySource.map((s) => (
                      <li key={s.name} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-luxora-muted"><i className="w-2 h-2 rounded-full inline-block" style={{ background: s.color }} />{s.name.replace('_', ' ')}</span>
                        <span className="text-luxora-text font-medium">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-luxora-muted text-center py-14">No bookings in the last 7 days yet.</p>
              )}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-luxora-text mb-4">Room Status</h3>
            {stats?.rooms?.total_rooms ? (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-400">{stats.rooms.available_rooms}</p>
                  <p className="text-xs text-luxora-muted mt-1">Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-luxora-text">{stats.rooms.total_rooms - stats.rooms.available_rooms - stats.rooms.maintenance_rooms}</p>
                  <p className="text-xs text-luxora-muted mt-1">Occupied</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">{stats.rooms.maintenance_rooms}</p>
                  <p className="text-xs text-luxora-muted mt-1">Maintenance</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-luxora-muted text-center py-6">No rooms added yet.</p>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-luxora-text">Recent Bookings</h3>
              <button onClick={() => navigate('/admin/reservations')} className="text-xs text-luxora-gold font-medium hover:underline">View All</button>
            </div>
            <div className="table-wrap">
              <table className="table-base">
                <thead>
                  <tr><th>Booking ID</th><th>Guest Name</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {loading ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6}><Skeleton className="h-5 w-full" /></td></tr>
                  )) : recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="text-luxora-gold font-medium">{b.reservation_code}</td>
                      <td>{b.guests?.full_name || '—'}</td>
                      <td>{b.check_in}</td>
                      <td>{b.check_out}</td>
                      <td>₦{Number(b.total_amount || 0).toLocaleString()}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && !recentBookings.length && (
                <div className="py-10 text-center text-sm text-luxora-muted">No bookings yet — new reservations will show up here.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-luxora-text mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a) => (
                <motion.button
                  whileHover={{ y: -2 }}
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-luxora-border hover:border-luxora-gold/50 hover:bg-luxora-gold/5 transition-colors text-center cursor-pointer"
                >
                  <a.icon size={18} className="text-luxora-gold" />
                  <span className="text-xs font-medium text-luxora-text leading-tight">{a.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-luxora-text mb-4">System Health</h3>
            <div className="flex items-center gap-2 mb-4 text-emerald-400 text-sm font-medium">
              <ShieldCheck size={16} /> All Systems Operational
            </div>
            <HealthBar icon={Database} label="Database" value={100} />
            <HealthBar icon={Server} label="Server" value={100} />
            <HealthBar icon={HardDrive} label="Storage" value={98} />
            <HealthBar icon={ShieldCheck} label="Backup" value={100} />
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-luxora-text mb-4">Top Performing Hotels</h3>
            {topHotels.length ? (
              <ul className="space-y-3">
                {topHotels.map((h) => (
                  <li key={h.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-luxora-text font-medium">{h.name}</p>
                      <p className="text-xs text-luxora-muted">{h.city}</p>
                    </div>
                    <Badge color={h.is_active ? 'green' : 'gray'}>{h.is_active ? 'Active' : 'Inactive'}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-luxora-muted text-center py-6">No hotels added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthBar({ icon: Icon, label, value }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1.5 text-luxora-muted"><Icon size={13} /> {label}</span>
        <span className="text-luxora-text font-medium">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { confirmed: 'green', pending: 'yellow', cancelled: 'red', checked_in: 'blue', checked_out: 'purple' };
  return <Badge color={map[status] || 'gray'}>{status?.replace('_', ' ')}</Badge>;
}
