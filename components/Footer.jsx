import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import { Twitter, Instagram, YouTube, LinkedIn, Facebook } from "@mui/icons-material";
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
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ flexWrap: { xs: "wrap", md: "nowrap" }, py: 0.2 }}
                >
                    {/* Logo Section */}
                    <Grid item xs={12} md="auto">
                        <Link href="/" className="flex items-center">
                            <Image src="/logo.png" alt="Arena Logo" width={180} height={80} />
                        </Link>
                    </Grid>

                    {/* Middle Navigation Links */}
                    <Grid item xs={12} md textAlign="center">
                        <Typography variant="body2">
                            <Link href="/CreatorPanel" style={{ color: "inherit", textDecoration: "none" }}>
                                Creator Dashboard
                            </Link>{" "}
                            •{" "}
                            <Link href="/CreatorOnboarding" style={{ color: "inherit", textDecoration: "none" }}>
                                Creator Partnership
                            </Link>{" "}
                            •{" "}
                            <Link href="/BrandOnboarding" style={{ color: "inherit", textDecoration: "none" }}>
                                Brand Partnership
                            </Link>{" "}
                            •{" "}
                            <Link href="/BrandPanel" style={{ color: "inherit", textDecoration: "none" }}>
                                Brand Dashboard
                            </Link>
                        </Typography>
                    </Grid>

                    {/* Social Media Icons */}
                    <Grid item xs={12} md="auto">
                        <Box display="flex" justifyContent={{ xs: "center", md: "flex-end" }} gap={1}>
                            <IconButton href="https://www.linkedin.com/company/105713554/admin/dashboard/" target="_blank" sx={{ color: "#46C190" }}>
                                <LinkedIn />
                            </IconButton>
                            <IconButton href="https://www.instagram.com/airena.app" target="_blank" sx={{ color: "#46C190" }}>
                                <Instagram />
                            </IconButton>
                            <IconButton href="https://www.facebook.com/61572648736754/" target="_blank" sx={{ color: "#46C190" }}>
                                <Facebook />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                {/* Divider Line */}
                <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", my: 0.4 }} />

                {/* Bottom Info Section */}
                <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mt: 0.2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        © {new Date().getFullYear()} Airena. All rights reserved.
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Link href="/TermsAndConditions" className="text-gray-500 no-underline">
                            Terms of Service
                        </Link>
                        <Link href="/PrivacyPolicy" className="text-gray-500 no-underline">
                            Privacy Policy
                        </Link>
                        <Link href="/about" className="text-gray-500 no-underline">
                            About Us
                        </Link>
                    </Box>
                </Box>
            </Container>

        </Box>
    );
}
