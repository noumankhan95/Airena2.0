"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import herobg from '../../assets/images/heroimg.png';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const CarouselDots = ({ total, active, onDotClick }) => {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full transition-colors duration-300 ${
            active === index ? 'bg-teal-400' : 'bg-white'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

const HeroSection = ({ activeSlide, totalSlides, onDotClick }) => {
  return (
    <div className="relative w-full h-[85vh] sm:h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={herobg}
          alt="Gaming background"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 sm:bg-opacity-50"></div>
      </div>
      
      <div className="relative h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 max-w-6xl mx-auto">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-6"
        >
          The Ultimate Gaming &<br className="hidden sm:block" /> Sports Streaming Platform
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-10"
        >
          Join the next generation of competitive gaming and sports streaming
        </motion.p>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-300 text-sm sm:text-base"
          >
           Join Now
          </motion.button>
          
        </motion.div>
      </div>
      
      <div className="absolute bottom-4 sm:bottom-8 w-full">
        <CarouselDots total={totalSlides} active={activeSlide} onDotClick={onDotClick} />
      </div>
    </div>
  );
};

const SectionWithBackground = () => {
  return (
    <div className="relative w-full h-[85vh] sm:h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/heroimg.png"
          alt="Section background"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black bg-opacity-70 sm:bg-opacity-60"></div>
      </div>

      <div className="relative h-full flex flex-col justify-center items-center px-4 sm:px-8 text-center max-w-4xl mx-auto">
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-6"
        >
          Discover Exclusive Content & Live Events
        </motion.h2>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-sm sm:text-base md:text-lg text-white mb-5 sm:mb-8"
        >
          Stay ahead in the world of gaming and sports entertainment with our premium streaming services.
        </motion.p>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-md transition-colors duration-300 text-sm sm:text-base"
        >
          Learn More
        </motion.button>
      </div>
    </div>
  );
};

const StreamingPlatform = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 6;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);
  
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <HeroSection 
        activeSlide={activeSlide} 
        totalSlides={totalSlides} 
        onDotClick={setActiveSlide} 
      />
      <SectionWithBackground />
    </div>
  );
};

export default StreamingPlatform;