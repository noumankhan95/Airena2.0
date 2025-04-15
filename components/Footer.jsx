import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import { Twitter, Instagram, YouTube } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { FaTwitch, FaDiscord, FaGamepad } from "react-icons/fa";
import NewsletterForm from "./NewsLetter";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#020202",
                color: "white",
                py: 0.4,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
        >

            <Container maxWidth="lg">
                <Grid container spacing={1} alignItems="center">
                    {/* Left Section */}
                    <Grid item xs={12} md={4}>
                        <Link href="/" className="flex items-center">
                            <Image src="/logo.png" alt="Arena Logo" width={120} height={40} />
                        </Link>
                        {/* <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            Your Ultimate Streaming Platform
                        </Typography> */}
                    </Grid>

                    {/* Middle Section - Links */}
                    <Grid item xs={12} md={4} textAlign="center">
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            <Link href="/CreatorPanel" style={{ color: "inherit", textDecoration: "none" }}>
                                Creator Dashboard
                            </Link>{" "}
                            •{" "}
                            <Link href="/BrandOnboarding" style={{ color: "inherit", textDecoration: "none" }}>
                                Brand Partnership
                            </Link>
                            •{"    "}
                            <Link href="/BrandPanel" style={{ color: "inherit", textDecoration: "none" }}>
                                Brand Dashboard
                            </Link>

                        </Typography>
                    </Grid>

                    {/* Right Section */}
                    <Grid item xs={12} md={4} textAlign="right">
                        <NewsletterForm />

                    </Grid>
                </Grid>

                {/* Divider Line */}
                <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", my: 1 }} />
                {/* Social Icons */}
                {/* <Box display="flex" justifyContent="center" gap={2} mb={3}>
                    <IconButton href="#" sx={{ color: "#57F287" }}>
                        <Twitter />
                    </IconButton>
                    <IconButton href="#" sx={{ color: "#57F287" }}>
                        <Instagram />
                    </IconButton>
                    <IconButton href="#" sx={{ color: "#57F287" }}>
                        <FaTwitch size={24} />
                    </IconButton>
                    <IconButton href="#" sx={{ color: "#57F287" }}>
                        <YouTube />
                    </IconButton>
                    <IconButton href="#" sx={{ color: "#57F287" }}>
                        <FaGamepad size={24} />
                    </IconButton>
                    <IconButton href="#" sx={{ color: "#57F287" }}>
                        <FaDiscord size={24} />
                    </IconButton>
                </Box> */}


                {/* Bottom Section */}
                <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        © {new Date().getFullYear()} Airena. All rights reserved.
                    </Typography>
                    <Box>
                        <Link href="/TermsAndConditions" className="text-gray-500 visited:text-gray-500 no-underline">
                            Terms of Service
                        </Link>{" "}
                        •{" "}
                        <Link href="/PrivacyPolicy" className="text-gray-500 visited:text-gray-500 no-underline">
                            Privacy Policy
                        </Link>{" "}
                        •{" "}
                        <Link href="/about" className="text-gray-500 visited:text-gray-500 no-underline">
                            About Us
                        </Link>

                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
