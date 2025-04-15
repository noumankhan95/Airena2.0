"use client";

import { Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/NewsLetterSubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.error || "Subscription failed.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubscribe}
      className="flex flex-col items-center p-4  rounded-lg"
    >
      <h2 className="text-white mb-4">Subscribe to Our Newsletter</h2>
      <TextField
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 rounded-md w-64"
        required
      />
      <Button type="submit" variant="contained" className="!mt-6 !p-2 ">
        {loading ? <CircularProgress size={24} color="inherit" /> : "Subscribe"}
      </Button>
    </form>
  );
}
