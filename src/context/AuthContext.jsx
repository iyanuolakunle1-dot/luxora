import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../lib/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'luxora_admin_profile';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfileState] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  function setProfile(newProfile) {
    setProfileState(newProfile);
    try {
      if (newProfile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }

  async function loadProfile() {
    try {
      const { data } = await api.get('/auth/me', { skipCache: true });
      if (data?.profile) {
        setProfile(data.profile);
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
        await loadProfile();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession) {
        await loadProfile();
      } else {
        setProfile(null);
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
    await loadProfile();
  }

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }

  async function refreshProfile() {
    await loadProfile();
  }

  const value = {
    session,
    user: session?.user || null,
    profile,
    setProfile,
    refreshProfile,
    role: profile?.roles?.slug || null,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
