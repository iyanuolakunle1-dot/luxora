import { useState } from 'react';
import { Save, Building2, Bell, Shield, Palette } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { notify } from '../../lib/toast';

const sections = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function Settings() {
  const [active, setActive] = useState('general');

  function save(e) { e.preventDefault(); notify.success('Settings saved'); }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your Luxora system preferences." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="card p-3 h-fit">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${active === s.id ? 'bg-luxora-gold/15 text-luxora-gold' : 'text-luxora-muted hover:bg-white/5 hover:text-luxora-text'}`}>
              <s.icon size={16} /> {s.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 card p-6">
          <form onSubmit={save} className="space-y-5">
            {active === 'general' && (<>
              <div><label className="label">Hotel Group Name</label><input className="input" defaultValue="Luxora Hotels & Resorts" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Support Email</label><input className="input" defaultValue="info@luxora.com" /></div>
                <div><label className="label">Support Phone</label><input className="input" defaultValue="+234 810 123 4567" /></div>
              </div>
              <div><label className="label">Default Currency</label><select className="input"><option>NGN (₦)</option><option>USD ($)</option><option>EUR (€)</option></select></div>
            </>)}
            {active === 'notifications' && (<>
              {['New booking alerts', 'Guest review alerts', 'Low inventory alerts', 'Weekly performance summary'].map((n) => (
                <label key={n} className="flex items-center justify-between p-3 border border-luxora-border rounded-xl">
                  <span className="text-sm text-luxora-text">{n}</span>
                  <input type="checkbox" defaultChecked className="accent-luxora-gold w-4 h-4" />
                </label>
              ))}
            </>)}
            {active === 'security' && (<>
              <div><label className="label">Two-Factor Authentication</label><select className="input"><option>Enabled for all admins</option><option>Optional</option><option>Disabled</option></select></div>
              <div><label className="label">Session Timeout (minutes)</label><input type="number" className="input" defaultValue={60} /></div>
            </>)}
            {active === 'appearance' && (<>
              <div><label className="label">Accent Color</label>
                <div className="flex gap-3">
                  {['#e0a83c', '#7c5cfc', '#10b981', '#38bdf8', '#f472b6'].map((c) => (
                    <button type="button" key={c} className="w-8 h-8 rounded-full border-2 border-white/10" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </>)}
            <button type="submit" className="btn-primary mt-4"><Save size={16} /> Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
