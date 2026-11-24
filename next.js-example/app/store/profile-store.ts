import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Profile = {
  email: string;
  nickname: string;
};

type ProfileStore = {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: "umcine-profile",
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => window.sessionStorage),
    },
  ),
);