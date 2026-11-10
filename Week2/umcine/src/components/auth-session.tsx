import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { readToken } from '@/api/session';
import { useQueryClient } from '@tanstack/react-query';
export function AuthSession() {
  const token = useAuthStore(state => state.accessToken);
  const client = useQueryClient();
  useEffect(() => {
    const claims = readToken(token);
    if (!claims) {
      if (token) useAuthStore.getState().clearAuth();
      useProfileStore.getState().clearProfile();
      client.removeQueries({ queryKey: ['ratings'] });
      return;
    }
    // Sessions created before profile persistence was added need a fresh login.
    if (useProfileStore.getState().profile.email !== claims.email) {
      useAuthStore.getState().clearAuth();
      return;
    }
    const timer = window.setTimeout(() => useAuthStore.getState().clearAuth(), Math.min(claims.exp * 1000 - Date.now(), 2147483647));
    return () => window.clearTimeout(timer);
  }, [token, client]);
  return null;
}
