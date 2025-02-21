import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  userID: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  setUserID: (uid: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setFullName: (fullName: string) => void;
  setEmail: (email: string) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userID: "",
      email: "",
      firstName: "",
      fullName: "",
      lastName: "",
      setUserID: (uid) => set({ userID: uid }),
      setEmail: (email) => set({ email }),
      setFirstName: (firstName) => set({ firstName }),
      setFullName: (fullName) => set({ fullName }),
      setLastName: (lastName) => set({ lastName }),
    }),
    {
      name: "userData",
    }
  )
);
