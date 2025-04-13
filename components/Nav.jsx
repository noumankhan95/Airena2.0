'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeaderButton from "@/components/HeaderButton/Button";
import { Box } from "@mui/material";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white border-b border-b-green-500/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Arena Logo" width={120} height={40} />
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

          {/* Sign In Button */}
          <HeaderButton />
        </div>

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
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <Box className="lg:hidden bg-black absolute w-full py-4 shadow-lg z-50">
          <ul className="text-center space-y-4">
            {[
              { name: "About", href: "/about" },
              // { name: "Become A Partner", href: "/becomePartnered" },
              { name: "Blogs", href: "/blogs" },
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
              <HeaderButton />
            </li>
          </ul>
        </Box>
      )}
    </nav>
  );
};

export default Navbar;