import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function DonutChart({ data, total, totalLabel = 'Total', height = 240 }) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={2} stroke="none">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#131722', border: '1px solid #1f2430', borderRadius: 12, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      {total !== undefined && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-luxora-text">{total}</span>
          <span className="text-xs text-luxora-muted">{totalLabel}</span>
        </div>
      )}
    </div>
  );
}
