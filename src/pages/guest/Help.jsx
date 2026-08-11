import { MessageCircle, Phone, Mail, HelpCircle, ChevronRight } from 'lucide-react';

const faqs = [
  { q: 'How do I modify or cancel a reservation?', a: 'Go to My Reservations, find your booking, and use the Modify Booking button. Cancellations follow the policy shown on your booking confirmation.' },
  { q: 'How do I earn and redeem loyalty points?', a: 'You earn 1 point for every ₦1,000 spent on completed, paid stays. Points are added automatically after checkout and can be viewed on the Loyalty Points page.' },
  { q: 'Is my payment information secure?', a: 'We only store your card brand and last 4 digits for display — full card processing is handled securely by our payment provider.' },
];

export default function GuestHelp() {
  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-luxora-text">Help & Support</h1><p className="text-sm text-luxora-muted mt-1">We're here to assist you anytime.</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-luxora-gold/15 text-luxora-gold flex items-center justify-center"><MessageCircle size={18} /></div><div><p className="text-sm font-semibold text-luxora-text">Chat with Support</p><p className="text-xs text-luxora-muted">Available 24/7</p></div></div>
        <div className="card p-5 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-luxora-gold/15 text-luxora-gold flex items-center justify-center"><Phone size={18} /></div><div><p className="text-sm font-semibold text-luxora-text">Call Us</p><p className="text-xs text-luxora-muted">+234 800 123 4567</p></div></div>
        <div className="card p-5 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-luxora-gold/15 text-luxora-gold flex items-center justify-center"><Mail size={18} /></div><div><p className="text-sm font-semibold text-luxora-text">Email Us</p><p className="text-xs text-luxora-muted">support@luxora.com</p></div></div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-luxora-text mb-4 flex items-center gap-2"><HelpCircle size={16} className="text-luxora-gold" /> Frequently Asked Questions</h3>
        <div className="divide-y divide-luxora-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-luxora-text list-none">
                {f.q}
                <ChevronRight size={15} className="text-luxora-muted group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-sm text-luxora-muted mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
