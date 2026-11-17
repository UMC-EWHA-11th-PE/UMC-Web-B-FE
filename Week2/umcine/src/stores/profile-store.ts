import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
interface Profile { nickname: string; email: string; image: string; createdAt?: string }
const emptyProfile: Profile = { nickname: '', email: '', image: '' };
export const useProfileStore = create<{
  profile: Profile; updateProfile: (changes: Partial<Profile>) => void; clearProfile: () => void;
}>()(persist(set => ({
  profile: emptyProfile,
  updateProfile: changes => set(state => ({ profile: { ...state.profile, ...changes } })),
  clearProfile: () => set({ profile: emptyProfile }),
}), { name: 'umcine-profile', storage: createJSONStorage(() => sessionStorage) }));
