import { create } from "zustand";

interface VideoState {
  videoFile: File | null;
  setVideoFile: (video: File | null) => void;
  thumbnail: File | null;
  setThumbnail: (video: File | null) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videoFile: null,
  setVideoFile: (file) => set({ videoFile: file }),
  thumbnail: null,
  setThumbnail: (file) => set({ thumbnail: file }),
}));
