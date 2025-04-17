"use client";

import Image from "next/image";

import Navbar from "@/components/Nav";
import Hero from "@/components/Hero";
import { Trophy } from 'lucide-react';

import TournamentMatchup from "@/components/Onevone";
import LeaderboardSection from '@/components/home/LeaderboardSection';
import React, { useEffect } from 'react';
import TrendingStreams from "@/components/home/TrendingStreams";
import CategoryPills from '@/components/home/CategoryPills';
import SHero from "@/components/Secondhero";
import VideoSec from "@/components/Videosec";
import VideoSlider from "@/components/VideoSlider";
import Footer from "@/components/Footer"
import { Typography } from "@mui/material";
import { Box, Button, Card, TextField } from "@mui/material";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGamepad,
  FaFootballBall,
  FaVideo,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
export default function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  const router = useRouter()
  return (
    <div className="min-h-screen text-white w-full">
      <SHero />
      <section className="my-12 p-5 flex justify-center">
        <div className="w-full">
          <Typography
            variant="h6"
            className="font-semibold text-white mb-6"
            sx={{ color: "white !important" }}
          >
            Browse Categories
          </Typography>

          <div className="flex flex-col lg:flex-row lg:justify-around gap-4 py-5">
            {/* Gaming Card */}
            <Card
              className="p-6 shadow-lg flex flex-col w-full lg:w-[30%] items-start cursor-pointer transition-all duration-300 shadow-green-400"
              style={{ backgroundColor: "#050505" }}
              onClick={() => router.push("/Categories?Category=Gaming")}
            >
              <FaGamepad className="text-3xl mb-2" style={{ color: "#46C190" }} />
              <Typography
                variant="h6"
                className="font-semibold"
                sx={{ color: "white !important" }}
              >
                Gaming
              </Typography>
              <Typography variant="body2" className="!my-4 text-white">
                290K Viewers
              </Typography>
            </Card>

            {/* Sports Card */}
            <Card
              className="p-6 shadow-lg flex flex-col w-full lg:w-[30%] items-start cursor-pointer transition-all duration-300 shadow-green-400"
              style={{ backgroundColor: "#050505" }}
              onClick={() => router.push("/Categories?Category=Sports")}
            >
              <FaFootballBall className="text-3xl mb-2" style={{ color: "#46C190" }} />
              <Typography
                variant="h6"
                className="font-semibold"
                sx={{ color: "white !important" }}
              >
                Sports
              </Typography>
              <Typography variant="body2" className="!my-4 text-white">
                450K Viewers
              </Typography>
            </Card>
          </div>
        </div>
      </section>


      <div id="categorypills" className=" p-6">
        {/* <CategoryPills /> */}
        {/* <div className="flex items-center  mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Tournament Leaderboard</h2>
          <Trophy className="h-5 w-8 sm:h-6 sm:w-10 text-green-400" />
        </div> */}
        <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between">

          <LeaderboardSection />
          <LeaderboardSection />
        </Box>
        <TrendingStreams />
      </div>

      {/* <footer className="bg-black py-8 border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Airena. All rights reserved. A premium gaming and sports streaming platform.
          </p>
        </div>
      </footer> */}
    </div >
  );
}