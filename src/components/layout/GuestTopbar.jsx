import { Menu, Bell, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGuestAuth } from '../../context/GuestAuthContext';

export default function GuestTopbar({ title, subtitle, onMenuClick, unreadCount = 0 }) {
  const { guest } = useGuestAuth();
  const firstName = guest?.full_name?.split(' ')[0] || 'Guest';

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 sm:px-6 bg-luxora-bg/90 backdrop-blur border-b border-luxora-border">
      <button className="lg:hidden text-luxora-muted" onClick={onMenuClick}><Menu size={20} /></button>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-luxora-text truncate">{title || `Welcome back, ${firstName}! 👋`}</h2>
        {subtitle && <p className="text-xs text-luxora-muted truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link to="/account/notifications" className="relative w-9 h-9 rounded-xl flex items-center justify-center text-luxora-muted hover:text-luxora-gold hover:bg-white/5 transition-colors">
          <Bell size={18} />
          {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">{unreadCount}</span>}
        </Link>
        <Link to="/account/profile" className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center text-xs font-bold text-luxora-bg overflow-hidden">
            {guest?.avatar_url ? <img src={guest.avatar_url} className="w-full h-full object-cover" alt="" /> : firstName[0]}
          </div>
          <ChevronDown size={14} className="text-luxora-muted hidden sm:block" />
        </Link>
      </div>
    </header>
  );
}
