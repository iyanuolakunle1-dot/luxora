import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

export default function BarChartBasic({ data, dataKey = 'value', xKey = 'label', color = '#7c5cfc', height = 260, unit = '%' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#1f2430" vertical={false} />
        <XAxis dataKey={xKey} stroke="#8b92a3" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#8b92a3" fontSize={12} tickLine={false} axisLine={false} width={40} unit={unit} />
        <Tooltip contentStyle={{ background: '#131722', border: '1px solid #1f2430', borderRadius: 12, fontSize: 12 }} />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={36}>
          <LabelList dataKey={dataKey} position="top" fill="#8b92a3" fontSize={11} formatter={(v) => `${v}${unit}`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
