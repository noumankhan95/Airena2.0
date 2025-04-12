import { create } from "zustand";
import Cookies from "js-cookie";
const useVendorStoreInfo = create<VendorStoreinfo>((set, get) => ({
  info: {
    email: "",
    name: "",
    uid: "",
    contactDetails: "",
  },
  setinfo(d) {
    Cookies.set("vendorName", d.name, { path: "/", expires: 7 });

    set((state) => ({
      ...state,
      info: {
        email: d.email,
        name: d.name,
        uid: d.uid,
        contactDetails: d.contactDetails,
      },
    }));
  },
}));

export default useVendorStoreInfo;
