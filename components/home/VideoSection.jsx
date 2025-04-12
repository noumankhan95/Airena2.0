"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

const VideoSection = ({ withPagination = false }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = 0; // Reset to start
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => console.error("Playback error:", error));
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-4 md:py-8 px-2 md:px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="relative aspect-video rounded-lg overflow-hidden group shadow-lg">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/hero-video.mp4" // Ensure this file exists in public folder
            type="video/mp4"
            loop
            playsInline
            poster="/video-poster.jpg" // Optional: Add a poster image for better UX
            preload="metadata"
          ></video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity group-hover:bg-opacity-40"></div>

          {/* Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-green-700 text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? 
                <Pause size={isMobile ? 20 : 24} className="ml-0.5" /> : 
                <Play size={isMobile ? 20 : 24} className="ml-1" />
              }
            </button>
          </div>

          {/* Pagination */}
          {withPagination && (
            <div className="absolute bottom-3 md:bottom-6 left-0 right-0 flex justify-center space-x-1 md:space-x-2">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className={`inline-block h-1 md:h-1.5 rounded-full transition-all duration-300 ${
                    i === 0 ? "w-4 md:w-6 bg-white" : "w-1 md:w-1.5 bg-gray-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;