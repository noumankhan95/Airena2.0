import { create } from "zustand";

const useInfluencersInfo = create<ProfileState>((set, get) => ({
  uid: "",
  name: "",
  email: "",
  username: "",
  bio: "",
  twitter: "",
  instagram: "",
  youtube: "",
  category: "",
  estimatedEarnings: 0,
  profilePic: "",
  followers: 0,
  setProfile(user) {
    set(user);
  },
}));

export default useInfluencersInfo;
