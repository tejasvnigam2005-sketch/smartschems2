// Auth context — manages user session, profile fetching, and questionnaire sync.
// Uses Supabase for session management and the backend API for profile data.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { getMe } from '../utils/api';
import API from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncPendingData = useCallback(async () => {
    const pending = localStorage.getItem('ss_eligibility');
    if (!pending) return;
    try {
      const qData = JSON.parse(pending);
      if (!qData.age && !qData.state) return;
      await API.put('/auth/preferences', {
        age: qData.age || null,
        income: qData.income || null,
        state: qData.state || '',
        category: qData.category || '',
        occupation: qData.occupation || '',
        gender: qData.gender || '',
        area: qData.area || '',
        disability: !!qData.disability,
      });
      localStorage.removeItem('ss_eligibility');
    } catch {
      // Silently fail — will retry on next login
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await getMe();
      const userData = res.data?.data || res.data;
      setUser(userData);

      if (!userData.hasCompletedProfile) {
        await syncPendingData();
        try {
          const updated = await getMe();
          setUser(updated.data?.data || updated.data);
        } catch { /* ignore */ }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [syncPendingData]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        if (supabase) {
          const { data: { session: s } } = await supabase.auth.getSession();
          if (s && isMounted) {
            setSession(s);
            await fetchProfile();
            return;
          }
        }
        // Fallback: check cookie via /auth/me
        await fetchProfile();
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    let subscription = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, s) => {
        if (!isMounted) return;
        setSession(s);
        if (s) {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            fetchProfile();
          }
        } else {
          setUser(null);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const loginUser = async (data) => {
    if (data.session && supabase) {
      try {
        await supabase.auth.setSession(data.session);
      } catch { /* ignore */ }
    }
    setUser(data.user);
    await syncPendingData();
    try {
      const res = await getMe();
      setUser(res.data?.data || res.data);
    } catch { /* ignore */ }
  };

  const logoutUser = async () => {
    if (supabase) await supabase.auth.signOut();
    try {
      await API.post('/auth/logout');
    } catch { /* ignore — cookie may already be expired */ }
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, loginUser, logoutUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
