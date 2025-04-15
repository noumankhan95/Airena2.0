// pages/ResetPassword.tsx
"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Card,
} from "@mui/material";
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center">
      <Card elevation={6} sx={{ p: 4, mt: 10, borderRadius: 3 }}>
        <Typography variant="h2" fontWeight={600} mb={3} textAlign="center">
          Reset Your Password
        </Typography>

        <form onSubmit={handlePasswordReset}>
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

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              color: "black",
              p: 1.7,
              fontSize: "18px",
              my: 2,
            }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default ResetPassword;
