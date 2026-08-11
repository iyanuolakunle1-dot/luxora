import { useEffect, useState } from 'react';
import { Download, Wallet, CalendarCheck, TrendingUp, Tag, Activity, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import RevenueLineChart from '../../components/charts/RevenueLineChart';
import DonutChart from '../../components/charts/DonutChart';
import BarChartBasic from '../../components/charts/BarChartBasic';
import api from '../../lib/api';
import { notify } from '../../lib/toast';

const tabs = ['Overview', 'Reservations', 'Revenue', 'Occupancy', 'Housekeeping', 'Dining', 'Guests', 'Finance'];

export default function Reports() {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard').then(({ data }) => setStats(data)).catch(() => {}),
      api.get('/dashboard/charts').then(({ data }) => setCharts(data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  function handleExport() {
    notify.success('Exporting report data…');
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Total Revenue,${stats?.totalRevenue || 0}\n` +
      `Total Bookings,${stats?.totalBookings || 0}\n` +
      `Total Guests,${stats?.totalGuests || 0}\n` +
      `Occupancy Rate,${stats?.occupancyRate || 0}%\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `luxora_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const revenueLineData = charts?.revenueByDay?.length ? charts.revenueByDay : [
    { label: 'Mon', value: 0 }, { label: 'Tue', value: 0 }, { label: 'Wed', value: 0 },
    { label: 'Thu', value: 0 }, { label: 'Fri', value: 0 }, { label: 'Sat', value: 0 }, { label: 'Sun', value: 0 },
  ];

  const bookingSourceData = charts?.bookingsBySource?.length ? charts.bookingsBySource.map((s, i) => ({
    name: s.name.toUpperCase(),
    value: s.value,
    color: ['#e0a83c', '#10b981', '#38bdf8', '#7c5cfc', '#f472b6'][i % 5],
  })) : [
    { name: 'DIRECT', value: stats?.totalBookings || 1, color: '#e0a83c' },
  ];

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Track performance, analyze trends and make data-driven decisions."
        actions={<button className="btn-primary" onClick={handleExport}><Download size={16} /> Export Report (CSV)</button>} />

      <div className="flex gap-6 overflow-x-auto border-b border-luxora-border mb-6 text-sm">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`pb-3 -mb-px border-b-2 whitespace-nowrap font-medium ${tab === t ? 'border-luxora-gold text-luxora-gold' : 'border-transparent text-luxora-muted hover:text-luxora-text'}`}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Wallet} label="Total Revenue" value={loading ? '—' : `₦${Number(stats?.totalRevenue || 0).toLocaleString()}`} iconColor="text-luxora-gold" iconBg="bg-luxora-gold/15" />
        <StatCard icon={CalendarCheck} label="Total Bookings" value={loading ? '—' : stats?.totalBookings ?? 0} iconColor="text-sky-400" iconBg="bg-sky-500/15" />
        <StatCard icon={TrendingUp} label="Occupancy Rate" value={loading ? '—' : `${stats?.occupancyRate || 0}%`} iconColor="text-violet-400" iconBg="bg-violet-500/15" />
        <StatCard icon={Users} label="Total Guests" value={loading ? '—' : stats?.totalGuests ?? 0} iconColor="text-emerald-400" iconBg="bg-emerald-500/15" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-luxora-text">Revenue (Last 7 Days)</h3>
            <span className="text-xs text-luxora-muted">Live from Bookings</span>
          </div>
          <RevenueLineChart data={revenueLineData} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-luxora-text mb-2">Bookings by Source</h3>
          <div className="flex items-center gap-4">
            <div className="w-36 shrink-0"><DonutChart data={bookingSourceData} total={`${stats?.totalBookings || 0}`} totalLabel="Bookings" height={170} /></div>
            <ul className="text-xs space-y-2 flex-1">
              {bookingSourceData.map((d) => (
                <li key={d.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-luxora-muted"><i className="w-2 h-2 rounded-full inline-block" style={{ background: d.color }} />{d.name}</span>
                  <span className="text-luxora-text font-medium">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
