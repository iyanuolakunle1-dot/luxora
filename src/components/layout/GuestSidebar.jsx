import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, CalendarCheck, User, BedDouble, Tag, Star, CreditCard,
  MessageSquareText, Bell, HelpCircle, Settings, Crown, LogOut,
} from 'lucide-react';
import { useGuestAuth } from '../../context/GuestAuthContext';

const nav = [
  { to: '/account', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/account/reservations', label: 'My Reservations', icon: CalendarCheck },
  { to: '/account/profile', label: 'My Profile', icon: User },
  { to: '/account/stays', label: 'My Stays', icon: BedDouble },
  { to: '/account/offers', label: 'Special Offers', icon: Tag },
  { to: '/account/loyalty', label: 'Loyalty Points', icon: Star },
  { to: '/account/payment-methods', label: 'Payment Methods', icon: CreditCard },
  { to: '/account/reviews', label: 'Reviews', icon: MessageSquareText },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
];

const bottomNav = [
  { to: '/account/help', label: 'Help & Support', icon: HelpCircle },
  { to: '/account/settings', label: 'Settings', icon: Settings },
];

export default function GuestSidebar({ mobileOpen, setMobileOpen, unreadCount = 0 }) {
  const { guest, logout } = useGuestAuth();

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 h-screen z-50 w-64 bg-luxora-surface border-r border-luxora-border flex flex-col shrink-0
        transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2 px-5 h-16 border-b border-luxora-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center">
            <Crown size={16} className="text-luxora-bg" />
          </div>
          <div className="leading-tight">
            <p className="font-display font-semibold text-luxora-text text-sm">LUXORA</p>
            <p className="text-[9px] tracking-widest text-luxora-muted">HOTELS &amp; RESORTS</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-luxora-gold/15 text-luxora-gold' : 'text-luxora-muted hover:text-luxora-text hover:bg-white/5'}`}>
              <span className="flex items-center gap-3"><item.icon size={17} /> {item.label}</span>
              {item.to === '/account/notifications' && unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>
              )}
            </NavLink>
          ))}
          <hr className="border-luxora-border my-3" />
          {bottomNav.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive ? 'bg-luxora-gold/15 text-luxora-gold' : 'text-luxora-muted hover:text-luxora-text hover:bg-white/5'}`}>
              <item.icon size={17} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-luxora-border">
          <div className="rounded-xl bg-gradient-to-br from-luxora-gold/15 to-transparent border border-luxora-gold/20 p-4 mb-3">
            <div className="flex items-center gap-1.5 text-luxora-gold text-xs font-semibold mb-1"><Crown size={13} /> LUXORA REWARDS</div>
            <p className="text-sm font-semibold text-luxora-text">{guest?.membership_tier || 'Bronze'} Member</p>
            <p className="text-xs text-luxora-muted mb-3">{guest?.loyalty_points ?? 0} Points Available</p>
            <NavLink to="/account/loyalty" className="btn-primary w-full justify-center !py-2 text-xs">View Rewards</NavLink>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={17} /> Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
