import { useState, useEffect } from 'react';
import { Camera, Save, Loader2, CheckCircle2, User } from 'lucide-react';
import { useGuestAuth } from '../../context/GuestAuthContext';
import { uploadViaServer } from '../../lib/cloudinary';
import api from '../../lib/api';
import { notify } from '../../lib/toast';

const tabs = ['Personal Information', 'Preferences', 'Security'];

export default function GuestProfile() {
  const { guest, refreshGuest } = useGuestAuth();
  const [tab, setTab] = useState('Personal Information');
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    nationality: '',
    about: '',
    room_preference: '',
    bed_preference: '',
    travel_purpose: '',
    newsletter_opt_in: false,
    avatar_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (guest) {
      setForm({
        full_name: guest.full_name || '',
        phone: guest.phone || '',
        date_of_birth: guest.date_of_birth ? guest.date_of_birth.split('T')[0] : '',
        gender: guest.gender || '',
        nationality: guest.nationality || '',
        about: guest.about || '',
        room_preference: guest.room_preference || '',
        bed_preference: guest.bed_preference || '',
        travel_purpose: guest.travel_purpose || '',
        newsletter_opt_in: guest.newsletter_opt_in || false,
        avatar_url: guest.avatar_url || '',
      });
    }
  }, [guest]);

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadViaServer(file, 'luxora/guest-avatars');
      const newAvatar = res.url;
      setForm((f) => ({ ...f, avatar_url: newAvatar }));
      await api.put('/me', { avatar_url: newAvatar });
      await refreshGuest();
      notify.success('Profile photo updated successfully!');
    } catch {
      notify.error('Photo upload failed. Please try a different image.');
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/me', form);
      await refreshGuest();
      notify.success('Profile updated successfully!');
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (!guest) return null;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-luxora-text">My Profile</h1><p className="text-sm text-luxora-muted mt-1">Manage your personal information and account settings.</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex gap-6 border-b border-luxora-border mb-6 text-sm">
            {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`pb-3 -mb-px border-b-2 font-medium ${tab === t ? 'border-luxora-gold text-luxora-gold' : 'border-transparent text-luxora-muted hover:text-luxora-text'}`}>{t}</button>)}
          </div>

          <form onSubmit={save} className="card p-6 space-y-5">
            {tab === 'Personal Information' && (<>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/5 overflow-hidden relative shrink-0">
                  {form.avatar_url && <img src={form.avatar_url} className="w-full h-full object-cover" alt="" />}
                </div>
                <label className="btn-outline cursor-pointer text-xs">
                  <Camera size={14} /> {uploading ? 'Uploading…' : 'Change Photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </label>
              </div>
              <div><label className="label">Full Name</label><input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><label className="label">Email Address</label><input disabled className="input opacity-60" value={guest.email || ''} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Phone Number</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><label className="label">Date of Birth</label><input type="date" className="input" value={form.date_of_birth || ''} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Gender</label>
                  <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select…</option><option>Male</option><option>Female</option><option>Prefer not to say</option>
                  </select>
                </div>
                <div><label className="label">Nationality</label><input className="input" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} /></div>
              </div>
              <div><label className="label">About You</label><textarea rows={3} maxLength={250} className="input" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} /></div>
            </>)}

            {tab === 'Preferences' && (<>
              <div><label className="label">Room Preference</label><input className="input" placeholder="High floor, Non-smoking…" value={form.room_preference} onChange={(e) => setForm({ ...form, room_preference: e.target.value })} /></div>
              <div><label className="label">Bed Type</label><input className="input" placeholder="King Bed, Twin…" value={form.bed_preference} onChange={(e) => setForm({ ...form, bed_preference: e.target.value })} /></div>
              <div><label className="label">Travel Purpose</label>
                <select className="input" value={form.travel_purpose} onChange={(e) => setForm({ ...form, travel_purpose: e.target.value })}>
                  <option value="">Select…</option><option>Leisure</option><option>Business</option><option>Family</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-luxora-text">
                <input type="checkbox" checked={form.newsletter_opt_in} onChange={(e) => setForm({ ...form, newsletter_opt_in: e.target.checked })} className="accent-luxora-gold w-4 h-4" />
                Subscribe to newsletter and promotional offers
              </label>
            </>)}

            {tab === 'Security' && (
              <p className="text-sm text-luxora-muted">Password changes and two-factor authentication are managed through your Supabase account settings. Contact support if you need help securing your account.</p>
            )}

            {tab !== 'Security' && <button type="submit" disabled={saving} className="btn-primary"><Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}</button>}
          </form>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-luxora-text mb-4">Account Summary</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-luxora-muted">Member Since</span><span className="text-luxora-text font-medium">{new Date(guest.created_at).toLocaleDateString()}</span></li>
              <li className="flex justify-between"><span className="text-luxora-muted">Membership Tier</span><span className="text-luxora-gold font-medium">{guest.membership_tier}</span></li>
              <li className="flex justify-between"><span className="text-luxora-muted">Loyalty Points</span><span className="text-luxora-text font-medium">{guest.loyalty_points}</span></li>
              <li className="flex justify-between"><span className="text-luxora-muted">Total Stays</span><span className="text-luxora-text font-medium">{guest.total_stays}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
