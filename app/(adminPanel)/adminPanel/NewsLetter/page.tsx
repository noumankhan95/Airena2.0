"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

export default function NewsletterAdminPage() {
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const sendNewsletter = async () => {
    if (!subject || !html) {
      toast.error("Please enter both subject and content.");
      return;
    }

    setLoading(true); // Set loading state to true when sending the newsletter

    try {
      const res = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Newsletter sent successfully!");
        setSubject("");
        setHtml("");
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch (err) {
      toast.error("Failed to send newsletter.");
    } finally {
      setLoading(false); // Set loading state back to false after the request is complete
    }
  };

  return (
    <Container maxWidth="md" className="py-10" style={{ background: "none" }}>
      <Paper elevation={3} className="p-6 bg-gray-900 text-white !space-y-2">
        <Typography variant="h5" gutterBottom>
          Send Newsletter
        </Typography>

        <TextField
          label="Subject"
          variant="outlined"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="my-4"
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <TextField
          label="HTML Content"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="mb-4"
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={sendNewsletter}
            disabled={loading} // Disable the button when loading is true
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Newsletter"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
