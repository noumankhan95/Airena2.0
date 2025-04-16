import "./mainstyle.css"
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
export const metadata = {
    title: "Airena",
    description: "Where gaming legends rise. Stream, compete, and dominate in the ultimate esports platform.",
};

export default function RootLayout({ children }) {
    return (
        <main
            style={{
                background:
                    "linear-gradient(135deg, #0b0b0b 0%, #122c1f 50%, #0b0b0b 100%)",
            }}
        >
            {children}
        </main>
    );
}
