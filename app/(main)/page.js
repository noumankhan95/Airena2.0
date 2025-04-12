// import Link from "next/link";


// export default function Home() {
//   return (
//     <>

//         <div className="container mx-auto px-6 py-20">
//           <div className="flex flex-col md:flex-row items-center justify-between">
//             {/* Left Content */}
//             <div className="md:w-1/2 mb-10 md:mb-0">
//               <h1 className="text-5xl md:text-6xl font-bold capitalize text-white mb-4">
//                 Airena
//                 <span className="text-amber-500">.</span>
//               </h1>
//               <p className="text-xl text-gray-400 mb-8 max-w-lg">
//                 Where gaming legends rise. Stream, compete, and dominate in the ultimate esports platform.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link href="/watch" className="px-8 py-3 border-2 border-amber-500 text-amber-500 rounded-lg font-medium hover:bg-amber-500/10 transition-colors">
//                   Watch Live
//                 </Link>
//               </div>
//             </div>

//             {/* Right Content - Gaming Illustration */}
//             <div className="md:w-1/2 flex justify-center">
//               <div className="relative w-full max-w-lg aspect-square">
//                 <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl"></div>
//                 <div className="relative bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-amber-500/20">
//                   <svg viewBox="0 0 24 24" className="w-full h-full text-amber-500">
//                     <path
//                       fill="currentColor"
//                       d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 10H4c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1z"
//                     />
//                     <path
//                       fill="currentColor"
//                       d="M6 12h2v2H6zm3.5 0h2v2h-2zm3.5 0h2v2h-2z"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//     </>
//   );
// }

"use client";

import Image from "next/image";

import Navbar from "@/components/Nav";
import Hero from "@/components/Hero";

import TournamentMatchup from "@/components/Onevone";

import React, { useEffect } from 'react';

import CategoryPills from '@/components/home/CategoryPills';
import FoundersClub from '@/components/home/FoundersClub';
import LeaderboardSection from '@/components/home/LeaderboardSection';

import EventsSection from '@/components/home/EventsSection';
import SHero from "@/components/Secondhero";
import VideoSec from "@/components/Videosec";

import VideoSlider from "@/components/VideoSlider";
import Footer from "@/components/Footer"
export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* <Navbar /> */}

      <main>
        <Hero />
        {/* <HeroSection /> */}

        <SHero />

        <div id="categorypills" className="bg-black p-6">
          <CategoryPills />

          {/* <div className="max-w-6xl mx-auto px-4 py-8">
            <TournamentCard />
          </div> */}
          <VideoSec />

          <TournamentMatchup />



          <FoundersClub />

          <LeaderboardSection />

          {/* <VideoSlider /> */}

          {/* <VideoSection withPagination={true} /> */}

          <EventsSection />
        </div>
      </main>

      {/* <footer className="bg-black py-8 border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Airena. All rights reserved. A premium gaming and sports streaming platform.
          </p>
        </div>
      </footer> */}
    </div>
  );
}