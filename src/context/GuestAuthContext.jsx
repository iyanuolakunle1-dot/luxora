import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/api';

const GuestAuthContext = createContext(null);
const STORAGE_KEY = 'luxora_guest_profile';

export function GuestAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [guest, setGuestState] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  function setGuest(newGuest) {
    setGuestState(newGuest);
    try {
      if (newGuest) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newGuest));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }

  async function loadGuest() {
    try {
      const { data } = await api.get('/me', { skipCache: true });
      if (data?.data) {
        setGuest(data.data);
      }
    } catch {
      // safe fallback
    }
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        await loadGuest();
      } else {
        setGuest(null);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession) {
        await loadGuest();
      } else {
        setGuest(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await loadGuest();
  }

  async function signup(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.session) {
      await api.post('/auth/guest-signup', { full_name: fullName }, {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      await loadGuest();
    }
    return data;
  }

  async function logout() {
    await supabase.auth.signOut();
    setGuest(null);
    setSession(null);
  }

  async function refreshGuest() {
    await loadGuest();
  }

  const value = {
    session,
    user: session?.user || null,
    guest,
    setGuest,
    loading,
    login,
    signup,
    logout,
    refreshGuest,
  };

  return <GuestAuthContext.Provider value={value}>{children}</GuestAuthContext.Provider>;
}

export const useGuestAuth = () => useContext(GuestAuthContext);
