"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";

const videos = [
  { src: "/v2.mp4", thumbnail: "/heroimg.png" },
  { src: "/v3.mp4", thumbnail: "/heroimg.png" },
  { src: "/v4.mp4", thumbnail: "/heroimg.png" },
];

const VideoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % videos.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);

  return (
    <section className="relative w-full my-10 flex items-center justify-center bg-black text-white p-4">
      <div className="relative w-full max-w-5xl bg-gray-900 p-3 md:p-4 rounded-xl shadow-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key={`video-${currentIndex}`}
              className="relative w-full aspect-video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <video
                src={videos[currentIndex].src}
                controls
                autoPlay
                preload="auto"
                className="w-full h-full object-contain rounded-lg shadow-lg"
              />
              {/* Stop Button (Now Smaller on Desktop) */}
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-2 right-2 md:top-3 md:right-3 bg-gray-900 bg-opacity-70 p-1.5 md:p-2 rounded-full shadow-lg hover:bg-gray-800 transition-all"
              >
                <X size={18} className="text-white md:size-20" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`thumbnail-${currentIndex}`}
              className="relative cursor-pointer w-full aspect-video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={videos[currentIndex].thumbnail}
                alt="Thumbnail"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black bg-opacity-60 p-2 md:p-2 rounded-full shadow-lg transition-all"
                >
                  <Play size={24} className="text-white md:size-26" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons (Now Smaller on Desktop) */}
        {!isPlaying && (
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 md:px-3 transform -translate-y-1/2">
            <button
              onClick={prevSlide}
              className="bg-gray-800 p-1 md:p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
            >
              <ArrowLeft size={14} className="text-white md:size-20" />
            </button>
            <button
              onClick={nextSlide}
              className="bg-gray-800 p-1 md:p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
            >
              <ArrowRight size={14} className="text-white md:size-20" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoSlider;
