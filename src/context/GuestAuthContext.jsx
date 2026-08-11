import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/api';

const GuestAuthContext = createContext(null);

export function GuestAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadGuest() {
    try {
      const { data } = await api.get('/me');
      setGuest(data.data);
    } catch {
      setGuest(null);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session) await loadGuest();
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) await loadGuest();
      else setGuest(null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await loadGuest();
  }

  async function signup(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Immediately link this new auth user to a `guests` row.
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
  }

  async function refreshGuest() { await loadGuest(); }

  const value = { session, user: session?.user || null, guest, loading, login, signup, logout, refreshGuest };
  return <GuestAuthContext.Provider value={value}>{children}</GuestAuthContext.Provider>;
}

export const useGuestAuth = () => useContext(GuestAuthContext);
