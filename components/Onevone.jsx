'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import tanner from '../assets/images/Tanner.png'
import tyl from '../assets/images/Tyler.png'
import  ty2 from '../assets/images/gamer-1.png'
import  ty3 from '../assets/images/gamer-2.png'

export default function TournamentMatchup() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="relative flex items-center justify-center bg-black min-h-screen p-4 md:p-6"
    >
      <div className="relative w-full max-w-6xl">
        {/* Mobile layout: stack vertically */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-6">
          {/* Left Side */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            whileHover={{ y: -10 }}
            className="relative flex flex-col items-center text-white bg-gradient-to-b from-[#065F46] to-[#043B2D] rounded-[20px] md:rounded-[30px] p-4 md:p-8 shadow-lg overflow-hidden border border-green-600 w-full lg:flex-1"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
              animate={{ x: [0, 200, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            ></motion.div>
            <Image src={ty3} alt="Sage" width={500} 
  height={550} 
  className="w-60 h-60 md:w-72 md:h-72 transition-transform scale-150 mb-[2rem] duration-300 hover:scale-160 rounded-lg"  />
            <h2 className="text-2xl md:text-4xl font-bold mt-2 md:mt-4 uppercase tracking-wide">Shreeman</h2>
            <p className="text-red-400 text-sm md:text-lg uppercase tracking-widest">India</p>
          </motion.div>
          
          {/* Center Section */}
          <div className="relative flex flex-col items-center bg-gradient-to-b from-[#0E4D3A] to-[#093229] text-white rounded-[20px] md:rounded-[30px] p-4 md:p-10 text-center shadow-xl border border-green-700 w-full lg:mx-4 lg:w-auto">
            <h1 className="text-xl md:text-3xl font-bold">Join The Big Tournament</h1>
            <p className="text-xs md:text-sm mt-2 max-w-sm">Welcome to Airena - The next generation streaming platform for gamers and sports enthusiasts. Join our community and start streaming today.</p>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="mt-4 bg-green-500 text-white px-4 md:px-6 py-1 md:py-2 rounded-full text-base md:text-lg font-bold shadow-md cursor-pointer"
            >
              1 vs 1
            </motion.div>
          </div>
          
          {/* Right Side */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            whileHover={{ y: -10 }}
            className="relative flex flex-col items-center text-white bg-gradient-to-b from-[#065F46] to-[#043B2D] rounded-[20px] md:rounded-[30px] p-4 md:p-8 shadow-lg overflow-hidden border border-green-600 w-full lg:flex-1"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
              animate={{ x: [0, 200, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            ></motion.div>
            <Image src={ty2} alt="Sage" width={500} 
  height={550} 
  className="w-60 h-60 md:w-72 md:h-72 transition-transform scale-150 mb-[2rem] duration-300 hover:scale-160 rounded-lg"  />
            <h2 className="text-2xl md:text-4xl font-bold mt-2 md:mt-4 uppercase tracking-wide">Rahul</h2>
            <p className="text-red-400 text-sm md:text-lg uppercase tracking-widest">India</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}