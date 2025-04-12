import { create } from "zustand";
import Cookies from "js-cookie";
const useOwnersStore = create<DealersOwnersStore>((set, get) => ({
  info: {
    email: "",
    name: "",
    uid: "",
    contactDetails: "",
    vehicles: [],
    interests: [],
    notificationPreferences: {
      liveStream: false,
      newContent: false,
      recommendations: true,
      specialOffers: false,
    },
  },
  setinfo(d) {
    Cookies.set("logged", d.name);
    console.log("in dealers oanel");
    set((state) => ({
      ...state,
      info: {
        email: d.email,
        name: d.name,
        uid: d.uid,
        contactDetails: d.contactDetails,
        vehicles: d.vehicles,
        interests: d.interests || [],
        notificationPreferences: d.notificationPreferences || {
          liveStream: false,
          newContent: false,
          recommendations: true,
          specialOffers: false,
        },
      },
    }));
  },
}));

export default useOwnersStore;
