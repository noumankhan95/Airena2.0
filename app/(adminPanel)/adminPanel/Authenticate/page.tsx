"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Container,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Link from "next/link";

import MuiAlert from "@mui/material/Alert";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref } from "firebase/storage";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { Email, VisibilityOff, Lock } from "@mui/icons-material";
import Image from "next/image";
const Authenticate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const router = useRouter();
  // Form submit handler

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   setisloading(true);
  //   try {
  //     const token = await auth?.currentUser?.getIdToken();

  //     const res = await fetch("/api/createAdmin", {
  //       body: JSON.stringify({ email: adminCredentials.email, isAdmin: true }),
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // Include token in Authorization header
  //       },
  //     });
  //     if (!res.ok) throw await res.json();
  //     const body = await res.json();

  //     toast.success(body.message);
  //   } catch (e: any) {
  //     console.log("Error", e);
  //     toast.error(e.message);
  //   } finally {
  //     setisloading(false);
  //   }
  // };

  const handleSubmit = async () => {
    const id = toast.loading("Signing In");
    try {
      if (email && password) {
        // Simulate account creation
        const user = await signInWithEmailAndPassword(auth, email, password);

        toast.update(id, {
          render: "Signed In Successfully",
          isLoading: false,
          closeButton: true,
          autoClose: 5000,
          type: "success",
        });
        // router.back();
        router.replace("/adminPanel");
      }
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

    // setOpenSnackbar(true);
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
      </Container>
    </Box>
  );
};

export default Authenticate;
