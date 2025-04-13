import "./mainstyle.css"
import Navbar from "@/components/Nav";
import Footer from "@/components/Footer";
export const metadata = {
    title: "Airena",
    description: "Where gaming legends rise. Stream, compete, and dominate in the ultimate esports platform.",
};

export default function RootLayout({ children }) {
    return (
        <>
            {children}
        </>
    );
}
