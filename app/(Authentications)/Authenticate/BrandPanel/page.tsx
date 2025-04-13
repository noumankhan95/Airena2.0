"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  InputAdornment,
} from "@mui/material";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";
import { Email, VisibilityOff, Lock } from "@mui/icons-material";

import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
const Authenticate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const router = useRouter();

  const handleSubmit = async () => {
    const id = toast.loading("Signing In");
    try {
      if (email && password) {
        const user = await signInWithEmailAndPassword(auth, email, password);

        toast.update(id, {
          render: "Signed In Successfully",
          isLoading: false,
          closeButton: true,
          autoClose: 5000,
          type: "success",
        });
      }
      router.replace("/BrandPanel");
    } catch (e: any) {
      console.log("e", e.message);
      toast.update(id, {
        render: e.message,
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
        type: "error",
      });
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A1A0E] to-[#07150A]">
      <Container
        maxWidth="xs"
        className="bg-[#0D1F12] p-8 rounded-2xl shadow-lg flex flex-col items-center"
      >
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Arena Logo" width={120} height={40} />
        </Link>

        <Typography variant="h4" className="text-white font-semibold">
          Welcome Back
        </Typography>
        <Typography variant="body2" className="text-gray-400 !mb-6">
          Sign In to Continue
        </Typography>

        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          className="!mb-4"
          InputProps={{
            className:
              "bg-[#111D14] text-white border border-gray-600 rounded-lg",
            startAdornment: (
              <InputAdornment position="start">
                <Email className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          className="!mb-4"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock className="text-gray-400" />
              </InputAdornment>
            ),
            className:
              "bg-[#111D14] text-white border border-gray-600 rounded-lg",
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" onClick={handleSubmit}>
          Sign In
        </Button>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          By signing in, you agree to our{" "}
          <Link href="/TermsAndConditions" passHref legacyBehavior>
            <Typography
              component="a"
              variant="body2"
              sx={{
                color: "#46C190",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Terms and Conditions
            </Typography>
          </Link>{" "}
          and{" "}
          <Link href="/PrivacyPolicy" passHref legacyBehavior>
            <Typography
              component="a"
              variant="body2"
              sx={{
                color: "#46C190",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Privacy Policy
            </Typography>
          </Link>
          .
        </Typography>
      </Container>
    </Box>
  );
};

export default Authenticate;
