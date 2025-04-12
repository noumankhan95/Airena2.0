"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative w-full my-10 flex items-center justify-center bg-black text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-4xl bg-gray-900 p-4 md:p-6 rounded-lg shadow-2xl"
      >
        {isPlaying ? (
          <motion.div
            key="video"
            className="relative w-full aspect-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <video
              src="/hero-video.mp4"
              controls
              autoPlay
              className="w-full h-full object-contain rounded-lg shadow-lg"
            />
            {/* Stop Button */}
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-2 right-2 md:top-3 md:right-3 bg-gray-900 bg-opacity-70 p-1.5 md:p-2 rounded-full shadow-lg hover:bg-gray-800 transition-all"
            >
              ✖
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="thumbnail"
            className="relative cursor-pointer group w-full aspect-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsPlaying(true)}
          >
            <img
              src="/heroimg.png"
              alt="Video Thumbnail"
              className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity duration-300"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-erald-green-500 bg-opacity-50 p-3 md:p-4 rounded-full backdrop-blur-md shadow-lg transition-all duration-300">
                <span className="text-3xl md:text-4xl text-white">▶</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default VideoSection;
