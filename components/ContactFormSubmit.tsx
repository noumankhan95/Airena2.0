"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@mui/material";
export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="contained"
      type="submit"
      className="w-full  text-white py-2 rounded-lg text-center transition"
      disabled={pending}
    >
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}
