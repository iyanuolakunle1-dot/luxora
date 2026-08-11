import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useGuestAuth } from '../../context/GuestAuthContext';
import { notify } from '../../lib/toast';

export default function GuestSignup() {
  const { signup } = useGuestAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signup(form.email, form.password, form.name);
      if (result.session) {
        notify.success('Account created — welcome to Luxora!');
        navigate('/account');
      } else {
        notify.success('Check your email to confirm your account, then sign in.');
        navigate('/account/login');
      }
    } catch (err) {
      notify.error(err.message || 'Could not create account');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxora-bg px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-luxora-gold/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-luxora-purple/10 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center mb-3">
            <Crown size={26} className="text-luxora-bg" />
          </div>
          <h1 className="font-display text-xl font-semibold text-luxora-text">LUXORA</h1>
          <p className="text-xs tracking-[0.2em] text-luxora-gold">GUEST PORTAL</p>
        </div>

        <h2 className="text-lg font-semibold text-luxora-text mb-1">Create Your Account</h2>
        <p className="text-sm text-luxora-muted mb-6">Join Luxora Rewards and manage your stays in one place.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative"><User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-10" placeholder="John Smith" /></div>
          </div>
          <div>
            <label className="label">Email Address</label>
            <div className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-10" placeholder="you@email.com" /></div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative"><Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
              <input type={showPw ? 'text' : 'password'} required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-10 pr-10" placeholder="At least 6 characters" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-luxora-muted">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">{loading ? 'Creating account…' : 'Create Account'}</button>
        </form>

        <p className="text-center text-sm text-luxora-muted mt-6">
          Already have an account? <Link to="/account/login" className="text-luxora-gold font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
