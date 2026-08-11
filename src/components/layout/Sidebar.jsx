import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Building2, Users, CalendarCheck, UserRound, BedDouble, Tags,
  Sparkles, UtensilsCrossed, Brush, BarChart3, MessageSquareText, Settings,
  FileClock, Globe, Mail, Plug, ChevronLeft, Crown, MailQuestion,
} from 'lucide-react';
import { motion } from 'framer-motion';

const mainNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/hotels', label: 'Hotels', icon: Building2 },
  { to: '/admin/users', label: 'Users & Roles', icon: Users },
  { to: '/admin/reservations', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/guests', label: 'Guests', icon: UserRound },
  { to: '/admin/rooms', label: 'Rooms & Rates', icon: BedDouble },
  { to: '/admin/offers', label: 'Offers & Packages', icon: Tags },
  { to: '/admin/facilities', label: 'Facilities', icon: Sparkles },
  { to: '/admin/dining', label: 'Dining', icon: UtensilsCrossed },
  { to: '/admin/housekeeping', label: 'Housekeeping', icon: Brush },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquareText },
  { to: '/admin/messages', label: 'Contact Messages', icon: MailQuestion },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
];

const systemNav = [
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/logs', label: 'System Logs', icon: FileClock },
  { to: '/admin/website', label: 'Website Management', icon: Globe },
  { to: '/admin/email-templates', label: 'Email Templates', icon: Mail },
  { to: '/admin/integrations', label: 'Integrations', icon: Plug },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <motion.aside
        animate={{ width: collapsed ? 84 : 264 }}
        transition={{ duration: 0.2 }}
        className={`fixed lg:sticky top-0 h-screen z-50 bg-luxora-surface border-r border-luxora-border flex flex-col
          transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} shrink-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-luxora-border shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center shrink-0">
              <Crown size={16} className="text-luxora-bg" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <p className="font-display font-semibold text-luxora-text text-sm">LUXORA</p>
                <p className="text-[9px] tracking-widest text-luxora-muted">HOTELS &amp; RESORTS</p>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex text-luxora-muted hover:text-luxora-gold">
            <motion.span animate={{ rotate: collapsed ? 180 : 0 }}><ChevronLeft size={18} /></motion.span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className={`px-2 text-[10px] font-semibold uppercase tracking-widest text-luxora-muted/70 mb-1 ${collapsed && 'text-center'}`}>{!collapsed ? 'Main' : ''}</p>
          {mainNav.map((item) => <NavItem key={item.to} {...item} collapsed={collapsed} onClick={() => setMobileOpen(false)} />)}
          <p className={`px-2 pt-4 text-[10px] font-semibold uppercase tracking-widest text-luxora-muted/70 mb-1 ${collapsed && 'text-center'}`}>{!collapsed ? 'System' : ''}</p>
          {systemNav.map((item) => <NavItem key={item.to} {...item} collapsed={collapsed} onClick={() => setMobileOpen(false)} />)}
        </nav>
      </motion.aside>
    </>
  );
}

function NavItem({ to, label, icon: Icon, end, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group relative
        ${isActive ? 'bg-luxora-gold/15 text-luxora-gold' : 'text-luxora-muted hover:text-luxora-text hover:bg-white/5'}`
      }
      title={collapsed ? label : undefined}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
