import { FileClock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';

const logs = [
  { action: 'New admin user created', time: '2 mins ago', color: 'green' },
  { action: 'Hotel "Grand Luxora" added', time: '15 mins ago', color: 'blue' },
  { action: 'Rate updated for Deluxe Room', time: '1 hour ago', color: 'purple' },
  { action: 'Backup completed successfully', time: '2 hours ago', color: 'green' },
  { action: 'Bulk email sent to 1,230 guests', time: '3 hours ago', color: 'yellow' },
];

export default function SystemLogs() {
  return (
    <div>
      <PageHeader title="System Logs" subtitle="Audit trail of actions taken across your Luxora system." />
      <div className="card p-5">
        <ul className="divide-y divide-luxora-border">
          {logs.map((l, i) => (
            <li key={i} className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full bg-${l.color}-400`} style={{ background: { green: '#10b981', blue: '#38bdf8', purple: '#7c5cfc', yellow: '#f59e0b' }[l.color] }} />
                <p className="text-sm text-luxora-text">{l.action}</p>
              </div>
              <span className="text-xs text-luxora-muted">{l.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
