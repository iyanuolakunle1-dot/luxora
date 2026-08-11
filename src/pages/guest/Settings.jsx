import { useState } from 'react';
import { Save, Bell, Globe } from 'lucide-react';
import { notify } from '../../lib/toast';

export default function GuestSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-luxora-text">Settings</h1><p className="text-sm text-luxora-muted mt-1">Manage your notification and account preferences.</p></div>

      <div className="card p-6 max-w-xl space-y-5">
        <h3 className="font-semibold text-luxora-text flex items-center gap-2"><Bell size={16} className="text-luxora-gold" /> Notification Preferences</h3>
        <label className="flex items-center justify-between p-3 border border-luxora-border rounded-xl">
          <span className="text-sm text-luxora-text">Email me about reservation updates</span>
          <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} className="accent-luxora-gold w-4 h-4" />
        </label>
        <label className="flex items-center justify-between p-3 border border-luxora-border rounded-xl">
          <span className="text-sm text-luxora-text">SMS reminders before check-in</span>
          <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} className="accent-luxora-gold w-4 h-4" />
        </label>

        <h3 className="font-semibold text-luxora-text flex items-center gap-2 pt-2"><Globe size={16} className="text-luxora-gold" /> Language</h3>
        <select className="input"><option>English</option><option>French</option><option>Spanish</option></select>

        <button onClick={() => notify.success('Settings saved')} className="btn-primary"><Save size={15} /> Save Changes</button>
      </div>
    </div>
  );
}
