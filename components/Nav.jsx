'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeaderButton from "@/components/HeaderButton/Button";
import { Box, TextField } from "@mui/material";
import { UserIcon } from "lucide-react";
import { Search } from "@mui/icons-material";
import { SearchIcon } from "lucide-react";
import SearchBar from "./SearchBar";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white border-b border-b-green-500/20">
      <div className="container mx-auto px-6 py-1 flex justify-between items-center">
        {/* Logo */}
        <Box className="flex items-center justify-center">
          <Link href="/" className="flex items-center mr-12">
            <Image src="/logo.png" alt="Arena Logo" width={150} height={80} />
          </Link>

          {/* Desktop Menu - Right Aligned */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {[
                // { name: "About", href: "/about" },
                // { name: "Become A Partner", href: "/influencerOnboarding" },
                { name: "Blogs", href: "/blogs" },
                { name: "Streams", href: "/Streams" },

                { name: "Our Products", href: "/Products" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>


          </div>
        </Box>
        <Box className="hidden lg:flex items-center justify-center !space-x-6 relative">
          <SearchBar />
          <HeaderButton />
        </Box>


        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div >

      {/* Mobile Menu */}
      {
        isOpen && (
          <Box className="flex flex-col items-center justify-center lg:hidden bg-black absolute w-full py-4 shadow-lg z-50">
            <ul className="text-center space-y-4">
              <li>
                <div className="flex justify-center">
                  <SearchBar />
                </div>
              </li>
              {[
                { name: "Blogs", href: "/blogs" },
                { name: "Streams", href: "/Streams" },
                { name: "Our Products", href: "/Products" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block text-gray-300 hover:text-white transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <li>
                <div className="flex justify-center">
                  <HeaderButton />
                </div>
              </li>
            </ul>
          </Box>
        )
      }
    </nav >
  );
};

export default Navbar;