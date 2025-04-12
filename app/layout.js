import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/Providers/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Airena",
  description: "Where gaming legends rise. Stream, compete, and dominate in the ultimate esports platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  );
}
