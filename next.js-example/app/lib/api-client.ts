import ky from "ky";

import { useAuthStore } from "../store/auth-store";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const apiClient = ky.create({
  baseUrl: apiBaseUrl ? `${apiBaseUrl.replace(/\/+$/, "")}/` : undefined,
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (!apiBaseUrl) {
          throw new Error("NEXT_PUBLIC_API_BASE_URL이 설정되지 않았어요.");
        }

        const { accessToken } = useAuthStore.getState();

        if (accessToken && !request.headers.has("Authorization")) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        const { accessToken, clearAuth } = useAuthStore.getState();

        if (
          response.status === 401 &&
          accessToken &&
          request.headers.get("Authorization") === `Bearer ${accessToken}`
        ) {
          clearAuth();
        }
      },
    ],
  },
});