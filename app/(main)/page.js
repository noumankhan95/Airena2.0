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
        <div className="w-full ">
          <Typography variant="h6" className="font-semibold text-white mb-6" sx={{ color: "white !important" }}>
            Browse Categories
          </Typography>

          <div className="flex justify-around py-5" >
            {/* Gaming Card */}
            <Card
              className="p-6 shadow-lg flex flex-col items-start cursor-pointer transform transition-all duration-300 shadow-green-400"
              style={{ backgroundColor: "#050505", width: '25%', height: "40%" }}
              onClick={() => { router.push("/Categories") }}
            >
              <FaGamepad
                className="text-indigo-300 text-3xl mb-2"
                style={{ color: "#46C190" }}
              />
              <Typography variant="h6" className="font-semibold" sx={{ color: "white !important" }}>
                Gaming
              </Typography>
              <Typography variant="body2" className="!my-4">
                290K Viewers
              </Typography>
            </Card>

            {/* Sports Card */}
            <Card
              className="p-6 shadow-lg flex flex-col items-start cursor-pointer transform transition-all duration-300 shadow-green-400"
              style={{ backgroundColor: "#050505", width: '25%', height: "40%" }}
              onClick={() => { router.push("/Categories") }}
            >
              <FaFootballBall
                className="text-indigo-300 text-3xl mb-2"
                style={{ color: "#46C190" }}
              />
              <Typography variant="h6" className="font-semibold" sx={{ color: "white !important" }}>
                Sports
              </Typography>
              <Typography variant="body2" className="!my-4">
                450K Viewers
              </Typography>
            </Card>
          </div>
        </div>
      </section>

      <div id="categorypills" className=" p-6">
        <CategoryPills />
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