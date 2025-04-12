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
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Email,
  Visibility,
  VisibilityOff,
  Lock,
  Google,
} from "@mui/icons-material";
import Image from "next/image";

const SignUp = () => {
  const [confirmPw, setConfirmPw] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // You were using "name" in Firestore but it was missing in state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmPw !== password) {
      return toast.error("Passwords do not match!");
    }

    const id = toast.loading("Creating Account...");
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
      });

      toast.update(id, {
        render: "Account Created Successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      router.replace("/user/myAccount");
    } catch (error: any) {
      console.error("Sign Up Error:", error);
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

  const handleGoogleSignUp = async () => {
    const id = toast.loading("Signing up with Google...");
    const provider = new GoogleAuthProvider();
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Only create user document if not already exists
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
        });
      }

      toast.update(id, {
        render: "Signed up successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      router.replace("/user/myAccount");
    } catch (error: any) {
      console.error("Google Sign Up Error:", error);
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

  return (
    <Box className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0A1A0E] to-[#07150A] p-4">
      {/* Navigation */}
      {/* <Box className="absolute top-4 right-8 flex space-x-6">
        <Link href="/" className="text-gray-400 hover:text-white">
          Home
        </Link>
        <Link href="/user/SignIn" className="text-gray-400 hover:text-white">
          Sign In
        </Link>
      </Box> */}

      <Container
        maxWidth="xs"
        className="bg-[#0D1F12] p-8 rounded-2xl shadow-lg flex flex-col items-center"
      >
        <Link href="/" className="flex items-center !mb-6">
          <Image src="/logo.png" alt="Arena Logo" width={120} height={40} />
        </Link>

        <Typography variant="h5" className="text-white !mb-4">
          Create an Account
        </Typography>

        <form onSubmit={handleSubmit} className="w-full !space-y-4">
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
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
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box className="flex items-center justify-center !space-x-2">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                color: "black",
                p: 1.68,
                fontSize: "12px",
              }}
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </Button>

            {/* Google Sign Up Button */}
            <Button
              onClick={handleGoogleSignUp}
              fullWidth
              variant="outlined"
              disabled={isLoading}
              startIcon={
                <Google fontSize={"small"} className="!text-sm !m-0" />
              }
              sx={{
                color: "black",
                fontSize: "12px",
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </form>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          By signing up, you agree to our{" "}
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

        <Typography variant="body2" className="text-gray-400 !mt-4">
          Already have an account?
          <Link
            href="/user/SignIn"
            className="text-green-400 hover:underline ml-1"
          >
            Sign In
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default SignUp;
