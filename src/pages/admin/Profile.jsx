import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, Shield, Key, Save, Loader2, CheckCircle2, Crown, Calendar, Lock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import api from '../../lib/api';
import { notify } from '../../lib/toast';

export default function AdminProfile() {
  const { profile, user } = useAuth();

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    avatar_url: '',
  });

  const [saving, setSaving] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (profile || user) {
      setForm({
        full_name: profile?.full_name || '',
        email: profile?.email || user?.email || '',
        phone: profile?.phone || '',
        department: profile?.department || 'Executive Management',
        avatar_url: profile?.avatar_url || '',
      });
    }
  }, [profile, user]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', {
        full_name: form.full_name,
        phone: form.phone,
        department: form.department,
        avatar_url: form.avatar_url,
      });
      notify.success('Profile details updated successfully');
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      return notify.error('Password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return notify.error('Passwords do not match');
    }

    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      notify.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      notify.error(err?.message || 'Failed to update password');
    } finally {
      setPwLoading(false);
    }
  }

  const roleName = profile?.roles?.name || 'Super Administrator';
  const roleSlug = profile?.roles?.slug || 'super_admin';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Profile"
        subtitle="Manage your administrator account credentials, personal information, and security."
      />

      {/* Top Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 relative overflow-hidden bg-gradient-to-r from-luxora-surface via-luxora-surface to-luxora-gold/5 border-luxora-gold/20"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center text-luxora-bg text-2xl font-bold font-display shadow-lg shadow-luxora-gold/20 overflow-hidden">
              {form.avatar_url ? (
                <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (form.full_name || 'A')[0]?.toUpperCase()
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-luxora-surface flex items-center justify-center text-[10px] text-white font-bold" title="Active">
              ✓
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-luxora-text font-display truncate">
                {form.full_name || 'Administrator'}
              </h2>
              <span className="badge bg-luxora-gold/20 text-luxora-gold font-semibold flex items-center gap-1 text-xs">
                <Crown size={12} /> {roleName}
              </span>
            </div>
            <p className="text-xs text-luxora-muted mb-3 flex items-center gap-2">
              <Mail size={13} className="text-luxora-gold" /> {form.email}
              <span className="text-luxora-border">•</span>
              <Building2 size={13} className="text-luxora-gold" /> {form.department}
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-luxora-muted/80">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-400" /> Access Level: <strong className="text-luxora-text">Full System Admin</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-luxora-gold" /> Status: <span className="text-emerald-400 font-semibold">Active</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Edit Profile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 card p-6"
        >
          <h3 className="text-base font-semibold text-luxora-text mb-1 flex items-center gap-2">
            <User size={18} className="text-luxora-gold" /> Personal Information
          </h3>
          <p className="text-xs text-luxora-muted mb-6">Update your public staff details and contact info.</p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="input pl-10"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="label">Email Address (Login ID)</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
                  <input
                    type="email"
                    disabled
                    value={form.email}
                    className="input pl-10 opacity-70 cursor-not-allowed bg-white/[0.02]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input pl-10"
                    placeholder="+234 810 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="label">Department</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="input pl-10"
                    placeholder="Executive Management"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label">Avatar Image URL</label>
              <input
                type="url"
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                className="input"
                placeholder="https://images.unsplash.com/... or Cloudinary URL"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-6">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Right Col: Security & Password */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-base font-semibold text-luxora-text mb-1 flex items-center gap-2">
              <Lock size={18} className="text-luxora-gold" /> Change Password
            </h3>
            <p className="text-xs text-luxora-muted mb-5">Update your Supabase authentication password.</p>

            <form onSubmit={handleUpdatePassword} className="space-y-3.5">
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="Min. 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="label">Confirm New Password</label>
                <div className="relative">
                  <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                className="btn-outline w-full justify-center !py-2.5 text-xs text-luxora-gold border-luxora-gold/40 hover:bg-luxora-gold/10 mt-2"
              >
                {pwLoading ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                {pwLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-5 space-y-3 border-luxora-gold/20"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-luxora-gold flex items-center gap-1.5">
              <Crown size={14} /> Role Capabilities
            </p>
            <div className="space-y-2 text-xs text-luxora-muted">
              <p className="flex items-center gap-2 text-luxora-text">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Full Access to Property Management
              </p>
              <p className="flex items-center gap-2 text-luxora-text">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Manage Staff Roles &amp; Permissions
              </p>
              <p className="flex items-center gap-2 text-luxora-text">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Real-time Revenue &amp; Occupancy Reports
              </p>
              <p className="flex items-center gap-2 text-luxora-text">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Override Rates &amp; Booking Allocations
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
