import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure correct Firebase import

export const useInfluencerStore = create(
  persist<InfluencerStore>(
    (set, get) => ({
      Influencers: [],
      lastFetched: null,

      setInfluencers: (Influencers) =>
        set({ Influencers, lastFetched: Date.now() }),

      fetchInfluencers: async () => {
        const { lastFetched, Influencers } = get();

        if (lastFetched && Date.now() - lastFetched < 30 * 1000) {
          return;
        }

        console.log("Fetching new data...");
        const querySnapshot = await getDocs(collection(db, "influencers"));
        //@ts-ignore

        const newinfluencers = querySnapshot.docs.map((doc) => {
          console.log(doc.data().createdAt.seconds);
          console.log(doc.data().createdAt.toMillis());

          return {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.seconds,
          };
        }) as Influencer[];

        set({ Influencers: newinfluencers, lastFetched: Date.now() });
      },

      getInfluencerById: (id) =>
        get().Influencers.find((blog) => blog.id === id),
    }),
    {
      name: "influencer-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useInfluencerStore;
