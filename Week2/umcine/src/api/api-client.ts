import ky from 'ky';
import { env } from '../config/env';
import { useAuthStore } from '@/stores/auth-store';
export const apiClient = ky.create({
  baseUrl: `${env.apiBaseUrl.replace(/\/+$/, '')}/`,
  retry: 0,
  hooks: {
    beforeRequest: [({ request }) => {
      const token = useAuthStore.getState().accessToken;
      if (token && !request.headers.has('Authorization')) request.headers.set('Authorization', `Bearer ${token}`);
    }],
    afterResponse: [({ request, response }) => {
      if (response.status === 401 && request.headers.get('Authorization') === `Bearer ${useAuthStore.getState().accessToken}`) useAuthStore.getState().clearAuth();
    }],
  },
});
