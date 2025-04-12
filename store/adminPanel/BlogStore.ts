import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // Ensure correct Firebase import

export const useBlogStore = create(
  persist<BlogStore>(
    (set, get) => ({
      blogs: [],
      lastFetched: null,

      setBlogs: (blogs) => set({ blogs, lastFetched: Date.now() }),

      fetchBlogs: async () => {
        const { lastFetched, blogs } = get();

        if (lastFetched && Date.now() - lastFetched < 30 * 1000) {
          return;
        }

        console.log("Fetching new data...");
        const querySnapshot = await getDocs(collection(db, "blogs"));
        //@ts-ignore

        const newBlogs = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.seconds,
          };
        }) as Blog[];

        set({ blogs: newBlogs, lastFetched: Date.now() });
      },

      getBlogById: (id) => get().blogs.find((blog) => blog.id === id),
    }),
    {
      name: "blog-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBlogStore;
