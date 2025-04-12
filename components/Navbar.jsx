import Link from "next/link";
import React from "react";
import HeaderButton from "@/components/HeaderButton/Button"
export default function Navbar() {
    return (
        <nav className="w-full max-w-screen-xl flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-8">
                {/* Logo */}
                <Link href={'/'} className="flex items-center">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                    <span className="ml-2 text-xl font-bold capitalize text-white">Airena</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex space-x-6">
                    <Link href="/about" className="text-gray-300 hover:text-amber-500 transition-colors">
                        About
                    </Link>
                    <Link href="/influencerOnboarding" className="text-gray-300 hover:text-amber-500 transition-colors">
                        Become A Partner
                    </Link>
                    <Link href="/blogs" className="text-gray-300 hover:text-amber-500 transition-colors">
                        Blogs
                    </Link>
                    <Link href="/Streams" className="text-gray-300 hover:text-amber-500 transition-colors">
                        Streams
                    </Link>
                    <Link href="/Products" className="text-gray-300 hover:text-amber-500 transition-colors">
                        Our Products
                    </Link>
                    <Link href="/contact" className="text-gray-300 hover:text-amber-500 transition-colors">
                        Contact
                    </Link>
                </div>
            </div>

            {/* Login Button */}
            <HeaderButton />

        </nav>
    )
}