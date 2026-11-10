//토큰만 sessionStorage에 저장하고, 유저 정보는 zustand store에 저장

import { create } from "zustand";
import{ persist ,createJSONStorage} from "zustand/middleware";

interface AuthStore{
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    clearAuth:()=>void;
}

export const useAuthStore = create<AuthStore>()(
persist((set) => ({
    accessToken: null,
    setAccessToken: (accessToken) => set({ accessToken }),
    clearAuth: () => set({ accessToken: null }),   
}), {
    name: "umcine-auth",
    storage: createJSONStorage(() => sessionStorage),
    partialize: (state) => ({ accessToken: state.accessToken }), // accessToken만 저장
})
);