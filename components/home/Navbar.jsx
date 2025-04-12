"use client"
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 py-3',
        scrolled 
          ? 'bg-black bg-opacity-90 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-xl font-bold text-white mr-8 tracking-tight">
            <span className="text-arena-green">A</span>RENA
          </a>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm text-white hover:text-arena-green transition-colors">Browse</a>
            <a href="#" className="text-sm text-white hover:text-arena-green transition-colors">Categories</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="#" 
            className="text-sm font-medium px-4 py-1 rounded-md border border-gray-700 text-white hover:border-arena-green transition-all"
          >
            Sign In
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;