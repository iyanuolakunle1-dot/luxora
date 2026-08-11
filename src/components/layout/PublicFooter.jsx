import { Link } from 'react-router-dom';
import { Crown, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-luxora-surface border-t border-luxora-border pt-14 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center">
              <Crown size={17} className="text-luxora-bg" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-semibold text-luxora-text">LUXORA</p>
              <p className="text-[9px] tracking-[0.2em] text-luxora-gold">HOTELS &amp; RESORTS</p>
            </div>
          </div>
          <p className="text-sm text-luxora-muted leading-relaxed">Experience unmatched luxury, comfort and exceptional hospitality across our collection of world-class properties.</p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-luxora-border flex items-center justify-center text-luxora-gold hover:bg-luxora-gold hover:text-luxora-bg transition-colors">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-luxora-gold font-semibold text-sm tracking-wide mb-4">GET IN TOUCH</h4>
          <ul className="space-y-3 text-sm text-luxora-muted">
            <li className="flex gap-2"><MapPin size={16} className="text-luxora-gold shrink-0 mt-0.5" /> 123 Luxury Avenue, Victoria Island, Lagos, Nigeria.</li>
            <li className="flex gap-2"><Phone size={16} className="text-luxora-gold shrink-0 mt-0.5" /> +234 810 123 4567</li>
            <li className="flex gap-2"><Mail size={16} className="text-luxora-gold shrink-0 mt-0.5" /> info@luxora.com</li>
            <li className="flex gap-2"><Clock size={16} className="text-luxora-gold shrink-0 mt-0.5" /> 24/7 Customer Support</li>
          </ul>
        </div>

        <div>
          <h4 className="text-luxora-gold font-semibold text-sm tracking-wide mb-4">QUICK LINKS</h4>
          <ul className="space-y-3 text-sm text-luxora-muted">
            {[['Rooms & Suites', '/rooms'], ['Facilities', '/facilities'], ['Dining', '/dining'], ['Offers', '/offers'], ['Gallery', '/gallery']].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-luxora-gold transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="bg-luxora-card border border-luxora-border rounded-2xl p-5">
          <h4 className="text-luxora-text font-semibold mb-2">Need Immediate Assistance?</h4>
          <p className="text-sm text-luxora-muted mb-4">Our concierge team is available 24/7 to assist you with anything you need.</p>
          <button className="btn-outline w-full justify-center">Live Chat With Us</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 mt-10 pt-6 border-t border-luxora-border flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-luxora-muted">
        <p>© {new Date().getFullYear()} Luxora Hotels &amp; Resorts. All Rights Reserved.</p>
        <div className="flex gap-5">
          <Link to="/account/login" className="hover:text-luxora-gold">Guest Portal</Link>
          <Link to="/admin/login" className="hover:text-luxora-gold">Staff Portal</Link>
          <Link to="#" className="hover:text-luxora-gold">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
