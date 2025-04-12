import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure correct Firebase import

export const useVendorstore = create(
  persist<VendorStore>(
    (set, get) => ({
      Vendors: [],
      lastFetched: null,

      setVendors: (Vendors) => set({ Vendors, lastFetched: Date.now() }),

      fetchVendor: async () => {
        const { lastFetched, Vendors } = get();

        if (lastFetched && Date.now() - lastFetched < 30 * 1000) {
          return;
        }

        console.log("Fetching new data...");
        const querySnapshot = await getDocs(collection(db, "vendors"));
        //@ts-ignore

        const newVendors = querySnapshot.docs.map((doc) => {
          console.log(doc.data().createdAt.seconds);
          console.log(doc.data().createdAt.toMillis());

          return {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.seconds,
          };
        }) as Vendor[];

        set({ Vendors: newVendors, lastFetched: Date.now() });
      },
      deleteVendorAccount(id) {
        
      },
      getVendorId: (id) => get().Vendors.find((blog) => blog.id === id),
    }),
    {
      name: "vendor-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useVendorstore;
