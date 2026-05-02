// Auth context — manages user session, profile fetching, and questionnaire sync.
// Uses Supabase for session management and the backend API for profile data.

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { getMe } from '../utils/api';
import API from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) {
        localStorage.setItem('smartschemes_token', s.access_token);
        fetchProfile();
      } else {
        localStorage.removeItem('smartschemes_token');
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s);
        if (s) {
          localStorage.setItem('smartschemes_token', s.access_token);
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            fetchProfile();
          }
        } else {
          localStorage.removeItem('smartschemes_token');
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
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
  };

  const loginUser = async (data) => {
    if (data.token) localStorage.setItem('smartschemes_token', data.token);
    setUser(data.user);
    await syncPendingData();
    try {
      const res = await getMe();
      setUser(res.data?.data || res.data);
    } catch { /* ignore */ }
  };

  const syncPendingData = async () => {
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
  };

  const logoutUser = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem('smartschemes_token');
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
