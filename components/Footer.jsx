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
                    <Grid item xs={12} md textAlign="center" className="flex flex-row items-center !justify-center gap-1 lg:gap-4">
                        <Link href="/CreatorPanel" style={{ color: "inherit", textDecoration: "none" }}>
                            <Typography variant="body2" sx={{
                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >
                                Creator Dashboard
                            </Typography>

                        </Link>{" "}
                        •{" "}
                        <Link href="/CreatorOnboarding" style={{ color: "inherit", textDecoration: "none" }}>
                            <Typography variant="body2" sx={{

                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >
                                Creator Partnership
                            </Typography>

                        </Link>{" "}
                        •{" "}
                        <Link href="/BrandOnboarding" style={{ color: "inherit", textDecoration: "none" }}>
                            <Typography variant="body2" sx={{

                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >
                                Brand Partnership
                            </Typography>

                        </Link>{" "}
                        •{" "}
                        <Link href="/BrandPanel" style={{ color: "inherit", textDecoration: "none" }}>
                            <Typography variant="body2" sx={{

                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >
                                Brand Dashboard
                            </Typography>
                        </Link>
                    </Grid>

                    {/* Social Media Icons */}
                    <Grid item xs={12} md="auto">
                        <Box display="flex" justifyContent={{ xs: "center", md: "flex-end" }} gap={1}>
                            <IconButton href="https://www.linkedin.com/company/105713554/admin/dashboard/" target="_blank" sx={{
                                color: "#46C190",
                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >
                                <LinkedIn />
                            </IconButton>
                            <IconButton href="https://www.instagram.com/airena.app" target="_blank" sx={{
                                color: "#46C190",
                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >
                                <Instagram />
                            </IconButton>
                            <IconButton href="https://www.facebook.com/61572648736754/" target="_blank" sx={{
                                color: "#46C190",
                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >
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
                    <Box display="flex" className="gap-2">
                        <Link href="/TermsAndConditions" className="text-gray-500 no-underline">
                            <Typography variant="body2" sx={{

                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >
                                Terms of Service
                            </Typography>
                        </Link>
                        <Link href="/PrivacyPolicy" className="text-gray-500 no-underline">
                            <Typography variant="body2" sx={{

                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >

                                Privacy Policy
                            </Typography>

                        </Link>
                        <Link href="/about" className="text-gray-500 no-underline">
                            <Typography variant="body2" sx={{

                                "&:hover": { color: "#46C190", backgroundColor: "transparent" },
                                "&:visited": { color: "#46C190" },
                                "&:focus": { color: "#46C190" },
                            }} >

                                About Us
                            </Typography>

                        </Link>
                    </Box>
                </Box>
            </Container>

        </Box>
    );
}
