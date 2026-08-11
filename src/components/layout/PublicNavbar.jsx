import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Crown, User, Calendar, LogOut, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGuestAuth } from '../../context/GuestAuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/dining', label: 'Dining' },
  { to: '/offers', label: 'Offers' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicNavbar() {
  const { guest, user, session, logout } = useGuestAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [guestDropdown, setGuestDropdown] = useState(false);

  // Track scroll position to adjust navbar background
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll(); // initial check
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock background body scroll when mobile menu is open to prevent jitter / jumping
  useEffect(() => {
    if (open) {
      const origOverflow = document.body.style.overflow;
      const origPosition = document.body.style.position;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
        document.body.style.position = origPosition;
      };
    }
  }, [open]);

  // Auto-close menu when navigating to another route
  useEffect(() => {
    setOpen(false);
    setGuestDropdown(false);
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    setGuestDropdown(false);
    navigate('/');
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-luxora-bg/95 backdrop-blur-md border-b border-luxora-border py-3 shadow-lg shadow-black/30'
            : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center shadow-md shadow-luxora-gold/20 group-hover:scale-105 transition-transform">
              <Crown size={17} className="text-luxora-bg" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-semibold text-luxora-text text-base tracking-wide">LUXORA</p>
              <p className="text-[9px] tracking-[0.2em] text-luxora-gold">HOTELS &amp; RESORTS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium pb-1 border-b-2 transition-all ${
                    isActive
                      ? 'text-luxora-gold border-luxora-gold font-semibold'
                      : 'text-luxora-text/90 border-transparent hover:text-luxora-gold'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Guest Auth Indicator */}
            {session && (guest || user) ? (
              <div className="relative">
                <button
                  onClick={() => setGuestDropdown(!guestDropdown)}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs text-luxora-text py-1.5 px-2.5 sm:px-3 rounded-full border border-luxora-gold/40 bg-luxora-gold/10 hover:bg-luxora-gold/20 transition-colors"
                  title="Guest Menu"
                >
                  <div className="w-5 h-5 rounded-full bg-luxora-gold text-luxora-bg flex items-center justify-center font-bold text-[10px]">
                    {(guest?.full_name || user?.email)?.[0]?.toUpperCase() || 'G'}
                  </div>
                  <span className="font-medium max-w-[80px] sm:max-w-[100px] truncate hidden xs:inline">
                    {guest?.full_name || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={13} className="text-luxora-gold" />
                </button>

                <AnimatePresence>
                  {guestDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-52 card p-2 z-50 shadow-2xl border border-luxora-border"
                    >
                      <div className="p-2.5 border-b border-luxora-border text-xs">
                        <p className="font-bold text-luxora-text truncate">{guest?.full_name || 'Guest'}</p>
                        <p className="text-luxora-muted text-[10px] truncate">{user?.email || guest?.email}</p>
                        <span className="inline-block mt-1 badge bg-luxora-gold/20 text-luxora-gold text-[10px]">
                          {guest?.membership_tier || 'Bronze'} Member
                        </span>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setGuestDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-luxora-text hover:bg-white/5 transition-colors mt-1"
                      >
                        <User size={14} className="text-luxora-gold" /> Guest Dashboard
                      </Link>
                      <Link
                        to="/account/reservations"
                        onClick={() => setGuestDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-luxora-text hover:bg-white/5 transition-colors"
                      >
                        <Calendar size={14} className="text-emerald-400" /> My Reservations
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-white/5 transition-colors text-left"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/account/login"
                className="flex items-center gap-1.5 text-xs text-luxora-text/90 hover:text-luxora-gold transition-colors py-1.5 px-3 rounded-full border border-luxora-border hover:border-luxora-gold/50"
                title="Sign In / Register"
              >
                <User size={14} className="text-luxora-gold" />
                <span className="hidden xs:inline">Sign In</span>
              </Link>
            )}

            <Link
              to="/rooms"
              className="inline-flex btn-primary !py-1.5 sm:!py-2 !px-3.5 sm:!px-5 rounded-full shadow-md shadow-luxora-gold/15 text-xs font-semibold"
            >
              Book Room
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-luxora-text hover:text-luxora-gold hover:bg-white/5 active:scale-95 transition-all ml-0.5"
              onClick={() => setOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Rendered outside header to prevent backdrop-filter containing block bug) */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-luxora-bg border-l border-luxora-border shadow-2xl flex flex-col h-[100dvh] overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-luxora-border shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold-gradient bg-gradient-to-br from-luxora-gold-light to-luxora-gold-dark flex items-center justify-center">
                    <Crown size={16} className="text-luxora-bg" />
                  </div>
                  <div className="leading-tight">
                    <span className="font-display text-base text-luxora-text font-bold tracking-wide">LUXORA</span>
                    <p className="text-[8px] tracking-[0.2em] text-luxora-gold">HOTELS &amp; RESORTS</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-luxora-muted hover:text-luxora-text hover:bg-white/5 active:scale-95 transition-all"
                  aria-label="Close Navigation Menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 px-6 py-5 overflow-y-auto space-y-6">
                {/* Mobile Guest Account Section */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-luxora-border">
                  {session && (guest || user) ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-luxora-gold text-luxora-bg flex items-center justify-center font-bold text-sm shrink-0">
                          {(guest?.full_name || user?.email)?.[0]?.toUpperCase() || 'G'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-luxora-text text-sm truncate">{guest?.full_name || 'Guest'}</p>
                          <p className="text-xs text-luxora-muted truncate">{user?.email || guest?.email}</p>
                          <span className="inline-block mt-0.5 text-[10px] text-luxora-gold font-medium">
                            {guest?.membership_tier || 'Bronze'} Member
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-luxora-border/60">
                        <Link
                          to="/account"
                          onClick={() => setOpen(false)}
                          className="btn-outline !py-2 text-xs justify-center"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/account/reservations"
                          onClick={() => setOpen(false)}
                          className="btn-outline !py-2 text-xs justify-center text-luxora-gold"
                        >
                          Reservations
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-xs text-luxora-muted">Access your member rates, past stays, and reservations.</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/account/login"
                          onClick={() => setOpen(false)}
                          className="btn-primary !py-2 text-xs justify-center font-semibold"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/account/signup"
                          onClick={() => setOpen(false)}
                          className="btn-outline !py-2 text-xs justify-center"
                        >
                          Register
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col space-y-1">
                  <p className="text-[10px] font-semibold tracking-wider text-luxora-muted uppercase px-3 mb-1">Navigation</p>
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end={l.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-luxora-gold/15 text-luxora-gold font-semibold'
                            : 'text-luxora-text/90 hover:text-luxora-gold hover:bg-white/5'
                        }`
                      }
                    >
                      <span>{l.label}</span>
                      <span className="text-luxora-muted/40 text-xs">→</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-6 border-t border-luxora-border bg-luxora-bg/95 shrink-0">
                <Link
                  to="/rooms"
                  onClick={() => setOpen(false)}
                  className="btn-primary rounded-full w-full justify-center !py-3 shadow-lg shadow-luxora-gold/20 text-sm font-semibold"
                >
                  Book a Room Now
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
