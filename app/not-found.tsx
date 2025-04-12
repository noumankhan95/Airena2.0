"use client";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6">
      {/* Animated Warning Icon */}
      <motion.div
        initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-4"
      >
        <AlertTriangle className="text-yellow-400 w-20 h-20" />
      </motion.div>

      {/* Heading */}
      <h1 className="text-6xl font-bold text-indigo-500">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Oops! Page Not Found</h2>
      <p className="mt-2 text-gray-400 text-center max-w-md">
        The page you're looking for doesn't exist. It might have been moved or
        deleted.
      </p>

      {/* Home Button */}
      <Link
        href="/"
        className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700"
      >
        🔙 Go Home
      </Link>
    </div>
  );
}
