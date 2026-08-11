import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function RevenueLineChart({ data, dataKey = 'value', xKey = 'label', color = '#e0a83c', height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1f2430" vertical={false} />
        <XAxis dataKey={xKey} stroke="#8b92a3" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#8b92a3" fontSize={12} tickLine={false} axisLine={false} width={50}
          tickFormatter={(v) => (v >= 1000000 ? `₦${v / 1000000}M` : v >= 1000 ? `₦${v / 1000}K` : v)} />
        <Tooltip
          contentStyle={{ background: '#131722', border: '1px solid #1f2430', borderRadius: 12, fontSize: 12 }}
          labelStyle={{ color: '#8b92a3' }}
          formatter={(v) => [`₦${Number(v).toLocaleString()}`, 'Revenue']}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} fill="url(#revenueFill)" dot={{ r: 3, fill: color }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
