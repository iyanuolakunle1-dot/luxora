import { Bell, Menu, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { profile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 sm:px-6 bg-luxora-bg/90 backdrop-blur border-b border-luxora-border">
      <button className="lg:hidden text-luxora-muted" onClick={onMenuClick}><Menu size={20} /></button>

      <div className="hidden md:flex-1 md:flex items-center min-w-0">
        {title ? (
          <div className="min-w-0">
            <h2 className="font-semibold text-luxora-text truncate">{title}</h2>
            {subtitle && <p className="text-xs text-luxora-muted truncate">{subtitle}</p>}
          </div>
        ) : (
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxora-muted" />
            <input className="input pl-10 !py-2" placeholder="Search anything…" />
          </div>
        )}
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-3 shrink-0">
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-luxora-muted hover:text-luxora-gold hover:bg-white/5 transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">5</span>
        </button>

        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center text-xs font-bold text-luxora-bg">
              {(profile?.full_name || 'A')[0]}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-sm font-semibold text-luxora-text">{profile?.full_name || 'Admin'}</p>
              <p className="text-[11px] text-luxora-muted">{profile?.roles?.name || 'Super Administrator'}</p>
            </div>
            <ChevronDown size={14} className="text-luxora-muted hidden sm:block" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 card p-2 shadow-glow"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/admin/profile');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-luxora-muted hover:text-luxora-text hover:bg-white/5"
                >
                  <User size={15} /> Profile
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/admin/settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-luxora-muted hover:text-luxora-text hover:bg-white/5"
                >
                  <Settings size={15} /> Settings
                </button>
                <hr className="border-luxora-border my-1" />
                <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
                  <LogOut size={15} /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
