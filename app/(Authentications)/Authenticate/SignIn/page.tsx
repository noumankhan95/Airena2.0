"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
} from "@mui/icons-material";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = toast.loading("Logging In...");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await getDoc(doc(db, "users", userCredential.user.uid));

      toast.update(id, {
        render: "Logged In Successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      router.replace("/user/myAccount");
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const id = toast.loading("Signing in with Google...");
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create new user in Firestore if not exists
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
        });
      }

      toast.update(id, {
        render: "Signed in with Google!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      router.replace("/user/myAccount");
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A1A0E] to-[#07150A]">
      <Container
        maxWidth="xs"
        className="bg-[#0D1F12] p-8 rounded-2xl shadow-lg flex flex-col items-center"
      >
        <Link href="/" className="flex items-center !mb-4">
          <Image src="/logo.png" alt="Airena Logo" width={120} height={40} />
        </Link>

        <Typography variant="h5" fontWeight="bold" className="text-white !mb-6">
          Sign In
        </Typography>

        <form onSubmit={handleSubmit} className="w-full !space-y-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ input: { color: "white" }, label: { color: "white" } }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ input: { color: "white" }, label: { color: "white" } }}
          />
          <Box className="flex items-center justify-center !space-x-2">
            <Button
              disabled={isLoading}
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                color: "black",
                p: 1.7,
                fontSize: "12px",
              }}
            >
              Sign In
            </Button>

            {/* <Typography align="center" color="white" className="my-2">
            OR
          </Typography> */}

            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <Google fontSize={"small"} className="!text-sm !m-0" />
              }
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              sx={{
                color: "black",
                fontSize: "12px",
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </form>
        <Typography variant="body2" color="white" className="!mt-8">
          <Link
            href="/Authenticate/ResetPassword"
            className="text-green-400 hover:underline !my-8"
          >
            Forgot Password?
          </Link>
        </Typography>
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
        <Typography variant="body2" color="white" className="!mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/Authenticate/SignUp"
            className="text-green-400 hover:underline !my-8"
          >
            Sign Up
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default SignIn;
