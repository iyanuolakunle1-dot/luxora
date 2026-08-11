import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Headphones, User, MessageSquare, Tag, Loader2 } from 'lucide-react';
import { PLACEHOLDER } from '../../utils/placeholderImages';
import api from '../../lib/api';
import { notify } from '../../lib/toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact-messages', form);
      notify.success("Message sent! We'll get back to you shortly.");
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Failed to send message');
    } finally { setSending(false); }
  }

  return (
    <div className="pt-20">
      <section className="max-w-7xl mx-auto px-5 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">CONTACT US</p>
          <h1 className="font-display text-4xl text-white mb-4">We'd Love to <span className="text-luxora-gold">Hear From You</span></h1>
          <p className="text-luxora-muted mb-8 max-w-md">Whether you have a question, need assistance, or want to make a reservation, our team is here to help you 24/7.</p>
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="flex items-center gap-3 card px-4 py-3"><Phone size={17} className="text-luxora-gold" /><div><p className="text-xs text-luxora-muted">Call Us</p><p className="text-sm text-luxora-text font-medium">+234 810 123 4567</p></div></div>
            <div className="flex items-center gap-3 card px-4 py-3"><Mail size={17} className="text-luxora-gold" /><div><p className="text-xs text-luxora-muted">Email Us</p><p className="text-sm text-luxora-text font-medium">info@luxora.com</p></div></div>
          </div>
          <img src={PLACEHOLDER.heroContact} className="rounded-2xl w-full h-64 object-cover" alt="Luxora entrance" />
        </div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card p-6 space-y-4">
          <h3 className="text-luxora-gold font-semibold mb-2">Send Us a Message</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative"><User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" /><input required className="input pl-10" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="relative"><Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" /><input required type="email" className="input pl-10" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="relative"><Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" /><input className="input pl-10" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="relative"><Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" /><input className="input pl-10" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
          <div className="relative"><MessageSquare size={15} className="absolute left-3.5 top-3 text-luxora-muted" /><textarea required rows={5} className="input pl-10" placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          <button type="submit" disabled={sending} className="btn-primary w-full justify-center">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} {sending ? 'Sending…' : 'Send Message'}
          </button>
        </motion.form>
      </section>

      <section className="max-w-7xl mx-auto px-5 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card p-5">
          <h4 className="text-luxora-gold font-semibold text-sm tracking-wide mb-4">GET IN TOUCH</h4>
          <ul className="space-y-3 text-sm text-luxora-muted">
            <li className="flex gap-2"><MapPin size={16} className="text-luxora-gold shrink-0 mt-0.5" /> 123 Luxury Avenue, Victoria Island, Lagos, Nigeria.</li>
            <li className="flex gap-2"><Phone size={16} className="text-luxora-gold shrink-0 mt-0.5" /> +234 810 123 4567 / +234 703 987 6543</li>
            <li className="flex gap-2"><Mail size={16} className="text-luxora-gold shrink-0 mt-0.5" /> info@luxora.com</li>
          </ul>
        </div>
        <div className="lg:col-span-1 card p-5 overflow-hidden">
          <h4 className="text-luxora-gold font-semibold text-sm tracking-wide mb-4">OUR LOCATION</h4>
          <iframe title="map" className="w-full h-48 rounded-xl grayscale invert-[0.9]" loading="lazy"
            src="https://www.google.com/maps?q=Victoria%20Island%2C%20Lagos%2C%20Nigeria&output=embed" />
        </div>
        <div className="lg:col-span-1 card p-5 flex flex-col justify-center items-start">
          <Headphones size={22} className="text-luxora-gold mb-3" />
          <h4 className="text-luxora-text font-semibold mb-1">Need Immediate Assistance?</h4>
          <p className="text-sm text-luxora-muted mb-4">Our concierge team is available 24/7 to assist you with anything you need.</p>
          <button className="btn-outline">Live Chat With Us</button>
        </div>
      </section>
    </div>
  );
}
