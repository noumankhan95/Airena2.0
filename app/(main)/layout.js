import "./mainstyle.css"
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from "next/image";
import GamingBackground from "@/components/GamingBackground.tsx"
export const metadata = {
    title: "Airena",
    description: "Where gaming legends rise. Stream, compete, and dominate in the ultimate esports platform.",
};

export default function RootLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="relative min-h-screen">
                <GamingBackground />
                {children}
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
